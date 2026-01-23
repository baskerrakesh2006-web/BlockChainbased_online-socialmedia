import { useSettings } from '../../context/SettingsContext';
import './Settings.css';

const Settings = () => {
    const { settings, updateSetting, resetSettings } = useSettings();

    return (
        <div className="settings-page">
            <div className="dashboard-header">
                <h1>System Settings</h1>
                <p className="dashboard-subtitle">Configure AI thresholds and scoring logic</p>
            </div>

            <div className="settings-grid">
                {/* Risk Thresholds */}
                <div className="settings-card">
                    <div className="card-header">
                        <h2>⚠️ Risk Classification Thresholds</h2>
                        <p>Adjust criteria for student risk levels</p>
                    </div>

                    <div className="setting-group">
                        <label>
                            <span className="setting-label">Stable Pulse Threshold</span>
                            <span className="setting-value">{settings.stablePulseThreshold}</span>
                        </label>
                        <input
                            type="range"
                            min="50"
                            max="90"
                            value={settings.stablePulseThreshold}
                            onChange={(e) => updateSetting('stablePulseThreshold', Number(e.target.value))}
                            className="slider"
                        />
                        <p className="setting-help">Minimum score to be considered "Stable"</p>
                    </div>

                    <div className="setting-group">
                        <label>
                            <span className="setting-label">Warning Pulse Threshold</span>
                            <span className="setting-value">{settings.warningPulseThreshold}</span>
                        </label>
                        <input
                            type="range"
                            min="30"
                            max="70"
                            value={settings.warningPulseThreshold}
                            onChange={(e) => updateSetting('warningPulseThreshold', Number(e.target.value))}
                            className="slider"
                        />
                        <p className="setting-help">Below this score is "At-Risk"</p>
                    </div>

                    <div className="setting-group">
                        <label>
                            <span className="setting-label">Inactivity Warning (Days)</span>
                            <span className="setting-value">{settings.stableInactivityThreshold} days</span>
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="14"
                            value={settings.stableInactivityThreshold}
                            onChange={(e) => updateSetting('stableInactivityThreshold', Number(e.target.value))}
                            className="slider"
                        />
                    </div>
                </div>

                {/* Scoring Weights */}
                <div className="settings-card">
                    <div className="card-header">
                        <h2>⚖️ Pulse Score Weights</h2>
                        <p>Adjust impact of different metrics (Total: 100%)</p>
                    </div>

                    <div className="setting-group">
                        <label>
                            <span className="setting-label">Study Hours Weight</span>
                            <span className="setting-value">{(settings.studyHoursWeight * 100).toFixed(0)}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={settings.studyHoursWeight}
                            onChange={(e) => updateSetting('studyHoursWeight', Number(e.target.value))}
                            className="slider"
                        />
                    </div>

                    <div className="setting-group">
                        <label>
                            <span className="setting-label">Quiz Performance</span>
                            <span className="setting-value">{(settings.quizPerformanceWeight * 100).toFixed(0)}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={settings.quizPerformanceWeight}
                            onChange={(e) => updateSetting('quizPerformanceWeight', Number(e.target.value))}
                            className="slider"
                        />
                    </div>

                    <div className="setting-group">
                        <label>
                            <span className="setting-label">Activity Consistency</span>
                            <span className="setting-value">{(settings.activityConsistencyWeight * 100).toFixed(0)}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={settings.activityConsistencyWeight}
                            onChange={(e) => updateSetting('activityConsistencyWeight', Number(e.target.value))}
                            className="slider"
                        />
                    </div>

                    <div className="setting-group">
                        <label>
                            <span className="setting-label">Engagement Metrics</span>
                            <span className="setting-value">{(settings.engagementWeight * 100).toFixed(0)}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={settings.engagementWeight}
                            onChange={(e) => updateSetting('engagementWeight', Number(e.target.value))}
                            className="slider"
                        />
                    </div>

                    <div className="weight-total">
                        Total: {((settings.studyHoursWeight + settings.quizPerformanceWeight + settings.activityConsistencyWeight + settings.engagementWeight) * 100).toFixed(0)}%
                    </div>
                </div>

                {/* Prediction Settings */}
                <div className="settings-card">
                    <div className="card-header">
                        <h2>🔮 Prediction Model</h2>
                        <p>Adjust sensitivity of performance predictions</p>
                    </div>

                    <div className="setting-group">
                        <label>
                            <span className="setting-label">Confidence Booster</span>
                            <span className="setting-value">{settings.predictionConfidenceBoost > 0 ? '+' : ''}{settings.predictionConfidenceBoost}%</span>
                        </label>
                        <input
                            type="range"
                            min="-20"
                            max="20"
                            step="5"
                            value={settings.predictionConfidenceBoost}
                            onChange={(e) => updateSetting('predictionConfidenceBoost', Number(e.target.value))}
                            className="slider"
                        />
                        <p className="setting-help">Artificially adjust confidence level of predictions</p>
                    </div>

                    <div className="reset-section">
                        <button className="reset-button" onClick={resetSettings}>
                            Reset All Settings to Defaults
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
