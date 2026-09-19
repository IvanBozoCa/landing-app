import { contact, profiles, steps, type Profile } from './content';

function required<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing landing element: ${selector}`);
  return element;
}

const menu = required<HTMLElement>('#menu-principal');
const menuToggle = required<HTMLButtonElement>('.menu-toggle');
const mobile = window.matchMedia('(max-width: 720px)');

function closeMenu(returnFocus = false) {
  menuToggle.setAttribute('aria-expanded', 'false');
  menu.classList.remove('is-open');
  if (returnFocus) menuToggle.focus();
}

menuToggle.hidden = false;
document.documentElement.classList.add('menu-enhanced');
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
});
menu.addEventListener('click', (event) => {
  const target = event.target;
  if (target instanceof HTMLAnchorElement) {
    closeMenu();
    const section = document.querySelector<HTMLElement>(target.hash);
    if (section) {
      section.tabIndex = -1;
      section.focus({ preventScroll: true });
    }
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', (event) => {
  if (event.target instanceof Node && !menu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});
menu.addEventListener('focusout', () => {
  requestAnimationFrame(() => {
    if (!menu.contains(document.activeElement) && document.activeElement !== menuToggle) closeMenu();
  });
});
mobile.addEventListener('change', () => closeMenu());

const selector = required<HTMLSelectElement>('#perfil');
const previous = required<HTMLButtonElement>('#previous-step');
const next = required<HTMLButtonElement>('#next-step');
let profile: Profile = 'transportista';
let stepIndex = 0;

function renderStep() {
  const step = steps[stepIndex];
  required('#step-number').textContent = String(stepIndex + 1).padStart(2, '0');
  required('#step-label').textContent = `PASO ${stepIndex + 1} DE ${steps.length}`;
  required('#step-title').textContent = step.title;
  required('#step-description').textContent = step.description;
  required('#step-benefit').textContent = step.benefits[profile];
  previous.disabled = stepIndex === 0;
  next.disabled = stepIndex === steps.length - 1;
  required('#profile-description').textContent = profiles[profile].description;
}

function updateContact() {
  document.querySelectorAll<HTMLAnchorElement>('[data-whatsapp]').forEach((link) => {
    link.href = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(profiles[profile].message)}`;
  });
  required('#contact-profile').textContent = `Tu mensaje comenzará con «Soy ${profile}». Puedes editarlo en WhatsApp antes de enviarlo.`;
}

selector.addEventListener('change', () => {
  if (selector.value !== 'transportista' && selector.value !== 'conductor' && selector.value !== 'apoderado') return;
  profile = selector.value;
  renderStep();
  updateContact();
});
previous.addEventListener('click', () => { stepIndex = Math.max(0, stepIndex - 1); renderStep(); });
next.addEventListener('click', () => { stepIndex = Math.min(steps.length - 1, stepIndex + 1); renderStep(); });
required('#restart-example').addEventListener('click', () => { stepIndex = 0; renderStep(); });

// Enhance only after the complete example is initialized; keep a readable fallback.
renderStep();
required('.profile-picker').hidden = false;
required('.guided-example').hidden = false;
required('.example-steps').hidden = true;
required('#contact-profile').hidden = false;

const copyButton = required<HTMLButtonElement>('#copy-email');
copyButton.hidden = false;
copyButton.addEventListener('click', async () => {
  const feedback = required('#copy-status');
  try {
    await navigator.clipboard.writeText(contact.email);
    feedback.textContent = 'Correo copiado. Puedes pegarlo en tu aplicación de correo.';
  } catch {
    feedback.textContent = `No se pudo copiar. Selecciona el correo visible para copiarlo: ${contact.email}`;
  }
});
