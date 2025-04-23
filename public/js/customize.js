document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("customization-form");
    const quantityInput = document.getElementById("quantity-range");
    const quantityDisplay = document.getElementById("quantity-display");
  
    const previewList = document.querySelector(".preview-section ul");
    const previewImage = document.querySelector(".cup-image img");
  
    // Preview state
    let previewData = {
      size: "Medium (12 oz)",
      design: "Full Design",
      color: "#0066a1",
      features: ["QR Code Integration"],
      quantity: "5,000 cups"
    };
  
    const updatePreview = () => {
      const listItems = [];
  
      listItems.push(`✓ ${previewData.size} Cup`);
      listItems.push(`✓ ${previewData.design} Coverage`);
      listItems.push(`✓ Primary Color: ${previewData.color}`);
      previewData.features.forEach((feature) => listItems.push(`✓ ${feature}`));
      listItems.push(`✓ Quantity: ${previewData.quantity}`);
  
      previewList.innerHTML = listItems.map((li) => `<li>${li}</li>`).join("");
      previewImage.style.borderColor = previewData.color;
    };
  
    const getCheckedValue = (selector) => {
      const checked = form.querySelector(`${selector}:checked`);
      return checked ? checked.value : "";
    };
  
    const getCheckedFeatures = () => {
      const checked = form.querySelectorAll('input[name="features"]:checked');
      return Array.from(checked).map((el) => {
        switch (el.value) {
          case "qr-code": return "QR Code Integration";
          case "special-finish": return "Special Finish";
          case "eco-materials": return "Eco-Friendly Materials";
          case "cup-sleeve": return "Custom Cup Sleeve";
          default: return el.value;
        }
      });
    };
  
    // Event listeners
    form.addEventListener("change", () => {
      previewData.size = {
        small: "Small (8 oz)",
        medium: "Medium (12 oz)",
        large: "Large (16 oz)"
      }[getCheckedValue('input[name="cup-size"]')] || "Medium (12 oz)";
  
      previewData.design = {
        "logo-only": "Logo Only",
        "partial": "Partial Design",
        "full": "Full Design"
      }[getCheckedValue('input[name="design-coverage"]')] || "Full Design";
  
      previewData.color = form.querySelector('input[name="primary-color"]').value || "#0066a1";
  
      previewData.features = getCheckedFeatures();
  
      previewData.quantity = parseInt(quantityInput.value).toLocaleString() + " cups";
  
      updatePreview();
    });
  
    // Initial preview setup
    updatePreview();
  
    // Update quantity display
    quantityInput.addEventListener("input", () => {
      previewData.quantity = parseInt(quantityInput.value).toLocaleString() + " cups";
      quantityDisplay.textContent = previewData.quantity;
      updatePreview();
    });
  
    // Animate features on scroll
    const features = document.querySelectorAll(".feature");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, { threshold: 0.2 });
  
    features.forEach((feature) => {
      feature.style.opacity = "0";
      feature.style.transform = "translateY(20px)";
      feature.style.transition = "all 0.5s ease-out";
      observer.observe(feature);
    });
  
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
          behavior: "smooth",
        });
      });
    });
  
    // Form submission
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
  
        const formData = new FormData(form);
  
        try {
          const response = await fetch("/customize", {
            method: "POST",
            body: formData,
          });
  
          if (response.ok) {
            const name = formData.get("customer-name");
            const contact = formData.get("customer-contact");
            const address = formData.get("customer-address");
  
            alert(`Thanks for your interest, ${name}!\n\nWe'll contact you at ${contact} and deliver to:\n${address}`);
            form.reset();
            quantityDisplay.textContent = "5,000 cups";
            previewData = {
              size: "Medium (12 oz)",
              design: "Full Design",
              color: "#0066a1",
              features: [],
              quantity: "5,000 cups"
            };
            updatePreview();
          } else {
            alert("Something went wrong while submitting your customization. Please try again.");
          }
        } catch (error) {
          console.error("Form submission error:", error);
          alert("An error occurred. Please check your connection and try again.");
        }
      });
    }
  });
  