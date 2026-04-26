import { lazy, Suspense, useState } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));
const PHONE_SCENE_URL = 'https://prod.spline.design/XlZZcopc4WLHKB6j/scene.splinecode';

export function PhonePreview() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="phone-preview spline-phone" data-reveal>
      <div className="phone-preview__halo" />
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
    </div>
  );
}
