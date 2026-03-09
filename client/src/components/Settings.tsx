import React, { useState } from 'react';
import { GameSettings } from '../types/game';

interface Props {
  settings: GameSettings;
  isHost: boolean;
  onUpdate: (settings: Partial<GameSettings>) => void;
  onClose: () => void;
}

export default function Settings({ settings, isHost, onUpdate, onClose }: Props) {
  const [local, setLocal] = useState<GameSettings>({ ...settings, houseRules: { ...settings.houseRules } });

  const update = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
  };

  const updateRule = (key: keyof GameSettings['houseRules'], value: boolean) => {
    setLocal((prev) => ({
      ...prev,
      houseRules: { ...prev.houseRules, [key]: value },
    }));
  };

  const handleSave = () => {
    onUpdate(local);
    onClose();
  };

  const numberInput = (
    label: string,
    key: keyof GameSettings,
    min: number,
    max: number,
    step = 50
  ) => (
    <div className="settings-row">
      <label className="settings-label">{label}</label>
      <div className="settings-control">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={local[key] as number}
          onChange={(e) => update(key, parseInt(e.target.value) as any)}
          disabled={!isHost}
          className="settings-slider"
        />
        <span className="settings-value">£{(local[key] as number).toLocaleString()}</span>
      </div>
    </div>
  );

  const toggle = (
    label: string,
    description: string,
    key: keyof GameSettings['houseRules']
  ) => (
    <div className="settings-toggle-row">
      <div className="settings-toggle-info">
        <div className="settings-toggle-label">{label}</div>
        <div className="settings-toggle-desc">{description}</div>
      </div>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={local.houseRules[key]}
          onChange={(e) => updateRule(key, e.target.checked)}
          disabled={!isHost}
        />
        <span className="toggle-slider" />
      </label>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>⚙️ Game Settings</h2>
          <div className="settings-header-ar">إعدادات اللعبة</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="settings-body">
          {!isHost && (
            <div className="settings-readonly-notice">
              Only the host can change settings.
            </div>
          )}

          <section className="settings-section">
            <h3>Economy</h3>

            {numberInput('Starting Money', 'startingMoney', 500, 5000, 100)}
            {numberInput('GO Salary', 'goSalary', 100, 500, 50)}

            <div className="settings-row">
              <label className="settings-label">Income Tax (Zakat)</label>
              <div className="settings-control">
                <input
                  type="range"
                  min={50}
                  max={400}
                  step={50}
                  value={local.incomeTax}
                  onChange={(e) => update('incomeTax', parseInt(e.target.value))}
                  disabled={!isHost}
                  className="settings-slider"
                />
                <span className="settings-value">£{local.incomeTax}</span>
              </div>
            </div>

            <div className="settings-row">
              <label className="settings-label">Luxury Tax (Customs)</label>
              <div className="settings-control">
                <input
                  type="range"
                  min={25}
                  max={300}
                  step={25}
                  value={local.luxuryTax}
                  onChange={(e) => update('luxuryTax', parseInt(e.target.value))}
                  disabled={!isHost}
                  className="settings-slider"
                />
                <span className="settings-value">£{local.luxuryTax}</span>
              </div>
            </div>
          </section>

          <section className="settings-section">
            <h3>House Rules</h3>

            {toggle(
              '🌴 Free Parking Jackpot',
              'All taxes and fees go to the center. Player landing on Free Parking (Al-Waha) collects it.',
              'freeParkingJackpot'
            )}

            {toggle(
              '🌟 Double Salary on GO',
              'Landing exactly on GO earns double the salary.',
              'doubleOnGo'
            )}

            {toggle(
              '🔒 No Rent in Al-Sijn',
              'Players in jail cannot collect rent from their properties.',
              'noRentInJail'
            )}

            {toggle(
              '⚖️ Auction Unbuilt Properties',
              'If a player declines to buy a property, it goes to auction.',
              'auctionUnbought'
            )}

            {toggle(
              '🏦 Bankrupt Assets to Bank',
              'When a player goes bankrupt, their assets return to the bank instead of the creditor.',
              'bankruptToBank'
            )}
          </section>

          <section className="settings-section">
            <h3>Property Rules</h3>
            <div className="settings-row">
              <label className="settings-label">Max Houses per Property</label>
              <div className="settings-control">
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={1}
                  value={local.maxHouses}
                  onChange={(e) => update('maxHouses', parseInt(e.target.value))}
                  disabled={!isHost}
                  className="settings-slider"
                />
                <span className="settings-value">{local.maxHouses}</span>
              </div>
            </div>
          </section>

          <div className="settings-summary">
            <h4>Summary</h4>
            <div className="settings-summary-grid">
              <div><span>Start Money:</span> <strong>£{local.startingMoney.toLocaleString()}</strong></div>
              <div><span>GO Salary:</span> <strong>£{local.goSalary}</strong></div>
              <div><span>Income Tax:</span> <strong>£{local.incomeTax}</strong></div>
              <div><span>Luxury Tax:</span> <strong>£{local.luxuryTax}</strong></div>
              <div><span>Jackpot:</span> <strong>{local.houseRules.freeParkingJackpot ? 'On' : 'Off'}</strong></div>
              <div><span>Auction:</span> <strong>{local.houseRules.auctionUnbought ? 'On' : 'Off'}</strong></div>
            </div>
          </div>
        </div>

        {isHost && (
          <div className="settings-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save Settings</button>
          </div>
        )}
        {!isHost && (
          <div className="settings-footer">
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
