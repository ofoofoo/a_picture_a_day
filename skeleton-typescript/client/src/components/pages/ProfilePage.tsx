import React from 'react';
import './ProfilePage.css';
import { Link } from "@reach/router";

type Memory = {
  id: number;
  imageUrl: string;
};

const memories: Memory[] = [
  { id: 1, imageUrl: 'memory1.jpg' },
  { id: 2, imageUrl: 'memory2.jpg' },
  { id: 3, imageUrl: 'memory3.jpg' },
  { id: 4, imageUrl: 'memory4.jpg' },
  { id: 5, imageUrl: 'memory5.jpg' },
];

const ProfilePage: React.FC = () => {
  return (
    <div className="profile-container">
      <img
        src="profile-pic.jpg"
        alt="Profile"
        className="profile-pic"
      />
      <div className="username">big shaq</div>
      <div className="handle">@jbursz</div>
      
      <div className="memories">
        {memories.map(memory => (
          <div
            key={memory.id}
            className="memory"
            style={{ backgroundImage: `url(${memory.imageUrl})` }}
          />
        ))}
      </div>
      <Link to="/calendar">
        <button className="view-button">View all photos</button>
      </Link>
    </div>
  );
};

export default ProfilePage;
