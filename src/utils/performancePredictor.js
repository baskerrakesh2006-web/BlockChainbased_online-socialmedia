/**
 * Performance Predictor
 * 
 * Predicts student performance trends using rule-based analysis.
 * Analyzes historical data to identify patterns and forecast future performance.
 * Fully explainable - NO machine learning.
 */

import { assessmentsData } from '../data/assessmentsData.jsx';
import { activityData } from '../data/activityData.jsx';

/**
 * Calculate performance trend from assessment history
 * @param {number} studentId - Student ID
 * @returns {string} Trend: "improving", "declining", or "stable"
 */
const calculateTrend = (studentId) => {
    // Get student's assessments sorted by date
    const studentAssessments = assessmentsData
        .filter(a => a.studentId === studentId)
        .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));

    if (studentAssessments.length < 2) {
        return "stable"; // Not enough data
    }

    // Calculate average of first half vs second half
    const midpoint = Math.floor(studentAssessments.length / 2);
    const firstHalf = studentAssessments.slice(0, midpoint);
    const secondHalf = studentAssessments.slice(midpoint);

    const firstAvg = firstHalf.reduce((sum, a) => sum + (a.score / a.maxScore) * 100, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, a) => sum + (a.score / a.maxScore) * 100, 0) / secondHalf.length;

    const difference = secondAvg - firstAvg;

    // Threshold: 5% change is significant
    if (difference > 5) return "improving";
    if (difference < -5) return "declining";
    return "stable";
};

/**
 * Calculate activity consistency score
 * @param {number} studentId - Student ID
 * @returns {number} Consistency score (0-100)
 */
const calculateActivityConsistency = (studentId) => {
    const studentActivities = activityData
        .filter(a => a.studentId === studentId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (studentActivities.length < 2) {
        return 50; // Neutral score for insufficient data
    }

    // Calculate gaps between activities
    const gaps = [];
    for (let i = 0; i < studentActivities.length - 1; i++) {
        const date1 = new Date(studentActivities[i].date);
        const date2 = new Date(studentActivities[i + 1].date);
        const daysDiff = Math.abs((date1 - date2) / (1000 * 60 * 60 * 24));
        gaps.push(daysDiff);
    }

    // Average gap (lower is better)
    const avgGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;

    // Convert to score: 1 day gap = 100, 7+ days = 0
    if (avgGap <= 1) return 100;
    if (avgGap >= 7) return 0;
    return ((7 - avgGap) / 6) * 100;
};

/**
 * Predict future performance
 * @param {Object} student - Student data object
 * @param {number} pulseScore - Current Learning Pulse Score
 * @returns {Object} Prediction with confidence and explanation
 */
export const predictPerformance = (student, pulseScore) => {
    const trend = calculateTrend(student.id);
    const activityConsistency = calculateActivityConsistency(student.id);

    let prediction = "stable";
    let confidence = 0;
    const factors = [];

    // Determine prediction based on multiple factors
    if (trend === "improving" && pulseScore > 60) {
        prediction = "likely-to-improve";
        confidence = 75;
        factors.push("Positive performance trend");
        factors.push("Good current pulse score");
    } else if (trend === "declining" || pulseScore < 50) {
        prediction = "high-risk-decline";
        confidence = 80;
        if (trend === "declining") factors.push("Declining performance trend");
        if (pulseScore < 50) factors.push("Low pulse score");
    } else if (pulseScore >= 50 && pulseScore < 70) {
        prediction = "needs-attention";
        confidence = 70;
        factors.push("Moderate pulse score");
    } else {
        prediction = "likely-to-improve";
        confidence = 65;
        factors.push("Stable performance");
    }

    // Adjust confidence based on activity consistency
    if (activityConsistency > 70) {
        confidence += 10;
        factors.push("Consistent activity pattern");
    } else if (activityConsistency < 30) {
        confidence -= 10;
        factors.push("Inconsistent activity pattern");
    }

    // Adjust based on inactivity
    if (student.inactivityDays > 7) {
        if (prediction === "likely-to-improve") {
            prediction = "needs-attention";
        }
        confidence -= 15;
        factors.push("Recent inactivity");
    }

    // Cap confidence at 95% (never 100% certain)
    confidence = Math.min(95, Math.max(40, confidence));

    return {
        prediction,
        confidence,
        trend,
        factors,
        recommendations: getRecommendations(prediction, student),
    };
};

/**
 * Get recommendations based on prediction
 * @param {string} prediction - Prediction category
 * @param {Object} student - Student data
 * @returns {Array} List of recommendations
 */
const getRecommendations = (prediction, student) => {
    const recommendations = [];

    if (prediction === "high-risk-decline") {
        recommendations.push("Urgent: Schedule intervention meeting");
        recommendations.push("Provide personalized learning support");
        recommendations.push("Review and adjust learning path difficulty");
        if (student.rewatchCount > 8) {
            recommendations.push("Content may be too difficult - consider prerequisite review");
        }
    } else if (prediction === "needs-attention") {
        recommendations.push("Monitor progress weekly");
        recommendations.push("Encourage regular study sessions");
        if (student.quizScore < 70) {
            recommendations.push("Provide additional practice quizzes");
        }
        if (student.studyHours < 15) {
            recommendations.push("Suggest increasing study time");
        }
    } else {
        recommendations.push("Continue current learning approach");
        recommendations.push("Consider advanced topics or projects");
        if (student.quizScore > 90) {
            recommendations.push("Excellent performance - offer enrichment opportunities");
        }
    }

    return recommendations;
};

/**
 * Get prediction label for display
 * @param {string} prediction - Prediction category
 * @returns {string} Display label
 */
export const getPredictionLabel = (prediction) => {
    const labels = {
        "likely-to-improve": "Likely to Improve",
        "needs-attention": "Needs Attention",
        "high-risk-decline": "High Risk of Decline",
        "stable": "Stable Performance",
    };
    return labels[prediction] || "Unknown";
};

/**
 * Get prediction color for UI
 * @param {string} prediction - Prediction category
 * @returns {string} CSS color value
 */
export const getPredictionColor = (prediction) => {
    const colors = {
        "likely-to-improve": "#10b981",
        "needs-attention": "#f59e0b",
        "high-risk-decline": "#ef4444",
        "stable": "#6366f1",
    };
    return colors[prediction] || "#6b7280";
};
