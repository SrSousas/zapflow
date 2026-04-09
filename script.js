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

const billingButtons = document.querySelectorAll('.billing-btn');
const activeLabel = document.getElementById('billing-active-label');

const planPricing = {
  mensal: {
    basic: { price: 'R$ 39,90', meta: '/mês' },
    pro: { price: 'R$ 69,90', meta: '/mês' },
    premium: { price: 'R$ 99,90', meta: '/mês' },
    label: 'Mensal'
  },
  trimestral: {
    basic: { price: 'R$ 34,90', meta: '3x de' },
    pro: { price: 'R$ 59,90', meta: '3x de' },
    premium: { price: 'R$ 89,90', meta: '3x de' },
    label: 'Trimestral'
  },
  anual: {
    basic: { price: 'R$ 29,90', meta: '12x de' },
    pro: { price: 'R$ 49,90', meta: '12x de' },
    premium: { price: 'R$ 79,90', meta: '12x de' },
    label: 'Anual'
  }
};

const planElements = {
  basicPrice: document.querySelector('[data-plan=\"basic-price\"]'),
  basicMeta: document.querySelector('[data-plan=\"basic-meta\"]'),
  proPrice: document.querySelector('[data-plan=\"pro-price\"]'),
  proMeta: document.querySelector('[data-plan=\"pro-meta\"]'),
  premiumPrice: document.querySelector('[data-plan=\"premium-price\"]'),
  premiumMeta: document.querySelector('[data-plan=\"premium-meta\"]')
};

function applyPriceAnimation(...elements) {
  elements.forEach((element) => {
    if (!element) return;
    element.classList.remove('price-fade');
    void element.offsetWidth;
    element.classList.add('price-fade');
  });
}

function updatePlanPricing(period) {
  const data = planPricing[period];
  if (!data) return;

  planElements.basicPrice.textContent = data.basic.price;
  planElements.basicMeta.textContent = data.basic.meta;
  planElements.proPrice.textContent = data.pro.price;
  planElements.proMeta.textContent = data.pro.meta;
  planElements.premiumPrice.textContent = data.premium.price;
  planElements.premiumMeta.textContent = data.premium.meta;

  if (activeLabel) {
    activeLabel.textContent = data.label;
  }

  applyPriceAnimation(
    planElements.basicPrice,
    planElements.basicMeta,
    planElements.proPrice,
    planElements.proMeta,
    planElements.premiumPrice,
    planElements.premiumMeta
  );
}

billingButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const period = button.dataset.period;
    billingButtons.forEach((item) => {
      item.classList.remove('is-active');
      item.setAttribute('aria-selected', 'false');
    });
    button.classList.add('is-active');
    button.setAttribute('aria-selected', 'true');
    updatePlanPricing(period);
  });
});
