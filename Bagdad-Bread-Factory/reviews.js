/* =========================================================
   BAGDAD BREAD FACTORY — CUSTOMER REVIEWS
========================================================= */

(function () {
  "use strict";

  function openReviewForm() {
    const modal = document.getElementById("reviewModal");
    if (!modal) return;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    const nameInput = document.getElementById("reviewName");
    if (nameInput) {
      setTimeout(() => nameInput.focus(), 50);
    }

    document.body.style.overflow = "hidden";
  }

  function closeReviewForm() {
    const modal = document.getElementById("reviewModal");
    if (!modal) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  window.openReviewForm = openReviewForm;
  window.closeReviewForm = closeReviewForm;

  document.addEventListener("DOMContentLoaded", function () {
    const slider = document.getElementById("reviewGrid");
    const dotsBox = document.getElementById("reviewDots");
    const prev = document.querySelector(".review-prev");
    const next = document.querySelector(".review-next");
    const form = document.getElementById("reviewForm");

    if (!slider) return;

    let cards = Array.from(slider.querySelectorAll(".review-card"));
    let current = 0;
    let timer = null;

    function cardWidth() {
      const card = slider.querySelector(".review-card");
      if (!card) return slider.clientWidth;
      return card.getBoundingClientRect().width + 22;
    }

    function goTo(index, smooth = true) {
      if (!cards.length) return;

      current = (index + cards.length) % cards.length;

      slider.scrollTo({
        left: cards[current].offsetLeft - 5,
        behavior: smooth ? "smooth" : "auto"
      });

      updateDots();
    }

    function updateDots() {
      if (!dotsBox) return;

      Array.from(dotsBox.children).forEach((dot, index) => {
        dot.classList.toggle("active", index === current);
      });
    }

    function createDots() {
      if (!dotsBox) return;

      dotsBox.innerHTML = "";

      cards.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "review-dot";
        dot.setAttribute("aria-label", "Show review " + (index + 1));

        dot.addEventListener("click", function () {
          goTo(index);
          restartAutoSlide();
        });

        dotsBox.appendChild(dot);
      });

      updateDots();
    }

    function nextReview() {
      goTo(current + 1);
    }

    function previousReview() {
      goTo(current - 1);
    }

    function stopAutoSlide() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function startAutoSlide() {
      stopAutoSlide();

      if (cards.length > 1) {
        timer = setInterval(nextReview, 5000);
      }
    }

    function restartAutoSlide() {
      startAutoSlide();
    }

    if (next) {
      next.addEventListener("click", function () {
        nextReview();
        restartAutoSlide();
      });
    }

    if (prev) {
      prev.addEventListener("click", function () {
        previousReview();
        restartAutoSlide();
      });
    }

    slider.addEventListener("mouseenter", stopAutoSlide);
    slider.addEventListener("mouseleave", startAutoSlide);

    let scrollTimer;

    slider.addEventListener("scroll", function () {
      clearTimeout(scrollTimer);

      scrollTimer = setTimeout(function () {
        const left = slider.scrollLeft;
        let closest = 0;
        let distance = Infinity;

        cards.forEach(function (card, index) {
          const d = Math.abs((card.offsetLeft - 5) - left);

          if (d < distance) {
            distance = d;
            closest = index;
          }
        });

        current = closest;
        updateDots();
      }, 80);
    });

    /* Add a newly submitted website review to the slider. */
    function addLocalReview(name, rating, text) {
      const card = document.createElement("article");
      card.className = "review-card";

      const stars =
        "★".repeat(rating) +
        "☆".repeat(5 - rating);

      const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word.charAt(0).toUpperCase())
        .join("");

      card.innerHTML = `
        <div class="review-card-top">
          <div class="review-avatar">${initials || "U"}</div>
          <div class="review-user">
            <strong></strong>
            <span>Website Review · Just now</span>
          </div>
        </div>

        <div class="review-stars">${stars}</div>

        <p></p>

        <div class="review-footer">
          <span>Website customer review</span>
          <span>♥</span>
        </div>
      `;

      card.querySelector(".review-user strong").textContent = name;
      card.querySelector(".review-card p").textContent = "“" + text + "”";

      slider.prepend(card);

      cards = Array.from(slider.querySelectorAll(".review-card"));
      current = 0;

      createDots();
      goTo(0, false);
      startAutoSlide();
    }

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("reviewName").value.trim();
        const rating = Number(document.getElementById("reviewRating").value);
        const text = document.getElementById("reviewText").value.trim();

        if (!name || !text || !rating) return;

        addLocalReview(name, rating, text);

        form.reset();
        closeReviewForm();
      });
    }

    document.addEventListener("keydown", function (event) {
      const modal = document.getElementById("reviewModal");

      if (event.key === "Escape" && modal && modal.classList.contains("is-open")) {
        closeReviewForm();
      }

      if (event.key === "ArrowRight") {
        nextReview();
        restartAutoSlide();
      }

      if (event.key === "ArrowLeft") {
        previousReview();
        restartAutoSlide();
      }
    });

    createDots();
    startAutoSlide();

    // Keep slider sizing correct after orientation/resize changes.
    window.addEventListener("resize", function () {
      goTo(current, false);
    });
  });
})();
