export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row, index) => {
    const heading = row.querySelector('h1, h2, h3');
    if (!heading) return;

    if (index === 0) {
      row.classList.add('banner-headline');
      heading.classList.add('banner-headline__text');
    } else {
      row.classList.add('banner-subheadline');
      heading.classList.add(
        'banner-subheadline__text',
        'banner-subheadline__text--gradient',
      );
    }
  });
}
