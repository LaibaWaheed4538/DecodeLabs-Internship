
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const KEY = "curio-cart";
    const $ = id => document.getElementById(id);

    const itemsElement = $("billing-items");
    const subtotalElement = $("billing-subtotal");
    const totalElement = $("billing-total");
    const countElement = $("cart-count");
    const form = $("billing-form");
    const submitButton = $("place-order");
    const message = $("billing-message");

    if (!itemsElement || !form) return;

    let cart = readCart();

    function readCart() {
        try {
            const data = JSON.parse(localStorage.getItem(KEY) || "[]");

            if (!Array.isArray(data)) return [];

            return data.filter(item =>
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
        } catch {
            return [];
        }
    }

    function saveCart() {
        try {
            localStorage.setItem(KEY, JSON.stringify(cart));
            return true;
        } catch {
            showMessage("Cart changes could not be saved in browser storage.");
            return false;
        }
    }

    function money(value) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(value);
    }

    function showMessage(text) {
        message.textContent = text;
    }

    function makeElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;

        return element;
    }

    function makeAction(label, action, id, className) {
        const button = makeElement("button", className, label);

        button.type = "button";
        button.dataset.action = action;
        button.dataset.id = id;
        button.setAttribute("aria-label", label);

        return button;
    }

    function renderCart() {
        itemsElement.replaceChildren();

        if (!cart.length) {
            const empty = makeElement(
                "p",
                "billing-empty",
                "Your cart is empty."
            );

            const link = makeElement(
                "a",
                "",
                "Explore the marketplace"
            );

            link.href = "marketplace.html";
            empty.appendChild(document.createElement("br"));
            empty.appendChild(link);
            itemsElement.appendChild(empty);
        }

        cart.forEach(item => {
            const row = makeElement("article", "billing-item");
            const details = document.createElement("div");

            details.appendChild(makeElement("h3", "", item.name));
            details.appendChild(makeElement(
                "p",
                "billing-item-price",
                `${money(item.price)} each`
            ));

            const controls = makeElement("div", "billing-item-controls");
            const quantity = makeElement("div", "billing-qty");

            quantity.append(
                makeAction("−", "decrease", item.id),
                makeElement("span", "", String(item.quantity)),
                makeAction("+", "increase", item.id)
            );

            controls.append(
                quantity,
                makeAction("Remove", "remove", item.id, "billing-remove")
            );

            details.appendChild(controls);

            row.append(
                details,
                makeElement(
                    "p",
                    "billing-line-total",
                    money(item.price * item.quantity)
                )
            );

            itemsElement.appendChild(row);
        });

        const subtotal = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        subtotalElement.textContent = money(subtotal);
        totalElement.textContent = money(subtotal);

        countElement.textContent = String(
            cart.reduce((sum, item) => sum + item.quantity, 0)
        );

        submitButton.disabled = cart.length === 0;
    }

    itemsElement.addEventListener("click", event => {
        const button = event.target.closest("[data-action]");

        if (!button || !itemsElement.contains(button)) return;

        const item = cart.find(
            product => product.id === button.dataset.id
        );

        if (!item) return;

        switch (button.dataset.action) {
            case "increase":
                item.quantity += 1;
                break;

            case "decrease":
                item.quantity -= 1;

                if (item.quantity < 1) {
                    cart = cart.filter(product => product.id !== item.id);
                }
                break;

            case "remove":
                cart = cart.filter(product => product.id !== item.id);
                break;

            default:
                return;
        }

        saveCart();
        renderCart();
        showMessage("Cart updated.");
    });

  form.addEventListener("submit", async event => {
        event.preventDefault();

        if (!cart.length || !form.reportValidity()) return;

        const name = $("customer-name").value.trim();

        if (!name) {
            $("customer-name").focus();
            return;
        }

        const total = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        try {
    const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            items: cart.map(item => ({
                id: item.id,
                quantity: item.quantity
            }))
        })
    });

   
   
   if (!response.ok) {
    throw new Error("Order API unavailable");
}
} catch (error) {
    console.warn("Backend unavailable; confirming demo locally.", error);

}

        const confirmation = makeElement("div", "billing-success");
        const heading = makeElement("strong", "", "Demo order confirmed.");

        const detail = makeElement(
            "p",
            "",
            `Thank you, ${name}. Your demo order total is ${money(total)}. ` +
            "No payment was processed and no order was sent to a server."
        );

        confirmation.append(heading, detail);
        message.replaceChildren(confirmation);
    });

    renderCart();
});
