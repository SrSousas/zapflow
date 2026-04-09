const faqButtons = document.querySelectorAll('.faq-question');

if (faqButtons.length > 0) {
  const firstItem = faqButtons[0].closest('.faq-item');
  faqButtons[0].setAttribute('aria-expanded', 'true');
  firstItem.classList.add('active');
}

faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const isActive = item.classList.contains('active');

    faqButtons.forEach((otherButton) => {
      otherButton.setAttribute('aria-expanded', 'false');
      otherButton.closest('.faq-item').classList.remove('active');
    });

    if (!isActive) {
      button.setAttribute('aria-expanded', 'true');
      item.classList.add('active');
    }
  });
});

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}
