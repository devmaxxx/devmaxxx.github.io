for (const button of document.querySelectorAll('.copy')) {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(document.getElementById(button.dataset.copy).textContent);
      button.textContent = 'Copied';
    } catch {
      button.textContent = 'Select and copy';
    }
    setTimeout(() => { button.textContent = 'Copy'; }, 1600);
  });
}

const tabs = [...document.querySelectorAll('[role="tab"]')];
function select(tab) {
  for (const t of tabs) {
    const on = t === tab;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  }
}
for (const [i, tab] of tabs.entries()) {
  tab.addEventListener('click', () => select(tab));
  tab.addEventListener('keydown', (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    const next = tabs[(i + step + tabs.length) % tabs.length];
    select(next);
    next.focus();
  });
}
if (tabs.length) select(tabs[0]);

const video = document.getElementById('brag');
const sound = document.getElementById('sound');
if (video && sound) {
  // Browsers only autoplay muted video, and a visitor who asked for less motion gets the poster.
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.play().then(() => { sound.hidden = false; }).catch(() => {});
  }
  sound.addEventListener('click', () => {
    video.muted = !video.muted;
    sound.textContent = video.muted ? 'Sound on' : 'Sound off';
    if (!video.muted) { video.currentTime = 0; video.play(); }
  });
}

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!calm && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js');

  const groups = ['.claims article', '.steps li', '.pipe li', '.fit > div', '#faq details', '.langs li', '.chart'];
  for (const el of document.querySelectorAll('.sec, .sub, .quote, .note, .term, .bars, .big, .cta, .video, .split > div:first-child')) el.classList.add('reveal');
  for (const g of groups) document.querySelectorAll(g).forEach((el, i) => { el.classList.add('reveal'); el.style.setProperty('--i', g === '.langs li' ? i * 0.4 : i); });

  const seen = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('in');
      seen.unobserve(e.target);
      for (const n of e.target.matches('[data-count]') ? [e.target] : e.target.querySelectorAll('[data-count]')) count(n);
      if (e.target.matches('#action .term')) type(e.target.querySelector('pre:not([hidden])'));
    }
  }, { threshold: 0.15 });
  for (const el of document.querySelectorAll('.reveal')) seen.observe(el);

  // The number in the markup is the true one; the animation only travels to it.
  function count(node) {
    if (node.dataset.done) return;
    node.dataset.done = '1';
    const to = parseFloat(node.textContent), from = parseFloat(node.dataset.from), dec = +node.dataset.dec, t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / 1100), e = 1 - Math.pow(1 - p, 3);
      node.textContent = (from + (to - from) * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const sources = new WeakMap();
  let run = 0;
  function type(pre) {
    if (!pre) return;
    if (!sources.has(pre)) sources.set(pre, pre.innerHTML);
    const [first, ...rest] = sources.get(pre).split('\n');
    const command = first.replace(/^.*<b>|<\/b>$/g, '');
    const prompt = first.slice(0, first.indexOf('<b>'));
    const mine = ++run;
    let n = 0;
    const step = () => {
      if (mine !== run) { pre.innerHTML = sources.get(pre); return; }
      if (n <= command.length) {
        pre.innerHTML = `${prompt}<b>${command.slice(0, n)}</b><span class="caret"></span>`;
        n++;
        setTimeout(step, 28);
      } else {
        pre.innerHTML = [first, ...rest.map((l, i) => `<span class="ln" style="animation-delay:${i * 90}ms">${l}</span>`)].join('\n');
      }
    };
    step();
  }
  for (const tab of tabs) tab.addEventListener('click', () => type(document.getElementById(tab.getAttribute('aria-controls'))));
}
