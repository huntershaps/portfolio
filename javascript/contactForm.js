import { qs } from './lib/dom.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Progressive-enhancement contact form.
 *
 * Validation runs client-side for immediate feedback and again on the server,
 * which is the one that counts. Errors are announced, tied to their field with
 * aria-describedby, and focus moves to the first thing that needs fixing.
 */
export function initContactForm() {
  const form = qs('#sendForm');
  if (!form) return;

  const submit = qs('#sendButton', form);
  const submitLabel = qs('.contact__submit-label', form);
  const status = qs('#form__info');
  const statusText = qs('#form__popup-txt');

  const fields = {
    name: qs('#name', form),
    email: qs('#email', form),
    message: qs('#message', form)
  };

  const rules = {
    email: (value) => (EMAIL_PATTERN.test(value) ? '' : 'Enter a valid email address.'),
    message: (value) => (value.trim() ? '' : 'Let me know what you are thinking about.')
  };

  function setFieldError(name, message) {
    const field = fields[name];
    const errorNode = qs(`#${name}-error`, form);
    if (!field || !errorNode) return;
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    errorNode.textContent = message;
  }

  Object.keys(rules).forEach((name) => {
    fields[name]?.addEventListener('blur', () => setFieldError(name, rules[name](fields[name].value)));
    fields[name]?.addEventListener('input', () => {
      if (fields[name].getAttribute('aria-invalid') === 'true') setFieldError(name, '');
    });
  });

  function announce(message, tone) {
    status.dataset.tone = tone;
    status.classList.remove('hide');
    if (typeof message === 'string') statusText.textContent = message;
    else statusText.replaceChildren(...message);
  }

  function setBusy(busy) {
    submit.disabled = busy;
    submitLabel.textContent = busy ? 'Sending' : 'Transmit message';
    form.classList.toggle('is-busy', busy);
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.classList.add('hide');

    const errors = Object.entries(rules)
      .map(([name, rule]) => [name, rule(fields[name].value)])
      .filter(([, message]) => message);

    errors.forEach(([name, message]) => setFieldError(name, message));
    if (errors.length) {
      fields[errors[0][0]].focus();
      return;
    }

    setBusy(true);

    try {
      const response = await fetch('/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.name.value,
          email: fields.email.value,
          message: fields.message.value,
          company: qs('#company', form)?.value || ''
        })
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        form.reset();
        Object.keys(rules).forEach((name) => setFieldError(name, ''));

        if (result.previewUrl) {
          const link = document.createElement('a');
          link.href = result.previewUrl;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = 'Open the preview';
          announce(
            [document.createTextNode('Sent in test mode. No SMTP is configured. '), link],
            'ok'
          );
        } else {
          announce('Thank you. Your message is on its way. I will reply from hunter@sflinsider.com.', 'ok');
        }
      } else {
        announce(result.error || 'Something went wrong. Please email me directly at hunter@sflinsider.com.', 'error');
      }
    } catch {
      announce('No connection to the server. Please email me directly at hunter@sflinsider.com.', 'error');
    } finally {
      setBusy(false);
    }
  });
}
