import React, { useEffect, useState, useRef } from 'react';
import { generatePlan } from '../logic/planner';
import CalendarGrid from './CalendarGrid';
import { Download, RefreshCw, Trophy, Zap, Clock, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Results = ({ inputData }) => {
    const [data, setData] = useState(inputData);
    const scheduleRef = useRef(null);

    // FIX 6: Use useMemo to ensure plan is generated immediately before render
    const plan = React.useMemo(() => {
        try {
            return generatePlan(data);
        } catch (e) {
            console.error("Planner Generation Error:", e);
            return null;
        }
    }, [data]);

    const handleConfidenceChange = (subjectId, newConf) => {
        setData(prev => ({
            ...prev,
            subjects: prev.subjects.map(s => s.id === subjectId ? { ...s, confidence: newConf } : s)
        }));
    };

    const [currentWeek, setCurrentWeek] = useState(0);
    const [checkedItems, setCheckedItems] = useState(new Set());

    const handleNextWeek = () => {
        if (plan && currentWeek < plan.weeks.length - 1) {
            setCurrentWeek(prev => prev + 1);
        }
    };

    const handlePrevWeek = () => {
        if (currentWeek > 0) {
            setCurrentWeek(prev => prev - 1);
        }
    };

    const toggleCheckItem = (itemKey) => {
        setCheckedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemKey)) {
                newSet.delete(itemKey);
            } else {
                newSet.add(itemKey);
            }
            return newSet;
        });
    };

    const downloadPDF = async () => {
        const fullExportEl = document.getElementById('pdf-export-container');
        if (!fullExportEl) return;

        // Clone and append to body for proper rendering
        const clone = fullExportEl.cloneNode(true);

        Object.assign(clone.style, {
            display: 'block',
            position: 'absolute',
            top: '-10000px',
            left: '0',
            width: '1200px',
            height: 'auto',
            zIndex: '-1000',
            backgroundColor: '#020617'
        });

        document.body.appendChild(clone);

        try {
            // Get all week containers
            const weekContainers = clone.querySelectorAll('.week-container');

            if (weekContainers.length === 0) {
                throw new Error('No week containers found');
            }

            // Create PDF in landscape A4
            const pdf = new jsPDF('l', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Capture header once (for first page)
            const headerEl = clone.querySelector('.pdf-header');
            let headerCanvas = null;
            let headerImgHeight = 0;

            if (headerEl) {
                headerCanvas = await html2canvas(headerEl, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#020617',
                    logging: false,
                    width: 1200,
                    windowWidth: 1200
                });

                const headerImgWidth = pdfWidth;
                headerImgHeight = (headerCanvas.height * headerImgWidth) / headerCanvas.width;
            }

            // Process each week
            for (let i = 0; i < weekContainers.length; i++) {
                const weekEl = weekContainers[i];

                const canvas = await html2canvas(weekEl, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#020617',
                    logging: false,
                    width: 1200,
                    windowWidth: 1200
                });

                const imgData = canvas.toDataURL('image/png');

                // Calculate dimensions to fit on page
                const imgWidth = pdfWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                // Add new page for subsequent weeks
                if (i > 0) {
                    pdf.addPage();
                }

                // Add header on first page only
                if (i === 0 && headerCanvas) {
                    const headerImgData = headerCanvas.toDataURL('image/png');
                    pdf.addImage(headerImgData, 'PNG', 0, 0, pdfWidth, headerImgHeight);

                    // Add week content below header
                    const availableHeight = pdfHeight - headerImgHeight - 10;
                    const scaledHeight = Math.min(imgHeight, availableHeight);
                    const scaledWidth = (canvas.width * scaledHeight) / canvas.height;

                    pdf.addImage(imgData, 'PNG', 0, headerImgHeight + 5, scaledWidth, scaledHeight);
                } else {
                    // Fit week to page
                    const scaledHeight = Math.min(imgHeight, pdfHeight - 10);
                    const scaledWidth = (canvas.width * scaledHeight) / canvas.height;

                    pdf.addImage(imgData, 'PNG', 0, 5, scaledWidth, scaledHeight);
                }
            }

            pdf.save('flow-study-timetable.pdf');
        } catch (error) {
            console.error("PDF Generation Failed", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            document.body.removeChild(clone);
        }
    };

    if (!plan) {
        return (
            <div className="text-center p-8 glass-card">
                <h2 className="text-2xl font-bold text-error mb-2">Planning Failed</h2>
                <p className="text-gray-400">Something went wrong while generating your study plan. Please try adjusting your inputs (e.g., target date or subjects).</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">Reload</button>
            </div>
        );
    }

    const currentWeekData = plan.weeks[currentWeek];

    return (
        <div className="space-y-8 results-container">
            {/* Header Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card p-4 flex items-center space-x-4 border-l-4 border-primary">
                    <div className="p-3 rounded-full bg-primary/20 text-primary"><Clock size={24} /></div>
                    <div>
                        <div className="text-sm text-gray-400">Total Study Time</div>
                        <div className="text-xl font-bold text-white">{plan.summary.totalHours} Hours</div>
                        <div className="text-xs text-gray-500">{plan.summary.avgHoursPerWeek.toFixed(1)}h / week</div>
                    </div>
                </div>
                <div className="glass-card p-4 flex items-center space-x-4 border-l-4 border-secondary">
                    <div className="p-3 rounded-full bg-secondary/20 text-secondary"><Zap size={24} /></div>
                    <div>
                        <div className="text-sm text-gray-400">Target Date</div>
                        <div className="text-xl font-bold text-white">{new Date(data.targetDate).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">{plan.summary.weeks} weeks away</div>
                    </div>
                </div>
                <div className="glass-card p-4 flex items-center space-x-4 border-l-4 border-success">
                    <div className="p-3 rounded-full bg-success/20 text-success"><Trophy size={24} /></div>
                    <div>
                        <div className="text-sm text-gray-400">Expected Growth</div>
                        <div className="text-xl font-bold text-white">+{plan.summary.confidenceBoost} GPA</div>
                        <div className="text-xs text-gray-500">Based on coverage</div>
                    </div>
                </div>
            </div>

            {/* Weekly Allocation & Rebalancing */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <RefreshCw size={20} className="text-primary" />
                    Weekly Allocation & Live Rebalance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {plan.allocations.map(subj => (
                        <div key={subj.id} className="glass-card p-4 hover:bg-white/5 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg">{subj.name}</h4>
                                <div className="text-xs font-mono bg-white/10 px-2 py-1 rounded">{subj.weeklyHours.toFixed(1)}h/wk</div>
                            </div>

                            <div className="space-y-3 mt-4">
                                <div>
                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                        <span>Confidence</span>
                                        <span>{subj.confidence}/5</span>
                                    </div>
                                    <input
                                        type="range" min="1" max="5"
                                        value={subj.confidence}
                                        onChange={e => handleConfidenceChange(subj.id, parseInt(e.target.value))}
                                        className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${subj.confidence < 3 ? 'accent-red-500 bg-red-500/20' : 'accent-green-500 bg-green-500/20'
                                            }`}
                                    />
                                </div>
                                <div className="text-xs text-gray-500">
                                    Focus: {subj.confidence < 3 ? 'Deep Dive' : 'Practice'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Visual Calendar with Navigation */}
            <div ref={scheduleRef} className="p-4 bg-[#020617] rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Your Schedule</h3>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handlePrevWeek}
                            disabled={currentWeek === 0}
                            className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            ←
                        </button>
                        <span className="text-sm font-mono text-gray-400">
                            Week {currentWeek + 1} of {plan.weeks.length}
                        </span>
                        <button
                            onClick={handleNextWeek}
                            disabled={currentWeek === plan.weeks.length - 1}
                            className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            →
                        </button>
                    </div>
                </div>

                <div className="mb-4 px-4">
                    <input
                        type="range"
                        min="0"
                        max={plan.weeks.length - 1}
                        value={currentWeek}
                        onChange={(e) => setCurrentWeek(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>

                {/* NOTE: Passing the array of days (which is 'currentWeekData' here) as proper prop */}
                <CalendarGrid weekData={currentWeekData} />
            </div>

            {/* Hidden Container for PDF Export (All Weeks) */}
            <div id="pdf-export-container" className="hidden absolute top-0 left-0 w-[1200px] bg-[#020617] p-8">
                <div className="pdf-header mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Flow Study Plan</h1>
                    <h2 className="text-xl text-gray-400 mb-4 max-w-2xl">
                        For {data.name} | {data.college || 'University'} | {data.branch || 'Major'}
                        <br />Target: {new Date(data.targetDate).toLocaleDateString()}
                    </h2>
                </div>

                {plan.weeks.map((week, idx) => (
                    <div key={idx} className="week-container mb-8 pb-8 border-b border-white/10 last:border-0">
                        <h3 className="text-lg font-bold text-accent mb-4 border-b border-white/10 pb-2">Week {idx + 1}</h3>
                        <CalendarGrid weekData={week} />
                    </div>
                ))}
            </div>

            {/* Next 7 Days Checklist (Matches Current View) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4">Priority Checklist (Current Week)</h3>
                    <div className="space-y-2">
                        {currentWeekData.slice(0, 3).map((day, i) => (
                            <div key={i}>
                                <h4 className="text-sm font-semibold text-gray-400 mb-2 mt-2">{day.dayName}</h4>
                                {day.sessions.map((s, idx) => {
                                    const itemKey = `${currentWeek}-${i}-${idx}`;
                                    const isChecked = checkedItems.has(itemKey);
                                    return (
                                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                            <div className={`w-2 h-2 rounded-full ${s.type === 'Learn Weak Topics' ? 'bg-red-400' : 'bg-green-400'}`} />
                                            <div className="flex-1">
                                                <span className="text-sm font-medium">{s.subject}</span>
                                                <span className="text-xs text-gray-500 ml-2">({s.hours.toFixed(1)}h)</span>
                                            </div>
                                            <CheckCircle
                                                size={16}
                                                className={`cursor-pointer transition-colors ${isChecked ? 'text-green-500' : 'text-gray-600 hover:text-green-500'}`}
                                                onClick={() => toggleCheckItem(itemKey)}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Outcome & CTA */}
                <div className="glass-card p-6 flex flex-col justify-center items-center text-center space-y-6 bg-gradient-to-br from-white/5 to-primary/5">
                    <h3 className="text-2xl font-bold text-white">Ready to Ace This?</h3>
                    <p className="text-gray-400">
                        "40% early focus on weak topics reduces backlog risk by 85%"
                    </p>
                    <div className="flex gap-4 w-full">
                        <button
                            onClick={downloadPDF}
                            className="flex-1 bg-white hover:bg-gray-100 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                        >
                            <Download size={18} /> Download Full Schedule (PDF)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Results;
