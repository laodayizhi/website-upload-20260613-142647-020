
(function () {
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-mobile-menu]");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("[data-hero-slider]").forEach(function (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var setActive = function (next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        setActive(i);
      });
    });
    window.setInterval(function () {
      setActive(index + 1);
    }, 5000);
  });

  document.querySelectorAll("[data-filter-form]").forEach(function (form) {
    var root = form.parentElement || document;
    var cards = Array.prototype.slice.call(root.querySelectorAll("[data-card]"));
    var empty = root.querySelector("[data-empty-state]");
    var queryInput = form.querySelector("[data-filter-query]");
    var regionSelect = form.querySelector("[data-filter-region]");
    var typeSelect = form.querySelector("[data-filter-type]");
    var yearSelect = form.querySelector("[data-filter-year]");
    var categorySelect = form.querySelector("[data-filter-category]");

    var apply = function () {
      var query = queryInput ? queryInput.value.trim().toLowerCase() : "";
      var region = regionSelect ? regionSelect.value : "";
      var type = typeSelect ? typeSelect.value : "";
      var year = yearSelect ? yearSelect.value : "";
      var category = categorySelect ? categorySelect.value : "";
      var visible = 0;
      cards.forEach(function (card) {
        var text = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
        var matched = true;
        if (query && text.indexOf(query) === -1) {
          matched = false;
        }
        if (region && card.getAttribute("data-region") !== region) {
          matched = false;
        }
        if (type && card.getAttribute("data-type") !== type) {
          matched = false;
        }
        if (year && card.getAttribute("data-year") !== year) {
          matched = false;
        }
        if (category && card.getAttribute("data-category") !== category) {
          matched = false;
        }
        card.classList.toggle("is-hidden", !matched);
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    };

    [queryInput, regionSelect, typeSelect, yearSelect, categorySelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });
    apply();
  });
})();

function initVideoPlayer(sourceUrl) {
  var video = document.querySelector("[data-video-player]");
  var layer = document.querySelector("[data-play-layer]");
  var hlsInstance = null;
  if (!video || !sourceUrl) {
    return;
  }

  var bind = function () {
    if (video.getAttribute("data-ready") === "1") {
      return;
    }
    video.setAttribute("data-ready", "1");
    video.controls = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = sourceUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(sourceUrl);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal) {
          return;
        }
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          hlsInstance.startLoad();
        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hlsInstance.recoverMediaError();
        } else {
          hlsInstance.destroy();
        }
      });
    } else {
      video.src = sourceUrl;
    }
  };

  var play = function () {
    bind();
    if (layer) {
      layer.classList.add("is-hidden");
    }
    var promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {});
    }
  };

  if (layer) {
    layer.addEventListener("click", play);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      play();
    }
  });

  window.addEventListener("beforeunload", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
