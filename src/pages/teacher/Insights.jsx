import { useState } from 'react';
import { generateInsights } from '../../utils/insightsEngine.js';
import { studentsData } from '../../data/studentsData.jsx';
import './TeacherDashboard.css';

const Insights = () => {
    // Generate AI insights based on current data
    const insights = generateInsights(studentsData);
    const [expandedInsight, setExpandedInsight] = useState(null);

    const toggleInsight = (idx) => {
        if (expandedInsight === idx) {
            setExpandedInsight(null);
        } else {
            setExpandedInsight(idx);
        }
    };

    return (
        <div className="teacher-dashboard">
            <div className="dashboard-header">
                <h1>AI Insights</h1>
                <p className="dashboard-subtitle">Pattern detection and actionable intelligence</p>
            </div>

            <div className="card">
                <h2 className="card-title">🔍 Detected Patterns</h2>
                <p style={{ marginBottom: '2rem' }}>
                    The AI Engine analyzes student behavior logs and performance metrics to identify recurring patterns that may impact learning outcomes.
                </p>

                <div className="insights-list" style={{ display: 'grid', gap: '1.5rem' }}>
                    {insights.map((insight, idx) => (
                        <div key={idx} className="insight-item" style={{
                            padding: '1.5rem',
                            background: '#f1f5f9',
                            borderRadius: '0.75rem',
                            borderLeft: `4px solid ${insight.type === 'positive' ? '#10b981' : (insight.severity === 'high' ? '#ef4444' : '#f59e0b')}`
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1e293b' }}>
                                        {insight.type === 'risk_correlation' ? '⚠️ Risk Correlation' : (insight.type === 'positive' ? '⭐ Positive Trend' : '💡 Performance Pattern')}
                                    </h3>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#334155' }}>
                                        {insight.title}
                                    </h4>
                                    <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '1rem' }}>
                                        {insight.description}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        background: '#fff',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        color: '#64748b',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        {insight.affectedCount} students
                                    </span>
                                </div>
                            </div>

                            {insight.students && insight.students.length > 0 && (
                                <div style={{ marginTop: '1rem' }}>
                                    <button
                                        onClick={() => toggleInsight(idx)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#2563eb',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            padding: '0',
                                            fontSize: '0.9rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        {expandedInsight === idx ? 'Hide Details' : 'View Details'}
                                        <span>{expandedInsight === idx ? '▲' : '▼'}</span>
                                    </button>

                                    {expandedInsight === idx && (
                                        <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                                <thead>
                                                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                                        <th style={{ textAlign: 'left', padding: '0.75rem', color: '#64748b' }}>Student Name</th>
                                                        <th style={{ textAlign: 'left', padding: '0.75rem', color: '#64748b' }}>Metric</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {insight.students.map((student, sIdx) => (
                                                        <tr key={sIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                            <td style={{ padding: '0.75rem', color: '#334155', fontWeight: '500' }}>{student.name}</td>
                                                            <td style={{ padding: '0.75rem', color: '#64748b' }}>{student.metric}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {insights.length === 0 && (
                        <p>No significant anomalies detected at this time.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Insights;
