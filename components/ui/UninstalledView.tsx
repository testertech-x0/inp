
import React from 'react';
import { AlertTriangle, Smartphone, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const UninstalledView: React.FC = () => {
  const { setCurrentView } = useApp();

  const handleClose = () => {
      // Redirect to login screen on close
      setCurrentView('login'); 
  };

  return (
    <div className="min-h-screen bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
        {/* Simulated background elements to give depth */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
             <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-900/20 rounded-full blur-3xl"></div>
             <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-900/10 rounded-full blur-3xl"></div>
        </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden animate-scale-up">
        {/* Close Button */}
        <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
        >
            <X size={24} />
        </button>

        <div className="p-8 text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse"></div>
                <div className="relative w-full h-full bg-gray-800 rounded-full flex items-center justify-center border-2 border-red-500/50">
                    <Smartphone size={32} className="text-red-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-red-500 rotate-45 transform"></div>
                    </div>
                </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Application Removed</h2>
            
            <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-red-400 mb-2">
                    <AlertTriangle size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">System Notification</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                    This application has been permanently removed from this account. Access is revoked.
                </p>
            </div>
            
            <button 
                onClick={handleClose}
                className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm transition-colors"
            >
                Close Application
            </button>
        </div>
        
        <div className="bg-gray-950 p-3 text-center border-t border-gray-800">
             <p className="text-gray-600 text-[10px]">Error Code: U-403-REMOTE_WIPE</p>
        </div>
      </div>
      
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        @keyframes scale-up { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scale-up { animation: scale-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default UninstalledView;
