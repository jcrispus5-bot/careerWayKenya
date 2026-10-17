
document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. MOBILE NAVIGATION - ALL PAGES
  // ==========================================

  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      const isExpanded =
        menuBtn.getAttribute("aria-expanded") === "true";

      menuBtn.setAttribute("aria-expanded", String(!isExpanded));

      navLinks.classList.toggle("hidden", isExpanded);
      navLinks.classList.toggle("flex", !isExpanded);
    });

    // Close menu after clicking a navigation link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.add("hidden");
        navLinks.classList.remove("flex");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });

    // Close menu with the Escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        navLinks.classList.add("hidden");
        navLinks.classList.remove("flex");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.focus();
      }
    });
  }

  // ==========================================
  // 2. AUTOMATIC COPYRIGHT YEAR - ALL PAGES
  // ==========================================

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ==========================================
  // 3. CAREER SEARCH AND FILTER
  // career.html
  // ==========================================

  const careerSearch = document.getElementById("careerSearch");
  const categoryFilter = document.getElementById("categoryFilter");
  const careerCards = [
    ...document.querySelectorAll("[data-career]")
  ];
  const noCareers = document.getElementById("noCareers");

  function filterCareers() {
    const query = careerSearch?.value.toLowerCase().trim() || "";
    const category = categoryFilter?.value || "all";

    let visibleCount = 0;

    careerCards.forEach((card) => {
      const cardText = card.textContent.toLowerCase();
      const cardCategory = card.dataset.category;

      const matchesSearch = cardText.includes(query);
      const matchesCategory =
        category === "all" || cardCategory === category;

      const shouldShow = matchesSearch && matchesCategory;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount++;
      }
    });

    if (noCareers) {
      noCareers.hidden = visibleCount > 0;
    }
  }

  if (careerSearch) {
    careerSearch.addEventListener("input", filterCareers);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterCareers);
  }

  // Read category from homepage links:
  // career.html?category=technology

  if (categoryFilter) {
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get("category");

    if (requestedCategory) {
      const matchingOption = [
        ...categoryFilter.options
      ].find((option) => option.value === requestedCategory);

      if (matchingOption) {
        categoryFilter.value = requestedCategory;
        filterCareers();
      }
    }
  }

  // ==========================================
  // 4. LEARNING PATH PROGRESS
  // paths.html
  // ==========================================

  const pathCards = document.querySelectorAll("[data-path]");

  pathCards.forEach((pathCard, index) => {
    const checkboxes = [
      ...pathCard.querySelectorAll("[data-path-check]")
    ];

    const progressBar = pathCard.querySelector("[data-progress]");
    const progressText = pathCard.querySelector(
      "[data-progress-text]"
    );

    if (checkboxes.length === 0) return;

    // Unique storage key for each learning path
    const storageKey = `pathfinder-progress-${index}`;

    // Restore saved progress
    try {
      const savedProgress = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );

      checkboxes.forEach((checkbox, checkboxIndex) => {
        checkbox.checked = Boolean(savedProgress[checkboxIndex]);
      });
    } catch (error) {
      console.warn("Could not restore learning progress.", error);
    }

    function updateProgress() {
      const completed = checkboxes.filter(
        (checkbox) => checkbox.checked
      ).length;

      const total = checkboxes.length;
      const percentage = Math.round((completed / total) * 100);

      if (progressBar) {
        progressBar.style.width = `${percentage}%`;
      }

      if (progressText) {
        progressText.textContent =
          `${completed} of ${total} steps completed (${percentage}%)`;
      }

      // Save progress for the next visit
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify(
            checkboxes.map((checkbox) => checkbox.checked)
          )
        );
      } catch (error) {
        console.warn("Could not save learning progress.", error);
      }
    }

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", updateProgress);
    });

    updateProgress();
  });

  // ==========================================
  // 5. RESOURCE ARTICLES
  // resources.html
  // ==========================================

  const resourceDetails = document.querySelectorAll(
    ".resource-card details"
  );

  resourceDetails.forEach((detail) => {
    detail.addEventListener("toggle", () => {
      if (!detail.open) return;

      // Close other resource articles when one opens
      resourceDetails.forEach((otherDetail) => {
        if (otherDetail !== detail) {
          otherDetail.open = false;
        }
      });
    });
  });

  // ==========================================
  // 6. CONTACT FORM VALIDATION
  // contact.html
  // ==========================================

  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Use built-in HTML validation
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const name = document.getElementById("name")?.value.trim();
      const email = document.getElementById("email")?.value.trim();
      const message = document.getElementById("message")?.value.trim();

      if (!name || !email || !message) {
        if (formMessage) {
          formMessage.textContent =
            "Please complete all required fields.";
          formMessage.hidden = false;
        }
        return;
      }

      // This is a front-end demo, not a message delivery service.
      if (formMessage) {
        formMessage.textContent =
          "Your form is valid! To send your message, connect this form to a backend or form service.";
        formMessage.hidden = false;
      }
    });
  }

  // ==========================================
  // 7. CURRENT PAGE NAVIGATION ACCESSIBILITY
  // ==========================================

  const currentPage = window.location.pathname
    .split("/")
    .pop() || "index.html";

  document.querySelectorAll("#navLinks a").forEach((link) => {
    const linkPage = new URL(link.href).pathname.split("/").pop();

    if (linkPage === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });
});
