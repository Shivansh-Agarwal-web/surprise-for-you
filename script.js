// script.js — final controller (audio removed)
document.addEventListener("DOMContentLoaded", () => {

  // ---------- DOM refs
  const openBtn = document.getElementById("open-btn");
  const flap = document.getElementById("flap");
  const envelopeScreen = document.getElementById("envelope-screen");
  const cardStage = document.getElementById("card-stage");
  const cardWrapper = document.getElementById("card-wrapper");
  const card = document.getElementById("card");
  const confettiRoot = document.getElementById("confetti");

  // helper
  const wait = ms => new Promise(res => setTimeout(res, ms));

  // ---------- Confetti generator
  function launchConfettiBurst(count = 30) {
    if (!confettiRoot) return;
    const colors = ["#ffb3cc", "#ffd1e6", "#ff9db5", "#ffe0ec", "#ffc7d9", "#ffffff"];

    for (let i = 0; i < count; i++) {
      const piece = document.createElement("div");
      piece.style.width = `${6 + Math.random() * 8}px`;
      piece.style.height = `${8 + Math.random() * 10}px`;
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.top = `-10px`;
      piece.style.position = "absolute";
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.borderRadius = "2px";
      piece.style.zIndex = 6;
      piece.style.opacity = "0.95";
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;

      confettiRoot.appendChild(piece);
      piece.style.animation = `confettiFall ${2.2 + Math.random() * 1.2}s forwards ease-in`;

      // cleanup
      setTimeout(() => {
        if (piece && piece.parentNode) piece.parentNode.removeChild(piece);
      }, 3800);
    }
  }

  // ---------- Opening sequence
  let started = false;
  async function startOpeningSequence() {
    if (started) return;
    started = true;

    if (openBtn) {
      openBtn.disabled = true;
      openBtn.setAttribute("aria-expanded", "true");
    }

    // 1) flap open
    if (flap) flap.classList.add("open");
    await wait(700);

    // 2) fade envelope out
    if (envelopeScreen) {
      envelopeScreen.style.transition = "opacity .55s ease";
      envelopeScreen.style.opacity = "0";
      await wait(560);
      envelopeScreen.style.display = "none";
    }

    // 3) show card stage
    if (cardStage) cardStage.style.display = "flex";

    // 4) slide card wrapper in
    if (cardWrapper) cardWrapper.classList.add("slide-in");

    // 5) confetti burst
    launchConfettiBurst(40);

    // 6) open the card hinge
    await wait(950);
    if (card) card.classList.add("open");
    await wait(650);
    if (card) card.classList.add("open-final");

    // 7) another confetti
    launchConfettiBurst(20);

    // 8) periodic delight bursts
    setInterval(() => launchConfettiBurst(12), 9000);
  }

  // attach open handlers (click + keyboard)
  if (openBtn) {
    openBtn.addEventListener("click", startOpeningSequence);
    openBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        startOpeningSequence();
      }
    });
  }

});
