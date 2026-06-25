// SVCBench project homepage interactions

// ---- Leaderboard data (overall metrics from the camera-ready main results) ----
const MODELS = [
  { name: "Human", setting: "-", gpa: 96.1, moc: 100.0, uda: 99.3, group: "human", rank: false },
  { name: "Gemini-3-Flash", setting: "1fps", gpa: 37.0, moc: 73.7, uda: 73.8, group: "prop" },
  { name: "Doubao-Seed-1.8", setting: "64 frames", gpa: 36.2, moc: 77.2, uda: 76.8, group: "prop" },
  { name: "Qwen3-VL-8B", setting: "64 frames", gpa: 31.0, moc: 84.3, uda: 55.1, group: "open" },
  { name: "Qwen3.5-35B-A3B", setting: "64 frames", gpa: 29.3, moc: 82.4, uda: 59.0, group: "open" },
  { name: "GPT-5.4", setting: "64 frames", gpa: 29.1, moc: 71.8, uda: 59.3, group: "prop" },
  { name: "Qwen3-VL-30B", setting: "64 frames", gpa: 27.0, moc: 84.6, uda: 56.4, group: "open" },
  { name: "Kimi-K2.5", setting: "64 frames", gpa: 26.4, moc: 66.8, uda: 73.4, group: "prop" },
  { name: "InternVL-3.5-8B", setting: "64 frames", gpa: 24.2, moc: 81.6, uda: 55.6, group: "open" },
  { name: "Flash-VStream-7B", setting: "1fps", gpa: 23.4, moc: 78.5, uda: 34.7, group: "online" },
  { name: "LiveStar", setting: "1fps", gpa: 19.9, moc: 86.4, uda: 36.8, group: "online" },
  { name: "Qwen2.5-VL-7B", setting: "64 frames", gpa: 19.1, moc: 68.2, uda: 40.8, group: "open" },
  { name: "StreamingVLM", setting: "1fps", gpa: 19.1, moc: 68.1, uda: 50.3, group: "online" },
  { name: "Molmo2-8B", setting: "64 frames", gpa: 8.5, moc: 66.2, uda: 34.6, group: "open" },
  { name: "Dispider", setting: "1fps", gpa: 7.7, moc: 34.8, uda: 15.5, group: "online" }
];

const HUMAN_CEILING = 96.1;

function buildBoard() {
  const board = document.querySelector("[data-board]");
  if (!board) return;
  let modelRank = 0;
  MODELS.forEach((m) => {
    const row = document.createElement("div");
    row.className = `board-row is-${m.group}` + (m.group === "human" ? " is-human" : "");
    const rankLabel = m.group === "human" ? "★" : String(++modelRank).padStart(2, "0");
    row.innerHTML = `
      <div class="row-name">
        <span class="row-rank">${rankLabel}</span>
        <span class="row-chip chip-${m.group}"></span>
        <span>${m.name}</span>
      </div>
      <div class="row-set hide-sm">${m.setting}</div>
      <div class="row-bar">
        <div class="bar-track"><div class="bar-fill" data-fill="${(m.gpa / HUMAN_CEILING * 100).toFixed(1)}"></div></div>
        <div class="bar-val">${m.gpa.toFixed(1)}</div>
      </div>
      <div class="row-extra">
        <span>MoC ${m.moc.toFixed(1)}</span>
        <span>UDA ${m.uda.toFixed(1)}</span>
      </div>`;
    board.appendChild(row);
  });
}

function animateBars() {
  document.querySelectorAll(".bar-fill").forEach((el, i) => {
    const target = el.getAttribute("data-fill");
    window.setTimeout(() => { el.style.width = `${target}%`; }, 120 + i * 55);
  });
}

// ---- Animated counters ----
function animateCount(el) {
  const target = Number(el.getAttribute("data-count"));
  const suffix = el.getAttribute("data-suffix") || "";
  const dur = 1300;
  const start = performance.now();
  function tick(now) {
    const p = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(target * eased);
    el.textContent = val.toLocaleString("en-US") + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString("en-US") + suffix;
  }
  requestAnimationFrame(tick);
}

// ---- Reveal + trigger counters/bars ----
function setupReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      entry.target.querySelectorAll("[data-count]").forEach(animateCount);
      if (entry.target.querySelector("[data-board]") || entry.target.matches("[data-board]")) {
        animateBars();
      }
      if (entry.target.classList.contains("band") && entry.target.querySelector(".board")) {
        animateBars();
      }
      io.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // bars live inside their own reveal wrapper
  const boardReveal = document.querySelector(".board.reveal") || document.querySelector("[data-board]");
  if (boardReveal) {
    const bio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { animateBars(); bio.disconnect(); } });
    }, { threshold: 0.2 });
    bio.observe(boardReveal);
  }
}

// ---- Nav active highlight + scroll progress ----
function setupNav() {
  const links = Array.from(document.querySelectorAll("[data-nav]"));
  const sections = links.map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean);
  const progress = document.querySelector("[data-scroll-progress]");

  function onScroll() {
    const top = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${docH > 0 ? Math.min(100, (top / docH) * 100) : 0}%`;

    let activeId = sections[0] ? sections[0].id : "";
    sections.forEach((s) => { if (s.offsetTop - 160 <= top) activeId = s.id; });
    links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${activeId}`));
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}

// ---- Theme toggle ----
function setupTheme() {
  const btn = document.querySelector("[data-theme-toggle]");
  const key = "svcbench-theme";
  let saved = null;
  try { saved = localStorage.getItem(key); } catch (e) {}
  if (saved === "light" || saved === "dark") document.documentElement.dataset.theme = saved;
  if (btn) {
    btn.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem(key, next); } catch (e) {}
    });
  }
}

// ---- Interactive hero timeline ----
function setupTimeline() {
  const states = [
    { visible: 3, unique: 5, cycle: 1 },
    { visible: 2, unique: 6, cycle: 1 },
    { visible: 4, unique: 8, cycle: 2 },
    { visible: 1, unique: 9, cycle: 3 }
  ];
  const points = Array.from(document.querySelectorAll(".qp"));
  const readout = document.querySelector("[data-state-readout]");
  if (!points.length || !readout) return;

  function apply(idx) {
    points.forEach((p, i) => p.classList.toggle("is-active", i === idx));
    const s = states[idx];
    readout.querySelectorAll("strong").forEach((el) => {
      const key = el.getAttribute("data-key");
      if (s[key] === undefined) return;
      if (el.textContent !== String(s[key])) {
        el.classList.add("bump");
        window.setTimeout(() => el.classList.remove("bump"), 320);
      }
      el.textContent = s[key];
    });
  }

  points.forEach((p, i) => p.addEventListener("click", () => apply(i)));

  // auto-cycle until user interacts
  let auto = 0;
  let userTouched = false;
  points.forEach((p) => p.addEventListener("click", () => { userTouched = true; }));
  const timer = window.setInterval(() => {
    if (userTouched) { window.clearInterval(timer); return; }
    auto = (auto + 1) % states.length;
    apply(auto);
  }, 2600);
}

// ---- Copy BibTeX ----
function setupCopy() {
  const btn = document.querySelector("[data-copy-bibtex]");
  if (!btn) return;
  const label = btn.querySelector(".copy-label");
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(document.getElementById("bibtex").innerText);
      if (label) label.textContent = "Copied";
    } catch (e) {
      if (label) label.textContent = "Copy failed";
    }
    window.setTimeout(() => { if (label) label.textContent = "Copy"; }, 1600);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  buildBoard();
  setupReveal();
  setupNav();
  setupTheme();
  setupTimeline();
  setupCopy();
});
