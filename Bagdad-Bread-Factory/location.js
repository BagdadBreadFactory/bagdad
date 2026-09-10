const branches = [
  {
    id: "main",
    name: "Main Branch",
    address: "Main Branch, Chattogram, Bangladesh",
    phone: "02-41380278",
    mapsUrl: "https://maps.app.goo.gl/NKFbwj58zuu4YN7y6"
  },
  {
    id: "oxygen",
    name: "Oxygen Branch",
    address: "Oxygen Branch, Chattogram, Bangladesh",
    phone: "02-41380248",
    mapsUrl: "https://maps.app.goo.gl/pvz3aNQf3xZUXjyh9"
  },
  {
    id: "nayer-hat",
    name: "Nayer Hat Branch",
    address: "Nayer Hat, Chattogram, Bangladesh",
    phone: "02-333375008",
    mapsUrl: "https://maps.app.goo.gl/kXf8zs2bVQuWteAw6"
  },
  {
    id: "jalalabad",
    name: "Jalalabad Branch",
    address: "Jalalabad, Chattogram, Bangladesh",
    phone: "02-41380278",
    mapsUrl: "https://maps.app.goo.gl/AVAFdyzVwzCGaF9K6"
  }
];

(function () {
  function renderBranches() {
    const list = document.getElementById("branchList");
    const mini = document.getElementById("branchMiniGrid");

    if (list) {
      list.innerHTML = branches.map((b, i) => `
        <article class="branch-card">
          <div class="branch-number">${String(i + 1).padStart(2, "0")}</div>
          <div class="branch-card-main">
            <span class="eyebrow">BAGDAD BREAD FACTORY</span>
            <h2>${b.name}</h2>
            <p>${b.address}</p>
            <strong>${b.phone}</strong>
          </div>
          <a class="map-link" target="_blank" rel="noopener noreferrer" href="${b.mapsUrl}">Open Maps ↗</a>
        </article>
      `).join("");
    }

    if (mini) {
      mini.innerHTML = branches.map(b => `
        <a class="branch-mini-card" target="_blank" rel="noopener noreferrer" href="${b.mapsUrl}">
          <span>📍</span>
          <div>
            <b>${b.name}</b>
            <small>${b.address}</small>
            <strong>${b.phone}</strong>
          </div>
          <em>↗</em>
        </a>
      `).join("");
    }

    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  // Note: the mobile hamburger menu is handled by mobile-nav.js (shared
  // across all pages). This file used to attach its own click handler on
  // the same button that just toggled the "open" class — on a real tap
  // BOTH handlers fired: this one opened the drawer, then mobile-nav.js's
  // handler read the now-open state and immediately closed it again. Net
  // effect: the menu button silently did nothing on phones on this page.
  // Removed; mobile-nav.js already covers this page.

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderBranches);
  } else {
    renderBranches();
  }
})();
