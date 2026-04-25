import { useEffect } from 'react';
import { PhonePreview } from './components/PhonePreview';
import { ScrollStoryboardLayer } from './components/ScrollStoryboardLayer';
import { features, highlights, timeline } from './data/landing';

function App() {
  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const setElementVisibility = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      const isVisible =
        rect.top < viewportHeight * 0.94 &&
        rect.bottom > viewportHeight * 0.06 &&
        rect.left < viewportWidth &&
        rect.right > 0;

      element.classList.toggle('is-visible', isVisible);
    };

    if (prefersReducedMotion) {
      revealElements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    revealElements.forEach(setElementVisibility);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
      },
      {
        rootMargin: '0px 0px -6% 0px',
        threshold: 0.01,
      },
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="landing">
      <ScrollStoryboardLayer />

      <header className="nav">
        <a className="nav__brand" href="#top" aria-label="Coacher AI">
          <span />
          Coacher AI
        </a>
        <nav className="nav__links" aria-label="Основная навигация">
          <a href="#product">Приложение</a>
          <a href="#features">Функции</a>
          <a href="#storyboard">Видео-фон</a>
        </nav>
        <a className="nav__cta" href="#waitlist">
          Early access
        </a>
      </header>

      <section className="hero section" id="top">
        <div className="hero__content" data-reveal>
          <p className="eyebrow">AI goalie coach in your pocket</p>
          <h1>Персональный ИИ-тренер по хоккею</h1>
          <p className="hero__lead">
            Приложение разбирает игровые эпизоды, помогает держать правильную
            позицию в воротах и дает вратарю быстрый фидбек после каждого видео.
          </p>

          <div className="hero__actions">
            <a className="button button--primary" href="#product">
              Смотреть превью
            </a>
            <a className="button button--ghost" href="#storyboard">
              Под видео-раскадровку
            </a>
          </div>

          <div className="hero__highlights" aria-label="Ключевые преимущества">
            {highlights.map((item) => (
              <div data-reveal key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <PhonePreview />
      </section>

      <section className="section product" id="product">
        <div className="section__heading" data-reveal>
          <p className="eyebrow">Mobile first</p>
          <h2>Мобильные экраны собраны вокруг задач голкипера.</h2>
        </div>
        <div className="product__grid">
          <article data-reveal>
            <span>01</span>
            <h3>Переключаемые сценарии</h3>
            <p>
              Демо-экран меняется кнопками: позиция в crease, дневная сессия и
              быстрый разбор эпизода. Позже сюда можно подключить реальные данные.
            </p>
          </article>
          <article data-reveal>
            <span>02</span>
            <h3>Фокус на скорости доступа</h3>
            <p>
              Визуальная логика построена вокруг телефона: крупные метрики, короткие
              подсказки и понятные действия для вратаря между сериями бросков.
            </p>
          </article>
          <article data-reveal>
            <span>03</span>
            <h3>Премиальная темная база</h3>
            <p>
              Матовый черный, графит, мягкие блики и кинематографичная глубина без
              перегруза интерфейса.
            </p>
          </article>
        </div>
      </section>

      <section className="section features" id="features">
        <div className="section__heading" data-reveal>
          <p className="eyebrow">Goalie training system</p>
          <h2>Заготовка под полноценную историю вратарского продукта.</h2>
        </div>
        <div className="features__list">
          {features.map((feature) => (
            <article data-reveal key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section storyboard" data-reveal id="storyboard">
        <div>
          <p className="eyebrow">Scroll video ready</p>
          <h2>Фон подготовлен под видео-раскадровку вратарских эпизодов.</h2>
          <p>
            Сейчас работает атмосферный placeholder-слой. Когда появятся клипы,
            его можно заменить на canvas, image sequence или video element с
            управлением прогрессом скролла: бросок, сейв, восстановление, повтор.
          </p>
        </div>
        <ol>
          {timeline.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section className="section waitlist" data-reveal id="waitlist">
        <p className="eyebrow">Private beta</p>
        <h2>Готово к подключению формы для вратарей и тренеров.</h2>
        <p>
          Блок оставлен как финальный CTA: сюда можно добавить заявки от вратарей,
          родителей, академий и тренеров, а затем подключить CRM или backend API.
        </p>
        <a className="button button--primary" href="mailto:team@coacher.ai">
          Запросить доступ
        </a>
      </section>
    </main>
  );
}

export default App;
