export default function decorate(block) {
  const rows = [...block.children];
  const config = {};

  rows.forEach((row) => {
    const key = row.children[0].textContent.trim().toLowerCase();
    const value = row.children[1];
    config[key] = value;
  });

  const text = config.text?.textContent || '';
  const link = config.link?.querySelector('a')?.href || '#';
  const type = config.type?.textContent.trim() || 'primary';
  const iconName = config.icon?.textContent.trim();

  const button = document.createElement('a');
  button.href = link;
  button.classList.add(`button ${type}`);

  button.textContent = text;

  if (iconName) {
    const iconSpan = document.createElement('span');
    iconSpan.classList.add(`icon icon-${iconName}`);
    button.append(iconSpan);
  }

  block.textContent = '';
  block.append(button);
}
