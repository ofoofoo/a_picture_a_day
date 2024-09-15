import React from "react";
import "./About.css"; // Import the CSS file for styling

const About = () => {
  return (
    <div className="about-container">
      <h1>About Us</h1>
      <p>This is Seen.</p>
      <a
        href="https://github.com/ofoofoo/a_picture_a_day"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="github-mark-white.png" alt="GitHub" className="github-icon" />
      </a>
    </div>
  );
};

export default About;
