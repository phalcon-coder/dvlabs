/* =========================================================
   DarkvoyagerLabs — shared behavior
   Handles: mobile nav toggle, scroll state, hero slider,
   search + suggestions, and the project detail modal.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initHero();
  initSearch();
  initModal();
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

function markActiveNavLink(){
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link, .nav-mobile-panel a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")){
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
        <div class="suggestion-item" data-id="${p.id}" role="option" tabindex="0">
          <img src="${p.images[0]}" alt="" loading="lazy">
          <div>
            <div class="s-name">${escapeHtml(p.name)}</div>
            <div class="s-type">${escapeHtml(p.type)} · ${escapeHtml(p.platform.join(", "))}</div>
          </div>
        </div>
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

  suggestBox.addEventListener("click", (e) => {
    const item = e.target.closest(".suggestion-item[data-id]");
    if (!item) return;
    const project = PROJECTS.find(p => p.id === item.dataset.id);
    if (project){
      suggestBox.classList.remove("is-open");
      input.value = project.name;
      window.dispatchEvent(new CustomEvent("open-project-modal", { detail: project.id }));
      // If a project grid exists on the page, also scroll to / filter to it.
      const card = document.querySelector(`.project-card[data-id="${project.id}"]`);
      if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  // Support deep-linking: ?project=<id> opens the modal on load.
  const params = new URLSearchParams(location.search);
  const deepLinkId = params.get("project");
  if (deepLinkId){
    window.dispatchEvent(new CustomEvent("open-project-modal", { detail: deepLinkId }));
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
    const limit = grid.dataset.limit ? parseInt(grid.dataset.limit, 10) : null;
    const list = limit ? PROJECTS.slice(0, limit) : PROJECTS;
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
}

function renderCards(grid, list){
  if (!list.length){
    grid.innerHTML = `<div class="cards-empty">No projects here yet — check back soon.</div>`;
    return;
  }
  grid.innerHTML = list.map(p => {
    const cta = getCta(p);
    return `
    <button class="project-card" data-id="${p.id}" type="button" aria-haspopup="dialog">
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
    </button>
  `;
  }).join("");

  grid.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("open-project-modal", { detail: card.dataset.id }));
    });
  });
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
      <a class="ci-btn" href="contribute-project.html?project=${encodeURIComponent(p.id)}">Contribute</a>
    </div>
  `).join("");
}

/* ---------- MODAL ---------- */
function initModal(){
  const overlay = document.querySelector(".modal-overlay");
  if (!overlay || typeof PROJECTS === "undefined") return;
  const box = overlay.querySelector(".modal-box");
  const closeBtn = overlay.querySelector(".modal-close");

  function open(id){
    const p = PROJECTS.find(pr => pr.id === id);
    if (!p) return;
    const cta = getCta(p);
    box.innerHTML = `
      <button class="modal-close" aria-label="Close">&times;</button>
      <img class="modal-hero" src="${p.images[0]}" alt="${escapeHtml(p.name)} cover art">
      <div class="modal-content">
        <h2>${escapeHtml(p.name)}</h2>
        <div class="modal-tags">
          <span>${escapeHtml(p.type)}</span>
          ${p.platform.map(pl => `<span>${escapeHtml(pl)}</span>`).join("")}
          <span>${"\u2605".repeat(Math.round(p.rating))}${"\u2606".repeat(5 - Math.round(p.rating))} ${p.rating.toFixed(1)}</span>
        </div>
        <p class="modal-desc">${escapeHtml(p.longDescription || p.description)}</p>
        ${p.images.length > 1 ? `<div class="modal-shots">${p.images.map(src => `<img src="${src}" alt="${escapeHtml(p.name)} screenshot" loading="lazy">`).join("")}</div>` : ""}
        <div class="modal-footer">
          <span class="card-price ${p.price === 0 ? 'is-free' : ''}">${p.price === 0 ? "Free" : "$" + p.price.toFixed(2)}</span>
          ${cta.disabled
            ? `<span class="dl-btn is-disabled">${cta.label}</span>`
            : `<a class="dl-btn" href="${p.download}" style="text-decoration:none;">${cta.label}</a>`}
        </div>
        <a href="feedback.html?project=${encodeURIComponent(p.id)}" style="font-family:var(--f-mono); font-size:.78rem; color:var(--cyan); border-bottom:1px dashed var(--cyan);">Leave feedback</a>
      </div>
    `;
    box.querySelector(".modal-close").addEventListener("click", close);
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    history.replaceState(null, "", `?project=${encodeURIComponent(id)}`);
  }

  function close(){
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    const url = new URL(location.href);
    url.searchParams.delete("project");
    history.replaceState(null, "", url.pathname);
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
  window.addEventListener("open-project-modal", (e) => open(e.detail));
}
