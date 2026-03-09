import React, { useState } from 'react';
import { GameState, Player, BOARD_SQUARES } from '../types/game';

interface Props {
  game: GameState;
  myId: string;
  onBid: (amount: number) => void;
  onPass: () => void;
}

export default function AuctionModal({ game, myId, onBid, onPass }: Props) {
  const [bidAmount, setBidAmount] = useState('');
  const auction = game.auction!;
  const square = BOARD_SQUARES[auction.position];
  const currentBidder = auction.currentBidderId
    ? game.players.find((p) => p.id === auction.currentBidderId)
    : null;
  const me = game.players.find((p) => p.id === myId);
  const hasPassed = auction.passedPlayers.includes(myId);

  const minBid = auction.currentBid + 1;

  const handleBid = () => {
    const amount = parseInt(bidAmount);
    if (!isNaN(amount) && amount >= minBid) {
      onBid(amount);
      setBidAmount('');
    }
  };

  const quickBids = [
    minBid,
    Math.min(minBid + 10, (me?.money || 0)),
    Math.min(minBid + 50, (me?.money || 0)),
    Math.min((square.price || 100), (me?.money || 0)),
  ].filter((v, i, arr) => v > 0 && arr.indexOf(v) === i && v <= (me?.money || 0));

  return (
    <div className="modal-overlay">
      <div className="auction-modal">
        <div className="auction-modal-header">
          <span className="auction-icon">⚖️</span>
          <h2>Auction!</h2>
          <div className="auction-modal-arabic">مزاد</div>
        </div>

        <div className="auction-property">
          <strong>{square.name}</strong>
          <span>{square.nameAr}</span>
          {square.price && <span>Listed at £{square.price}</span>}
        </div>

        <div className="auction-current-bid">
          <div className="auction-bid-label">Current Bid</div>
          <div className="auction-bid-amount">
            {auction.currentBid > 0 ? `£${auction.currentBid}` : 'No bids yet'}
          </div>
          {currentBidder && (
            <div className="auction-bidder" style={{ color: currentBidder.color }}>
              by {currentBidder.name}
            </div>
          )}
        </div>

        <div className="auction-passed">
          Passed: {auction.passedPlayers.map((id) => {
            const p = game.players.find((pl) => pl.id === id);
            return p?.name;
          }).filter(Boolean).join(', ') || 'None'}
        </div>

        {!hasPassed && me && !me.isBankrupt && (
          <div className="auction-actions">
            <div className="quick-bids">
              {quickBids.map((amount) => (
                <button
                  key={amount}
                  className="btn btn-sm btn-secondary"
                  onClick={() => { setBidAmount(amount.toString()); }}
                >
                  £{amount}
                </button>
              ))}
            </div>
            <div className="bid-input-row">
              <input
                type="number"
                className="bid-input"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`Min £${minBid}`}
                min={minBid}
                max={me.money}
              />
              <button
                className="btn btn-success"
                onClick={handleBid}
                disabled={!bidAmount || parseInt(bidAmount) < minBid}
              >
                Bid
              </button>
            </div>
            <button className="btn btn-danger" onClick={onPass}>
              Pass
            </button>
          </div>
        )}

        {hasPassed && (
          <div className="auction-passed-notice">
            You have passed on this auction.
          </div>
        )}
      </div>
    </div>
  );
}
