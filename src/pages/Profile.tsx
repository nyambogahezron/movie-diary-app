import React, { useState } from 'react';
import { User, Mail, Calendar, Film, Clock, Edit, LogOut, Share2, Settings, Shield } from 'lucide-react';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'privacy'>('profile');

  // Mock user data
  const userData = {
    name: 'Alex Johnson',
    username: 'movielover42',
    email: 'alex@example.com',
    joinDate: 'January 15, 2023',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    watchTime: 15240, // minutes
    moviesWatched: 67,
    tvShowsWatched: 14,
    followers: 28,
    following: 43
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <button className="btn btn-primary flex items-center">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Display Name</p>
                    <p>{userData.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Username</p>
                    <p>@{userData.username}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p>{userData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Member Since</p>
                    <p>{userData.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Account Stats</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                  <p className="text-2xl font-bold">{Math.floor(userData.watchTime / 60)}</p>
                  <p className="text-sm text-gray-400">Hours Watched</p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <Film className="h-6 w-6 mx-auto mb-2 text-green-400" />
                  <p className="text-2xl font-bold">{userData.moviesWatched}</p>
                  <p className="text-sm text-gray-400">Movies Watched</p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <User className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                  <p className="text-2xl font-bold">{userData.followers}</p>
                  <p className="text-sm text-gray-400">Followers</p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <User className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
                  <p className="text-2xl font-bold">{userData.following}</p>
                  <p className="text-sm text-gray-400">Following</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Social</h2>
              
              <div className="flex gap-3">
                <button className="btn bg-gray-700 text-gray-300 flex items-center">
                  <Share2 className="mr-2 h-5 w-5" />
                  Share Profile
                </button>
                
                <button className="btn bg-gray-700 text-gray-300">
                  Find Friends
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'settings':
        return (
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email Notifications</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="notify-reviews"
                        className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700 mr-2" 
                        defaultChecked
                      />
                      <label htmlFor="notify-reviews">Review likes and comments</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="notify-followers"
                        className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700 mr-2" 
                        defaultChecked
                      />
                      <label htmlFor="notify-followers">New followers</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="notify-recommendations"
                        className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700 mr-2" 
                      />
                      <label htmlFor="notify-recommendations">Personalized recommendations</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="notify-newsletter"
                        className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700 mr-2" 
                      />
                      <label htmlFor="notify-newsletter">Weekly newsletter</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
                  <select className="w-full bg-gray-700 border-gray-600 rounded-md px-3 py-2 text-white">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Time Zone</label>
                  <select className="w-full bg-gray-700 border-gray-600 rounded-md px-3 py-2 text-white">
                    <option value="utc">UTC</option>
                    <option value="est">Eastern Standard Time</option>
                    <option value="pst">Pacific Standard Time</option>
                    <option value="gmt">Greenwich Mean Time</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Display Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Theme</label>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-md border-2 border-blue-500">Dark</button>
                    <button className="px-4 py-2 bg-gray-700 text-white rounded-md">Light</button>
                    <button className="px-4 py-2 bg-gray-700 text-white rounded-md">System</button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Default View</label>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-md border-2 border-blue-500">Grid</button>
                    <button className="px-4 py-2 bg-gray-700 text-white rounded-md">List</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-red-500">Danger Zone</h2>
              
              <div className="space-y-4">
                <button className="btn bg-gray-700 text-white flex items-center">
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign Out
                </button>
                
                <button className="btn bg-red-900 text-white hover:bg-red-800">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'privacy':
        return (
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Privacy Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Profile Visibility</label>
                  <select className="w-full bg-gray-700 border-gray-600 rounded-md px-3 py-2 text-white">
                    <option value="public">Public - Anyone can see your profile</option>
                    <option value="followers">Followers Only - Only people who follow you</option>
                    <option value="private">Private - Only you</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Watch History Visibility</label>
                  <select className="w-full bg-gray-700 border-gray-600 rounded-md px-3 py-2 text-white">
                    <option value="public">Public - Anyone can see what you've watched</option>
                    <option value="followers">Followers Only - Only people who follow you</option>
                    <option value="private">Private - Only you</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Show Activity Status</label>
                  <div className="flex items-center mt-2">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        id="activity-status" 
                        name="activity-status" 
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        defaultChecked
                      />
                      <label 
                        htmlFor="activity-status" 
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer"
                      ></label>
                    </div>
                    <label htmlFor="activity-status">Show when you're active on the platform</label>
                  </div>
                </div>
                
                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Data Usage</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="personalization"
                        className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700 mr-2" 
                        defaultChecked
                      />
                      <label htmlFor="personalization">Use my watch history for personalized recommendations</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="analytics"
                        className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700 mr-2" 
                        defaultChecked
                      />
                      <label htmlFor="analytics">Allow anonymous usage analytics</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Data Export & Management</h2>
              
              <div className="space-y-4">
                <button className="btn bg-gray-700 text-white">
                  Download My Data
                </button>
                
                <button className="btn bg-gray-700 text-white">
                  Review App Permissions
                </button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img 
            src={userData.avatar} 
            alt={userData.name} 
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-700"
          />
          
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            <p className="text-gray-400">@{userData.username}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
              <div className="text-center">
                <p className="text-lg font-semibold">{userData.moviesWatched}</p>
                <p className="text-sm text-gray-400">Movies</p>
              </div>
              
              <div className="text-center">
                <p className="text-lg font-semibold">{userData.tvShowsWatched}</p>
                <p className="text-sm text-gray-400">TV Shows</p>
              </div>
              
              <div className="text-center">
                <p className="text-lg font-semibold">{userData.followers}</p>
                <p className="text-sm text-gray-400">Followers</p>
              </div>
              
              <div className="text-center">
                <p className="text-lg font-semibold">{userData.following}</p>
                <p className="text-sm text-gray-400">Following</p>
              </div>
            </div>
          </div>
          
          <div className="flex-grow"></div>
          
          <button className="btn btn-primary">
            Follow
          </button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <div className="bg-gray-800 rounded-lg overflow-hidden sticky top-24">
            <div className="p-4 border-b border-gray-700">
              <h2 className="font-semibold">Account</h2>
            </div>
            
            <nav className="space-y-1 p-2">
              <button 
                className={`w-full flex items-center px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'profile' ? 'bg-blue-900 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <User className="h-5 w-5 mr-3" />
                Profile
              </button>
              
              <button 
                className={`w-full flex items-center px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'settings' ? 'bg-blue-900 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </button>
              
              <button 
                className={`w-full flex items-center px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'privacy' ? 'bg-blue-900 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('privacy')}
              >
                <Shield className="h-5 w-5 mr-3" />
                Privacy
              </button>
            </nav>
          </div>
        </div>
        
        <div className="lg:w-3/4">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;