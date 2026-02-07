import { addDays, format, differenceInDays } from 'date-fns';

/**
 * @typedef {Object} Subject
 * @property {string} id
 * @property {string} name
 * @property {number} credits
 * @property {number} confidence // 1-5
 */

/**
 * @typedef {Object} InputData
 * @property {string} name
 * @property {Subject[]} subjects
 * @property {number} weekdayHours
 * @property {number} weekendHours
 * @property {string} preferredTime // 'morning' | 'afternoon' | 'evening' | 'night'
 * @property {Date} targetDate
 */

/**
 * Generates the study plan (Deterministic Algorithm)
 * @param {InputData} input 
 */
export const generatePlan = (input) => {
    console.time("generatePlan");
    // 1. Calculate total capacity
    const today = new Date();
    const target = new Date(input.targetDate);
    const diffDays = differenceInDays(target, today);
    // SAFETY: Cap at 365 days to prevent browser freeze on far-future dates
    const totalDays = Math.max(1, Math.min(diffDays, 365));
    const weeks = Math.ceil(totalDays / 7);

    if (diffDays > 365) {
        console.warn(`Target date ${input.targetDate} is too far (>1 year). Capping plan at 365 days.`);
    }

    // Calculate total available hours
    let totalAvailableHours = 0;
    for (let i = 0; i < totalDays; i++) {
        const d = addDays(today, i);
        const dayOfWeek = d.getDay(); // 0 = Sunday, 6 = Saturday
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        totalAvailableHours += isWeekend ? input.weekendHours : input.weekdayHours;
    }

    // 2. Subject scoring (credits x difficulty inverse)
    // Higher score = more time needed
    const subjectScores = input.subjects.map(s => {
        // Confidence 1-5. 
        // 1 (Low) -> factor 2.0 (needs more time)
        // 5 (High) -> factor 1.0 (needs less time)
        // Formula from prompt: credits * (1 + (5 - confidence) / 5)
        // Example: Credits 4, Conf 2.5/5 -> 4 * (1 + 2.5/5) = 4 * 1.5 = 6
        const difficultyMultiplier = 1 + ((5 - s.confidence) / 5);
        const score = s.credits * difficultyMultiplier;
        return { ...s, score, difficultyMultiplier };
    });

    const totalScore = subjectScores.reduce((sum, s) => sum + s.score, 0);

    // 3. Allocation (distribute total hours based on score)
    const allocations = subjectScores.map(s => {
        const allocateRatio = s.score / totalScore;
        const totalHours = totalAvailableHours * allocateRatio;
        return {
            ...s,
            totalHours,
            weeklyHours: totalHours / weeks, // Average weekly
            ratio: allocateRatio
        };
    });

    // 4. Generate Daily Schedule (Full Duration)
    const weeksData = [];
    let currentWeek = [];

    for (let i = 0; i < totalDays; i++) {
        const date = addDays(today, i);
        const dayName = format(date, 'EEEE'); // Monday, Tuesday...
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const dailyHours = isWeekend ? input.weekendHours : input.weekdayHours;

        // NEW LOGIC: Distribution for many subjects
        // Instead of purely proportional which creates tiny fragments,
        // we'll pick the top 3 high-priority subjects for this specific day
        // or rotate them. For MVP simplicity with stability:

        // 1. Sort subjects by priority (score)
        // 2. Take top 3
        // 3. Allocating time proportionally among them

        // More advanced rotation: 
        // Shift sortedAllocations based on day index so we don't always pick the same top 3
        const sortedAllocations = [...allocations].sort((a, b) => b.score - a.score);

        // Simple Rotation Strategy:
        // Day 0: 0, 1, 2
        // Day 1: 3, 4, 5 (if exist), otherwise wrap around
        const subjectsCount = sortedAllocations.length;
        const sessionsPerDay = 3;

        // Calculate offset based on day index to rotate through subjects
        // We want to ensure high priority subjects appear more often, but let's just cycle for coverage first
        // Refined Rotation: Use a weighted random or just simple modulo offset
        // Let's use a simple shift: (i * sessionsPerDay) % subjectsCount

        let sessions = [];

        for (let j = 0; j < sessionsPerDay; j++) {
            // Round robin selection
            const subjectIndex = (i * sessionsPerDay + j) % subjectsCount;
            const subj = sortedAllocations[subjectIndex];

            if (!subj) continue; // Safety check if subjectsCount is 0 or low

            const sessionDuration = dailyHours / sessionsPerDay;

            sessions.push({
                subject: subj.name,
                hours: sessionDuration,
                type: getSessionType(subj.confidence)
            });
        }

        currentWeek.push({
            date,
            dayName,
            sessions: sessions
        });

        // End of week or end of total days
        if (currentWeek.length === 7 || i === totalDays - 1) {
            weeksData.push(currentWeek);
            currentWeek = [];
        }
    }

    const boost = (5 - (totalScore / input.subjects.reduce((sum, s) => sum + s.credits, 0))).toFixed(1);

    console.timeEnd("generatePlan");

    return {
        summary: {
            totalHours: totalAvailableHours,
            weeks,
            avgHoursPerWeek: totalAvailableHours / weeks,
            confidenceBoost: boost
        },
        allocations: allocations.sort((a, b) => b.score - a.score),
        weeks: weeksData // Return array of weeks
    };
};

function getSessionType(confidence) {
    if (confidence <= 2.5) return 'Learn Weak Topics';
    if (confidence <= 4) return 'Practice Problems';
    return 'Revision';
}
