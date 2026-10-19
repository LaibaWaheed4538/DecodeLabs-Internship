
/* =========================================================
   CURIO MUSEUM — DISCOVER PAGE
   Search, category filters, sorting, bookmarks and images
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const data = window.CURIO_DATA;

    const grid = document.getElementById("discover-grid");
    const loading = document.getElementById("discover-loading");
    const emptyState = document.getElementById("discover-empty");
    const count = document.getElementById("discover-count");
    const resultsMessage = document.getElementById(
        "discover-results-message"
    );
    const categoriesContainer = document.getElementById(
        "discover-categories"
    );
    const searchForm = document.getElementById("discover-search-form");
    const searchInput = document.getElementById("discover-search");
    const clearSearchButton = document.getElementById(
        "clear-discover-search"
    );
    const sortSelect = document.getElementById("discover-sort");
    const resetButton = document.getElementById(
        "reset-discover-filters"
    );
    const emptyResetButton = document.getElementById(
        "discover-empty-reset"
    );

    if (!grid || !categoriesContainer || !searchInput || !sortSelect) {
        console.error(
            "Curio Discover: required HTML elements are missing."
        );
        return;
    }

    if (!data || !Array.isArray(data.exhibits)) {
        if (loading) {
            loading.textContent =
                "Museum data could not be loaded. Check js/data.js.";
        }

        console.error(
            "Curio Discover: CURIO_DATA.exhibits is unavailable."
        );
        return;
    }

    const exhibits = data.exhibits.slice();

    const state = {
        query: "",
        category: "all",
        sort: "featured"
    };

    /* Reliable image sources for common exhibit IDs.
       Existing data.js image URLs always take priority. */

    const imageFallbacks = {
        "tutankhamun": [
            "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1000&q=85"
        ],
        "hubble-telescope": [
            "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1000&q=85"
        ],
        "rosetta-stone": [
            "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1000&q=85"
        ],
        "great-wall": [
            "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1000&q=85"
        ],
        "blue-whale": [
            "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1000&q=85"
        ],
        "venus": [
            "https://images.unsplash.com/photo-1614732484003-ef9881555dc3?auto=format&fit=crop&w=1000&q=85"
        ]
    };

    const generalFallbacks = [
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1000&q=85"
    ];

    const palettes = [
        ["#31535e", "#0b1921"],
        ["#786044", "#241c16"],
        ["#425a69", "#111d28"],
        ["#59634a", "#18251d"],
        ["#66516a", "#211b2c"]
    ];

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

    function getImageSources(exhibit) {
        const sources = [];

        if (exhibit.image && String(exhibit.image).trim()) {
            sources.push(String(exhibit.image).trim());
        }

        if (Array.isArray(imageFallbacks[exhibit.id])) {
            sources.push(...imageFallbacks[exhibit.id]);
        }

        sources.push(...generalFallbacks);

        return sources.filter(function (url, index, all) {
            return Boolean(url) && all.indexOf(url) === index;
        });
    }

    function getSavedIds() {
        try {
            const saved = JSON.parse(
                localStorage.getItem("curio-bookmarks") || "[]"
            );

            return Array.isArray(saved) ? saved : [];
        } catch (error) {
            return [];
        }
    }

    function saveIds(ids) {
        try {
            localStorage.setItem(
                "curio-bookmarks",
                JSON.stringify(ids)
            );
        } catch (error) {
            console.warn("Curio could not save bookmarks.", error);
        }
    }

    /* CATEGORY FILTERS */

    function renderCategories() {
        const categories = Array.isArray(data.categories)
            ? data.categories
            : [];

        categoriesContainer.replaceChildren();

        const allButton = createElement(
            "button",
            "discover-category-button",
            "All Discoveries"
        );

        allButton.type = "button";
        allButton.dataset.category = "all";

        categoriesContainer.appendChild(allButton);

        categories.forEach(function (category) {
            if (!category || !category.id || category.id === "all") {
                return;
            }

            const button = createElement(
                "button",
                "discover-category-button",
                category.name || category.id
            );

            button.type = "button";
            button.dataset.category = category.id;

            categoriesContainer.appendChild(button);
        });

        updateCategoryButtons();
    }

    function updateCategoryButtons() {
        categoriesContainer
            .querySelectorAll(".discover-category-button")
            .forEach(function (button) {
                const active =
                    button.dataset.category === state.category;

                button.classList.toggle("is-active", active);
                button.setAttribute("aria-pressed", String(active));
            });
    }

    /* IMAGE LOADING AND FALLBACK */

    function createExhibitImage(exhibit, index) {
        const wrapper = createElement("div", "discover-image-frame");
        const image = document.createElement("img");

        image.alt =
            exhibit.imageAlt ||
            exhibit.title ||
            "Museum exhibit";

        image.loading = index < 3 ? "eager" : "lazy";
        image.decoding = "async";

        if (index === 0) {
            image.fetchPriority = "high";
        }

        const sources = getImageSources(exhibit);
        let sourceIndex = 0;

        function showFallback() {
            image.remove();

            wrapper.classList.add("has-image-fallback");

            const palette = palettes[index % palettes.length];

            const placeholder = createElement(
                "div",
                "discover-image-placeholder"
            );

            placeholder.style.setProperty(
                "--fallback-one",
                palette[0]
            );

            placeholder.style.setProperty(
                "--fallback-two",
                palette[1]
            );

            const symbol = createElement(
                "span",
                "discover-placeholder-symbol",
                "✧"
            );

            const title = createElement(
                "span",
                "discover-placeholder-title",
                exhibit.title || "Curio Discovery"
            );

            placeholder.append(symbol, title);
            wrapper.appendChild(placeholder);
        }

        image.addEventListener("error", function () {
            sourceIndex += 1;

            if (sourceIndex < sources.length) {
                image.src = sources[sourceIndex];
            } else {
                showFallback();
            }
        });

        if (sources.length) {
            image.src = sources[0];
        } else {
            showFallback();
        }

        if (image.parentElement !== wrapper) {
            wrapper.appendChild(image);
        }

        return wrapper;
    }

    /* BOOKMARK BUTTON */

    function createBookmark(exhibit, savedIds) {
        const button = createElement("button", "discover-bookmark");
        const symbol = createElement("span", "discover-bookmark-symbol");

        button.type = "button";

        function updateButton(saved) {
            button.classList.toggle("is-saved", saved);
            button.setAttribute("aria-pressed", String(saved));

            button.setAttribute(
                "aria-label",
                saved
                    ? "Remove " + exhibit.title + " from saved exhibits"
                    : "Save " + exhibit.title
            );

            symbol.textContent = saved ? "♥" : "♡";
        }

        updateButton(savedIds.includes(exhibit.id));
        button.appendChild(symbol);

        button.addEventListener("click", function () {
            const current = getSavedIds();
            const exists = current.includes(exhibit.id);

            const updated = exists
                ? current.filter(function (id) {
                    return id !== exhibit.id;
                })
                : [...current, exhibit.id];

            saveIds(updated);
            updateButton(updated.includes(exhibit.id));
        });

        return button;
    }

    /* EXHIBIT CARD */

    function createCard(exhibit, index, savedIds) {
        const article = createElement("article", "discover-card");

        article.style.setProperty("--card-order", index);

        const imageLink = createElement("a", "discover-card-image");

        imageLink.href =
            "exhibit.html?id=" + encodeURIComponent(exhibit.id);

        imageLink.setAttribute(
            "aria-label",
            "Explore " + (exhibit.title || "this exhibit")
        );

        imageLink.appendChild(createExhibitImage(exhibit, index));

        const overlay = createElement(
            "span",
            "discover-card-image-overlay"
        );

        overlay.setAttribute("aria-hidden", "true");
        imageLink.appendChild(overlay);

        const number = createElement(
            "span",
            "discover-card-index",
            String(index + 1).padStart(2, "0")
        );

        imageLink.appendChild(number);
        imageLink.appendChild(createBookmark(exhibit, savedIds));

        const caption = createElement(
            "span",
            "discover-card-image-caption",
            "EXPLORE EXHIBIT"
        );

        imageLink.appendChild(caption);

        const content = createElement("div", "discover-card-content");

        const category = createElement(
            "p",
            "discover-card-category",
            exhibit.category || "Curio Collection"
        );

        const heading = createElement("h3", "discover-card-title");
        const titleLink = createElement(
            "a",
            "",
            exhibit.title || "Untitled discovery"
        );

        titleLink.href =
            "exhibit.html?id=" + encodeURIComponent(exhibit.id);

        heading.appendChild(titleLink);

        const description = createElement(
            "p",
            "discover-card-description",
            exhibit.shortDescription ||
                exhibit.description ||
                "Explore the story behind this remarkable discovery."
        );

        const meta = createElement("div", "discover-card-meta");

        meta.appendChild(
            createElement(
                "span",
                "discover-card-period",
                exhibit.period || "Museum collection"
            )
        );

        if (exhibit.date) {
            meta.appendChild(
                createElement("span", "discover-card-separator", "·")
            );

            meta.appendChild(
                createElement(
                    "span",
                    "discover-card-date",
                    exhibit.date
                )
            );
        }

        const footer = createElement("div", "discover-card-footer");
        const exploreLink = createElement(
            "a",
            "discover-card-link",
            "Discover the story"
        );

        exploreLink.href =
            "exhibit.html?id=" + encodeURIComponent(exhibit.id);

        exploreLink.appendChild(
            createElement("span", "discover-card-arrow", "↗")
        );

        footer.appendChild(exploreLink);
        content.append(category, heading, description, meta, footer);
        article.append(imageLink, content);

        return article;
    }

    /* SEARCH AND FILTERING */

    function getFilteredExhibits() {
        const query = state.query.trim().toLowerCase();

        return exhibits.filter(function (exhibit) {
            const matchesCategory =
                state.category === "all" ||
                exhibit.categoryId === state.category;

            const searchableText = [
                exhibit.title,
                exhibit.category,
                exhibit.categoryId,
                exhibit.period,
                exhibit.date,
                exhibit.location,
                exhibit.shortDescription,
                exhibit.description
            ]
                .concat(exhibit.tags || [])
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return (
                matchesCategory &&
                (!query || searchableText.includes(query))
            );
        });
    }

    /* SORTING */

    function sortExhibits(items) {
        const sorted = items.slice();

        switch (state.sort) {
            case "title-asc":
                sorted.sort(function (a, b) {
                    return (a.title || "").localeCompare(b.title || "");
                });
                break;

            case "title-desc":
                sorted.sort(function (a, b) {
                    return (b.title || "").localeCompare(a.title || "");
                });
                break;

            case "newest":
                sorted.sort(function (a, b) {
                    return Number(b.discoveryYear || 0) -
                        Number(a.discoveryYear || 0);
                });
                break;

            case "oldest":
                sorted.sort(function (a, b) {
                    return Number(a.discoveryYear || 0) -
                        Number(b.discoveryYear || 0);
                });
                break;

            case "featured":
            default:
                sorted.sort(function (a, b) {
                    return Number(Boolean(b.featured)) -
                        Number(Boolean(a.featured));
                });
                break;
        }

        return sorted;
    }

    /* RENDER */

    function render() {
        const filtered = sortExhibits(getFilteredExhibits());
        const savedIds = getSavedIds();

        grid.replaceChildren();

        if (loading) {
            loading.remove();
        }

        count.textContent = String(filtered.length);

        resultsMessage.textContent =
            "Showing " + filtered.length +
            " of " + exhibits.length + " discoveries";

        emptyState.hidden = filtered.length !== 0;
        grid.hidden = filtered.length === 0;

        if (!filtered.length) {
            return;
        }

        const fragment = document.createDocumentFragment();

        filtered.forEach(function (exhibit, index) {
            fragment.appendChild(
                createCard(exhibit, index, savedIds)
            );
        });

        grid.appendChild(fragment);
    }

    /* RESET */

    function resetFilters() {
        state.query = "";
        state.category = "all";
        state.sort = "featured";

        searchInput.value = "";
        sortSelect.value = "featured";

        updateSearchControls();
        updateCategoryButtons();
        render();
    }

    function updateSearchControls() {
        clearSearchButton.hidden = !searchInput.value.trim();
    }

    /* EVENT LISTENERS */

    categoriesContainer.addEventListener("click", function (event) {
        const button = event.target.closest(
            ".discover-category-button"
        );

        if (!button) {
            return;
        }

        state.category = button.dataset.category || "all";

        updateCategoryButtons();
        render();
    });

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();

        state.query = searchInput.value.trim();

        updateSearchControls();
        render();
    });

    searchInput.addEventListener("input", function () {
        state.query = searchInput.value.trim();

        updateSearchControls();
        render();
    });

    clearSearchButton.addEventListener("click", function () {
        searchInput.value = "";
        state.query = "";

        updateSearchControls();
        render();
        searchInput.focus();
    });

    sortSelect.addEventListener("change", function () {
        state.sort = sortSelect.value;
        render();
    });

    resetButton.addEventListener("click", resetFilters);
    emptyResetButton.addEventListener("click", resetFilters);

    /* INITIALIZE */

    const params = new URLSearchParams(window.location.search);

    state.query = params.get("q") || "";
    searchInput.value = state.query;

    renderCategories();
    updateSearchControls();
    render();

    console.info(
        "Curio Discover loaded: " + exhibits.length + " exhibits."
    );
});
