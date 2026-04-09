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
    basic: { price: 'R$ 49,90', meta: '/mês', cash: 'ou R$ 49,90 à vista' },
    pro: { price: 'R$ 79,90', meta: '/mês', cash: 'ou R$ 79,90 à vista' },
    premium: { price: 'R$ 119,90', meta: '/mês', cash: 'ou R$ 119,90 à vista' },
    label: 'Mensal'
  },
  trimestral: {
    basic: { price: 'R$ 44,90', meta: '3x de', cash: 'ou R$ 134,70 à vista' },
    pro: { price: 'R$ 69,90', meta: '3x de', cash: 'ou R$ 209,70 à vista' },
    premium: { price: 'R$ 104,90', meta: '3x de', cash: 'ou R$ 314,70 à vista' },
    label: 'Trimestral'
  },
  anual: {
    basic: { price: 'R$ 39,90', meta: '12x de', cash: 'ou R$ 478,80 à vista' },
    pro: { price: 'R$ 59,90', meta: '12x de', cash: 'ou R$ 718,80 à vista' },
    premium: { price: 'R$ 89,90', meta: '12x de', cash: 'ou R$ 1.078,80 à vista' },
    label: 'Anual'
  }
};

const planElements = {
  basicPrice: document.querySelector('[data-plan=\"basic-price\"]'),
  basicMeta: document.querySelector('[data-plan=\"basic-meta\"]'),
  basicCash: document.querySelector('[data-plan=\"basic-cash\"]'),
  proPrice: document.querySelector('[data-plan=\"pro-price\"]'),
  proMeta: document.querySelector('[data-plan=\"pro-meta\"]'),
  proCash: document.querySelector('[data-plan=\"pro-cash\"]'),
  premiumPrice: document.querySelector('[data-plan=\"premium-price\"]'),
  premiumMeta: document.querySelector('[data-plan=\"premium-meta\"]'),
  premiumCash: document.querySelector('[data-plan=\"premium-cash\"]')
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
  planElements.basicCash.textContent = data.basic.cash;
  planElements.proPrice.textContent = data.pro.price;
  planElements.proMeta.textContent = data.pro.meta;
  planElements.proCash.textContent = data.pro.cash;
  planElements.premiumPrice.textContent = data.premium.price;
  planElements.premiumMeta.textContent = data.premium.meta;
  planElements.premiumCash.textContent = data.premium.cash;

  if (activeLabel) {
    activeLabel.textContent = data.label;
  }

  applyPriceAnimation(
    planElements.basicPrice,
    planElements.basicMeta,
    planElements.basicCash,
    planElements.proPrice,
    planElements.proMeta,
    planElements.proCash,
    planElements.premiumPrice,
    planElements.premiumMeta,
    planElements.premiumCash
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

const chatFlowContainer = document.getElementById('chat-flow');
const typingIndicator = document.getElementById('typing-indicator');
const chatTimeElement = document.getElementById('chat-time');

const conversationSteps = [
  { type: 'client', text: 'Oi, queria saber mais', waitAfter: 1000 },
  {
    type: 'system',
    text: `Olá, seja bem-vindo. Como posso te ajudar hoje?
      <ul>
        <li>1. Ver preços</li>
        <li>2. Agendar atendimento</li>
        <li>3. Falar com especialista</li>
      </ul>`,
    waitAfter: 1500,
    typingBefore: 900
  },
  { type: 'client', text: '3', waitAfter: 1000 },
  {
    type: 'system',
    text: 'Perfeito. Vou te conectar com um especialista agora 👋',
    waitAfter: 1400,
    typingBefore: 900
  }
];

const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

function updateChatTime() {
  if (!chatTimeElement) return;
  const now = new Date();
  chatTimeElement.textContent = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function createMessage(type, content) {
  const message = document.createElement('div');
  message.className = `msg ${type === 'client' ? 'msg-client' : 'msg-system'}`;
  message.innerHTML = content;
  return message;
}

function setTyping(visible) {
  if (!typingIndicator || !chatFlowContainer) return;
  typingIndicator.hidden = !visible;
  if (visible) {
    chatFlowContainer.appendChild(typingIndicator);
    chatFlowContainer.scrollTop = chatFlowContainer.scrollHeight;
  }
}

async function runConversationLoop() {
  if (!chatFlowContainer) return;

  while (true) {
    updateChatTime();

    for (const step of conversationSteps) {
      if (step.typingBefore && step.type === 'system') {
        setTyping(true);
        await wait(step.typingBefore);
        setTyping(false);
      }

      const message = createMessage(step.type, step.text);
      chatFlowContainer.appendChild(message);
      chatFlowContainer.scrollTop = chatFlowContainer.scrollHeight;
      await wait(step.waitAfter);
    }

    await wait(700);
    chatFlowContainer.classList.add('chat-flow-reset');
    await wait(360);
    chatFlowContainer.classList.remove('chat-flow-reset');

    Array.from(chatFlowContainer.querySelectorAll('.msg')).forEach((message) => {
      message.remove();
    });
    setTyping(false);
  }
}

if (chatFlowContainer && typingIndicator) {
  setTyping(false);
  runConversationLoop();
  updateChatTime();
  setInterval(updateChatTime, 60 * 1000);
}
