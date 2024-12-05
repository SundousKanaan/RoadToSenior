const openNavButton = document.querySelector("#openNav");
const nav = document.querySelector("header nav");

function openNav() {
  nav.classList.toggle("open");
  openNavButton.classList.toggle("openNav");
}

openNavButton.addEventListener("click", openNav);

const navLinks = document.querySelectorAll("header nav a");
navLinks.forEach((link) => {
  link.addEventListener("click", getTarget);
});

function getTarget() {
  navLinks.forEach((navLink) => navLink.classList.remove("selected"));
  this.classList.add("selected");
}

window.addEventListener("scroll", () => {
  let current = "";
  navLinks.forEach((link) => {
    const section = document.querySelector(link.hash);
    const sectionTop = section.offsetTop;
    if (scrollY >= sectionTop - section.offsetHeight / 2) {
      current = link.hash;
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove("selected");
    if (link.hash === current) {
      link.classList.add("selected");
    }
  });
});
