/**
 * Grading Engine
 * 
 * Automated grading system with rule-based letter grade assignment.
 * Calculates grades and performance trends from assessment data.
 * Fully explainable - NO machine learning.
 */

import { assessmentsData } from '../data/assessmentsData.jsx';

/**
 * Convert numeric score to letter grade
 * @param {number} percentage - Score percentage (0-100)
 * @returns {string} Letter grade (A, B, C, D, F)
 */
export const getLetterGrade = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
};

/**
 * Calculate overall grade for a student
 * @param {number} studentId - Student ID
 * @param {Object} studentOverride - Optional student object with real-time metrics (for sliders)
 * @returns {Object} Grade information with breakdown
 */
export const calculateOverallGrade = (studentId, studentOverride = null) => {
    const studentAssessments = assessmentsData.filter(a => a.studentId === studentId);

    // If we have an override (slider values), we simulate the grade based on that
    if (studentOverride) {
        // Calculate historical midterm average (if any)
        const midterms = studentAssessments.filter(a => a.assessmentType === 'midterm');
        const midtermSum = midterms.reduce((acc, curr) => acc + (curr.score / curr.maxScore) * 100, 0);
        const midtermAvg = midterms.length > 0 ? midtermSum / midterms.length : studentOverride.quizScore; // Fallback to quiz score if no midterms

        // Use the slider value as the "Quizzes" average
        const quizAvg = studentOverride.quizScore;

        // Weighted Average: Midterms (2x), Quizzes (1x)
        // If no midterms exist in history, we trust the slider completely
        const overallPercentage = midterms.length > 0
            ? ((midtermAvg * 2) + quizAvg) / 3
            : quizAvg;

        return {
            letterGrade: getLetterGrade(overallPercentage),
            percentage: Math.round(overallPercentage * 10) / 10,
            assessmentCount: studentAssessments.length, // Keep historical count
            breakdown: {
                quizzes: [{ // Simulated "Current Average" entry
                    id: 'current-simulated',
                    score: quizAvg,
                    maxScore: 100,
                    percentage: quizAvg,
                    date: new Date().toISOString()
                }],
                midterms: midterms.map(m => ({
                    id: m.id,
                    score: m.score,
                    maxScore: m.maxScore,
                    percentage: (m.score / m.maxScore) * 100,
                    date: m.submittedAt
                }))
            }
        };
    }

    // Default static calculation (Logic unchanged if no override)
    if (studentAssessments.length === 0) {
        return {
            letterGrade: 'N/A',
            percentage: 0,
            assessmentCount: 0,
            breakdown: {},
        };
    }

    let totalWeightedScore = 0;
    let totalWeight = 0;
    const breakdown = {
        quizzes: [],
        midterms: [],
    };

    studentAssessments.forEach(assessment => {
        const percentage = (assessment.score / assessment.maxScore) * 100;
        const weight = assessment.assessmentType === 'midterm' ? 2 : 1;

        totalWeightedScore += percentage * weight;
        totalWeight += weight;

        if (assessment.assessmentType === 'quiz') {
            breakdown.quizzes.push({
                id: assessment.id,
                score: assessment.score,
                maxScore: assessment.maxScore,
                percentage,
                date: assessment.submittedAt,
            });
        } else {
            breakdown.midterms.push({
                id: assessment.id,
                score: assessment.score,
                maxScore: assessment.maxScore,
                percentage,
                date: assessment.submittedAt,
            });
        }
    });

    const overallPercentage = totalWeightedScore / totalWeight;

    return {
        letterGrade: getLetterGrade(overallPercentage),
        percentage: Math.round(overallPercentage * 10) / 10,
        assessmentCount: studentAssessments.length,
        breakdown,
    };
};

/**
 * Calculate performance trend from grades
 * @param {number} studentId - Student ID
 * @returns {Object} Trend information
 */
export const calculateGradeTrend = (studentId) => {
    // Trend logic stays same based on historical data vs current implied state
    // For simplicity, we keep checking history. 
    // Ideally, we could compare 'current slider' vs 'last historical'.
    // Let's leave as is for now unless requested.

    const studentAssessments = assessmentsData
        .filter(a => a.studentId === studentId)
        .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));

    if (studentAssessments.length < 2) {
        return {
            trend: 'stable',
            change: 0,
            message: 'Insufficient data for trend analysis',
        };
    }

    // Compare recent assessments to earlier ones
    const recentCount = Math.max(2, Math.floor(studentAssessments.length / 3));
    const recent = studentAssessments.slice(-recentCount);
    const earlier = studentAssessments.slice(0, recentCount);

    const recentAvg = recent.reduce((sum, a) => sum + (a.score / a.maxScore) * 100, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, a) => sum + (a.score / a.maxScore) * 100, 0) / earlier.length;

    const change = recentAvg - earlierAvg;

    let trend = 'stable';
    let message = 'Performance is consistent';

    if (change > 5) {
        trend = 'improving';
        message = `Performance improving by ${Math.round(change)}%`;
    } else if (change < -5) {
        trend = 'declining';
        message = `Performance declining by ${Math.round(Math.abs(change))}%`;
    }

    return {
        trend,
        change: Math.round(change * 10) / 10,
        message,
        recentAverage: Math.round(recentAvg * 10) / 10,
        earlierAverage: Math.round(earlierAvg * 10) / 10,
    };
};

/**
 * Get grade color for UI display
 * @param {string} letterGrade - Letter grade
 * @returns {string} CSS color value
 */
export const getGradeColor = (letterGrade) => {
    const colors = {
        'A': '#10b981',
        'B': '#3b82f6',
        'C': '#f59e0b',
        'D': '#ef4444',
        'F': '#991b1b',
        'N/A': '#6b7280',
    };
    return colors[letterGrade] || colors['N/A'];
};
