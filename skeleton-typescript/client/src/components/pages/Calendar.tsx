import React, { useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import "./Calendar.css";
import { get } from "../../utilities";
import { AiTwotoneFrown } from "react-icons/ai";


const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date()); // current date
  const [winnerImage, setWinnerImage] = useState<string | undefined>(undefined);
  const [userImage, setUserImage] = useState<string | undefined>(undefined);
  const [prompt, setPrompt] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined); // stores clicked data

  const onChange: CalendarProps["onChange"] = (newDate, event) => {
    if (newDate instanceof Date) {
      setDate(newDate);
    } else {
      console.error("Invalid date value:", newDate);
    }
  };

  const onDateClick: CalendarProps["onClickDay"] = (value, event) => {
    setSelectedDate(value);

    get("/api/get-winner", { date: value })
      .then((info) => {
        setWinnerImage(info.image.signedUrl);
        setPrompt(info.prompt);
      })
      .catch(() => {
        setWinnerImage(undefined);
        setPrompt(undefined);
      });

    get("/api/get-image", { date: value })
      .then((info) => {
        setUserImage(info.image.signedUrl);
      })
      .catch(() => {
        setUserImage(undefined);
      });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(undefined);
  };

  return (
    <div className="calendar-container">
      <h1>Past Images</h1>
      <Calendar onChange={onChange} value={date} onClickDay={onDateClick} />
      <p>Selected Date: {date.toDateString()}</p>

      {/* Modal */}
      {isModalOpen && selectedDate && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {prompt !== undefined ? <h1>{prompt}</h1> : <h1>Nobody Winner <AiTwotoneFrown /></h1>}
            <div className="image-container">
              <div className="image-wrapper">
                {winnerImage !== undefined ? (
                  <img src={winnerImage} alt="winner image" className="image_scaled" />
                ) : (
                  <p className="missing-image-text">No winner on this date.</p>
                )}
                <p className="image-label">Winner</p>
              </div>
              <div className="image-wrapper">
                {userImage !== undefined ? (
                  <img src={userImage} alt="your image" className="image_scaled" />
                ) : (
                  <p className="missing-image-text">No submission on this date.</p>
                )}
                <p className="image-label">Your Submission</p>
              </div>
            </div>
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
