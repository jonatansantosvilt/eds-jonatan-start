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

export function decorateCardItems(cardItems) {
  const pContent = cardItems.querySelector('p');
  if (!pContent) return;

  const items = parseCardItems(pContent.innerHTML);
  const listFragment = createItemsList(items);

  cardItems.replaceChildren(listFragment);
}

function decorateCard(card) {
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

export default function decorate(block) {
  const cards = [...block.children];
  cards.forEach(decorateCard);
}
