const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navAnchors = document.querySelectorAll(".nav-links a");
const revealElements = document.querySelectorAll(".reveal");
const navbar = document.querySelector(".navbar");

const closeMenu = () => {
  if (!menuToggle || !navLinks) return;
  navLinks.classList.remove("active");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Menü öffnen");
};

if (menuToggle && navLinks) {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
  });
}

navAnchors.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("click", (event) => {
  if (!menuToggle || !navLinks) return;
  if (!navLinks.classList.contains("active")) return;
  if (navLinks.contains(event.target) || menuToggle.contains(event.target)) return;
  closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const updateNavbarState = () => {
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 12);
};

updateNavbarState();
window.addEventListener("scroll", updateNavbarState, { passive: true });

const currentPath = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".nav-links a").forEach((link) => {
  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("tel:") || href.startsWith("mailto:")) return;

  const normalizedHref = href.replace("./", "");
  if ((currentPath === "" || currentPath === "index.html") && normalizedHref === "index.html") {
    link.classList.add("active");
  } else if (normalizedHref === currentPath) {
    link.classList.add("active");
  }
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => {
    const siblings = Array.from(element.parentElement?.querySelectorAll(".reveal") || []);
    const index = siblings.indexOf(element);
    if (index > 0) element.style.setProperty("--reveal-delay", `${Math.min(index * 70, 280)}ms`);
    observer.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add("show"));
}

const tiltCards = document.querySelectorAll(".stat-item, .info-card, .reference-card, .testimonial-card");
const canUseHoverTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (canUseHoverTilt) {
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-x", `${(-y * 4).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(x * 4).toFixed(2)}deg`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
    });
  });
}

document.querySelectorAll(".flip-card").forEach((card) => {
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
  card.setAttribute("aria-pressed", "false");
  const hasFineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  card.querySelectorAll(".flip-back .card-cta-link-zone").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.stopPropagation();
      window.location.href = link.href;
    });
    link.addEventListener("keydown", (event) => {
      event.stopPropagation();
    });
  });

  const toggleCard = () => {
    const isFlipped = card.classList.toggle("is-flipped");
    card.setAttribute("aria-pressed", String(isFlipped));
  };

  const navigateFromLowerLinkZone = (event) => {
    const ctaLink = card.querySelector(".flip-back .card-cta-link-zone, .flip-back .mini-link");
    const isBackVisible = card.classList.contains("is-flipped") || (hasFineHover && card.matches(":hover"));
    if (!ctaLink || !isBackVisible) return false;

    const rect = card.getBoundingClientRect();
    const clientY = event.clientY ?? event.changedTouches?.[0]?.clientY;
    if (typeof clientY !== "number") return false;
    if (clientY < rect.top + rect.height * 0.8) return false;

    event.preventDefault();
    event.stopPropagation();
    window.location.href = ctaLink.href;
    return true;
  };

  card.addEventListener(
    "pointerup",
    (event) => {
      if (hasFineHover && event.pointerType !== "touch") return;
      navigateFromLowerLinkZone(event);
    },
    { capture: true }
  );

  card.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (link) {
      event.stopPropagation();
      return;
    }
    if (navigateFromLowerLinkZone(event)) return;
    toggleCard();
  });
  card.addEventListener("keydown", (event) => {
    if (event.target.closest("a")) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleCard();
  });
});

const embeddedChatbotFrame = document.querySelector("[data-embedded-chatbot-frame]");

if (embeddedChatbotFrame) {
  const widgetUrl = new URL(
    embeddedChatbotFrame.dataset.widgetSrc || "https://demo-handwerker.onrender.com/widget.html",
    window.location.href
  );
  const botId = embeddedChatbotFrame.dataset.botId || "fp-demo";
  const widgetTitle = embeddedChatbotFrame.dataset.widgetTitle || "F&P Anfrageannahme";

  widgetUrl.searchParams.set("botId", botId);
  widgetUrl.searchParams.set("sourceUrl", window.location.href);
  widgetUrl.searchParams.set("sourceHost", window.location.host);
  widgetUrl.searchParams.set("sourcePath", window.location.pathname);
  widgetUrl.searchParams.set("pageTitle", document.title || "");
  widgetUrl.searchParams.set("widgetTitle", widgetTitle);

  embeddedChatbotFrame.src = widgetUrl.href;

  const fitEmbeddedChatbot = () => {
    const frameWrap = embeddedChatbotFrame.closest(".embedded-chatbot-frame-wrap");
    if (!frameWrap) return;

    const baseMobileWidth = 440;
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const wrapWidth = frameWrap.clientWidth;
    const availableWidth = Math.max(0, Math.min(wrapWidth || viewportWidth, viewportWidth - 24));
    const shouldScale = viewportWidth <= 700 && availableWidth > 0 && availableWidth < baseMobileWidth;

    if (!shouldScale) {
      embeddedChatbotFrame.style.width = "";
      embeddedChatbotFrame.style.height = "";
      embeddedChatbotFrame.style.transform = "";
      return;
    }

    const scale = availableWidth / baseMobileWidth;
    embeddedChatbotFrame.style.width = `${baseMobileWidth}px`;
    embeddedChatbotFrame.style.height = `${100 / scale}%`;
    embeddedChatbotFrame.style.transform = `scale(${scale})`;
  };

  fitEmbeddedChatbot();
  window.addEventListener("resize", fitEmbeddedChatbot);
}
