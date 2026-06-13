(function () {
  function escapeText(value) {
    var element = document.createElement("div");
    element.textContent = value == null ? "" : String(value);
    return element.innerHTML;
  }

  function readQuery() {
    return new URLSearchParams(window.location.search).get("q") || "";
  }

  function renderCard(item) {
    return [
      '<article class="movie-card jelly-card">',
      '<a class="poster-link" href="' + escapeText(item.url) + '">',
      '<img src="' + escapeText(item.cover) + '" alt="' + escapeText(item.title) + '" loading="lazy" />',
      '<span class="play-pulse">▶</span>',
      '<span class="duration">' + escapeText(item.duration) + '</span>',
      '</a>',
      '<div class="movie-card-body">',
      '<div class="meta-line"><span>' + escapeText(item.category) + '</span><span>' + escapeText(item.year) + '</span><span>' + escapeText(item.region) + '</span></div>',
      '<h2><a href="' + escapeText(item.url) + '">' + escapeText(item.title) + '</a></h2>',
      '<p>' + escapeText(item.summary) + '</p>',
      '<div class="tag-row">' + (item.tags || []).slice(0, 3).map(function (tag) { return '<span>#' + escapeText(tag) + '</span>'; }).join("") + '</div>',
      '</div>',
      '</article>'
    ].join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var results = document.querySelector("[data-search-results]");
    var input = document.querySelector('.search-page input[name="q"]');
    var query = readQuery().trim();
    if (input) {
      input.value = query;
    }
    if (!results) {
      return;
    }
    if (!query) {
      return;
    }
    var normalized = query.toLowerCase();
    var items = (window.SiteSearchItems || []).filter(function (item) {
      var haystack = [
        item.title,
        item.region,
        item.type,
        item.genre,
        item.category,
        item.summary,
        (item.tags || []).join(" ")
      ].join(" ").toLowerCase();
      return haystack.indexOf(normalized) !== -1;
    });
    if (!items.length) {
      results.innerHTML = '<div class="empty-state jelly-card">没有找到相关影片</div>';
      return;
    }
    results.innerHTML = '<div class="movie-grid">' + items.map(renderCard).join("") + '</div>';
  });
})();
