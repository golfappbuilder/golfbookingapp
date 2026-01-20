import { useState } from 'react';

function StarRating({ rating, onRate, readonly = false, size = 'medium' }) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClass = size === 'small' ? 'star-small' : size === 'large' ? 'star-large' : '';

  return (
    <div className={`star-rating ${sizeClass} ${readonly ? 'readonly' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
          onClick={() => !readonly && onRate && onRate(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;
