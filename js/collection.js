
/* 
   CURIO MUSEUM — COLLECTION PAGE
   */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const page = document.querySelector(".collection-page");
    const grid = document.getElementById("collection-grid");

    if (!page || !grid) return;

    const cards = Array.from(
        grid.querySelectorAll("[data-collection-card]")
    );

    const filters = Array.from(
        page.querySelectorAll("[data-collection-filter]")
    );

    const sortSelect = document.getElementById("collection-sort");
    const emptyState = document.getElementById("collection-empty");
    const storageKey = "curio-saved-discoveries";

    let activeFilter = "all";
    let savedItems = readSavedItems();

    /* Read saved items safely */

    function readSavedItems() {
        try {
            const stored = localStorage.getItem(storageKey);

            if (stored === null) {
                return cards
                    .map(getCardId)
                    .filter(Boolean);
            }

            const parsed = JSON.parse(stored);

            return Array.isArray(parsed)
                ? parsed.filter(item => typeof item === "string")
                : [];
        } catch (error) {
            console.warn("Unable to read saved discoveries.", error);

            return cards
                .map(getCardId)
                .filter(Boolean);
        }
    }

    /* Save collection to the browser */

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

    function getCardId(card) {
        return card.querySelector("[data-save-item]")
            ?.dataset.saveItem || "";
    }

    function getCardTitle(card) {
        return card.dataset.title || "Discovery";
    }

    /* Update accessible save button */

    function updateSaveButton(button, isSaved) {
        const card = button.closest("[data-collection-card]");

        if (!card) return;

        const title = getCardTitle(card);

        button.classList.toggle("is-saved", isSaved);
        button.setAttribute("aria-pressed", String(isSaved));
        button.setAttribute(
            "aria-label",
            `${isSaved ? "Remove" : "Save"} ${title} ${
                isSaved ? "from" : "to"
            } your collection`
        );

        button.textContent = isSaved ? "♥" : "♡";
    }

    /* Sorting */

    function getSortedCards() {
        const sortMode = sortSelect?.value || "default";
        const orderedCards = [...cards];

        if (sortMode === "title") {
            orderedCards.sort((a, b) =>
                getCardTitle(a).localeCompare(getCardTitle(b))
            );
        } else if (sortMode === "category") {
            orderedCards.sort((a, b) =>
                (a.dataset.category || "").localeCompare(
                    b.dataset.category || ""
                )
            );
        }

        return orderedCards;
    }

    /* Render visible discoveries */

    function renderCollection() {
        const orderedCards = getSortedCards();
        let visibleCount = 0;

        orderedCards.forEach(card => {
            const id = getCardId(card);
            const isSaved = savedItems.includes(id);

            const matchesCategory =
                activeFilter === "all" ||
                card.dataset.category === activeFilter;

            const shouldShow = Boolean(id) &&
                isSaved &&
                matchesCategory;

            card.hidden = !shouldShow;

            const saveButton = card.querySelector("[data-save-item]");

            if (saveButton) {
                updateSaveButton(saveButton, isSaved);
            }

            if (shouldShow) {
                visibleCount++;

                /*
                 * Make filtered cards visible again even when
                 * they were hidden before entering the viewport.
                 */
                card.classList.add("is-visible");
            }

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

    /* Category filter buttons */

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

    /* Sort control */

    if (sortSelect) {
        sortSelect.addEventListener("change", renderCollection);
    }

    /* Save and remove buttons */

    grid.addEventListener("click", event => {
        const button = event.target.closest("[data-save-item]");

        if (!button || !grid.contains(button)) return;

        const id = button.dataset.saveItem;

        if (!id) return;

        const isSaved = savedItems.includes(id);

        if (isSaved) {
            savedItems = savedItems.filter(item => item !== id);
        } else {
            savedItems = [...savedItems, id];
        }

        persistSavedItems();
        renderCollection();
    });

    /* Scroll reveal transitions */

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const revealElements = Array.from(
        page.querySelectorAll(
            ".collection-section-header, " +
            ".collection-toolbar, " +
            ".collection-card, " +
            ".collection-callout"
        )
    );

    if (!reduceMotion && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -30px 0px"
            }
        );

        revealElements.forEach(element => {
            element.classList.add("collection-reveal");

            /*
             * Observe cards even if the initial filter hides them.
             * The render function handles their visibility later.
             */
            observer.observe(element);
        });
    } else {
        revealElements.forEach(element => {
            element.classList.add("is-visible");
        });
    }

    /* Initial page render */

    renderCollection();
});
