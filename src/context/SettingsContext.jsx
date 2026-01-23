import { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        // Risk classification thresholds
        stablePulseThreshold: 70,
        warningPulseThreshold: 50,
        stableInactivityThreshold: 3,
        warningInactivityThreshold: 7,

        // Grading weights (must sum to 1.0)
        studyHoursWeight: 0.25,
        quizPerformanceWeight: 0.30,
        activityConsistencyWeight: 0.20,
        engagementWeight: 0.25,

        // Prediction confidence
        predictionConfidenceBoost: 0,
    });

    const updateSetting = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const updateMultipleSettings = (updates) => {
        setSettings(prev => ({
            ...prev,
            ...updates,
        }));
    };

    const resetSettings = () => {
        setSettings({
            stablePulseThreshold: 70,
            warningPulseThreshold: 50,
            stableInactivityThreshold: 3,
            warningInactivityThreshold: 7,
            studyHoursWeight: 0.25,
            quizPerformanceWeight: 0.30,
            activityConsistencyWeight: 0.20,
            engagementWeight: 0.25,
            predictionConfidenceBoost: 0,
        });
    };

    return (
        <SettingsContext.Provider
            value={{
                settings,
                updateSetting,
                updateMultipleSettings,
                resetSettings,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};
