const revealTargets = document.querySelectorAll("[data-reveal]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const staggerGroups = document.querySelectorAll(".stagger");

const directionSet = [
  { x: "-60px", y: "0px", r: "-2deg" },
  { x: "60px", y: "0px", r: "2deg" },
  { x: "0px", y: "-60px", r: "-2deg" },
  { x: "0px", y: "60px", r: "2deg" },
];

const shuffle = (list) => {
  const array = [...list];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

staggerGroups.forEach((group) => {
  const items = Array.from(group.children);
  const pool = shuffle(directionSet);
  items.forEach((item, index) => {
    const direction = pool[index % pool.length];
    item.style.setProperty("--from-x", direction.x);
    item.style.setProperty("--from-y", direction.y);
    item.style.setProperty("--from-rot", direction.r);
  });
});

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
  const tiltTargets = document.querySelectorAll(".hero-card, .panel, .flow-card, .pricing-card, .apply-form, .timeline-item, .week-card, .tool-card");
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

  tiltTargets.forEach((target) => {
    const intensity = 6;
    target.addEventListener("mousemove", (event) => {
      const rect = target.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateX = (relY * -intensity).toFixed(2);
      const rotateY = (relX * intensity).toFixed(2);
      target.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    target.addEventListener("mouseleave", () => {
      target.style.transform = "";
    });
  });

  updateParallax();
}
