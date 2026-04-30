export default function decorate(block) {
  const [linkRow, , , , iconRow, positionRow] = block.children;

  const link = linkRow?.querySelector('a');
  const icon = iconRow?.querySelector('img, svg');
  const position = positionRow?.textContent?.trim() || 'left';

  if (link && icon) {
    icon.classList.add('button-icon__icon', `button-icon__icon--${position}`);

    if (position === 'left') {
      link.prepend(icon);
    } else {
      link.append(icon);
    }
  }
}
