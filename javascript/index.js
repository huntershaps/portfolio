import './sendEmail.js';

const nav = document.querySelector('.system-nav');
const toggle = document.querySelector('.system-toggle');
const navLinks = [...document.querySelectorAll('.system-nav__link')];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function setNavigation(open) {
  nav.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.querySelector('.system-toggle__label').textContent = open ? 'Close' : 'Index';
}

toggle?.addEventListener('click', () => setNavigation(!nav.classList.contains('is-open')));
navLinks.forEach((link) => link.addEventListener('click', () => setNavigation(false)));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const current = navLinks.find((link) => link.getAttribute('href') === `#${entry.target.id}`);
    navLinks.forEach((link) => link.classList.toggle('is-current', link === current));
  });
}, { rootMargin: '-42% 0px -45% 0px', threshold: 0 });

sections.forEach((section) => sectionObserver.observe(section));

const openingThoughts = {
  people: 'Psychology gives me a way to notice the decisions, expectations, and mental models behind an interaction.',
  technology: 'Computer science gives me a way to turn an idea about people into an interface or system.'
};
const openingResponse = document.querySelector('.opening__response');
const openingPoles = [...document.querySelectorAll('[data-opening-thought]')];

openingPoles.forEach((pole) => {
  pole.addEventListener('click', () => {
    const thought = pole.dataset.openingThought;
    openingPoles.forEach((item) => {
      const selected = item === pole;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    openingResponse.textContent = openingThoughts[thought];
  });
});

const vennContent = {
  psychology: {
    title: 'Psychology',
    text: 'How people learn, make sense of choices, and form expectations around an experience.'
  },
  computing: {
    title: 'Computer science',
    text: 'The systems behind an experience - from structure to interaction - and the work of building them.'
  },
  interaction: {
    title: 'Human interaction',
    text: 'The point where technology has to feel clear, useful, and worth returning to.'
  }
};
const vennButtons = [...document.querySelectorAll('[data-venn]')];
const vennResponse = document.querySelector('.venn__response');

vennButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.venn;
    vennButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-selected', active);
      item.setAttribute('aria-pressed', String(active));
    });
    vennResponse.innerHTML = `<strong>${vennContent[selected].title}</strong><p>${vennContent[selected].text}</p>`;
  });
});

const questions = [...document.querySelectorAll('.question-list__item')];
questions.forEach((question) => {
  question.addEventListener('click', () => {
    const willOpen = !question.classList.contains('is-open');
    questions.forEach((item) => {
      item.classList.remove('is-open');
      item.setAttribute('aria-expanded', 'false');
    });
    if (willOpen) {
      question.classList.add('is-open');
      question.setAttribute('aria-expanded', 'true');
    }
  });
});
