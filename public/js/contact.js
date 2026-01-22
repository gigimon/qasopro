(() => {
  const form = document.querySelector('[data-emailjs-form]');
  if (!form || typeof emailjs === 'undefined') {
    return;
  }

  const submitButton = form.querySelector('[data-form-submit]');
  const statusEl = form.querySelector('[data-form-status]');
  const serviceId = form.getAttribute('data-service-id');
  const templateId = form.getAttribute('data-template-id');
  const publicKey = form.getAttribute('data-public-key');

  const setStatus = (text, type) => {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.classList.remove('success', 'error');
    if (type) {
      statusEl.classList.add(type);
    }
  };

  const setLoading = (isLoading) => {
    if (!submitButton) return;
    if (!submitButton.dataset.originalText) {
      submitButton.dataset.originalText = submitButton.textContent;
    }
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading
      ? (form.dataset.loadingText || 'Sending...')
      : submitButton.dataset.originalText;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!serviceId || !templateId || !publicKey) {
      setStatus('Missing EmailJS configuration.', 'error');
      return;
    }

    setStatus('', '');
    setLoading(true);

    try {
      await emailjs.sendForm(serviceId, templateId, form, {
        publicKey,
      });
      form.reset();
      setStatus(form.dataset.successText || 'Message sent successfully.', 'success');
    } catch (error) {
      setStatus(form.dataset.errorText || 'Failed to send message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  });
})();
