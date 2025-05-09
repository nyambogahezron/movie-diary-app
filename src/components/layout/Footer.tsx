import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-white">Movie Diary</h3>
            <p className="text-gray-400 text-sm mt-1">Track, rate, and discover your next favorite show.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">About</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms</a>
            </div>
            
            <div className="flex items-center text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 mx-1 text-red-500" />
              <span>for movie lovers</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Movie Diary. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;