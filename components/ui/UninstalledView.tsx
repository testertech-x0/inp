
import React from 'react';
import { AlertTriangle, Smartphone } from 'lucide-react';

const UninstalledView: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="relative w-full h-full bg-gray-800 rounded-full flex items-center justify-center border-4 border-red-500">
                <Smartphone size={40} className="text-red-500 opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-1 bg-red-500 rotate-45 transform"></div>
                </div>
            </div>
        </div>
        
        <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white tracking-tight">Application Removed</h1>
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-4">
                <div className="flex items-center gap-3 text-red-400 mb-2 justify-center">
                    <AlertTriangle size={20} />
                    <span className="font-semibold uppercase tracking-wider text-xs">System Alert</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                    This application has been remotely uninstalled from your account by the administrator. Access to all services and data on this device has been revoked.
                </p>
            </div>
            <p className="text-gray-500 text-xs">Error Code: U-403-REMOTE_WIPE</p>
        </div>
      </div>
    </div>
  );
};

export default UninstalledView;
