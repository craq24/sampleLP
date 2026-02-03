const revealTargets = document.querySelectorAll("[data-reveal]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
    rootMargin: "0px 0px -10% 0px",
  }
);

revealTargets.forEach((target) => observer.observe(target));

if (!prefersReducedMotion) {
  const parallaxTargets = document.querySelectorAll("[data-parallax]");
  let mouseX = 0.5;
  let mouseY = 0.5;
  let rafId = null;

  const updateParallax = () => {
    const viewportHeight = window.innerHeight || 1;
    parallaxTargets.forEach((target) => {
      const speed = Number(target.dataset.speed || 0.2);
      const rect = target.getBoundingClientRect();
      const elementMid = rect.top + rect.height * 0.5;
      const scrollFactor = (elementMid - viewportHeight * 0.5) / viewportHeight;
      const translateY = -scrollFactor * 40 * speed + (mouseY - 0.5) * 40 * speed;
      const translateX = (mouseX - 0.5) * 40 * speed;
      target.style.transform = `translate3d(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px, 0)`;
    });
    rafId = null;
  };

  const requestTick = () => {
    if (!rafId) {
      rafId = window.requestAnimationFrame(updateParallax);
    }
  };

  window.addEventListener("scroll", () => {
    requestTick();
  }, { passive: true });

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX / window.innerWidth;
    mouseY = event.clientY / window.innerHeight;
    requestTick();
  });

  updateParallax();
}
