const createElement = (tag, className) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
};

function parseCardItems(rawHtml) {
  return rawHtml
    .split(/<br\s*\/?>\s*<br\s*\/?>/)
    .filter((item) => item.trim() !== '')
    .map((item) => item.replace(/<strong>/g, '<strong class="card-item-title">'));
}

function createItemsList(items) {
  const fragment = document.createDocumentFragment();
  const ul = createElement('ul');

  items.forEach((itemContent) => {
    const li = createElement('li');
    li.innerHTML = itemContent.replace(/<br\s*\/?>/gi, '');
    ul.appendChild(li);
  });

  fragment.appendChild(ul);
  return fragment;
}

function decorateCardItems(cardItems) {
  const pContent = cardItems.querySelector('p');
  if (!pContent) return;

  const items = parseCardItems(pContent.innerHTML);
  const listFragment = createItemsList(items);

  cardItems.replaceChildren(listFragment);
}

function decorateAppsCard(card) {
  const [label, title, theme, itemsContainer] = card.children;
  const themeName = theme?.textContent?.trim() || 'default';

  card.classList.add('card', themeName);
  label.classList.add('card-label');
  title.classList.add('card-title');
  itemsContainer.classList.add('card-items');

  const header = createElement('div', 'card-header');
  header.append(label, title);

  card.prepend(header);
  theme?.remove();

  decorateCardItems(itemsContainer);
}

const MODULE_THEME_BY_LABEL = {
  backend: 'teal',
  frontend: 'purple',
};

function buildTags(rawHtml) {
  const wrapper = createElement('div', 'card-tags');
  const text = rawHtml.replace(/<[^>]+>/g, ' ');
  const tags = text.match(/#[\w-]+/g) || [];

  tags.forEach((tag) => {
    const span = createElement('span', 'card-tag');
    span.textContent = tag;
    wrapper.appendChild(span);
  });

  return wrapper;
}

function decorateModuleCard(card) {
  const [labelEl, titleEl, descriptionEl, tagsEl] = card.children;

  const labelText = labelEl?.textContent?.trim().toLowerCase() || '';

  if (!labelText) {
    card.style.display = 'none';
    return;
  }

  const theme = MODULE_THEME_BY_LABEL[labelText] || 'default';
  card.classList.add('card', theme);

  const label = createElement('span', 'card-label');
  label.textContent = labelText;

  const header = createElement('div', 'card-header');
  header.appendChild(label);

  titleEl.className = 'card-title';
  descriptionEl.className = 'card-description';

  const tagsWrapper = buildTags(tagsEl?.innerHTML || '');

  const footer = createElement('div', 'card-footer');
  footer.appendChild(tagsWrapper);

  card.replaceChildren(header, titleEl, descriptionEl, footer);
}

export default function decorate(block) {
  const isModuleSection = !!block.closest('.module-section');
  const decorator = isModuleSection ? decorateModuleCard : decorateAppsCard;

  [...block.children].forEach(decorator);
}
