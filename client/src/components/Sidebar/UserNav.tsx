import { LogOut, Settings, User } from 'lucide-react';
import { useAuthContext } from '@/context';

export const UserNav = () => {
    const { user, logout } = useAuthContext();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="p-4 border-t border-slate-200" data-testid="user-menu">
            <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <User size={16} />
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-slate-700">{user?.name || 'User Name'}</p>
                    <p className="text-xs text-slate-500">{user?.email || 'user@example.com'}</p>
                </div>
            </div>
            <div className="flex space-x-2">
                <button
                    className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 flex-1 flex items-center justify-center"
                    data-testid="settings-button"
                >
                    <Settings size={16} className="mr-1" />
                    <span className="text-xs">Settings</span>
                </button>
                <button
                    className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 flex-1 flex items-center justify-center"
                    data-testid="logout-button"
                    onClick={handleLogout}
                >
                    <LogOut size={16} className="mr-1" />
                    <span className="text-xs">Logout</span>
                </button>
            </div>
        </div>
    );
};
