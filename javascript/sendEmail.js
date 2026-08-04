const sendBtn = document.getElementById('sendButton');
const form = document.getElementById('sendForm');
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const messageField = document.getElementById('message');
const formInfo = document.getElementById('form__info');
const formPopupTxt = document.getElementById('form__popup-txt');

form.addEventListener('submit', sendEmail);

async function sendEmail(e) {
  e.preventDefault();
  formInfo.classList.add('hide');
  sendBtn.value = 'Sending...';

  try {
    const payload = {
      name: nameField.value,
      email: emailField.value,
      message: messageField.value
    };

    const resp = await fetch('/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await resp.json();
    sendBtn.value = 'Send';

    if (resp.ok && result.success) {
      nameField.value = '';
      emailField.value = '';
      messageField.value = '';
      formInfo.style.backgroundColor = 'rgb(0 113 12)';
      if (result.previewUrl) {
        formPopupTxt.innerHTML = `Email sent (test mode). <a href="${result.previewUrl}" target="_blank" rel="noopener">Open preview</a>`;
      } else {
        formPopupTxt.textContent = 'Email was successfully sent!';
      }
      formInfo.classList.remove('hide');
    } else {
      formInfo.style.backgroundColor = '#8b1a09';
      formPopupTxt.textContent = (result && result.error) ? `Error: ${result.error}` : 'Error sending email! Try again!';
      formInfo.classList.remove('hide');
    }
  } catch (err) {
    sendBtn.value = 'Send';
    formInfo.style.backgroundColor = '#8b1a09';
    formPopupTxt.textContent = 'Network error sending email!';
    formInfo.classList.remove('hide');
  }
}

export { sendEmail };
