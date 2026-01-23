import { studentsData } from '../../data/studentsData.jsx';
import { coursesData } from '../../data/coursesData.jsx';
import { calculatePulseScore } from '../../utils/pulseCalculator.js';
import { useSettings } from '../../context/SettingsContext.jsx';
import './TeacherDashboard.css';

const Courses = () => {
    const { settings } = useSettings();

    // Calculate aggregated stats for each course
    const courseStats = coursesData.map(course => {
        const enrolledStudents = studentsData.filter(student => student.courseId === course.id);

        if (enrolledStudents.length === 0) {
            return { ...course, studentCount: 0, avgPulse: 0, atRiskCount: 0 };
        }

        const pulses = enrolledStudents.map(s => calculatePulseScore(s, settings));
        const avgPulse = pulses.reduce((a, b) => a + b, 0) / pulses.length;
        const atRiskCount = pulses.filter(p => p < 50).length; // < 50 is At-Risk threshold

        return {
            ...course,
            studentCount: enrolledStudents.length,
            avgPulse: Math.round(avgPulse),
            atRiskCount
        };
    });

    return (
        <div className="teacher-dashboard">
            <div className="dashboard-header">
                <h1>Courses Overview</h1>
                <p className="dashboard-subtitle">Performance metrics across all active courses</p>
            </div>

            <div className="kpi-grid">
                {courseStats.map(course => (
                    <div key={course.id} className="kpi-card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <h3 className="card-title" style={{ fontSize: '1.2rem', margin: 0 }}>{course.name}</h3>
                            <span className="risk-badge" style={{
                                backgroundColor: course.atRiskCount > 0 ? '#fee2e2' : '#d1fae5',
                                color: course.atRiskCount > 0 ? '#dc2626' : '#059669'
                            }}>
                                {course.atRiskCount > 0 ? `${course.atRiskCount} At-Risk` : 'Stable'}
                            </span>
                        </div>

                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem', flex: 1 }}>
                            {course.description}
                        </p>

                        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <div className="kpi-label">Avg Pulse</div>
                                <div className="kpi-value" style={{ fontSize: '1.5rem' }}>{course.avgPulse}</div>
                            </div>
                            <div>
                                <div className="kpi-label">Students</div>
                                <div className="kpi-value" style={{ fontSize: '1.5rem' }}>{course.studentCount}</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                            <div className="kpi-label">Difficulty: {course.difficulty}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Courses;
