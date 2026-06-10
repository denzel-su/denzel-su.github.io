(function () {
  "use strict";

  var navbar = document.getElementById("navbar");
  var themeToggle = document.getElementById("themeToggle");
  var mobileMenuBtn = document.getElementById("mobileMenuBtn");
  var navLinks = document.querySelector(".nav-links");
  var navAnchors = document.querySelectorAll(".nav-links a[href^='#']");
  var currentYearSpan = document.getElementById("currentYear");

  // ===== Footer Year =====
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // ===== Theme Toggle =====
  var theme = localStorage.getItem("theme") || "light";
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme");
      var next = current === "dark" ? "light" : "dark";
      if (next === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      }
    });
  }

  // ===== Mobile Menu =====
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      mobileMenuBtn.classList.toggle("active");
      mobileMenuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // Close mobile menu when a nav link is clicked
  navAnchors.forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      mobileMenuBtn.classList.remove("active");
      if (mobileMenuBtn) {
        mobileMenuBtn.setAttribute("aria-expanded", "false");
      }
    });
  });

  // ===== Navbar Shadow on Scroll =====
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        if (window.scrollY > 10) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // ===== Active Nav Link (Intersection Observer) =====
  var sections = [];
  navAnchors.forEach(function (link) {
    var id = link.getAttribute("href").slice(1);
    var section = document.getElementById(id);
    if (section) {
      sections.push(section);
    }
  });

  if (sections.length > 0 && "IntersectionObserver" in window) {
    var observerOptions = {
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navAnchors.forEach(function (link) {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + id) {
              link.classList.add("active");
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // ===== Fade-in on Scroll (Intersection Observer) =====
  if ("IntersectionObserver" in window) {
    var fadeElements = document.querySelectorAll("section, .timeline-item, .project-card, .education-item");
    var fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    fadeElements.forEach(function (el) {
      fadeObserver.observe(el);
    });
  }

  // ===== Copy Email to Clipboard =====
  var copyEmailLinks = document.querySelectorAll(".copy-email");
  copyEmailLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var email = link.getAttribute("data-email");
      if (!email) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          showCopyToast(link);
        });
      } else {
        // Fallback for older browsers
        var textarea = document.createElement("textarea");
        textarea.value = email;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        showCopyToast(link);
      }
    });
  });

  function showCopyToast(el) {
    var toast = document.createElement("span");
    toast.textContent = "Copied!";
    toast.className = "copy-toast";
    el.appendChild(toast);

    // Position near the element
    requestAnimationFrame(function () {
      toast.classList.add("visible");
    });

    setTimeout(function () {
      toast.classList.remove("visible");
      setTimeout(function () {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 200);
    }, 1500);
  }

  // If no IntersectionObserver support, just show everything
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll("section, .timeline-item, .project-card, .education-item").forEach(function (el) {
      el.style.opacity = "1";
    });
  }
})();
