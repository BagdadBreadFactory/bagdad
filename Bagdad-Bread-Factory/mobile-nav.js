document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("mobileMenu");
  const nav = document.getElementById("mobileNav");
  if (!button || !nav) return;

  // Remove the old desktop-style Order Online item if an older cached HTML is used.
  nav.querySelectorAll("a").forEach(link => {
    if (link.textContent.trim().toLowerCase() === "order online") link.remove();
  });

  if (!nav.querySelector(".mobile-drawer-search")) {
    const searchWrap = document.createElement("form");
    searchWrap.className = "mobile-drawer-search";
    searchWrap.action = "menu.html";
    searchWrap.method = "get";
    searchWrap.setAttribute("role", "search");
    searchWrap.innerHTML = `
      <input type="search" name="q" placeholder="Search cakes, cookies, breads" aria-label="Search products">
      <button type="submit" aria-label="Search">⌕</button>`;
    nav.prepend(searchWrap);
  }

  const closeMenu = () => {
    nav.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
    document.body.classList.remove("mobile-menu-open");
  };

  const openMenu = () => {
    nav.classList.add("open");
    button.setAttribute("aria-expanded", "true");
    document.body.classList.add("mobile-menu-open");
  };

  button.setAttribute("aria-expanded", "false");
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    nav.classList.contains("open") ? closeMenu() : openMenu();
  });

  nav.addEventListener("click", (event) => {
    // The X is CSS-only; clicking the dark empty right side closes the drawer.
    if (event.target === nav) closeMenu();
  });

  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("open")) return;
    if (!nav.contains(event.target) && event.target !== button) closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });

  // Mobile bottom bar — generated once so every page gets the same navigation.
  if (!document.querySelector(".mobile-bottom-nav")) {
    const bar = document.createElement("nav");
    bar.className = "mobile-bottom-nav";
    bar.setAttribute("aria-label", "Mobile navigation");
    bar.innerHTML = `
      <a href="index.html" aria-label="Home">
        <span class="mb-icon"><svg viewBox="0 0 48 48"><path d="M5 22 24 6l19 16"/><path d="M10 20v22h11V29h6v13h11V20"/></svg></span>
        <span class="mb-label">HOME</span>
      </a>
      <a href="menu.html" aria-label="Menu">
        <span class="mb-icon"><svg viewBox="0 0 48 48"><path d="M9 13h30M9 24h30M9 35h30"/><path d="M16 9v8M32 20v8M20 31v8"/></svg></span>
        <span class="mb-label">MENU</span>
      </a>
      <button type="button" class="mb-account" aria-label="Account">
        <span class="mb-icon"><svg viewBox="0 0 48 48"><circle cx="24" cy="15" r="8"/><path d="M8 41c1.5-9 7.5-14 16-14s14.5 5 16 14"/></svg></span>
        <span class="mb-label">ACCOUNT</span>
      </button>
      <a href="menu.html#cart" class="mb-cart" aria-label="Cart">
        <span class="mb-icon"><svg viewBox="0 0 48 48"><path d="M7 14h6l3 22h22l3-17H14"/><path d="M19 14a5 5 0 0 1 10 0"/><circle cx="20" cy="41" r="2"/><circle cx="35" cy="41" r="2"/></svg></span>
        <span class="mb-count" id="mobileCartCount">0</span>
        <span class="mb-label">CART</span>
      </a>
      <button type="button" class="mb-search" aria-label="Search">
        <span class="mb-icon"><svg viewBox="0 0 48 48"><circle cx="21" cy="21" r="12"/><path d="m30 30 10 10"/></svg></span>
        <span class="mb-label">SEARCH</span>
      </button>`;
    document.body.appendChild(bar);

    bar.querySelector(".mb-account")?.addEventListener("click", () => {
      document.getElementById("accountOpen")?.click();
    });

    bar.querySelector(".mb-search")?.addEventListener("click", () => {
      // On phones the desktop search is hidden; open the mobile drawer instead.
      if (!nav.classList.contains("open")) {
        nav.classList.add("open");
        button.setAttribute("aria-expanded", "true");
        document.body.classList.add("mobile-menu-open");
      }
      const search = nav.querySelector('.mobile-drawer-search input');
      if (search) {
        requestAnimationFrame(() => search.focus());
      } else {
        window.location.href = "menu.html";
      }
    });
  }

  // Keep the bottom cart badge synced with the existing header badge.
  const syncCart = () => {
    const source = document.getElementById("cartCount");
    const target = document.getElementById("mobileCartCount");
    if (source && target) target.textContent = source.textContent.trim() || "0";
  };
  syncCart();
  setInterval(syncCart, 700);

  // Phone performance: decode images asynchronously and lazy-load below-the-fold media.
  document.querySelectorAll("img").forEach((img, index) => {
    img.decoding = "async";
    if (index > 2 && !img.loading) img.loading = "lazy";
  });
});


// Bagdad Bread Factory opening-hours status: 7:00 AM–11:00 PM (Bangladesh time).
(function initOpeningHours(){
  const render = () => {
    const el = document.getElementById('bbfOpenStatus');
    if (!el) return;
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Dhaka', hour: 'numeric', minute: '2-digit', hour12: false
    }).formatToParts(new Date());
    const h = Number(parts.find(p => p.type === 'hour')?.value ?? 0);
    const m = Number(parts.find(p => p.type === 'minute')?.value ?? 0);
    const minutes = h * 60 + m;
    const open = minutes >= 7 * 60 && minutes < 23 * 60;
    el.classList.toggle('is-open', open);
    el.innerHTML = `
      <span class="bbf-status-dot" aria-hidden="true"></span>
      <span class="bbf-status-label">${open ? 'Open now' : 'Closed now'}</span>
      <span class="bbf-status-sep" aria-hidden="true">•</span>
      <span class="bbf-status-hours">${open ? 'Closes at 11:00 PM' : 'Opens at 7:00 AM'}</span>`;
  };
  render();
  setInterval(render, 30000);
})();
