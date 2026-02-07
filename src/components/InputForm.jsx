import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowRight, Loader2 } from 'lucide-react';

const InputForm = ({ onGenerate }) => {
    const [step, setStep] = useState(1);
    // Loading handled by parent App now
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        college: '',
        branch: '',
        gradYear: '',
        subjects: [{ id: 1, name: '', credits: 3, confidence: 3 }],
        weekdayHours: 4,
        weekendHours: 8,
        preferredTime: 'evening',
        targetDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]
    });

    const handleNext = () => setStep(prev => prev + 1);

    const addSubject = () => {
        setFormData(prev => ({
            ...prev,
            subjects: [...prev.subjects, { id: Date.now(), name: '', credits: 3, confidence: 3 }]
        }));
    };

    const removeSubject = (id) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.filter(s => s.id !== id)
        }));
    };

    const updateSubject = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.map(s => s.id === id ? { ...s, [field]: value } : s)
        }));
    };

    const loadSampleData = () => {
        setFormData({
            ...formData,
            name: 'Aman',
            email: 'aman@example.com',
            college: 'IIT Delhi',
            branch: 'CSE',
            gradYear: '2026',
            subjects: [
                { id: 1, name: 'Data Structures', credits: 4, confidence: 2 },
                { id: 2, name: 'Operating Systems', credits: 4, confidence: 1 },
                { id: 3, name: 'Math IV', credits: 3, confidence: 4 },
                { id: 4, name: 'Computer Networks', credits: 3, confidence: 3 }
            ]
        });
    };

    const handleSubmit = () => {
        // Validate? 
        if (!formData.name || formData.subjects.length === 0) {
            alert("Please fill in your name and at least one subject.");
            return;
        }
        onGenerate(formData);
    };

    return (
        <div className="max-w-2xl mx-auto w-full">
            {/* Progress Bar */}
            <div className="flex justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -z-10 rounded-full" />
                <div
                    className="absolute top-1/2 left-0 h-1 bg-primary -z-0 rounded-full transition-all duration-300"
                    style={{ width: `${((step - 1) / 2) * 100}%` }}
                />
                {[1, 2, 3].map(s => (
                    <div
                        key={s}
                        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2 ${s <= step
                            ? 'bg-primary border-primary text-white scale-110 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                            : 'bg-[#020617] border-white/10 text-gray-500'
                            }`}
                    >
                        {s}
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6 glass-card p-8"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                                Tell us about yourself
                            </h2>
                            <button onClick={loadSampleData} className="text-xs text-primary underline hover:text-accent">
                                Load Sample Data
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm text-gray-400 mb-2">Your Name</label>
                                <input
                                    type="text" id="name" placeholder="John Doe"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="glass-input w-full"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm text-gray-400 mb-2">Email (Optional)</label>
                                <input
                                    type="email" id="email" placeholder="john.doe@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="glass-input w-full"
                                />
                            </div>
                            <div>
                                <label htmlFor="college" className="block text-sm text-gray-400 mb-2">College/University</label>
                                <input
                                    type="text" id="college" placeholder="IIT Delhi"
                                    value={formData.college}
                                    onChange={e => setFormData({ ...formData, college: e.target.value })}
                                    className="glass-input w-full"
                                />
                            </div>
                            <div>
                                <label htmlFor="branch" className="block text-sm text-gray-400 mb-2">Branch/Major</label>
                                <input
                                    type="text" id="branch" placeholder="Computer Science"
                                    value={formData.branch}
                                    onChange={e => setFormData({ ...formData, branch: e.target.value })}
                                    className="glass-input w-full"
                                />
                            </div>
                            <div>
                                <label htmlFor="gradYear" className="block text-sm text-gray-400 mb-2">Graduation Year</label>
                                <input
                                    type="text" id="gradYear" placeholder="2026"
                                    value={formData.gradYear}
                                    onChange={e => setFormData({ ...formData, gradYear: e.target.value })}
                                    className="glass-input w-full"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNext}
                                className="px-8 py-3 bg-gradient-to-r from-primary to-accent rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/25"
                            >
                                Continue <ArrowRight size={18} />
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Subjects</h2>
                            <button onClick={addSubject} className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg flex items-center gap-1">
                                <Plus size={14} /> Add
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                            {formData.subjects.map((sub, idx) => (
                                <div key={sub.id} className="p-4 rounded-xl bg-white/5 border border-white/10 grid grid-cols-12 gap-3 items-center group">
                                    <div className="col-span-5">
                                        <input
                                            placeholder="Subject Name"
                                            className="glass-input w-full text-sm"
                                            value={sub.name}
                                            onChange={e => updateSubject(sub.id, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="text-[10px] text-gray-400 block mb-1">Credits: {sub.credits}</label>
                                        <input
                                            type="range" min="1" max="6"
                                            value={sub.credits}
                                            onChange={e => updateSubject(sub.id, 'credits', parseInt(e.target.value))}
                                            className="w-full accent-purple-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="text-[10px] text-gray-400 block mb-1">Conf: {sub.confidence}/5</label>
                                        <input
                                            type="range" min="1" max="5"
                                            value={sub.confidence}
                                            onChange={e => updateSubject(sub.id, 'confidence', parseInt(e.target.value))}
                                            className={`w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer ${sub.confidence < 3 ? 'accent-red-500' : 'accent-green-500'
                                                }`}
                                        />
                                    </div>
                                    <div className="col-span-1 flex justify-end">
                                        <button onClick={() => removeSubject(sub.id)} className="text-gray-500 hover:text-red-400">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={handleNext} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                            Next <ArrowRight size={18} />
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Preferences</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Weekday Study Hours: {formData.weekdayHours}</label>
                                <input
                                    type="range" min="1" max="8"
                                    value={formData.weekdayHours}
                                    onChange={e => setFormData({ ...formData, weekdayHours: parseInt(e.target.value) })}
                                    className="w-full accent-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Weekend Study Hours: {formData.weekendHours}</label>
                                <input
                                    type="range" min="2" max="14"
                                    value={formData.weekendHours}
                                    onChange={e => setFormData({ ...formData, weekendHours: parseInt(e.target.value) })}
                                    className="w-full accent-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Preferred Time</label>
                                <select
                                    value={formData.preferredTime}
                                    onChange={e => setFormData({ ...formData, preferredTime: e.target.value })}
                                    className="glass-input w-full bg-[#1a1a2e]"
                                >
                                    <option value="morning">Morning (6am - 12pm)</option>
                                    <option value="afternoon">Afternoon (12pm - 5pm)</option>
                                    <option value="evening">Evening (5pm - 9pm)</option>
                                    <option value="night">Night (9pm - 2am)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Target Date</label>
                                <input
                                    type="date"
                                    value={formData.targetDate}
                                    onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                                    className="glass-input w-full scheme-dark"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                        >
                            Generate My Plan
                        </button>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InputForm;
