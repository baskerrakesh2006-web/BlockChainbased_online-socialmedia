# Smart Education AI – Learning Pulse Engine

Smart Education AI is a modern, data-driven educational platform designed to empower both teachers and students with actionable insights. Key capabilities include performance prediction, early risk detection, and personalized learning paths.

## 🚀 Features

### 👩‍🏫 Teacher Dashboard
- **AI Insights**: Automatically detects patterns in student behavior (e.g., inactivity, high rewatch rates) and suggests targeted interventions. shows exact data for each insight.
- **Analytics**: Visualizes course performance, student engagement, and risk distribution using interactive charts.
- **Course Management**: Overview of active courses and student enrollment.
- **Risk Classification**: Identifies students as "At-Risk", "Warning", or "Stable" based on a composite "Pulse Score".

### 👨‍🎓 Student Dashboard
- **Personalized Learning**: Tracks progress through modules and quizzes.
- **Performance Metrics**: Displays study hours, quiz scores, and completion rates.
- **Self-Paced Navigation**: Intuitive interface for accessing course materials.

### 🧠 Learning Pulse Engine
The core of the application is the **Learning Pulse Engine**, a logic-based analytics system that:
- Calculates a "Pulse Score" for every student combining grades, engagement, and behavior.
- Generates human-readable explanations for all AI predictions (no "black box" algorithms).
- operates entirely on local data for privacy and speed.

## 🛠️ Tech Stack
- **Frontend**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **Visualization**: [Recharts](https://recharts.org/)
- **Styling**: Vanilla CSS (SaaS-style Dark Mode)

## 📂 Project Structure
```
src/
├── components/      # Reusable UI components (Sidebar, Layout, etc.)
├── context/         # React Context for global state (Theme, Auth)
├── data/            # Local JSON/JS data files (acting as database)
├── pages/           # Application views
│   ├── student/     # Student-facing pages
│   └── teacher/     # Teacher-facing pages
├── utils/           # Helper functions & Logic
│   ├── insightsEngine.js  # Pattern detection logic
│   ├── pulseCalculator.js # Score calculation algorithms
│   └── riskClassifier.js  # Risk category logic
└── App.jsx          # Main application entry point
```

## ⚡ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd Hackathon1
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
To start the development server:
```bash
npm run dev
```
Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

## 🧪 Data Management
This project uses **local data files** located in `src/data/` to simulate a backend database. You can modify `studentsData.jsx` or `coursesData.jsx` to test different scenarios and see how the dashboards react.

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
