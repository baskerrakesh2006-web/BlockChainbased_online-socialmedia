import { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { studentsData } from '../data/studentsData.jsx';
import './RoleSelector.css';

const RoleSelector = () => {
    const { selectRole } = useRole();
    const [selectedStudentId, setSelectedStudentId] = useState(studentsData[0]?.id || 1);

    const handleStudentRole = () => {
        selectRole('student', selectedStudentId);
    };

    const handleTeacherRole = () => {
        selectRole('teacher');
    };

    return (
        <div className="role-selector-container">
            <div className="role-selector-content">
                <h1 className="role-selector-title">Smart Education AI</h1>
                <p className="role-selector-subtitle">Learning Pulse Engine</p>

                <div className="role-cards">
                    <div className="role-card">
                        <div className="role-icon">👨‍🎓</div>
                        <h2>Student</h2>
                        <p>View your personalized learning dashboard</p>

                        <select
                            className="student-dropdown"
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                        >
                            {studentsData.map(student => (
                                <option key={student.id} value={student.id}>
                                    {student.name}
                                </option>
                            ))}
                        </select>

                        <button className="role-button" onClick={handleStudentRole}>
                            Continue as Student
                        </button>
                    </div>

                    <div className="role-card">
                        <div className="role-icon">👨‍🏫</div>
                        <h2>Teacher</h2>
                        <p>Access analytics and student insights</p>

                        <button className="role-button" onClick={handleTeacherRole}>
                            Continue as Teacher
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleSelector;
