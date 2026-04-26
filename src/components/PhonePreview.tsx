import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { TextureFilter } from '@splinetool/runtime';
import type { Application, SPEObject, TextureLayer } from '@splinetool/runtime';
import { PhoneScreen, phoneScreens } from '../data/landing';

const Spline = lazy(() => import('@splinetool/react-spline'));
const PHONE_SCENE_URL = 'https://prod.spline.design/6L9lxdQpL7KVNOqi/scene.splinecode';
const MOBILE_QUERY = '(max-width: 620px)';
const SCREEN_OBJECT_NAME = 'Screen';
const SCREEN_TEXTURE_SCALE = 4;

type ScreenTextureTarget = {
  object: SPEObject;
  textureLayer: TextureLayer;
};

function getIsMobileViewport() {
  return typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches;
}

function escapeSvgText(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(value: string, maxLineLength: number) {
  const words = value.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length > maxLineLength && currentLine) {
      lines.push(currentLine);
      currentLine = word;
      return;
    }

    currentLine = nextLine;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.slice(0, 3);
}

function createPhoneScreenSvg(screen: PhoneScreen) {
  const descriptionLines = wrapText(screen.description, 34);
  const chipWidth = 74;
  const chips = screen.chips
    .map((chip, index) => {
      const x = 32 + index * (chipWidth + 10);

      return `
        <rect x="${x}" y="718" width="${chipWidth}" height="32" rx="8" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.13)" />
        <text x="${x + chipWidth / 2}" y="739" text-anchor="middle" fill="#b5b5b1" font-size="12">${escapeSvgText(chip)}</text>
      `;
    })
    .join('');

  const description = descriptionLines
    .map(
      (line, index) =>
        `<text x="32" y="${642 + index * 23}" fill="#b5b5b1" font-size="16">${escapeSvgText(line)}</text>`,
    )
    .join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="390" height="844" viewBox="0 0 390 844" font-family="Satoshi, Arial, sans-serif">
      <defs>
        <radialGradient id="topGlow" cx="50%" cy="3%" r="45%">
          <stop offset="0%" stop-color="#d7d0bd" stop-opacity="0.22" />
          <stop offset="100%" stop-color="#17191c" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="screenBg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#17191c" />
          <stop offset="100%" stop-color="#0b0c0e" />
        </linearGradient>
        <pattern id="rinkGrid" width="34" height="34" patternUnits="userSpaceOnUse">
          <path d="M 34 0 L 0 0 0 34" fill="none" stroke="rgba(255,255,255,0.045)" stroke-width="1" />
        </pattern>
      </defs>
      <rect width="390" height="844" rx="32" fill="url(#screenBg)" />
      <rect width="390" height="844" rx="32" fill="url(#topGlow)" />
      <text x="28" y="45" fill="rgba(255,255,255,0.58)" font-size="14">21:40</text>
      <text x="362" y="45" text-anchor="end" fill="rgba(255,255,255,0.58)" font-size="14">Goalie AI</text>
      <text x="32" y="105" fill="#d7d0bd" font-size="13" font-weight="700" letter-spacing="2">${escapeSvgText(screen.eyebrow.toUpperCase())}</text>
      <text x="32" y="152" fill="#f4f1ea" font-family="Clash Display, Arial, sans-serif" font-size="34" font-weight="700">${escapeSvgText(screen.title)}</text>
      <rect x="32" y="178" width="178" height="86" rx="16" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.13)" />
      <text x="52" y="226" fill="#f4f1ea" font-size="42" font-weight="700">${escapeSvgText(screen.metric)}</text>
      <text x="52" y="248" fill="#b5b5b1" font-size="14">${escapeSvgText(screen.metricLabel)}</text>
      <rect x="32" y="292" width="326" height="244" rx="22" fill="#111316" stroke="rgba(255,255,255,0.12)" />
      <rect x="32" y="292" width="326" height="244" rx="22" fill="url(#rinkGrid)" />
      <line x1="140" y1="292" x2="140" y2="536" stroke="#69707b" stroke-width="3" opacity="0.65" />
      <line x1="248" y1="292" x2="248" y2="536" stroke="#b9afa0" stroke-width="3" opacity="0.65" />
      <path d="M 114 548 A 81 81 0 0 1 276 548" fill="none" stroke="rgba(215,208,189,0.48)" stroke-width="4" />
      <rect x="164" y="485" width="62" height="38" rx="16" fill="#b9b19f" opacity="0.95" />
      <rect x="169" y="491" width="14" height="32" rx="4" fill="#15171b" opacity="0.9" />
      <rect x="207" y="491" width="14" height="32" rx="4" fill="#15171b" opacity="0.9" />
      <circle cx="92" cy="372" r="11" fill="#050505" stroke="rgba(255,255,255,0.15)" stroke-width="4" />
      <circle cx="286" cy="340" r="68" fill="none" stroke="rgba(215,208,189,0.2)" stroke-width="2" />
      <circle cx="92" cy="486" r="62" fill="none" stroke="rgba(215,208,189,0.16)" stroke-width="2" />
      ${description}
      ${chips}
      <rect x="20" y="760" width="350" height="64" rx="18" fill="url(#screenBg)" opacity="0.72" />
    </svg>
  `;

  return svg;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to render phone screen SVG.'));
    image.src = src;
  });
}

async function createPhoneScreenTextureUrl(screen: PhoneScreen) {
  const svgBlob = new Blob([createPhoneScreenSvg(screen)], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await loadImage(svgUrl);
    const canvas = document.createElement('canvas');
    canvas.width = 390 * SCREEN_TEXTURE_SCALE;
    canvas.height = 844 * SCREEN_TEXTURE_SCALE;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas 2D context is not available.');
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create phone screen PNG texture.'));
          return;
        }

        resolve(blob);
      }, 'image/png');
    });

    return URL.createObjectURL(pngBlob);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function findTextureLayer(object: SPEObject) {
  return object.material?.layers.find((layer): layer is TextureLayer => layer.type === 'texture');
}

function configureTextureLayer(textureLayer: TextureLayer) {
  textureLayer.alpha = 1;
  textureLayer.texture.minFilter = TextureFilter.LinearFilter;
  textureLayer.texture.magFilter = TextureFilter.LinearFilter;
}

function findScreenTextureTarget(app: Application): ScreenTextureTarget | undefined {
  const object = app.findObjectByName(SCREEN_OBJECT_NAME);
  const textureLayer = object ? findTextureLayer(object) : undefined;

  if (textureLayer) {
    configureTextureLayer(textureLayer);
  }

  return object && textureLayer ? { object, textureLayer } : undefined;
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

function PhoneScreenControls({
  activeScreenId,
  className,
  onScreenChange,
}: {
  activeScreenId: string;
  className: string;
  onScreenChange: (screenId: string) => void;
}) {
  return (
    <div className={className} aria-label="Переключение экранов приложения">
      {phoneScreens.map((screen) => (
        <button
          className={screen.id === activeScreenId ? 'is-active' : ''}
          key={screen.id}
          onClick={() => onScreenChange(screen.id)}
          type="button"
        >
          {screen.label}
        </button>
      ))}
    </div>
  );
}

function MobilePhoneMockup({
  activeScreen,
  activeScreenId,
  onScreenChange,
}: {
  activeScreen: PhoneScreen;
  activeScreenId: string;
  onScreenChange: (screenId: string) => void;
}) {
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

      <PhoneScreenControls
        activeScreenId={activeScreenId}
        className="mobile-phone__controls"
        onScreenChange={onScreenChange}
      />
    </div>
  );
}

export function PhonePreview() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(getIsMobileViewport);
  const [activeScreenId, setActiveScreenId] = useState(phoneScreens[0].id);
  const [screenTextureTarget, setScreenTextureTarget] = useState<ScreenTextureTarget | null>(null);
  const splineAppRef = useRef<Application | null>(null);
  const activeTextureUrlRef = useRef<string | null>(null);
  const activeScreen = useMemo(
    () => phoneScreens.find((screen) => screen.id === activeScreenId) ?? phoneScreens[0],
    [activeScreenId],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const handleChange = () => setIsMobileViewport(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!screenTextureTarget) {
      return;
    }

    let isCancelled = false;

    void createPhoneScreenTextureUrl(activeScreen)
      .then(async (textureUrl) => {
        if (isCancelled) {
          URL.revokeObjectURL(textureUrl);
          return;
        }

        const previousTextureUrl = activeTextureUrlRef.current;
        activeTextureUrlRef.current = textureUrl;

        await screenTextureTarget.textureLayer.updateTexture(textureUrl);
        splineAppRef.current?.requestRender();
        console.info(`Updated Spline screen PNG texture on "${screenTextureTarget.object.name}".`);

        if (previousTextureUrl) {
          URL.revokeObjectURL(previousTextureUrl);
        }
      })
      .catch((error) => {
        console.error(`Failed to update Spline screen texture on "${screenTextureTarget.object.name}".`, error);
      });

    return () => {
      isCancelled = true;
    };
  }, [activeScreen, screenTextureTarget]);

  useEffect(() => {
    return () => {
      if (activeTextureUrlRef.current) {
        URL.revokeObjectURL(activeTextureUrlRef.current);
      }
    };
  }, []);

  function handleSplineLoad(app: Application) {
    splineAppRef.current = app;
    setIsLoaded(true);

    const textureTarget = findScreenTextureTarget(app);
    setScreenTextureTarget(textureTarget ?? null);

    const screenObject = app.findObjectByName(SCREEN_OBJECT_NAME);
    console.info('Spline Screen diagnostic:', {
      found: Boolean(screenObject),
      layers: screenObject?.material?.layers.map((layer) => layer.type) ?? [],
    });

    if (!textureTarget) {
      const texturedObjects = app
        .getAllObjects()
        .filter((object) => Boolean(object.material?.layers.some((layer) => layer.type === 'texture')))
        .map((object) => ({
          name: object.name,
          layers: object.material?.layers.map((layer) => layer.type) ?? [],
        }));

      console.warn(
        'Screen texture layer was not found. Add an Image/Texture layer to the Screen material in Spline, then Promote to Production.',
        {
          screenFound: Boolean(screenObject),
          screenLayers: screenObject?.material?.layers.map((layer) => layer.type) ?? [],
          texturedObjects,
        },
      );
    }
  }

  return (
    <div className="phone-preview spline-phone" data-reveal>
      <div className="phone-preview__halo" />
      {!isMobileViewport && (
        <>
          <div className="spline-phone__stage" aria-label="Интерактивная 3D модель телефона">
            <div className={isLoaded ? 'spline-phone__fallback is-hidden' : 'spline-phone__fallback'}>
              <span />
              <p>Loading 3D phone</p>
            </div>
            <Suspense fallback={null}>
              <Spline
                className="spline-phone__scene"
                onLoad={handleSplineLoad}
                scene={PHONE_SCENE_URL}
              />
            </Suspense>
          </div>
          {isLoaded && (
            <PhoneScreenControls
              activeScreenId={activeScreenId}
              className="spline-phone__controls"
              onScreenChange={setActiveScreenId}
            />
          )}
        </>
      )}
      {isMobileViewport && (
        <MobilePhoneMockup
          activeScreen={activeScreen}
          activeScreenId={activeScreenId}
          onScreenChange={setActiveScreenId}
        />
      )}
    </div>
  );
}
