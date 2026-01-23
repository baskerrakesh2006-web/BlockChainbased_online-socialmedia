import { useStudentMetrics } from '../../context/StudentContext';
import { useSettings } from '../../context/SettingsContext';
import { calculatePulseScore } from '../../utils/pulseCalculator.js';
import { predictPerformance, getPredictionLabel } from '../../utils/performancePredictor.js';
import './StudentDashboard.css'; // Reuse existing styles

const Predictions = () => {
    const { currentStudent } = useStudentMetrics();
    const { settings } = useSettings();

    if (!currentStudent) return <div>Loading...</div>;

    const pulseScore = calculatePulseScore(currentStudent, settings);
    const prediction = predictPerformance(currentStudent, pulseScore);

    return (
        <div className="student-dashboard">
            <div className="dashboard-header">
                <h1>AI Performance Prediction</h1>
                <p className="dashboard-subtitle">Explainable forecasts based on your current trajectory</p>
            </div>

            <div className="card">
                <h2 className="card-title">🔮 Future Performance Forecast</h2>

                <div className="prediction-result">
                    <div className="prediction-label">{getPredictionLabel(prediction.prediction)}</div>
                    <div className="confidence-bar">
                        <div
                            className="confidence-fill"
                            style={{ width: `${prediction.confidence}%` }}
                        ></div>
                    </div>
                    <div className="confidence-text">Confidence: {prediction.confidence}%</div>
                </div>

                <div className="two-column-layout" style={{ marginTop: '2rem' }}>
                    <div className="prediction-factors">
                        <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Contributing Factors:</h4>
                        <ul>
                            {prediction.factors.map((factor, idx) => (
                                <li key={idx} style={{ marginBottom: '0.5rem' }}>{factor}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="prediction-recommendations">
                        <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Actionable Steps:</h4>
                        <ul>
                            {prediction.recommendations.map((rec, idx) => (
                                <li key={idx} style={{ marginBottom: '0.5rem' }}>{rec}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Predictions;
