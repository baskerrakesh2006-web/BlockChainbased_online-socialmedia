/**
 * Learning Pulse Calculator
 * 
 * Calculates a comprehensive Learning Pulse Score (0-100) based on weighted metrics.
 * This is a fully explainable, rule-based scoring system with NO machine learning.
 * 
 * Weights:
 * - Study Hours: 25%
 * - Quiz Performance: 30%
 * - Activity Consistency: 20%
 * - Engagement Metrics: 25%
 */

/**
 * Normalize a value to 0-100 scale
 * @param {number} value - Current value
 * @param {number} min - Minimum expected value
 * @param {number} max - Maximum expected value
 * @returns {number} Normalized score (0-100)
 */
const normalize = (value, min, max) => {
    if (value <= min) return 0;
    if (value >= max) return 100;
    return ((value - min) / (max - min)) * 100;
};

/**
 * Calculate study hours score (25% weight)
 * Expected range: 0-40 hours per week
 */
const calculateStudyHoursScore = (studyHours) => {
    return normalize(studyHours, 0, 40);
};

/**
 * Calculate quiz performance score (30% weight)
 * Direct percentage score
 */
const calculateQuizScore = (quizScore) => {
    return Math.max(0, Math.min(100, quizScore));
};

/**
 * Calculate activity consistency score (20% weight)
 * Based on inactivity days (inverse relationship)
 * 0 days = 100, 14+ days = 0
 */
const calculateActivityScore = (inactivityDays) => {
    return normalize(14 - inactivityDays, 0, 14);
};

/**
 * Calculate engagement metrics score (25% weight)
 * Combines: time per question, rewatch count, typing speed, module completion
 */
const calculateEngagementScore = (student) => {
    const { timePerQuestion, rewatchCount, typingSpeed, completedModules, totalModules } = student;

    // Time per question: 30-120 seconds is optimal (too fast = guessing, too slow = struggling)
    let timeScore;
    if (timePerQuestion < 30) {
        timeScore = normalize(timePerQuestion, 0, 30); // Penalize too fast
    } else if (timePerQuestion > 120) {
        timeScore = normalize(180 - timePerQuestion, 0, 60); // Penalize too slow
    } else {
        timeScore = 100; // Optimal range
    }

    // Rewatch count: 0-5 is good, 10+ indicates struggle
    const rewatchScore = normalize(10 - rewatchCount, 0, 10);

    // Typing speed: 40-80 WPM is good range
    const typingSpeedScore = normalize(typingSpeed, 20, 80);

    // Module completion rate (support override or calculation)
    const completionRate = student.completionPercentage !== undefined
        ? student.completionPercentage
        : (student.completedModules / student.totalModules) * 100;

    // Average all engagement metrics
    return (timeScore + rewatchScore + typingSpeedScore + completionRate) / 4;
};

/**
 * Calculate overall Learning Pulse Score
 * @param {Object} student - Student data object
 * @param {Object} settings - Optional settings for weight adjustments
 * @returns {number} Learning Pulse Score (0-100)
 */
export const calculatePulseScore = (student, settings = {}) => {
    // Default weights (can be overridden by teacher settings)
    const weights = {
        studyHours: settings.studyHoursWeight || 0.25,
        quizPerformance: settings.quizPerformanceWeight || 0.30,
        activityConsistency: settings.activityConsistencyWeight || 0.20,
        engagement: settings.engagementWeight || 0.25,
    };

    // Calculate individual component scores
    const studyHoursScore = calculateStudyHoursScore(student.studyHours);
    const quizScore = calculateQuizScore(student.quizScore);
    const activityScore = calculateActivityScore(student.inactivityDays);
    const engagementScore = calculateEngagementScore(student);

    // Weighted sum
    const pulseScore =
        studyHoursScore * weights.studyHours +
        quizScore * weights.quizPerformance +
        activityScore * weights.activityConsistency +
        engagementScore * weights.engagement;

    // Round to 1 decimal place
    return Math.round(pulseScore * 10) / 10;
};

/**
 * Get breakdown of pulse score components for transparency
 * @param {Object} student - Student data object
 * @returns {Object} Detailed breakdown of score components
 */
export const getPulseBreakdown = (student) => {
    return {
        studyHours: {
            score: calculateStudyHoursScore(student.studyHours),
            weight: 25,
            value: student.studyHours,
        },
        quizPerformance: {
            score: calculateQuizScore(student.quizScore),
            weight: 30,
            value: student.quizScore,
        },
        activityConsistency: {
            score: calculateActivityScore(student.inactivityDays),
            weight: 20,
            value: student.inactivityDays,
        },
        engagement: {
            score: calculateEngagementScore(student),
            weight: 25,
            components: {
                timePerQuestion: student.timePerQuestion,
                rewatchCount: student.rewatchCount,
                typingSpeed: student.typingSpeed,
                completionRate: (student.completedModules / student.totalModules) * 100,
            },
        },
    };
};
