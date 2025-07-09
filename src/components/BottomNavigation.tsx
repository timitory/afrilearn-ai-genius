
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, Book, Trophy, Briefcase, User } from 'lucide-react';

interface BottomNavigationProps {
  currentRoute: string;
}

const BottomNavigation = ({ currentRoute }: BottomNavigationProps) => {
  const navigate = useNavigate();

  const tabs = [
    { 
      icon: Home, 
      label: 'Home', 
      route: '/',
      active: currentRoute === '/'
    },
    { 
      icon: Book, 
      label: 'Courses', 
      route: '/courses',
      active: currentRoute === '/courses'
    },
    { 
      icon: Trophy, 
      label: 'Challenges', 
      route: '/challenges',
      active: currentRoute === '/challenges'
    },
    { 
      icon: Briefcase, 
      label: 'Career', 
      route: '/career',
      active: currentRoute === '/career'
    },
    { 
      icon: User, 
      label: 'Profile', 
      route: '/profile',
      active: currentRoute === '/profile'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="grid grid-cols-5 gap-1 p-2">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <Button
              key={tab.route}
              variant="ghost"
              className={`flex flex-col items-center space-y-1 h-auto py-2 ${
                tab.active ? 'text-orange-600' : 'text-gray-500'
              }`}
              onClick={() => navigate(tab.route)}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-xs">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
