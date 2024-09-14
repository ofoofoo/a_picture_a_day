import React, { useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import "./Calendar.css";

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date()); // current date
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // stores clicked data

  const onChange: CalendarProps["onChange"] = (newDate, event) => {
    if (newDate instanceof Date) {
      setDate(newDate);
    } else {
      console.error("Invalid date value:", newDate);
    }
  };

  const onDateClick: CalendarProps["onClickDay"] = (value, event) => {
    setSelectedDate(value);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  return (
    <div className="calendar-container">
      <h1>Previous Images</h1>
      <Calendar onChange={onChange} value={date} onClickDay={onDateClick} />
      <p>Selected Date: {date.toDateString()}</p>

      {/* Modal */}
      {isModalOpen && selectedDate && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h1>TODO: REPLACE WITH PICTURE</h1>
            <div className="bottom-content">
              <p>{selectedDate.toDateString()}</p>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
