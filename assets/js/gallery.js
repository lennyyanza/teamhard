/* Add gallery entries in data/gallery.json. Filters and lightbox share that data. */
(async () => {
  'use strict';
  const { readResource, element, showError, localImage } = window.HARD;
  const grid = document.querySelector('#gallery-grid');
  const count = document.querySelector('#gallery-count');
  const filters = [...document.querySelectorAll('.filter')];
  const dialog = document.querySelector('#lightbox');
  const media = dialog.querySelector('.lightbox-media');
  const caption = dialog.querySelector('figcaption');
  const closeButton = dialog.querySelector('[data-close]');
  const previous = dialog.querySelector('[data-previous]');
  const next = dialog.querySelector('[data-next]');
  const position = dialog.querySelector('[data-position]');
  let items = [];
  let filtered = [];
  let current = 0;
  let opener = null;

  /* A quiet placeholder replaces missing files without a broken-image icon. */
  function imageFrame(item) {
    const frame = element('div', 'blueprint');
    const fallback = element('span', '', 'No image yet');
    fallback.hidden = true;
    frame.append(localImage(item.src, item.alt, () => { fallback.hidden = false; }), fallback);
    return frame;
  }

  /* Change the enlarged item and announce its position to assistive technology. */
  function showItem(index) {
    current = (index + filtered.length) % filtered.length;
    const item = filtered[current];
    media.replaceChildren(imageFrame(item));
    caption.textContent = item.caption;
    position.textContent = `${current + 1} of ${filtered.length}`;
    previous.disabled = next.disabled = filtered.length < 2;
  }

  /* Native dialog makes the page inert; keep explicit focus return on close. */
  function openItem(index, button) {
    opener = button;
    showItem(index);
    dialog.showModal();
    document.body.classList.add('modal-open');
    closeButton.focus();
  }

  /* Replace only the gallery; pressed filter remains focused and announces count. */
  function render(category) {
    filtered = items.filter(item => category === 'all' || item.category === category);
    grid.replaceChildren();
    filtered.forEach((item, index) => {
      const figure = element('figure');
      const button = element('button', 'gallery-open');
      button.type = 'button';
      button.setAttribute('aria-label', `Enlarge: ${item.caption}`);
      button.append(imageFrame(item));
      button.addEventListener('click', () => openItem(index, button));
      figure.append(button, element('figcaption', '', item.caption));
      grid.append(figure);
    });
    count.textContent = `${filtered.length} ${filtered.length === 1 ? 'entry' : 'entries'} · ${category === 'all' ? 'All categories' : category.toUpperCase()}`;
    if (!filtered.length) grid.append(element('p', 'muted', 'No images in this category yet. Check back as the project develops.'));
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
  }

  filters.forEach(button => button.addEventListener('click', () => render(button.dataset.category)));
  closeButton.addEventListener('click', () => dialog.close());
  previous.addEventListener('click', () => showItem(current - 1));
  next.addEventListener('click', () => showItem(current + 1));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    opener?.focus();
  });
  /* Arrow navigation, Escape, and Tab cycling make every lightbox action keyboardable. */
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); dialog.close(); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); showItem(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showItem(current + 1); }
    if (event.key === 'Tab') {
      const buttons = [...dialog.querySelectorAll('button:not(:disabled)')];
      const first = buttons[0];
      const last = buttons.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  try {
    items = await readResource('data/gallery.json', true);
    render('all');
  } catch (error) {
    showError(grid, error);
    count.textContent = 'Gallery unavailable';
    filters.forEach(button => { button.disabled = true; });
  }
})();
