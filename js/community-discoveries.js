"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "/api/discoveries";

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

    let discoveries = [];

    // Read the error message sent by the API, or use a fallback message.
    async function readError(response, fallback) {
        try {
            const body = await response.json();

            if (body && typeof body.error === "string") {
                return body.error;
            }
        } catch (parseError) {
            // The response body was not JSON; use the fallback message.
        }

        return fallback;
    }

    // Turn any error into a message that is safe to show to the user.
    function friendlyMessage(error) {
        if (error instanceof TypeError) {
            return "Cannot reach the server. Check your connection and try again.";
        }

        return error.message || "Something went wrong. Please try again.";
    }

    // Disable the form while a request is running.
    function setBusy(isBusy) {
        form.setAttribute("aria-busy", String(isBusy));
        submitButton.disabled = isBusy;
        cancelButton.disabled = isBusy;
    }

    // Load discoveries from the API. Returns true on success.
    async function fetchDiscoveries() {
        list.setAttribute("aria-busy", "true");
        summary.textContent = "Loading discoveries...";

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(
                    await readError(response, "Failed to load discoveries.")
                );
            }

            discoveries = await response.json();
            renderDiscoveries();
            return true;
        } catch (error) {
            console.error("Failed to load discoveries:", error);
            renderLoadError(friendlyMessage(error));
            return false;
        } finally {
            list.removeAttribute("aria-busy");
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

    function renderLoadError(message) {
        list.replaceChildren();
        count.textContent = "00";
        summary.textContent = "Discoveries could not be loaded.";

        const box = makeElement("div", "community-empty");
        box.setAttribute("role", "alert");
        box.append(
            makeElement("h3", "", "Discoveries unavailable"),
            makeElement("p", "", message),
            makeButton("Try again", "retry", "community-submit", "retry")
        );

        list.append(box);
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

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const data = getFormData();
        const currentId = editId.value;
        const isEdit = Boolean(currentId);

        setBusy(true);
        showStatus(isEdit ? "Updating discovery..." : "Publishing discovery...");

        try {
            const response = await fetch(
                isEdit ? `${API_URL}/${encodeURIComponent(currentId)}` : API_URL,
                {
                    method: isEdit ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            if (!response.ok) {
                throw new Error(
                    await readError(
                        response,
                        isEdit
                            ? "Failed to update discovery."
                            : "Failed to publish discovery."
                    )
                );
            }

            resetForm();

            const refreshed = await fetchDiscoveries();

            showStatus(
                refreshed
                    ? (isEdit
                        ? "Discovery updated successfully."
                        : "Discovery published successfully.")
                    : "Saved, but the list could not be refreshed. Please reload the page.",
                !refreshed
            );
        } catch (error) {
            console.error("Failed to save discovery:", error);
            showStatus(friendlyMessage(error), true);
        } finally {
            setBusy(false);
        }
    });

    list.addEventListener("click", async function (event) {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        if (button.dataset.action === "retry") {
            await fetchDiscoveries();
            return;
        }

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

            button.disabled = true;

            try {
                const response = await fetch(
                    `${API_URL}/${encodeURIComponent(id)}`,
                    { method: "DELETE" }
                );

                if (!response.ok) {
                    throw new Error(
                        await readError(response, "Failed to delete discovery.")
                    );
                }

                if (editId.value === id) resetForm();

                const refreshed = await fetchDiscoveries();

                showStatus(
                    refreshed
                        ? "Discovery deleted successfully."
                        : "Deleted, but the list could not be refreshed. Please reload the page.",
                    !refreshed
                );
            } catch (error) {
                console.error("Failed to delete discovery:", error);
                showStatus(friendlyMessage(error), true);
            } finally {
                button.disabled = false;
            }
        }
    });

    cancelButton.addEventListener("click", resetForm);
    search.addEventListener("input", renderDiscoveries);
    filter.addEventListener("change", renderDiscoveries);
fetchDiscoveries();
});