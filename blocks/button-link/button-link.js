/**
 * @param {Element} block
 */
export default function decorate(block) {
  const [element] = block.getElementsByTagName('a');
  element.classList.add('button');
  block.replaceChildren(element);
}
