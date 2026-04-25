import { useMemo, useState } from 'react';
import { PhoneScreen, phoneScreens } from '../data/landing';

function ScreenPanel({ screen }: { screen: PhoneScreen }) {
  return (
    <div className="phone-screen">
      <div className="phone-screen__status">
        <span>21:40</span>
        <span>Goalie AI</span>
      </div>

      <div className="phone-screen__hero">
        <p>{screen.eyebrow}</p>
        <h3>{screen.title}</h3>
        <div className="phone-screen__metric">
          <strong>{screen.metric}</strong>
          <span>{screen.metricLabel}</span>
        </div>
      </div>

      <div className="phone-screen__rink">
        <div className="phone-screen__line phone-screen__line--blue" />
        <div className="phone-screen__line phone-screen__line--red" />
        <div className="phone-screen__crease" />
        <div className="phone-screen__goalie" />
        <div className="phone-screen__puck" />
        <div className="phone-screen__motion phone-screen__motion--one" />
        <div className="phone-screen__motion phone-screen__motion--two" />
      </div>

      <p className="phone-screen__description">{screen.description}</p>

      <div className="phone-screen__chips">
        {screen.chips.map((chip) => (
          <span key={chip}>{chip}</span>
        ))}
      </div>
    </div>
  );
}

export function PhonePreview() {
  const [activeScreenId, setActiveScreenId] = useState(phoneScreens[0].id);
  const activeScreen = useMemo(
    () => phoneScreens.find((screen) => screen.id === activeScreenId) ?? phoneScreens[0],
    [activeScreenId],
  );

  return (
    <div className="phone-preview">
      <div className="phone-preview__halo" />
      <div className="phone-device" aria-label="Интерактивное превью приложения">
        <div className="phone-device__side phone-device__side--left" />
        <div className="phone-device__side phone-device__side--right" />
        <div className="phone-device__bezel" />
        <div className="phone-device__island">
          <span />
          <i />
        </div>
        <ScreenPanel screen={activeScreen} />
      </div>

      <div className="phone-preview__controls" aria-label="Переключение экранов приложения">
        {phoneScreens.map((screen) => (
          <button
            className={screen.id === activeScreenId ? 'is-active' : ''}
            key={screen.id}
            onClick={() => setActiveScreenId(screen.id)}
            type="button"
          >
            {screen.label}
          </button>
        ))}
      </div>
    </div>
  );
}
