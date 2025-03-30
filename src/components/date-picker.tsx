import { useState, useEffect } from "react";

const DatePicker = ({ titleText }: { titleText: string }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    // Update selected date when month/year changes
    const newDate = new Date(currentYear, currentMonth, selectedDate.getDate());
    setSelectedDate(newDate);
  }, [currentMonth, currentYear]);

  const generateDateGrid = () => {
    const dates = [];
    const today = new Date();

    // Previous month days
    const lastOfPrevMonth = new Date(currentYear, currentMonth, 0);
    for (let i = 0; i <= lastOfPrevMonth.getDay(); i++) {
      const day = lastOfPrevMonth.getDate() - lastOfPrevMonth.getDay() + i;
      const date = new Date(currentYear, currentMonth - 1, day);
      dates.push({
        day,
        date,
        isCurrentMonth: false,
        isToday: date.toDateString() === today.toDateString(),
        isSelected: date.toDateString() === selectedDate.toDateString(),
      });
    }

    // Current month days
    const lastOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0);
    for (let day = 1; day <= lastOfCurrentMonth.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      dates.push({
        day,
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        isSelected: date.toDateString() === selectedDate.toDateString(),
      });
    }

    // Next month days
    const firstOfNextMonth = new Date(currentYear, currentMonth + 1, 1);
    for (let i = firstOfNextMonth.getDay(); i < 7; i++) {
      const day = i - firstOfNextMonth.getDay() + 1;
      const date = new Date(currentYear, currentMonth + 1, day);
      dates.push({
        day,
        date,
        isCurrentMonth: false,
        isToday: date.toDateString() === today.toDateString(),
        isSelected: date.toDateString() === selectedDate.toDateString(),
      });
    }

    return dates;
  };

  const handleMonthChange = (e: any) => {
    setCurrentMonth(months.indexOf(e.target.value));
  };

  const handleYearChange = (e: any) => {
    setCurrentYear(Number(e.target.value));
  };

  const navigateMonth = (direction: any) => {
    if (direction === "next") {
      setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
      if (currentMonth === 11) setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
      if (currentMonth === 0) setCurrentYear((y) => y - 1);
    }
  };

  return (
    <div className="datepicker-container">
      <p>{titleText}</p>
      <input
        type="text"
        className="date-input"
        placeholder="Select date"
        value={selectedDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}
        onClick={() => setShowPicker(true)}
        readOnly
      />
      <div className="datepicker" hidden={!showPicker}>
        <div className="datepicker-header">
          <button className="prev" onClick={() => navigateMonth("prev")}>
            Prev
          </button>

          <div>
            <select
              className="month-input"
              value={months[currentMonth]}
              onChange={handleMonthChange}
            >
              {months.map((month) => (
                <option key={month}>{month}</option>
              ))}
            </select>
            <input
              type="number"
              className="year-input"
              value={currentYear}
              onChange={handleYearChange}
            />
          </div>

          <button className="next" onClick={() => navigateMonth("next")}>
            Next
          </button>
        </div>

        <div className="days">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="dates">
          {generateDateGrid().map((date, index) => (
            <button
              key={index}
              className={`date-btn
                ${date.isToday && date.isCurrentMonth ? "today" : ""}
                ${date.isSelected ? "selected" : ""}
              `}
              disabled={!date.isCurrentMonth}
              onClick={() => setSelectedDate(date.date)}
            >
              {date.day}
            </button>
          ))}
        </div>

        <div className="datepicker-footer">
          <button className="cancel" onClick={() => setShowPicker(false)}>
            Cancel
          </button>
          <button className="apply" onClick={() => setShowPicker(false)}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
