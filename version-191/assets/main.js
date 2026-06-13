(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function setupMenu() {
        var button = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!button || !panel) {
            return;
        }
        button.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }
        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5000);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                start();
            });
        });
        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupSearchForms() {
        var forms = Array.prototype.slice.call(document.querySelectorAll("[data-search-form]"));
        forms.forEach(function (form) {
            form.addEventListener("submit", function (event) {
                var input = form.querySelector("input[name='q']");
                if (!input) {
                    return;
                }
                event.preventDefault();
                var q = input.value.trim();
                var target = form.getAttribute("action") || "search.html";
                window.location.href = q ? target + "?q=" + encodeURIComponent(q) : target;
            });
        });
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function setupFilters() {
        var panel = document.querySelector("[data-filter-panel]");
        var list = document.querySelector("[data-card-list]");
        if (!panel || !list) {
            return;
        }
        var input = panel.querySelector("[data-filter-input]");
        var region = panel.querySelector("[data-filter-region]");
        var year = panel.querySelector("[data-filter-year]");
        var category = panel.querySelector("[data-filter-category]");
        var cards = Array.prototype.slice.call(list.querySelectorAll("[data-card]"));
        var empty = document.querySelector("[data-empty-state]");
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get("q") || "";
        if (input && initialQuery) {
            input.value = initialQuery;
        }
        function apply() {
            var queryValue = normalize(input && input.value);
            var regionValue = normalize(region && region.value);
            var yearValue = normalize(year && year.value);
            var categoryValue = normalize(category && category.value);
            var visible = 0;
            cards.forEach(function (card) {
                var haystack = normalize(card.getAttribute("data-search"));
                var ok = true;
                if (queryValue && haystack.indexOf(queryValue) === -1) {
                    ok = false;
                }
                if (regionValue && normalize(card.getAttribute("data-region")) !== regionValue) {
                    ok = false;
                }
                if (yearValue && normalize(card.getAttribute("data-year")) !== yearValue) {
                    ok = false;
                }
                if (categoryValue && normalize(card.getAttribute("data-category")) !== categoryValue) {
                    ok = false;
                }
                card.style.display = ok ? "" : "none";
                if (ok) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }
        [input, region, year, category].forEach(function (control) {
            if (!control) {
                return;
            }
            control.addEventListener("input", apply);
            control.addEventListener("change", apply);
        });
        apply();
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupSearchForms();
        setupFilters();
    });
})();
