(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  var params = new URLSearchParams(window.location.search);
  var query = params.get('q') || '';
  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
  var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-button]'));
  var emptyState = document.querySelector('[data-empty-state]');
  var activeFilter = 'all';

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilter() {
    var keyword = normalize(searchInputs.length ? searchInputs[0].value : query);
    var visibleCount = 0;

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute('data-search'));
      var filter = normalize(card.getAttribute('data-filter'));
      var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
      var matchFilter = activeFilter === 'all' || filter.indexOf(activeFilter) !== -1;
      var visible = matchKeyword && matchFilter;
      card.style.display = visible ? '' : 'none';
      if (visible) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', cards.length > 0 && visibleCount === 0);
    }
  }

  if (query) {
    searchInputs.forEach(function (input) {
      input.value = query;
    });
  }

  searchInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      searchInputs.forEach(function (other) {
        if (other !== input) {
          other.value = input.value;
        }
      });
      applyFilter();
    });
  });

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeFilter = normalize(button.getAttribute('data-filter-button'));
      buttons.forEach(function (item) {
        item.classList.toggle('is-active', item === button);
      });
      applyFilter();
    });
  });

  applyFilter();

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }
})();
