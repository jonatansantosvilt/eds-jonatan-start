function isAlreadyGrouped(wrapper) {
  return !!wrapper.closest('.button-link-group');
}

function isFirstInSequence(wrapper) {
  return !wrapper.previousElementSibling?.classList.contains(
    'button-link-wrapper',
  );
}

function shouldGroup(wrapper, sequence) {
  return sequence.length > 1 && isFirstInSequence(wrapper);
}

function getConsecutiveWrappers(startWrapper) {
  const result = [];
  let current = startWrapper;
  while (current?.classList.contains('button-link-wrapper')) {
    result.push(current);
    current = current.nextElementSibling;
  }
  return result;
}

function mountButtonGroup(sequence) {
  const group = document.createElement('div');
  group.classList.add('button-link-group');
  sequence[0].before(group);
  sequence.forEach((wrapperEl) => {
    const button = wrapperEl.querySelector('.button-link');
    if (button) group.appendChild(button);
    wrapperEl.remove();
  });
}

function onceStable(section, callback) {
  if (section.dataset.sectionStatus === 'loaded') {
    callback();
    return;
  }
  const observer = new MutationObserver(() => {
    if (section.dataset.sectionStatus === 'loaded') {
      observer.disconnect();
      callback();
    }
  });
  observer.observe(section, { attributes: true });
}

function scheduleGrouping(block) {
  const wrapper = block.closest('.button-link-wrapper');
  const section = wrapper?.closest('.section');
  if (!wrapper || !section) return;
  if (isAlreadyGrouped(wrapper)) return;

  onceStable(section, () => {
    const sequence = getConsecutiveWrappers(wrapper);
    if (shouldGroup(wrapper, sequence)) {
      mountButtonGroup(sequence);
    }
  });
}

function decorateAnchor(block) {
  const anchor = block.querySelector('a');
  if (!anchor) return;
  block.classList.forEach((cls) => {
    anchor.classList.add(cls);
  });
  block.replaceChildren(anchor);
}

export default function decorate(block) {
  decorateAnchor(block);
  scheduleGrouping(block);
}
