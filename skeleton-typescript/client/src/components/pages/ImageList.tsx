import React, { useState } from "react";
import "./ImageList.css";

interface ImageListProps {
  images: { id: number; url: string; name: string }[];
  votes: number[];
  onVote: (imageId: number) => void;
  maxVotes: number;
}

const ImageList: React.FC<ImageListProps> = ({ images, votes, onVote, maxVotes }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  return (
    <div className="image-list">
      {images.map((image) => (
        <div key={image.id} className="image-item">
          <div className="image-preview" onClick={() => setSelectedImage(image.url)}>
            <img src={image.url} alt={image.name} />
          </div>
          <h3>{image.name}</h3>
          <button
            onClick={() => onVote(image.id)}
            className={votes.includes(image.id) ? "voted" : ""}
            disabled={!votes.includes(image.id) && votes.length >= maxVotes}
          >
            {votes.includes(image.id) ? "Unvote" : "Vote"}
          </button>
        </div>
      ))}

      {/* Modal for full-size image */}
      {selectedImage && (
        <div className="modal" onClick={() => setSelectedImage(null)}>
          <span className="close">&times;</span>
          <img className="modal-content" src={selectedImage} alt="Full-size" />
        </div>
      )}
    </div>
  );
};

export default ImageList;
