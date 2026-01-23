import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { studentsData } from '../../data/studentsData.jsx';
import { coursesData } from '../../data/coursesData.jsx';
import { calculatePulseScore } from '../../utils/pulseCalculator.js';
import { classifyRisk, getRiskLabel, getRiskColor } from '../../utils/riskClassifier.js';
import { predictPerformance, getPredictionLabel } from '../../utils/performancePredictor.js';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
    const { settings } = useSettings();
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

    // Calculate metrics for all students
    const studentMetrics = studentsData.map(student => {
        const pulseScore = calculatePulseScore(student, settings);
        const riskLevel = classifyRisk(pulseScore, student.inactivityDays, settings);
        const prediction = predictPerformance(student, pulseScore);
        const course = coursesData.find(c => c.id === student.courseId);

        return {
            ...student,
            pulseScore,
            riskLevel,
            prediction: prediction.prediction,
            courseName: course?.name || 'Unknown',
        };
    });

    // Calculate KPIs
    const totalStudents = studentMetrics.length;
    const avgPulse = studentMetrics.reduce((sum, s) => sum + s.pulseScore, 0) / totalStudents;
    const warningCount = studentMetrics.filter(s => s.riskLevel === 'warning').length;
    const atRiskCount = studentMetrics.filter(s => s.riskLevel === 'at-risk').length;

    // Sorting
    const sortedStudents = [...studentMetrics].sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];

        if (sortField === 'name') {
            return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }

        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    return (
        <div className="teacher-dashboard">
            <div className="dashboard-header">
                <h1>Teacher Dashboard</h1>
                <p className="dashboard-subtitle">Student analytics and insights</p>
            </div>

            {/* KPIs */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-icon">👥</div>
                    <div className="kpi-value">{totalStudents}</div>
                    <div className="kpi-label">Total Students</div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon">📊</div>
                    <div className="kpi-value">{avgPulse.toFixed(1)}</div>
                    <div className="kpi-label">Average Pulse</div>
                </div>

                <div className="kpi-card warning">
                    <div className="kpi-icon">⚠️</div>
                    <div className="kpi-value">{warningCount}</div>
                    <div className="kpi-label">Warning</div>
                </div>

                <div className="kpi-card at-risk">
                    <div className="kpi-icon">🚨</div>
                    <div className="kpi-value">{atRiskCount}</div>
                    <div className="kpi-label">At-Risk</div>
                </div>
            </div>

            {/* Students Table */}
            <div className="students-table-section">
                <h2 className="section-title">Students Overview</h2>

                <div className="table-container">
                    <table className="students-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('name')} className="sortable">
                                    Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th>Course</th>
                                <th onClick={() => handleSort('pulseScore')} className="sortable">
                                    Pulse Score {sortField === 'pulseScore' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('riskLevel')} className="sortable">
                                    Risk Level {sortField === 'riskLevel' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th>Prediction</th>
                                <th onClick={() => handleSort('studyHours')} className="sortable">
                                    Study Hours {sortField === 'studyHours' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('inactivityDays')} className="sortable">
                                    Inactivity {sortField === 'inactivityDays' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedStudents.map(student => (
                                <tr key={student.id} onClick={() => setSelectedStudent(student)} className="clickable-row">
                                    <td className="student-name">{student.name}</td>
                                    <td>{student.courseName}</td>
                                    <td className="pulse-cell">{student.pulseScore.toFixed(1)}</td>
                                    <td>
                                        <span
                                            className="risk-badge-small"
                                            style={{ backgroundColor: getRiskColor(student.riskLevel) }}
                                        >
                                            {getRiskLabel(student.riskLevel)}
                                        </span>
                                    </td>
                                    <td className="prediction-cell">{getPredictionLabel(student.prediction)}</td>
                                    <td>{student.studyHours} hrs</td>
                                    <td>{student.inactivityDays} days</td>
                                    <td>
                                        <button className="view-button" onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedStudent(student);
                                        }}>
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Student Detail Modal */}
            {selectedStudent && (
                <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedStudent(null)}>×</button>

                        <h2>{selectedStudent.name}</h2>
                        <p className="student-email">{selectedStudent.email}</p>

                        <div className="modal-grid">
                            <div className="modal-section">
                                <h3>Learning Pulse</h3>
                                <div className="modal-pulse">{selectedStudent.pulseScore.toFixed(1)}</div>
                                <div
                                    className="modal-risk"
                                    style={{ backgroundColor: getRiskColor(selectedStudent.riskLevel) }}
                                >
                                    {getRiskLabel(selectedStudent.riskLevel)}
                                </div>
                            </div>

                            <div className="modal-section">
                                <h3>Metrics</h3>
                                <div className="metric-row">
                                    <span>Study Hours:</span>
                                    <span>{selectedStudent.studyHours} hrs/week</span>
                                </div>
                                <div className="metric-row">
                                    <span>Quiz Score:</span>
                                    <span>{selectedStudent.quizScore}%</span>
                                </div>
                                <div className="metric-row">
                                    <span>Inactivity:</span>
                                    <span>{selectedStudent.inactivityDays} days</span>
                                </div>
                                <div className="metric-row">
                                    <span>Completion:</span>
                                    <span>{selectedStudent.completedModules}/{selectedStudent.totalModules}</span>
                                </div>
                            </div>

                            <div className="modal-section">
                                <h3>Engagement</h3>
                                <div className="metric-row">
                                    <span>Time/Question:</span>
                                    <span>{selectedStudent.timePerQuestion}s</span>
                                </div>
                                <div className="metric-row">
                                    <span>Rewatch Count:</span>
                                    <span>{selectedStudent.rewatchCount}</span>
                                </div>
                                <div className="metric-row">
                                    <span>Typing Speed:</span>
                                    <span>{selectedStudent.typingSpeed} WPM</span>
                                </div>
                            </div>

                            <div className="modal-section">
                                <h3>Prediction</h3>
                                <p className="prediction-text">{getPredictionLabel(selectedStudent.prediction)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
