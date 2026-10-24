
/* 
   CURIO MUSEUM — INTERACTIVE TIMELINE
 */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const data = window.CURIO_DATA;

    const list = document.getElementById("timeline-list");
    const searchInput = document.getElementById("timeline-search");
    const periodSelect = document.getElementById("timeline-period");
    const resetButton = document.getElementById("timeline-reset");
    const emptyResetButton = document.getElementById("timeline-empty-reset");
    const count = document.getElementById("timeline-results-count");
    const emptyState = document.getElementById("timeline-empty");
    const loading = document.getElementById("timeline-loading");

    if (!list || !searchInput || !periodSelect || !count || !emptyState) {
        console.error("Curio Timeline: a required HTML element is missing.");
        return;
    }

    if (!data || !Array.isArray(data.timeline) || !Array.isArray(data.exhibits)) {
        list.replaceChildren();

        const message = document.createElement("p");
        message.className = "timeline-error";
        message.textContent =
            "Timeline data could not be loaded. Check js/data.js and reload the page.";

        list.appendChild(message);
        console.error("Curio Timeline: shared timeline data is unavailable.");
        return;
    }

  let events = [];
  async function fetchTimeline() {
    try {
        const response = await fetch("/api/timeline");

        if (!response.ok) {
            throw new Error("Failed to load timeline");
        }

        events = await response.json();

        events.sort((a, b) => Number(a.sortYear) - Number(b.sortYear));

        updateResults();
    } catch (error) {
    console.warn("Backend unavailable; using local timeline data.", error);

    events = data.timeline.slice();

    events.sort((a, b) => Number(a.sortYear) - Number(b.sortYear));

    updateResults();
}
}

    const state = {
        query: "",
        category: "all"
    };

    const fallbackImages = {
        "tutankhamun":
            "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1000&q=85",
        "rosetta-stone":
            "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1000&q=85",
        "stonehenge":
            "https://images.unsplash.com/photo-1599833975787-5c143f373c30?auto=format&fit=crop&w=1000&q=85",
        "leonardo-sketches":
            "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=85",
        "printing-press":
            "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1000&q=85",
        "hubble-telescope":
            "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1000&q=85"
    };

    const generalFallback =
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1000&q=85";

    function element(tag, className, text) {
        const node = document.createElement(tag);

        if (className) {
            node.className = className;
        }

        if (text !== undefined) {
            node.textContent = text;
        }

        return node;
    }

    function findExhibit(id) {
        return data.getExhibitById
            ? data.getExhibitById(id)
            : data.exhibits.find(function (exhibit) {
                return exhibit.id === id;
            });
    }

    function getRelatedExhibits(event) {
        return (event.exhibitIds || [])
            .map(findExhibit)
            .filter(Boolean);
    }

    function getEventImage(event) {
        const related = getRelatedExhibits(event);
        const exhibit = related.find(function (item) {
            return Boolean(item.image);
        }) || related[0];

        if (exhibit && exhibit.image) {
            return exhibit.image;
        }

        if (exhibit && fallbackImages[exhibit.id]) {
            return fallbackImages[exhibit.id];
        }

        return generalFallback;
    }

    function getFilteredEvents() {
        const query = state.query.toLowerCase();

        return events.filter(function (event) {
            const matchesCategory =
                state.category === "all" ||
                event.categoryId === state.category;

            const related = getRelatedExhibits(event);

            const searchableText = [
                event.title,
                event.year,
                event.category,
                event.categoryId,
                event.description
            ].concat(
                related.flatMap(function (item) {
                    return [
                        item.title,
                        item.period,
                        item.location,
                        item.shortDescription
                    ].concat(item.tags || []);
                })
            ).filter(Boolean).join(" ").toLowerCase();

            return matchesCategory &&
                (!query || searchableText.includes(query));
        });
    }

    function makeImage(event) {
        const frame = element("div", "timeline-event-image-frame");
        const image = document.createElement("img");
        const related = getRelatedExhibits(event);
        const exhibit = related.find(function (item) {
            return Boolean(item.image);
        }) || related[0];

        const sources = [];

        if (exhibit && exhibit.image) {
            sources.push(exhibit.image);
        }

        if (exhibit && fallbackImages[exhibit.id]) {
            sources.push(fallbackImages[exhibit.id]);
        }

        sources.push(generalFallback);

        const uniqueSources = sources.filter(function (source, index, all) {
            return source && all.indexOf(source) === index;
        });

        let sourceIndex = 0;

        image.alt = exhibit
            ? (exhibit.imageAlt || exhibit.title)
            : event.title;

        image.loading = "lazy";
        image.decoding = "async";

        image.addEventListener("error", function () {
            sourceIndex += 1;

            if (sourceIndex < uniqueSources.length) {
                image.src = uniqueSources[sourceIndex];
                return;
            }

            image.remove();

            const fallback = element("div", "timeline-image-placeholder");
            fallback.setAttribute("aria-label", "Exhibit image unavailable");

            fallback.appendChild(
                element("span", "", "✧")
            );

            fallback.appendChild(
                element("span", "timeline-placeholder-title", event.title)
            );

            frame.appendChild(fallback);
        });

        image.src = uniqueSources[0] || generalFallback;
        frame.appendChild(image);

        const index = element(
            "span",
            "timeline-image-index",
            String(events.indexOf(event) + 1).padStart(2, "0")
        );

        index.setAttribute("aria-hidden", "true");
        frame.appendChild(index);

        return frame;
    }

    function makeExhibitLinks(event) {
        const wrapper = element("div", "timeline-event-exhibits");
        const related = getRelatedExhibits(event);

        related.forEach(function (exhibit) {
            const link = element(
                "a",
                "timeline-exhibit-link",
                exhibit.title
            );

            link.href = "exhibit.html?id=" + encodeURIComponent(exhibit.id);
            link.appendChild(element("span", "", "↗"));

            wrapper.appendChild(link);
        });

        if (!related.length) {
            const link = element(
                "a",
                "timeline-exhibit-link",
                "Explore discoveries"
            );

            link.href = "discover.html";
            link.appendChild(element("span", "", "↗"));
            wrapper.appendChild(link);
        }

        return wrapper;
    }

    function makeEventCard(event, index) {
        const article = element("article", "timeline-event");
        article.style.setProperty("--event-index", index);

        const markerColumn = element("div", "timeline-event-marker-column");
        const marker = element("span", "timeline-event-marker");

        marker.setAttribute("aria-hidden", "true");
        markerColumn.appendChild(marker);

        const content = element("div", "timeline-event-content");
        const header = element("div", "timeline-event-header");

        header.appendChild(
            element("p", "timeline-event-year", event.year || "Undated")
        );

        header.appendChild(
            element("span", "timeline-event-category",
                event.category || "Museum archive")
        );

        const heading = element("h3", "timeline-event-title", event.title);

        const description = element(
            "p",
            "timeline-event-description",
            event.description || "Explore the history behind this moment."
        );

        const footer = element("div", "timeline-event-footer");
        footer.appendChild(makeExhibitLinks(event));

        content.append(header, heading, description, footer);

        const visual = element("a", "timeline-event-visual");
        const related = getRelatedExhibits(event);

        visual.href = related.length
            ? "exhibit.html?id=" + encodeURIComponent(related[0].id)
            : "discover.html";

        visual.setAttribute(
            "aria-label",
            "Explore " + event.title
        );

        visual.appendChild(makeImage(event));

        article.append(markerColumn, content, visual);

        return article;
    }

    function updateResults() {
        const filtered = getFilteredEvents();

        list.replaceChildren();

        if (loading) {
            loading.hidden = true;
        }

        emptyState.hidden = filtered.length > 0;
        list.hidden = filtered.length === 0;

        count.textContent = filtered.length === events.length
            ? events.length + " historical moments in the archive"
            : "Showing " + filtered.length + " of " +
                events.length + " historical moments";

        if (!filtered.length) {
            return;
        }

        const fragment = document.createDocumentFragment();

        filtered.forEach(function (event, index) {
            fragment.appendChild(makeEventCard(event, index));
        });

        list.appendChild(fragment);
    }

    function resetFilters() {
        state.query = "";
        state.category = "all";

        searchInput.value = "";
        periodSelect.value = "all";

        updateResults();
    }

    searchInput.addEventListener("input", function () {
        state.query = searchInput.value.trim().toLowerCase();
        updateResults();
    });

    periodSelect.addEventListener("change", function () {
        state.category = periodSelect.value;
        updateResults();
    });

    resetButton.addEventListener("click", resetFilters);
    emptyResetButton.addEventListener("click", resetFilters);

    const searchButton = document.getElementById("timeline-search-button");

    if (searchButton) {
        searchButton.addEventListener("click", function () {
            state.query = searchInput.value.trim().toLowerCase();
            updateResults();
        });
    }

    fetchTimeline();
});
