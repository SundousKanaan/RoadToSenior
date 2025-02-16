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
    const article = document.querySelector(link.hash);
    console.log(article, article.offsetTop, link.hash);

    const articleTop = article.offsetTop;

    if (scrollY >= articleTop - article.offsetHeight / 3) {
      console.log("00", link.hash);

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
