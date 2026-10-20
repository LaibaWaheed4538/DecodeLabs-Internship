
/*
   CURIO MUSEUM — COLLECTION PAGE
   Displays discoveries saved from Discover and Exhibit pages.
*/

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const page = document.querySelector(".collection-page");
    const grid = document.getElementById("collection-grid");

    if (!page || !grid) return;

    const data = window.CURIO_DATA;
    const exhibits = Array.isArray(data?.exhibits)
        ? data.exhibits
        : [];

    const filters = Array.from(
        page.querySelectorAll("[data-collection-filter]")
    );

    const sortSelect = document.getElementById("collection-sort");
    const emptyState = document.getElementById("collection-empty");
    const storageKey = "curio-bookmarks";

    let activeFilter = "all";
    let savedItems = readSavedItems();

    /* Read saved items */

    function readSavedItems() {
        try {
            const stored = localStorage.getItem(storageKey);
            const parsed = stored ? JSON.parse(stored) : [];

            return Array.isArray(parsed)
                ? [...new Set(
                    parsed.filter(item => typeof item === "string")
                )]
                : [];
        } catch (error) {
            console.warn("Unable to read saved discoveries.", error);
            return [];
        }
    }

    /* Save items */

    function persistSavedItems() {
        try {
            localStorage.setItem(
                storageKey,
                JSON.stringify(savedItems)
            );
            return true;
        } catch (error) {
            console.warn("Unable to save discoveries.", error);
            return false;
        }
    }

    /* Get exhibit information */

    function getCategoryGroup(exhibit) {
        const category = exhibit.categoryId || "";

        if (category === "history" ||
            category === "ancient-civilizations") {
            return "history";
        }

        if (category === "science") {
            return "science";
        }

        if (category === "inventions") {
            return "art";
        }

        return "other";
    }

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;

        return element;
    }

    /* Create a collection card from exhibit data */

    function createCard(exhibit) {
        const card = createElement("article", "collection-card");

        card.dataset.collectionCard = "";
        card.dataset.title = exhibit.title || "Discovery";
        card.dataset.category = getCategoryGroup(exhibit);

        const imageLink = createElement(
            "a",
            "collection-card-image"
        );

        imageLink.href =
            "exhibit.html?id=" + encodeURIComponent(exhibit.id);

        const image = document.createElement("img");
        image.src = exhibit.image || "";
        image.alt = exhibit.imageAlt || exhibit.title || "Museum exhibit";
        image.loading = "lazy";
        image.decoding = "async";
        image.width = 850;
        image.height = 650;

        image.addEventListener("error", () => {
            image.hidden = true;
        }, { once: true });

        imageLink.appendChild(image);

        const categoryLabel = createElement(
            "span",
            "collection-card-category",
            (exhibit.category || "Discovery").toUpperCase()
        );

        imageLink.appendChild(categoryLabel);

        const content = createElement(
            "div",
            "collection-card-content"
        );

        content.appendChild(
            createElement(
                "p",
                "collection-card-meta",
                exhibit.period || "Museum collection"
            )
        );

        const heading = createElement("h3");
        const titleLink = createElement(
            "a",
            "",
            exhibit.title || "Untitled discovery"
        );

        titleLink.href = imageLink.href;
        heading.appendChild(titleLink);
        content.appendChild(heading);

        content.appendChild(
            createElement(
                "p",
                "collection-card-description",
                exhibit.shortDescription ||
                    exhibit.description ||
                    "Explore the story behind this discovery."
            )
        );

        const footer = createElement(
            "div",
            "collection-card-footer"
        );

        const exploreLink = createElement(
            "a",
            "",
            "Explore exhibit ↗"
        );

        exploreLink.href = imageLink.href;

        const saveButton = createElement(
            "button",
            "collection-save-button is-saved",
            "♥"
        );

        saveButton.type = "button";
        saveButton.dataset.saveItem = exhibit.id;
        saveButton.setAttribute("aria-pressed", "true");
        saveButton.setAttribute(
            "aria-label",
            "Remove " + (exhibit.title || "discovery") +
                " from saved items"
        );

        footer.append(exploreLink, saveButton);
        content.appendChild(footer);
        card.append(imageLink, content);

        return card;
    }

    /* Create cards for all available exhibits */

    const cards = exhibits
        .filter(exhibit => exhibit && exhibit.id)
        .map(createCard);

    /* Sorting */

    function getSortedCards() {
        const sortMode = sortSelect?.value || "default";
        const orderedCards = [...cards];

        if (sortMode === "title") {
            orderedCards.sort((a, b) =>
                a.dataset.title.localeCompare(b.dataset.title)
            );
        } else if (sortMode === "category") {
            orderedCards.sort((a, b) =>
                a.dataset.category.localeCompare(b.dataset.category)
            );
        }

        return orderedCards;
    }

    /* Render saved discoveries */

    function renderCollection() {
        let visibleCount = 0;

        grid.replaceChildren();

        getSortedCards().forEach(card => {
            const id = card.querySelector("[data-save-item]")
                ?.dataset.saveItem;

            const isSaved = savedItems.includes(id);

            const matchesCategory =
                activeFilter === "all" ||
                card.dataset.category === activeFilter;

            if (!id || !isSaved || !matchesCategory) return;

            visibleCount++;
            card.classList.add("is-visible");
            grid.appendChild(card);
        });

        if (emptyState) {
            emptyState.hidden = visibleCount > 0;

            const title = document.getElementById(
                "collection-empty-title"
            );

            const description = document.getElementById(
                "collection-empty-description"
            );

            if (title) {
                title.textContent = savedItems.length
                    ? "No discoveries in this category."
                    : "Your collection is waiting.";
            }

            if (description) {
                description.textContent = savedItems.length
                    ? "Try another category or explore more exhibits."
                    : "Visit Discover to find and save something extraordinary.";
            }
        }
    }

    /* Category filters */

    filters.forEach(button => {
        button.addEventListener("click", () => {
            activeFilter =
                button.dataset.collectionFilter || "all";

            filters.forEach(filter => {
                const isActive = filter === button;

                filter.classList.toggle("is-active", isActive);
                filter.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            renderCollection();
        });
    });

    /* Sorting control */

    if (sortSelect) {
        sortSelect.addEventListener("change", renderCollection);
    }

    /* Remove a saved discovery */

    grid.addEventListener("click", event => {
        const button = event.target.closest("[data-save-item]");

        if (!button || !grid.contains(button)) return;

        const id = button.dataset.saveItem;

        savedItems = savedItems.filter(item => item !== id);

        if (persistSavedItems()) {
            renderCollection();
        } else {
            savedItems = readSavedItems();
            renderCollection();
        }
    });

    /* Initial render */

    renderCollection();
});
