
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Notification } from '../../types';

const iconMap = {
  success: <CheckCircle className="text-green-500" size={24} />,
  error: <XCircle className="text-red-500" size={24} />,
  info: <Info className="text-blue-500" size={24} />,
  warning: <AlertTriangle className="text-orange-500" size={24} />,
};

const colorMap = {
  success: 'border-green-500 bg-white',
  error: 'border-red-500 bg-white',
  info: 'border-blue-500 bg-white',
  warning: 'border-orange-500 bg-white',
};

const Toast: React.FC<{ notification: Notification; onRemove: (id: number) => void }> = ({ notification, onRemove }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(100);
    const duration = notification.duration || 4000;
    
    useEffect(() => {
        let interval: number;
        const startTime = Date.now();
        const endTime = startTime + duration;

        const updateProgress = () => {
            if (isPaused) {
                // If paused, extend the end time to effectively pause the countdown
                return; 
            }
            const now = Date.now();
            const remaining = Math.max(0, endTime - now);
            const percentage = (remaining / duration) * 100;
            
            // Logic for pause needs accurate time tracking, simplifying for this implementation:
            // We will just decrement progress smoothly.
        };
    }, [isPaused, duration]);

    // Simpler approach for progress bar and auto-dismiss
    useEffect(() => {
        if (isPaused) return;

        const intervalStep = 100;
        const stepPercentage = (intervalStep / duration) * 100;

        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev <= 0) {
                    clearInterval(timer);
                    handleClose();
                    return 0;
                }
                return prev - stepPercentage;
            });
        }, intervalStep);

        return () => clearInterval(timer);
    }, [isPaused, duration]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => onRemove(notification.id), 300); // Match animation duration
    };

    return (
        <div
            className={`relative w-full max-w-sm bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden mb-3 transition-all duration-300 ease-in-out border-l-4 ${colorMap[notification.type]} ${isClosing ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'} animate-slide-in`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {iconMap[notification.type]}
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900">
                            {notification.message}
                        </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                            onClick={handleClose}
                        >
                            <span className="sr-only">Close</span>
                            <X size={18} />
                        </button>
                    </div>
                </div>
            </div>
            {/* Progress Bar */}
            <div 
                className={`h-1 transition-all duration-100 ease-linear ${
                    notification.type === 'success' ? 'bg-green-500' : 
                    notification.type === 'error' ? 'bg-red-500' : 
                    notification.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                }`} 
                style={{ width: `${progress}%` }} 
            />
        </div>
    );
};

const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useApp();

  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-start p-4 pt-20 pointer-events-none z-[100]">
        {notifications.map((notification) => (
            <Toast 
                key={notification.id} 
                notification={notification} 
                onRemove={removeNotification} 
            />
        ))}
      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Notifications;
