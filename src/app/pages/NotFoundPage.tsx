import React from 'react';
import { Link } from 'react-router';
import { useApp } from '../context/AppContext';
import { AlertCircle, Home, Search } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function NotFoundPage() {
  const { isDarkMode } = useApp();

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-red-50 to-white'}`}>
      <div className="text-center max-w-md">
        <div className="bg-red-100 dark:bg-red-900/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-12 h-12 text-red-600" />
        </div>
        
        <h1 className={`text-6xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>404</h1>
        <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Page Not Found
        </h2>
        <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link to="/map">
            <Button variant="outline" className={`w-full sm:w-auto ${isDarkMode ? 'border-gray-600 text-gray-300' : ''}`}>
              <Search className="w-4 h-4 mr-2" />
              Find Blood
            </Button>
          </Link>
        </div>

        <div className="mt-12">
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Need help? Visit our{' '}
            <Link to="/about" className="text-red-600 hover:text-red-700 font-medium">
              About page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
