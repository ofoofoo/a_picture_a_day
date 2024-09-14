import React, { useEffect, useState } from "react";
import "./Vote.css";
import ImageList from "./ImageList";

// Define how many images a user can vote for
const MAX_VOTES = 1;

const Vote: React.FC = () => {
  const [imagestwo, setImages] = useState<{ id: number; url: string; name: string }[]>([]);
  const [votes, setVotes] = useState<number[]>([]);
  let images: { id: number; url: string; name: string }[] = [];

  useEffect(() => {
    const loadImages = async () => {
      const curDate = new Date().toISOString();
      const response = await fetch("/api/get-images?date=" + curDate);
      const result = await response.json();
      const imagest = result.imagesWithSignedUrl;
      let id = 0;
      imagest.forEach((image) => {
        images = [...images, { id: id, url: image.signedUrl, name: image.name }];
        id = id + 1;
      });
      return images;
    };
    loadImages().then((images) => {
      setImages(images);
    });
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
      {/* <div id="image-gallery"></div> */}
      <ImageList images={imagestwo} votes={votes} onVote={handleVote} maxVotes={MAX_VOTES} />
      {/* <p>{`You can vote for up to ${MAX_VOTES} image.`}</p> */}
    </div>
  );
};

export default Vote;
