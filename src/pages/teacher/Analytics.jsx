import { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { studentsData } from '../../data/studentsData.jsx';
import { calculatePulseScore } from '../../utils/pulseCalculator.js';
import { getRiskAssessment } from '../../utils/riskClassifier.js';
import { useSettings } from '../../context/SettingsContext.jsx';
import './TeacherDashboard.css';

const Analytics = () => {
    const { settings } = useSettings();

    const analyticsData = useMemo(() => {
        const data = studentsData.map(s => {
            const score = calculatePulseScore(s, settings);
            const risk = getRiskAssessment(score, s.inactivityDays, s, settings);
            return { ...s, pulseScore: score, riskLevel: risk.level };
        });

        // Risk Distribution for Pie Chart
        const riskCounts = [
            { name: 'Stable', value: data.filter(s => s.riskLevel === 'stable').length, color: '#10b981' },
            { name: 'Warning', value: data.filter(s => s.riskLevel === 'warning').length, color: '#f59e0b' },
            { name: 'At-Risk', value: data.filter(s => s.riskLevel === 'at-risk').length, color: '#ef4444' },
        ];

        // Pulse Score Distribution (Binning)
        const bins = [
            { range: '0-49', count: 0 },
            { range: '50-69', count: 0 },
            { range: '70-89', count: 0 },
            { range: '90-100', count: 0 },
        ];

        data.forEach(s => {
            if (s.pulseScore < 50) bins[0].count++;
            else if (s.pulseScore < 70) bins[1].count++;
            else if (s.pulseScore < 90) bins[2].count++;
            else bins[3].count++;
        });

        return { riskCounts, bins };
    }, [studentsData, settings]);

    return (
        <div className="teacher-dashboard">
            <div className="dashboard-header">
                <h1>Analytics</h1>
                <p className="dashboard-subtitle">Visual breakdown of student performance</p>
            </div>

            <div className="two-column-layout">
                <div className="card">
                    <h3 className="card-title">Risk Distribution</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={analyticsData.riskCounts}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {analyticsData.riskCounts.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-title">Pulse Score Ranges</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={analyticsData.bins}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="range" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
