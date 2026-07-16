const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");
const backToTop = document.getElementById("backToTop");

function updateScrollUI() {
  const marker = window.scrollY + 130;

  sections.forEach((section) => {
    const isCurrent = marker >= section.offsetTop && marker < section.offsetTop + section.offsetHeight;
    const link = document.querySelector(`.nav-links a[href="#${section.id}"]`);
    if (link) link.classList.toggle("active", isCurrent);
  });

  backToTop.classList.toggle("visible", window.scrollY > 400);
}

let scrollTicking = false;
window.addEventListener("scroll", () => {
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(() => {
    updateScrollUI();
    scrollTicking = false;
  });
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const filterButtons = document.querySelectorAll(".filter-btn");
const publicationItems = [...document.querySelectorAll(".pub-item")];
const publicationHeaders = [...document.querySelectorAll(".pub-section-header")];
const publicationToggle = document.getElementById("publicationToggle");
const publicationToggleWrap = document.getElementById("publicationToggleWrap");
let publicationsExpanded = false;

filterButtons.forEach((button) => {
  const filter = button.dataset.filter;
  const count = filter === "all"
    ? publicationItems.length
    : publicationItems.filter((item) => item.dataset.tags.split(" ").includes(filter)).length;
  const countLabel = document.createElement("span");
  countLabel.className = "filter-count";
  countLabel.textContent = `(${count})`;
  button.appendChild(countLabel);
});

function updatePublications(filter) {
  publicationItems.forEach((item) => {
    const matches = filter === "all" || item.dataset.tags.split(" ").includes(filter);
    const collapsed = filter === "all" && !publicationsExpanded && item.classList.contains("pub-extra");
    item.classList.toggle("hidden", !matches || collapsed);
  });

  publicationHeaders.forEach((header) => {
    const group = header.dataset.group;
    const hasVisibleItem = publicationItems.some((item) => (
      item.dataset.group === group && !item.classList.contains("hidden")
    ));
    header.classList.toggle("hidden", filter !== "all" || !hasVisibleItem);
  });

  const hiddenExtraCount = publicationItems.filter((item) => (
    item.classList.contains("pub-extra") && item.classList.contains("hidden")
  )).length;
  const showToggle = filter === "all" && !publicationsExpanded && hiddenExtraCount > 0;
  publicationToggleWrap.classList.toggle("hidden", !showToggle);
  publicationToggle.textContent = `Load more publications (${hiddenExtraCount} more)`;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((otherButton) => otherButton.classList.remove("active"));
    button.classList.add("active");
    updatePublications(button.dataset.filter);
  });
});

publicationToggle.addEventListener("click", () => {
  publicationsExpanded = true;
  updatePublications("all");
});

const gallery = document.getElementById("photoGallery");
const galleryToggle = document.getElementById("galleryToggle");
const galleryItems = [...document.querySelectorAll(".gallery-item")];

galleryToggle.addEventListener("click", () => {
  gallery.classList.add("expanded");
  galleryToggle.parentElement.hidden = true;
});

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImg");
const lightboxCounter = document.getElementById("lightboxCounter");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrevious = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
let currentPhoto = 0;
let lastFocusedElement = null;

function showPhoto(index) {
  currentPhoto = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentPhoto];
  const thumbnail = item.querySelector("img");
  lightboxImage.src = item.dataset.full;
  lightboxImage.alt = thumbnail.alt;
  lightboxCounter.textContent = `${currentPhoto + 1} / ${galleryItems.length}`;
}

function openLightbox(index) {
  lastFocusedElement = document.activeElement;
  showPhoto(index);
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";
  if (lastFocusedElement) lastFocusedElement.focus();
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index));
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrevious.addEventListener("click", () => showPhoto(currentPhoto - 1));
lightboxNext.addEventListener("click", () => showPhoto(currentPhoto + 1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("active")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showPhoto(currentPhoto - 1);
  if (event.key === "ArrowRight") showPhoto(currentPhoto + 1);
});

updatePublications("all");
updateScrollUI();
