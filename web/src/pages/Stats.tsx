import React from 'react';
import { Activity, BarChart2, Clock, Film, Tv, Calendar, Star, CircleUser } from 'lucide-react';
import { mockGetUserStats } from '../utils/mockData';

const Stats: React.FC = () => {
  const stats = mockGetUserStats();
  
  // Months for the watch history calendar
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Create a grid for the calendar
  const createCalendarGrid = () => {
    // This is a simplified version - in a real app, we would use more complex logic
    const grid = [];
    
    // Create 12 months with 4 rows each (simplified)
    for (let month = 0; month < 12; month++) {
      const monthDays = [];
      
      // Each month has 4 weeks (simplified)
      for (let week = 0; week < 4; week++) {
        const days = [];
        
        // Each week has 7 days
        for (let day = 0; day < 7; day++) {
          // Random activity for demo purposes
          const activity = Math.floor(Math.random() * 4);
          days.push(activity);
        }
        
        monthDays.push(days);
      }
      
      grid.push(monthDays);
    }
    
    return grid;
  };
  
  const calendarGrid = createCalendarGrid();

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col items-start justify-between gap-4 mb-8 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold text-white">Your Watching Statistics</h1>
        <div className="flex gap-2">
          <select className="bg-gray-700 border-gray-600 rounded-md text-white px-3 py-2">
            <option value="all_time">All Time</option>
            <option value="this_year">This Year</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 flex items-center">
          <div className="h-12 w-12 rounded-full bg-blue-900 flex items-center justify-center mr-4">
            <Clock className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Watch Time</p>
            <p className="text-2xl font-bold">{Math.floor(stats.totalWatchTime / 60)} hours</p>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 flex items-center">
          <div className="h-12 w-12 rounded-full bg-green-900 flex items-center justify-center mr-4">
            <Film className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Movies Watched</p>
            <p className="text-2xl font-bold">{stats.moviesWatched}</p>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 flex items-center">
          <div className="h-12 w-12 rounded-full bg-purple-900 flex items-center justify-center mr-4">
            <Tv className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">TV Episodes</p>
            <p className="text-2xl font-bold">{stats.episodesWatched}</p>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 flex items-center">
          <div className="h-12 w-12 rounded-full bg-yellow-900 flex items-center justify-center mr-4">
            <Star className="h-6 w-6 text-yellow-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Average Rating</p>
            <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}<span className="text-sm text-gray-400">/5</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart2 className="mr-2 h-5 w-5 text-blue-400" />
              Watch Time Distribution
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-400 mb-3">By Content Type</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-900 text-blue-300">
                        Movies
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-300">
                        30%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                    <div style={{ width: "30%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                  </div>
                  
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-purple-900 text-purple-300">
                        TV Shows
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-purple-300">
                        70%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                    <div style={{ width: "70%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Watching Habits</h3>
                <div className="flex flex-col h-32 justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekdays</span>
                    <div className="w-2/3 bg-gray-700 rounded-full h-2.5">
                      <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                    <span className="text-sm">65%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekends</span>
                    <div className="w-2/3 bg-gray-700 rounded-full h-2.5">
                      <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                    <span className="text-sm">35%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Morning</span>
                    <div className="w-2/3 bg-gray-700 rounded-full h-2.5">
                      <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                    <span className="text-sm">15%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Evening</span>
                    <div className="w-2/3 bg-gray-700 rounded-full h-2.5">
                      <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                    <span className="text-sm">85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-green-400" />
              Watch Activity Calendar
            </h2>
            
            <div className="overflow-x-auto">
              <div className="grid grid-rows-7 grid-flow-col gap-1 min-w-[700px]">
                <div className="flex justify-start gap-1 col-span-12">
                  {months.map((month) => (
                    <div key={month} className="w-16 text-xs text-gray-400 text-center">
                      {month}
                    </div>
                  ))}
                </div>
                
                {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
                  <div key={dayIndex} className="flex gap-1">
                    {calendarGrid.map((month, monthIndex) => (
                      month.map((week, weekIndex) => (
                        <div 
                          key={`${monthIndex}-${weekIndex}-${dayIndex}`}
                          className={`w-3 h-3 rounded-sm ${
                            week[dayIndex] === 0 ? 'bg-gray-700' : 
                            week[dayIndex] === 1 ? 'bg-green-900' : 
                            week[dayIndex] === 2 ? 'bg-green-700' : 'bg-green-500'
                          }`}
                        ></div>
                      ))
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end mt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-gray-700"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-900"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-700"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                </div>
                <span className="text-xs text-gray-400">More</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Activity className="mr-2 h-5 w-5 text-red-400" />
              Genre Distribution
            </h2>
            
            <div className="space-y-4">
              {stats.favoriteGenres.map((genre) => (
                <div key={genre.genre}>
                  <div className="flex justify-between mb-1">
                    <span>{genre.genre}</span>
                    <span className="text-gray-400">{genre.count} titles</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-red-600 h-2.5 rounded-full" 
                      style={{ width: `${(genre.count / stats.favoriteGenres[0].count) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              
              <div>
                <div className="flex justify-between mb-1">
                  <span>Action</span>
                  <span className="text-gray-400">8 titles</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-red-600 h-2.5 rounded-full" style={{ width: "30%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span>Comedy</span>
                  <span className="text-gray-400">6 titles</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-red-600 h-2.5 rounded-full" style={{ width: "22%" }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CircleUser className="mr-2 h-5 w-5 text-yellow-400" />
              Directors You Love
            </h2>
            
            <div className="space-y-3">
              {["Christopher Nolan", "Martin Scorsese", "Quentin Tarantino", "Denis Villeneuve"].map((director, index) => (
                <div key={director} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                    {director.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{director}</p>
                    <p className="text-gray-400 text-sm">{5 - index} movies watched</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;