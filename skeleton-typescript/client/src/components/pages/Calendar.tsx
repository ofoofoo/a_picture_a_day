import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Include the default styles

const CalendarPage = () => {
  const [date, setDate] = useState(new Date()); // Initialize state with the current date

  // Handle date change
  const onChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div style={{ margin: "50px auto", maxWidth: "600px", textAlign: "center" }}>
      <h1>My Calendar Page</h1>
      <Calendar onChange={onChange} value={date} />
      <p>Selected Date: {date.toDateString()}</p>
    </div>
  );
};

export default CalendarPage;
