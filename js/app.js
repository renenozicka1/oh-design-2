/* =========================================================
   oh design — app
   Hash router + pages + interactions.
     #/                 what are you looking for? (service picker) — landing
     #/s/<service>      service page: pitch, work, what you get, steps, prices, FAQ, contact
     #/work/<slug>      project
     #/about  #/talk
   Content (EN + CS) lives in js/data.js.
   ========================================================= */
(function () {
  'use strict';
  const OH = window.OH;
  const GL = OH.GL;
  const t = OH.t;
  const UI = OH.UI;
  const root = document.documentElement;

  /* ---------- utils ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b === undefined ? 1 : b, Math.max(a === undefined ? 0 : a, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const damp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt));
  const now = () => performance.now();
  const wait = (s) => new Promise((r) => setTimeout(r, s * 1000));
  const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const gut = () => parseFloat(getComputedStyle(root).getPropertyValue('--gut')) || 24;
  const pad2 = (n) => String(n).padStart(2, '0');
  const ease = {
    expoOut: (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
    quartInOut: (x) => (x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2),
    cubicOut: (x) => 1 - Math.pow(1 - x, 3)
  };
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const PROJECTS = OH.PROJECTS;
  const BY = Object.fromEntries(PROJECTS.map((p) => [p.slug, p]));
  const CATS = Object.fromEntries(OH.CATEGORIES.map((c) => [c.slug, c]));
  const SV = OH.SERVICES;
  const DIMS = OH.DIMS || {};
  const inCat = (cat) => (cat === 'all' ? PROJECTS : PROJECTS.filter((p) => p.cats.includes(cat)));

  const ARROW_D = 'M44 16L52 24L30 46H88V58H30L52 80L44 88L8 52Z';
  const ARROW = `<div class="logo" data-gl="logo" data-vb="96 104" data-path="${ARROW_D}"><svg viewBox="0 0 96 104" aria-hidden="true"><path fill="currentColor" d="${ARROW_D}"/></svg></div>`;
  const LOGO = `<div class="logo" data-gl="logo"><svg viewBox="0 0 ${OH.LOGO.w} ${OH.LOGO.h}" aria-hidden="true"><path fill="currentColor" d="${OH.LOGO.d}"/></svg></div>`;

  /* one masked line of text (the unit the GL layer draws) */
  const ln = (text, cls) => `<span class="ln"><span class="ln__in${cls ? ' ' + cls : ''}" data-gl="text">${esc(text)}</span></span>`;

  /* break a paragraph into masked lines at its current width */
  function split(el) {
    if (el.__text === undefined) el.__text = el.textContent.replace(/\s+/g, ' ').trim();
    el.innerHTML = el.__text.split(' ').map((w) => `<span>${esc(w)}</span>`).join(' ');
    const lines = [];
    let cur = [];
    let top = -1e9;
    for (const s of el.children) {
      if (s.offsetTop > top + 2) {
        if (cur.length) lines.push(cur.join(' '));
        cur = [];
        top = s.offsetTop;
      }
      cur.push(s.textContent);
    }
    if (cur.length) lines.push(cur.join(' '));
    el.innerHTML = lines.map((l) => ln(l)).join('');
  }
  const splitAll = (r) => $$('[data-split]', r).forEach(split);

  /* shrink a heading so its widest line fits */
  function fit(el, max) {
    el.style.fontSize = '';
    const w = Math.max(1, ...$$('.ln__in', el).map((e) => e.offsetWidth));
    if (w > max) el.style.fontSize = ((parseFloat(getComputedStyle(el).fontSize) * max) / w).toFixed(2) + 'px';
  }
  const fitAll = (r) => $$('[data-fit]', r).forEach((el) => fit(el, innerWidth - 2 * gut()));

  /* stagger the lines inside every reveal group */
  function stagger(r, base, step) {
    $$('[data-rv]', r).concat(r.matches && r.matches('[data-rv]') ? [r] : []).forEach((g) => {
      $$('.ln__in', g).forEach((e, i) => e.style.setProperty('--d', ((base || 0) + Math.min(i, 14) * (step || 0.05)).toFixed(3) + 's'));
    });
  }

  /* ---------- tweens ---------- */
  const tweens = new Set();
  function tween(dur, fn, o) {
    o = o || {};
    if (RM) {
      fn(1, 1);
      return Promise.resolve();
    }
    return new Promise((res) => tweens.add({ t0: now() + (o.delay || 0) * 1000, d: Math.max(1, dur * 1000), fn, e: o.ease || ease.expoOut, res }));
  }
  function runTweens(n) {
    for (const tw of tweens) {
      if (n < tw.t0) continue;
      const p = clamp((n - tw.t0) / tw.d);
      tw.fn(tw.e(p), p);
      if (p >= 1) {
        tweens.delete(tw);
        tw.res();
      }
    }
  }

  /* ---------- pointer + cursor ---------- */
  const ptr = { x: innerWidth / 2, y: innerHeight / 2, t: 0 };
  const cursor = {
    el: $('.cursor'), lab: $('.cursor__label'), x: -80, y: -80, lx: -80, ly: -80, text: '', on: false,
    init() {
      if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      this.on = true;
      root.classList.add('has-cursor');
      this.el.classList.add('is-out');
      document.addEventListener('mouseleave', () => this.el.classList.add('is-out'));
      document.addEventListener('mouseenter', () => this.el.classList.remove('is-out'));
    },
    move(e) {
      if (!this.on) return;
      this.x = e.clientX;
      this.y = e.clientY;
      this.el.classList.remove('is-out');
      const c = e.target.closest ? e.target.closest('[data-cursor]') : null;
      const s = c ? c.dataset.cursor : '';
      if (s !== this.text) {
        this.text = s;
        if (s) this.lab.textContent = s;
        this.el.classList.toggle('has-label', !!s);
      }
      this.el.classList.toggle('is-link', !s && !!(e.target.closest && e.target.closest('a,button,.wrow')));
      this.el.classList.toggle('is-text', !!(e.target.closest && e.target.closest('input,textarea')));
    },
    tick(dt) {
      if (!this.on) return;
      this.lx = damp(this.lx, this.x, 16, dt);
      this.ly = damp(this.ly, this.y, 16, dt);
      this.el.style.transform = `translate3d(${this.x}px,${this.y}px,0)`;
      this.lab.style.transform = `translate3d(${(this.lx - this.x).toFixed(1)}px,${(this.ly - this.y).toFixed(1)}px,0)`;
      let alt = false;
      const els = [menu.open ? menu.box : null, ...$$('.btn', current ? pages[current.name].el : document)];
      for (const el of els) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (this.x >= r.left && this.x <= r.right && this.y >= r.top && this.y <= r.bottom) alt = true;
      }
      this.el.classList.toggle('is-alt', alt);
    }
  };
  addEventListener('pointermove', (e) => {
    ptr.x = e.clientX;
    ptr.y = e.clientY;
    ptr.t = now();
    GL.pointer(e.clientX, e.clientY);
    cursor.move(e);
  }, { passive: true });
  addEventListener('pointerdown', (e) => {
    GL.pointer(e.clientX, e.clientY);
    if (e.target.closest && e.target.closest('a,button,.wrow')) GL.pulse(e.clientX, e.clientY);
  }, { passive: true });

  /* ---------- menu (top right) ---------- */
  const menu = {
    el: $('[data-menu]'), box: $('.menu__box'), nav: $('.menu__nav'), hl: $('.menu__hl'), toggle: $('.menu__toggle'), open: false, timer: 0,
    render() {
      const items = [['#/', UI.services], ['#/about', UI.about], ['#/talk', UI.talk]];
      $$('.menu__link', this.nav).forEach((a) => a.remove());
      this.nav.insertAdjacentHTML('beforeend', items.map(([h, l]) => `<a class="menu__link" href="${h}">${ln(t(l))}</a>`).join(''));
      this.links = $$('.menu__link', this.nav);
      this.links.forEach((a, i) => {
        a.querySelector('.ln__in').style.setProperty('--d', (0.12 + i * 0.06).toFixed(2) + 's');
        a.addEventListener('pointerenter', () => this.hlTo(a));
        a.addEventListener('focus', () => this.hlTo(a));
        a.addEventListener('click', () => this.set(false));
      });
    },
    init() {
      this.render();
      GL.inv.menu = this.hl;
      this.toggle.addEventListener('click', () => this.set(!this.open));
      this.nav.addEventListener('pointerleave', () => this.hlOff());
      this.el.addEventListener('pointerleave', (e) => {
        if (e.pointerType === 'mouse') this.timer = setTimeout(() => this.set(false), 420);
      });
      this.el.addEventListener('pointerenter', () => clearTimeout(this.timer));
      document.addEventListener('pointerdown', (e) => {
        if (this.open && !this.el.contains(e.target)) this.set(false);
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.set(false);
      });
    },
    set(v) {
      clearTimeout(this.timer);
      if (v === this.open) return;
      this.open = v;
      this.el.classList.toggle('is-open', v);
      this.toggle.setAttribute('aria-expanded', v ? 'true' : 'false');
      this.toggle.setAttribute('aria-label', v ? 'Close menu' : 'Open menu');
      if (v) {
        this.box.style.width = this.nav.offsetWidth + 'px';
        this.box.style.height = this.nav.offsetHeight + 'px';
        this.el.style.setProperty('--mx', this.nav.offsetWidth + 30 + 'px');
      } else {
        this.box.style.width = '';
        this.box.style.height = '';
        this.hlOff();
      }
    },
    hlTo(a) {
      const hl = this.hl;
      const place = () => {
        hl.style.transform = `translate(${a.offsetLeft}px,${a.offsetTop}px)`;
        hl.style.width = a.offsetWidth + 'px';
        hl.style.height = a.offsetHeight + 'px';
      };
      if (!hl.classList.contains('is-on')) {
        hl.classList.add('no-anim');
        place();
        void hl.offsetWidth;
        hl.classList.remove('no-anim');
      } else place();
      hl.classList.add('is-on');
      this.links.forEach((l) => l.classList.toggle('is-hl', l === a));
    },
    hlOff() {
      this.hl.classList.remove('is-on');
      (this.links || []).forEach((l) => l.classList.remove('is-hl'));
    }
  };

  /* ---------- language switch (CZ / EN) ---------- */
  const lang = {
    el: $('[data-lang]'),
    render() {
      this.el.innerHTML = ['cs', 'en'].map((l) => `<button type="button" data-gl-fade class="lang__b${l === OH.lang ? ' is-on' : ''}" data-l="${l}" aria-pressed="${l === OH.lang}">${ln(l === 'cs' ? 'CZ' : 'EN')}</button>`).join(`<span class="lang__sep" data-gl-fade>${ln('/')}</span>`);
    },
    init() {
      this.render();
      root.lang = OH.lang;
      this.el.addEventListener('click', (e) => {
        const b = e.target.closest('[data-l]');
        if (!b || b.dataset.l === OH.lang || busy) return;
        OH.lang = b.dataset.l;
        try { localStorage.setItem('oh-lang', OH.lang); } catch (err) { /* private mode */ }
        root.lang = OH.lang;
        this.render();
        menu.render();
        Object.values(pages).forEach((p) => (p.done = false));
        go(current, true);
      });
    }
  };

  /* ---------- footer row ---------- */
  const foot = {
    el: $('[data-foot]'),
    set(route) {
      const show = route.name !== 'picker' && route.name !== 'service';
      root.classList.toggle('show-foot', show);
      if (!show) {
        this.el.innerHTML = '';
        return;
      }
      let mid = '';
      this.el.innerHTML = `
        <div class="foot__grp foot__grp--l">${ln('© 2026 oh design')}${ln('|')}${ln(t(OH.STUDIO.city).split(',')[0])}</div>
        <div class="foot__mid">${mid}</div>
        <div class="foot__grp foot__grp--r">${OH.STUDIO.socials.map((s) => `<a href="${s.href}" target="_blank" rel="noopener">${ln(s.label)}</a>`).join(ln('|'))}</div>`;
    }
  };

  /* ---------- curtain (page transition) ---------- */
  const curtain = {
    el: $('.curtain'), svg: $('.curtain__svg'), path: $('.curtain__svg path'), stage: $('.curtain__stage'),
    title: $('.curtain__title'), media: $('.curtain__media'), img: $('.curtain__media img'), count: $('.curtain__count'),
    W: 1, H: 1,
    resize() {
      this.W = innerWidth;
      this.H = innerHeight;
      this.svg.setAttribute('viewBox', `0 0 ${this.W} ${this.H}`);
      if (this.full) this.draw('full');
    },
    draw(mode, p) {
      const W = this.W;
      const H = this.H;
      let d = '';
      if (mode === 'full') d = `M0 0H${W}V${H}H0Z`;
      else if (mode === 'in') {
        const y = H * (1 - p);
        const b = Math.sin(Math.PI * p) * H * 0.2;
        d = `M0 ${H}V${y.toFixed(1)}Q${W / 2} ${(y - 2 * b).toFixed(1)} ${W} ${y.toFixed(1)}V${H}Z`;
      } else if (mode === 'out') {
        const y = H * (1 - p);
        const b = Math.sin(Math.PI * p) * H * 0.2;
        d = `M0 0H${W}V${y.toFixed(1)}Q${W / 2} ${(y + 2 * b).toFixed(1)} 0 ${y.toFixed(1)}Z`;
      }
      this.full = mode === 'full';
      this.path.setAttribute('d', d);
    },
    setTitle(o) {
      this.title.innerHTML = o.title.map((line) => `<span class="ct">${[...line.toUpperCase()].map((ch) => (ch === ' ' ? '<span class="c sp"></span>' : `<span class="c c--b" data-ch="${esc(ch)}">${esc(ch)}</span>`)).join('')}</span>`).join('');
      this.media.classList.toggle('is-on', !!o.img);
      if (o.img) this.img.src = o.img;
      this.count.textContent = '000';
      this.stage.style.opacity = 0;
      this.stage.style.transform = '';
      this.count.style.opacity = 0;
    },
    showFull(o) {
      this.el.classList.add('is-on');
      this.setTitle(o);
      this.draw('full');
    },
    async cover(o) {
      this.el.classList.add('is-on');
      this.setTitle(o);
      await tween(0.8, (e) => this.draw('in', e), { ease: ease.quartInOut });
      this.draw('full');
    },
    play() {
      const chars = $$('.c:not(.sp)', this.title);
      const n = chars.length;
      const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const D = RM ? 0.2 : 1.1;
      const t0 = now();
      this.stage.style.opacity = 1;
      this.count.style.opacity = 1;
      chars.forEach((c) => (c.__done = false));
      return new Promise((res) => {
        const step = () => {
          const e = (now() - t0) / 1000;
          chars.forEach((c, i) => {
            const settle = 0.15 + (i / Math.max(1, n - 1)) * 0.4;
            if (e < settle) {
              c.textContent = /[A-Z]/.test(c.dataset.ch) ? A[(Math.random() * 26) | 0] : c.dataset.ch;
              c.className = 'c ' + (Math.random() < 0.5 ? 'c--s' : 'c--b');
            } else if (!c.__done) {
              c.__done = true;
              c.textContent = c.dataset.ch;
              c.className = 'c c--b';
            }
          });
          this.count.textContent = String(Math.round(clamp(e / D) * 100)).padStart(3, '0');
          if (e >= D) {
            clearInterval(iv);
            res();
          }
        };
        const iv = setInterval(step, 55);
        step();
      });
    },
    async reveal() {
      tween(0.35, (e) => {
        this.stage.style.opacity = 1 - e;
        this.stage.style.transform = `translate3d(0,${(-e * 40).toFixed(1)}px,0)`;
        this.count.style.opacity = 1 - e;
      }, { ease: ease.cubicOut });
      await tween(0.9, (e) => this.draw('out', e), { ease: ease.quartInOut, delay: 0.1 });
      this.el.classList.remove('is-on');
      this.draw('none');
    }
  };

  /* =========================================================
     LANDING — "what are you looking for?" (slide 3):
     the orange slider follows the mouse, a click opens the service
     ========================================================= */
  const picker = {
    el: $('[data-page="picker"]'), def: 2, t0: 0, rv: 0,
    render() {
      if (this.done) return;
      this.done = true;
      this.el.innerHTML = `
        <div class="picker">
          <div class="picker__row" data-rv>
            <div class="picker__hl" data-gl="box" data-gl-clip></div>
            ${OH.CATEGORIES.map((c, i) => `<a class="picker__item" href="#/s/${c.slug}" data-i="${i}">${ln(t(c.label))}</a>`).join('')}
          </div>
        </div>`;
      this.row = $('.picker__row', this.el);
      this.hl = $('.picker__hl', this.el);
      this.items = $$('.picker__item', this.el);
      this.def = Math.max(0, OH.CATEGORIES.findIndex((c) => c.slug === 'brand-identity'));
      this.items.forEach((it, i) => it.addEventListener('focus', () => (this.focus = i)));
      this.items.forEach((it) => it.addEventListener('blur', () => (this.focus = -1)));
      this.inv = this.hl;
    },
    layout() {
      $$('[data-rv]', this.el).forEach((g, k) => $$('.ln__in', g).forEach((e, i) => e.style.setProperty('--d', (0.05 + k * 0.12 + i * 0.07).toFixed(2) + 's')));
      this.hs = null;
    },
    enter() {
      $$('[data-rv]', this.el).forEach((g) => g.classList.add('is-in'));
      this.t0 = now();
      this.focus = -1;
      this.rv = 0;
      tween(0.9, (e) => (this.rv = e), { delay: 0.45 });
      return Promise.resolve();
    },
    leave() {},
    tick(dt) {
      if (!this.items) return;
      let target = this.def;
      if (this.focus >= 0) target = this.focus;
      else if (ptr.t > this.t0 + 200) {
        let best = Infinity;
        this.items.forEach((it, i) => {
          const r = it.getBoundingClientRect();
          const d = Math.hypot(ptr.x - clamp(ptr.x, r.left, r.right), ptr.y - clamp(ptr.y, r.top, r.bottom));
          if (d < best) {
            best = d;
            target = i;
          }
        });
      }
      this.def = target;
      const it = this.items[target];
      const to = { x: it.offsetLeft, y: it.offsetTop, w: it.offsetWidth, h: it.offsetHeight };
      if (!this.hs) this.hs = Object.assign({}, to);
      const hs = this.hs;
      const k = RM ? 60 : 13;
      hs.x = damp(hs.x, to.x, k, dt);
      hs.y = damp(hs.y, to.y, k, dt);
      hs.w = damp(hs.w, to.w, k, dt);
      hs.h = damp(hs.h, to.h, k, dt);
      const s = this.hl.style;
      s.transform = `translate3d(${hs.x.toFixed(2)}px,${hs.y.toFixed(2)}px,0)`;
      s.width = hs.w.toFixed(2) + 'px';
      s.height = hs.h.toFixed(2) + 'px';
      s.clipPath = this.rv < 1 ? `inset(0 ${((1 - this.rv) * 100).toFixed(2)}% 0 0)` : 'none';
      this.items.forEach((el, i) => el.classList.toggle('is-hl', i === target && this.rv > 0.5));
    }
  };

  /* =========================================================
     Scrolling pages — shared pieces
     ========================================================= */
  /* reveal groups / media as they come up from the bottom edge (per frame:
     IntersectionObserver ignores elements fully clipped by their own clip-path) */
  let pending = [];
  function observe(page) {
    pending = $$('[data-rv],[data-rv-media]', page).filter((el) => !el.classList.contains('is-in'));
  }
  function revealTick() {
    if (!pending.length) return;
    const line = innerHeight * 0.93;
    pending = pending.filter((el) => {
      if (el.getBoundingClientRect().top > line) return true;
      el.classList.add('is-in');
      return false;
    });
  }
  function media(s, cls, i) {
    const src = s.img || s.video;
    const d = DIMS[src] || [16, 10];
    const inner = s.video
      ? `<video data-gl="video" src="${src}" muted loop playsinline autoplay preload="auto"></video>`
      : `<img data-gl="img" src="${src}" alt="" decoding="async">`;
    return `<figure class="g ${cls}${i % 2 ? ' from-l' : ''}" data-rv-media data-gl-clip style="aspect-ratio:${d[0]}/${d[1]}"><div class="m-in">${inner}</div></figure>`;
  }
  function gallery(shots, flip) {
    let out = '';
    let i = 0;
    let k = 0;
    while (i < shots.length) {
      const s = shots[i];
      const n = shots[i + 1];
      if (s.wide) {
        out += media(s, 'g--wide', k++);
        i++;
      } else if (n && !n.wide) {
        out += media(s, flip ? 'g--l2' : 'g--l', k++) + media(n, flip ? 'g--r2' : 'g--r', k++);
        i += 2;
        flip = !flip;
      } else {
        out += media(s, flip ? 'g--c2' : 'g--c', k++);
        i++;
        flip = !flip;
      }
    }
    return out ? `<section class="gal">${out}</section>` : '';
  }
  const link = (label, href, ext) => `<a class="lnk" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}>${ln(label)}<span class="ul" data-gl="box"></span></a>`;
  const btn = (label, attrs) => `<button type="button" class="btn" ${attrs || ''}><span class="btn__bg" data-gl="box"></span>${ln(label)}</button>`;

  /* contact form — inputs sit above the GL canvas so typing stays crisp; sends via the visitor's e-mail app */
  function contactForm(service) {
    return `
      <form class="form" data-form data-service="${esc(service || '')}" novalidate>
        <label class="field"><span class="lbl">${ln(t(UI.name))}</span><input name="name" autocomplete="name" required><span class="field__line" data-gl="box"></span></label>
        <label class="field"><span class="lbl">${ln(t(UI.email))}</span><input name="email" type="email" autocomplete="email" required><span class="field__line" data-gl="box"></span></label>
        <label class="field field--wide"><span class="lbl">${ln(t(UI.msg))}</span><textarea name="msg" rows="3" required></textarea><span class="field__line" data-gl="box"></span></label>
        <div class="form__end">
          <button type="submit" class="btn"><span class="btn__bg" data-gl="box"></span>${ln(t(UI.send))}</button>
          <p class="form__ok lbl" aria-live="polite"></p>
        </div>
      </form>`;
  }
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('[data-form]');
    if (!f) return;
    e.preventDefault();
    if (!f.checkValidity()) {
      f.reportValidity();
      return;
    }
    f.querySelector('.form__ok').textContent = t(UI.formSent);
    location.href = mailtoFor(f);
  });
  function mailtoFor(f) {
    const v = Object.fromEntries(new FormData(f).entries());
    const svc = f.dataset.service;
    const subject = `oh design${svc ? ' — ' + svc : ''} — ${v.name}`;
    const body = `${v.msg}\n\n${v.name}\n${v.email}`;
    return `mailto:${OH.STUDIO.mail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  /* buttons that scroll to a section of the page */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-to]');
    if (!b) return;
    const el = current && $(`[data-anchor="${b.dataset.to}"]`, pages[current.name].el);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight * 0.12, behavior: RM ? 'auto' : 'smooth' });
  });

  const teamBlock = () => `
    <div class="team">
      ${OH.STUDIO.team.map((m, i) => `
      <article class="mem">
        <figure class="mem__ph${i % 2 ? ' from-l' : ''}" data-rv-media data-gl-clip><div class="m-in"><img data-gl="img" src="${m.photo}" alt="${esc(m.name)}"></div></figure>
        <div data-rv>
          <h3 class="mem__name">${m.name.split(' ').map((w) => ln(w)).join('')}</h3>
          <p class="mem__role" data-split>${esc(t(m.role))}</p>
          <div class="mem__links">${link(m.mail, 'mailto:' + m.mail)}${link(m.tel, 'tel:' + m.tel.replace(/\s/g, ''))}</div>
        </div>
      </article>`).join('')}
    </div>`;

  const scrollPage = {
    scroll: true,
    layout() {
      splitAll(this.el);
      fitAll(this.el);
      stagger(this.el, 0, 0.05);
    },
    enter() {
      observe(this.el);
      return Promise.resolve();
    },
    leave() {
      pending = [];
      $$('video', this.el).forEach((v) => v.pause());
    },
    tick() {
      revealTick();
    }
  };

  /* =========================================================
     SERVICE — one pitch page per category
     ========================================================= */
  const service = Object.assign({}, scrollPage, {
    el: $('[data-page="service"]'),
    render(route) {
      const cat = route.cat;
      const s = SV[cat];
      const label = t(CATS[cat].label);
      const n = OH.CATEGORIES.findIndex((c) => c.slug === cat) + 1;
      const work = inCat(cat);
      const others = OH.CATEGORIES.filter((c) => c.slug !== cat);
      this.el.setAttribute('aria-label', label);
      this.el.innerHTML = `
        <article class="sv">
          <header class="sv__hero">
            <div class="lbl" data-rv>${ln('(' + pad2(n) + ') ' + label)}</div>
            <h1 class="sv__head" data-split data-rv>${esc(t(s.head))}</h1>
            <div class="sv__row">
              <p class="sv__intro" data-split data-rv>${esc(t(s.intro))}</p>
              <div class="sv__ctas" data-rv>
                ${btn(t(s.beta ? UI.early : UI.bookCall), 'data-to="contact"')}
                ${work.length ? `<button type="button" class="lnk" data-to="work">${ln(t(UI.seeWork))}<span class="ul" data-gl="box"></span></button>` : ''}
              </div>
            </div>
            ${s.beta ? `<div class="sv__beta lbl" data-rv>${ln(t(UI.beta))}</div>` : ''}
          </header>

          ${work.length ? `
          <section class="sec sec--wide" data-anchor="work">
            <div class="lbl" data-rv>${ln(t(UI.selected) + ' (' + pad2(work.length) + ')')}</div>
            <div class="cards">
              ${work.map((p, i) => `
              <a class="card" href="#/work/${p.slug}" data-cursor="${esc(t(UI.view))}">
                <figure class="card__m${i % 2 ? ' from-l' : ''}" data-rv-media data-gl-clip><div class="m-in"><img data-gl="img" src="${p.cover}" alt="${esc(p.title.join(' '))}" decoding="async"></div></figure>
                <div class="card__meta" data-rv><h3 class="card__t">${ln(p.title.join(' '))}</h3>${ln(t(p.kind), 'card__k')}</div>
              </a>`).join('')}
            </div>
          </section>` : ''}

          <section class="sec">
            <div class="lbl" data-rv>${ln(t(UI.youGet))}</div>
            <ol class="get">${s.get.map((g, i) => `<li data-rv><span class="get__n">${ln(pad2(i + 1))}</span><span class="get__t">${ln(t(g))}</span><span class="get__line" data-gl="box"></span></li>`).join('')}</ol>
          </section>

          <section class="sec">
            <div class="lbl" data-rv>${ln(t(UI.how))}</div>
            <ol class="steps">${OH.STEPS.map((st, i) => `<li class="step" data-rv><span class="step__line" data-gl="box"></span><span class="step__n">${ln(pad2(i + 1))}</span><h3 class="step__t">${ln(t(st.t))}</h3><p class="step__d" data-split>${esc(t(st.d))}</p></li>`).join('')}</ol>
          </section>

          <section class="sec">
            <div class="lbl" data-rv>${ln(t(UI.pricing))}</div>
            <div class="prices">${s.price.map((p) => `
              <div class="price" data-rv>
                <span class="price__line" data-gl="box"></span>
                <div class="lbl">${ln(t(p.name))}</div>
                <div class="price__v">${ln(t(p.value))}</div>
                <p class="price__note" data-split>${esc(t(p.note))}</p>
              </div>`).join('')}
            </div>
          </section>

          <section class="sec">
            <div class="lbl" data-rv>${ln(t(UI.why))}</div>
            <ul class="why">${OH.STUDIO.why.map((w, i) => `<li data-rv><span class="get__n">${ln(pad2(i + 1))}</span><p data-split>${esc(t(w))}</p></li>`).join('')}</ul>
          </section>

          <section class="sec">
            <div class="lbl" data-rv>${ln(t(UI.team))}</div>
            ${teamBlock()}
          </section>

          <section class="sec">
            <div class="lbl" data-rv>${ln(t(UI.faq))}</div>
            <dl class="faq">${s.faq.map((f) => `<div class="faq__i" data-rv><span class="faq__line" data-gl="box"></span><dt data-split>${esc(t(f.q))}</dt><dd data-split>${esc(t(f.a))}</dd></div>`).join('')}</dl>
          </section>

          <section class="sec" data-anchor="contact">
            <div class="lbl" data-rv>${ln(t(UI.contact))}</div>
            <div class="col">
              <h2 class="sv__ctah" data-split data-rv>${esc(t(UI.contactHead))}</h2>
              <p class="sv__note" data-split data-rv>${esc(t(UI.contactNote))}</p>
              ${contactForm(label)}
              <div class="direct" data-rv>${link(OH.STUDIO.mail, 'mailto:' + OH.STUDIO.mail)}${link(OH.STUDIO.team[0].tel, 'tel:' + OH.STUDIO.team[0].tel.replace(/\s/g, ''))}</div>
            </div>
          </section>

          <section class="sv__other">
            <div class="lbl al-c" data-rv>${ln(t(UI.other))}</div>
            <div class="sv__others" data-rv>${others.map((c) => `<a href="#/s/${c.slug}" class="lnk">${ln(t(c.label))}<span class="ul" data-gl="box"></span></a>`).join('')}</div>
          </section>
        </article>`;
    }
  });

  /* =========================================================
     PROJECT
     ========================================================= */
  const project = Object.assign({}, scrollPage, {
    el: $('[data-page="project"]'),
    render(route) {
      const p = BY[route.slug];
      const i = PROJECTS.indexOf(p);
      const next = PROJECTS[(i + 1) % PROJECTS.length];
      const desc = t(p.desc);
      const credits = t(p.credits) || [];
      const half = Math.ceil(p.shots.length / 2);
      const cats = p.cats.map((c) => `<li>${link(t(CATS[c].label), '#/s/' + c)}</li>`).join('');
      this.el.setAttribute('aria-label', p.title.join(' '));
      this.el.innerHTML = `
        <article class="pj">
          <header class="pj__hero from-b" data-rv-media data-gl-clip><div class="m-in"><img data-gl="img" src="${p.hero}" alt="${esc(p.title.join(' '))}"></div></header>
          <h1 class="pj__title al-c" data-rv data-fit>${p.title.map((x) => ln(x)).join('')}</h1>
          <div class="pj__kind lbl al-c" data-rv>${ln(t(p.kind))}</div>
          <div class="pj__mini al-c" aria-hidden="true">${ln(p.title.join(' '))}<div class="lbl">${ln(t(p.kind))}</div></div>

          <section class="sec">
            <div class="lbl" data-rv>${ln(t(UI.description))}</div>
            <p class="lead" data-split data-rv>${esc(desc[0])}</p>
          </section>

          <section class="pj__info">
            <div class="col" data-rv><div class="lbl">${ln(t(UI.category))}</div><ul>${cats}</ul></div>
            ${credits.length ? `<div class="col" data-rv><div class="lbl">${ln(t(UI.credits))}</div><ul>${credits.map((c) => `<li data-split>${esc(c)}</li>`).join('')}</ul></div>` : ''}
            ${p.web ? `<div class="col" data-rv><div class="lbl">${ln(t(UI.link))}</div><ul><li>${link(p.webLabel || 'Visit', p.web, true)}</li></ul></div>` : ''}
          </section>

          ${gallery(p.shots.slice(0, half), false)}

          ${desc.length > 1 ? `
          <section class="sec">
            <div class="lbl" data-rv>${ln(t(UI.details))}</div>
            <div class="col">${desc.slice(1).map((d) => `<p class="body" data-split data-rv>${esc(d)}</p>`).join('')}</div>
          </section>` : ''}

          ${gallery(p.shots.slice(half), true)}

          <section class="pj__cta">
            <div class="lbl al-c" data-rv>${ln(t(UI.similar))}</div>
            <div class="al-c" data-rv>${btn(t(UI.bookCall), `data-go="#/s/${backCat(p)}"`)}</div>
          </section>

          <a class="pj__next" href="#/work/${next.slug}" data-cursor="${esc(t(UI.next))}">
            <div class="lbl al-c" data-rv>${ln(t(UI.next))}</div>
            <figure class="pj__next-thumb from-b" data-rv-media data-gl-clip><div class="m-in"><img data-gl="img" src="${next.thumb}" alt=""></div></figure>
            <div class="pj__next-title al-c" data-rv data-fit>${next.title.map((x) => ln(x)).join('')}</div>
          </a>
        </article>`;
      this.title = $('.pj__title', this.el);
      this.mini = $('.pj__mini', this.el);
    },
    tick() {
      revealTick();
      if (!this.title) return;
      this.mini.classList.toggle('is-in', this.title.getBoundingClientRect().bottom < 0);
    }
  });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-go]');
    if (b) location.hash = b.dataset.go;
  });

  /* =========================================================
     ABOUT + LET'S TALK
     ========================================================= */
  const about = Object.assign({}, scrollPage, {
    el: $('[data-page="about"]'),
    render() {
      if (this.done) return;
      this.done = true;
      this.el.innerHTML = `
        <article class="ab">
          <header class="pagehead"><h1 class="big al-c" data-rv data-fit>${ln(t(UI.about))}</h1></header>
          <section class="sec">
            <div class="lbl" data-rv>${ln(t(UI.studio))}</div>
            <p class="lead" data-split data-rv>${esc(t(OH.STUDIO.about))}</p>
          </section>
          <section class="sec">
            <div class="lbl" data-rv>${ln(t(UI.whatWeDo))}</div>
            <ul class="svc" data-rv>${OH.CATEGORIES.map((c) => `<li><a href="#/s/${c.slug}">${ln(t(c.label))}</a></li>`).join('')}</ul>
          </section>
          <section class="sec">
            <div class="lbl" data-rv>${ln(t(UI.team))}</div>
            ${teamBlock()}
          </section>
          <a class="pj__next" href="#/talk" data-cursor="${esc(t(UI.sayHi))}">
            <div class="lbl al-c" data-rv>${ln(t(UI.haveProject))}</div>
            <div class="pj__next-title al-c" data-rv data-fit>${ln(t(UI.talk))}</div>
          </a>
        </article>`;
    }
  });

  const talk = Object.assign({}, scrollPage, {
    el: $('[data-page="talk"]'),
    render() {
      if (this.done) return;
      this.done = true;
      const S = OH.STUDIO;
      this.el.innerHTML = `
        <article class="tk">
          <header class="pagehead"><h1 class="big al-c" data-rv data-fit>${ln(t(UI.talk))}</h1></header>
          <section class="sec">
            <div class="lbl" data-rv>${ln(t(UI.newProjects))}</div>
            <div class="col">
              <p class="sv__note" data-split data-rv>${esc(t(UI.contactNote))}</p>
              ${contactForm('')}
            </div>
          </section>
          <section class="sec">
            <div class="lbl" data-rv>${ln(t(UI.email))}</div>
            <div class="tk__mails" data-rv>${S.team.map((m) => link(m.mail, 'mailto:' + m.mail)).join('')}</div>
          </section>
          <section class="sec">
            <div class="lbl" data-rv>${ln(t(UI.phone))}</div>
            <div class="tk__list" data-rv>${S.team.map((m) => link(m.tel + ' — ' + m.name.split(' ')[0], 'tel:' + m.tel.replace(/\s/g, ''))).join('')}</div>
          </section>
          <section class="sec">
            <div class="lbl" data-rv>${ln(t(UI.social))}</div>
            <div class="tk__list" data-rv>${S.socials.map((s) => link(s.label, s.href, true)).join('')}</div>
          </section>
          <section class="sec">
            <div class="lbl" data-rv>${ln(t(UI.based))}</div>
            <div class="tk__list" data-rv>${ln(t(S.city))}</div>
          </section>
        </article>`;
    }
  });

  /* =========================================================
     Router + transitions
     ========================================================= */
  const pages = { picker, service, project, about, talk };
  let current = null;
  let busy = false;
  let queued = null;

  function parse() {
    const parts = location.hash.replace(/^#\/?/, '').split('/');
    const a = parts[0];
    const b = parts[1];
    if (a === 's' && SV[b]) return { name: 'service', cat: b };
    if (a === 'work' && BY[b]) return { name: 'project', slug: b };
    if (a === 'about') return { name: 'about' };
    if (a === 'talk') return { name: 'talk' };
    return { name: 'picker' };
  }
  const same = (a, b) => a && b && a.name === b.name && a.cat === b.cat && a.slug === b.slug;
  function titleFor(r) {
    if (r.name === 'service') return { title: [t(CATS[r.cat].label)], doc: t(CATS[r.cat].label) };
    if (r.name === 'project') return { title: BY[r.slug].title, img: BY[r.slug].thumb, doc: BY[r.slug].title.join(' ') };
    if (r.name === 'about') return { title: [t(UI.about)], doc: t(UI.about) };
    if (r.name === 'talk') return { title: [t(UI.talk)], doc: t(UI.talk) };
    return { title: ['oh design'], doc: '' };
  }

  /* top-left: the mark everywhere, a back arrow on projects (back to the service you came from) */
  let lastService = null;
  let toWork = false;
  const backCat = (p) => (lastService && SV[lastService] ? lastService : p.cats[0]);
  const brand = {
    el: $('[data-brand]'),
    set(route) {
      const back = route.name === 'project';
      this.back = back;
      if (back !== this.shown) this.el.innerHTML = back ? ARROW : LOGO;
      this.shown = back;
      this.el.classList.toggle('is-back', back);
      this.el.setAttribute('href', back ? '#/s/' + backCat(BY[route.slug]) : '#/');
      this.el.setAttribute('aria-label', back ? t(UI.back) : 'oh design — home');
      this.el.dataset.cursor = back ? t(UI.back) : '';
    }
  };
  brand.el.addEventListener('click', () => {
    if (brand.back) toWork = true;
  });

  function show(route) {
    if (current && pages[current.name].leave) pages[current.name].leave();
    $$('.page').forEach((p) => p.classList.remove('is-active'));
    const pg = pages[route.name];
    pg.render(route);
    $$('.is-in', pg.el).forEach((el) => el.classList.remove('is-in'));
    pg.el.classList.add('is-active');
    root.classList.toggle('is-scroll', !!pg.scroll);
    root.dataset.route = route.name;
    window.scrollTo(0, 0);
    if (route.name === 'service') lastService = route.cat;
    brand.set(route);
    cursor.text = '';
    cursor.el.classList.remove('has-label');
    GL.axis.axis = null;
    GL.axis.v = 0;
    foot.set(route);
    if (pg.layout) pg.layout();
    const anchor = toWork && route.name === 'service' ? $('[data-anchor="work"]', pg.el) : null;
    toWork = false;
    if (anchor) window.scrollTo(0, anchor.getBoundingClientRect().top + scrollY - innerHeight * 0.12);
    GL.resetScroll();
    GL.inv.page = pg.inv || null;
    current = route;
    const d = titleFor(route).doc;
    document.title = (d ? d + ' — ' : '') + 'oh design — brand identity, web design & motion, Prague';
    GL.build();
  }

  async function go(route, force) {
    if (busy) {
      queued = route;
      return;
    }
    if (!force && same(route, current)) return;
    busy = true;
    try {
      menu.set(false);
      await curtain.cover(titleFor(route));
      const played = curtain.play();
      await nextFrame();
      show(route);
      await played;
      await wait(0.1);
      const out = curtain.reveal();
      await wait(0.3);
      pages[route.name].enter(false);
      await out;
    } finally {
      busy = false;
    }
    if (queued) {
      const q = queued;
      queued = null;
      go(q);
    }
  }

  function relayout() {
    if (!current) return;
    const pg = pages[current.name];
    if (pg.layout) pg.layout();
    if (menu.open) {
      menu.open = false;
      menu.set(true);
    }
    GL.build();
  }

  /* ---------- frame loop ---------- */
  let last = now();
  let footOff = false;
  function frame(n) {
    const dt = Math.min((n - last) / 1000, 0.1);
    last = n;
    runTweens(n);
    if (current) {
      const pg = pages[current.name];
      if (pg.scroll) {
        GL.axis.axis = null;
        GL.axis.v = 0;
      }
      if (pg.tick) pg.tick(dt);
      const off = !!pg.scroll && window.scrollY > 80;
      if (off !== footOff) {
        footOff = off;
        root.classList.toggle('foot-off', off);
      }
    }
    cursor.tick(dt);
    GL.render(dt);
    requestAnimationFrame(frame);
  }

  /* ---------- boot ---------- */
  async function boot() {
    try {
      await Promise.race([
        Promise.all([document.fonts.load('400 20px "Space Grotesk"'), document.fonts.load('700 20px "Space Grotesk"'), document.fonts.ready]),
        wait(2.5)
      ]);
    } catch (e) { /* keep going with fallback fonts */ }

    menu.init();
    lang.init();
    cursor.init();
    curtain.resize();

    const glOk = GL.init($('.gl'));
    if (!glOk) root.classList.add('no-gl');

    const route = parse();
    const landing = route.name === 'picker';
    if (!landing) curtain.showFull(titleFor(route));
    show(route);
    if (glOk) GL.enable();
    root.classList.remove('is-loading');
    requestAnimationFrame((n) => {
      last = n;
      requestAnimationFrame(frame);
    });

    busy = true;
    try {
      if (landing) {
        await wait(0.15);
        await pages.picker.enter();
      } else {
        await curtain.play();
        await wait(0.12);
        const out = curtain.reveal();
        await wait(0.3);
        pages[route.name].enter(false);
        await out;
      }
    } finally {
      busy = false;
    }
    if (queued) {
      const q = queued;
      queued = null;
      go(q);
    }
  }

  addEventListener('hashchange', () => go(parse()));
  let rz = 0;
  addEventListener('resize', () => {
    GL.resize();
    curtain.resize();
    clearTimeout(rz);
    rz = setTimeout(relayout, 180);
  });

  OH.app = { go, parse, pages, mailtoFor, get current() { return current; } };
  boot();
})();
