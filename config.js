/**
 * =========================================================================
 *  CONFIGURATION & PERSONALIZATION FOR YOUNESS & MARYAM
 * =========================================================================
 * 
 *  This file contains the email submission endpoint and date settings.
 *  You can host this site directly on GitHub Pages!
 */

const CONFIG = {
  // Personal names & nicknames
  recipientName: "Maryam",
  senderName: "Youness",
  nicknames: {
    primary: "Dliliha",
    secondary: "Neyem"
  },

  // Base Reference Date for Next 3 Weekends
  // Prompt specification: Reference is Saturday, September 26, 2026.
  // Weekend 1: Oct 3–4, 2026
  // Weekend 2: Oct 10–11, 2026
  // Weekend 3: Oct 17–18, 2026
  referenceDate: "2026-09-26T12:00:00Z",

  /**
   * EMAIL NOTIFICATION CONFIGURATION
   * 
   * Option 1: Formspree (EASIEST & RECOMMENDED - FREE)
   * 1. Go to https://formspree.io and create a free form.
   * 2. Paste your Formspree Form ID or URL below:
   *    e.g. formspreeEndpoint: "https://formspree.io/f/mqkrvbzw"
   * 
   * Option 2: EmailJS
   * If you prefer EmailJS, fill in the EmailJS keys below.
   * 
   * Option 3: Custom Webhook / Serverless function
   * Paste any POST endpoint URL here.
   */
  emailService: {
    // Paste your Formspree endpoint URL here:
    formspreeEndpoint: "", // e.g. "https://formspree.io/f/YOUR_FORM_ID"

    // Optional: EmailJS credentials if you choose EmailJS instead of Formspree
    emailjs: {
      serviceId: "",
      templateId: "",
      publicKey: ""
    },

    // Destination email address for fallback (e.g. mailto or record)
    targetEmail: "youness@example.com"
  }
};

// Expose globally
window.APP_CONFIG = CONFIG;
