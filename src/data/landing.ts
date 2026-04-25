export type PhoneScreen = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  metric: string;
  metricLabel: string;
  description: string;
  chips: string[];
};

export const phoneScreens: PhoneScreen[] = [
  {
    id: 'analysis',
    label: 'Разбор',
    eyebrow: 'Crease Vision',
    title: 'Позиция в воротах',
    metric: '92%',
    metricLabel: 'контроль угла',
    description: 'AI отмечает глубину, стойку, работу клюшкой и закрытие ближнего угла.',
    chips: ['угол атаки', 'глубина', 'стойка'],
  },
  {
    id: 'plan',
    label: 'План',
    eyebrow: 'Goalie routine',
    title: 'Сессия на сегодня',
    metric: '28',
    metricLabel: 'минут реакции и ног',
    description: 'Короткая программа под следующий матч: shuffle, butterfly, recovery и контроль отскока.',
    chips: ['shuffle', 'butterfly', 'rebound'],
  },
  {
    id: 'feedback',
    label: 'Фидбек',
    eyebrow: 'Instant review',
    title: 'Совет вратарю',
    metric: '1:42',
    metricLabel: 'до точной правки',
    description: 'Вратарь отправляет эпизод и получает понятный разбор: что видел, куда сместился и как сыграть чище.',
    chips: ['эпизод', 'угол', 'решение'],
  },
];

export const highlights = [
  {
    value: '24/7',
    label: 'вратарский тренер рядом',
  },
  {
    value: '0.4s',
    label: 'реакция под контролем',
  },
  {
    value: 'AI',
    label: 'разбор игровых эпизодов',
  },
];

export const features = [
  {
    title: 'Вратарский тренер всегда рядом',
    text: 'Голкипер открывает приложение перед льдом, после серии бросков или дома. Быстрый доступ к разбору без долгих созвонов и ожидания тренировки.',
  },
  {
    title: 'Разбор эпизодов из ворот',
    text: 'Загрузка клипа, подсветка позиции, угла атаки, глубины в crease, работы щитками и первого движения после броска.',
  },
  {
    title: 'Планы под стиль игры',
    text: 'AI собирает короткие блоки: реакция, перемещения, butterfly, recovery, контроль отскока и чтение передачи поперек зоны.',
  },
];

export const timeline = [
  'Добавить видео-сториборд с вратарскими эпизодами в ScrollStoryboardLayer.',
  'Привязать прогресс прокрутки к броску, сейву, восстановлению и повторному смещению.',
  'Заменить демо-экраны на реальные состояния goalie-приложения.',
];
