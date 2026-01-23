/**
 * Insights Engine
 * 
 * Pattern detection and insights generation for teacher dashboard.
 * Analyzes cohort data to identify trends and provide actionable recommendations.
 * Fully explainable - NO machine learning.
 */

import { studentsData } from '../data/studentsData.jsx';
import { coursesData } from '../data/coursesData.jsx';
import { calculatePulseScore } from './pulseCalculator.js';
import { classifyRisk } from './riskClassifier.js';

/**
 * Identify at-risk patterns across all students
 * @param {Object} settings - Teacher settings
 * @returns {Array} List of insights
 */
export const generateInsights = (settings = {}) => {
    const insights = [];

    // Calculate metrics for all students
    const studentMetrics = studentsData.map(student => ({
        ...student,
        pulseScore: calculatePulseScore(student, settings),
        riskLevel: classifyRisk(
            calculatePulseScore(student, settings),
            student.inactivityDays,
            settings
        ),
    }));

    // Insight 1: Inactivity correlation
    const inactiveStudents = studentMetrics.filter(s => s.inactivityDays > 7);
    if (inactiveStudents.length > 0) {
        const avgPulseInactive = inactiveStudents.reduce((sum, s) => sum + s.pulseScore, 0) / inactiveStudents.length;
        const activeStudents = studentMetrics.filter(s => s.inactivityDays <= 7);
        const avgPulseActive = activeStudents.reduce((sum, s) => sum + s.pulseScore, 0) / activeStudents.length;

        insights.push({
            type: 'pattern',
            severity: 'high',
            title: 'Inactivity Impact',
            description: `Students inactive for 7+ days show ${Math.round(avgPulseActive - avgPulseInactive)}% lower pulse scores on average.`,
            affectedCount: inactiveStudents.length,
            recommendation: 'Implement automated re-engagement campaigns for inactive students.',
            students: inactiveStudents.map(s => ({
                id: s.id,
                name: s.name,
                metric: `${s.inactivityDays} days inactive`,
                value: s.inactivityDays
            }))
        });
    }

    // Insight 2: Rewatch correlation
    const highRewatchStudents = studentMetrics.filter(s => s.rewatchCount > 8);
    if (highRewatchStudents.length > 0) {
        const avgQuizScore = highRewatchStudents.reduce((sum, s) => sum + s.quizScore, 0) / highRewatchStudents.length;

        insights.push({
            type: 'pattern',
            severity: avgQuizScore < 60 ? 'high' : 'medium',
            title: 'High Rewatch Rate',
            description: `${highRewatchStudents.length} students rewatching content 8+ times, averaging ${Math.round(avgQuizScore)}% on quizzes.`,
            affectedCount: highRewatchStudents.length,
            recommendation: 'Content may be too difficult. Consider adding prerequisite materials or simplifying explanations.',
            students: highRewatchStudents.map(s => ({
                id: s.id,
                name: s.name,
                metric: `${s.rewatchCount} rewatches`,
                value: s.rewatchCount
            }))
        });
    }

    // Insight 3: Study hours vs performance
    const lowStudyHours = studentMetrics.filter(s => s.studyHours < 10);
    if (lowStudyHours.length > 0) {
        const atRiskCount = lowStudyHours.filter(s => s.riskLevel === 'at-risk').length;

        insights.push({
            type: 'pattern',
            severity: 'medium',
            title: 'Low Study Time',
            description: `${lowStudyHours.length} students studying less than 10 hours/week. ${atRiskCount} are at-risk.`,
            affectedCount: lowStudyHours.length,
            recommendation: 'Send study time recommendations and time management resources.',
            students: lowStudyHours.map(s => ({
                id: s.id,
                name: s.name,
                metric: `${s.studyHours} hours/week`,
                value: s.studyHours
            }))
        });
    }

    // Insight 4: Course difficulty analysis
    const coursePerformance = {};
    coursesData.forEach(course => {
        const courseStudents = studentMetrics.filter(s => s.courseId === course.id);
        if (courseStudents.length > 0) {
            const avgPulse = courseStudents.reduce((sum, s) => sum + s.pulseScore, 0) / courseStudents.length;
            const atRiskStudents = courseStudents.filter(s => s.riskLevel === 'at-risk');

            coursePerformance[course.id] = {
                courseName: course.name,
                avgPulse,
                atRiskStudents,
                totalStudents: courseStudents.length,
            };
        }
    });

    // Find courses with high at-risk rates
    Object.values(coursePerformance).forEach(cp => {
        const atRiskRate = (cp.atRiskStudents.length / cp.totalStudents) * 100;
        if (atRiskRate > 30) {
            insights.push({
                type: 'course',
                severity: 'high',
                title: `High Risk in ${cp.courseName}`,
                description: `${Math.round(atRiskRate)}% of students in this course are at-risk.`,
                affectedCount: cp.atRiskStudents.length,
                recommendation: 'Review course difficulty and pacing. Consider additional support materials.',
                students: cp.atRiskStudents.map(s => ({
                    id: s.id,
                    name: s.name,
                    metric: `Pulse Score: ${Math.round(s.pulseScore)}`,
                    value: s.pulseScore
                }))
            });
        }
    });

    // Insight 5: Top performers
    const topPerformers = studentMetrics.filter(s => s.pulseScore > 85 && s.quizScore > 90);
    if (topPerformers.length > 0) {
        insights.push({
            type: 'positive',
            severity: 'low',
            title: 'High Achievers',
            description: `${topPerformers.length} students excelling with 85+ pulse scores.`,
            affectedCount: topPerformers.length,
            recommendation: 'Offer advanced content or mentorship opportunities to high achievers.',
            students: topPerformers.map(s => ({
                id: s.id,
                name: s.name,
                metric: `Pulse: ${Math.round(s.pulseScore)} | Quiz: ${s.quizScore}%`,
                value: s.pulseScore
            }))
        });
    }

    // Sort by severity
    const severityOrder = { high: 0, medium: 1, low: 2 };
    insights.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    return insights;
};

/**
 * Get course-level statistics
 * @param {number} courseId - Course ID
 * @param {Object} settings - Teacher settings
 * @returns {Object} Course statistics
 */
export const getCourseStats = (courseId, settings = {}) => {
    const courseStudents = studentsData.filter(s => s.courseId === courseId);

    if (courseStudents.length === 0) {
        return null;
    }

    const studentMetrics = courseStudents.map(student => ({
        ...student,
        pulseScore: calculatePulseScore(student, settings),
        riskLevel: classifyRisk(
            calculatePulseScore(student, settings),
            student.inactivityDays,
            settings
        ),
    }));

    const avgPulse = studentMetrics.reduce((sum, s) => sum + s.pulseScore, 0) / studentMetrics.length;
    const avgQuizScore = studentMetrics.reduce((sum, s) => sum + s.quizScore, 0) / studentMetrics.length;
    const avgStudyHours = studentMetrics.reduce((sum, s) => sum + s.studyHours, 0) / studentMetrics.length;

    const riskBreakdown = {
        stable: studentMetrics.filter(s => s.riskLevel === 'stable').length,
        warning: studentMetrics.filter(s => s.riskLevel === 'warning').length,
        atRisk: studentMetrics.filter(s => s.riskLevel === 'at-risk').length,
    };

    return {
        totalStudents: courseStudents.length,
        avgPulse: Math.round(avgPulse * 10) / 10,
        avgQuizScore: Math.round(avgQuizScore * 10) / 10,
        avgStudyHours: Math.round(avgStudyHours * 10) / 10,
        riskBreakdown,
    };
};

/**
 * Get severity color for insights
 * @param {string} severity - Severity level
 * @returns {string} CSS color value
 */
export const getSeverityColor = (severity) => {
    const colors = {
        high: '#ef4444',
        medium: '#f59e0b',
        low: '#10b981',
    };
    return colors[severity] || '#6b7280';
};
