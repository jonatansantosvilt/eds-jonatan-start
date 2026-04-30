export default function decorate(block) {
  const [linkRow, , , typeRow, iconLeftRow, iconRightRow] = block.children;

  const link = linkRow?.querySelector('a');
  const type = typeRow?.textContent?.trim().toLowerCase();

  const iconLeft = iconLeftRow?.querySelector('img, svg');
  const iconRight = iconRightRow?.querySelector('img, svg');

  if (link) {
    link.classList.add('button-icon');
    if (type) {
      link.classList.add(type);
    }

    if (iconLeft) {
      iconLeft.classList.add('button-icon-icon', 'button-icon-icon--left');
      link.prepend(iconLeft);
    }

    if (iconRight) {
      iconRight.classList.add('button-icon-icon', 'button-icon-icon--right');
      link.append(iconRight);
    }
  }
}
