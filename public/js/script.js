document.addEventListener("DOMContentLoaded", () => {
    const cups = document.querySelectorAll(".cup")
  
    cups.forEach((cup) => {
      cup.addEventListener("mouseover", () => {
        cup.style.transform = `rotate(${Math.random() * 20 - 10}deg)`
      })
  
      cup.addEventListener("mouseout", () => {
        cup.style.transform = "rotate(0deg)"
      })
    })
  
    // Add smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
        document.querySelector(this.getAttribute("href")).scrollIntoView({
          behavior: "smooth",
        })
      })
    })
  
    // Add animation for features on scroll
    const features = document.querySelectorAll(".feature")
  
    const observerOptions = {
      threshold: 0.2,
    }
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    }, observerOptions)
  
    features.forEach((feature) => {
      feature.style.opacity = "0"
      feature.style.transform = "translateY(20px)"
      feature.style.transition = "all 0.5s ease-out"
      observer.observe(feature)
    })
  
    const form = document.getElementById("contact-form")
    form.addEventListener("submit", (e) => {
      e.preventDefault()
      alert("Thanks for your interest! We'll be in touch soon.")
      form.reset()
    })
  })
  
  