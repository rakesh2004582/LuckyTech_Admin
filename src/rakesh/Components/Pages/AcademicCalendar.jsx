// AcademicCalendar.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Users, BookOpen, Award, Home, X, Clock, MapPin } from 'lucide-react';
import { academicEvents as AllEvent } from '../../data/academicEvents';

const AcademicCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'academic',
    date: '',
    description: '',
    location: ''
  });
  const [activeTab, setActiveTab] = useState('all');
  const [academicEvents, setAcademicEvents] = useState(AllEvent);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('academicEvents', JSON.stringify(academicEvents));
  }, [academicEvents]);

  // Load events from localStorage on initial render
  useEffect(() => {
    const savedEvents = localStorage.getItem('academicEvents');
    if (savedEvents) {
      setAcademicEvents(JSON.parse(savedEvents));
    }
  }, []);

  const getEventColor = (type) => {
    switch (type) {
      case 'academic': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'exam': return 'bg-red-100 text-red-800 border-red-200';
      case 'event': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'holiday': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const hasEventsOnDate = (dateStr) => {
    return academicEvents.some(event => event.date === dateStr);
  };

  const getEventsForDate = (dateStr) => {
    return academicEvents
      .filter(event => event.date === dateStr)
      .map(event => ({ ...event, color: getEventColor(event.type) }));
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleAddEvent = () => {
    if (newEvent.title.trim() && newEvent.date) {
      const newEventObj = {
        id: academicEvents.length > 0 ? Math.max(...academicEvents.map(e => e.id)) + 1 : 1,
        ...newEvent
      };
      
      // Add to state
      setAcademicEvents(prev => [...prev, newEventObj]);
      
      // Reset form
      setShowAddEvent(false);
      setNewEvent({ 
        title: '', 
        type: 'academic', 
        date: '', 
        description: '', 
        location: '' 
      });
    }
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const daysArray = [];
    
    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(<div key={`empty-${i}`} className="h-16 border border-gray-100 bg-gray-50"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = formatDate(date);
      const isCurrentDay = isToday(date);
      const dayHasEvents = hasEventsOnDate(dateStr);
      const dayOfWeek = date.getDay();
      const isSunday = dayOfWeek === 0;
      
      daysArray.push(
        <div
          key={day}
          className={`h-16 border border-gray-100 p-1 cursor-pointer transition-all duration-200 hover:bg-indigo-50 relative
            ${isSunday ? 'bg-red-50/50' : ''}
            ${isCurrentDay ? 'ring-2 ring-blue-400 bg-blue-50' : ''}
          `}
          onClick={() => setSelectedDate({ day, month, year })}
        >
          <div className={`text-sm font-medium text-center pt-1 ${
            isCurrentDay ? 'text-blue-700 font-bold' : 
            isSunday ? 'text-red-600' : 'text-gray-700'
          }`}>
            {day}
          </div>
          {dayHasEvents && (
            <div className="flex justify-center mt-1">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
            </div>
          )}
          {isCurrentDay && (
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></div>
          )}
        </div>
      );
    }
    
    return daysArray;
  };

  // Get today's events
  const today = new Date();
  const todayStr = formatDate(today);
  const todayEvents = getEventsForDate(todayStr);

  // Get selected date's events (if any)
  let selectedDateStr = null;
  let selectedEvents = [];
  if (selectedDate) {
    const { day, month, year } = selectedDate;
    const date = new Date(year, month, day);
    selectedDateStr = formatDate(date);
    selectedEvents = getEventsForDate(selectedDateStr);
  }

  // Stats: Count all events (full year)
  const stats = {
    academic: academicEvents.filter(e => e.type === 'academic').length,
    exam: academicEvents.filter(e => e.type === 'exam').length,
    holiday: academicEvents.filter(e => e.type === 'holiday').length,
    event: academicEvents.filter(e => e.type === 'event').length,
  };

  // Filter events by active tab
  const filteredEvents = activeTab === 'all' 
    ? academicEvents 
    : academicEvents.filter(event => event.type === activeTab);

  // Event type configuration
  const eventTypeConfig = {
    academic: { label: 'Academic Events', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100' },
    exam: { label: 'Exams', icon: Users, color: 'text-red-600', bg: 'bg-red-100' },
    holiday: { label: 'Holidays', icon: Home, color: 'text-green-600', bg: 'bg-green-100' },
    event: { label: 'Special Events', icon: Award, color: 'text-purple-600', bg: 'bg-purple-100' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Calendar className="w-9 h-9 text-indigo-700" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Academic Calendar</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore all academic events, exams, holidays, and special occasions throughout the year.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              {/* Calendar Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 md:p-6 text-white">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Next month"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Calendar Days Header */}
              <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                {days.map((day, index) => (
                  <div 
                    key={index} 
                    className={`py-3 text-center font-semibold text-sm ${
                      index === 0 ? 'text-red-600 bg-red-50' : 'text-gray-700'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {renderCalendarDays()}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Events */}
            <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Today’s Events
              </h3>
              {todayEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-3 text-sm">No events today</p>
              ) : (
                todayEvents.map(event => (
                  <div key={event.id} className="mb-2 last:mb-0">
                    <div className={`px-3 py-1.5 rounded-md text-xs font-medium ${event.color}`}>
                      {event.title}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Selected Date Events */}
            {selectedDate && (
              <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-gray-800">
                    {months[selectedDate.month]} {selectedDate.day}, {selectedDate.year}
                  </h3>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Clear selection"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {selectedEvents.length === 0 ? (
                  <p className="text-gray-500 text-center py-3 text-sm">No events on this date</p>
                ) : (
                  selectedEvents.map(event => (
                    <div key={event.id} className="mb-2 last:mb-0">
                      <div className={`px-3 py-1.5 rounded-md text-xs font-medium ${event.color}`}>
                        {event.title}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Quick Stats - FULL YEAR */}
            <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Academic Overview (Full Year)</h3>
              <div className="space-y-3">
                {[
                  { label: 'Academic Events', count: stats.academic, icon: BookOpen, bg: 'bg-blue-100', text: 'text-blue-600' },
                  { label: 'Exams', count: stats.exam, icon: Users, bg: 'bg-red-100', text: 'text-red-600' },
                  { label: 'Holidays', count: stats.holiday, icon: Home, bg: 'bg-green-100', text: 'text-green-600' },
                  { label: 'Special Events', count: stats.event, icon: Award, bg: 'bg-purple-100', text: 'text-purple-600' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-9 h-9 ${item.bg} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${item.text}`} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">{item.label}</p>
                        <p className="font-bold text-gray-800">{item.count}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Add Event Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAddEvent(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Add Event / Holiday
          </button>
        </div>

        {/* Add Event Modal */}
        {showAddEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Event</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter event title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="academic">Academic Event</option>
                    <option value="exam">Exam</option>
                    <option value="event">Special Event</option>
                    <option value="holiday">Holiday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min={formatDate(new Date())}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Event details"
                    rows="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Event location"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddEvent(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEvent}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Add Event
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Event Legend */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Event Types</h3>
          <div className="flex flex-wrap gap-5">
            {[
              { label: 'Academic', color: 'bg-blue-500' },
              { label: 'Exams', color: 'bg-red-500' },
              { label: 'Holidays', color: 'bg-green-500' },
              { label: 'Special Events', color: 'bg-purple-500' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Event Listings */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
          <div className="flex flex-wrap gap-2 mb-5">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Events
            </button>
            {Object.entries(eventTypeConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  activeTab === key 
                    ? `${config.bg} ${config.color}` 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <config.icon className="w-4 h-4" />
                {config.label}
              </button>
            ))}
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p>No events found for this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map(event => {
                const Icon = eventTypeConfig[event.type].icon;
                return (
                  <div 
                    key={event.id} 
                    className={`border rounded-xl p-4 transition-all duration-200 hover:shadow-md ${getEventColor(event.type)} border-l-4`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${eventTypeConfig[event.type].bg}`}>
                        <Icon className={`w-5 h-5 ${eventTypeConfig[event.type].color}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{event.title}</h4>
                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{event.date}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.description && (
                          <p className="mt-2 text-sm text-gray-700">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicCalendar;
















// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight, Calendar, Plus, Users, BookOpen, Award, Home, X, Clock, MapPin } from 'lucide-react';
// import {academicEvents as AllEvent} from '../../data/academicEvents';
 
// const AcademicCalendar = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [showAddEvent, setShowAddEvent] = useState(false);
//   const [newEvent, setNewEvent] = useState({
//     title: '',
//     type: 'academic',
//     date: '',
//     description: '',
//     location: ''
//   });
//   const [activeTab, setActiveTab] = useState('all'); // 'all', 'academic', 'exam', 'holiday', 'event'

//   // Mock academic events data (full year)
//   const [academicEvents , setAcademicEvents]= useState(AllEvent);

//   const getEventColor = (type) => {
//     switch (type) {
//       case 'academic': return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'exam': return 'bg-red-100 text-red-800 border-red-200';
//       case 'event': return 'bg-purple-100 text-purple-800 border-purple-200';
//       case 'holiday': return 'bg-green-100 text-green-800 border-green-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//   const getDaysInMonth = (year, month) => {
//     return new Date(year, month + 1, 0).getDate();
//   };

//   const getFirstDayOfMonth = (year, month) => {
//     return new Date(year, month, 1).getDay();
//   };

//   const isToday = (date) => {
//     const today = new Date();
//     return date.getDate() === today.getDate() &&
//            date.getMonth() === today.getMonth() &&
//            date.getFullYear() === today.getFullYear();
//   };

//   const formatDate = (date) => {
//     return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
//   };

//   const hasEventsOnDate = (dateStr) => {
//     return academicEvents.some(event => event.date === dateStr);
//   };

//   const getEventsForDate = (dateStr) => {
//     return academicEvents
//       .filter(event => event.date === dateStr)
//       .map(event => ({ ...event, color: getEventColor(event.type) }));
//   };

//   const navigateMonth = (direction) => {
//     setCurrentDate(prev => {
//       const newDate = new Date(prev);
//       newDate.setMonth(prev.getMonth() + direction);
//       return newDate;
//     });
//   };

//   const handleAddEvent = () => {
//     if (newEvent.title.trim() && newEvent.date) {
//       const newEventObj = {
//         id: academicEvents.length + 1,
//         ...newEvent
//       };
//       console.log('New event added:', newEventObj);
//       setShowAddEvent(false);
//       setNewEvent({ title: '', type: 'academic', date: '', description: '', location: '' });
//     }
//   };

//   const renderCalendarDays = () => {
//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth();
//     const daysInMonth = getDaysInMonth(year, month);
//     const firstDay = getFirstDayOfMonth(year, month);
    
//     const daysArray = [];
    
//     // Empty cells
//     for (let i = 0; i < firstDay; i++) {
//       daysArray.push(<div key={`empty-${i}`} className="h-16 border border-gray-100 bg-gray-50"></div>);
//     }
    
//     // Days of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(year, month, day);
//       const dateStr = formatDate(date);
//       const isCurrentDay = isToday(date);
//       const dayHasEvents = hasEventsOnDate(dateStr);
//       const dayOfWeek = date.getDay();
//       const isSunday = dayOfWeek === 0;
      
//       daysArray.push(
//         <div
//           key={day}
//           className={`h-16 border border-gray-100 p-1 cursor-pointer transition-all duration-200 hover:bg-indigo-50 relative
//             ${isSunday ? 'bg-red-50/50' : ''}
//             ${isCurrentDay ? 'ring-2 ring-blue-400 bg-blue-50' : ''}
//           `}
//           onClick={() => setSelectedDate({ day, month, year })}
//         >
//           <div className={`text-sm font-medium text-center pt-1 ${
//             isCurrentDay ? 'text-blue-700 font-bold' : 
//             isSunday ? 'text-red-600' : 'text-gray-700'
//           }`}>
//             {day}
//           </div>
//           {dayHasEvents && (
//             <div className="flex justify-center mt-1">
//               <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
//             </div>
//           )}
//           {isCurrentDay && (
//             <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></div>
//           )}
//         </div>
//       );
//     }
    
//     return daysArray;
//   };

//   // Get today's events
//   const today = new Date();
//   const todayStr = formatDate(today);
//   const todayEvents = getEventsForDate(todayStr);

//   // Get selected date's events (if any)
//   let selectedDateStr = null;
//   let selectedEvents = [];
//   if (selectedDate) {
//     const { day, month, year } = selectedDate;
//     const date = new Date(year, month, day);
//     selectedDateStr = formatDate(date);
//     selectedEvents = getEventsForDate(selectedDateStr);
//   }

//   // Stats: Count all events (full year)
//   const stats = {
//     academic: academicEvents.filter(e => e.type === 'academic').length,
//     exam: academicEvents.filter(e => e.type === 'exam').length,
//     holiday: academicEvents.filter(e => e.type === 'holiday').length,
//     event: academicEvents.filter(e => e.type === 'event').length,
//   };

//   // Filter events by active tab
//   const filteredEvents = activeTab === 'all' 
//     ? academicEvents 
//     : academicEvents.filter(event => event.type === activeTab);

//   // Event type configuration
//   const eventTypeConfig = {
//     academic: { label: 'Academic Events', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100' },
//     exam: { label: 'Exams', icon: Users, color: 'text-red-600', bg: 'bg-red-100' },
//     holiday: { label: 'Holidays', icon: Home, color: 'text-green-600', bg: 'bg-green-100' },
//     event: { label: 'Special Events', icon: Award, color: 'text-purple-600', bg: 'bg-purple-100' },
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center gap-3 mb-3">
//             <Calendar className="w-9 h-9 text-indigo-700" />
//             <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Academic Calendar</h1>
//           </div>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Explore all academic events, exams, holidays, and special occasions throughout the year.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Calendar */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
//               {/* Calendar Header */}
//               <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 md:p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <button
//                     onClick={() => navigateMonth(-1)}
//                     className="p-2 hover:bg-white/20 rounded-full transition-colors"
//                     aria-label="Previous month"
//                   >
//                     <ChevronLeft className="w-5 h-5" />
//                   </button>
//                   <h2 className="text-xl md:text-2xl font-bold tracking-tight">
//                     {months[currentDate.getMonth()]} {currentDate.getFullYear()}
//                   </h2>
//                   <button
//                     onClick={() => navigateMonth(1)}
//                     className="p-2 hover:bg-white/20 rounded-full transition-colors"
//                     aria-label="Next month"
//                   >
//                     <ChevronRight className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               {/* Calendar Days Header */}
//               <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
//                 {days.map((day, index) => (
//                   <div 
//                     key={index} 
//                     className={`py-3 text-center font-semibold text-sm ${
//                       index === 0 ? 'text-red-600 bg-red-50' : 'text-gray-700'
//                     }`}
//                   >
//                     {day}
//                   </div>
//                 ))}
//               </div>

//               {/* Calendar Days */}
//               <div className="grid grid-cols-7">
//                 {renderCalendarDays()}
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Today's Events */}
//             <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
//               <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
//                 <Calendar className="w-4 h-4 text-indigo-600" />
//                 Today’s Events
//               </h3>
//               {todayEvents.length === 0 ? (
//                 <p className="text-gray-500 text-center py-3 text-sm">No events today</p>
//               ) : (
//                 todayEvents.map(event => (
//                   <div key={event.id} className="mb-2 last:mb-0">
//                     <div className={`px-3 py-1.5 rounded-md text-xs font-medium ${event.color}`}>
//                       {event.title}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>

//             {/* Selected Date Events */}
//             {selectedDate && (
//               <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
//                 <div className="flex justify-between items-center mb-3">
//                   <h3 className="text-lg font-bold text-gray-800">
//                     {months[selectedDate.month]} {selectedDate.day}, {selectedDate.year}
//                   </h3>
//                   <button
//                     onClick={() => setSelectedDate(null)}
//                     className="text-gray-500 hover:text-gray-700"
//                     aria-label="Clear selection"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//                 {selectedEvents.length === 0 ? (
//                   <p className="text-gray-500 text-center py-3 text-sm">No events on this date</p>
//                 ) : (
//                   selectedEvents.map(event => (
//                     <div key={event.id} className="mb-2 last:mb-0">
//                       <div className={`px-3 py-1.5 rounded-md text-xs font-medium ${event.color}`}>
//                         {event.title}
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}

//             {/* Quick Stats - FULL YEAR */}
//             <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
//               <h3 className="text-lg font-bold text-gray-800 mb-4">Academic Overview (Full Year)</h3>
//               <div className="space-y-3">
//                 {[
//                   { label: 'Academic Events', count: stats.academic, icon: BookOpen, bg: 'bg-blue-100', text: 'text-blue-600' },
//                   { label: 'Exams', count: stats.exam, icon: Users, bg: 'bg-red-100', text: 'text-red-600' },
//                   { label: 'Holidays', count: stats.holiday, icon: Home, bg: 'bg-green-100', text: 'text-green-600' },
//                   { label: 'Special Events', count: stats.event, icon: Award, bg: 'bg-purple-100', text: 'text-purple-600' },
//                 ].map((item, idx) => {
//                   const Icon = item.icon;
//                   return (
//                     <div key={idx} className="flex items-center gap-3">
//                       <div className={`w-9 h-9 ${item.bg} rounded-lg flex items-center justify-center`}>
//                         <Icon className={`w-4 h-4 ${item.text}`} />
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-600">{item.label}</p>
//                         <p className="font-bold text-gray-800">{item.count}</p>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Add Event Button */}
//         <div className="mt-8 text-center">
//           <button
//             onClick={() => setShowAddEvent(true)}
//             className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
//           >
//             <Plus className="w-5 h-5" />
//             Add Event / Holiday
//           </button>
//         </div>

//         {/* Add Event Modal */}
//         {showAddEvent && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
//               <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Event</h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
//                   <input
//                     type="text"
//                     value={newEvent.title}
//                     onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     placeholder="Enter event title"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
//                   <select
//                     value={newEvent.type}
//                     onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   >
//                     <option value="academic">Academic Event</option>
//                     <option value="exam">Exam</option>
//                     <option value="event">Special Event</option>
//                     <option value="holiday">Holiday</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                   <input
//                     type="date"
//                     value={newEvent.date}
//                     onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     min={formatDate(new Date())}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                   <textarea
//                     value={newEvent.description}
//                     onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     placeholder="Event details"
//                     rows="2"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//                   <input
//                     type="text"
//                     value={newEvent.location}
//                     onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     placeholder="Event location"
//                   />
//                 </div>
//               </div>
//               <div className="flex gap-3 mt-6">
//                 <button
//                   onClick={() => setShowAddEvent(false)}
//                   className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleAddEvent}
//                   className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
//                 >
//                   Add Event
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Event Legend */}
//         <div className="mt-8 bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
//           <h3 className="text-lg font-bold text-gray-800 mb-3">Event Types</h3>
//           <div className="flex flex-wrap gap-5">
//             {[
//               { label: 'Academic', color: 'bg-blue-500' },
//               { label: 'Exams', color: 'bg-red-500' },
//               { label: 'Holidays', color: 'bg-green-500' },
//               { label: 'Special Events', color: 'bg-purple-500' },
//             ].map((item, idx) => (
//               <div key={idx} className="flex items-center gap-2">
//                 <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
//                 <span className="text-sm text-gray-600">{item.label}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Detailed Event Listings */}
//         <div className="mt-8 bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
//           <div className="flex flex-wrap gap-2 mb-5">
//             <button
//               onClick={() => setActiveTab('all')}
//               className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                 activeTab === 'all' 
//                   ? 'bg-indigo-600 text-white' 
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//             >
//               All Events
//             </button>
//             {Object.entries(eventTypeConfig).map(([key, config]) => (
//               <button
//                 key={key}
//                 onClick={() => setActiveTab(key)}
//                 className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
//                   activeTab === key 
//                     ? `${config.bg} ${config.color}` 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 <config.icon className="w-4 h-4" />
//                 {config.label}
//               </button>
//             ))}
//           </div>

//           {filteredEvents.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               <Calendar className="w-16 h-16 mx-auto mb-3 opacity-50" />
//               <p>No events found for this category</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredEvents.map(event => {
//                 const Icon = eventTypeConfig[event.type].icon;
//                 return (
//                   <div 
//                     key={event.id} 
//                     className={`border rounded-xl p-4 transition-all duration-200 hover:shadow-md ${getEventColor(event.type)} border-l-4`}
//                   >
//                     <div className="flex items-start gap-3">
//                       <div className={`p-2 rounded-lg ${eventTypeConfig[event.type].bg}`}>
//                         <Icon className={`w-5 h-5 ${eventTypeConfig[event.type].color}`} />
//                       </div>
//                       <div>
//                         <h4 className="font-bold text-gray-800">{event.title}</h4>
//                         <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
//                           <Calendar className="w-3.5 h-3.5" />
//                           <span>{event.date}</span>
//                         </div>
//                         {event.location && (
//                           <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
//                             <MapPin className="w-3.5 h-3.5" />
//                             <span>{event.location}</span>
//                           </div>
//                         )}
//                         {event.description && (
//                           <p className="mt-2 text-sm text-gray-700">{event.description}</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AcademicCalendar;



// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight, Calendar, Plus, Users, BookOpen, Award, Home, X } from 'lucide-react';

// const AcademicCalendar = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(null); // Format: { day, month, year }
//   const [showAddEvent, setShowAddEvent] = useState(false);
//   const [newEvent, setNewEvent] = useState({
//     title: '',
//     type: 'academic',
//     date: ''
//   });

//   // Mock academic events data (full year)
//   const academicEvents = [
//     { id: 1, date: '2026-01-15', title: 'Semester Begins', type: 'academic' },
//     { id: 2, date: '2026-02-10', title: 'Mid-term Exams', type: 'exam' },
//     { id: 3, date: '2026-02-28', title: 'Cultural Festival', type: 'event' },
//     { id: 4, date: '2026-03-20', title: 'Spring Break', type: 'holiday' },
//     { id: 5, date: '2026-04-15', title: 'Final Exams', type: 'exam' },
//     { id: 6, date: '2026-05-10', title: 'Graduation Ceremony', type: 'event' },
//     { id: 7, date: '2026-06-01', title: 'Summer Semester Starts', type: 'academic' },
//     { id: 8, date: '2026-08-15', title: 'New Academic Year', type: 'academic' },
//   ];

//   // Helper: Add color dynamically (no need to store in data)
//   const getEventColor = (type) => {
//     switch (type) {
//       case 'academic': return 'bg-blue-100 text-blue-800';
//       case 'exam': return 'bg-red-100 text-red-800';
//       case 'event': return 'bg-purple-100 text-purple-800';
//       case 'holiday': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//   const getDaysInMonth = (year, month) => {
//     return new Date(year, month + 1, 0).getDate();
//   };

//   const getFirstDayOfMonth = (year, month) => {
//     return new Date(year, month, 1).getDay();
//   };

//   const isToday = (date) => {
//     const today = new Date();
//     return date.getDate() === today.getDate() &&
//            date.getMonth() === today.getMonth() &&
//            date.getFullYear() === today.getFullYear();
//   };

//   const formatDate = (date) => {
//     return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
//   };

//   const hasEventsOnDate = (dateStr) => {
//     return academicEvents.some(event => event.date === dateStr);
//   };

//   const getEventsForDate = (dateStr) => {
//     return academicEvents
//       .filter(event => event.date === dateStr)
//       .map(event => ({ ...event, color: getEventColor(event.type) }));
//   };

//   const navigateMonth = (direction) => {
//     setCurrentDate(prev => {
//       const newDate = new Date(prev);
//       newDate.setMonth(prev.getMonth() + direction);
//       return newDate;
//     });
//   };

//   const handleAddEvent = () => {
//     if (newEvent.title.trim() && newEvent.date) {
//       const newEventObj = {
//         id: academicEvents.length + 1,
//         ...newEvent
//       };
//       console.log('New event added:', newEventObj);
//       // In real app: setAcademicEvents([...academicEvents, newEventObj]);
//       setShowAddEvent(false);
//       setNewEvent({ title: '', type: 'academic', date: '' });
//     }
//   };

//   const renderCalendarDays = () => {
//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth();
//     const daysInMonth = getDaysInMonth(year, month);
//     const firstDay = getFirstDayOfMonth(year, month);
    
//     const daysArray = [];
    
//     // Empty cells
//     for (let i = 0; i < firstDay; i++) {
//       daysArray.push(<div key={`empty-${i}`} className="h-16 border border-gray-100 bg-gray-50"></div>);
//     }
    
//     // Days of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(year, month, day);
//       const dateStr = formatDate(date);
//       const isCurrentDay = isToday(date);
//       const dayHasEvents = hasEventsOnDate(dateStr);
//       const dayOfWeek = date.getDay();
//       const isSunday = dayOfWeek === 0;
      
//       daysArray.push(
//         <div
//           key={day}
//           className={`h-16 border border-gray-100 p-1 cursor-pointer transition-all duration-200 hover:bg-indigo-50 relative
//             ${isSunday ? 'bg-red-50/50' : ''}
//             ${isCurrentDay ? 'ring-2 ring-blue-400 bg-blue-50' : ''}
//           `}
//           onClick={() => setSelectedDate({ day, month, year })}
//         >
//           <div className={`text-sm font-medium text-center pt-1 ${
//             isCurrentDay ? 'text-blue-700 font-bold' : 
//             isSunday ? 'text-red-600' : 'text-gray-700'
//           }`}>
//             {day}
//           </div>
//           {dayHasEvents && (
//             <div className="flex justify-center mt-1">
//               <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
//             </div>
//           )}
//           {isCurrentDay && (
//             <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></div>
//           )}
//         </div>
//       );
//     }
    
//     return daysArray;
//   };

//   // Get today's events
//   const today = new Date();
//   const todayStr = formatDate(today);
//   const todayEvents = getEventsForDate(todayStr);

//   // Get selected date's events (if any)
//   let selectedDateStr = null;
//   let selectedEvents = [];
//   if (selectedDate) {
//     const { day, month, year } = selectedDate;
//     const date = new Date(year, month, day);
//     selectedDateStr = formatDate(date);
//     selectedEvents = getEventsForDate(selectedDateStr);
//   }

//   // Stats: Count all events (full year)
//   const stats = {
//     academic: academicEvents.filter(e => e.type === 'academic').length,
//     exam: academicEvents.filter(e => e.type === 'exam').length,
//     holiday: academicEvents.filter(e => e.type === 'holiday').length,
//     event: academicEvents.filter(e => e.type === 'event').length,
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center gap-3 mb-3">
//             <Calendar className="w-9 h-9 text-indigo-700" />
//             <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Academic Calendar</h1>
//           </div>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Explore all academic events, exams, holidays, and special occasions throughout the year.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Calendar */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
//               {/* Calendar Header */}
//               <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 md:p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <button
//                     onClick={() => navigateMonth(-1)}
//                     className="p-2 hover:bg-white/20 rounded-full transition-colors"
//                     aria-label="Previous month"
//                   >
//                     <ChevronLeft className="w-5 h-5" />
//                   </button>
//                   <h2 className="text-xl md:text-2xl font-bold tracking-tight">
//                     {months[currentDate.getMonth()]} {currentDate.getFullYear()}
//                   </h2>
//                   <button
//                     onClick={() => navigateMonth(1)}
//                     className="p-2 hover:bg-white/20 rounded-full transition-colors"
//                     aria-label="Next month"
//                   >
//                     <ChevronRight className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               {/* Calendar Days Header */}
//               <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
//                 {days.map((day, index) => (
//                   <div 
//                     key={index} 
//                     className={`py-3 text-center font-semibold text-sm ${
//                       index === 0 ? 'text-red-600 bg-red-50' : 'text-gray-700'
//                     }`}
//                   >
//                     {day}
//                   </div>
//                 ))}
//               </div>

//               {/* Calendar Days */}
//               <div className="grid grid-cols-7">
//                 {renderCalendarDays()}
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Today's Events */}
//             <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
//               <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
//                 <Calendar className="w-4 h-4 text-indigo-600" />
//                 Today’s Events
//               </h3>
//               {todayEvents.length === 0 ? (
//                 <p className="text-gray-500 text-center py-3 text-sm">No events today</p>
//               ) : (
//                 todayEvents.map(event => (
//                   <div key={event.id} className="mb-2 last:mb-0">
//                     <div className={`px-3 py-1.5 rounded-md text-xs font-medium ${event.color}`}>
//                       {event.title}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>

//             {/* Selected Date Events */}
//             {selectedDate && (
//               <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
//                 <div className="flex justify-between items-center mb-3">
//                   <h3 className="text-lg font-bold text-gray-800">
//                     {months[selectedDate.month]} {selectedDate.day}, {selectedDate.year}
//                   </h3>
//                   <button
//                     onClick={() => setSelectedDate(null)}
//                     className="text-gray-500 hover:text-gray-700"
//                     aria-label="Clear selection"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//                 {selectedEvents.length === 0 ? (
//                   <p className="text-gray-500 text-center py-3 text-sm">No events on this date</p>
//                 ) : (
//                   selectedEvents.map(event => (
//                     <div key={event.id} className="mb-2 last:mb-0">
//                       <div className={`px-3 py-1.5 rounded-md text-xs font-medium ${event.color}`}>
//                         {event.title}
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}

//             {/* Quick Stats - FULL YEAR */}
//             <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
//               <h3 className="text-lg font-bold text-gray-800 mb-4">Academic Overview (Full Year)</h3>
//               <div className="space-y-3">
//                 {[
//                   { label: 'Academic Events', count: stats.academic, icon: BookOpen, bg: 'bg-blue-100', text: 'text-blue-600' },
//                   { label: 'Exams', count: stats.exam, icon: Users, bg: 'bg-red-100', text: 'text-red-600' },
//                   { label: 'Holidays', count: stats.holiday, icon: Home, bg: 'bg-green-100', text: 'text-green-600' },
//                   { label: 'Special Events', count: stats.event, icon: Award, bg: 'bg-purple-100', text: 'text-purple-600' },
//                 ].map((item, idx) => {
//                   const Icon = item.icon;
//                   return (
//                     <div key={idx} className="flex items-center gap-3">
//                       <div className={`w-9 h-9 ${item.bg} rounded-lg flex items-center justify-center`}>
//                         <Icon className={`w-4 h-4 ${item.text}`} />
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-600">{item.label}</p>
//                         <p className="font-bold text-gray-800">{item.count}</p>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Add Event Button */}
//         <div className="mt-8 text-center">
//           <button
//             onClick={() => setShowAddEvent(true)}
//             className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
//           >
//             <Plus className="w-5 h-5" />
//             Add Event / Holiday
//           </button>
//         </div>

//         {/* Add Event Modal */}
//         {showAddEvent && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
//               <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Event</h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
//                   <input
//                     type="text"
//                     value={newEvent.title}
//                     onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     placeholder="Enter event title"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
//                   <select
//                     value={newEvent.type}
//                     onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   >
//                     <option value="academic">Academic Event</option>
//                     <option value="exam">Exam</option>
//                     <option value="event">Special Event</option>
//                     <option value="holiday">Holiday</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                   <input
//                     type="date"
//                     value={newEvent.date}
//                     onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
//                     className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     min={formatDate(new Date())}
//                   />
//                 </div>
//               </div>
//               <div className="flex gap-3 mt-6">
//                 <button
//                   onClick={() => setShowAddEvent(false)}
//                   className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleAddEvent}
//                   className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
//                 >
//                   Add Event
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Event Legend */}
//         <div className="mt-8 bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
//           <h3 className="text-lg font-bold text-gray-800 mb-3">Event Types</h3>
//           <div className="flex flex-wrap gap-5">
//             {[
//               { label: 'Academic', color: 'bg-blue-500' },
//               { label: 'Exams', color: 'bg-red-500' },
//               { label: 'Holidays', color: 'bg-green-500' },
//               { label: 'Special Events', color: 'bg-purple-500' },
//             ].map((item, idx) => (
//               <div key={idx} className="flex items-center gap-2">
//                 <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
//                 <span className="text-sm text-gray-600">{item.label}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AcademicCalendar;