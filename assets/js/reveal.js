/* Gentle reveals; dynamic content can announce itself with hard:content. */
(() => {
  'use strict';
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || preference.matches) return;
  const seen = new WeakSet();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-pending');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  /* Only hide elements below the viewport, keeping initial content visible. */
  function observeContent() {
    if (preference.matches) return;
    document.querySelectorAll('.reveal').forEach(node => {
      if (seen.has(node)) return;
      seen.add(node);
      if (node.getBoundingClientRect().top > innerHeight) {
        node.classList.add('is-pending');
        observer.observe(node);
      }
    });
  }
  document.addEventListener('hard:content', observeContent);
  preference.addEventListener('change', () => {
    if (preference.matches) {
      observer.disconnect();
      document.querySelectorAll('.is-pending').forEach(node => node.classList.remove('is-pending'));
    }
  });
  observeContent();
})();
