function extractText(row) {
  return row ? row.textContent.trim() : '';
}

function findPicture(row) {
  return row ? row.querySelector('picture, img') : null;
}

function isSubItemRow(row) {
  return row.children.length > 1;
}

function splitCardChildren(block) {
  const fieldRows = [];
  const subItemRows = [];

  Array.from(block.children).forEach((row) => {
    if (isSubItemRow(row)) {
      subItemRows.push(row);
    } else {
      fieldRows.push(row);
    }
  });

  return { fieldRows, subItemRows };
}

function applyThemeFromRow(block, themeRow) {
  const theme = extractText(themeRow);
  if (theme) block.classList.add(`card-theme-${theme}`);
}

function buildCardIcon(picture) {
  const icon = document.createElement('div');
  icon.className = 'card-icon';
  icon.append(picture);
  return icon;
}

function buildLabel(text) {
  const el = document.createElement('p');
  el.className = 'card-label';
  el.textContent = text;
  return el;
}

function buildTitle(text) {
  const el = document.createElement('h3');
  el.className = 'card-title';
  el.textContent = text;
  return el;
}

function buildCardHeading(labelRow, titleRow) {
  const label = extractText(labelRow);
  const title = extractText(titleRow);
  if (!label && !title) return null;

  const wrapper = document.createElement('div');
  wrapper.className = 'card-heading';

  if (label) wrapper.append(buildLabel(label));
  if (title) wrapper.append(buildTitle(title));

  return wrapper;
}

function buildCardHeader(iconRow, labelRow, titleRow) {
  const header = document.createElement('header');
  header.className = 'card-header';

  const picture = findPicture(iconRow);
  if (picture) header.append(buildCardIcon(picture));

  const heading = buildCardHeading(labelRow, titleRow);
  if (heading) header.append(heading);

  return header;
}

function buildListItemTitle(text) {
  const el = document.createElement('strong');
  el.className = 'card-list-item-title';
  el.textContent = text;
  return el;
}

function buildListItemDesc(text) {
  const el = document.createElement('span');
  el.className = 'card-list-item-desc';
  el.textContent = text;
  return el;
}

function buildListItem(subItem) {
  const [titleRow, descRow] = subItem.children;
  const title = extractText(titleRow);
  const description = extractText(descRow);
  if (!title && !description) return null;

  const li = document.createElement('li');
  li.className = 'card-list-item';

  if (title) li.append(buildListItemTitle(title));
  if (description) li.append(buildListItemDesc(description));

  return li;
}

function buildCardList(subItemRows) {
  const ul = document.createElement('ul');
  ul.className = 'card-list';

  subItemRows.forEach((subItem) => {
    const li = buildListItem(subItem);
    if (li) ul.append(li);
  });

  return ul;
}

/**
 * @param {Element} block
 */
export default function decorate(block) {
  const { fieldRows, subItemRows } = splitCardChildren(block);
  const [iconRow, labelRow, titleRow, themeRow] = fieldRows;

  applyThemeFromRow(block, themeRow);

  const fragment = document.createDocumentFragment();
  fragment.append(buildCardHeader(iconRow, labelRow, titleRow));

  if (subItemRows.length > 0) {
    fragment.append(buildCardList(subItemRows));
  }

  block.replaceChildren(fragment);
}
