import React, { useState, useEffect } from 'react';

interface Props {
  dice: [number, number];
  rolling?: boolean;
}

const diceFaces: Record<number, string[]> = {
  1: ['', '', '', '●', '', '', ''],
  2: ['●', '', '', '', '', '', '●'],
  3: ['●', '', '', '●', '', '', '●'],
  4: ['●', '●', '', '', '', '●', '●'],
  5: ['●', '●', '', '●', '', '●', '●'],
  6: ['●', '●', '●', '', '●', '●', '●'],
};

function DieFace({ value, rolling }: { value: number; rolling?: boolean }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (rolling) {
      let count = 0;
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
        count++;
        if (count > 10) clearInterval(interval);
      }, 60);
      return () => clearInterval(interval);
    } else {
      setDisplayValue(value);
    }
  }, [value, rolling]);

  const dots = diceFaces[displayValue] || diceFaces[1];

  return (
    <div className={`die-face ${rolling ? 'die-face--rolling' : ''}`}>
      <div className="die-grid">
        {dots.map((dot, i) => (
          <div key={i} className={`die-dot ${dot ? 'die-dot--filled' : ''}`} />
        ))}
      </div>
    </div>
  );
}

export default function Dice({ dice, rolling }: Props) {
  const [d1, d2] = dice;
  const isDoubles = d1 === d2 && d1 > 0;

  return (
    <div className="dice-container">
      <div className="dice-pair">
        <DieFace value={d1 || 1} rolling={rolling} />
        <DieFace value={d2 || 1} rolling={rolling} />
      </div>
      {d1 > 0 && !rolling && (
        <div className="dice-total">
          {d1 + d2}
          {isDoubles && <span className="dice-doubles">Doubles!</span>}
        </div>
      )}
    </div>
  );
}
