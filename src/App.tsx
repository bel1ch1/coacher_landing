import { useEffect } from 'react';
import { PhonePreview } from './components/PhonePreview';
import { ScrollStoryboardLayer } from './components/ScrollStoryboardLayer';
import { audience, features, highlights, productCards, subscriptionLevels } from './data/landing';

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
          <a href="#features">Преимущества</a>
          <a href="#audience">Для кого</a>
          <a href="#pricing">Подписка</a>
        </nav>
        <a className="nav__cta" href="#waitlist">
          Получить доступ
        </a>
      </header>

      <section className="hero section" id="top">
        <div className="hero__content" data-reveal>
          <p className="eyebrow">Goalie assistant in your pocket</p>
          <h1>Первый в мире вратарский ассистент</h1>
          <p className="hero__lead">
            В одном месте собраны тренировки, упражнения и фишки для развития
            твоих вратарских навыков. Программы созданы на основе опыта работы
            с топовыми специалистами уровня НХЛ, КХЛ и МХЛ.
          </p>

          <div className="hero__actions">
            <a className="button button--primary" href="#product">
              Изучить возможности
            </a>
            <a className="button button--ghost" href="#pricing">
              Смотреть подписки
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
          <p className="eyebrow">Training anywhere</p>
          <h2>Тренируйся в любой точке планеты: зал, улица, дом.</h2>
        </div>
        <div className="product__grid">
          {productCards.map((card, index) => (
            <article data-reveal key={card.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section features" id="features">
        <div className="section__heading" data-reveal>
          <p className="eyebrow">Modern goalie system</p>
          <h2>Хоккей не стоит на месте, поэтому база постоянно обновляется.</h2>
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

      <section className="section audience" id="audience">
        <div className="section__heading" data-reveal>
          <p className="eyebrow">For every goalie path</p>
          <h2>Для кого подойдет ассистент.</h2>
        </div>
        <div className="audience__grid">
          {audience.map((item) => (
            <article data-reveal key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section pricing" id="pricing">
        <div className="section__heading" data-reveal>
          <p className="eyebrow">Subscription levels</p>
          <h2>Уровни подписки под разный темп и мотивацию.</h2>
        </div>
        <div className="pricing__grid">
          {subscriptionLevels.map((level) => (
            <article data-reveal key={level.name}>
              <div className="pricing__header">
                <span>{level.label}</span>
                <h3>{level.name}</h3>
              </div>
              <p>{level.text}</p>
              <a
                className="pricing__button"
                href={`mailto:team@coacher.ai?subject=${encodeURIComponent(`Цена подписки ${level.name}`)}`}
              >
                Узнать цену
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section storyboard" data-reveal>
        <div>
          <p className="eyebrow">Feedback driven</p>
          <h2>Приложение становится эффективнее благодаря игрокам.</h2>
          <p>
            Команда детально отслеживает ваши отзывы и предложения, улучшает
            тренировочную базу и добавляет функции, которые действительно помогают
            вратарям развиваться.
          </p>
        </div>
        <p className="storyboard__accent">
          Возможность адаптивного сопровождения помогает держать фокус на ваших
          интересах, задачах и текущем уровне подготовки.
        </p>
      </section>

      <section className="section waitlist" data-reveal id="waitlist">
        <p className="eyebrow">Start training smarter</p>
        <h2>Получай вратарскую базу и ассистента по цене одной тренировки.</h2>
        <p>
          Оставь заявку, чтобы первым получить доступ к приложению для вратарей,
          родителей, тренеров и игроков профессиональных команд.
        </p>
        <a className="button button--primary" href="mailto:team@coacher.ai">
          Получить доступ
        </a>
      </section>
    </main>
  );
}

export default App;
