(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-mobile-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector('input[name="q"]');
        if (!input || !input.value.trim()) {
          event.preventDefault();
          input && input.focus();
        }
      });
    });

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var current = 0;
      var timer = null;

      function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }

      function start() {
        if (slides.length < 2) {
          return;
        }
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5200);
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          window.clearInterval(timer);
          show(index);
          start();
        });
      });

      start();
    }

    var filterInput = document.querySelector("[data-card-filter]");
    var cardList = document.querySelector("[data-card-list]");
    if (filterInput && cardList) {
      var cards = Array.prototype.slice.call(cardList.querySelectorAll("[data-card]"));
      var termButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter-term]"));
      var activeTerm = "";

      function applyFilter() {
        var query = (filterInput.value || "").trim().toLowerCase();
        cards.forEach(function (card) {
          var haystack = card.getAttribute("data-search") || "";
          var matchedQuery = !query || haystack.indexOf(query) !== -1;
          var matchedTerm = !activeTerm || haystack.indexOf(activeTerm) !== -1;
          card.classList.toggle("is-hidden-card", !(matchedQuery && matchedTerm));
        });
      }

      filterInput.addEventListener("input", applyFilter);
      termButtons.forEach(function (button) {
        button.addEventListener("click", function () {
          activeTerm = button.getAttribute("data-filter-term") || "";
          termButtons.forEach(function (item) {
            item.classList.toggle("is-active", item === button);
          });
          applyFilter();
        });
      });
    }
  });
})();
