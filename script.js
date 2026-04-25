const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navAnchors = document.querySelectorAll(".nav-links a");
const revealElements = document.querySelectorAll(".reveal");
const navbar = document.querySelector(".navbar");

if (menuToggle && navLinks) {
  menuToggle.setAttribute("aria-expanded", "false");

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navAnchors.forEach((link) => {
  link.addEventListener("click", () => {
    if (navLinks) {
      navLinks.classList.remove("active");
    }

    if (menuToggle) {
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

document.addEventListener("click", (event) => {
  if (!menuToggle || !navLinks) return;
  if (!navLinks.classList.contains("active")) return;
  if (navLinks.contains(event.target) || menuToggle.contains(event.target)) return;

  navLinks.classList.remove("active");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!menuToggle || !navLinks) return;

  navLinks.classList.remove("active");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
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

  if (!href) return;
  if (href.startsWith("#")) return;
  if (href.startsWith("tel:")) return;
  if (href.startsWith("mailto:")) return;

  const normalizedHref = href.replace("./", "");

  if ((currentPath === "" || currentPath === "index.html") && normalizedHref === "index.html") {
    link.classList.add("active");
  } else if (normalizedHref === currentPath) {
    link.classList.add("active");
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealElements.forEach((element) => {
  const siblings = Array.from(element.parentElement?.querySelectorAll(".reveal") || []);
  const index = siblings.indexOf(element);

  if (index > 0) {
    element.style.setProperty("--reveal-delay", `${Math.min(index * 70, 280)}ms`);
  }

  observer.observe(element);
});
