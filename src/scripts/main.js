/* Elisabeth Fitzgerald. Site behaviour. No dependencies.
   Sections: nav highlighting, reel playback, photo lightbox, contact form. Everything works without this file;
   it only adds the interactive layer. */
(() => {
  "use strict";
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollBehavior = reduced ? "auto" : "smooth";

  /* Nav: mark the section under the middle of the screen ------------------ */
  const navLinks = $$('.site-nav a[href^="#"]');
  const sections = navLinks.map((a) => document.getElementById(a.hash.slice(1))).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const inView = new Set();
    const update = () => {
      const current = sections.filter((s) => inView.has(s)).pop();
      navLinks.forEach((a) => {
        if (current && a.hash === `#${current.id}`) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? inView.add(e.target) : inView.delete(e.target)));
        update();
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
  }

  /* Reel ------------------------------------------------------------------ */
  const player = $("[data-player]");
  function startReel() {
    if (!player) return;
    const cover = $("[data-play]", player);
    const video = $("video", player);
    const embed = $("[data-vimeo]", player);
    if (cover) cover.hidden = true;
    if (video) {
      video.controls = true;
      const playing = video.play();
      if (playing && playing.catch) playing.catch(() => {});
      video.focus({ preventScroll: true });
    } else if (embed && !embed.firstChild) {
      const frame = document.createElement("iframe");
      frame.src = `https://player.vimeo.com/video/${embed.dataset.vimeo}?autoplay=1&dnt=1`;
      frame.title = embed.dataset.title || "Showreel";
      frame.allow = "autoplay; fullscreen; picture-in-picture";
      frame.setAttribute("allowfullscreen", "");
      embed.append(frame);
    }
  }
  const coverButton = player && $("[data-play]", player);
  if (coverButton) coverButton.addEventListener("click", startReel);
  const heroReel = $("[data-play-reel]");
  if (heroReel && player) {
    heroReel.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("reel").scrollIntoView({ behavior: scrollBehavior, block: "start" });
      history.replaceState(null, "", "#reel");
      startReel(); // called inside the click so mobile browsers allow playback with sound
    });
  }

  /* Lightbox ---------------------------------------------------------------- */
  const dialog = $("[data-lightbox]");
  const thumbs = $$(".photos__button");
  if (dialog && thumbs.length && typeof dialog.showModal === "function") {
    const img = $("[data-lb-img]", dialog);
    const caption = $("[data-lb-caption]", dialog);
    const credit = $("[data-lb-credit]", dialog);
    const count = $("[data-lb-count]", dialog);
    let index = 0;
    let opener = null;

    const preload = (i) => {
      const d = thumbs[(i + thumbs.length) % thumbs.length].dataset;
      const pre = new Image();
      pre.sizes = "100vw";
      pre.srcset = d.srcset;
      pre.src = d.src;
    };
    const show = (i) => {
      index = (i + thumbs.length) % thumbs.length;
      const d = thumbs[index].dataset;
      img.classList.add("is-loading");
      img.sizes = "100vw";
      img.srcset = d.srcset;
      img.src = d.src;
      img.alt = d.alt;
      img.width = d.w;
      img.height = d.h;
      if (img.complete) img.classList.remove("is-loading");
      caption.textContent = d.caption;
      credit.textContent = d.credit;
      count.textContent = `${index + 1} of ${thumbs.length}`;
      preload(index + 1);
      preload(index - 1);
    };
    img.addEventListener("load", () => img.classList.remove("is-loading"));

    thumbs.forEach((button, i) =>
      button.addEventListener("click", () => {
        opener = button;
        show(i);
        dialog.showModal();
      }),
    );
    $("[data-close]", dialog).addEventListener("click", () => dialog.close());
    $("[data-prev]", dialog).addEventListener("click", () => show(index - 1));
    $("[data-next]", dialog).addEventListener("click", () => show(index + 1));
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") show(index + 1);
      if (e.key === "ArrowLeft") show(index - 1);
    });
    dialog.addEventListener("close", () => {
      img.removeAttribute("srcset");
      img.removeAttribute("src");
      if (opener) opener.focus({ preventScroll: true });
    });
    let startX = null;
    let startY = null;
    dialog.addEventListener(
      "pointerdown",
      (e) => {
        if (e.pointerType === "mouse") return;
        startX = e.clientX;
        startY = e.clientY;
      },
      { passive: true },
    );
    dialog.addEventListener("pointerup", (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      startX = startY = null;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) show(dx < 0 ? index + 1 : index - 1);
    });
  }

  /* Contact form ------------------------------------------------------------
     With an endpoint (Formspree), the message posts in the background and the
     fields give way to a "sent" panel. Without one, the visitor's email app
     opens with the message pre-filled. */
  const form = $("[data-contact-form]");
  if (form) {
    const status = $("[data-status]", form);
    const done = $("[data-done]", form);
    const submit = $('button[type="submit"]', form);
    const submitLabel = submit.textContent;
    const fields = $$(".field, .contact-form__actions", form);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      if (data.get("_gotcha")) return; // honeypot
      const fallback = form.dataset.fallback;
      const endpoint = form.dataset.endpoint;
      if (!endpoint) {
        const body = `${data.get("message")}\n\n${data.get("name")}\n${data.get("email")}`;
        status.textContent = `Opening your email app. If nothing happens, write to ${fallback}.`;
        location.href = `mailto:${fallback}?subject=${encodeURIComponent(form.dataset.subject)}&body=${encodeURIComponent(body)}`;
        return;
      }
      submit.disabled = true;
      submit.textContent = form.dataset.sending;
      status.textContent = "";
      try {
        const res = await fetch(endpoint, { method: "POST", headers: { Accept: "application/json" }, body: data });
        if (!res.ok) throw new Error(res.statusText);
        form.reset();
        fields.forEach((el) => (el.hidden = true));
        done.hidden = false;
        done.classList.add("is-shown");
        done.focus({ preventScroll: true });
      } catch {
        status.textContent = `Couldn't send just now. Email ${fallback} instead.`;
      } finally {
        submit.disabled = false;
        submit.textContent = submitLabel;
      }
    });
  }
})();
