
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("marketplace-products");
    const filters = document.querySelectorAll("[data-market-filter]");
    const count = document.getElementById("cart-count");
    const feedback = document.getElementById("marketplace-feedback");
    const storageKey = "curio-cart";

    if (!grid) return;

    let cart = [];
    async function loadProducts() {
    const response = await fetch("/api/marketplace");

    if (!response.ok) {
        throw new Error("Unable to load marketplace products");
    }

    return response.json();
}
let products = [];

    /* READ CART */

    function readCart() {
        try {
            const stored = JSON.parse(
                localStorage.getItem(storageKey) || "[]"
            );

            if (!Array.isArray(stored)) return [];

            return stored.filter(item =>
                item &&
                typeof item.id === "string" &&
                typeof item.name === "string" &&
                Number.isFinite(Number(item.price)) &&
                Number(item.price) >= 0 &&
                Number.isInteger(Number(item.quantity)) &&
                Number(item.quantity) > 0
            ).map(item => ({
                id: item.id,
                name: item.name,
                price: Number(item.price),
                quantity: Number(item.quantity)
            }));
        } catch (error) {
            console.warn("Unable to read CURIO cart.", error);
            return [];
        }
    }

    /* SAVE CART */

    function saveCart() {
        try {
            localStorage.setItem(
                storageKey,
                JSON.stringify(cart)
            );
            return true;
        } catch (error) {
            console.warn("Unable to save CURIO cart.", error);
            return false;
        }
    }

    /* UPDATE CART COUNT */

    function updateCount() {
        if (!count) return;

        count.textContent = cart.reduce(
            (total, item) => total + item.quantity,
            0
        );
    }

    /* CATEGORY FILTERS */

    filters.forEach(button => {
        button.addEventListener("click", () => {
            const category = button.dataset.marketFilter || "all";

            filters.forEach(filter => {
                const active = filter === button;

                filter.classList.toggle("is-active", active);
                filter.setAttribute("aria-pressed", String(active));
            });

            grid.querySelectorAll(".market-product").forEach(card => {
                card.hidden =
                    category !== "all" &&
                    card.dataset.category !== category;
            });
        });
    });

    /* ADD PRODUCTS TO CART */

    grid.addEventListener("click", event => {
        const button = event.target.closest("[data-add-to-cart]");

        if (!button || !grid.contains(button)) return;

        const card = button.closest(".market-product");

        if (!card) return;
const id = card.dataset.productId;
const product = products.find(item => item.id === id);

const name = product?.name || card.dataset.name;
const price = product
    ? Number(product.price)
    : Number(card.dataset.price);

        if (!id || !name || !Number.isFinite(price) || price < 0) {
            if (feedback) {
                feedback.textContent = "Unable to add this artifact.";
            }
            return;
        }

        const existing = cart.find(item => item.id === id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price,
                quantity: 1
            });
        }

        const saved = saveCart();

        updateCount();

        if (feedback) {
            feedback.textContent = saved
                ? `${name} added to your cart.`
                : "Cart updated for this session, but browser storage failed.";
        }

        button.textContent = saved ? "Added ✓" : "Added (not saved)";
        button.setAttribute("aria-label", `${name} added to cart`);

        button.disabled = true;

        button.textContent = "Added ✓";
button.setAttribute("aria-label", `Add another ${name} to cart`);
button.disabled = false;
    });

    /* INITIAL STATE */

    cart = readCart();
    updateCount();
    loadProducts()
    .then(data => {
        products = data;
    })
    .catch(error => {
        console.error("Marketplace products could not be loaded:", error);
    });
});
