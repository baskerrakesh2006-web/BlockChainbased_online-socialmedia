import { createContext, useContext, useState, useEffect } from 'react';
import { useRole } from './RoleContext';
import { studentsData } from '../data/studentsData.jsx';

const StudentContext = createContext();

export const useStudentMetrics = () => {
    const context = useContext(StudentContext);
    if (!context) {
        throw new Error('useStudentMetrics must be used within StudentProvider');
    }
    return context;
};

export const StudentProvider = ({ children }) => {
    const { selectedStudentId } = useRole();
    const baseStudent = studentsData.find(s => s.id === selectedStudentId);

    const [studentMetrics, setStudentMetrics] = useState({
        studyHours: 20,
        inactivityDays: 2,
        quizScore: 75,
        timePerQuestion: 60,
        rewatchCount: 3,
        typingSpeed: 60,
        completionPercentage: 50, // Added completion tracking
    });

    // Reset metrics when student changes
    useEffect(() => {
        if (baseStudent) {
            setStudentMetrics({
                studyHours: baseStudent.studyHours,
                inactivityDays: baseStudent.inactivityDays,
                quizScore: baseStudent.quizScore,
                timePerQuestion: baseStudent.timePerQuestion,
                rewatchCount: baseStudent.rewatchCount,
                typingSpeed: baseStudent.typingSpeed,
                completionPercentage: Math.round((baseStudent.completedModules / baseStudent.totalModules) * 100),
            });
        }
    }, [baseStudent]);

    const updateMetric = (metric, value) => {
        setStudentMetrics(prev => ({
            ...prev,
            [metric]: Number(value),
        }));
    };

    // Merge base student data with current interactive metrics
    const currentStudent = baseStudent ? { ...baseStudent, ...studentMetrics } : null;

    return (
        <StudentContext.Provider
            value={{
                studentMetrics,
                updateMetric,
                currentStudent,
            }}
        >
            {children}
        </StudentContext.Provider>
    );
};
