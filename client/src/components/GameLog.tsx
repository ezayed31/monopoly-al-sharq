import React, { useEffect, useRef } from 'react';

interface Props {
  log: string[];
}

export default function GameLog({ log }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  return (
    <div className="game-log">
      <div className="game-log-header">
        📜 Game Log
      </div>
      <div className="game-log-entries">
        {[...log].reverse().map((entry, i) => (
          <div key={i} className={`log-entry ${i === 0 ? 'log-entry--latest' : ''}`}>
            {entry}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
