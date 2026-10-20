
/*
   CURIO MUSEUM
   Main JavaScript
  
   */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
    initMobileNavigation();
    initSearch();
    initHeader();
    initCurrentYear();
    initActiveNavigation();
    initSmoothScrolling();
    initScrollReveal();
    initNewsletterForm();
    initEscapeKey();
});


/* 
   01. MOBILE NAVIGATION
 */

function initMobileNavigation() {
    const menuToggle = document.querySelector(
        ".menu-toggle, [data-menu-toggle]"
    );

    const navigation = document.querySelector(
        ".primary-navigation, [data-primary-navigation]"
    );

    if (!menuToggle || !navigation) {
        return;
    }

    function openMenu() {
        navigation.classList.add("is-open");
        menuToggle.classList.add("is-active");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
        document.body.classList.add("menu-open");
    }

    function closeMenu() {
        navigation.classList.remove("is-open");
        menuToggle.classList.remove("is-active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        document.body.classList.remove("menu-open");
    }

    function toggleMenu() {
        if (navigation.classList.contains("is-open")) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-controls", navigation.id || "primary-navigation");

    if (!navigation.id) {
        navigation.id = "primary-navigation";
    }

    menuToggle.addEventListener("click", toggleMenu);

    navigation.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            closeMenu();
        });
    });

    document.addEventListener("click", function (event) {
        if (
            navigation.classList.contains("is-open") &&
            !navigation.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMenu();
        }
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 767) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            navigation.classList.contains("is-open")
        ) {
            closeMenu();
            menuToggle.focus();
        }
    });
}


/* ---------------------------------------------------------
   02. SEARCH PANEL
   --------------------------------------------------------- */

function initSearch() {
    const searchPanel = document.querySelector(
        ".header-search, [data-search-panel]"
    );

    const searchToggle = document.querySelector(
        ".search-toggle, [data-search-toggle]"
    );

    const searchClose = document.querySelector(
        ".search-close, [data-search-close]"
    );

    const searchForm = document.querySelector(
        ".header-search-form, [data-search-form]"
    );

    const searchInput = searchForm
        ? searchForm.querySelector(
            'input[type="search"], input[name="q"], input[name="search"]'
        )
        : null;

    function openSearch() {
        if (!searchPanel) {
            return;
        }

        searchPanel.hidden = false;
        searchPanel.classList.add("is-open");

        if (searchToggle) {
            searchToggle.setAttribute("aria-expanded", "true");
        }

        if (searchInput) {
            searchInput.focus();
        }
    }

    function closeSearch() {
        if (!searchPanel) {
            return;
        }

        searchPanel.classList.remove("is-open");
        searchPanel.hidden = true;

        if (searchToggle) {
            searchToggle.setAttribute("aria-expanded", "false");
        }
    }

    if (searchPanel && searchToggle) {
        searchPanel.hidden = true;
        searchToggle.setAttribute("aria-expanded", "false");

        searchToggle.addEventListener("click", function () {
            if (
                searchPanel.hidden ||
                !searchPanel.classList.contains("is-open")
            ) {
                openSearch();
            } else {
                closeSearch();
            }
        });
    }

    if (searchClose) {
        searchClose.addEventListener("click", closeSearch);
    }

    if (searchForm && searchInput) {
        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const query = searchInput.value.trim();

            if (!query) {
                searchInput.focus();
                return;
            }

            const destination = new URL(
                "discover.html",
                window.location.href
            );

            destination.searchParams.set("q", query);

            window.location.href = destination.href;
        });
    }

    document.addEventListener("click", function (event) {
        if (
            searchPanel &&
            !searchPanel.hidden &&
            !searchPanel.contains(event.target) &&
            searchToggle &&
            !searchToggle.contains(event.target)
        ) {
            closeSearch();
        }
    });
}


/* ---------------------------------------------------------
   03. HEADER SCROLL EFFECT
   --------------------------------------------------------- */

function initHeader() {
    const header = document.querySelector(
        ".site-header, [data-site-header]"
    );

    if (!header) {
        return;
    }

    const scrollThreshold = 30;
    let scheduled = false;

    function updateHeader() {
        const isScrolled = window.scrollY > scrollThreshold;

        header.classList.toggle("is-scrolled", isScrolled);
        scheduled = false;
    }

    function onScroll() {
        if (scheduled) {
            return;
        }

        scheduled = true;
        window.requestAnimationFrame(updateHeader);
    }

    window.addEventListener("scroll", onScroll, {
        passive: true
    });

    updateHeader();
}


/* ---------------------------------------------------------
   04. AUTOMATIC COPYRIGHT YEAR
   --------------------------------------------------------- */

function initCurrentYear() {
    const yearElements = document.querySelectorAll(
        "[data-current-year]"
    );

    const currentYear = new Date().getFullYear();

    yearElements.forEach(function (element) {
        element.textContent = currentYear;
    });
}


/* ---------------------------------------------------------
   05. ACTIVE NAVIGATION LINK
   --------------------------------------------------------- */

function initActiveNavigation() {
    const navigationLinks = document.querySelectorAll(
        ".primary-navigation a[href], .nav-link[href]"
    );

    if (!navigationLinks.length) {
        return;
    }

    let currentPath = window.location.pathname;

    currentPath = currentPath.split("/").pop() || "index.html";

    if (!currentPath.includes(".")) {
        currentPath = "index.html";
    }

    navigationLinks.forEach(function (link) {
        const href = link.getAttribute("href");

        if (
            !href ||
            href.startsWith("#") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            href.startsWith("http://") ||
            href.startsWith("https://")
        ) {
            return;
        }

        let linkPath;

        try {
            linkPath = new URL(href, window.location.href)
                .pathname
                .split("/")
                .pop();
        } catch (error) {
            return;
        }

        const isActive = linkPath === currentPath;

        if (isActive) {
            link.classList.add("is-active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("is-active");
            link.removeAttribute("aria-current");
        }
    });
}


/* ---------------------------------------------------------
   06. SMOOTH ANCHOR SCROLLING
   --------------------------------------------------------- */

function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    anchorLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const href = link.getAttribute("href");

            if (!href || href === "#") {
                return;
            }

            let target;

            try {
                target = document.querySelector(href);
            } catch (error) {
                return;
            }

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });

            if (history.replaceState) {
                history.replaceState(null, "", href);
            }
        });
    });
}


/* ---------------------------------------------------------
   07. SCROLL REVEAL ANIMATIONS
   --------------------------------------------------------- */

function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        "[data-reveal]"
    );

    if (!revealElements.length) {
        return;
    }

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        reduceMotion ||
        !("IntersectionObserver" in window)
    ) {
        revealElements.forEach(function (element) {
            element.classList.add("is-visible");
        });

        return;
    }

    revealElements.forEach(function (element) {
        element.classList.add("reveal-pending");
    });

    const observer = new IntersectionObserver(
        function (entries, currentObserver) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                entry.target.classList.remove("reveal-pending");

                currentObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    revealElements.forEach(function (element) {
        observer.observe(element);
    });
}


/* ---------------------------------------------------------
   08. NEWSLETTER FORM VALIDATION
   --------------------------------------------------------- */

function initNewsletterForm() {
    const newsletterForms = document.querySelectorAll(
        ".newsletter-form, [data-newsletter-form]"
    );

    newsletterForms.forEach(function (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const emailInput = form.querySelector(
                'input[type="email"]'
            );

            let message = form.querySelector(
                ".newsletter-message, [data-form-message]"
            );

            if (!emailInput) {
                return;
            }

            if (!message) {
                message = document.createElement("p");
                message.className = "newsletter-message";
                message.setAttribute("role", "status");
                message.setAttribute("aria-live", "polite");

                form.appendChild(message);
            }

            const email = emailInput.value.trim();

            if (!email || !emailInput.checkValidity()) {
                message.textContent =
                    "Please enter a valid email address.";

                message.classList.remove("status-success");
                message.classList.add("status-error");

                emailInput.focus();
                return;
            }

            /*
             * Frontend-only project:
             * A real subscription needs a backend or email service.
             */

            message.textContent =
                "Your email is valid. Newsletter subscription will be available when a mailing service is connected.";

            message.classList.remove("status-error");
            message.classList.add("status-success");
        });
    });
}


/* ---------------------------------------------------------
   09. GLOBAL ESCAPE KEY SUPPORT
   --------------------------------------------------------- */

function initEscapeKey() {
    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") {
            return;
        }

        const openPanels = document.querySelectorAll(
            ".header-search.is-open, [data-search-panel].is-open"
        );

        openPanels.forEach(function (panel) {
            panel.classList.remove("is-open");
            panel.hidden = true;
        });

        const searchToggle = document.querySelector(
            ".search-toggle, [data-search-toggle]"
        );

        if (searchToggle) {
            searchToggle.setAttribute("aria-expanded", "false");
        }
    });
}


/* ---------------------------------------------------------
   10. SHARED BUTTON FEEDBACK
   --------------------------------------------------------- */

function showCurioMessage(element, message, type) {
    if (!element) {
        return;
    }

    element.textContent = message;

    element.classList.remove(
        "status-success",
        "status-error",
        "status-info"
    );

    element.classList.add(
        type === "success"
            ? "status-success"
            : type === "error"
                ? "status-error"
                : "status-info"
    );

    element.hidden = false;
}


/* ---------------------------------------------------------
   11. GLOBAL DATA AVAILABILITY CHECK
   --------------------------------------------------------- */

function getCurioData() {
    if (!window.CURIO_DATA) {
        console.error(
            "Curio data was not loaded. Check js/data.js in your HTML."
        );

        return null;
    }

    return window.CURIO_DATA;
}
