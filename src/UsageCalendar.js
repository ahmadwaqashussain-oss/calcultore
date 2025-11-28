import React from 'react';
import './UsageCalendar.css';

const UsageCalendar = ({ usageData }) => {
  // Get last 30 days
  const getLast30Days = () => {
    const days = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        count: usageData[dateStr] || 0
      });
    }

    return days;
  };

  const days = getLast30Days();
  const maxCount = Math.max(...days.map(d => d.count), 1);
  const totalUsage = days.reduce((sum, day) => sum + day.count, 0);

  const getIntensity = (count) => {
    if (count === 0) return 'empty';
    const percent = (count / maxCount) * 100;
    if (percent <= 25) return 'low';
    if (percent <= 50) return 'medium';
    if (percent <= 75) return 'high';
    return 'very-high';
  };

  return (
    <div className="usage-calendar">
      <div className="usage-header">
        <h3>📊 Usage Statistics</h3>
        <span className="total-usage">{totalUsage} calculations in last 30 days</span>
      </div>

      <div className="calendar-grid">
        {days.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${getIntensity(day.count)}`}
            title={`${day.date}: ${day.count} calculation${day.count !== 1 ? 's' : ''}`}
          >
            <div className="day-number">{day.dayNumber}</div>
            <div className="day-name">{day.dayName}</div>
            {day.count > 0 && <div className="day-count">{day.count}</div>}
          </div>
        ))}
      </div>

      <div className="usage-legend">
        <span>Less</span>
        <div className="legend-item empty"></div>
        <div className="legend-item low"></div>
        <div className="legend-item medium"></div>
        <div className="legend-item high"></div>
        <div className="legend-item very-high"></div>
        <span>More</span>
      </div>
    </div>
  );
};

export default UsageCalendar;
