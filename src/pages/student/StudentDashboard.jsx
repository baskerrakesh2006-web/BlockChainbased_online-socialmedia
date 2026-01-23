import { useStudentMetrics } from '../../context/StudentContext';
import { useSettings } from '../../context/SettingsContext';
import { calculatePulseScore, getPulseBreakdown } from '../../utils/pulseCalculator.js';
import { getRiskAssessment, getRiskLabel, getRiskColor } from '../../utils/riskClassifier.js';
import './StudentDashboard.css';

const StudentDashboard = () => {
    const { studentMetrics, updateMetric, currentStudent } = useStudentMetrics();
    const { settings } = useSettings();

    if (!currentStudent) {
        return <div className="error-message">Student not found</div>;
    }

    const pulseScore = calculatePulseScore(currentStudent, settings);
    const pulseBreakdown = getPulseBreakdown(currentStudent);
    const riskAssessment = getRiskAssessment(pulseScore, currentStudent.inactivityDays, currentStudent, settings);

    return (
        <div className="student-dashboard">
            <div className="dashboard-header">
                <h1>Welcome, {currentStudent.name}</h1>
                <p className="dashboard-subtitle">Your personalized learning analytics</p>
            </div>

            {/* Learning Pulse Engine */}
            <div className="pulse-section">
                <h2 className="section-title">🎯 Learning Pulse Engine</h2>

                <div className="pulse-display">
                    <div className="pulse-score-card">
                        <div className="pulse-score">{pulseScore}</div>
                        <div className="pulse-label">Learning Pulse</div>
                    </div>

                    <div className="risk-badge" style={{ backgroundColor: getRiskColor(riskAssessment.level) }}>
                        {getRiskLabel(riskAssessment.level)}
                    </div>
                </div>

                <div className="pulse-breakdown">
                    <h3>Score Breakdown</h3>
                    <div className="breakdown-grid">
                        <div className="breakdown-item">
                            <span className="breakdown-label">Study Hours</span>
                            <span className="breakdown-value">{pulseBreakdown.studyHours.score.toFixed(1)}</span>
                            <span className="breakdown-weight">Weight: {pulseBreakdown.studyHours.weight}%</span>
                        </div>
                        <div className="breakdown-item">
                            <span className="breakdown-label">Quiz Performance</span>
                            <span className="breakdown-value">{pulseBreakdown.quizPerformance.score.toFixed(1)}</span>
                            <span className="breakdown-weight">Weight: {pulseBreakdown.quizPerformance.weight}%</span>
                        </div>
                        <div className="breakdown-item">
                            <span className="breakdown-label">Activity Consistency</span>
                            <span className="breakdown-value">{pulseBreakdown.activityConsistency.score.toFixed(1)}</span>
                            <span className="breakdown-weight">Weight: {pulseBreakdown.activityConsistency.weight}%</span>
                        </div>
                        <div className="breakdown-item">
                            <span className="breakdown-label">Engagement</span>
                            <span className="breakdown-value">{pulseBreakdown.engagement.score.toFixed(1)}</span>
                            <span className="breakdown-weight">Weight: {pulseBreakdown.engagement.weight}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Controls */}
            <div className="controls-section">
                <h2 className="section-title">🎛️ Adjust Your Metrics</h2>
                <p className="section-description">Move the sliders to see how changes affect your Learning Pulse. Changes here will update recommendations across all pages.</p>

                <div className="sliders-grid">
                    <div className="slider-control">
                        <label>
                            <span className="slider-label">Study Hours per Week</span>
                            <span className="slider-value">{studentMetrics.studyHours} hrs</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="40"
                            value={studentMetrics.studyHours}
                            onChange={(e) => updateMetric('studyHours', e.target.value)}
                            className="slider"
                        />
                    </div>

                    <div className="slider-control">
                        <label>
                            <span className="slider-label">Inactivity Days</span>
                            <span className="slider-value">{studentMetrics.inactivityDays} days</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="20"
                            value={studentMetrics.inactivityDays}
                            onChange={(e) => updateMetric('inactivityDays', e.target.value)}
                            className="slider"
                        />
                    </div>

                    <div className="slider-control">
                        <label>
                            <span className="slider-label">Quiz Score</span>
                            <span className="slider-value">{studentMetrics.quizScore}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={studentMetrics.quizScore}
                            onChange={(e) => updateMetric('quizScore', e.target.value)}
                            className="slider"
                        />
                    </div>

                    <div className="slider-control">
                        <label>
                            <span className="slider-label">Time per Question</span>
                            <span className="slider-value">{studentMetrics.timePerQuestion}s</span>
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="180"
                            value={studentMetrics.timePerQuestion}
                            onChange={(e) => updateMetric('timePerQuestion', e.target.value)}
                            className="slider"
                        />
                    </div>

                    <div className="slider-control">
                        <label>
                            <span className="slider-label">Rewatch Count</span>
                            <span className="slider-value">{studentMetrics.rewatchCount}</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="20"
                            value={studentMetrics.rewatchCount}
                            onChange={(e) => updateMetric('rewatchCount', e.target.value)}
                            className="slider"
                        />
                    </div>

                    <div className="slider-control">
                        <label>
                            <span className="slider-label">Typing Speed</span>
                            <span className="slider-value">{studentMetrics.typingSpeed} WPM</span>
                        </label>
                        <input
                            type="range"
                            min="20"
                            max="100"
                            value={studentMetrics.typingSpeed}
                            onChange={(e) => updateMetric('typingSpeed', e.target.value)}
                            className="slider"
                        />
                    </div>

                    <div className="slider-control">
                        <label>
                            <span className="slider-label">Course Completion</span>
                            <span className="slider-value">{studentMetrics.completionPercentage}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={studentMetrics.completionPercentage}
                            onChange={(e) => updateMetric('completionPercentage', e.target.value)}
                            className="slider"
                        />
                    </div>
                </div>
            </div>

            <div className="card">
                <h3>👇 Explore Your Insights</h3>
                <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Use the sidebar to explore your Personalized Learning Path, Grades, and Performance Predictions in detail.</p>
            </div>
        </div>
    );
};

export default StudentDashboard;
