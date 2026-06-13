(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var navToggle = document.querySelector('[data-nav-toggle]');
    var mainNav = document.querySelector('[data-main-nav]');

    if (navToggle && mainNav) {
      navToggle.addEventListener('click', function () {
        mainNav.classList.toggle('is-open');
      });
    }

    var slider = document.querySelector('[data-hero-slider]');

    if (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
      var prev = slider.querySelector('[data-hero-prev]');
      var next = slider.querySelector('[data-hero-next]');
      var active = 0;
      var timer = null;

      function showSlide(index) {
        if (!slides.length) {
          return;
        }

        active = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === active);
        });

        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === active);
        });
      }

      function startTimer() {
        stopTimer();
        timer = window.setInterval(function () {
          showSlide(active + 1);
        }, 5500);
      }

      function stopTimer() {
        if (timer) {
          window.clearInterval(timer);
        }
      }

      if (prev) {
        prev.addEventListener('click', function () {
          showSlide(active - 1);
          startTimer();
        });
      }

      if (next) {
        next.addEventListener('click', function () {
          showSlide(active + 1);
          startTimer();
        });
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
          showSlide(index);
          startTimer();
        });
      });

      slider.addEventListener('mouseenter', stopTimer);
      slider.addEventListener('mouseleave', startTimer);
      showSlide(0);
      startTimer();
    }

    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));

    panels.forEach(function (panel) {
      var container = panel.parentElement;
      var cards = Array.prototype.slice.call(container.querySelectorAll('[data-card]'));
      var searchInput = panel.querySelector('[data-search-input]');
      var filters = Array.prototype.slice.call(panel.querySelectorAll('[data-filter]'));
      var emptyState = container.querySelector('[data-empty-state]');

      function getValue(name) {
        var field = panel.querySelector('[data-filter="' + name + '"]');
        return field ? field.value.trim() : '';
      }

      function applyFilters() {
        var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        var region = getValue('region');
        var year = getValue('year');
        var type = getValue('type');
        var genre = getValue('genre');
        var shown = 0;

        cards.forEach(function (card) {
          var haystack = [
            card.dataset.title,
            card.dataset.region,
            card.dataset.year,
            card.dataset.type,
            card.dataset.genre
          ].join(' ').toLowerCase();

          var matched = true;

          if (query && haystack.indexOf(query) === -1) {
            matched = false;
          }

          if (region && card.dataset.region !== region) {
            matched = false;
          }

          if (year && card.dataset.year !== year) {
            matched = false;
          }

          if (type && card.dataset.type !== type) {
            matched = false;
          }

          if (genre && card.dataset.genre !== genre) {
            matched = false;
          }

          card.style.display = matched ? '' : 'none';

          if (matched) {
            shown += 1;
          }
        });

        if (emptyState) {
          emptyState.classList.toggle('is-visible', shown === 0);
        }
      }

      if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
      }

      filters.forEach(function (field) {
        field.addEventListener('change', applyFilters);
      });
    });
  });
})();
