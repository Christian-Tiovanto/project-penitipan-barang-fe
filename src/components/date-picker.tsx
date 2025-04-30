import { useState, useEffect } from "react";
import { FaCalendarDay } from "react-icons/fa6";
const StartDatePicker = ({
  idDatePicker,
  titleText,
  datetime,
  idDatePickerTime,
  value,
  onDateClick,
}: {
  idDatePicker: string;
  titleText: string;
  datetime: boolean;
  idDatePickerTime?: string;
  value: Date;
  onDateClick: Function;
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [tempDate, setTempDate] = useState(value);
  const [originalDate, setOriginalDate] = useState(new Date());
  const [originalMonth, setOriginalMonth] = useState(new Date().getMonth());
  const [originalYear, setOriginalYear] = useState(new Date().getFullYear());

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
    const newDate = new Date(currentYear, currentMonth, value.getDate());
    newDate.setHours(7, 0, 0, 0);
    onDateClick(newDate);
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
        isSelected: date.toDateString() === tempDate.toDateString(),
      });
    }

    // Current month days
    const lastOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0);
    for (let day = 1; day <= lastOfCurrentMonth.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      date.setHours(7, 0, 0, 0);

      dates.push({
        day,
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        isSelected: date.toDateString() === tempDate.toDateString(),
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
        isSelected: date.toDateString() === value.toDateString(),
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
  // Modified showPicker handler
  const togglePicker = (show: boolean) => {
    if (show) {
      // Store original values when opening picker
      setOriginalDate(value);
      setOriginalMonth(currentMonth);
      setOriginalYear(currentYear);
    }
    setShowPicker(show);
  };

  // Modified cancel handler
  const handleCancel = () => {
    // Reset to original values
    onDateClick(originalDate);
    setTempDate(originalDate);
    setCurrentMonth(originalMonth);
    setCurrentYear(originalYear);
    setShowPicker(false);
  };

  return (
    <div className="select-container mb-2">
      <div
        className="container-input-date d-flex justify-content-start align-items-center ps-3"
        onClick={() => togglePicker(true)}
      >
        <FaCalendarDay />
        <div className="form-floating">
          <input
            id={idDatePicker}
            type="text"
            className="form-control third-bg border-0"
            placeholder="Select date"
            value={tempDate.toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
            onClick={() => togglePicker(true)}
            readOnly
          />
          <label htmlFor={idDatePicker} className="label">
            {titleText}
          </label>
        </div>
      </div>
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
              onClick={() => {
                setTempDate(date.date);
              }}
            >
              {date.day}
            </button>
          ))}
        </div>

        <div
          className={`datepicker-time w-100 justify-content-between align-items-center border-top ${
            datetime ? "d-flex" : "d-none"
          }`}
        >
          <div className="form-floating w-100 d-flex align-items-center">
            <input
              id={idDatePickerTime}
              type="time"
              className="form-control w-100 datepicker-time-container border-0 pb-0 pt-0 "
              value={"00:00"}
              readOnly
            />
            <label
              htmlFor="date-picker"
              className="label fs-6 fw-light d-flex align-items-center pb-4"
            >
              Time
            </label>
          </div>
          <span>WIB</span>
        </div>
        <div className="datepicker-footer">
          <button className="cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button
            className="apply"
            onClick={() => {
              onDateClick(tempDate);
              setShowPicker(false);
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
const EndDatePicker = ({
  idDatePicker,
  titleText,
  datetime,
  idDatePickerTime,
  value,
  onDateClick,
}: {
  idDatePicker: string;
  titleText: string;
  datetime: boolean;
  idDatePickerTime?: string;
  value: Date;
  onDateClick: Function;
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value.getMonth());
  const [currentYear, setCurrentYear] = useState(value.getFullYear());
  const [tempDate, setTempDate] = useState(value);
  const [originalDate, setOriginalDate] = useState(new Date());
  const [originalMonth, setOriginalMonth] = useState(new Date().getMonth());
  const [originalYear, setOriginalYear] = useState(new Date().getFullYear());

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
    const newDate = new Date(currentYear, currentMonth, value.getDate());
    newDate.setHours(7, 0, 0, 0);
    onDateClick(newDate);
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
        isSelected: date.toDateString() === value.toDateString(),
      });
    }

    // Current month days
    const lastOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0);
    for (let day = 1; day <= lastOfCurrentMonth.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      date.setHours(7, 0, 0, 0);
      dates.push({
        day,
        date,
        isCurrentMonth: true,
        isToday:
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - 1
          ).toDateString() === today.toDateString(),
        isSelected: date.toDateString() === tempDate.toDateString(),
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
        isSelected: date.toDateString() === value.toDateString(),
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
  // Modified showPicker handler
  const togglePicker = (show: boolean) => {
    if (show) {
      // Store original values when opening picker
      setOriginalDate(value);
      setOriginalMonth(currentMonth);
      setOriginalYear(currentYear);
    }
    setShowPicker(show);
  };

  // Modified cancel handler
  const handleCancel = () => {
    // Reset to original values
    onDateClick(originalDate);
    setTempDate(originalDate);
    setCurrentMonth(originalMonth);
    setCurrentYear(originalYear);
    setShowPicker(false);
  };

  return (
    <div className="select-container mb-2">
      <div
        className="container-input-date d-flex justify-content-start align-items-center ps-3"
        onClick={() => togglePicker(true)}
      >
        <FaCalendarDay />
        <div className="form-floating">
          <input
            id={idDatePicker}
            type="text"
            className="form-control third-bg border-0"
            placeholder="Select date"
            value={new Date(
              tempDate.getFullYear(),
              tempDate.getMonth(),
              tempDate.getDate() - 1
            ).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
            onClick={() => togglePicker(true)}
            readOnly
          />
          <label htmlFor={idDatePicker} className="label">
            {titleText}
          </label>
        </div>
      </div>
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
              onClick={() => {
                setTempDate(date.date);
              }}
            >
              {date.day}
            </button>
          ))}
        </div>

        <div
          className={`datepicker-time w-100 justify-content-between align-items-center border-top ${
            datetime ? "d-flex" : "d-none"
          }`}
        >
          <div className="form-floating w-100 d-flex align-items-center">
            <input
              id={idDatePickerTime}
              type="time"
              className="form-control w-100 datepicker-time-container border-0 pb-0 pt-0 "
              value={"00:00"}
              readOnly
            />
            <label
              htmlFor="date-picker"
              className="label fs-6 fw-light d-flex align-items-center pb-4"
            >
              Time
            </label>
          </div>
          <span>WIB</span>
        </div>
        <div className="datepicker-footer">
          <button className="cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button
            className="apply"
            onClick={() => {
              onDateClick(tempDate);
              setShowPicker(false);
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export { StartDatePicker, EndDatePicker };
