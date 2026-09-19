import React from 'react';

export default function Petals() {
  const petals = Array.from({ length: 15 });
  return (
    <>
      {petals.map((_, i) => (
        <div
          key={i}
          className="petal"
          style={{
            left: `${Math.random() * 100}vw`,
            animationDuration: `${5 + Math.random() * 5}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          🌸
        </div>
      ))}
    </>
  );
}