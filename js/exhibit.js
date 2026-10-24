
/* 
   CURIO MUSEUM — EXHIBIT DETAILS
   Dynamic exhibit content, bookmarks and recent history
   */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const data = window.CURIO_DATA;

    const loading = document.getElementById("exhibit-loading");
    const errorState = document.getElementById("exhibit-error");
    const content = document.getElementById("exhibit-content");

    if (!data || !Array.isArray(data.exhibits)) {
        showError("Museum data could not be loaded. Please check js/data.js.");
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const exhibitId = params.get("id");

    if (!exhibitId) {
        showError("Choose an exhibit from the Discover collection.");
        return;
    }

    let exhibit = null;
    async function loadExhibit() {
    try {
        const response = await fetch(
            "/api/exhibits/" + encodeURIComponent(exhibitId)
        );

        if (!response.ok) {
            throw new Error("Exhibit not found");
        }

        exhibit = await response.json();
        renderExhibit();

    } catch (error) {
    console.warn("Backend unavailable; using local exhibit data.", error);

    exhibit = data.exhibits.find(function (item) {
        return item.id === exhibitId;
    });

    if (exhibit) {
        renderExhibit();
    } else {
        showError("This exhibit could not be found.");
    }
}
}

    

    const imageFallbacks = {
        "tutankhamun":
            "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1400&q=85",
        "hubble-telescope":
            "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1400&q=85",
        "rosetta-stone":
            "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1400&q=85",
        "great-wall":
            "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1400&q=85",
        "apollo-11":
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=85",
        "amazon-rainforest":
            "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=85",
        "stonehenge":
            "https://images.unsplash.com/photo-1599833975787-5c143f373c30?auto=format&fit=crop&w=1400&q=85",
        "blue-whale":
            "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1400&q=85",
        "light-bulb":
            "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1400&q=85",
        "venus":
            "https://images.unsplash.com/photo-1614732484003-ef9881555dc3?auto=format&fit=crop&w=1400&q=85"
    };

    function byId(id) {
        return document.getElementById(id);
    }

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

    function showError(message) {
        if (loading) {
            loading.hidden = true;
        }

        if (content) {
            content.hidden = true;
        }

        if (errorState) {
            errorState.hidden = false;

            const paragraph = errorState.querySelector("p:not(.exhibit-eyebrow)");

            if (paragraph) {
                paragraph.textContent = message;
            }
        }

        console.warn("Curio exhibit:", message);
    }

    function readStorage(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(value) ? value : [];
        } catch (error) {
            return [];
        }
    }

    function writeStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn("Curio could not save local data.", error);
            return false;
        }
    }

    function setText(id, value, fallback) {
        const element = byId(id);

        if (element) {
            element.textContent = value || fallback || "";
        }
    }

    function recordRecentlyViewed() {
        const key = "curio-recently-viewed";
        const previous = readStorage(key).filter(function (item) {
            return item !== exhibit.id;
        });

        previous.unshift(exhibit.id);
        writeStorage(key, previous.slice(0, 12));
    }

    function setupBookmark() {
        const button = byId("exhibit-bookmark");
        const symbol = byId("bookmark-symbol");
        const label = byId("bookmark-label");
        const feedback = byId("exhibit-feedback");

        if (!button || !symbol || !label) {
            return;
        }

        function updateButton(saved) {
            button.classList.toggle("is-saved", saved);
            button.setAttribute("aria-pressed", String(saved));
            symbol.textContent = saved ? "♥" : "♡";
            label.textContent = saved
                ? "Saved to collection"
                : "Save to collection";
        }

        updateButton(readStorage("curio-bookmarks").includes(exhibit.id));

        button.addEventListener("click", function () {
            const current = readStorage("curio-bookmarks");
            const alreadySaved = current.includes(exhibit.id);

            const updated = alreadySaved
                ? current.filter(function (id) {
                    return id !== exhibit.id;
                })
                : [...current, exhibit.id];

            const success = writeStorage("curio-bookmarks", updated);

            updateButton(updated.includes(exhibit.id));

            if (feedback) {
                feedback.textContent = success
                    ? (
                        updated.includes(exhibit.id)
                            ? "This discovery has been saved to your collection."
                            : "This discovery has been removed from your collection."
                    )
                    : "Your browser could not save this change.";
            }
        });
    }

    function setupImage() {
        const image = byId("exhibit-image");
        const fallback = byId("exhibit-image-fallback");
        const fallbackTitle = byId("fallback-title");
        const caption = byId("exhibit-image-caption");

        if (!image || !fallback) {
            return;
        }

        const sources = [];

        if (exhibit.image) {
            sources.push(exhibit.image);
        }

        if (imageFallbacks[exhibit.id]) {
            sources.push(imageFallbacks[exhibit.id]);
        }

        const genericImage =
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1400&q=85";

        sources.push(genericImage);

        const uniqueSources = sources.filter(function (url, index, all) {
            return url && all.indexOf(url) === index;
        });

        let sourceIndex = 0;

        image.alt = exhibit.imageAlt || exhibit.title;
        image.hidden = false;
        fallback.hidden = true;

        if (fallbackTitle) {
            fallbackTitle.textContent = exhibit.title;
        }

        image.addEventListener("error", function () {
            sourceIndex += 1;

            if (sourceIndex < uniqueSources.length) {
                image.src = uniqueSources[sourceIndex];
                return;
            }

            image.hidden = true;
            fallback.hidden = false;

            if (caption) {
                caption.textContent =
                    "Exhibit image unavailable — explore the story below.";
            }
        });

        image.src = uniqueSources[0] || genericImage;

        if (caption) {
            caption.textContent = exhibit.imageAlt || exhibit.title;
        }
    }

    function renderFacts() {
        const container = byId("exhibit-facts");

        if (!container) {
            return;
        }

        container.replaceChildren();

        const facts = Array.isArray(exhibit.facts)
            ? exhibit.facts
            : [];

        if (!facts.length) {
            container.appendChild(
                createElement(
                    "p",
                    "exhibit-no-facts",
                    "More details about this discovery will be added soon."
                )
            );
            return;
        }

        facts.forEach(function (fact, index) {
            const article = createElement("article", "exhibit-fact-card");

            const number = createElement(
                "span",
                "exhibit-fact-number",
                String(index + 1).padStart(2, "0")
            );

            const text = createElement("p", "exhibit-fact-text", fact);

            article.append(number, text);
            container.appendChild(article);
        });
    }

    function renderTags() {
        const container = byId("exhibit-tags");

        if (!container) {
            return;
        }

        container.replaceChildren();

        (exhibit.tags || []).forEach(function (tag) {
            const link = createElement("a", "exhibit-tag", tag);

            link.href = "discover.html?q=" + encodeURIComponent(tag);
            container.appendChild(link);
        });
    }

    function renderRelatedExhibits() {
        const container = byId("related-exhibits");

        if (!container) {
            return;
        }

        container.replaceChildren();

        const related = data.exhibits
            .filter(function (item) {
                return item.id !== exhibit.id;
            })
            .map(function (item) {
                let score = 0;

                if (item.categoryId === exhibit.categoryId) {
                    score += 3;
                }

                const currentTags = exhibit.tags || [];
                const itemTags = item.tags || [];

                score += itemTags.filter(function (tag) {
                    return currentTags.includes(tag);
                }).length;

                return { item: item, score: score };
            })
            .sort(function (a, b) {
                return b.score - a.score;
            })
            .slice(0, 3)
            .map(function (entry) {
                return entry.item;
            });

        related.forEach(function (item) {
            const card = createElement("article", "related-exhibit-card");

            const link = createElement("a", "related-exhibit-image");
            link.href = "exhibit.html?id=" + encodeURIComponent(item.id);

            const image = document.createElement("img");
            image.src = item.image || "";
            image.alt = item.imageAlt || item.title;
            image.loading = "lazy";
            image.decoding = "async";

            image.addEventListener("error", function () {
                image.remove();

                const placeholder = createElement(
                    "div",
                    "related-exhibit-placeholder",
                    "✧"
                );

                placeholder.setAttribute("aria-hidden", "true");
                link.prepend(placeholder);
            }, { once: true });

            link.appendChild(image);

            const body = createElement("div", "related-exhibit-content");

            body.appendChild(
                createElement(
                    "p",
                    "related-exhibit-category",
                    item.category || "Curio Collection"
                )
            );

            const heading = createElement("h3", "related-exhibit-title");
            const titleLink = createElement("a", "", item.title);

            titleLink.href =
                "exhibit.html?id=" + encodeURIComponent(item.id);

            heading.appendChild(titleLink);

            body.appendChild(heading);

            body.appendChild(
                createElement(
                    "p",
                    "related-exhibit-description",
                    item.shortDescription || ""
                )
            );

            const more = createElement(
                "a",
                "related-exhibit-more",
                "Explore story ↗"
            );

            more.href = "exhibit.html?id=" + encodeURIComponent(item.id);
            body.appendChild(more);

            card.append(link, body);
            container.appendChild(card);
        });
    }

    function setupPagination() {
        const exhibits = data.exhibits;
        const index = exhibits.findIndex(function (item) {
            return item.id === exhibit.id;
        });

        if (index < 0 || exhibits.length < 2) {
            return;
        }

        const previous = exhibits[
            (index - 1 + exhibits.length) % exhibits.length
        ];

        const next = exhibits[(index + 1) % exhibits.length];

        const previousLink = byId("previous-exhibit");
        const nextLink = byId("next-exhibit");

        if (previousLink) {
            previousLink.href =
                "exhibit.html?id=" + encodeURIComponent(previous.id);

            const title = previousLink.querySelector(
                ".exhibit-pagination-title"
            );

            if (title) {
                title.textContent = previous.title;
            }
        }

        if (nextLink) {
            nextLink.href =
                "exhibit.html?id=" + encodeURIComponent(next.id);

            const title = nextLink.querySelector(
                ".exhibit-pagination-title"
            );

            if (title) {
                title.textContent = next.title;
            }
        }
    }

    function renderExhibit() {
        document.title = exhibit.title + " | Curio Museum";

        setText("breadcrumb-current", exhibit.title);
        setText("exhibit-category", exhibit.category, "Curio Collection");
        setText("exhibit-title", exhibit.title, "Extraordinary Discovery");
        setText("exhibit-intro", exhibit.shortDescription);
        setText("exhibit-period", exhibit.period, "Historical collection");
        setText("exhibit-date", exhibit.date, "Date not specified");
        setText("story-heading", "The story of " + exhibit.title);
        setText("exhibit-description", exhibit.description);
        setText("exhibit-significance", exhibit.significance);
        setText("exhibit-location", exhibit.location, "Location not specified");
        setText("fallback-title", exhibit.title);

        const imageNumber = String(
            data.exhibits.findIndex(function (item) {
                return item.id === exhibit.id;
            }) + 1
        ).padStart(3, "0");

        setText("exhibit-image-caption", exhibit.imageAlt || exhibit.title);

        const imageNumberElement = document.querySelector(
            ".exhibit-image-number"
        );

        if (imageNumberElement) {
            imageNumberElement.textContent = "C—" + imageNumber;
        }

        renderFacts();
        renderTags();
        renderRelatedExhibits();
        setupBookmark();
        setupImage();
        setupPagination();
        recordRecentlyViewed();

        if (loading) {
            loading.hidden = true;
        }

        if (errorState) {
            errorState.hidden = true;
        }

        content.hidden = false;
    }

    loadExhibit();
});

