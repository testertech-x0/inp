
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Check, CircleDollarSign, Gift, X, Smartphone, Calendar, Star } from 'lucide-react';

const RulesModal = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white text-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-scale-up">
                <header className="p-4 flex justify-between items-center border-b shrink-0">
                    <h2 className="text-xl font-bold text-gray-800">Check-in Rules</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors">
                        <X size={24} />
                    </button>
                </header>
                <div className="p-6 overflow-y-auto space-y-4 text-sm text-gray-700">
                    <p>1. Users can check in once every day to receive rewards.</p>
                    <p>2. You must check in <strong>consecutively</strong>. If you miss a day, your streak resets to Day 1.</p>
                    <p>3. Cumulative check-ins unlock special milestone rewards on Day 7 and Day 14.</p>
                    <p>4. The check-in cycle resets after 14 days.</p>
                    <p>5. All rewards are automatically credited to your account balance.</p>
                </div>
            </div>
             <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out; }
                @keyframes scale-up { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
                .animate-scale-up { animation: scale-up 0.3s ease-out; }
            `}</style>
        </div>
    );
};

const RewardModal = ({ reward, onClose }: { reward: number, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-[60] animate-fade-in">
        <div className="relative bg-white rounded-3xl p-8 text-center max-w-xs w-full shadow-2xl animate-bounce-in">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <Gift size={48} className="text-white drop-shadow-md" />
                </div>
            </div>
            <div className="mt-10">
                <h3 className="text-2xl font-bold text-gray-800">Check-in Successful!</h3>
                <p className="text-gray-500 mt-2">You have received</p>
                <p className="text-4xl font-bold text-green-600 my-4">+₹{reward}</p>
                <button onClick={onClose} className="w-full bg-green-500 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-green-600 transition transform active:scale-95">
                    Awesome!
                </button>
            </div>
            {/* Confetti CSS simulated elements */}
            {Array.from({length: 20}).map((_, i) => (
                <div key={i} className="confetti" style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random()}s`,
                    backgroundColor: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B'][Math.floor(Math.random() * 4)]
                }}></div>
            ))}
        </div>
        <style>{`
            @keyframes bounce-in {
                0% { opacity: 0; transform: scale(0.3); }
                50% { opacity: 1; transform: scale(1.05); }
                70% { transform: scale(0.9); }
                100% { transform: scale(1); }
            }
            .animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.215, 0.610, 0.355, 1.000) both; }
            .confetti {
                position: absolute; width: 8px; height: 8px; top: -20px;
                animation: fall 3s linear infinite;
            }
            @keyframes fall { to { transform: translateY(100vh) rotate(720deg); } }
        `}</style>
    </div>
);

const LoginActivityScreen = () => {
    const { currentUser, setCurrentView, performDailyCheckIn, addNotification } = useApp();
    const [showRules, setShowRules] = useState(false);
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [rewardAmount, setRewardAmount] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'checkin' | 'history'>('checkin');

    if (!currentUser) return null;

    const streak = currentUser.checkInStreak || 0;
    const todayStr = new Date().toISOString().split('T')[0];
    const hasCheckedInToday = currentUser.lastCheckInDate === todayStr;

    const handleCheckIn = async () => {
        if (hasCheckedInToday || isCheckingIn) return;
        setIsCheckingIn(true);
        const result = await performDailyCheckIn();
        setIsCheckingIn(false);
        
        if(result.success) {
            setRewardAmount(result.reward);
        } else {
            addNotification(result.message, 'error');
        }
    };

    // Generate days for the grid (1-14)
    const days = Array.from({ length: 14 }, (_, i) => {
        const dayNumber = i + 1;
        const isCompleted = dayNumber <= streak; // Days already passed in streak
        const isCurrentTarget = dayNumber === (hasCheckedInToday ? streak : streak + 1); 
        const isFuture = dayNumber > (hasCheckedInToday ? streak : streak + 1);
        
        let reward = 10;
        if (dayNumber === 7) reward = 20;
        if (dayNumber === 14) reward = 50;

        return { dayNumber, isCompleted, isCurrentTarget, isFuture, reward };
    });

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {showRules && <RulesModal onClose={() => setShowRules(false)} />}
            {rewardAmount !== null && <RewardModal reward={rewardAmount} onClose={() => setRewardAmount(null)} />}
            
            <header className="bg-green-600 p-4 pb-16 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    {/* Background Pattern */}
                    <div className="absolute right-10 top-10 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-xl"></div>
                    <div className="absolute left-10 bottom-10 w-24 h-24 bg-white rounded-full mix-blend-overlay filter blur-lg"></div>
                </div>
                
                <div className="relative z-10 flex justify-between items-center mb-4">
                    <button onClick={() => setCurrentView('home')} className="p-2 hover:bg-white/20 rounded-full transition">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-lg font-bold">Login Activity</h1>
                    <button onClick={() => setShowRules(true)} className="text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition">Rules</button>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center mt-2">
                    <p className="text-sm opacity-90 mb-1">Current Streak</p>
                    <div className="flex items-baseline gap-1">
                        <h2 className="text-5xl font-extrabold">{streak}</h2>
                        <span className="text-lg font-medium">Days</span>
                    </div>
                    <p className="text-xs bg-white/20 px-3 py-1 rounded-full mt-2 flex items-center gap-1">
                        <Star size={12} fill="currentColor" /> Keep it up for bigger rewards!
                    </p>
                </div>
            </header>

            <div className="flex-1 px-4 -mt-8 relative z-20 pb-6">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden flex mb-4">
                    <button 
                        onClick={() => setActiveTab('checkin')}
                        className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'checkin' ? 'bg-white text-green-600 border-b-2 border-green-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >
                        <Calendar size={16} /> Check-in
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'history' ? 'bg-white text-green-600 border-b-2 border-green-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >
                        <Smartphone size={16} /> Records
                    </button>
                </div>

                {activeTab === 'checkin' ? (
                    <div className="bg-white rounded-2xl shadow-md p-5">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
                            <span>Daily Rewards</span>
                            <span className="text-xs text-gray-400 font-normal">Reset after 14 days</span>
                        </h3>
                        
                        <div className="grid grid-cols-4 gap-3">
                            {days.map((day) => {
                                let bgClass = '';
                                let borderClass = '';
                                let textClass = '';
                                
                                if (day.isCompleted) {
                                    bgClass = 'bg-green-100';
                                    borderClass = 'border-green-200';
                                    textClass = 'text-green-700';
                                } else if (day.isCurrentTarget) {
                                    bgClass = 'bg-yellow-50 animate-pulse-subtle';
                                    borderClass = 'border-yellow-400 ring-2 ring-yellow-100';
                                    textClass = 'text-yellow-700';
                                } else {
                                    bgClass = 'bg-gray-50';
                                    borderClass = 'border-gray-200';
                                    textClass = 'text-gray-400';
                                }

                                return (
                                    <div 
                                        key={day.dayNumber}
                                        onClick={day.isCurrentTarget ? handleCheckIn : undefined}
                                        className={`relative p-2 rounded-xl border ${bgClass} ${borderClass} flex flex-col items-center justify-center min-h-[80px] transition-all ${day.isCurrentTarget && !isCheckingIn ? 'cursor-pointer transform hover:scale-105 shadow-sm' : ''} ${(day.dayNumber === 7 || day.dayNumber === 14) ? 'col-span-2 flex-row gap-3' : ''}`}
                                    >
                                        <span className={`text-[10px] font-bold mb-1 ${textClass}`}>Day {day.dayNumber}</span>
                                        
                                        {day.isCompleted ? (
                                            <div className="bg-green-500 rounded-full p-1">
                                                <Check size={16} className="text-white" />
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                {(day.dayNumber === 7 || day.dayNumber === 14) ? (
                                                    <Gift className={day.isCurrentTarget ? "text-yellow-500 animate-bounce" : "text-gray-300"} size={24} />
                                                ) : (
                                                    <CircleDollarSign className={day.isCurrentTarget ? "text-yellow-500" : "text-gray-300"} size={20} />
                                                )}
                                            </div>
                                        )}
                                        
                                        <span className={`text-xs font-bold mt-1 ${day.isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                                            {day.isCompleted ? 'Done' : `+₹${day.reward}`}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {!hasCheckedInToday && (
                            <button 
                                onClick={handleCheckIn} 
                                disabled={isCheckingIn}
                                className="w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 hover:shadow-xl transition transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isCheckingIn ? (
                                    <>Checking in...</>
                                ) : (
                                    <>Check in for Day {streak + 1}</>
                                )}
                            </button>
                        )}
                        
                        {hasCheckedInToday && (
                            <div className="mt-6 bg-green-50 text-green-700 py-3 rounded-xl text-center text-sm font-medium border border-green-100">
                                Come back tomorrow for Day {streak + 1}!
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-md p-5 min-h-[300px]">
                        <h3 className="font-bold text-gray-800 mb-4">Login Records</h3>
                        {currentUser.loginActivity && currentUser.loginActivity.length > 0 ? (
                            <div className="space-y-4">
                                {currentUser.loginActivity.map((log, idx) => (
                                    <div key={idx} className="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                        <div className="bg-blue-50 p-2 rounded-full text-blue-500 mt-1">
                                            <Smartphone size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{log.device}</p>
                                            <p className="text-xs text-gray-400">{new Date(log.date).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 py-10 text-sm">No records found.</div>
                        )}
                    </div>
                )}
            </div>
            
            <style>{`
                @keyframes pulse-subtle {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.8; }
                }
                .animate-pulse-subtle { animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            `}</style>
        </div>
    );
};

export default LoginActivityScreen;
