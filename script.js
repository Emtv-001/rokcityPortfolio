const viewer = document.querySelector('#viewer');
const preview = viewer?.querySelector('img');
viewer?.addEventListener('close', () => preview.removeAttribute('src'));

for (const gallery of document.querySelectorAll('[data-directory]')) {
  const { directory, count, label, extension = 'jpg' } = gallery.dataset;
  const slots = [];
  for (let index = 1; index <= Number(count); index++) {
    const description = count === '1' ? label : label + ' ' + index;
    const placeholder = document.createElement('span');
    placeholder.textContent = count === '1' ? label : 'Artwork slot ' + index;
    slots.push(placeholder);

    // Add a JPEG at this path to fill the slot automatically.
    const image = new Image();
    image.alt = description;
    image.addEventListener('load', () => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', 'Enlarge ' + description);
      if (gallery.closest('.project')) {
        button.style.setProperty('--artwork-ratio', image.naturalWidth / image.naturalHeight);
      }
      button.append(image);
      button.addEventListener('click', () => {
        preview.src = image.src;
        preview.alt = image.alt;
        viewer.showModal();
      });
      placeholder.replaceWith(button);
    }, { once: true });
    image.src = 'images/' + directory + '-' + index + '.' + extension;
  }
  gallery.replaceChildren(...slots);
}

const themeSwitch = document.querySelector('.theme-switch');

if (themeSwitch) {
  const root = document.documentElement;

  function updateThemeSwitch() {
    themeSwitch.setAttribute('aria-checked', String(root.dataset.theme === 'light'));
  }

  updateThemeSwitch();
  themeSwitch.hidden = false;
  themeSwitch.addEventListener('click', () => {
    const theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.classList.add('animate-theme');
    root.dataset.theme = theme;
    updateThemeSwitch();
    try {
      localStorage.setItem('rokcity-theme', theme);
    } catch {
      // The switch still works for the current page.
    }
  });
}

const jumpMenu = document.querySelector('#jump-menu');
const jumpButton = document.querySelector('.jump-button');
jumpMenu?.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link) return;

  jumpMenu.hidePopover();
  const section = document.querySelector(link.hash);
  section.setAttribute('tabindex', '-1');
  section.focus({ preventScroll: true });
});

if (jumpButton && typeof jumpMenu?.showPopover === 'function') {
  jumpButton.hidden = false;
}
