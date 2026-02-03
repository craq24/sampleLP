const revealTargets = document.querySelectorAll("[data-reveal]");
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
