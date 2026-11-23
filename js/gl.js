/* =========================================================
   oh design — GL surface
   Every element marked [data-gl] is drawn into one WebGL frame,
   which is then post-processed: a lens that follows a fast cursor,
   a bow that bends the screen with scroll / carousel speed and a
   ripple on click. The DOM stays underneath for layout, clicks and
   accessibility — it is only made invisible while GL is on.

   data-gl="img|video|text|logo|box"   what to draw
   data-gl-clip                         element clips its subtree by its clip-path: inset()
   data-gl-fade                         ancestor whose opacity multiplies into its subtree
   data-gl-inv="key"                    text inverts its colour inside OH.GL.inv[key]
   data-gl-z="n"                        draw order layer (higher = on top)
   ========================================================= */
(function () {
  'use strict';
  const OH = (window.OH = window.OH || {});

  const VS_PLANE = `#version 300 es
uniform vec2 uRes;
uniform vec4 uRect;
out vec2 vLocal;
out vec2 vPix;
void main() {
  vec2 c = vec2(float(gl_VertexID & 1), float((gl_VertexID >> 1) & 1));
  vLocal = c;
  vPix = uRect.xy + c * uRect.zw;
  gl_Position = vec4(vPix.x / uRes.x * 2.0 - 1.0, 1.0 - vPix.y / uRes.y * 2.0, 0.0, 1.0);
}`;

  const FS_PLANE = `#version 300 es
precision highp float;
in vec2 vLocal;
in vec2 vPix;
uniform sampler2D uTex;
uniform int uMode;
uniform vec4 uUv;
uniform vec4 uClip;
uniform float uClipR;
uniform vec2 uSize;
uniform float uRadius;
uniform float uAlpha;
uniform vec4 uColA;
uniform vec4 uColB;
uniform vec4 uInv;
out vec4 outColor;

float sdBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

void main() {
  if (vPix.x < uClip.x || vPix.y < uClip.y || vPix.x > uClip.x + uClip.z || vPix.y > uClip.y + uClip.w) discard;
  float cov = 1.0;
  if (uClipR > 0.0) {
    vec2 h = uClip.zw * 0.5;
    float d = sdBox(vPix - uClip.xy - h, h, min(uClipR, min(h.x, h.y)));
    cov = clamp(0.5 - d, 0.0, 1.0);
    if (cov <= 0.0) discard;
  }
  bool inv = uInv.z > 0.0 && vPix.x >= uInv.x && vPix.x <= uInv.x + uInv.z && vPix.y >= uInv.y && vPix.y <= uInv.y + uInv.w;
  vec4 col = inv ? uColB : uColA;
  vec4 c;
  if (uMode == 0) {
    c = texture(uTex, uUv.xy + vLocal * uUv.zw);
  } else if (uMode == 1) {
    float a = texture(uTex, uUv.xy + vLocal * uUv.zw).a;
    c = vec4(col.rgb, 1.0) * a * col.a;
  } else {
    vec2 h = uSize * 0.5;
    float d = sdBox(vLocal * uSize - h, h, min(uRadius, min(h.x, h.y)));
    c = vec4(col.rgb, 1.0) * col.a * clamp(0.5 - d, 0.0, 1.0);
  }
  outColor = c * uAlpha * cov;
}`;

  const VS_POST = `#version 300 es
uniform vec2 uRes;
out vec2 vScreen;
void main() {
  vec2 c = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vScreen = vec2(c.x, 1.0 - c.y) * uRes;
  gl_Position = vec4(c * 2.0 - 1.0, 0.0, 1.0);
}`;

  /* lens around the pointer + bow (x and y) + click ripple */
  const FS_POST = `#version 300 es
precision highp float;
in vec2 vScreen;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uPointer;
uniform float uRadius;
uniform float uStrength;
uniform float uCurve;
uniform float uCurveX;
uniform float uEdge;
uniform vec2 uPulse;
uniform float uPulseRadius;
uniform float uPulseWidth;
uniform float uPulseAmp;
out vec4 outColor;

void main() {
  vec2 delta = vScreen - uPointer;
  float dist = length(delta) / uRadius;
  float spot = exp(-dist * dist * 2.0);

  float band = max(uEdge, 0.001);
  float bowY = 0.0;
  if (uCurve != 0.0) {
    float across = max(sin(3.14159265 * vScreen.x / uRes.x), 0.0);
    float edge = smoothstep(0.0, band, vScreen.y) * smoothstep(0.0, band, uRes.y - vScreen.y);
    bowY = uCurve * across * edge;
  }
  float bowX = 0.0;
  if (uCurveX != 0.0) {
    float down = max(sin(3.14159265 * vScreen.y / uRes.y), 0.0);
    float edge = smoothstep(0.0, band, vScreen.x) * smoothstep(0.0, band, uRes.x - vScreen.x);
    bowX = uCurveX * down * edge;
  }

  vec2 ring = vec2(0.0);
  if (uPulseAmp != 0.0) {
    vec2 pd = vScreen - uPulse;
    float pl = length(pd);
    float thick = max(uPulseWidth * uPulseRadius, 1.0);
    float fo = (pl - uPulseRadius) / thick;
    ring = (pd / max(pl, 1.0)) * (uPulseAmp * exp(-fo * fo));
  }

  vec2 src = vScreen - delta * (spot * uStrength) - vec2(bowX, bowY) - ring;
  vec2 uv = vec2(src.x / uRes.x, 1.0 - src.y / uRes.y);
  outColor = vec4(texture(uTex, uv).rgb, 1.0);
}`;

  /* effect strength — kept deliberately subtle: only fast cursor moves / fast scroll show it
     (Auge uses lens .14, bow 60 px, ripple 45 px) */
  const FX = { lens: 0, bow: 18, pulse: 0 };

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  let gl = null;
  let cv = null;
  let pPlane = null;
  let pPost = null;
  let vao = null;
  let fbo = null;
  let fboTex = null;
  let dummy = null;
  let W = 1;
  let H = 1;
  let dpr = 1;
  let logoPath = null;
  let ACC = [250 / 255, 68 / 255, 50 / 255, 1];
  let BG = [237 / 255, 238 / 255, 229 / 255, 1];

  const units = new Map(); // element -> unit
  let list = []; // units in draw order
  const cache = new Map(); // texture key -> entry

  const st = {
    px: -9999, py: -9999, lpx: 0, lpy: 0, has: false,
    ex: 0, eb: 0, eM: 0, eS: 0, eP: 0,
    lastScroll: 0, pulse: null
  };

  /* ---------- helpers ---------- */
  function parseColor(s) {
    s = (s || '').trim();
    if (!s || s === 'transparent') return [0, 0, 0, 0];
    if (s[0] === '#') {
      let h = s.slice(1);
      if (h.length === 3 || h.length === 4) h = h.split('').map((c) => c + c).join('');
      const n = parseInt(h.slice(0, 6), 16);
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, h.length === 8 ? parseInt(h.slice(6), 16) / 255 : 1];
    }
    const m = s.match(/rgba?\(([^)]+)\)/);
    if (m) {
      const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat);
      return [p[0] / 255, p[1] / 255, p[2] / 255, p.length > 3 ? p[3] : 1];
    }
    return ACC.slice();
  }
  const near = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) < 0.12;
  const swap = (c) => (near(c, ACC) ? [BG[0], BG[1], BG[2], c[3]] : [ACC[0], ACC[1], ACC[2], c[3]]);

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('[gl]', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }
  function program(vs, fs, names) {
    const v = compile(gl.VERTEX_SHADER, vs);
    const f = compile(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return null;
    const p = gl.createProgram();
    gl.attachShader(p, v);
    gl.attachShader(p, f);
    gl.linkProgram(p);
    gl.deleteShader(v);
    gl.deleteShader(f);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.warn('[gl]', gl.getProgramInfoLog(p));
      return null;
    }
    const u = {};
    names.forEach((n) => (u[n] = gl.getUniformLocation(p, n)));
    return { p, u };
  }
  function texParams(mip) {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mip ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }
  function makeTex(source, mip) {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    } catch (e) {
      gl.deleteTexture(t);
      throw e; // cross-origin / file:// — the caller turns GL off
    }
    texParams(mip);
    if (mip) gl.generateMipmap(gl.TEXTURE_2D);
    return t;
  }

  /* clip-path: inset(...) of an element, applied to its client rect */
  function insetOf(el, r) {
    const cp = getComputedStyle(el).clipPath;
    if (!cp || cp === 'none') return r;
    const m = /inset\(([^)]*)\)/.exec(cp);
    if (!m) return r;
    const v = m[1].split(/\s+round\s+/)[0].trim().split(/\s+/);
    const t = v[0];
    const rt = v[1] !== undefined ? v[1] : t;
    const b = v[2] !== undefined ? v[2] : t;
    const l = v[3] !== undefined ? v[3] : rt;
    const sx = el.offsetWidth ? r.width / el.offsetWidth : 1;
    const sy = el.offsetHeight ? r.height / el.offsetHeight : 1;
    const px = (s, size, sc) => (s.endsWith('%') ? (parseFloat(s) / 100) * size : (parseFloat(s) || 0) * sc);
    return {
      left: r.left + px(l, r.width, sx),
      top: r.top + px(t, r.height, sy),
      right: r.right - px(rt, r.width, sx),
      bottom: r.bottom - px(b, r.height, sy)
    };
  }

  /* ---------- units ---------- */
  function meta(u) {
    const el = u.el;
    const cs = getComputedStyle(el);
    u.kind = el.dataset.gl;
    u.clips = [];
    u.fades = [];
    if (u.kind !== 'video') u.fades.push(el);
    if (el.hasAttribute('data-gl-clip')) u.clips.push({ el, x: false, y: false, ins: true, r: 0 });
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const ps = getComputedStyle(p);
      const x = ps.overflowX !== 'visible';
      const y = ps.overflowY !== 'visible';
      const ins = p.hasAttribute('data-gl-clip');
      if (x || y || ins) u.clips.push({ el: p, x, y, ins, r: x && y ? parseFloat(ps.borderTopLeftRadius) || 0 : 0 });
      if (p.hasAttribute('data-gl-fade')) u.fades.push(p);
    }
    const iv = el.closest('[data-gl-inv]');
    u.inv = iv ? iv.dataset.glInv : 'page';
    const z = el.closest('[data-gl-z]');
    u.z = z ? +z.dataset.glZ : 0;
    u.fit = cs.objectFit;
    u.radius = parseFloat(cs.borderTopLeftRadius) || 0;
    u.colA = u.kind === 'box' ? parseColor(cs.getPropertyValue('--box')) : parseColor(cs.color);
    u.colB = el.dataset.glAlt ? parseColor(el.dataset.glAlt) : swap(u.colA);
  }

  function rasterText(u) {
    const el = u.el;
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize) || 16;
    const font = `${cs.fontStyle} ${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
    let text = el.textContent.replace(/\s+/g, ' ').trim();
    if (cs.textTransform === 'uppercase') text = text.toUpperCase();
    else if (cs.textTransform === 'lowercase') text = text.toLowerCase();
    const lw = el.offsetWidth;
    const lh = el.offsetHeight;
    if (!lw || !lh || !text) {
      u.tex = null;
      u.key = null;
      return;
    }
    const ls = cs.letterSpacing === 'normal' ? 0 : parseFloat(cs.letterSpacing) || 0;
    const key = `t|${font}|${ls}|${lw}x${lh}|${dpr}|${text}`;
    if (u.key === key && u.tex) return;
    u.key = key;
    let e = cache.get(key);
    if (!e) {
      const padX = Math.ceil(fs * 0.3);
      const padY = Math.ceil(fs * 0.4);
      const cw = lw + padX * 2;
      const ch = lh + padY * 2;
      const c = document.createElement('canvas');
      c.width = Math.ceil(cw * dpr);
      c.height = Math.ceil(ch * dpr);
      const x = c.getContext('2d');
      x.scale(dpr, dpr);
      x.font = font;
      if ('letterSpacing' in x) x.letterSpacing = ls + 'px';
      x.textBaseline = 'alphabetic';
      x.fillStyle = '#fff';
      const m = x.measureText('Hg');
      const A = m.fontBoundingBoxAscent !== undefined ? m.fontBoundingBoxAscent : m.actualBoundingBoxAscent;
      const D = m.fontBoundingBoxDescent !== undefined ? m.fontBoundingBoxDescent : m.actualBoundingBoxDescent;
      const base = (lh - (A + D)) / 2 + A;
      x.fillText(text, padX, padY + base);
      e = { tex: makeTex(c, true), w: cw, h: ch, padX, padY, lw, lh };
      cache.set(key, e);
    }
    u.tex = e;
  }

  function rasterLogo(u) {
    const lw = u.el.offsetWidth;
    const lh = u.el.offsetHeight;
    if (!lw || !lh) return;
    /* data-path + data-vb="w h" draw another shape (e.g. the back arrow); default is the oh mark */
    const d = u.el.dataset.path || OH.LOGO.d;
    const vb = u.el.dataset.vb ? u.el.dataset.vb.split(' ').map(Number) : [OH.LOGO.w, OH.LOGO.h];
    const key = `l|${lw}x${lh}|${dpr}|${u.el.dataset.path ? d.length + ':' + d.slice(0, 24) : 'logo'}`;
    if (u.key === key && u.tex) return;
    u.key = key;
    let e = cache.get(key);
    if (!e) {
      const c = document.createElement('canvas');
      c.width = Math.ceil(lw * dpr);
      c.height = Math.ceil(lh * dpr);
      const x = c.getContext('2d');
      x.scale(c.width / vb[0], c.height / vb[1]);
      x.fillStyle = '#fff';
      x.fill(u.el.dataset.path ? new Path2D(d) : logoPath || (logoPath = new Path2D(d)));
      e = { tex: makeTex(c, true), w: lw, h: lh, padX: 0, padY: 0, lw, lh };
      cache.set(key, e);
    }
    u.tex = e;
  }

  function ensureImage(u) {
    const el = u.el;
    const src = el.currentSrc || el.src;
    const key = 'i|' + src;
    if (u.key === key && u.tex) return true;
    if (!el.complete || !el.naturalWidth) return false;
    let e = cache.get(key);
    let fresh = false;
    if (!e) {
      e = { tex: makeTex(el, true), w: el.naturalWidth, h: el.naturalHeight };
      cache.set(key, e);
      fresh = true;
    }
    u.key = key;
    u.tex = e;
    u.fadeIn = fresh && !el.hasAttribute('data-gl-nofade') ? 0 : 1;
    return true;
  }

  function updateVideo(u) {
    const v = u.el;
    if (v.readyState < 2 || !v.videoWidth) return false;
    if (!u.vt) {
      u.vt = { tex: gl.createTexture(), w: v.videoWidth, h: v.videoHeight };
      gl.bindTexture(gl.TEXTURE_2D, u.vt.tex);
      texParams(false);
      u.vtLast = -1;
      u.fadeIn = 0;
    }
    if (v.currentTime !== u.vtLast) {
      gl.bindTexture(gl.TEXTURE_2D, u.vt.tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, v);
      u.vtLast = v.currentTime;
    }
    if (v.paused && v.autoplay && !u.playTried) {
      u.playTried = true;
      v.play().catch(() => {});
    }
    u.tex = u.vt;
    return true;
  }

  function prep(u) {
    if (u.kind === 'text') rasterText(u);
    else if (u.kind === 'logo') rasterLogo(u);
    else if (u.kind === 'img') ensureImage(u);
  }

  function drop(u) {
    if (u.vt) gl.deleteTexture(u.vt.tex);
    u.vt = null;
  }

  function evict() {
    const used = new Set();
    for (const u of units.values()) if (u.key) used.add(u.key);
    for (const [k, e] of cache) {
      if (!used.has(k)) {
        gl.deleteTexture(e.tex);
        cache.delete(k);
      }
    }
  }

  /* ---------- effects state (pointer lens, scroll bow, carousel bow, ripple) ---------- */
  function effects(dt) {
    const s = dt;
    const t = dt * 60;
    const d = Math.hypot(st.px - st.lpx, st.py - st.lpy);
    st.lpx = st.px;
    st.lpy = st.py;
    st.ex = s > 0 && s <= 0.1 ? 0.5 * st.ex + (d / s) * 0.5 : 0;
    if (st.ex < 1) st.ex = 0;
    const h = Math.pow(Math.min(st.ex / 2000, 1), 3);
    st.eb += (h - st.eb) * (1 - Math.pow(0.9, t));
    if (h === 0 && st.eb < 0.01) st.eb = 0;

    const sy = window.scrollY;
    const p = sy - st.lastScroll;
    st.lastScroll = sy;
    st.eM = s > 0 && s <= 0.1 ? 0.6 * st.eM + (p / s) * 0.4 : 0;
    const v = clamp(st.eM / 2200, -1, 1);
    st.eS += (v - st.eS) * (1 - Math.pow(1 - (Math.abs(v) > Math.abs(st.eS) ? 0.3 : 0.08), t));
    if (v === 0 && Math.abs(st.eS) < 0.01) st.eS = 0;

    const ax = GL.axis.axis;
    const E = GL.axis.v || 0;
    const y = ax ? clamp((Math.sign(E) * Math.max(Math.abs(E) - (ax === 'x' ? 260 : 0), 0)) / (ax === 'x' ? 900 : 220), -1, 1) : 0;
    st.eP += (y - st.eP) * (1 - Math.pow(1 - (Math.abs(y) > Math.abs(st.eP) ? 0.3 : 0.08), t));
    if (y === 0 && Math.abs(st.eP) < 0.01) st.eP = 0;
  }

  function readPulse() {
    if (!st.pulse) return null;
    const e = (performance.now() - st.pulse.t0) / 1000;
    if (e < 0 || e > 0.9) {
      st.pulse = null;
      return null;
    }
    const t = Math.min(e / 0.06, 1);
    const o = 1 - clamp((e - 0.06) / 0.84, 0, 1);
    return { x: st.pulse.x, y: st.pulse.y, radius: 80 + 400 * (1 - Math.pow(1 - e / 0.9, 3)), width: 0.32, amp: FX.pulse * t * o * o };
  }

  /* ---------- frame ---------- */
  function draw(dt) {
    effects(dt);

    const rc = new Map();
    const oc = new Map();
    const ic = new Map();
    const R = (el) => {
      let r = rc.get(el);
      if (!r) {
        r = el.getBoundingClientRect();
        rc.set(el, r);
      }
      return r;
    };
    const O = (el) => {
      let o = oc.get(el);
      if (o === undefined) {
        o = parseFloat(getComputedStyle(el).opacity);
        if (isNaN(o)) o = 1;
        oc.set(el, o);
      }
      return o;
    };
    const I = (el) => {
      let r = ic.get(el);
      if (!r) {
        r = insetOf(el, R(el));
        ic.set(el, r);
      }
      return r;
    };

    const inv = {};
    for (const k in GL.inv) {
      const el = GL.inv[k];
      if (!el || !el.isConnected) continue;
      const r = el.hasAttribute('data-gl-clip') ? I(el) : R(el);
      const w = r.right - r.left;
      const h = r.bottom - r.top;
      if (w > 0.5 && h > 0.5) inv[k] = [r.left, r.top, w, h];
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.viewport(0, 0, cv.width, cv.height);
    gl.clearColor(BG[0], BG[1], BG[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const u = pPlane.u;
    gl.useProgram(pPlane.p);
    gl.bindVertexArray(vao);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform2f(u.uRes, W, H);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, dummy);
    gl.uniform1i(u.uTex, 0);

    for (const un of list) {
      const el = un.el;
      if (!el.isConnected) continue;
      const k = un.kind;
      if (k === 'img') {
        if (!ensureImage(un)) continue;
      } else if (k === 'video') {
        if (!updateVideo(un)) continue;
      } else if ((k === 'text' || k === 'logo') && !un.tex) continue;

      const r = R(el);
      if (r.width < 0.5 || r.height < 0.5) continue;

      let x0 = 0;
      let y0 = 0;
      let x1 = W;
      let y1 = H;
      let cr = 0;
      for (const c of un.clips) {
        const b = c.ins ? I(c.el) : R(c.el);
        if (c.x || c.ins) {
          if (b.left > x0) x0 = b.left;
          if (b.right < x1) x1 = b.right;
        }
        if (c.y || c.ins) {
          if (b.top > y0) y0 = b.top;
          if (b.bottom < y1) y1 = b.bottom;
        }
        if (!cr && c.r) cr = c.r;
        if (x1 <= x0 || y1 <= y0) break;
      }
      if (x1 <= x0 || y1 <= y0) continue;

      let qx = r.left;
      let qy = r.top;
      let qw = r.width;
      let qh = r.height;
      let u0 = 0;
      let v0 = 0;
      let uw = 1;
      let vh = 1;
      let mode = 2;
      if (k === 'text' || k === 'logo') {
        const e = un.tex;
        const sx = r.width / e.lw;
        const sy = r.height / e.lh;
        qx -= e.padX * sx;
        qy -= e.padY * sy;
        qw = (e.lw + 2 * e.padX) * sx;
        qh = (e.lh + 2 * e.padY) * sy;
        mode = 1;
      } else if (k === 'img' || k === 'video') {
        const e = un.tex;
        if (un.fit === 'contain') {
          const s = Math.min(qw / e.w, qh / e.h);
          const dw = e.w * s;
          const dh = e.h * s;
          qx += (qw - dw) / 2;
          qy += (qh - dh) / 2;
          qw = dw;
          qh = dh;
        } else {
          const s = Math.max(qw / e.w, qh / e.h);
          uw = qw / s / e.w;
          vh = qh / s / e.h;
          u0 = (1 - uw) / 2;
          v0 = (1 - vh) / 2;
        }
        mode = 0;
      }
      if (qx > x1 || qy > y1 || qx + qw < x0 || qy + qh < y0) continue;

      let alpha = 1;
      for (const f of un.fades) {
        alpha *= O(f);
        if (alpha <= 0.003) break;
      }
      if (un.fadeIn < 1) {
        un.fadeIn = Math.min(1, un.fadeIn + dt / 0.6);
        alpha *= 1 - Math.pow(1 - un.fadeIn, 3);
      }
      if (alpha <= 0.003) continue;

      let cA = un.colA;
      if (k === 'box') cA = parseColor(getComputedStyle(el).getPropertyValue('--box'));

      gl.uniform4f(u.uRect, qx, qy, qw, qh);
      gl.uniform4f(u.uClip, x0, y0, x1 - x0, y1 - y0);
      gl.uniform1f(u.uClipR, cr);
      gl.uniform1i(u.uMode, mode);
      gl.uniform4f(u.uUv, u0, v0, uw, vh);
      gl.uniform1f(u.uAlpha, alpha);
      gl.uniform4fv(u.uColA, cA);
      gl.uniform4fv(u.uColB, un.colB);
      const iv = mode === 1 ? inv[un.inv] : null;
      if (iv) gl.uniform4f(u.uInv, iv[0], iv[1], iv[2], iv[3]);
      else gl.uniform4f(u.uInv, 0, 0, 0, 0);
      if (mode === 2) {
        gl.uniform2f(u.uSize, qw, qh);
        gl.uniform1f(u.uRadius, un.radius * (qw / (el.offsetWidth || qw)));
        gl.bindTexture(gl.TEXTURE_2D, dummy);
      } else {
        gl.bindTexture(gl.TEXTURE_2D, un.tex.tex);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    /* post pass */
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.disable(gl.BLEND);
    gl.viewport(0, 0, cv.width, cv.height);
    const q = pPost.u;
    gl.useProgram(pPost.p);
    const calm = reduce.matches;
    const pl = calm ? null : readPulse();
    const ax = GL.axis.axis;
    gl.uniform2f(q.uRes, W, H);
    gl.uniform2f(q.uPointer, st.px, st.py);
    gl.uniform1f(q.uRadius, 520 * clamp(Math.max(W, H) / 1440, 0.6, 1.3));
    gl.uniform1f(q.uStrength, calm ? 0 : FX.lens * st.eb);
    gl.uniform1f(q.uCurve, calm ? 0 : FX.bow * st.eS + (ax === 'y' ? FX.bow * st.eP : 0));
    gl.uniform1f(q.uCurveX, calm ? 0 : ax === 'x' ? FX.bow * st.eP : 0);
    gl.uniform1f(q.uEdge, 90);
    gl.uniform2f(q.uPulse, pl ? pl.x : 0, pl ? pl.y : 0);
    gl.uniform1f(q.uPulseRadius, pl ? pl.radius : 0);
    gl.uniform1f(q.uPulseWidth, pl ? pl.width : 0);
    gl.uniform1f(q.uPulseAmp, pl ? pl.amp : 0);
    gl.uniform1i(q.uTex, 0);
    gl.bindTexture(gl.TEXTURE_2D, fboTex);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindTexture(gl.TEXTURE_2D, dummy);
  }

  /* ---------- public ---------- */
  const GL = (OH.GL = {
    ok: false,
    on: false,
    inv: {},
    axis: { axis: null, v: 0 },

    init(canvas) {
      if (location.protocol === 'file:') return false; // textures from file:// are blocked by the browser
      cv = canvas;
      try {
        gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false, premultipliedAlpha: true, powerPreference: 'high-performance' });
      } catch (e) {
        gl = null;
      }
      if (!gl) return false;
      pPlane = program(VS_PLANE, FS_PLANE, ['uRes', 'uRect', 'uTex', 'uMode', 'uUv', 'uClip', 'uClipR', 'uSize', 'uRadius', 'uAlpha', 'uColA', 'uColB', 'uInv']);
      pPost = program(VS_POST, FS_POST, ['uRes', 'uTex', 'uPointer', 'uRadius', 'uStrength', 'uCurve', 'uCurveX', 'uEdge', 'uPulse', 'uPulseRadius', 'uPulseWidth', 'uPulseAmp']);
      if (!pPlane || !pPost) {
        gl = null;
        return false;
      }
      const rs = getComputedStyle(document.documentElement);
      const a = parseColor(rs.getPropertyValue('--accent'));
      const b = parseColor(rs.getPropertyValue('--bg'));
      if (a[3]) ACC = a;
      if (b[3]) BG = b;
      vao = gl.createVertexArray();
      dummy = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, dummy);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
      fboTex = gl.createTexture();
      fbo = gl.createFramebuffer();
      canvas.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        GL.disable();
      });
      st.lastScroll = window.scrollY;
      this.ok = true;
      this.resize();
      return true;
    },

    resize() {
      if (!gl) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth || window.innerWidth;
      H = cv.clientHeight || window.innerHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      gl.bindTexture(gl.TEXTURE_2D, fboTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, cv.width, cv.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      texParams(false);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fboTex, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    },

    /* (re)collect the [data-gl] elements of the active page + global UI */
    build() {
      if (!gl) return;
      try {
        const els = [...document.querySelectorAll('[data-gl]')].filter((el) => !el.closest('.page:not(.is-active)'));
        const keep = new Set(els);
        for (const [el, u] of units) {
          if (!keep.has(el)) {
            drop(u);
            units.delete(el);
          }
        }
        els.forEach((el, i) => {
          let u = units.get(el);
          if (!u) {
            u = { el, key: null, tex: null, fadeIn: 1 };
            units.set(el, u);
          }
          u.order = i;
          meta(u);
          prep(u);
        });
        list = [...units.values()].sort((a, b) => a.z - b.z || a.order - b.order);
        evict();
      } catch (err) {
        console.warn('[gl] disabled:', err);
        this.disable();
      }
    },

    enable() {
      if (!this.ok) return false;
      this.on = true;
      document.documentElement.classList.add('gl-on');
      document.documentElement.classList.remove('no-gl');
      return true;
    },

    disable() {
      this.on = false;
      this.ok = false;
      document.documentElement.classList.remove('gl-on');
      document.documentElement.classList.add('no-gl');
    },

    render(dt) {
      if (!this.on) return;
      try {
        draw(dt);
      } catch (err) {
        console.warn('[gl] disabled:', err);
        this.disable();
      }
    },

    pointer(x, y) {
      st.px = x;
      st.py = y;
      if (!st.has) {
        st.has = true;
        st.lpx = x;
        st.lpy = y;
      }
    },

    pulse(x, y) {
      st.pulse = { x, y, t0: performance.now() };
    },

    resetScroll() {
      st.lastScroll = window.scrollY;
      st.eM = 0;
      st.eS = 0;
    },

    fx: FX,
    stats() {
      return { units: list.length, textures: cache.size, on: this.on, eb: st.eb, eS: st.eS, eP: st.eP };
    }
  });
})();
