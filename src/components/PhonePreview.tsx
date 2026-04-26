import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { PhoneScreen, phoneScreens } from '../data/landing';

const Spline = lazy(() => import('@splinetool/react-spline'));
const PHONE_SCENE_URL = 'https://prod.spline.design/XlZZcopc4WLHKB6j/scene.splinecode';
const MOBILE_QUERY = '(max-width: 620px)';

function getIsMobileViewport() {
  return typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches;
}

function MobileScreenPanel({ screen }: { screen: PhoneScreen }) {
  return (
    <div className="mobile-phone__screen">
      <div className="mobile-phone__status">
        <span>21:40</span>
        <span>Goalie AI</span>
      </div>

      <div className="mobile-phone__hero">
        <p>{screen.eyebrow}</p>
        <h3>{screen.title}</h3>
        <div className="mobile-phone__metric">
          <strong>{screen.metric}</strong>
          <span>{screen.metricLabel}</span>
        </div>
      </div>

      <div className="mobile-phone__rink">
        <div className="mobile-phone__line mobile-phone__line--blue" />
        <div className="mobile-phone__line mobile-phone__line--red" />
        <div className="mobile-phone__crease" />
        <div className="mobile-phone__goalie" />
        <div className="mobile-phone__puck" />
        <div className="mobile-phone__motion mobile-phone__motion--one" />
        <div className="mobile-phone__motion mobile-phone__motion--two" />
      </div>

      <p className="mobile-phone__description">{screen.description}</p>

      <div className="mobile-phone__chips">
        {screen.chips.map((chip) => (
          <span key={chip}>{chip}</span>
        ))}
      </div>
    </div>
  );
}

function MobilePhoneMockup() {
  const [activeScreenId, setActiveScreenId] = useState(phoneScreens[0].id);
  const activeScreen = useMemo(
    () => phoneScreens.find((screen) => screen.id === activeScreenId) ?? phoneScreens[0],
    [activeScreenId],
  );

  return (
    <div className="mobile-phone">
      <div className="mobile-phone__device" aria-label="Интерактивное мобильное превью приложения">
        <div className="mobile-phone__side mobile-phone__side--left" />
        <div className="mobile-phone__side mobile-phone__side--right" />
        <div className="mobile-phone__bezel" />
        <div className="mobile-phone__island">
          <span />
          <i />
        </div>
        <MobileScreenPanel screen={activeScreen} />
      </div>

      <div className="mobile-phone__controls" aria-label="Переключение экранов приложения">
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

export function PhonePreview() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(getIsMobileViewport);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const handleChange = () => setIsMobileViewport(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="phone-preview spline-phone" data-reveal>
      <div className="phone-preview__halo" />
      {!isMobileViewport && (
        <div className="spline-phone__stage" aria-label="Интерактивная 3D модель телефона">
          <div className={isLoaded ? 'spline-phone__fallback is-hidden' : 'spline-phone__fallback'}>
            <span />
            <p>Loading 3D phone</p>
          </div>
          <Suspense fallback={null}>
            <Spline
              className="spline-phone__scene"
              onLoad={() => setIsLoaded(true)}
              scene={PHONE_SCENE_URL}
            />
          </Suspense>
        </div>
      )}
      {isMobileViewport && <MobilePhoneMockup />}
    </div>
  );
}
