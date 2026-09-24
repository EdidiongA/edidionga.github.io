(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  // Mobile navigation
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("siteNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
      });
    });
  }

  // Active nav link on scroll
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll("a[href^='#']")) : [];
  function setActive() {
    var y = window.scrollY + 120;
    var current = null;
    sections.forEach(function (s) { if (s.offsetTop <= y) { current = s.id; } });
    navLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }
  if (sections.length && navLinks.length) {
    window.addEventListener("scroll", setActive, { passive: true });
    setActive();
  }

  // Project filters
  var filterBtns = document.querySelectorAll(".filter-btn");
  var cards = document.querySelectorAll("#projectGrid .card");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) { b.classList.toggle("active", b === btn); });
      cards.forEach(function (c) {
        var cats = (c.getAttribute("data-cat") || "").split(/\s+/);
        var show = f === "all" || cats.indexOf(f) !== -1;
        c.style.display = show ? "" : "none";
      });
    });
  });

  // Contact form: AJAX submit to FormSubmit, which forwards to the owner's email.
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  var sendBtn = document.getElementById("sendBtn");
  function showStatus(kind, text) {
    if (!status) { return; }
    status.className = "form-status " + kind;
    status.textContent = text;
  }
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var message = form.querySelector("#message");
      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        showStatus("err", "Please fill in your name, email and message before sending.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        showStatus("err", "That email address does not look right. Please check it and try again.");
        return;
      }
      var data = new FormData(form);
      sendBtn.disabled = true;
      sendBtn.textContent = "Sending";
      fetch(form.action, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: data
      }).then(function (r) {
        return r.json().then(function (j) { return { ok: r.ok, body: j }; });
      }).then(function (res) {
        if (res.ok && (res.body.success === "true" || res.body.success === true)) {
          showStatus("ok", "Message sent. Thank you. I will reply to " + email.value.trim() + ".");
          form.reset();
        } else {
          var msg = (res.body && res.body.message) ? res.body.message : "";
          showStatus("err", "The message could not be sent. " + (msg || "Please email didianwanane@gmail.com directly."));
        }
      }).catch(function () {
        showStatus("err", "The message could not be sent right now. Please email didianwanane@gmail.com directly.");
      }).finally(function () {
        sendBtn.disabled = false;
        sendBtn.textContent = "Send message";
      });
    });
  }
})();
