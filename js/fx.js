/* DarkvoyagerLabs — motion layer.
   GSAP + ScrollTrigger + Lenis (all self-hosted in js/vendor).
   Everything here is progressive: with reduced-motion or if a library
   fails to load, the page simply shows its final state. */
(function(){
  'use strict';
  var d = document.documentElement;
  var $  = function(s,c){ return (c||document).querySelector(s); };
  var $$ = function(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine   = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var SPOT = '.project-card,.hub-card,.about-card,.connect-card,.donate-item,.contribute-item,.sp-box,.project-side-box';

  function run(){
    spotlight();
    navIndicator();
    $$('.search-suggestions').forEach(function(e){ e.setAttribute('data-lenis-prevent',''); });

    if (reduce || !window.gsap || !window.ScrollTrigger){
      window.__fxOk = true; d.classList.remove('fx'); return;
    }
    window.__fxOk = true;
    gsap.registerPlugin(ScrollTrigger);

    smoothScroll();
    ambient();
    progressBar();
    var titles = splitTitles();
    prepScroll();
    if (window.__dvReady) intro(titles); else document.addEventListener('dv:ready', function(){ intro(titles); }, { once:true });
    window.addEventListener('load', function(){ ScrollTrigger.refresh(); });
  }

  /* ---------- smooth scroll ---------- */
  function smoothScroll(){
    if (!window.Lenis) return;
    var lenis = new Lenis({ lerp:.085, wheelMultiplier:.95, smoothWheel:true });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function(t){ lenis.raf(t*1000); });
    gsap.ticker.lagSmoothing(0);
    document.addEventListener('click', function(e){
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href').length < 2) return;
      var t = $(a.getAttribute('href')); if (!t) return;
      e.preventDefault(); lenis.scrollTo(t, { offset:-90 });
    });
  }

  /* ---------- ambient glow + progress ---------- */
  function ambient(){
    var el = document.createElement('div'); el.className = 'ambient'; el.setAttribute('aria-hidden','true');
    el.innerHTML = '<b><i></i></b><b><i></i></b>'; document.body.prepend(el);
    gsap.to('.ambient b:nth-child(1) i', { x:'28vw', y:'70vh', ease:'none', scrollTrigger:{ start:0, end:'max', scrub:1.6 } });
    gsap.to('.ambient b:nth-child(2) i', { x:'-30vw', y:'-60vh', ease:'none', scrollTrigger:{ start:0, end:'max', scrub:1.6 } });
    if (fine){
      var bs = $$('.ambient b').map(function(b,i){ return { x:gsap.quickTo(b,'x',{duration:2.2,ease:'power3'}), y:gsap.quickTo(b,'y',{duration:2.2,ease:'power3'}), k:i?-1:1 }; });
      addEventListener('pointermove', function(e){
        var nx = e.clientX/innerWidth - .5, ny = e.clientY/innerHeight - .5;
        bs.forEach(function(b){ b.x(nx*110*b.k); b.y(ny*110*b.k); });
      }, { passive:true });
    }
  }
  function progressBar(){
    var p = document.createElement('div'); p.className = 'scroll-progress'; p.innerHTML = '<i></i>'; document.body.appendChild(p);
    gsap.to('.scroll-progress i', { scaleX:1, ease:'none', scrollTrigger:{ start:0, end:'max', scrub:.3 } });
  }

  /* ---------- nav sliding highlight ---------- */
  function navIndicator(){
    var wrap = $('.nav-links'); if (!wrap) return;
    var links = $$('.nav-link', wrap);
    if (!$('.nav-link.is-active', wrap) && /project-covers/.test(location.pathname)){
      var pl = links.filter(function(l){ return /projects\.html$/.test(l.getAttribute('href')); })[0];
      if (pl) pl.classList.add('is-active');
    }
    var ind = document.createElement('span'); ind.className = 'nav-indicator'; wrap.prepend(ind);
    function go(el, instant){
      if (!el){ ind.style.opacity = 0; return; }
      var w = wrap.getBoundingClientRect(), r = el.getBoundingClientRect();
      if (instant) ind.style.transition = 'none';
      ind.style.width = r.width + 'px'; ind.style.transform = 'translateX(' + (r.left - w.left) + 'px)'; ind.style.opacity = 1;
      if (instant){ ind.offsetWidth; ind.style.transition = ''; }
    }
    function home(i){ go($('.nav-link.is-active', wrap), i); }
    links.forEach(function(l){ l.addEventListener('pointerenter', function(){ go(l); }); l.addEventListener('focus', function(){ go(l); }); });
    wrap.addEventListener('pointerleave', function(){ home(); });
    wrap.addEventListener('focusout', function(){ home(); });
    addEventListener('resize', function(){ home(true); });
    home(true);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ home(true); });
  }

  /* ---------- split text ---------- */
  function split(el){
    if (el.dataset.split) return [];
    var txt = el.textContent.trim().replace(/\s+/g,' ');
    el.setAttribute('aria-label', txt); el.dataset.split = '1'; el.textContent = '';
    var inners = [];
    txt.split(' ').forEach(function(w,i,a){
      var o = document.createElement('span'); o.className = 'sw'; o.setAttribute('aria-hidden','true');
      var n = document.createElement('span'); n.className = 'sw-i'; n.textContent = w; o.appendChild(n); el.appendChild(o); inners.push(n);
      if (i < a.length-1) el.appendChild(document.createTextNode(' '));
    });
    gsap.set(inners, { yPercent:115 });
    el.classList.add('is-split');
    return inners;
  }
  function splitTitles(){
    var out = [];
    $$('.hero-tagline,.slim-header h1,.page-banner-content h1,.project-main h1,.thanks-shell h1').forEach(function(h){
      out = out.concat(split(h));
    });
    return out;
  }

  /* ---------- load sequence ---------- */
  function intro(titles){
    var tl = gsap.timeline({ defaults:{ ease:'expo.out' } });
    tl.fromTo('.site-nav', { y:-56, opacity:0 }, { y:0, opacity:1, duration:1.3, clearProps:'transform' }, 0);
    var hero = $('.hero');
    if (hero) tl.fromTo(hero, { clipPath:'inset(0% 0% 100% 0% round 34px)' }, { clipPath:'inset(0% 0% 0% 0% round 34px)', duration:1.5, ease:'expo.inOut', clearProps:'clipPath' }, 0);
    var pb = $('.page-banner');
    if (pb) tl.fromTo(pb, { clipPath:'inset(0% 0% 100% 0% round 34px)' }, { clipPath:'inset(0% 0% 0% 0% round 34px)', duration:1.5, ease:'expo.inOut', clearProps:'clipPath' }, 0);
    var pm = $('.project-hero-media');
    if (pm) tl.fromTo(pm, { clipPath:'inset(0% 0% 100% 0% round 32px)' }, { clipPath:'inset(0% 0% 0% 0% round 32px)', duration:1.5, ease:'expo.inOut', clearProps:'clipPath' }, .1);
    if (titles.length) tl.to(titles, { yPercent:0, duration:1.5, stagger:.11 }, .45);
    var rest = $$('.hero-sub,.slim-header p,.page-banner-content p,.hero-dots');
    if (rest.length) tl.fromTo(rest, { y:30, opacity:0 }, { y:0, opacity:1, duration:1.3, stagger:.1, clearProps:'transform' }, 1);
    var sw = $('.search-wrap');
    if (sw) tl.fromTo(sw, { y:44, opacity:0 }, { y:0, opacity:1, duration:1.3, clearProps:'transform' }, 1.15);
    var aboutFirst = $('.about-intro .wd');
    if (aboutFirst) tl.fromTo($$('.wd', $('.about-intro')), { opacity:0, y:26 }, { opacity:1, y:0, duration:1.1, stagger:.06, clearProps:'transform' }, .6);
    tl.add(function(){ ScrollTrigger.refresh(); });
  }

  /* ---------- scroll choreography ---------- */
  function reveal(sel, from, to){
    var els = $$(sel); if (!els.length) return;
    gsap.set(els, from);
    ScrollTrigger.batch(els, {
      start:'top 94%', once:true,
      onEnter:function(b){ gsap.to(b, Object.assign({ duration:1.3, stagger:.09, ease:'expo.out', overwrite:true, clearProps:'transform,opacity,clipPath' }, to)); }
    });
  }

  function prepScroll(){
    /* hero recedes into a smaller rounded card as you scroll away */
    var hero = $('.hero');
    if (hero){
      gsap.to(hero, { scale:.9, borderRadius:56, ease:'none', scrollTrigger:{ trigger:hero, start:'top top', end:'bottom top', scrub:true } });
      gsap.to('.hero-track', { yPercent:16, scale:1.1, ease:'none', scrollTrigger:{ trigger:hero, start:'top top', end:'bottom top', scrub:true } });
      gsap.to('.hero-content', { y:-110, opacity:0, ease:'none', scrollTrigger:{ trigger:hero, start:'top top', end:'62% top', scrub:true } });
    }
    var pb = $('.page-banner');
    if (pb){
      gsap.to(pb, { scale:.92, borderRadius:52, ease:'none', scrollTrigger:{ trigger:pb, start:'top top', end:'bottom top', scrub:true } });
      gsap.fromTo('.page-banner img', { yPercent:-6 }, { yPercent:6, ease:'none', scrollTrigger:{ trigger:pb, start:'top top', end:'bottom top', scrub:true } });
      gsap.to('.page-banner-content', { y:-60, opacity:0, ease:'none', scrollTrigger:{ trigger:pb, start:'top top', end:'80% top', scrub:true } });
    }
    var pm = $('.project-hero-media img');
    if (pm) gsap.fromTo(pm, { yPercent:-5 }, { yPercent:5, ease:'none', scrollTrigger:{ trigger:'.project-hero-media', start:'top bottom', end:'bottom top', scrub:true } });

    /* section headings: line-mask rise + drawn rule */
    $$('.cards-heading h2,.contribute-projects h2,.sp-box h2,.error-shell h2').forEach(function(h){
      var inn = split(h); if (!inn.length) return;
      gsap.to(inn, { yPercent:0, duration:1.4, stagger:.08, ease:'expo.out', scrollTrigger:{ trigger:h, start:'top 92%', once:true } });
    });
    $$('.cards-heading,.connect-more').forEach(function(el){
      gsap.fromTo(el, { '--rule':0 }, { '--rule':1, duration:1.6, ease:'expo.out', scrollTrigger:{ trigger:el, start:'top 92%', once:true } });
    });

    /* cards, tiles, fields */
    var cardFrom = { opacity:0, y:90, clipPath:'inset(16% 0% 0% 0% round 26px)' };
    var cardTo   = { opacity:1, y:0,  clipPath:'inset(0% 0% 0% 0% round 26px)' };
    reveal('.project-card', cardFrom, cardTo);
    reveal('.hub-card', { opacity:0, y:80, clipPath:'inset(14% 0% 0% 0% round 30px)' }, { opacity:1, y:0, clipPath:'inset(0% 0% 0% 0% round 30px)' });
    reveal('.connect-card', { opacity:0, y:80, clipPath:'inset(14% 0% 0% 0% round 30px)' }, { opacity:1, y:0, clipPath:'inset(0% 0% 0% 0% round 30px)' });
    reveal('.logo-tile', { opacity:0, y:30, scale:.8 }, { opacity:1, y:0, scale:1, stagger:.08 });
    reveal('.donate-item,.contribute-item,.sp-box,.form-field,.project-side-box', { opacity:0, y:60 }, { opacity:1, y:0, stagger:.07 });
    reveal('.project-shots img', { opacity:0, y:60, scale:.96 }, { opacity:1, y:0, scale:1 });
    reveal('.feedback-btn-wrap,.contribute-other,.donate-note,.form-note,.form-submit', { opacity:0, y:40 }, { opacity:1, y:0 });

    $$('.card-media img').forEach(function(img){
      var card = img.closest('.project-card');
      gsap.fromTo(img, { yPercent:-6 }, { yPercent:6, ease:'none', scrollTrigger:{ trigger:card, start:'top bottom', end:'bottom top', scrub:true } });
    });

    /* project filters re-render the grid: animate the fresh cards */
    $$('[data-card-grid="all"]').forEach(function(grid){
      new MutationObserver(function(){
        var cards = $$('.project-card', grid); if (!cards.length) return;
        gsap.fromTo(cards, { opacity:0, y:60, scale:.97 }, { opacity:1, y:0, scale:1, duration:1.1, stagger:.06, ease:'expo.out', clearProps:'transform,opacity' });
        $$('.card-media img', grid).forEach(function(img){
          gsap.fromTo(img, { yPercent:-6 }, { yPercent:6, ease:'none', scrollTrigger:{ trigger:img.closest('.project-card'), start:'top bottom', end:'bottom top', scrub:true } });
        });
        ScrollTrigger.refresh();
      }).observe(grid, { childList:true });
    });

    /* about page: words light up as you read */
    $$('.about-intro').forEach(function(p, idx){
      var words = p.textContent.trim().split(/\s+/);
      p.setAttribute('aria-label', words.join(' ')); p.textContent = '';
      var spans = words.map(function(w,i){
        var s = document.createElement('span'); s.className = 'wd'; s.setAttribute('aria-hidden','true'); s.textContent = w; p.appendChild(s);
        if (i < words.length-1) p.appendChild(document.createTextNode(' ')); return s;
      });
      if (idx === 0){ gsap.set(spans, { opacity:0 }); return; }
      gsap.fromTo(spans, { opacity:.14 }, { opacity:1, stagger:.12, duration:.4, ease:'none', scrollTrigger:{ trigger:p, start:'top 86%', end:'bottom 58%', scrub:true } });
    });
    var age = $('#age-value');
    if (age){
      var n = parseInt(age.textContent, 10);
      if (!isNaN(n)){
        var o = { v:0 }; age.textContent = '0';
        gsap.to(o, { v:n, duration:2, ease:'expo.out', scrollTrigger:{ trigger:age, start:'top 92%', once:true }, onUpdate:function(){ age.textContent = Math.round(o.v); } });
      }
    }
    reveal('.social-circle', { opacity:0, y:30, scale:.7 }, { opacity:1, y:0, scale:1, stagger:.08, ease:'back.out(2)' });

    var foot = $('.site-footer');
    if (foot) gsap.from(foot, { opacity:0, y:30, duration:1.2, ease:'expo.out', scrollTrigger:{ trigger:foot, start:'top 100%', once:true } });

    magnets();
  }

  /* ---------- magnetic buttons ---------- */
  function magnets(){
    if (!fine) return;
    $$('.hub-btn,.support-btn,.discord-btn,.feedback-btn,.error-btn,.ci-btn,.di-link,.form-submit,.carousel-arrow').forEach(function(el){
      var x = gsap.quickTo(el,'x',{ duration:.7, ease:'power3' }), y = gsap.quickTo(el,'y',{ duration:.7, ease:'power3' });
      el.addEventListener('pointermove', function(e){
        var r = el.getBoundingClientRect();
        x((e.clientX - r.left - r.width/2) * .3); y((e.clientY - r.top - r.height/2) * .3);
      });
      el.addEventListener('pointerleave', function(){ x(0); y(0); });
    });
  }

  /* ---------- spotlight (cursor-follow sheen on surfaces) ---------- */
  function spotlight(){
    if (!fine) return;
    document.addEventListener('pointermove', function(e){
      var el = e.target.closest && e.target.closest(SPOT); if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive:true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
