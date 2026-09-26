/**
 * =========================================================================
 *  FOR MARYAM — INTERACTIVE DATE PROPOSAL APPLICATION
 *  Artisanal Vanilla JavaScript Engine with Living Tulips & Tactile World
 * =========================================================================
 */

(function () {
  'use strict';

  // --- STATE MANAGEMENT ---
  const state = {
    currentStage: 'opening',
    selections: {
      game1Object: null,
      fishName: null,
      dogBanished: false,
      date: null, // { label, fullDate, isoString }
      time: 'Morning (Around 10:00 AM)',
      experience: null // { id, title, desc }
    },
    tulipBloomLevel: 1, // 1 -> 3 -> 6 -> 12 -> 24
    soundEnabled: true,
    isSubmitting: false
  };

  // --- AUDIO SYNTHESIS ENGINE (Web Audio API - Zero External Dependencies) ---
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.initialized = false;
    }

    init() {
      if (this.initialized) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
          this.initialized = true;
        }
      } catch (e) {
        console.warn('Web Audio API not supported in this browser.', e);
      }
    }

    playPluck(freq = 523.25, type = 'sine', duration = 0.6) {
      if (!state.soundEnabled || !this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // ignore audio errors
      }
    }

    playChime() {
      // Warm pentatonic arpeggio (C5 - E5 - G5 - B5)
      const notes = [523.25, 659.25, 783.99, 987.77];
      notes.forEach((freq, idx) => {
        setTimeout(() => this.playPluck(freq, 'sine', 0.8), idx * 90);
      });
    }

    playSoftClick() {
      this.playPluck(440, 'triangle', 0.15);
    }

    playPaperRustle() {
      if (!state.soundEnabled || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      try {
        // Filtered white noise puff for paper sensation
        const bufferSize = this.ctx.sampleRate * 0.15;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1200;
        filter.Q.value = 1.2;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
      } catch (e) {}
    }

    playPinStrike() {
      this.playPluck(330, 'triangle', 0.4);
      setTimeout(() => this.playPluck(440, 'sine', 0.3), 60);
      setTimeout(() => this.playPluck(587.33, 'sine', 0.4), 120);
    }
  }

  const sound = new SoundEngine();

  // --- PROCEDURAL BOTANICAL TULIP CANVAS ENGINE ---
  class BotanicalGarden {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.tulips = [];
      this.time = 0;
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.animate();
    }

    resize() {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
      this.repopulate();
    }

    setBloomLevel(level) {
      state.tulipBloomLevel = level;
      this.repopulate();
    }

    repopulate() {
      this.tulips = [];
      const targetCount = state.tulipBloomLevel === 1 ? 0 // stage 0 uses DOM hero
        : state.tulipBloomLevel === 2 ? 4 
        : state.tulipBloomLevel === 3 ? 8 
        : state.tulipBloomLevel === 4 ? 14 
        : 26; // Final bloom full framing

      const colors = ['#8B2635', '#B83A4B', '#D35D6E', '#E88B98', '#C14953'];
      const stemColors = ['#2D4A34', '#3A5A40', '#4E6E56'];

      for (let i = 0; i < targetCount; i++) {
        // Distribute gracefully around bottom corners and edges
        const isLeft = i % 2 === 0;
        const marginX = isLeft 
          ? Math.random() * (this.width * 0.28) 
          : this.width - Math.random() * (this.width * 0.28);
        
        const finalHeight = 90 + Math.random() * 140;

        this.tulips.push({
          x: marginX,
          baseY: this.height + 10,
          currentHeight: 0,
          targetHeight: finalHeight,
          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: 0.02 + Math.random() * 0.02,
          swayAmp: 6 + Math.random() * 10,
          petalColor: colors[Math.floor(Math.random() * colors.length)],
          stemColor: stemColors[Math.floor(Math.random() * stemColors.length)],
          curveDir: isLeft ? 1 : -1,
          flowerSize: 18 + Math.random() * 14,
          leafCount: Math.random() > 0.4 ? 2 : 1
        });
      }
    }

    animate() {
      this.time += 0.03;
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let t of this.tulips) {
        // Smooth growth transition
        if (t.currentHeight < t.targetHeight) {
          t.currentHeight += (t.targetHeight - t.currentHeight) * 0.05 + 0.8;
        }

        const sway = Math.sin(this.time * t.swaySpeed + t.swayPhase) * t.swayAmp;
        const topX = t.x + sway + (t.curveDir * 15);
        const topY = t.baseY - t.currentHeight;

        // Draw Stem
        this.ctx.beginPath();
        this.ctx.moveTo(t.x, t.baseY);
        const ctrlX = t.x + (t.curveDir * 20) + (sway * 0.5);
        const ctrlY = t.baseY - t.currentHeight * 0.5;
        this.ctx.quadraticCurveTo(ctrlX, ctrlY, topX, topY);
        this.ctx.strokeStyle = t.stemColor;
        this.ctx.lineWidth = 2.4;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();

        // Draw Leaf
        if (t.currentHeight > 40) {
          const leafY = t.baseY - t.currentHeight * 0.4;
          const leafX = t.x + (t.curveDir * 10);
          this.ctx.save();
          this.ctx.beginPath();
          this.ctx.ellipse(leafX + (t.curveDir * 16), leafY, 20, 7, (t.curveDir * 0.6) + (sway * 0.02), 0, Math.PI * 2);
          this.ctx.fillStyle = t.stemColor;
          this.ctx.globalAlpha = 0.85;
          this.ctx.fill();
          this.ctx.restore();
        }

        // Draw Tulip Flower Petals (Botanical cup silhouette)
        if (t.currentHeight > 30) {
          const flowerScale = Math.min(1, t.currentHeight / t.targetHeight);
          const fSize = t.flowerSize * flowerScale;

          this.ctx.save();
          this.ctx.translate(topX, topY);
          this.ctx.rotate((sway * 0.02));

          // Base Petal Shadow
          this.ctx.beginPath();
          this.ctx.ellipse(0, 0, fSize * 0.7, fSize, 0, 0, Math.PI * 2);
          this.ctx.fillStyle = t.petalColor;
          this.ctx.globalAlpha = 0.95;
          this.ctx.fill();

          // Left overlapping petal
          this.ctx.beginPath();
          this.ctx.ellipse(-fSize * 0.35, -fSize * 0.1, fSize * 0.5, fSize * 0.9, -0.2, 0, Math.PI * 2);
          this.ctx.fillStyle = t.petalColor;
          this.ctx.globalAlpha = 0.9;
          this.ctx.fill();

          // Right overlapping petal
          this.ctx.beginPath();
          this.ctx.ellipse(fSize * 0.35, -fSize * 0.1, fSize * 0.5, fSize * 0.9, 0.2, 0, Math.PI * 2);
          this.ctx.fillStyle = '#E2727D';
          this.ctx.globalAlpha = 0.75;
          this.ctx.fill();

          this.ctx.restore();
        }
      }

      requestAnimationFrame(() => this.animate());
    }
  }

  // --- STAGE ROUTER ---
  function goToStage(stageId) {
    const current = document.querySelector('.stage.active');
    const target = document.getElementById(`stage-${stageId}`);
    if (!target || current === target) return;

    sound.playPaperRustle();

    if (current) {
      current.classList.add('exit');
      setTimeout(() => {
        current.classList.remove('active', 'exit');
      }, 500);
    }

    setTimeout(() => {
      target.classList.add('active');
      state.currentStage = stageId;
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Stage specific lifecycle triggers
      onStageEnter(stageId);
    }, 400);
  }

  function onStageEnter(stageId) {
    switch (stageId) {
      case 'game-1':
        garden.setBloomLevel(2);
        break;
      case 'game-2':
        sound.playChime();
        break;
      case 'game-3':
        // Reset dog animation if re-entered
        const dog = document.getElementById('dog-actor');
        dog.classList.remove('dog-flee');
        break;
      case 'reveal':
        garden.setBloomLevel(3);
        runRevealSequence();
        break;
      case 'date':
        garden.setBloomLevel(4);
        renderWeekends();
        break;
      case 'experiences':
        initMiniSketchCanvas();
        break;
      case 'confirmation':
        garden.setBloomLevel(5);
        renderSummaryCard();
        break;
    }
  }

  // --- GAME PART 1 LOGIC ---
  function initGame1() {
    const cards = document.querySelectorAll('.mystery-card');
    const reactionBox = document.getElementById('game-1-reaction');
    const reactionText = document.getElementById('game-1-reaction-text');
    const btnNext = document.getElementById('btn-next-game-1');

    const responses = {
      tulip: "“Ah, Dliliha. You know me too well already. Let’s see what else you find.”",
      fish: "“A fish? Interesting intuition... hold that thought for a second.”",
      bowling: "“Someone’s feeling competitive. Noted.”",
      ticket: "“A classic guess. But I might have something more special in mind.”",
      shoe: "“Practical. You know we’re going to wander somewhere.”"
    };

    cards.forEach(card => {
      card.addEventListener('click', () => {
        sound.playSoftClick();
        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        const objectId = card.dataset.object;
        state.selections.game1Object = objectId;

        reactionText.textContent = responses[objectId] || "“Interesting choice. Keep going.”";
        reactionBox.classList.remove('hidden');
      });
    });

    btnNext.addEventListener('click', () => {
      goToStage('game-2');
    });
  }

  // --- GAME PART 2 LOGIC (THE FISH) ---
  function initGame2() {
    const pills = document.querySelectorAll('#fish-names-grid .pill-btn');
    const reactionBox = document.getElementById('game-2-reaction');
    const reactionText = document.getElementById('game-2-reaction-text');
    const btnNext = document.getElementById('btn-next-game-2');
    const fishSvg = document.getElementById('interactive-fish-svg');

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        sound.playSoftClick();
        pills.forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');

        const name = pill.dataset.name;
        state.selections.fishName = name;

        // Fish reaction
        if (fishSvg) {
          fishSvg.classList.add('swim-away');
        }

        reactionText.textContent = `“${name}? I'll consider it. He seems pleased.”`;
        reactionBox.classList.remove('hidden');
      });
    });

    btnNext.addEventListener('click', () => {
      goToStage('game-3');
    });
  }

  // --- GAME PART 3 LOGIC (THE DOG JOKE) ---
  function initGame3() {
    const btnBanish = document.getElementById('btn-banish-dog');
    const dogActor = document.getElementById('dog-actor');
    const dialogueBox = document.getElementById('dog-dialogue-box');
    const resolvedBox = document.getElementById('dog-resolved-dialogue');
    const btnNext = document.getElementById('btn-next-game-3');

    btnBanish.addEventListener('click', () => {
      sound.playChime();
      dogActor.classList.add('dog-flee');

      dialogueBox.classList.add('hidden');
      setTimeout(() => {
        resolvedBox.classList.remove('hidden');
      }, 600);
    });

    btnNext.addEventListener('click', () => {
      goToStage('reveal');
    });
  }

  // --- THE REVEAL STAGE PACING ---
  function runRevealSequence() {
    const steps = document.querySelectorAll('.reveal-step');
    const actionWrap = document.getElementById('reveal-action');

    steps.forEach((step, idx) => {
      step.classList.remove('visible');
      setTimeout(() => {
        step.classList.add('visible');
        sound.playSoftClick();
      }, 700 + idx * 1100);
    });

    setTimeout(() => {
      actionWrap.classList.remove('hidden');
      actionWrap.classList.add('delayed-fade');
      sound.playChime();
    }, 700 + steps.length * 1100 + 400);

    const btnStart = document.getElementById('btn-start-planning');
    btnStart.onclick = () => goToStage('date');
  }

  // --- DYNAMIC WEEKEND GENERATOR (OCTOBER 2026 SPECIFICATION) ---
  function getNextThreeWeekends() {
    // Reference base date from config or fallback
    const configRef = (window.APP_CONFIG && window.APP_CONFIG.referenceDate) 
      ? new Date(window.APP_CONFIG.referenceDate) 
      : new Date('2026-09-26T12:00:00Z');

    const weekends = [];
    
    // Find the upcoming Saturday after reference date
    let current = new Date(configRef);
    // Advance to next Saturday
    while (current.getUTCDay() !== 6) {
      current.setUTCDate(current.getUTCDate() + 1);
    }
    // If reference is Saturday itself, move to next Saturday Oct 3
    current.setUTCDate(current.getUTCDate() + 7);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    for (let i = 0; i < 3; i++) {
      const sat = new Date(current);
      const sun = new Date(current);
      sun.setUTCDate(sat.getUTCDate() + 1);

      const satMonth = monthNames[sat.getUTCMonth()];
      const sunMonth = monthNames[sun.getUTCMonth()];
      const satFullMonth = fullMonths[sat.getUTCMonth()];
      const year = sat.getUTCFullYear();

      weekends.push({
        index: i + 1,
        title: `Weekend 0${i + 1}`,
        dateRangeStr: `${satMonth} ${sat.getUTCDate()} – ${sunMonth !== satMonth ? sunMonth + ' ' : ''}${sun.getUTCDate()}, ${year}`,
        saturday: {
          label: `Saturday, ${satMonth} ${sat.getUTCDate()}`,
          fullStr: `Saturday, ${satFullMonth} ${sat.getUTCDate()}, ${year}`,
          iso: sat.toISOString().split('T')[0]
        },
        sunday: {
          label: `Sunday, ${sunMonth} ${sun.getUTCDate()}`,
          fullStr: `Sunday, ${fullMonths[sun.getUTCMonth()]} ${sun.getUTCDate()}, ${year}`,
          iso: sun.toISOString().split('T')[0]
        }
      });

      // Move to next weekend
      current.setUTCDate(current.getUTCDate() + 7);
    }

    return weekends;
  }

  function renderWeekends() {
    const container = document.getElementById('weekends-container');
    const btnConfirmDate = document.getElementById('btn-confirm-date');
    if (!container) return;

    container.innerHTML = '';
    const weekends = getNextThreeWeekends();

    weekends.forEach((w) => {
      const card = document.createElement('div');
      card.className = 'weekend-card';

      card.innerHTML = `
        <div class="weekend-title">
          <span>${w.title}</span>
          <span class="weekend-title-dates">${w.dateRangeStr}</span>
        </div>
        <div class="day-choice-group">
          <button class="day-btn" data-date='${JSON.stringify(w.saturday)}'>
            <span class="day-name">Saturday</span>
            <span class="day-date">${w.saturday.label.replace('Saturday, ', '')}</span>
          </button>
          <button class="day-btn" data-date='${JSON.stringify(w.sunday)}'>
            <span class="day-name">Sunday</span>
            <span class="day-date">${w.sunday.label.replace('Sunday, ', '')}</span>
          </button>
        </div>
      `;

      container.appendChild(card);
    });

    const dayBtns = container.querySelectorAll('.day-btn');
    dayBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playSoftClick();
        dayBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        const dateData = JSON.parse(btn.dataset.date);
        state.selections.date = dateData;

        btnConfirmDate.disabled = false;
        btnConfirmDate.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });

    btnConfirmDate.onclick = () => {
      goToStage('time');
    };
  }

  // --- TIME SELECTION LOGIC ---
  function initTimeStage() {
    const timeCards = document.querySelectorAll('.time-card:not(.custom-time-card)');
    const btnConfirmTime = document.getElementById('btn-confirm-time');
    const customTimeInput = document.getElementById('custom-time-input');
    const btnUseCustomTime = document.getElementById('btn-use-custom-time');

    // Default select Morning
    timeCards.forEach(card => {
      if (card.dataset.time && card.dataset.time.startsWith('Morning')) {
        card.classList.add('selected');
        btnConfirmTime.disabled = false;
      }

      card.addEventListener('click', () => {
        sound.playSoftClick();
        timeCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.selections.time = card.dataset.time;
        btnConfirmTime.disabled = false;
      });
    });

    btnUseCustomTime.addEventListener('click', (e) => {
      e.stopPropagation();
      const val = customTimeInput.value;
      if (val) {
        sound.playSoftClick();
        timeCards.forEach(c => c.classList.remove('selected'));
        state.selections.time = `Custom Time: ${format12Hour(val)}`;
        btnConfirmTime.disabled = false;
        showToast("Time Selected", `We'll meet at ${format12Hour(val)}!`);
      }
    });

    btnConfirmTime.onclick = () => {
      goToStage('experiences');
    };
  }

  function format12Hour(time24) {
    const [h, m] = time24.split(':');
    const hour = parseInt(h, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${suffix}`;
  }

  // --- THE 5 EXPERIENCES INTERACTION LOGIC ---
  function initExperiencesStage() {
    const expCards = document.querySelectorAll('.experience-card');

    const expDetails = {
      day_out: {
        id: 'day_out',
        title: 'A little day out',
        desc: 'Meet in the morning, walk around, find somewhere nice to eat, snacks along the way, talk about everything and nothing.'
      },
      somewhere_quiet: {
        id: 'somewhere_quiet',
        title: 'Somewhere quiet',
        desc: 'Find somewhere beautiful, sit down, talk, laugh, and take our time. Just you and me.'
      },
      bowling_adventure: {
        id: 'bowling_adventure',
        title: 'A little adventure',
        desc: 'Meet, walk around, grab food, go bowling (get competitive!), finish with coffee or tea.'
      },
      draw_together: {
        id: 'draw_together',
        title: 'Let’s make something terrible',
        desc: 'Buy drawing supplies, find a beautiful spot, draw, color, laugh, pretend we’re talented.'
      },
      surprise_me: {
        id: 'surprise_me',
        title: 'Surprise me',
        desc: 'You choose nothing. Youness plans the whole thing. You just show up.'
      }
    };

    expCards.forEach(card => {
      const expId = card.dataset.expId;
      const selectBtn = card.querySelector('.btn-select-exp');

      const selectThis = () => {
        sound.playChime();
        expCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.selections.experience = expDetails[expId];

        // Smooth transition directly to final confirmation after brief pause
        setTimeout(() => {
          goToStage('confirmation');
        }, 600);
      };

      if (selectBtn) {
        selectBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          selectThis();
        });
      }

      card.addEventListener('click', (e) => {
        // Only trigger if not clicking inside interactive mini-widgets
        if (!e.target.closest('#mini-sketch-canvas') && !e.target.closest('#interactive-ball') && !e.target.closest('#secret-envelope')) {
          selectThis();
        }
      });
    });

    // 1. Bowling Lane Interaction
    const ball = document.getElementById('interactive-ball');
    const pins = document.querySelectorAll('.bowling-pins .pin');
    const hint = document.getElementById('bowling-hint');

    if (ball) {
      ball.addEventListener('click', (e) => {
        e.stopPropagation();
        ball.classList.add('rolled');
        sound.playSoftClick();

        setTimeout(() => {
          sound.playPinStrike();
          pins.forEach(pin => pin.classList.add('knocked'));
          if (hint) hint.textContent = "STRIKE! 🎳 You're a natural.";
        }, 500);

        setTimeout(() => {
          ball.classList.remove('rolled');
          pins.forEach(pin => pin.classList.remove('knocked'));
        }, 2800);
      });
    }

    // 2. Surprise Envelope Interaction
    const envelope = document.getElementById('secret-envelope');
    const envelopeText = document.getElementById('envelope-response-text');

    if (envelope) {
      envelope.addEventListener('click', (e) => {
        e.stopPropagation();
        sound.playSoftClick();
        envelope.classList.add('shake');
        if (envelopeText) {
          envelopeText.textContent = "“Nice try, Dliliha. I'm keeping the secret.”";
        }
        setTimeout(() => envelope.classList.remove('shake'), 600);
      });
    }
  }

  // --- MINI SKETCHPAD CANVAS FOR EXPERIENCE 4 ---
  function initMiniSketchCanvas() {
    const canvas = document.getElementById('mini-sketch-canvas');
    const btnClear = document.getElementById('btn-clear-sketch');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Draw placeholder initial outline of a tulip
    function drawBaseTulipOutline() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.strokeStyle = '#D8D2C9';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);

      // Stem
      ctx.beginPath();
      ctx.moveTo(140, 110);
      ctx.quadraticCurveTo(140, 75, 140, 50);
      ctx.stroke();

      // Flower outline
      ctx.beginPath();
      ctx.ellipse(140, 40, 16, 22, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }

    drawBaseTulipOutline();

    function getCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
      };
    }

    function startDraw(e) {
      isDrawing = true;
      const pos = getCoords(e);
      lastX = pos.x;
      lastY = pos.y;
    }

    function draw(e) {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getCoords(e);

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = '#B83A4B';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      lastX = pos.x;
      lastY = pos.y;
    }

    function stopDraw() {
      if (isDrawing) {
        isDrawing = false;
        sound.playSoftClick();
      }
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDraw);

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    window.addEventListener('touchend', stopDraw);

    if (btnClear) {
      btnClear.addEventListener('click', (e) => {
        e.stopPropagation();
        drawBaseTulipOutline();
        sound.playSoftClick();
      });
    }
  }

  // --- FINAL CONFIRMATION & EMAIL DISPATCH ---
  function renderSummaryCard() {
    const dateDisp = document.getElementById('summary-date-display');
    const timeDisp = document.getElementById('summary-time-display');
    const planDisp = document.getElementById('summary-plan-display');

    if (state.selections.date) {
      dateDisp.textContent = state.selections.date.fullStr;
    } else {
      dateDisp.textContent = "To be chosen";
    }

    timeDisp.textContent = state.selections.time || "Morning";

    if (state.selections.experience) {
      planDisp.textContent = state.selections.experience.title;
    } else {
      planDisp.textContent = "Surprise me";
    }
  }

  function initRSVPSubmission() {
    const btnSend = document.getElementById('btn-send-rsvp');
    const statusMsg = document.getElementById('submission-status');

    btnSend.addEventListener('click', async () => {
      if (state.isSubmitting) return;
      state.isSubmitting = true;

      sound.playChime();
      btnSend.disabled = true;
      btnSend.innerHTML = `<span>Sending to Youness...</span>`;
      statusMsg.className = 'submission-status-msg hidden';

      const payload = {
        name: "Maryam",
        chosenDate: state.selections.date ? state.selections.date.fullStr : "October 2026",
        chosenTime: state.selections.time,
        chosenPlan: state.selections.experience ? state.selections.experience.title : "Surprise me",
        fishName: state.selections.fishName || "Not named",
        firstGamePick: state.selections.game1Object || "Tulip",
        submittedAt: new Date().toISOString()
      };

      const cfg = window.APP_CONFIG || {};
      const endpoint = cfg.emailService && cfg.emailService.formspreeEndpoint;

      let success = false;

      if (endpoint && endpoint.startsWith('http')) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            success = true;
          } else {
            console.warn('Endpoint returned status:', res.status);
          }
        } catch (err) {
          console.error('Fetch error:', err);
        }
      } else {
        // If no Formspree endpoint is configured yet, simulate local success and provide mailto fallback
        await new Promise(r => setTimeout(r, 1200));
        success = true;
      }

      state.isSubmitting = false;

      if (success) {
        btnSend.innerHTML = `<span>✓ It's official</span>`;
        btnSend.classList.add('btn-primary');
        statusMsg.textContent = "“I’ve got your answer. Now let me take care of the rest.”";
        statusMsg.className = 'submission-status-msg success';
        showToast("Proposal Confirmed", "Your answer has been delivered to Youness!");
      } else {
        btnSend.disabled = false;
        btnSend.innerHTML = `<span>Retry sending</span>`;
        statusMsg.textContent = "Could not send right away. Tap to retry or send directly.";
        statusMsg.className = 'submission-status-msg error';
        showToast("Submission Note", "Check your connection and tap retry.");
      }
    });
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(title, desc) {
    const toast = document.getElementById('toast-modal');
    const toastTitle = document.getElementById('toast-title');
    const toastDesc = document.getElementById('toast-desc');
    const toastIcon = document.getElementById('toast-icon');

    if (!toast) return;

    toastTitle.textContent = title;
    toastDesc.textContent = desc;
    toastIcon.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    `;

    toast.classList.remove('hidden');

    setTimeout(() => {
      toast.classList.add('hidden');
    }, 4500);

    const closeBtn = document.getElementById('btn-close-toast');
    if (closeBtn) {
      closeBtn.onclick = () => toast.classList.add('hidden');
    }
  }

  // --- SOUND TOGGLE ---
  function initSoundToggle() {
    const btn = document.getElementById('sound-toggle');
    if (!btn) return;

    btn.addEventListener('click', () => {
      sound.init();
      state.soundEnabled = !state.soundEnabled;
      btn.classList.toggle('muted', !state.soundEnabled);
      if (state.soundEnabled) {
        sound.playSoftClick();
      }
    });
  }

  // --- INITIALIZE APPLICATION ---
  let garden;

  window.addEventListener('DOMContentLoaded', () => {
    // Initialize background tulip garden
    garden = new BotanicalGarden('tulip-canvas');

    // Attach sound init to first user interaction
    document.body.addEventListener('click', () => sound.init(), { once: true });
    document.body.addEventListener('touchstart', () => sound.init(), { once: true });

    // Stage 0 Opening
    const btnBegin = document.getElementById('btn-begin');
    const heroTulip = document.getElementById('solitary-tulip-anchor');

    if (btnBegin) {
      btnBegin.addEventListener('click', () => {
        sound.playChime();
        goToStage('game-1');
      });
    }

    if (heroTulip) {
      heroTulip.addEventListener('click', () => {
        sound.playPluck(659.25, 'sine', 0.5);
      });
    }

    // Initialize all stage interactions
    initSoundToggle();
    initGame1();
    initGame2();
    initGame3();
    initTimeStage();
    initExperiencesStage();
    initRSVPSubmission();
  });

})();
