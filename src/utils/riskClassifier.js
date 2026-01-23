/**
 * Risk Classifier
 * 
 * Classifies students into risk categories based on Learning Pulse Score and other factors.
 * Fully rule-based and explainable - NO machine learning.
 * 
 * Risk Levels:
 * - Stable: Pulse > 70 AND inactivity < 3 days
 * - Warning: Pulse 50-70 OR inactivity 3-7 days
 * - At-Risk: Pulse < 50 OR inactivity > 7 days
 */

/**
 * Classify student risk level
 * @param {number} pulseScore - Learning Pulse Score (0-100)
 * @param {number} inactivityDays - Days since last activity
 * @param {Object} settings - Optional teacher settings for thresholds
 * @returns {string} Risk level: "stable", "warning", or "at-risk"
 */
export const classifyRisk = (pulseScore, inactivityDays, settings = {}) => {
    // Thresholds can be adjusted by teachers
    const thresholds = {
        stablePulse: settings.stablePulseThreshold || 70,
        warningPulse: settings.warningPulseThreshold || 50,
        stableInactivity: settings.stableInactivityThreshold || 3,
        warningInactivity: settings.warningInactivityThreshold || 7,
    };

    // At-Risk: Critical conditions
    if (pulseScore < thresholds.warningPulse || inactivityDays > thresholds.warningInactivity) {
        return "at-risk";
    }

    // Warning: Moderate concerns
    if (
        (pulseScore >= thresholds.warningPulse && pulseScore < thresholds.stablePulse) ||
        (inactivityDays >= thresholds.stableInactivity && inactivityDays <= thresholds.warningInactivity)
    ) {
        return "warning";
    }

    // Stable: Performing well
    return "stable";
};

/**
 * Get risk level with detailed explanation
 * @param {number} pulseScore - Learning Pulse Score
 * @param {number} inactivityDays - Days since last activity
 * @param {Object} student - Full student object for context
 * @param {Object} settings - Optional teacher settings
 * @returns {Object} Risk classification with explanation
 */
export const getRiskAssessment = (pulseScore, inactivityDays, student, settings = {}) => {
    const riskLevel = classifyRisk(pulseScore, inactivityDays, settings);

    const assessment = {
        level: riskLevel,
        pulseScore,
        inactivityDays,
        factors: [],
        recommendations: [],
    };

    // Identify contributing factors
    if (pulseScore < 50) {
        assessment.factors.push("Low Learning Pulse Score");
    } else if (pulseScore < 70) {
        assessment.factors.push("Moderate Learning Pulse Score");
    }

    if (inactivityDays > 7) {
        assessment.factors.push("Extended period of inactivity");
    } else if (inactivityDays >= 3) {
        assessment.factors.push("Recent inactivity");
    }

    if (student.quizScore < 60) {
        assessment.factors.push("Low quiz performance");
    }

    if (student.rewatchCount > 8) {
        assessment.factors.push("High content rewatch rate");
    }

    if (student.studyHours < 10) {
        assessment.factors.push("Low study time");
    }

    const completionRate = (student.completedModules / student.totalModules) * 100;
    if (completionRate < 40) {
        assessment.factors.push("Low module completion rate");
    }

    // Generate recommendations based on risk level
    if (riskLevel === "at-risk") {
        assessment.recommendations.push("Immediate intervention recommended");
        assessment.recommendations.push("Schedule one-on-one meeting");
        assessment.recommendations.push("Review learning materials and provide additional support");
        if (inactivityDays > 7) {
            assessment.recommendations.push("Re-engage student with personalized outreach");
        }
    } else if (riskLevel === "warning") {
        assessment.recommendations.push("Monitor progress closely");
        assessment.recommendations.push("Encourage consistent study habits");
        if (student.quizScore < 70) {
            assessment.recommendations.push("Provide additional practice materials");
        }
    } else {
        assessment.recommendations.push("Maintain current learning pace");
        assessment.recommendations.push("Consider advanced or enrichment content");
    }

    return assessment;
};

/**
 * Get risk level color for UI display
 * @param {string} riskLevel - Risk level string
 * @returns {string} CSS color value
 */
export const getRiskColor = (riskLevel) => {
    const colors = {
        stable: "#10b981", // Green
        warning: "#f59e0b", // Amber
        "at-risk": "#ef4444", // Red
    };
    return colors[riskLevel] || colors.stable;
};

/**
 * Get risk level label for display
 * @param {string} riskLevel - Risk level string
 * @returns {string} Display label
 */
export const getRiskLabel = (riskLevel) => {
    const labels = {
        stable: "Stable",
        warning: "Warning",
        "at-risk": "At-Risk",
    };
    return labels[riskLevel] || "Unknown";
};
