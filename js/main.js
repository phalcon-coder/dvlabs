document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initHero();
  initSearch();
  initCardGrids();
  initContributeList();
  markActiveNavLink();
});

/* ---------- NAV ---------- */
function initNav(){
  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const panel = document.querySelector(".nav-mobile-panel");

  if (nav){
    const onScroll = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && panel){
    toggle.addEventListener("click", () => {
      const open = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "\u2715" : "\u2261";
    });
    panel.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        panel.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "\u2261";
      });
    });
  }
}

/* Compares each nav link's fully-resolved URL against the current
   page, rather than comparing raw href strings — this makes it
   work correctly from both root pages (href="index.html") and
   nested pages like project-covers/<slug>/index.html
   (href="../../index.html"), since the browser resolves an
   anchor's .pathname for us. */
function markActiveNavLink(){
  document.querySelectorAll(".nav-link, .nav-mobile-panel a").forEach(link => {
    if (link.pathname === location.pathname){
      link.classList.add("is-active");
    }
  });
}

/* ---------- HERO SLIDER (index.html) ---------- */
function initHero(){
  const track = document.querySelector(".hero-track");
  const dotsWrap = document.querySelector(".hero-dots");
  if (!track) return;

  const slides = Array.from(track.children);
  const dots = dotsWrap ? Array.from(dotsWrap.children) : [];
  let index = 0;
  const total = slides.length;
  const INTERVAL = 4000;

  function show(i){
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle("is-active", di === index));
  }

  let timer = setInterval(() => show(index + 1), INTERVAL);

  const heroEl = document.querySelector(".hero");
  if (heroEl){
    heroEl.addEventListener("mouseenter", () => clearInterval(timer));
    heroEl.addEventListener("mouseleave", () => {
      timer = setInterval(() => show(index + 1), INTERVAL);
    });
  }

  show(0);
}

/* ---------- SEARCH ---------- */
function initSearch(){
  const input = document.querySelector(".search-field input");
  const suggestBox = document.querySelector(".search-suggestions");
  if (!input || !suggestBox || typeof PROJECTS === "undefined") return;

  function render(query){
    const q = query.trim().toLowerCase();
    if (!q){
      suggestBox.classList.remove("is-open");
      suggestBox.innerHTML = "";
      return;
    }
    const matches = PROJECTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q) ||
      p.platform.join(" ").toLowerCase().includes(q)
    ).slice(0, 8);

    if (matches.length === 0){
      suggestBox.innerHTML = `<div class="suggestion-empty">No projects match "${escapeHtml(query)}"</div>`;
    } else {
      suggestBox.innerHTML = matches.map(p => `
        <a class="suggestion-item" href="${projectUrl(p)}" role="option">
          <img src="${p.images[0]}" alt="" loading="lazy">
          <div>
            <div class="s-name">${escapeHtml(p.name)}</div>
            <div class="s-type">${escapeHtml(p.type)} · ${escapeHtml(p.platform.join(", "))}</div>
          </div>
        </a>
      `).join("");
    }
    suggestBox.classList.add("is-open");
  }

  input.addEventListener("input", (e) => render(e.target.value));
  input.addEventListener("focus", () => { if (input.value.trim()) suggestBox.classList.add("is-open"); });

  document.addEventListener("click", (e) => {
    if (!suggestBox.contains(e.target) && e.target !== input){
      suggestBox.classList.remove("is-open");
    }
  });

  // Support deep-linking from old links: ?project=<slug or id> redirects
  // straight to that project's own page.
  const params = new URLSearchParams(location.search);
  const deepLinkId = params.get("project");
  if (deepLinkId){
    const project = PROJECTS.find(p => p.slug === deepLinkId || p.id === deepLinkId);
    if (project) window.location.replace(projectUrl(project));
  }
}

function escapeHtml(str){
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- CARD GRIDS ---------- */
function initCardGrids(){
  document.querySelectorAll("[data-card-grid]").forEach(grid => {
    let list = PROJECTS;
    if (grid.dataset.ids){
      // Curated, ordered selection (e.g. index.html's featured picks).
      const ids = grid.dataset.ids.split(",").map(s => s.trim());
      list = ids.map(id => PROJECTS.find(p => p.id === id || p.slug === id)).filter(Boolean);
    } else if (grid.dataset.limit){
      list = PROJECTS.slice(0, parseInt(grid.dataset.limit, 10));
    }
    renderCards(grid, list);
  });

  // Sorting buttons on projects.html
  const sortBar = document.querySelector(".sort-bar");
  if (sortBar){
    const grid = document.querySelector("[data-card-grid='all']");
    sortBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".sort-btn");
      if (!btn) return;
      sortBar.querySelectorAll(".sort-btn").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.dataset.filter;
      const filtered = filter === "all" ? PROJECTS : PROJECTS.filter(p => p.type === filter);
      renderCards(grid, filtered);
    });
  }

  // Featured carousel (index.html) — runs after the featured grid is populated.
  initFeaturedCarousel();
}

function renderCards(grid, list){
  if (!list.length){
    grid.innerHTML = `<div class="cards-empty">No projects here yet — check back soon.</div>`;
    return;
  }
  grid.innerHTML = list.map(p => {
    const cta = getCta(p);
    return `
    <a class="project-card" href="${projectUrl(p)}" data-id="${p.id}">
      <div class="card-media">
        <img src="${p.images[0]}" alt="${escapeHtml(p.name)} cover art" loading="lazy">
        <span class="card-type-badge">${escapeHtml(p.type)}</span>
      </div>
      <div class="card-body">
        <h3>${escapeHtml(p.name)}</h3>
        <div class="card-meta"><span>${escapeHtml(p.platform.join(" / "))}</span></div>
        <p class="card-desc">${escapeHtml(p.description)}</p>
        <div class="card-rating">${"\u2605".repeat(Math.round(p.rating))}${"\u2606".repeat(5 - Math.round(p.rating))} ${p.rating.toFixed(1)}</div>
        <div class="card-footer">
          <span class="card-price ${p.price === 0 ? 'is-free' : ''}">${p.price === 0 ? "Free" : "$" + p.price.toFixed(2)}</span>
          <span class="dl-btn${cta.disabled ? ' is-disabled' : ''}">${cta.label}</span>
        </div>
      </div>
    </a>
  `;
  }).join("");
}

/* ---------- FEATURED CAROUSEL (index.html) ---------- */
function initFeaturedCarousel(){
  const viewport = document.querySelector(".featured-viewport");
  const track = document.querySelector(".cards-grid--carousel");
  if (!viewport || !track) return;

  const prevBtn = document.querySelector(".carousel-arrow--prev");
  const nextBtn = document.querySelector(".carousel-arrow--next");

  const AUTOPLAY_MS = 5000;   // stays static 5s between slides
  let index = 0;
  let timer = null;
  let isDragging = false;

  /* How far one "step" moves: one card width + the flex gap. */
  function stepWidth(){
    const card = track.querySelector(".project-card");
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function maxIndex(){
    const step = stepWidth();
    if (!step) return 0;
    const perView = Math.max(1, Math.floor(viewport.clientWidth / step));
    return Math.max(0, track.children.length - perView);
  }

  function goTo(i){
    const max = maxIndex();
    // wrap around for autoplay, clamp for manual
    index = i > max ? 0 : (i < 0 ? max : i);
    track.style.transform = `translateX(-${index * stepWidth()}px)`;
    syncArrows();
  }

  function syncArrows(){
    const max = maxIndex();
    if (prevBtn) prevBtn.disabled = index <= 0;
    if (nextBtn) nextBtn.disabled = index >= max;
  }

  function next(){ goTo(index + 1); }
  function prev(){ goTo(index - 1); }

  function startAutoplay(){
    stopAutoplay();
    timer = setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay(){
    if (timer) clearInterval(timer);
    timer = null;
  }

  if (nextBtn) nextBtn.addEventListener("click", () => { next(); startAutoplay(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { prev(); startAutoplay(); });

  /* --- mouse / touch drag --- */
  let startX = 0;
  let startTranslate = 0;

  function onDown(x){
    isDragging = true;
    startX = x;
    startTranslate = -index * stepWidth();
    track.style.transition = "none";
    stopAutoplay();
  }
  function onMove(x){
    if (!isDragging) return;
    const delta = x - startX;
    track.style.transform = `translateX(${startTranslate + delta}px)`;
  }
  function onUp(x){
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = "";       // restore CSS transition
    const delta = x - startX;
    const threshold = stepWidth() * 0.25;
    if (delta < -threshold) index++;
    else if (delta > threshold) index--;
    goTo(index);
    startAutoplay();
  }

  viewport.addEventListener("mousedown", e => onDown(e.clientX));
  window.addEventListener("mousemove", e => onMove(e.clientX));
  window.addEventListener("mouseup", e => onUp(e.clientX));

  viewport.addEventListener("touchstart", e => onDown(e.touches[0].clientX), { passive: true });
  viewport.addEventListener("touchmove", e => onMove(e.touches[0].clientX), { passive: true });
  viewport.addEventListener("touchend", e => onUp(e.changedTouches[0].clientX));

  /* pause while hovering so users can read */
  viewport.addEventListener("mouseenter", stopAutoplay);
  viewport.addEventListener("mouseleave", startAutoplay);

  /* keep position sane on resize */
  window.addEventListener("resize", () => goTo(index));

  goTo(0);
  startAutoplay();
}

/* ---------- CONTRIBUTE LIST (contribute.html) ---------- */
function initContributeList(){
  const list = document.querySelector("[data-contribute-list]");
  if (!list || typeof PROJECTS === "undefined") return;

  const openProjects = PROJECTS.filter(p => p.seekingContributors);

  if (!openProjects.length){
    list.innerHTML = `<div class="cards-empty">No projects are actively seeking help right now — check back soon, or reach out anyway below.</div>`;
    return;
  }

  list.innerHTML = openProjects.map(p => `
    <div class="contribute-item">
      <img src="${p.images[0]}" alt="" loading="lazy">
      <div class="ci-info">
        <div class="ci-type">${escapeHtml(p.type)}</div>
        <h3>${escapeHtml(p.name)}</h3>
        <div class="help-wanted">${escapeHtml(p.helpWanted || "Looking for contributors")}</div>
      </div>
      <a class="ci-btn" href="contribute-project.html?project=${encodeURIComponent(p.slug)}">Contribute</a>
    </div>
  `).join("");
}
