import React from 'react';

function StarRating({ rating, onRate, size = 18 }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="stars" style={{ fontSize: size + 'px' }}>
      {stars.map((star) => (
        <span
          key={star}
          onClick={onRate ? () => onRate(star) : undefined}
          style={{
            cursor: onRate ? 'pointer' : 'default',
            color: star <= rating ? 'var(--accent)' : 'var(--border)',
          }}
          role={onRate ? 'button' : undefined}
          aria-label={onRate ? `Rate ${star} star${star > 1 ? 's' : ''}` : `${star} star`}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
}

export default StarRating;
