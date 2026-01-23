import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoleProvider, useRole } from './context/RoleContext';
import { SettingsProvider } from './context/SettingsContext';
import { StudentProvider } from './context/StudentContext';
import Layout from './components/Layout';
import RoleSelector from './components/RoleSelector';
import StudentDashboard from './pages/student/StudentDashboard';
import LearningPath from './pages/student/LearningPath';
import Grades from './pages/student/Grades';
import Predictions from './pages/student/Predictions';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import Courses from './pages/teacher/Courses';
import Insights from './pages/teacher/Insights';
import Analytics from './pages/teacher/Analytics';
import Settings from './pages/teacher/Settings';

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRole }) => {
  const { role } = useRole();

  if (!role) {
    return <Navigate to="/" replace />;
  }

  if (role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { role } = useRole();

  return (
    <Routes>
      <Route path="/" element={!role ? <RoleSelector /> : <Navigate to={`/${role}/dashboard`} replace />} />

      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute allowedRole="student">
          <StudentProvider>
            <Layout />
          </StudentProvider>
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="learning-path" element={<LearningPath />} />
        <Route path="grades" element={<Grades />} />
        <Route path="predictions" element={<Predictions />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Teacher Routes */}
      <Route path="/teacher" element={
        <ProtectedRoute allowedRole="teacher">
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="students" element={<TeacherDashboard />} /> {/* Reusing dashboard */}
        <Route path="courses" element={<Courses />} />
        <Route path="insights" element={<Insights />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <RoleProvider>
        <SettingsProvider>
          <AppRoutes />
        </SettingsProvider>
      </RoleProvider>
    </BrowserRouter>
  );
};

export default App;
