/* Shared navigation and small data helpers. Edit navigation in partials/header.html. */
(() => {
  'use strict';

  /* Fetch a local resource with an actionable error when preview setup is missing. */
  async function readResource(path, json = false) {
    if (location.protocol === 'file:') {
      throw new Error('HARD local preview requires HTTP: run python3 -m http.server 8000 in the repository, then open http://localhost:8000. fetch() cannot load partials or JSON on file://.');
    }
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Could not load ${path} (${response.status}).`);
    return json ? response.json() : response.text();
  }

  /* Construct text-only elements so JSON content never becomes executable HTML. */
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  /* Keep draft annotations immediately before the affected rendered content. */
  function markDraft(parent, node, draft) {
    if (draft) parent.append(document.createComment(' DRAFT: team to review '));
    parent.append(node);
  }

  /* Display a readable failure instead of leaving an empty content region. */
  function showError(container, error) {
    console.error(error.message);
    container.replaceChildren(element('p', 'load-error', 'This content could not load. Please reload the page. For local preview, run python3 -m http.server 8000 and open http://localhost:8000.'));
  }

  /* Limit image paths to repository assets and gracefully hide failed images. */
  function localImage(src, alt, onError) {
    const img = element('img');
    img.alt = alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', () => {
      img.hidden = true;
      onError?.();
    }, { once: true });
    if (typeof src === 'string' && src.startsWith('assets/img/') && !src.includes('..')) img.src = src;
    else { img.hidden = true; onError?.(); }
    return img;
  }

  /* Accept HTTPS profile links; reject executable or unexpected URL schemes. */
  function safeLink(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' ? url.href : null;
    } catch { return null; }
  }

  window.HARD = { readResource, element, markDraft, showError, localImage, safeLink };

  /* Set active link, accessible mobile menu behavior, and the scroll treatment. */
  function setupNavigation(header) {
    const toggle = header.querySelector('.menu-toggle');
    const links = header.querySelector('.nav-links');
    const current = location.pathname.split('/').pop() || 'index.html';
    links.querySelectorAll('a').forEach(link => {
      if (link.getAttribute('href') === current) link.setAttribute('aria-current', 'page');
    });
    const desktop = matchMedia('(min-width: 768px)');

    /* Keep visual menu state, focus, and aria-expanded synchronized. */
    function setOpen(open, restoreFocus = false) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      links.classList.toggle('is-open', open);
      header.classList.toggle('menu-open', open);
      if (restoreFocus) toggle.focus();
    }
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true);
    });
    document.addEventListener('click', event => {
      if (!header.contains(event.target)) setOpen(false);
    });
    header.addEventListener('focusout', event => {
      if (event.relatedTarget && !header.contains(event.relatedTarget)) setOpen(false);
    });
    links.addEventListener('click', event => {
      if (event.target.closest('a')) setOpen(false);
    });
    desktop.addEventListener('change', () => setOpen(false));

    /* On home, gain blur after crossing the hero; other pages are always solid. */
    function updateScroll() {
      const hero = document.querySelector('.hero');
      header.classList.toggle('is-scrolled', !hero || hero.getBoundingClientRect().bottom <= header.offsetHeight);
    }
    addEventListener('scroll', updateScroll, { passive: true });
    addEventListener('resize', updateScroll);
    updateScroll();
  }

  /* Load each partial independently so one missing file does not hide the other. */
  async function includePartial(target, path) {
    const container = document.querySelector(target);
    try {
      container.innerHTML = await readResource(path);
      if (target === '#site-header') setupNavigation(container);
    } catch (error) { showError(container, error); }
  }
  /* Offer a pause control for the decorative hero; reduced motion stays static. */
  function setupHeroMotion() {
    const hero = document.querySelector('.hero');
    const button = hero?.querySelector('.motion-toggle');
    if (!button) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let paused = false;

    /* Synchronize the control with both the visitor choice and OS preference. */
    function updateMotion() {
      button.hidden = preference.matches;
      hero.classList.toggle('motion-ready', !preference.matches);
      hero.classList.toggle('motion-paused', paused);
      button.textContent = paused ? 'Resume motion' : 'Pause motion';
      button.setAttribute('aria-label', paused ? 'Resume background animation' : 'Pause background animation');
    }
    button.addEventListener('click', () => { paused = !paused; updateMotion(); });
    preference.addEventListener('change', updateMotion);
    updateMotion();
  }
  setupHeroMotion();
  includePartial('#site-header', 'partials/header.html');
  includePartial('#site-footer', 'partials/footer.html');
})();
