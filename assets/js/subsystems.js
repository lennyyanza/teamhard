/* Render the subsystem index and full engineering copy from one JSON source. */
(async () => {
  'use strict';
  const { readResource, element, showError } = window.HARD;
  const container = document.querySelector('#subsystems');
  const navigation = document.querySelector('#subsystem-nav');
  try {
    const items = await readResource('data/subsystems.json', true);
    container.replaceChildren();
    items.forEach((item, index) => {
      const section = element('section', 'subsystem reveal');
      section.id = item.id;
      const heading = element('div');
      heading.append(element('span', 'number', String(index + 1).padStart(2, '0')), element('h2', '', item.title));
      const body = element('div');
      body.append(element('p', 'summary', item.summary));
      item.details.forEach(detail => body.append(element('p', '', detail)));
      section.append(heading, body);
      container.append(section);
      const link = element('a', '', item.title);
      link.href = `#${item.id}`;
      navigation.append(link);
    });
    if (!items.length) container.append(element('p', 'muted', 'Subsystem details are coming soon.'));
    document.dispatchEvent(new Event('hard:content'));
  } catch (error) { showError(container, error); }
})();
