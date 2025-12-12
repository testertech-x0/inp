
import React, { useState, useRef, useEffect, FC } from 'react';
import { LogOut, Users, Activity, TrendingUp, Wallet, Search, Edit, Eye, Trash2, X, FileText, Briefcase, Plus, Settings, Check, Crop, LogIn, Shield, UserCheck, UserX, Camera, MessageSquare, Paperclip, Send, Share2, Gift, CreditCard, QrCode, LayoutDashboard, Palette, Target, Menu, Link, Globe, DollarSign, Calendar, Download, Smartphone, History, Landmark, Image as ImageIcon, AlertTriangle, SmartphoneNfc, RefreshCw, Lock, UserPlus, ArrowDownCircle, ArrowUpCircle, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { User, InvestmentPlan, ThemeColor, Transaction, LoginActivity, Investment, ChatMessage, SocialLinks, Prize, Comment, SocialLinkItem, ChatSession, ActivityLogEntry, Employee } from '../../types';
import * as api from '../../context/api';

// --- TYPES & HELPERS ---
const themeOptions: { name: ThemeColor; bgClass: string }[] = [
    { name: 'green', bgClass: 'bg-green-500' }, { name: 'blue', bgClass: 'bg-blue-500' }, { name: 'purple', bgClass: 'bg-purple-500' },
    { name: 'orange', bgClass: 'bg-orange-500' }, { name: 'red', bgClass: 'bg-red-500' }, { name: 'yellow', bgClass: 'bg-yellow-500' },
    { name: 'teal', bgClass: 'bg-teal-500' }, { name: 'pink', bgClass: 'bg-pink-500' },
];

const ImagePreviewModal: FC<{ imageUrl: string; onClose: () => void }> = ({ imageUrl, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-[60]" onClick={onClose}>
        <button className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/75 transition-colors z-10" onClick={onClose}><X size={24} /></button>
        <div className="relative max-w-full max-h-full" onClick={e => e.stopPropagation()}>
            <img src={imageUrl} alt="Preview" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
        </div>
    </div>
);

// --- SUB-COMPONENTS ---

const DashboardView: FC<{ requests: Transaction[], role: 'admin' | 'employee' }> = ({ requests, role }) => {
    const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, totalInvestments: 0, platformBalance: 0 });
    
    // Calculate Stats for Employee View
    const pendingDeposits = requests.filter(r => r.type === 'deposit' && r.status === 'pending');
    const pendingWithdrawals = requests.filter(r => r.type === 'withdrawal' && r.status === 'pending');
    
    const pendingDepositAmount = pendingDeposits.reduce((acc, curr) => acc + curr.amount, 0);
    const pendingWithdrawalAmount = pendingWithdrawals.reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

    useEffect(() => {
        const loadStats = async () => {
             try {
                 const data = await api.fetchAdminDashboard();
                 setStats(data);
             } catch (e) {
                 console.error("Failed to load stats", e);
             }
        };
        if (role === 'admin') loadStats();
    }, [role]);

    if (role === 'employee') {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Financial Tasks Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">New Deposits</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{pendingDeposits.length}</p>
                            <p className="text-xs text-green-600 mt-1">Total: ₹{pendingDepositAmount.toLocaleString()}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg"><ArrowDownCircle className="text-green-600" size={24} /></div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">New Withdrawals</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{pendingWithdrawals.length}</p>
                            <p className="text-xs text-red-600 mt-1">Total: ₹{pendingWithdrawalAmount.toLocaleString()}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg"><ArrowUpCircle className="text-red-600" size={24} /></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div><p className="text-sm text-gray-500 font-medium">Total Users</p><p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalUsers}</p></div>
                    <div className="bg-blue-50 p-3 rounded-lg"><Users className="text-blue-600" size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div><p className="text-sm text-gray-500 font-medium">Active Users</p><p className="text-3xl font-bold text-green-600 mt-1">{stats.activeUsers}</p></div>
                    <div className="bg-green-50 p-3 rounded-lg"><UserCheck className="text-green-600" size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div><p className="text-sm text-gray-500 font-medium">Total Investment</p><p className="text-3xl font-bold text-purple-600 mt-1">₹{stats.totalInvestments.toLocaleString()}</p></div>
                    <div className="bg-purple-50 p-3 rounded-lg"><Briefcase className="text-purple-600" size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div><p className="text-sm text-gray-500 font-medium">User Liabilities</p><p className="text-3xl font-bold text-orange-600 mt-1">₹{stats.platformBalance.toLocaleString()}</p></div>
                    <div className="bg-orange-50 p-3 rounded-lg"><Wallet className="text-orange-600" size={24} /></div>
                </div>
            </div>
        </div>
    );
};

const FinancialManagementView: FC<{ 
    requests: Transaction[], 
    history: Transaction[], 
    users: User[],
    onApprove: (tx: Transaction) => void, 
    onReject: (tx: Transaction) => void, 
    onViewProof: (url: string) => void, 
    onDistribute: () => void 
}> = ({ requests, history, users, onApprove, onReject, onViewProof, onDistribute }) => {
    const [mainTab, setMainTab] = useState<'deposit' | 'withdrawal'>('deposit');
    const [subTab, setSubTab] = useState<'pending' | 'history'>('pending');
    const [search, setSearch] = useState('');
    const [selectedUserBank, setSelectedUserBank] = useState<User | null>(null);

    const sourceList = subTab === 'pending' ? requests : history;
    const filtered = sourceList.filter(tx => {
        const matchesType = tx.type === mainTab;
        const term = search.toLowerCase();
        const userId = (tx as any).userId || '';
        const userPhone = (tx as any).userPhone || '';
        const userName = (tx as any).userName || '';
        
        return matchesType && (userId.toLowerCase().includes(term) || userPhone.includes(term) || userName.toLowerCase().includes(term));
    });

    const handleViewBank = (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user) setSelectedUserBank(user);
    };

    return (
        <div className="space-y-6">
            {selectedUserBank && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedUserBank(null)}>
                    <div className="bg-white rounded-xl p-6 w-96 shadow-xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2"><Landmark size={20}/> Bank Details</h3>
                            <button onClick={() => setSelectedUserBank(null)}><X size={20} /></button>
                        </div>
                        <div className="space-y-3">
                            <p className="text-sm text-gray-500">User: <span className="text-gray-800 font-medium">{selectedUserBank.name}</span></p>
                            {selectedUserBank.bankAccount ? (
                                <div className="bg-gray-50 p-4 rounded-lg space-y-2 border">
                                    <div><span className="text-xs text-gray-500">Holder Name</span><p className="font-semibold">{selectedUserBank.bankAccount.accountHolder}</p></div>
                                    <div><span className="text-xs text-gray-500">Account Number</span><p className="font-mono font-semibold text-blue-600">{selectedUserBank.bankAccount.accountNumber}</p></div>
                                    <div><span className="text-xs text-gray-500">IFSC Code</span><p className="font-mono">{selectedUserBank.bankAccount.ifscCode}</p></div>
                                </div>
                            ) : (
                                <div className="p-4 bg-red-50 text-red-600 text-center rounded-lg">No Bank Account Linked</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col gap-1">
                         <h2 className="text-xl font-semibold text-gray-800">Financial Requests</h2>
                         <p className="text-xs text-gray-500">Manage Deposits and Withdrawals</p>
                    </div>
                    <button onClick={onDistribute} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 shadow-sm text-sm font-medium transition-all active:scale-95">
                        <TrendingUp size={18} /> Distribute Daily Earnings
                    </button>
                </div>

                <div className="p-4 bg-gray-50 border-b flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex bg-white p-1 rounded-lg border shadow-sm">
                        <button onClick={() => setMainTab('deposit')} className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${mainTab === 'deposit' ? 'bg-green-100 text-green-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>Deposits</button>
                        <button onClick={() => setMainTab('withdrawal')} className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${mainTab === 'withdrawal' ? 'bg-red-100 text-red-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>Withdrawals</button>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input type="text" placeholder="Search User ID / Phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>
                
                <div className="p-4 flex gap-4 border-b">
                     <button onClick={() => setSubTab('pending')} className={`pb-2 border-b-2 text-sm font-medium transition-colors ${subTab === 'pending' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Pending</button>
                    <button onClick={() => setSubTab('history')} className={`pb-2 border-b-2 text-sm font-medium transition-colors ${subTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>History Log</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Info</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{mainTab === 'deposit' ? 'Payment Proof' : 'Bank Info'}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{subTab === 'pending' ? 'Actions' : 'Status'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filtered.length > 0 ? filtered.map(req => (
                                <tr key={req.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${mainTab === 'deposit' ? 'bg-green-500' : 'bg-red-500'}`}>{mainTab === 'deposit' ? 'IN' : 'OUT'}</div>
                                            <div><p className="text-sm font-medium text-gray-900">{(req as any).userName || 'Unknown'}</p><p className="text-xs text-gray-500">{(req as any).userPhone}</p><p className="text-[10px] text-gray-400">ID: {(req as any).userId}</p></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className={`font-bold ${mainTab === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>₹{Math.abs(req.amount).toFixed(2)}</span>{mainTab === 'withdrawal' && <p className="text-xs text-gray-400">Fee: 5% included</p>}</td>
                                    <td className="px-6 py-4">
                                        {mainTab === 'deposit' ? (
                                            req.proofImg ? <button onClick={() => onViewProof(req.proofImg!)} className="flex items-center gap-1 text-blue-600 text-xs hover:underline bg-blue-50 px-2 py-1 rounded border border-blue-100"><Eye size={12} /> View Screenshot</button> : <span className="text-gray-400 text-xs">No Proof</span>
                                        ) : (
                                            <button onClick={() => handleViewBank((req as any).userId)} className="flex items-center gap-1 text-purple-600 text-xs hover:underline bg-purple-50 px-2 py-1 rounded border border-purple-100"><Landmark size={12} /> View Bank Details</button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(req.date).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        {subTab === 'pending' ? (
                                            <div className="flex gap-2">
                                                <button onClick={() => onApprove(req)} className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs font-medium shadow-sm flex items-center gap-1"><Check size={14} /> Approve</button>
                                                <button onClick={() => onReject(req)} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-xs font-medium border border-red-200 flex items-center gap-1"><X size={14} /> Reject</button>
                                            </div>
                                        ) : (
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${req.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{req.status}</span>
                                        )}
                                    </td>
                                </tr>
                            )) : <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No {mainTab} requests found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const UserInvestmentsModal: FC<{ user: User; onClose: () => void }> = ({ user, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center">
                    <div><h3 className="text-lg font-bold text-gray-800">Investment History</h3><p className="text-sm text-gray-500">User: {user.name} ({user.phone})</p></div>
                    <button onClick={onClose}><X size={24} className="text-gray-500 hover:text-gray-800" /></button>
                </header>
                <div className="p-6 overflow-y-auto">
                    {user.investments.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Plan Name</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Category</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Amount</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Daily / Total Rev</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Start Date</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th></tr></thead>
                                <tbody className="divide-y divide-gray-200">
                                    {user.investments.map((inv, idx) => {
                                        const start = new Date(inv.startDate).getTime();
                                        const end = start + (inv.revenueDays * 24 * 60 * 60 * 1000);
                                        const isExpired = Date.now() > end;
                                        return (
                                            <tr key={idx}>
                                                <td className="px-4 py-2 text-sm font-medium">{inv.planName}</td>
                                                <td className="px-4 py-2 text-sm text-gray-500">{inv.category}</td>
                                                <td className="px-4 py-2 text-sm font-bold text-green-600">₹{inv.investedAmount}</td>
                                                <td className="px-4 py-2 text-sm"><div className="flex flex-col"><span className="text-xs text-gray-500">Daily: ₹{inv.dailyEarnings}</span><span className="text-xs font-semibold">Total: ₹{inv.totalRevenue}</span></div></td>
                                                <td className="px-4 py-2 text-sm text-gray-500">{new Date(inv.startDate).toLocaleDateString()}</td>
                                                <td className="px-4 py-2"><span className={`px-2 py-0.5 rounded text-xs font-bold ${isExpired ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-600'}`}>{isExpired ? 'Finished' : 'Active'}</span></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : <div className="text-center text-gray-500 py-10">No investment records found for this user.</div>}
                </div>
            </div>
        </div>
    );
}

const UserManagementView: FC<{ users: User[], onAdd: () => void, onEdit: (u: User) => void, onToggle: (u: User) => void, onDelete: (id: string) => void, onLoginAs: (id: string) => void, onViewInvestments: (u: User) => void, onUninstall: (id: string) => void, onRestore: (id: string) => void }> = ({ users, onAdd, onEdit, onToggle, onDelete, onLoginAs, onViewInvestments, onUninstall, onRestore }) => {
    const [term, setTerm] = useState('');
    const filtered = users.filter(u => u.name.toLowerCase().includes(term.toLowerCase()) || u.phone.includes(term) || u.id.includes(term));
    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
                <div className="flex items-center gap-3">
                    <button onClick={onAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 text-sm font-medium"><UserPlus size={18} /> Add User</button>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Search users..." value={term} onChange={e => setTerm(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">User</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Balance</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">App Access</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Actions</th></tr></thead>
                    <tbody className="divide-y divide-gray-200">{filtered.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">{user.name[0]}</div><div><p className="text-sm font-medium text-gray-900">{user.name}</p><p className="text-xs text-gray-500">{user.phone}</p></div></div></td>
                            <td className="px-6 py-4 text-sm text-gray-800 font-mono">₹{user.balance.toFixed(2)}</td>
                            <td className="px-6 py-4"><button onClick={() => onToggle(user)} className={`px-2 py-1 rounded-full text-xs font-semibold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.isActive ? 'Active' : 'Blocked'}</button></td>
                            <td className="px-6 py-4">{user.isAppUninstalled ? <span className="flex items-center gap-1 text-xs text-red-600 font-bold bg-red-50 px-2 py-1 rounded border border-red-100"><X size={12}/> Removed</span> : <span className="flex items-center gap-1 text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded border border-green-100"><Check size={12}/> Installed</span>}</td>
                            <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2">
                                <button onClick={() => onViewInvestments(user)} className="p-1.5 text-purple-600 hover:bg-purple-50 rounded" title="View Investments"><Briefcase size={16} /></button>
                                <button onClick={() => onLoginAs(user.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Login As"><LogIn size={16} /></button>
                                <button onClick={() => onEdit(user)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" title="Edit"><Edit size={16} /></button>
                                {user.isAppUninstalled ? <button onClick={() => onRestore(user.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Restore App Access"><RefreshCw size={16} /></button> : <button onClick={() => onUninstall(user.id)} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded" title="Uninstall App"><SmartphoneNfc size={16} /></button>}
                                <button onClick={() => onDelete(user.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete User"><Trash2 size={16} /></button>
                            </div></td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
        </div>
    );
};

const PlanManagementView: FC<{ plans: InvestmentPlan[], onAdd: () => void, onEdit: (p: InvestmentPlan) => void, onDelete: (id: string) => void }> = ({ plans, onAdd, onEdit, onDelete }) => (
    <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex justify-between items-center"><h2 className="text-xl font-semibold text-gray-800">Investment Plans</h2><button onClick={onAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"><Plus size={18} /> Add Plan</button></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
            {plans.map(plan => (
                <div key={plan.id} className="border rounded-xl p-5 hover:shadow-md transition bg-white overflow-hidden">
                    {plan.imageUrl && <div className="w-full h-32 mb-4 rounded-lg overflow-hidden border bg-gray-50"><img src={plan.imageUrl} alt={plan.name} className="w-full h-full object-cover" /></div>}
                    <div className="flex justify-between items-start mb-4">
                        <div><h3 className="font-bold text-lg text-gray-800">{plan.name}</h3><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{plan.category}</span></div>
                        <div className="flex gap-1"><button onClick={() => onEdit(plan)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16} /></button><button onClick={() => onDelete(plan.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button></div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between"><span>Min Invest:</span><span className="font-semibold">₹{plan.minInvestment}</span></div>
                        <div className="flex justify-between"><span>Daily Return:</span><span className="font-semibold">₹{plan.dailyReturn}</span></div>
                        <div className="flex justify-between"><span>Duration:</span><span className="font-semibold">{plan.duration} Days</span></div>
                        <div className="flex justify-between"><span>Total ROI:</span><span className="font-semibold text-green-600">₹{plan.dailyReturn * plan.duration}</span></div>
                        {plan.expirationDate && <div className="flex justify-between text-orange-600"><span>Expires:</span><span>{new Date(plan.expirationDate).toLocaleDateString()}</span></div>}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const LuckyDrawView: FC<{ prizes: Prize[], winningIds: string[], onAdd: () => void, onEdit: (p: Prize) => void, onDelete: (id: string) => void, onToggleWin: (id: string) => void }> = ({ prizes, winningIds, onAdd, onEdit, onDelete, onToggleWin }) => (
    <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex justify-between items-center"><h2 className="text-xl font-semibold text-gray-800">Lucky Draw Prizes</h2><button onClick={onAdd} className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600"><Plus size={18} /> Add Prize</button></div>
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Prize Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Type</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Amount/Value</th><th className="px-6 py-3 text-center text-xs font-medium text-gray-500">Force Win</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Actions</th></tr></thead>
                <tbody className="divide-y divide-gray-200">{prizes.map(prize => (
                    <tr key={prize.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{prize.name}</td>
                        <td className="px-6 py-4 capitalize text-sm text-gray-600">{prize.type}</td>
                        <td className="px-6 py-4 text-sm">{prize.type === 'money' || prize.type === 'bonus' ? `₹${prize.amount}` : '-'}</td>
                        <td className="px-6 py-4 text-center"><input type="checkbox" checked={winningIds.includes(prize.id)} onChange={() => onToggleWin(prize.id)} className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer" /></td>
                        <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => onEdit(prize)} className="text-blue-600 p-1"><Edit size={16} /></button><button onClick={() => onDelete(prize.id)} className="text-red-600 p-1"><Trash2 size={16} /></button></div></td>
                    </tr>
                ))}</tbody>
            </table>
        </div>
    </div>
);

const AdminChatView: FC<{ sessions: ChatSession[], onSelect: (uid: string) => void, activeId: string | null, messages: ChatMessage[], onSend: (text: string, img?: string) => void }> = ({ sessions, onSelect, activeId, messages, onSend }) => {
    const [text, setText] = useState('');
    const [img, setImg] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
    
    return (
        <div className="bg-white rounded-lg shadow flex h-[600px] overflow-hidden">
            <div className="w-1/3 border-r flex flex-col">
                <div className="p-4 border-b font-semibold bg-gray-50">Conversations</div>
                <div className="flex-1 overflow-y-auto">
                    {sessions.map(s => (
                        <div key={s.userId} onClick={() => onSelect(s.userId)} className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${activeId === s.userId ? 'bg-blue-50' : ''}`}>
                            <div className="flex justify-between"><span className="font-medium text-sm text-gray-900 truncate w-24">{s.userId}</span>{s.adminUnreadCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{s.adminUnreadCount}</span>}</div>
                            <p className="text-xs text-gray-500 truncate mt-1">{s.messages[s.messages.length - 1]?.text || 'Image'}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-2/3 flex flex-col">
                {activeId ? <>
                    <div className="p-4 border-b font-semibold flex justify-between"><span>User: {activeId}</span></div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map(m => (
                            <div key={m.id} className={`flex ${m.senderId === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] p-3 rounded-lg ${m.senderId === 'admin' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border rounded-bl-none'}`}>
                                    {m.text && <p className="text-sm">{m.text}</p>}
                                    {m.imageUrl && <img src={m.imageUrl} className="mt-2 rounded max-h-40" alt="attachment" />}
                                    <p className={`text-[10px] mt-1 text-right ${m.senderId === 'admin' ? 'text-blue-100' : 'text-gray-400'}`}>{new Date(m.timestamp).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>
                    <div className="p-4 border-t bg-white">
                        {img && <div className="mb-2 flex items-center gap-2 bg-gray-100 p-2 rounded w-fit"><span className="text-xs">Image attached</span><button onClick={() => setImg(null)}><X size={14}/></button></div>}
                        <div className="flex gap-2">
                            <button onClick={() => fileRef.current?.click()} className="p-2 text-gray-500 hover:bg-gray-100 rounded"><Paperclip size={20} /></button>
                            <input type="file" ref={fileRef} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setImg(ev.target?.result as string); r.readAsDataURL(f); } }} />
                            <input type="text" value={text} onChange={e => setText(e.target.value)} onKeyPress={e => e.key === 'Enter' && !e.shiftKey && (text || img) && (onSend(text, img || undefined), setText(''), setImg(null))} className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Type a message..." />
                            <button onClick={() => (text || img) && (onSend(text, img || undefined), setText(''), setImg(null))} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"><Send size={20} /></button>
                        </div>
                    </div>
                </> : <div className="flex-1 flex items-center justify-center text-gray-400">Select a conversation</div>}
            </div>
        </div>
    );
};

const EmployeeChatView: FC<{ username: string, session: ChatSession | undefined, onSend: (text: string, img?: string) => void }> = ({ username, session, onSend }) => {
    const [text, setText] = useState('');
    const [img, setImg] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    
    const messages = session?.messages || [];
    
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    return (
        <div className="bg-white rounded-lg shadow flex flex-col h-[600px]">
            <div className="p-4 border-b font-semibold bg-gray-50 flex justify-between items-center">
                <span>Chat with Super Admin</span>
                <div className="text-xs text-gray-500">You are logged in as: {username}</div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 && <div className="text-center text-gray-400 py-10">No messages yet. Start chatting with Admin.</div>}
                {messages.map(m => (
                    <div key={m.id} className={`flex ${m.senderId === username ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-lg ${m.senderId === username ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border rounded-bl-none'}`}>
                            {m.text && <p className="text-sm">{m.text}</p>}
                            {m.imageUrl && <img src={m.imageUrl} className="mt-2 rounded max-h-40" alt="attachment" />}
                            <p className={`text-[10px] mt-1 text-right ${m.senderId === username ? 'text-blue-100' : 'text-gray-400'}`}>{new Date(m.timestamp).toLocaleTimeString()}</p>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
            <div className="p-4 border-t bg-white">
                {img && <div className="mb-2 flex items-center gap-2 bg-gray-100 p-2 rounded w-fit"><span className="text-xs">Image attached</span><button onClick={() => setImg(null)}><X size={14}/></button></div>}
                <div className="flex gap-2">
                    <button onClick={() => fileRef.current?.click()} className="p-2 text-gray-500 hover:bg-gray-100 rounded"><Paperclip size={20} /></button>
                    <input type="file" ref={fileRef} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setImg(ev.target?.result as string); r.readAsDataURL(f); } }} />
                    <input type="text" value={text} onChange={e => setText(e.target.value)} onKeyPress={e => e.key === 'Enter' && !e.shiftKey && (text || img) && (onSend(text, img || undefined), setText(''), setImg(null))} className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Type a message..." />
                    <button onClick={() => (text || img) && (onSend(text, img || undefined), setText(''), setImg(null))} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"><Send size={20} /></button>
                </div>
            </div>
        </div>
    );
};

const CommentsManagementView: FC<{ comments: Comment[], onDelete: (id: string) => void, onEdit: (comment: Comment) => void, setViewingImage: (url: string) => void }> = ({ comments, onDelete, onEdit, setViewingImage }) => (
    <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b"><h2 className="text-xl font-semibold text-gray-800">User Comments</h2></div>
        <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">User</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Comment</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Images</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Date</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th></tr></thead>
                <tbody className="divide-y divide-gray-200">{comments.length > 0 ? comments.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">{c.userAvatar && <img src={c.userAvatar} className="w-full h-full object-cover"/>}</div><div><p className="text-sm font-medium">{c.userName}</p><p className="text-xs text-gray-500">{c.maskedPhone}</p></div></div></td>
                        <td className="px-6 py-4 text-sm max-w-xs truncate">{c.text}</td>
                        <td className="px-6 py-4 flex gap-1">{c.images.map((img, i) => <button key={i} onClick={() => setViewingImage(img)}><img src={img} className="w-8 h-8 rounded object-cover border"/></button>)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(c.timestamp).toLocaleDateString()}</td>
                        <td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => onEdit(c)} className="text-blue-600 p-1"><Edit size={16} /></button><button onClick={() => onDelete(c.id)} className="text-red-600 p-1"><Trash2 size={16} /></button></div></td>
                    </tr>
                )) : <tr><td colSpan={5} className="p-8 text-center text-gray-500">No comments.</td></tr>}</tbody>
            </table>
        </div>
    </div>
);

const SystemLogsView: FC<{ logs: ActivityLogEntry[] }> = ({ logs }) => (
    <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b"><h2 className="text-xl font-semibold text-gray-800">System Activity Logs</h2></div>
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Time</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">User</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Action</th></tr></thead>
                <tbody className="divide-y divide-gray-200">
                    {logs.length > 0 ? logs.map(log => (
                        <tr key={log.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-500">{log.timestamp.toLocaleString()}</td>
                            <td className="px-6 py-4"><div className="flex items-center gap-2"><span className="font-medium text-gray-900">{log.userName}</span><span className="text-xs text-gray-400">({log.userId.substring(0, 6)})</span></div></td>
                            <td className="px-6 py-4 text-sm text-gray-700">{log.action}</td>
                        </tr>
                    )) : <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No logs found.</td></tr>}
                </tbody>
            </table>
        </div>
    </div>
);

const EmployeeManagementView: FC<{ 
    employees: Employee[], 
    onAdd: () => void, 
    onEdit: (e: Employee) => void, 
    onDelete: (id: string) => void 
}> = ({ employees, onAdd, onEdit, onDelete }) => (
    <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Employee Management</h2>
            <button onClick={onAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                <UserPlus size={18} /> Add Employee
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {employees.map(emp => (
                        <tr key={emp.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{emp.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{emp.username}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${emp.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {emp.role}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${emp.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {emp.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                {emp.username === 'admin' ? (
                                    <span className="text-xs text-gray-400 italic">Super Admin</span>
                                ) : (
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => onEdit(emp)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => onDelete(emp.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// --- MAIN COMPONENT ---

const AdminDashboard: React.FC = () => {
    const { 
        users, admin, adminLogout, appName, updateAppName, appLogo, updateAppLogo, themeColor, updateThemeColor,
        socialLinks, updateSocialLinks, addNotification, showConfirmation,
        investmentPlans, addInvestmentPlan, updateInvestmentPlan, deleteInvestmentPlan,
        luckyDrawPrizes, luckyDrawWinningPrizeIds, addLuckyDrawPrize, updateLuckyDrawPrize, deleteLuckyDrawPrize, setLuckyDrawWinningPrizes,
        paymentSettings, updatePaymentSettings,
        chatSessions, sendChatMessage, markChatAsRead,
        comments, deleteComment, updateComment,
        financialRequests, financialHistory, fetchFinancialRequests, fetchFinancialHistory, approveFinancialRequest, rejectFinancialRequest, distributeDailyEarnings,
        updateUser, deleteUser, loginAsUserFunc, changeAdminPassword, activityLog, setActivityLog, systemNotice, updateSystemNotice,
        fetchAllUsers, addUser,
        uninstallUserApp, uninstallAllUsersApps, restoreUserApp,
        employees, fetchEmployees, addEmployee, updateEmployee, deleteEmployee
    } = useApp() as any;

    const [activeView, setActiveView] = useState(admin?.role === 'employee' ? 'financial' : 'dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [viewingImage, setViewingImage] = useState<string | null>(null);
    const [viewingUserInvestments, setViewingUserInvestments] = useState<User | null>(null);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    
    // Modals State
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userForm, setUserForm] = useState({ name: '', phone: '', email: '', balance: 0, password: '' });

    const [showPlanModal, setShowPlanModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null);
    const [planForm, setPlanForm] = useState({ name: '', imageUrl: '', minInvestment: '', dailyReturn: '', duration: '', category: '', expirationDate: '' });

    const [showPrizeModal, setShowPrizeModal] = useState(false);
    const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
    const [prizeForm, setPrizeForm] = useState({ name: '', type: 'money', amount: 0 });

    const [showCommentModal, setShowCommentModal] = useState(false);
    const [editingComment, setEditingComment] = useState<Comment | null>(null);
    const [commentText, setCommentText] = useState('');

    const [activeChatUser, setActiveChatUser] = useState<string | null>(null);
    const [noticeText, setNoticeText] = useState(systemNotice || '');
    const [newPassword, setNewPassword] = useState({ old: '', new: '' });
    
    // Employee Modal
    const [showEmpModal, setShowEmpModal] = useState(false);
    const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
    const [empForm, setEmpForm] = useState({ name: '', username: '', password: '', role: 'employee' });

    useEffect(() => {
        fetchAllUsers();
        fetchFinancialRequests();
        fetchFinancialHistory();
        if (admin.role === 'admin') fetchEmployees();
    }, []);

    // Close notification dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Calculate notifications
    const pDep = financialRequests.filter((r: any) => r.type === 'deposit' && r.status === 'pending').length;
    const pWit = financialRequests.filter((r: any) => r.type === 'withdrawal' && r.status === 'pending').length;
    
    let chatCount = 0;
    if (admin.role === 'admin') {
        chatCount = chatSessions.reduce((acc: number, s: any) => acc + (s.adminUnreadCount || 0), 0);
    } else {
        // Employee looking for messages from Admin
        const mySession = chatSessions.find((s:any) => s.userId === admin.username);
        chatCount = mySession?.userUnreadCount || 0;
    }

    const totalNotifs = pDep + pWit + chatCount;

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'financial', label: 'Financials', icon: TrendingUp },
    ];

    if (admin.role === 'employee') {
        sidebarItems.push({ id: 'admin-chat', label: 'Chat with Admin', icon: MessageSquare });
    }

    if (admin.role === 'admin') {
        sidebarItems.push(
            { id: 'users', label: 'Users', icon: Users },
            { id: 'plans', label: 'Plans', icon: Briefcase },
            { id: 'lucky-draw', label: 'Lucky Draw', icon: Gift },
            { id: 'comments', label: 'Comments', icon: MessageSquare },
            { id: 'chat', label: 'Chat', icon: MessageSquare },
            { id: 'employees', label: 'Employees', icon: Shield },
            { id: 'logs', label: 'System Logs', icon: History },
            { id: 'settings', label: 'Settings', icon: Settings }
        );
    }

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard': return <DashboardView requests={financialRequests} role={admin.role} />;
            case 'financial': return <FinancialManagementView requests={financialRequests} history={financialHistory} users={users} onApprove={approveFinancialRequest} onReject={rejectFinancialRequest} onViewProof={setViewingImage} onDistribute={distributeDailyEarnings} />;
            case 'users': return <UserManagementView users={users} onAdd={() => { setEditingUser(null); setUserForm({ name: '', phone: '', email: '', balance: 0, password: '' }); setShowUserModal(true); }} onEdit={(u) => { setEditingUser(u); setUserForm({ name: u.name, phone: u.phone, email: u.email || '', balance: u.balance, password: u.password || '' }); setShowUserModal(true); }} onToggle={(u) => updateUser(u.id, { isActive: !u.isActive })} onDelete={(id) => showConfirmation('Delete User?', 'This action cannot be undone.', () => deleteUser(id))} onLoginAs={loginAsUserFunc} onViewInvestments={setViewingUserInvestments} onUninstall={(id) => showConfirmation('Uninstall App?', 'Revoke access for this user?', () => uninstallUserApp(id))} onRestore={restoreUserApp} />;
            case 'plans': return <PlanManagementView plans={investmentPlans} onAdd={() => { setEditingPlan(null); setPlanForm({ name: '', imageUrl: '', minInvestment: '', dailyReturn: '', duration: '', category: '', expirationDate: '' }); setShowPlanModal(true); }} onEdit={(p) => { setEditingPlan(p); setPlanForm({ name: p.name, imageUrl: p.imageUrl || '', minInvestment: String(p.minInvestment), dailyReturn: String(p.dailyReturn), duration: String(p.duration), category: p.category, expirationDate: p.expirationDate || '' }); setShowPlanModal(true); }} onDelete={(id) => showConfirmation('Delete Plan?', 'Users will no longer be able to invest.', () => deleteInvestmentPlan(id))} />;
            case 'lucky-draw': return <LuckyDrawView prizes={luckyDrawPrizes} winningIds={luckyDrawWinningPrizeIds} onAdd={() => { setEditingPrize(null); setPrizeForm({ name: '', type: 'money', amount: 0 }); setShowPrizeModal(true); }} onEdit={(p) => { setEditingPrize(p); setPrizeForm({ name: p.name, type: p.type as any, amount: p.amount }); setShowPrizeModal(true); }} onDelete={(id) => showConfirmation('Delete Prize?', 'This prize will be removed.', () => deleteLuckyDrawPrize(id))} onToggleWin={(id) => { const newIds = luckyDrawWinningPrizeIds.includes(id) ? luckyDrawWinningPrizeIds.filter((i:any) => i !== id) : [...luckyDrawWinningPrizeIds, id]; setLuckyDrawWinningPrizes(newIds); }} />;
            case 'comments': return <CommentsManagementView comments={comments} onDelete={(id) => showConfirmation('Delete Comment?', 'Are you sure?', () => deleteComment(id))} onEdit={(c) => { setEditingComment(c); setCommentText(c.text); setShowCommentModal(true); }} setViewingImage={setViewingImage} />;
            case 'chat': return <AdminChatView sessions={chatSessions} onSelect={(uid) => { setActiveChatUser(uid); markChatAsRead(uid); }} activeId={activeChatUser} messages={activeChatUser ? (chatSessions.find((s:any) => s.userId === activeChatUser)?.messages || []) : []} onSend={(text, img) => { if (activeChatUser) sendChatMessage(activeChatUser, { text, imageUrl: img }); }} />;
            case 'admin-chat': return <EmployeeChatView username={admin.username} session={chatSessions.find((s:any) => s.userId === admin.username)} onSend={(text, img) => sendChatMessage(admin.username, { text, imageUrl: img })} />;
            case 'employees': return <EmployeeManagementView employees={employees} onAdd={() => { setEditingEmp(null); setEmpForm({ name: '', username: '', password: '', role: 'employee' }); setShowEmpModal(true); }} onEdit={(e) => { setEditingEmp(e); setEmpForm({ name: e.name, username: e.username, password: e.password || '', role: e.role }); setShowEmpModal(true); }} onDelete={(id) => showConfirmation('Delete Employee?', 'Access will be revoked.', () => deleteEmployee(id))} />;
            case 'logs': return <SystemLogsView logs={activityLog} />;
            case 'settings': return (
                <div className="bg-white rounded-lg shadow p-6 space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-bold border-b pb-2">App Config</h3>
                            <div><label className="text-sm font-medium">App Name</label><input type="text" value={appName} onChange={e => updateAppName(e.target.value)} className="w-full border p-2 rounded mt-1" /></div>
                            <div><label className="text-sm font-medium">App Logo URL</label><input type="text" value={appLogo || ''} onChange={e => updateAppLogo(e.target.value)} className="w-full border p-2 rounded mt-1" /></div>
                            <div><label className="text-sm font-medium">Theme Color</label><div className="flex gap-2 mt-2">{themeOptions.map(t => <button key={t.name} onClick={() => updateThemeColor(t.name)} className={`w-8 h-8 rounded-full ${t.bgClass} ${themeColor === t.name ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`} />)}</div></div>
                            <div><label className="text-sm font-medium">System Notice</label><textarea value={noticeText} onChange={e => setNoticeText(e.target.value)} className="w-full border p-2 rounded mt-1 h-24" /><button onClick={() => updateSystemNotice(noticeText)} className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm">Update Notice</button></div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-bold border-b pb-2">Social Links</h3>
                            <div><label className="text-sm font-medium">Telegram</label><input type="text" value={socialLinks.telegram} onChange={e => updateSocialLinks({ ...socialLinks, telegram: e.target.value })} className="w-full border p-2 rounded mt-1" /></div>
                            <div><label className="text-sm font-medium">WhatsApp</label><input type="text" value={socialLinks.whatsapp} onChange={e => updateSocialLinks({ ...socialLinks, whatsapp: e.target.value })} className="w-full border p-2 rounded mt-1" /></div>
                        </div>
                    </div>
                    <div className="border-t pt-6">
                         <h3 className="font-bold mb-4">Payment Methods</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {paymentSettings.paymentMethods.map((m: any, idx: number) => (
                                <div key={m.id} className="border p-4 rounded flex justify-between items-center">
                                    <div><p className="font-bold">{m.name}</p><p className="text-xs text-gray-500">{m.upiId}</p></div>
                                    <button onClick={() => { const newM = [...paymentSettings.paymentMethods]; newM.splice(idx, 1); updatePaymentSettings({ paymentMethods: newM }); }} className="text-red-500"><Trash2 size={16}/></button>
                                </div>
                            ))}
                         </div>
                         <button onClick={() => { const newM = [...paymentSettings.paymentMethods, { id: Date.now().toString(), name: 'New Method', upiId: '', qrCode: '', isActive: true }]; updatePaymentSettings({ paymentMethods: newM }); }} className="mt-4 bg-green-500 text-white px-4 py-2 rounded text-sm">Add Method</button>
                    </div>
                </div>
            );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {viewingImage && <ImagePreviewModal imageUrl={viewingImage} onClose={() => setViewingImage(null)} />}
            {viewingUserInvestments && <UserInvestmentsModal user={viewingUserInvestments} onClose={() => setViewingUserInvestments(null)} />}
            
            {/* User Modal */}
            {showUserModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 space-y-4">
                        <h3 className="font-bold">{editingUser ? 'Edit User' : 'Add User'}</h3>
                        <input placeholder="Name" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} className="w-full border p-2 rounded" />
                        <input placeholder="Phone" value={userForm.phone} onChange={e => setUserForm({...userForm, phone: e.target.value})} className="w-full border p-2 rounded" />
                        <input placeholder="Password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="w-full border p-2 rounded" />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowUserModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                            <button onClick={() => { editingUser ? updateUser(editingUser.id, userForm) : addUser(userForm); setShowUserModal(false); }} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Employee Modal */}
            {showEmpModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 space-y-4">
                        <h3 className="font-bold">{editingEmp ? 'Edit Employee' : 'Add Employee'}</h3>
                        <input placeholder="Name" value={empForm.name} onChange={e => setEmpForm({...empForm, name: e.target.value})} className="w-full border p-2 rounded" />
                        <input placeholder="Username" value={empForm.username} onChange={e => setEmpForm({...empForm, username: e.target.value})} className="w-full border p-2 rounded" />
                        <input placeholder="Password" type="password" value={empForm.password} onChange={e => setEmpForm({...empForm, password: e.target.value})} className="w-full border p-2 rounded" />
                        <select value={empForm.role} onChange={e => setEmpForm({...empForm, role: e.target.value as 'admin' | 'employee'})} className="w-full border p-2 rounded">
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                        </select>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowEmpModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                            <button onClick={() => { editingEmp ? updateEmployee(editingEmp.id, empForm) : addEmployee(empForm); setShowEmpModal(false); }} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Plan Modal */}
            {showPlanModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 space-y-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="font-bold">{editingPlan ? 'Edit Plan' : 'Add Plan'}</h3>
                        <input placeholder="Name" value={planForm.name} onChange={e => setPlanForm({...planForm, name: e.target.value})} className="w-full border p-2 rounded" />
                        <input placeholder="Image URL" value={planForm.imageUrl} onChange={e => setPlanForm({...planForm, imageUrl: e.target.value})} className="w-full border p-2 rounded" />
                        <input placeholder="Min Investment" type="number" value={planForm.minInvestment} onChange={e => setPlanForm({...planForm, minInvestment: e.target.value})} className="w-full border p-2 rounded" />
                        <input placeholder="Daily Return" type="number" value={planForm.dailyReturn} onChange={e => setPlanForm({...planForm, dailyReturn: e.target.value})} className="w-full border p-2 rounded" />
                        <input placeholder="Duration (Days)" type="number" value={planForm.duration} onChange={e => setPlanForm({...planForm, duration: e.target.value})} className="w-full border p-2 rounded" />
                        <input placeholder="Category" value={planForm.category} onChange={e => setPlanForm({...planForm, category: e.target.value})} className="w-full border p-2 rounded" />
                         <input placeholder="Expiration (Optional)" type="date" value={planForm.expirationDate ? planForm.expirationDate.split('T')[0] : ''} onChange={e => setPlanForm({...planForm, expirationDate: e.target.value})} className="w-full border p-2 rounded" />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowPlanModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                            <button onClick={() => { 
                                const p = { ...planForm, minInvestment: Number(planForm.minInvestment), dailyReturn: Number(planForm.dailyReturn), duration: Number(planForm.duration) };
                                editingPlan ? updateInvestmentPlan(editingPlan.id, p) : addInvestmentPlan(p); setShowPlanModal(false); 
                            }} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 bg-gray-900 text-white w-64 transform transition-transform duration-200 z-30 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <h1 className="text-xl font-bold">{appName} Admin</h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden"><X size={24} /></button>
                </div>
                <nav className="p-4 space-y-2">
                    {sidebarItems.map(item => (
                        <button key={item.id} onClick={() => { setActiveView(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeView === item.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                    <button onClick={adminLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-500 mt-8">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center z-20">
                    <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2"><Menu size={24} /></button>
                    <h2 className="text-xl font-semibold capitalize text-gray-800 ml-2 md:ml-0">{activeView.replace('-', ' ')}</h2>
                    <div className="flex items-center gap-4">
                        {/* Notification Bell */}
                        <div className="relative" ref={notifRef}>
                            <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                                <Bell size={24} />
                                {totalNotifs > 0 && (
                                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold ring-2 ring-white">
                                        {totalNotifs > 9 ? '9+' : totalNotifs}
                                    </span>
                                )}
                            </button>
                            
                            {showNotifDropdown && (
                                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up">
                                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                                        {totalNotifs > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">{totalNotifs} New</span>}
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {totalNotifs === 0 ? (
                                            <div className="p-8 text-center text-gray-500 text-sm">
                                                <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Bell size={20} className="text-gray-400" />
                                                </div>
                                                <p>All caught up!</p>
                                                <p className="text-xs mt-1">No new tasks pending.</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-gray-50">
                                                {pDep > 0 && (
                                                    <button onClick={() => { setActiveView('financial'); setShowNotifDropdown(false); }} className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center gap-3 group">
                                                        <div className="bg-green-100 p-2 rounded-lg text-green-600 group-hover:bg-green-200 transition-colors">
                                                            <ArrowDownCircle size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-800">{pDep} Pending Deposit{pDep > 1 ? 's' : ''}</p>
                                                            <p className="text-xs text-gray-500 mt-0.5">Action required</p>
                                                        </div>
                                                    </button>
                                                )}
                                                {pWit > 0 && (
                                                    <button onClick={() => { setActiveView('financial'); setShowNotifDropdown(false); }} className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center gap-3 group">
                                                        <div className="bg-red-100 p-2 rounded-lg text-red-600 group-hover:bg-red-200 transition-colors">
                                                            <ArrowUpCircle size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-800">{pWit} Pending Withdrawal{pWit > 1 ? 's' : ''}</p>
                                                            <p className="text-xs text-gray-500 mt-0.5">Action required</p>
                                                        </div>
                                                    </button>
                                                )}
                                                {chatCount > 0 && (
                                                    <button onClick={() => { setActiveView(admin.role === 'admin' ? 'chat' : 'admin-chat'); setShowNotifDropdown(false); }} className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center gap-3 group">
                                                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:bg-blue-200 transition-colors">
                                                            <MessageSquare size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-800">{chatCount} Unread Message{chatCount > 1 ? 's' : ''}</p>
                                                            <p className="text-xs text-gray-500 mt-0.5">Check inbox</p>
                                                        </div>
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-900">{admin.username}</p>
                            <p className="text-xs text-green-500">Online</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">{admin.username[0].toUpperCase()}</div>
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
