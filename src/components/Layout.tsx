
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', roles: ['admin', 'sales_engineer', 'manager', 'viewer'] },
    { name: 'Leads', path: '/leads', roles: ['admin', 'sales_engineer', 'manager', 'viewer'] },
    { name: 'Proposals', path: '/proposals', roles: ['admin', 'sales_engineer', 'manager', 'viewer'] },
    { name: 'Users', path: '/users', roles: ['admin'] },
    { name: 'Reports', path: '/reports', roles: ['admin'] },
    { name: 'Spare Parts', path: '/spare-parts', roles: ['admin', 'sales_engineer'] },
    { name: 'Proposal Templates', path: '/proposal-templates', roles: ['admin', 'sales_engineer', 'manager'] },
  ];

  const filteredNavigation = navigationItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b" style={{ borderColor: '#fd8320' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                src="https://mahajanautomation.com/wp-content/uploads/2023/03/logo-1-284x18.png" 
                alt="Mahajan Automation" 
                className="h-8 mr-4"
              />
              <h1 className="text-2xl font-bold" style={{ color: '#000000' }}>
                Lead CMS
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Button 
                variant="outline" 
                onClick={logout}
                className="border-[#fd8320] text-[#fd8320] hover:bg-[#fd8320] hover:text-white"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen border-r" style={{ borderColor: '#fd8320' }}>
          <div className="py-4">
            {filteredNavigation.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full text-left px-6 py-3 text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-[#fd8320] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {item.name}
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
