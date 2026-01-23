import { useStudentMetrics } from '../../context/StudentContext';
import { calculateOverallGrade, calculateGradeTrend } from '../../utils/gradingEngine.js';
import './StudentDashboard.css'; // Reuse existing styles

const Grades = () => {
    const { currentStudent } = useStudentMetrics();

    if (!currentStudent) return <div>Loading...</div>;

    const gradeInfo = calculateOverallGrade(currentStudent.id, currentStudent);
    const gradeTrend = calculateGradeTrend(currentStudent.id);

    return (
        <div className="student-dashboard">
            <div className="dashboard-header">
                <h1>Automated Grading</h1>
                <p className="dashboard-subtitle">Real-time grade projection based on assessment history</p>
            </div>

            <div className="card">
                <h2 className="card-title">📝 Current Grade Standing</h2>

                <div className="grade-display">
                    <div className="grade-letter">{gradeInfo.letterGrade}</div>
                    <div className="grade-percentage">{gradeInfo.percentage}%</div>
                </div>

                <div className="grade-trend">
                    <span className={`trend-indicator ${gradeTrend.trend}`}>
                        {gradeTrend.trend === 'improving' ? '📈' : gradeTrend.trend === 'declining' ? '📉' : '➡️'}
                    </span>
                    <span>{gradeTrend.message}</span>
                </div>

                <div className="assessment-summary">
                    <p>Total Assessments: {gradeInfo.assessmentCount}</p>
                    <p>Quizzes: {gradeInfo.breakdown.quizzes?.length || 0}</p>
                    <p>Midterms: {gradeInfo.breakdown.midterms?.length || 0}</p>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <h4>Grade Logic</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        Grades are calculated using a weighted average where midterms count 2x as much as quizzes.
                        This score influences your overall Learning Pulse.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Grades;
