import decorateCard from '../card/card.js';

const AUTO_THEMES = ['teal', 'purple'];

function supportsIntersectionObserver() {
  return 'IntersectionObserver' in window;
}

function createVisibilityObserver(onVisible) {
  return new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onVisible(entry);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
  );
}

function revealOnView(el) {
  if (!supportsIntersectionObserver()) {
    el.classList.add('is-visible');
    return;
  }
  const observer = createVisibilityObserver((entry) => {
    entry.target.classList.add('is-visible');
  });
  observer.observe(el);
}

function pickAutoTheme(index) {
  return AUTO_THEMES[index % AUTO_THEMES.length];
}

function hasExplicitTheme(card) {
  return Array.from(card.classList).some((c) => c.startsWith('card-theme-'));
}

function applyAutoThemeIfMissing(card, index) {
  if (hasExplicitTheme(card)) return;
  card.classList.add(`card-theme-${pickAutoTheme(index)}`);
}

/**
 * @param {Element} block
 */
export default function decorate(block) {
  Array.from(block.children).forEach((card, index) => {
    card.classList.add('card');
    decorateCard(card);
    applyAutoThemeIfMissing(card, index);
  });

  revealOnView(block);
}
