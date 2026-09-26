# For Maryam — Date Proposal Website 🌷

A personal, intimate, living first-date proposal website created by **Youness** for **Maryam**. Built with pure vanilla HTML5, CSS3, and JavaScript, designed mobile-first and ready to deploy instantly to **GitHub Pages**.

---

## ✨ Features & Visual Storytelling

- **Living Tulip Metaphor**: Tulips sprout and grow procedurally across the screen as Maryam progresses, starting with a solitary botanical bloom and culminating in a full floral framing.
- **Continuous World**: Soft physics, organic animations, tactile button feedback, and paper grain textures.
- **The Small Game**:
  - **Part 1 (A Tiny Test)**: 5 botanical etched cards with playful commentary in Youness's voice.
  - **Part 2 (The Future Fish)**: Swimming animated fish with tail flutter, floating bubbles, and inside-joke name choices.
  - **Part 3 (The Dog Joke)**: Cute approaching dog with the "MAKE IT GO AWAY" button that sends the dog sprinting away.
- **The Reveal**: Cinematic, tender pacing leading to *"I have a date to ask you on. Actually... I want to take you on our first date. You get to choose."*
- **Dynamic Date Selector**:
  - Automatically calculates the next 3 weekends (starting October 3–4, October 10–11, and October 17–18, 2026).
  - Select Saturday or Sunday with thumb-friendly pills.
- **Time Selection**:
  - Features **Morning (10:00 AM)** prominently, plus Late Morning, Afternoon, Evening, and custom time input.
- **5 Distinct Date Experiences**:
  1. *A little day out* (Illustrated animated day journey path)
  2. *Somewhere quiet* (Serene minimal landscape with gentle breeze)
  3. *A little adventure / Bowling* (Interactive bowling lane where tapping rolls the ball and knocks down pins)
  4. *Let’s make something terrible / Drawing* (Interactive sketchpad canvas allowing finger doodles with clear button)
  5. *Surprise me* (Wax-sealed envelope with monogram that wiggles and keeps the secret)
- **Real Proposal Confirmation & RSVP System**: Formspree / EmailJS integration with feedback toasts and summary reservation card.
- **Synthesized Ambient Audio**: Organic chimes, soft clicks, and paper rustle using the Web Audio API (zero audio files needed, works offline).

---

## 🚀 How to Deploy to GitHub Pages (Under 1 Minute)

1. Create a new repository on GitHub (e.g. `for-maryam` or `date-proposal`).
2. Push or upload these files directly to the `main` branch:
   - `index.html`
   - `style.css`
   - `app.js`
   - `config.js`
3. Go to **Repository Settings** → **Pages** (in the left sidebar).
4. Under **Build and deployment** / **Branch**, select `main` branch and `/ (root)` folder, then click **Save**.
5. Your custom URL will be live at:
   `https://<your-username>.github.io/<repo-name>/`

---

## 📬 How to Receive Maryam's Choices in Your Email

### Using Formspree (Recommended & Free):
1. Go to [https://formspree.io](https://formspree.io) and sign up with your email.
2. Click **+ New Form**, give it a name (e.g. `Maryam Date RSVP`), and copy your form endpoint URL:
   `https://formspree.io/f/mqkrvbzw`
3. Open `config.js` and paste your endpoint into `formspreeEndpoint`:
   ```javascript
   emailService: {
     formspreeEndpoint: "https://formspree.io/f/YOUR_FORM_ID",
     targetEmail: "your-email@example.com"
   }
   ```
4. Whenever Maryam submits her choices, you will immediately receive an email with:
   - Chosen Date
   - Chosen Time
   - Chosen Experience Plan
   - Future Fish Name
   - Exact Timestamp

---

## 💻 Local Preview

You can open `index.html` directly in any web browser, or run a local server:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your browser or phone.
