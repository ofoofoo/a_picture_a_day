import React, { useEffect, useState } from "react";
import "./Vote.css";
import ImageList from "./ImageList";

// Define how many images a user can vote for
const MAX_VOTES = 3;

// Mock API call for images (Replace with real API call)
const fetchImages = async () => {
  return [
    { id: 1, url: "https://via.placeholder.com/200x200", name: "Image 1" },
    { id: 2, url: "https://via.placeholder.com/200x200", name: "Image 2" },
    { id: 3, url: "https://via.placeholder.com/200x200", name: "Image 3" },
    { id: 4, url: "https://via.placeholder.com/200x200", name: "Image 4" },
    { id: 5, url: "https://via.placeholder.com/200x200", name: "Image 5" },
    { id: 6, url: "https://via.placeholder.com/200x200", name: "Image 3" },
    { id: 7, url: "https://via.placeholder.com/200x200", name: "Image 4" },
    { id: 8, url: "https://via.placeholder.com/500x600", name: "Image 5" },
  ];
};

const Vote: React.FC = () => {
  const [images, setImages] = useState<{ id: number; url: string; name: string }[]>([]);
  const [votes, setVotes] = useState<number[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const result = await fetchImages();
      setImages(result);
    };
    loadImages();
  }, []);

  const handleVote = (imageId: number) => {
    if (votes.includes(imageId)) {
      setVotes(votes.filter((id) => id !== imageId)); // Remove vote
    } else if (votes.length < MAX_VOTES) {
      setVotes([...votes, imageId]); // Add vote
    }
  };

  return (
    <div className="app">
      <h1 className="title">Vote for the best one!</h1>
      <ImageList images={images} votes={votes} onVote={handleVote} maxVotes={MAX_VOTES} />
      <p>{`You can vote for up to ${MAX_VOTES} images.`}</p>
    </div>
  );
};

export default Vote;
