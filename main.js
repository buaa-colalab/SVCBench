// SVCBench project page interactions.
// Animation via GSAP + ScrollTrigger; no scroll event listeners.

const MODELS = [
  { name: "Human", cat: "human", label: "Human", gpa: 96.1, moc: 100.0, uda: 99.3 },
  { name: "Gemini-3-Flash", cat: "prop", label: "Proprietary", gpa: 37.0, moc: 73.7, uda: 73.8 },
  { name: "Doubao-Seed-1.8", cat: "prop", label: "Proprietary", gpa: 36.2, moc: 77.2, uda: 76.8 },
  { name: "Qwen3-VL-8B", cat: "open", label: "Open-source", gpa: 31.0, moc: 84.3, uda: 55.1 },
  { name: "Qwen3.5-35B-A3B", cat: "open", label: "Open-source", gpa: 29.3, moc: 82.4, uda: 59.0 },
  { name: "GPT-5.4", cat: "prop", label: "Proprietary", gpa: 29.1, moc: 71.8, uda: 59.3 },
  { name: "Qwen3-VL-30B", cat: "open", label: "Open-source", gpa: 27.0, moc: 84.6, uda: 56.4 },
  { name: "Kimi-K2.5", cat: "prop", label: "Proprietary", gpa: 26.4, moc: 66.8, uda: 73.4 },
  { name: "InternVL-3.5-8B", cat: "open", label: "Open-source", gpa: 24.2, moc: 81.6, uda: 55.6 },
  { name: "Flash-VStream-7B", cat: "online", label: "Online", gpa: 23.4, moc: 78.5, uda: 34.7 },
  { name: "LiveStar", cat: "online", label: "Online", gpa: 19.9, moc: 86.4, uda: 36.8 },
  { name: "Qwen2.5-VL-7B", cat: "open", label: "Open-source", gpa: 19.1, moc: 68.2, uda: 40.8 },
  { name: "StreamingVLM", cat: "online", label: "Online", gpa: 19.1, moc: 68.1, uda: 50.3 },
  { name: "Molmo2-8B", cat: "open", label: "Open-source", gpa: 8.5, moc: 66.2, uda: 34.6 },
  { name: "Dispider", cat: "online", label: "Online", gpa: 7.7, moc: 34.8, uda: 15.5 }
];
const CEILING = 96.1;

function buildBoard() {
  const board = document.querySelector("[data-board]");
  if (!board) return;
  let rank = 0;
  MODELS.forEach((m) => {
    const row = document.createElement("div");
    row.className = "board-row" + (m.cat === "human" ? " human" : "");
    const rk = m.cat === "human" ? "&#9650;" : String(++rank).padStart(2, "0");
    row.innerHTML = `
      <div class="r-name"><span class="r-rank">${rk}</span><span>${m.name}</span></div>
      <div class="r-cat">${m.label}</div>
      <div class="r-bar">
        <div class="bar-track"><div class="bar-fill" data-fill="${(m.gpa / CEILING * 100).toFixed(1)}"></div></div>
        <span class="bar-val">${m.gpa.toFixed(1)}</span>
      </div>
      <div class="r-extra"><span>MoC ${m.moc.toFixed(1)}</span><span>UDA ${m.uda.toFixed(1)}</span></div>`;
    board.appendChild(row);
  });
}

function fillBars() {
  document.querySelectorAll(".bar-fill").forEach((el, i) => {
    const target = Number(el.getAttribute("data-fill")) / 100;
    setTimeout(() => { el.style.transform = `scaleX(${target})`; }, 80 + i * 45);
  });
}

function setupCopy() {
  const btn = document.querySelector("[data-copy]");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(document.getElementById("bibtex").innerText);
      btn.textContent = "Copied";
    } catch (e) {
      btn.textContent = "Copy failed";
    }
    setTimeout(() => { btn.textContent = "Copy"; }, 1600);
  });
}

function revealAll() {
  document.querySelectorAll("[data-anim]").forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
}

function setupMotion() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  if (reduce || !hasGsap) {
    revealAll();
    fillBars();
    return;
  }

  document.body.classList.add("anim-ready");
  gsap.registerPlugin(ScrollTrigger);

  // Scroll reveal for marked elements.
  gsap.utils.toArray("[data-anim]").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true }
    });
  });

  // Leaderboard bars fill when the board enters view.
  const board = document.querySelector("[data-board]");
  if (board) {
    ScrollTrigger.create({ trigger: board, start: "top 78%", once: true, onEnter: fillBars });
  }

  // Nav border once the hero is scrolled past.
  const nav = document.querySelector(".nav");
  if (nav) {
    ScrollTrigger.create({
      start: "12px top",
      onUpdate: (self) => nav.classList.toggle("scrolled", self.scroll() > 12)
    });
  }

  // Active section highlight in the nav.
  document.querySelectorAll("[data-nav]").forEach((link) => {
    const id = link.getAttribute("href");
    const target = document.querySelector(id);
    if (!target) return;
    ScrollTrigger.create({
      trigger: target,
      start: "top 45%",
      end: "bottom 45%",
      onToggle: (self) => {
        if (self.isActive) {
          document.querySelectorAll("[data-nav]").forEach((l) => l.classList.remove("active"));
          link.classList.add("active");
        }
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  buildBoard();
  setupCopy();
  setupMotion();
});
