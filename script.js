/* =========================================================
   Abrish Fatima — Portfolio scripts
   ========================================================= */

// Set your contact email here — it updates the contact link and the form.
const CONTACT_EMAIL = "your.email@example.com";

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year & email ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
  const emailLink = document.getElementById("emailLink");
  const emailText = document.getElementById("emailText");
  if (emailLink) emailLink.href = `mailto:${CONTACT_EMAIL}`;
  if (emailText) emailText.textContent = CONTACT_EMAIL;

  /* ---------- Nav: scrolled state + progress bar ---------- */
  const nav = document.getElementById("nav");
  const progress = document.querySelector(".scroll-progress");

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 20);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = max > 0 ? `${(y / max) * 100}%` : "0";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  const setMenu = (open) => {
    toggle.classList.toggle("open", open);
    links.classList.toggle("open", open);
    nav.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  toggle.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 820) setMenu(false); });

  /* ---------- Active nav link on scroll ---------- */
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");

  const setActive = (id) => {
    navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${id}`));
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- Reveal on scroll (with stagger) ---------- */
  const reveals = document.querySelectorAll(".reveal");

  // Stagger siblings that share a parent
  const groups = new Map();
  reveals.forEach((el) => {
    const parent = el.parentElement;
    const i = groups.get(parent) || 0;
    el.style.transitionDelay = `${Math.min(i * 90, 450)}ms`;
    groups.set(parent, i + 1);
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Typing effect ---------- */
  const typed = document.getElementById("typed");
  const phrases = [
    "AI Automation & Workflow Builder",
    "Building workflows with n8n",
    "Integrating Claude into processes",
    "Connecting APIs with FastAPI",
  ];

  if (typed && !prefersReducedMotion) {
    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let deleting = true;

    const tick = () => {
      const current = phrases[phraseIndex];
      if (deleting) {
        charIndex--;
        typed.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          return setTimeout(tick, 350);
        }
        return setTimeout(tick, 32);
      }
      const next = phrases[phraseIndex];
      charIndex++;
      typed.textContent = next.slice(0, charIndex);
      if (charIndex === next.length) {
        deleting = true;
        return setTimeout(tick, 2200);
      }
      return setTimeout(tick, 60);
    };
    setTimeout(tick, 2600);
  }

  /* ---------- Hero workflow animation ---------- */
  const steps = [
    { node: ".n1", log: "[ok] trigger received" },
    { node: ".n2", log: "[ok] data fetched via API" },
    { node: ".n3", log: "[ok] AI step: summarised & classified" },
    { node: ".n4", log: "[ok] routed by condition" },
    { node: ".n5", log: "[ok] output delivered" },
  ];
  const flowLog = document.getElementById("flowLog");
  let stepIndex = 0;

  const runStep = () => {
    document.querySelectorAll(".node").forEach((n) => n.classList.remove("active"));
    const step = steps[stepIndex];
    const node = document.querySelector(step.node);
    if (node) node.classList.add("active");
    if (flowLog) flowLog.innerHTML = `<span class="log-line">${step.log}</span>`;
    stepIndex = (stepIndex + 1) % steps.length;
  };

  if (!prefersReducedMotion) {
    runStep();
    setInterval(runStep, 1600);
  } else {
    document.querySelector(".n3")?.classList.add("active");
  }

  /* ---------- Skill card cursor glow ---------- */
  document.querySelectorAll(".skill-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  });

  /* ---------- Contact form (no backend: opens email client) ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  const setStatus = (msg, type = "") => {
    status.textContent = msg;
    status.className = `form-status ${type}`;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = {
      name: form.name,
      email: form.email,
      message: form.message,
    };
    let valid = true;

    Object.values(fields).forEach((input) => {
      const ok = input.value.trim() !== "" && (input.type !== "email" || /^\S+@\S+\.\S+$/.test(input.value.trim()));
      input.closest(".field").classList.toggle("invalid", !ok);
      if (!ok) valid = false;
    });

    if (!valid) {
      setStatus("Please fill in all fields with a valid email address.", "error");
      return;
    }

    const subject = encodeURIComponent(`Portfolio enquiry from ${fields.name.value.trim()}`);
    const body = encodeURIComponent(
      `${fields.message.value.trim()}\n\n— ${fields.name.value.trim()} (${fields.email.value.trim()})`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setStatus("Opening your email app to send the message…", "success");
    form.reset();
  });

  form.querySelectorAll("input, textarea").forEach((input) =>
    input.addEventListener("input", () => input.closest(".field").classList.remove("invalid"))
  );
});