
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const FundPasswordScreen: React.FC = () => {
    const { currentUser, setCurrentView, updateFundPassword, addNotification } = useApp();
    const [fundPassword, setFundPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!currentUser) return null;

    const isValid = fundPassword.length === 6;

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Strictly allow only numbers
        const value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 6) {
            setFundPassword(value);
            
            // Real-time validation feedback
            if (value.length > 0 && value.length < 6) {
                setError(`Enter 6 digits (${value.length}/6)`);
            } else {
                setError('');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) {
            setError('Fund password must be exactly 6 digits');
            addNotification('Please enter a valid 6-digit fund password.', 'error');
            return;
        }

        setIsSubmitting(true);
        const result = await updateFundPassword(currentUser.id, fundPassword);
        if (result.success) {
            setTimeout(() => setCurrentView('profile'), 1500);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="flex items-center p-4 bg-white border-b sticky top-0 z-10 shrink-0">
                <button onClick={() => setCurrentView('profile')} className="p-2 -ml-2">
                    <ArrowLeft size={24} className="text-gray-800" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold text-gray-800 pr-6">FundPWD</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Mobile number</label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-600">+91</span>
                                <input type="text" value={currentUser.phone} readOnly className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md bg-gray-100 text-gray-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex justify-between">
                                <span>Fund password</span>
                                {isValid && <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle size={12}/> Valid</span>}
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    value={fundPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter 6 digits"
                                    className={`w-full px-3 py-3 border rounded-md focus:ring-2 transition-colors tracking-widest text-lg ${
                                        error 
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                        : isValid 
                                            ? 'border-green-300 focus:border-green-500 focus:ring-green-200' 
                                            : 'border-gray-300 focus:ring-green-500'
                                    }`}
                                />
                                {isValid && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                                        <CheckCircle size={20} />
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex justify-between items-start h-5">
                                <p className={`text-xs transition-colors ${error ? 'text-red-500 flex items-center gap-1' : 'text-gray-400'}`}>
                                    {error ? <><AlertCircle size={12} /> {error}</> : 'Must be exactly 6 digits'}
                                </p>
                                <span className={`text-xs ${isValid ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
                                    {fundPassword.length}/6
                                </span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting || !isValid}
                                className={`w-full py-3 rounded-lg font-semibold text-white transition shadow-sm ${
                                    isSubmitting || !isValid 
                                    ? 'bg-gray-300 cursor-not-allowed' 
                                    : 'bg-green-500 hover:bg-green-600 shadow-green-200 shadow-md'
                                }`}
                            >
                                {isSubmitting ? 'Confirming...' : 'Confirm'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-6 text-xs text-gray-500 flex items-start gap-2 bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <span className="text-blue-500 mt-0.5 text-lg">•</span>
                    <p>
                        In order to ensure the safety of your funds, users who are in the process of withdrawing funds or have successfully withdrawn funds cannot change their fund passwords. If you need to change your fund password, please contact online customer service.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default FundPasswordScreen;
