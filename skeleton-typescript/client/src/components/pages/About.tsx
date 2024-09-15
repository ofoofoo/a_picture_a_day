import React from "react";
import "./About.css"; // Import the CSS file for styling

const About = () => {
  return (
    <div className="about-container">
      <h1>About Us</h1>
      <b>
        <p>This is Seen.</p>
        <p>
          Each day, a prompt is generated, and each user (including you!) uploads a photo that they
          think fits the prompt. You can then vote on what they think is the best/funniest/etc.
          photo of the day. You'll find out the winner the next day!
        </p>
        <p>Made by Abhay Bestrapalli, Mason Fang, Orion Foo, and Nathan Xiong.</p>
      </b>
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
