// script.js — final production-ready controller
document.addEventListener("DOMContentLoaded", () => {

  // ---------- DOM refs (safe lookups)
  const openBtn = document.getElementById("open-btn");
  const flap = document.getElementById("flap");
  const envelopeScreen = document.getElementById("envelope-screen");
  const cardStage = document.getElementById("card-stage");
  const cardWrapper = document.getElementById("card-wrapper");
  const card = document.getElementById("card");
  const confettiRoot = document.getElementById("confetti");

  const audio = document.getElementById("bg-audio");
  const audioToggle = document.getElementById("audio-toggle");
  const audioMute = document.getElementById("audio-mute");

  // guard: essential elements
  if (!openBtn || !flap || !envelopeScreen || !cardStage || !cardWrapper || !card) {
    console.warn("Some expected elements are missing. Script will still try to run gracefully.");
  }

  // small helper
  const wait = ms => new Promise(res => setTimeout(res, ms));

  // ---------- Confetti generator (DOM pieces)
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

  // ---------- Audio helpers
  if (audio) {
    audio.volume = 0.5;
    audio.loop = true;
  }

  async function tryPlayAudio() {
    if (!audio) return;
    try {
      audio.currentTime = 0;
      await audio.play();
      if (audioToggle) {
        audioToggle.textContent = "⏸";
        audioToggle.setAttribute("aria-pressed", "true");
      }
    } catch (err) {
      // autoplay blocked — show play icon so user can manually start
      if (audioToggle) {
        audioToggle.textContent = "▶";
        audioToggle.setAttribute("aria-pressed", "false");
      }
      console.warn("Audio play blocked or failed:", err);
    }
  }

  // attach audio controls if present
  if (audioToggle) {
    audioToggle.addEventListener("click", async () => {
      if (!audio) return;
      if (audio.paused) {
        try {
          await audio.play();
          audioToggle.textContent = "⏸";
          audioToggle.setAttribute("aria-pressed", "true");
        } catch (e) {
          console.warn("Play blocked:", e);
        }
      } else {
        audio.pause();
        audioToggle.textContent = "▶";
        audioToggle.setAttribute("aria-pressed", "false");
      }
    });
  }

  if (audioMute) {
    audioMute.addEventListener("click", () => {
      if (!audio) return;
      audio.muted = !audio.muted;
      audioMute.textContent = audio.muted ? "🔇" : "🔈";
      audioMute.setAttribute("aria-pressed", (!audio.muted).toString());
    });
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

    // 6) try play audio (this is a user gesture)
    tryPlayAudio();

    // 7) open the card hinge
    await wait(950);
    if (card) card.classList.add("open");
    await wait(650);
    if (card) card.classList.add("open-final");

    // 8) another confetti
    launchConfettiBurst(20);

    // 9) periodic delight bursts
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
  } else {
    // if no openBtn, start automatically after 300ms (useful for debugging)
    // comment this out if you never want auto open
    // setTimeout(startOpeningSequence, 300);
  }

  // ESC pauses audio
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && audio && !audio.paused) {
      audio.pause();
      if (audioToggle) {
        audioToggle.textContent = "▶";
        audioToggle.setAttribute("aria-pressed", "false");
      }
    }
  });

});

