// Activity data - student learning activities and engagement logs
export const activityData = [
    // Alex Chen (id: 1) - Consistent learner
    { studentId: 1, date: "2026-01-22", activityType: "video_watch", duration: 45, moduleId: 12, score: null },
    { studentId: 1, date: "2026-01-21", activityType: "quiz", duration: 20, moduleId: 11, score: 90 },
    { studentId: 1, date: "2026-01-20", activityType: "video_watch", duration: 60, moduleId: 11, score: null },
    { studentId: 1, date: "2026-01-19", activityType: "practice", duration: 40, moduleId: 10, score: 85 },

    // Maya Patel (id: 2) - Warning level
    { studentId: 2, date: "2026-01-19", activityType: "video_watch", duration: 30, moduleId: 9, score: null },
    { studentId: 2, date: "2026-01-18", activityType: "quiz", duration: 25, moduleId: 8, score: 68 },
    { studentId: 2, date: "2026-01-15", activityType: "video_watch", duration: 35, moduleId: 8, score: null },

    // Jordan Smith (id: 3) - Top performer
    { studentId: 3, date: "2026-01-23", activityType: "quiz", duration: 18, moduleId: 18, score: 98 },
    { studentId: 3, date: "2026-01-22", activityType: "video_watch", duration: 50, moduleId: 18, score: null },
    { studentId: 3, date: "2026-01-22", activityType: "practice", duration: 45, moduleId: 17, score: 95 },
    { studentId: 3, date: "2026-01-21", activityType: "video_watch", duration: 55, moduleId: 17, score: null },

    // Sofia Rodriguez (id: 4) - At-risk
    { studentId: 4, date: "2026-01-15", activityType: "video_watch", duration: 20, moduleId: 5, score: null },
    { studentId: 4, date: "2026-01-14", activityType: "quiz", duration: 35, moduleId: 4, score: 52 },
    { studentId: 4, date: "2026-01-10", activityType: "video_watch", duration: 15, moduleId: 4, score: null },

    // Ethan Kim (id: 5) - Stable
    { studentId: 5, date: "2026-01-21", activityType: "practice", duration: 40, moduleId: 14, score: 88 },
    { studentId: 5, date: "2026-01-20", activityType: "video_watch", duration: 50, moduleId: 14, score: null },
    { studentId: 5, date: "2026-01-19", activityType: "quiz", duration: 22, moduleId: 13, score: 82 },

    // Olivia Johnson (id: 6) - At-risk
    { studentId: 6, date: "2026-01-13", activityType: "video_watch", duration: 25, moduleId: 4, score: null },
    { studentId: 6, date: "2026-01-12", activityType: "quiz", duration: 40, moduleId: 3, score: 45 },

    // Liam Zhang (id: 7) - Warning
    { studentId: 7, date: "2026-01-20", activityType: "video_watch", duration: 35, moduleId: 10, score: null },
    { studentId: 7, date: "2026-01-19", activityType: "quiz", duration: 28, moduleId: 9, score: 75 },
    { studentId: 7, date: "2026-01-17", activityType: "practice", duration: 30, moduleId: 9, score: 78 },

    // Emma Williams (id: 8) - Top performer
    { studentId: 8, date: "2026-01-22", activityType: "quiz", duration: 19, moduleId: 16, score: 94 },
    { studentId: 8, date: "2026-01-21", activityType: "video_watch", duration: 48, moduleId: 16, score: null },
    { studentId: 8, date: "2026-01-21", activityType: "practice", duration: 42, moduleId: 15, score: 90 },

    // Noah Martinez (id: 9) - At-risk
    { studentId: 9, date: "2026-01-11", activityType: "video_watch", duration: 15, moduleId: 3, score: null },
    { studentId: 9, date: "2026-01-08", activityType: "quiz", duration: 50, moduleId: 2, score: 38 },

    // Ava Brown (id: 10) - Stable
    { studentId: 10, date: "2026-01-21", activityType: "practice", duration: 38, moduleId: 13, score: 84 },
    { studentId: 10, date: "2026-01-20", activityType: "video_watch", duration: 45, moduleId: 13, score: null },
    { studentId: 10, date: "2026-01-19", activityType: "quiz", duration: 24, moduleId: 12, score: 80 },

    // Lucas Davis (id: 11) - Warning
    { studentId: 11, date: "2026-01-18", activityType: "video_watch", duration: 32, moduleId: 8, score: null },
    { studentId: 11, date: "2026-01-17", activityType: "quiz", duration: 30, moduleId: 7, score: 65 },

    // Isabella Garcia (id: 12) - Top performer
    { studentId: 12, date: "2026-01-23", activityType: "quiz", duration: 16, moduleId: 15, score: 100 },
    { studentId: 12, date: "2026-01-22", activityType: "video_watch", duration: 52, moduleId: 15, score: null },
    { studentId: 12, date: "2026-01-22", activityType: "practice", duration: 48, moduleId: 14, score: 96 },

    // Mason Lee (id: 13) - Warning
    { studentId: 13, date: "2026-01-17", activityType: "video_watch", duration: 28, moduleId: 7, score: null },
    { studentId: 13, date: "2026-01-16", activityType: "quiz", duration: 32, moduleId: 6, score: 60 },

    // Sophia Wilson (id: 14) - Stable
    { studentId: 14, date: "2026-01-21", activityType: "practice", duration: 36, moduleId: 11, score: 82 },
    { studentId: 14, date: "2026-01-20", activityType: "video_watch", duration: 42, moduleId: 11, score: null },
    { studentId: 14, date: "2026-01-19", activityType: "quiz", duration: 26, moduleId: 10, score: 78 },

    // James Anderson (id: 15) - At-risk
    { studentId: 15, date: "2026-01-08", activityType: "video_watch", duration: 12, moduleId: 2, score: null },
    { studentId: 15, date: "2026-01-05", activityType: "quiz", duration: 55, moduleId: 1, score: 32 },
];
