import { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error('useRole must be used within RoleProvider');
    }
    return context;
};

export const RoleProvider = ({ children }) => {
    const [role, setRole] = useState(null); // 'student' or 'teacher'
    const [selectedStudentId, setSelectedStudentId] = useState(null);

    const selectRole = (newRole, studentId = null) => {
        setRole(newRole);
        if (newRole === 'student') {
            setSelectedStudentId(studentId);
        } else {
            setSelectedStudentId(null);
        }
    };

    const resetRole = () => {
        setRole(null);
        setSelectedStudentId(null);
    };

    return (
        <RoleContext.Provider
            value={{
                role,
                selectedStudentId,
                selectRole,
                resetRole,
            }}
        >
            {children}
        </RoleContext.Provider>
    );
};
