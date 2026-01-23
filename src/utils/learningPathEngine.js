/**
 * Learning Path Engine
 * 
 * Generates personalized learning path recommendations based on student performance.
 * Uses rule-based logic to suggest difficulty levels, pacing, and content formats.
 * Fully explainable - NO machine learning.
 */

/**
 * Determine recommended difficulty level
 * @param {Object} student - Student data
 * @param {number} pulseScore - Learning Pulse Score
 * @returns {string} Difficulty: "beginner", "intermediate", or "advanced"
 */
const recommendDifficulty = (student, pulseScore) => {
    const completionRate = (student.completedModules / student.totalModules) * 100;

    // High performers can handle advanced content
    if (pulseScore > 80 && student.quizScore > 85 && completionRate > 70) {
        return "advanced";
    }

    // Struggling students need beginner-friendly content
    if (pulseScore < 50 || student.quizScore < 60 || student.rewatchCount > 8) {
        return "beginner";
    }

    // Most students fall in intermediate
    return "intermediate";
};

/**
 * Determine recommended pacing
 * @param {Object} student - Student data
 * @param {number} pulseScore - Learning Pulse Score
 * @returns {string} Pacing: "fast", "moderate", or "slow"
 */
const recommendPacing = (student, pulseScore) => {
    // Fast pace for high performers with good time management
    if (
        pulseScore > 75 &&
        student.studyHours > 20 &&
        student.timePerQuestion < 50 &&
        student.rewatchCount < 3
    ) {
        return "fast";
    }

    // Slow pace for struggling students
    if (
        pulseScore < 55 ||
        student.rewatchCount > 7 ||
        student.timePerQuestion > 100 ||
        student.inactivityDays > 5
    ) {
        return "slow";
    }

    return "moderate";
};

/**
 * Determine recommended study format
 * @param {Object} student - Student data
 * @returns {string} Format: "video", "text", "interactive", or "mixed"
 */
const recommendFormat = (student) => {
    // High rewatch count suggests video preference
    if (student.rewatchCount > 5) {
        return "video";
    }

    // Fast time per question suggests text/reading preference
    if (student.timePerQuestion < 40 && student.typingSpeed > 65) {
        return "text";
    }

    // Moderate metrics suggest interactive learning
    if (student.quizScore > 70 && student.studyHours > 15) {
        return "interactive";
    }

    return "mixed";
};

/**
 * Generate session duration recommendation
 * @param {Object} student - Student data
 * @returns {string} Session duration recommendation
 */
const recommendSessionDuration = (student) => {
    // Short sessions for students with attention challenges
    if (student.rewatchCount > 8 || student.timePerQuestion > 120) {
        return "short"; // 20-30 minutes
    }

    // Long sessions for focused learners
    if (student.studyHours > 25 && student.rewatchCount < 3) {
        return "long"; // 60-90 minutes
    }

    return "medium"; // 40-50 minutes
};

/**
 * Generate personalized learning path
 * @param {Object} student - Student data
 * @param {number} pulseScore - Learning Pulse Score
 * @returns {Object} Personalized learning path recommendations
 */
export const generateLearningPath = (student, pulseScore) => {
    const difficulty = recommendDifficulty(student, pulseScore);
    const pacing = recommendPacing(student, pulseScore);
    const format = recommendFormat(student);
    const sessionDuration = recommendSessionDuration(student);

    const path = {
        difficulty,
        pacing,
        format,
        sessionDuration,
        summary: "",
        specificRecommendations: [],
    };

    // Generate human-readable summary
    const pacingText = pacing === "fast" ? "accelerated" : pacing === "slow" ? "gentle" : "steady";
    const sessionText =
        sessionDuration === "short" ? "short, focused sessions (20-30 min)" :
            sessionDuration === "long" ? "longer study sessions (60-90 min)" :
                "medium-length sessions (40-50 min)";

    path.summary = `Recommended path: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} level content with ${pacingText} pacing. Use ${sessionText} with ${format} learning materials.`;

    // Add specific recommendations
    if (difficulty === "beginner") {
        path.specificRecommendations.push("Start with foundational concepts");
        path.specificRecommendations.push("Use step-by-step guided tutorials");
    } else if (difficulty === "advanced") {
        path.specificRecommendations.push("Challenge yourself with complex projects");
        path.specificRecommendations.push("Explore advanced topics and edge cases");
    }

    if (pacing === "slow") {
        path.specificRecommendations.push("Take time to review each concept thoroughly");
        path.specificRecommendations.push("Frequent breaks and revision sessions");
    } else if (pacing === "fast") {
        path.specificRecommendations.push("Maintain momentum with consistent progress");
        path.specificRecommendations.push("Move quickly through familiar topics");
    }

    if (format === "video") {
        path.specificRecommendations.push("Focus on video lectures and demonstrations");
        path.specificRecommendations.push("Take notes while watching");
    } else if (format === "text") {
        path.specificRecommendations.push("Read documentation and written guides");
        path.specificRecommendations.push("Practice active reading with highlights");
    } else if (format === "interactive") {
        path.specificRecommendations.push("Hands-on coding exercises and labs");
        path.specificRecommendations.push("Interactive quizzes and challenges");
    } else {
        path.specificRecommendations.push("Combine multiple learning formats");
        path.specificRecommendations.push("Adapt format based on topic complexity");
    }

    // Add study schedule recommendation
    if (student.studyHours < 10) {
        path.specificRecommendations.push("Increase study time to at least 15 hours/week");
    }

    if (student.inactivityDays > 3) {
        path.specificRecommendations.push("Establish a consistent daily study routine");
    }

    return path;
};

/**
 * Get next recommended modules
 * @param {Object} student - Student data
 * @param {number} count - Number of modules to recommend
 * @returns {Array} List of recommended module IDs
 */
export const getNextModules = (student, count = 3) => {
    const nextModules = [];
    const currentModule = student.completedModules + 1;

    for (let i = 0; i < count && (currentModule + i) <= student.totalModules; i++) {
        nextModules.push({
            moduleId: currentModule + i,
            title: `Module ${currentModule + i}`,
            recommended: i === 0, // First one is most recommended
        });
    }

    return nextModules;
};
