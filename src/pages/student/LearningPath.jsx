import { useStudentMetrics } from '../../context/StudentContext';
import { useSettings } from '../../context/SettingsContext';
import { calculatePulseScore } from '../../utils/pulseCalculator.js';
import { generateLearningPath } from '../../utils/learningPathEngine.js';
import './StudentDashboard.css'; // Reuse existing styles

const LearningPath = () => {
    const { currentStudent } = useStudentMetrics();
    const { settings } = useSettings();

    if (!currentStudent) return <div>Loading...</div>;

    const pulseScore = calculatePulseScore(currentStudent, settings);
    const learningPath = generateLearningPath(currentStudent, pulseScore);

    return (
        <div className="student-dashboard">
            <div className="dashboard-header">
                <h1>Data-Driven Learning Path</h1>
                <p className="dashboard-subtitle">Optimized for your learning style and pace</p>
            </div>

            <div className="card">
                <h2 className="card-title">📚 Personalized Learning Path</h2>
                <p className="learning-path-summary">{learningPath.summary}</p>

                <div className="learning-path-details">
                    <div className="path-detail">
                        <span className="path-label">Difficulty:</span>
                        <span className="path-value">{learningPath.difficulty}</span>
                    </div>
                    <div className="path-detail">
                        <span className="path-label">Pacing:</span>
                        <span className="path-value">{learningPath.pacing}</span>
                    </div>
                    <div className="path-detail">
                        <span className="path-label">Format:</span>
                        <span className="path-value">{learningPath.format}</span>
                    </div>
                    <div className="path-detail">
                        <span className="path-label">Session Duration:</span>
                        <span className="path-value">{learningPath.sessionDuration}</span>
                    </div>
                </div>

                <div className="recommendations" style={{ marginTop: '2rem' }}>
                    <h4 style={{ marginBottom: '1rem', color: '#fff' }}>Detailed Recommendations:</h4>
                    <ul>
                        {learningPath.specificRecommendations.map((rec, idx) => (
                            <li key={idx} style={{ marginBottom: '0.5rem' }}>{rec}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LearningPath;
