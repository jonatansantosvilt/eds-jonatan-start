function createGradientSpan(text) {
  const span = document.createElement('span');
  span.className = 'title-gradient';
  span.textContent = text;
  return span;
}

function splitAtFirstComma(text) {
  const idx = text.indexOf(',');
  if (idx === -1 || idx >= text.length - 1) return null;

  return {
    before: text.slice(0, idx + 1),
    after: text.slice(idx + 1).trimStart(),
  };
}

function buildHeadingWithGradient(text) {
  const heading = document.createElement('h1');
  const parts = splitAtFirstComma(text);

  if (!parts) {
    heading.textContent = text;
    return heading;
  }

  const { before, after } = parts;
  heading.append(`${before} `, createGradientSpan(after));
  return heading;
}

function decorateTitle(row) {
  if (!row) return null;

  row.classList.add('title-heading');

  const paragraph = row.querySelector('p');
  if (paragraph) {
    const heading = buildHeadingWithGradient(paragraph.textContent.trim());
    paragraph.replaceWith(heading);
  }

  return row;
}

function decorateDescription(row) {
  if (!row) return null;
  row.classList.add('title-description');
  return row;
}

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

function hasTextContent(el) {
  return el.textContent.trim().length > 0;
}

function appendIfDecorated(parent, node) {
  if (node) parent.append(node);
}

function decorateEyebrow(row) {
  if (!row) return null;
  if (!hasTextContent(row)) {
    row.remove();
    return null;
  }
  row.classList.add('title-eyebrow');
  return row;
}

/**
 * @param {Element} block
 */
export default function decorate(block) {
  const [eyebrowRow, titleRow, descriptionRow] = block.children;

  const frag = document.createDocumentFragment();

  appendIfDecorated(frag, decorateEyebrow(eyebrowRow));
  appendIfDecorated(frag, decorateTitle(titleRow));
  appendIfDecorated(frag, decorateDescription(descriptionRow));

  block.replaceChildren(frag);

  revealOnView(block);
}
