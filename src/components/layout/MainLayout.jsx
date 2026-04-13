import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell, LayoutDashboard, Package, ShoppingCart, Briefcase, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants';
import { useChat } from '@/contexts/ChatContext';

const MainLayout = () => {
  const { user } = useAuth();
  const { unreadCount } = useChat();
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === ROUTES.DASHBOARD) return 'Dashboard';
    if (path === ROUTES.PRODUCTS) return 'Products';
    if (path === ROUTES.ORDERS) return 'Orders';
    if (path === ROUTES.SERVICES) return 'Services';
    if (path === ROUTES.MESSAGES) return 'Messages';
    if (path === ROUTES.PROFILE) return 'Profile';
    if (path === ROUTES.SETTINGS) return 'Settings';
    if (path === ROUTES.TRANSACTIONS) return 'Transactions';
    return 'Dashboard';
  };

  const getInitials = () => {
    if (!user) return 'U';
    return `${user.firstname?.[0] || ''}${user.lastname?.[0] || ''}`.toUpperCase();
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: ROUTES.DASHBOARD },
    { name: 'Products', icon: Package, path: ROUTES.PRODUCTS },
    { name: 'Orders', icon: ShoppingCart, path: ROUTES.ORDERS },
    { name: 'Services', icon: Briefcase, path: ROUTES.SERVICES },
    { name: 'Messages', icon: MessageSquare, path: ROUTES.MESSAGES },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">{getPageTitle()}</h1>
          <div className="flex items-center gap-3">
            {/* <button className="relative p-2 hover:bg-gray-100 rounded-full">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full"></span>
            </button> */}
            <Avatar className="w-9 h-9 cursor-pointer" onClick={() => navigate(ROUTES.PROFILE)}>
              <AvatarFallback className="bg-primary text-white text-sm font-medium">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Footer Navigation */}
      <footer className="bg-white border-t border-border sticky bottom-0 z-10">
        <nav className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex flex-col items-center gap-1 px-1 sm:px-4 py-2 rounded-lg transition-colors relative',
                  isActive
                    ? 'text-primary bg-primary/5'
                    : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                )}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.name === 'Messages' && unreadCount.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 bg-secondary text-white text-[10px] font-bold rounded-full">
                      {unreadCount.length > 99 ? '99+' : unreadCount.length}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </footer>
    </div>
  );
};

export default MainLayout;
