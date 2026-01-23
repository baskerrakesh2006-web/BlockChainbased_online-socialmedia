import { NavLink } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import './Sidebar.css';

const Sidebar = () => {
    const { role, resetRole } = useRole();

    const studentLinks = [
        { to: '/student/dashboard', icon: '📊', label: 'Dashboard' },
        { to: '/student/learning-path', icon: '🎯', label: 'Learning Path' },
        { to: '/student/grades', icon: '📝', label: 'Grades' },
        { to: '/student/predictions', icon: '🔮', label: 'Predictions' },
    ];

    const teacherLinks = [
        { to: '/teacher/dashboard', icon: '📊', label: 'Dashboard' },
        { to: '/teacher/students', icon: '👥', label: 'Students' },
        { to: '/teacher/courses', icon: '📚', label: 'Courses' },
        { to: '/teacher/insights', icon: '💡', label: 'Insights' },
        { to: '/teacher/analytics', icon: '📈', label: 'Analytics' },
        { to: '/teacher/settings', icon: '⚙️', label: 'Settings' },
    ];

    const links = role === 'student' ? studentLinks : teacherLinks;

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2 className="sidebar-title">Learning Pulse</h2>
                <p className="sidebar-role">{role === 'student' ? 'Student' : 'Teacher'}</p>
            </div>

            <nav className="sidebar-nav">
                {links.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">{link.icon}</span>
                        <span className="sidebar-label">{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <button className="sidebar-logout" onClick={resetRole}>
                <span className="sidebar-icon">🚪</span>
                <span className="sidebar-label">Switch Role</span>
            </button>
        </div>
    );
};

export default Sidebar;
