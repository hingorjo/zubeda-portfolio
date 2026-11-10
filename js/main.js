/**
 * Hafsa Shaikh — Academic Internship Portfolio
 * Mobile navigation, active spy, scroll reveals, PDF preview viewer, and image lightbox.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Navigation
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 2. Active Section Spy for Navigation
  const navLinks = document.querySelectorAll(".main-nav a");
  const trackedSections = document.querySelectorAll("section[id]");

  const updateActiveNav = () => {
    const scrollPos = window.scrollY + 120;
    let currentId = "";

    trackedSections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute("href");
      if (href === `#${currentId}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  };

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  // 3. Scroll Reveals using IntersectionObserver
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add("visible"));
  }

  // 4. Document Viewer Modal (PDF Viewer)
  const viewer = document.getElementById("documentViewer");
  const pdfFrame = document.getElementById("pdfFrame");
  const viewerTitle = document.getElementById("viewerTitle");
  const viewerDownload = document.getElementById("viewerDownload");
  const openPdfNewTab = document.getElementById("openPdfNewTab");
  const closeViewerBtn = document.getElementById("closeViewer");
  const viewerError = document.getElementById("viewerError");

  const openDocument = (fileUrl, title) => {
    if (!viewer || !pdfFrame) return;

    viewerTitle.textContent = title || "Document Preview";
    viewerDownload.href = fileUrl;
    openPdfNewTab.href = fileUrl;

    if (viewerError) {
      viewerError.classList.remove("visible");
    }

    // Set frame source
    pdfFrame.style.display = "block";
    pdfFrame.src = fileUrl;

    viewer.classList.add("open");
    viewer.setAttribute("aria-hidden", "false");
    document.body.classList.add("locked");
  };

  const closeViewer = () => {
    if (!viewer || !pdfFrame) return;
    viewer.classList.remove("open");
    viewer.setAttribute("aria-hidden", "true");
    pdfFrame.src = "";
    document.body.classList.remove("locked");
  };

  document.querySelectorAll(".view-document").forEach(btn => {
    btn.addEventListener("click", () => {
      const file = btn.dataset.file;
      const title = btn.dataset.title;
      openDocument(file, title);
    });
  });

  if (closeViewerBtn) closeViewerBtn.addEventListener("click", closeViewer);
  if (viewer) {
    viewer.addEventListener("click", e => {
      if (e.target === viewer) closeViewer();
    });
  }

  // 5. Lightbox for photographs
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const closeLightboxBtn = document.getElementById("closeLightbox");

  const openLightbox = (imgSrc, captionText) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = imgSrc;
    if (lightboxCaption) {
      lightboxCaption.textContent = captionText || "";
    }
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("locked");
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    document.body.classList.remove("locked");
  };

  document.querySelectorAll(".lightbox-trigger").forEach(img => {
    img.addEventListener("click", () => {
      const src = img.getAttribute("src");
      const caption = img.getAttribute("alt") || img.dataset.caption || "";
      openLightbox(src, caption);
    });
  });

  if (closeLightboxBtn) closeLightboxBtn.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", e => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // 6. Global Keyboard Handlers (Escape key)
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeViewer();
      closeLightbox();
      if (mainNav && mainNav.classList.contains("open")) {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    }
  });
});
