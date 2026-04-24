const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
  }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const topbar = document.querySelector(".topbar");

const syncTopbar = () => {
  topbar.classList.toggle("topbar--scrolled", window.scrollY > 14);
};

syncTopbar();
window.addEventListener("scroll", syncTopbar, { passive: true });

const slides = [...document.querySelectorAll(".hero-slide")];
const thumbs = [...document.querySelectorAll(".hero-thumb")];
let activeSlide = 0;
let slideshowTimer;

const setSlide = (index) => {
  activeSlide = index;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === index);
  });

  thumbs.forEach((thumb, thumbIndex) => {
    thumb.classList.toggle("is-active", thumbIndex === index);
  });
};

const startSlideshow = () => {
  if (prefersReducedMotion.matches) {
    return;
  }

  clearInterval(slideshowTimer);
  slideshowTimer = window.setInterval(() => {
    const nextIndex = (activeSlide + 1) % slides.length;
    setSlide(nextIndex);
  }, 3800);
};

thumbs.forEach((thumb) => {
  thumb.addEventListener("click", () => {
    setSlide(Number(thumb.dataset.slide));
    startSlideshow();
  });
});

setSlide(0);
startSlideshow();

if (!prefersReducedMotion.matches) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -8;
      const rotateY = ((x / rect.width) - 0.5) * 8;

      card.style.transform = `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
