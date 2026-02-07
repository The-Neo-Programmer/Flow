import React from 'react';
import { Clock } from 'lucide-react';

const CalendarGrid = ({ weekData }) => {
    if (!weekData) return null;

    return (
        <div className="overflow-x-auto pb-4">
            <div className="min-w-[800px]">
                <div className="grid grid-cols-8 gap-2 mb-2">
                    <div className="col-span-1 text-gray-500 text-xs font-bold uppercase tracking-wider text-center p-2">Time Pattern</div>
                    {weekData.map((day, i) => (
                        <div key={i} className="col-span-1 text-center">
                            <div className="text-gray-400 text-xs uppercase">{day.dayName.substring(0, 3)}</div>
                            <div className="text-white font-bold">{day.date.getDate()}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-8 gap-2">
                    {/* Time Loop Example (Static for MVP visual as exact times aren't generated, just slots) */}
                    <div className="col-span-1 space-y-2">
                        <div className="h-24 rounded-lg bg-white/5 flex flex-col items-center justify-center text-xs text-gray-400 border border-white/5">
                            <Clock size={14} className="mb-1" />
                            <span>Session 1</span>
                        </div>
                        <div className="h-24 rounded-lg bg-white/5 flex flex-col items-center justify-center text-xs text-gray-400 border border-white/5">
                            <Clock size={14} className="mb-1" />
                            <span>Session 2</span>
                        </div>
                        <div className="h-24 rounded-lg bg-white/5 flex flex-col items-center justify-center text-xs text-gray-400 border border-white/5">
                            <Clock size={14} className="mb-1" />
                            <span>Session 3</span>
                        </div>
                    </div>

                    {/* Days Columns */}
                    {weekData.map((day, i) => (
                        <div key={i} className="col-span-1 space-y-2">
                            {day.sessions.map((session, idx) => (
                                <div
                                    key={idx}
                                    className={`h-24 rounded-lg p-2 text-xs border border-white/10 flex flex-col justify-between transition-hover hover:scale-105 ${session.type === 'Learn Weak Topics' ? 'bg-error/10 border-error/20' :
                                        session.type === 'Practice Problems' ? 'bg-warning/10 border-warning/20' :
                                            'bg-success/10 border-success/20'
                                        }`}
                                >
                                    <div className="font-bold text-white line-clamp-2">{session.subject}</div>
                                    <div>
                                        <div className={`px-1.5 py-0.5 rounded text-[10px] w-fit mb-1 ${session.type === 'Learn Weak Topics' ? 'bg-error/20 text-error' :
                                            session.type === 'Practice Problems' ? 'bg-warning/20 text-warning' :
                                                'bg-success/20 text-success'
                                            }`}>
                                            {session.type}
                                        </div>
                                        <div className="text-gray-400">{session.hours.toFixed(1)}h</div>
                                    </div>
                                </div>
                            ))}
                            {[...Array(Math.max(0, 3 - day.sessions.length))].map((_, idx) => (
                                <div key={`empty-${idx}`} className="h-24 rounded-lg bg-white/5 border border-white/5 p-2 flex items-center justify-center">
                                    <span className="text-gray-600 text-[10px]">Free Time</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalendarGrid;
