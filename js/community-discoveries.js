
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const STORAGE_KEY = "curioCommunityDiscoveries";

    const form = document.getElementById("discovery-form");
    const list = document.getElementById("discovery-list");
    const search = document.getElementById("discovery-search");
    const filter = document.getElementById("category-filter");
    const count = document.getElementById("discovery-count");
    const summary = document.getElementById("results-summary");
    const status = document.getElementById("form-status");
    const editId = document.getElementById("edit-id");
    const formHeading = document.getElementById("form-heading");
    const submitButton = document.getElementById("submit-discovery");
    const cancelButton = document.getElementById("cancel-edit");

    const fields = {
        title: document.getElementById("discovery-title"),
        category: document.getElementById("discovery-category"),
        period: document.getElementById("discovery-period"),
        location: document.getElementById("discovery-location"),
        contributor: document.getElementById("discovery-contributor"),
        description: document.getElementById("discovery-description"),
        reference: document.getElementById("discovery-reference")
    };

    let discoveries = loadDiscoveries();

    function loadDiscoveries() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const records = saved ? JSON.parse(saved) : [];
            return Array.isArray(records) ? records : [];
        } catch (error) {
            return [];
        }
    }

    function saveDiscoveries() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(discoveries));
            return true;
        } catch (error) {
            showStatus(
                "Browser storage is unavailable. Changes may not persist.",
                true
            );
            return false;
        }
    }

    function showStatus(message, isError = false) {
        status.textContent = message;
        status.classList.toggle("is-error", isError);
    }

    function makeElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    }

    function makeButton(label, action, className, id) {
        const button = makeElement("button", className, label);
        button.type = "button";
        button.dataset.action = action;
        button.dataset.id = id;
        return button;
    }

    function createEmptyState(message) {
        const empty = makeElement("div", "community-empty");
        empty.append(
            makeElement("h3", "", "Nothing to display yet"),
            makeElement("p", "", message)
        );

        const link = makeElement(
            "a",
            "",
            discoveries.length ? "Return to the form" : "Share the first discovery"
        );
        link.href = "#discovery-form";
        empty.append(link);

        list.append(empty);
    }

    function renderDiscoveries() {
        const query = search.value.trim().toLowerCase();
        const selectedCategory = filter.value;

        const filtered = discoveries.filter(function (item) {
            const searchable = [
                item.title,
                item.category,
                item.period,
                item.location,
                item.contributor,
                item.description,
                item.reference
            ].join(" ").toLowerCase();

            return searchable.includes(query) &&
                (selectedCategory === "all" ||
                 item.category === selectedCategory);
        });

        list.replaceChildren();
        count.textContent = String(filtered.length).padStart(2, "0");

        summary.textContent =
            "Showing " + filtered.length + " of " +
            discoveries.length + " discoveries";

        if (!filtered.length) {
            createEmptyState(
                discoveries.length
                    ? "Try another search term or category."
                    : "No discoveries have been shared yet. Add the first entry using the form."
            );
            return;
        }

        filtered.forEach(function (item, index) {
            const card = makeElement("article", "discovery-card");
            const top = makeElement("div", "discovery-card-top");

            top.append(
                makeElement("span", "discovery-category", item.category),
                makeElement(
                    "span",
                    "discovery-index",
                    "Entry " + String(index + 1).padStart(2, "0")
                )
            );

            const title = makeElement("h3", "", item.title);
            const meta = makeElement("div", "discovery-meta");

            meta.append(
                makeElement("span", "", item.period),
                makeElement("span", "", "·"),
                makeElement("span", "", item.location)
            );

            const description = makeElement(
                "p", "discovery-description", item.description
            );

            card.append(top, title, meta, description);

            if (item.reference) {
                card.append(
                    makeElement(
                        "p",
                        "discovery-reference",
                        "Reference: " + item.reference
                    )
                );
            }

            const footer = makeElement("div", "discovery-card-footer");
            const contributor = makeElement(
                "span", "discovery-contributor",
                "Shared by " + item.contributor
            );

            const actions = makeElement("div", "discovery-card-actions");
            actions.append(
                makeButton("Edit", "edit", "", item.id),
                makeButton("Delete", "delete", "delete-discovery", item.id)
            );

            footer.append(contributor, actions);
            card.append(footer);
            list.append(card);
        });
    }

    function resetForm() {
        form.reset();
        editId.value = "";
        formHeading.textContent = "Share a discovery";
        submitButton.textContent = "Publish discovery";
        cancelButton.hidden = true;
        showStatus("");
    }

    function getFormData() {
        const data = {};

        Object.keys(fields).forEach(function (key) {
            data[key] = fields[key].value.trim();
        });

        return data;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const data = getFormData();
        const currentId = editId.value;

        if (currentId) {
            const index = discoveries.findIndex(
                item => item.id === currentId
            );

            if (index === -1) {
                showStatus("This discovery could not be found.", true);
                return;
            }

            discoveries[index] = {
                ...discoveries[index],
                ...data,
                updatedAt: new Date().toISOString()
            };
        } else {
            const id = window.crypto && crypto.randomUUID
                ? crypto.randomUUID()
                : Date.now().toString(36) +
                  Math.random().toString(36).slice(2);

            discoveries.unshift({
                id: id,
                ...data,
                createdAt: new Date().toISOString()
            });
        }

        const saved = saveDiscoveries();

        resetForm();
        renderDiscoveries();

        showStatus(
            saved
                ? (currentId
                    ? "Discovery updated successfully."
                    : "Discovery published successfully.")
                : "Updated for this session, but could not be saved permanently.",
            !saved
        );
    });

    list.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const id = button.dataset.id;
        const item = discoveries.find(record => record.id === id);

        if (!item) return;

        if (button.dataset.action === "edit") {
            Object.keys(fields).forEach(function (key) {
                fields[key].value = item[key] || "";
            });

            editId.value = item.id;
            formHeading.textContent = "Edit discovery";
            submitButton.textContent = "Update discovery";
            cancelButton.hidden = false;

            showStatus("Editing: " + item.title);
            document.getElementById("discovery-form-panel")
                .scrollIntoView({ behavior: "smooth", block: "start" });
            fields.title.focus();
        }

        if (button.dataset.action === "delete") {
            const confirmed = window.confirm(
                "Delete the discovery \"" + item.title + "\"?"
            );

            if (!confirmed) return;

            discoveries = discoveries.filter(record => record.id !== id);

            if (editId.value === id) resetForm();

            const saved = saveDiscoveries();
            renderDiscoveries();

            showStatus(
                saved
                    ? "Discovery deleted."
                    : "Deleted for this session, but storage is unavailable.",
                !saved
            );
        }
    });

    cancelButton.addEventListener("click", resetForm);
    search.addEventListener("input", renderDiscoveries);
    filter.addEventListener("change", renderDiscoveries);

    renderDiscoveries();
});
