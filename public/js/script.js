document.addEventListener("DOMContentLoaded", () => {
  // Cup hover animation
  const cups = document.querySelectorAll(".cup");

  cups.forEach((cup) => {
    cup.addEventListener("mouseover", () => {
      cup.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
    });

    cup.addEventListener("mouseout", () => {
      cup.style.transform = "rotate(0deg)";
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Animate features on scroll
  const features = document.querySelectorAll(".feature");

  const observerOptions = {
    threshold: 0.2,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  features.forEach((feature) => {
    feature.style.opacity = "0";
    feature.style.transform = "translateY(20px)";
    feature.style.transition = "all 0.5s ease-out";
    observer.observe(feature);
  });

  // Contact form handler
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thanks for your interest! We'll be in touch soon.");
      form.reset();
    });
  }

  // Hamburger menu toggle for small devices
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }
});
