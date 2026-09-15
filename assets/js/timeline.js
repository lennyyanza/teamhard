/* Render milestones in JSON order; dates are approximate within each season. */
(async () => {
  'use strict';
  const { readResource, element, markDraft, showError } = window.HARD;
  const container = document.querySelector('#timeline');
  const labels = { complete: 'Complete', 'in-progress': 'In progress', planned: 'Planned' };
  try {
    const milestones = await readResource('data/timeline.json', true);
    container.replaceChildren();
    milestones.forEach(item => {
      const row = element('li', 'milestone reveal');
      const meta = element('div');
      const time = element('time', 'eyebrow', item.period || item.date);
      time.dateTime = item.date;
      const status = Object.hasOwn(labels, item.status) ? item.status : 'planned';
      meta.append(time, element('br'), element('span', `status ${status}`, labels[status]));
      const content = element('div');
      content.append(element('h2', '', item.title), element('p', '', item.description));
      row.append(meta, content);
      markDraft(container, row, item.draft);
    });
    if (!milestones.length) container.append(element('li', 'muted', 'Milestones will be posted here.'));
    document.dispatchEvent(new Event('hard:content'));
  } catch (error) { showError(container, error); }
})();
