const openNavButton = document.querySelector("#openNav");
const nav = document.querySelector("header nav");

const modeBtn = document.querySelector("#modeBtn");

modeBtn.addEventListener("click", () => {
  document.body.classList.toggle("darkMode");
});

if (window.matchMedia("(prefers-color-scheme: dark)").matches == true) {
  document.body.classList.add("darkMode");
} else {
  document.body.classList.remove("darkMode");
}

openNavButton.addEventListener("click", () => {
  nav.classList.toggle("open");
  openNavButton.classList.toggle("openNav");
});

// ========================================================================
// ========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const dialog = document.getElementById("project-dialog");
  const closeBtn = document.getElementById("close-modal-btn");

  if (dialog && closeBtn) {
    closeBtn.addEventListener("click", () => {
      dialog.close();
      document.body.classList.remove("no-scroll");
    });

    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
      document.body.classList.remove("no-scroll");
    });
  }
});

// call render articles functions
async function getWebsiteData() {
  try {
    const [aboutRes, skillsRes, projectsRes] = await Promise.all([
      fetch("./data/aboutData.json"),
      fetch("./data/skillsData.json"),
      fetch("./data/projectsData.json"),
    ]);

    if (!aboutRes.ok || !projectsRes.ok) {
      throw new Error(`HTTP error: ${aboutRes.status} ${projectsRes.status}`);
    }

    const aboutData = await aboutRes.json();
    const skillsData = await skillsRes.json();
    const projectsData = await projectsRes.json();

    console.log(skillsData.skills[0]);

    renderAboutContent(aboutData.about);
    renderSkillsContent(skillsData.skills);
    renderProjectsCards(projectsData.projects);
  } catch (error) {
    console.error(error);
  }
}

function renderAboutContent(aboutData) {
  const aboutArticle = document.getElementById("about");

  if (!aboutArticle) return;
  // intro paragraphs
  const introHtml = aboutData.intro
    .map(
      (item) => `
      <p class="info">
        ${item.text}
      </p>
    `,
    )
    .join("");

  // experiences
  const ervaringenHtml = aboutData.ervaringen
    .map(
      (ervaring) => `
      <li>
        <h4>${ervaring.title}</h4>

        <div>
          <p class="info">
            ${ervaring.description}
          </p>

          <p class="quote">
            "${ervaring.quote}"
          </p>
        </div>

        <button class="ervaringLeesMeer">
          <p>Lees meer...</p>
        </button>
      </li>
    `,
    )
    .join("");

  // inject everything
  aboutArticle.innerHTML += `

    ${introHtml}

    <h3>${aboutData.ervaringenTitle}</h3>

    <ul id="ervaringCards">
      ${ervaringenHtml}
    </ul>
  `;

  const openErvaringCardButtons =
    document.querySelectorAll(".ervaringLeesMeer");
  const ervaringCards = document.querySelectorAll("#about ul li");

  openErvaringCardButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetCard = button.closest("li");

      if (targetCard.classList.contains("openCard")) {
        targetCard.classList.remove("openCard");
        button.firstElementChild.innerText = "Lees meer...";
      } else {
        ervaringCards.forEach((ervaringCard) => {
          ervaringCard.classList.remove("openCard");
          console.log(ervaringCard.lastElementChild.firstChild.textContent);
          ervaringCard.lastElementChild.firstElementChild.textContent =
            "Lees meer...";
        });

        targetCard.classList.toggle("openCard");
        button.firstElementChild.innerText = "Lees minder...";
      }
    });
  });
}

function renderSkillsContent(skillsData) {
  const skillsarticle = document.getElementById("skills");

  if (!skillsarticle) return;

  // build skills list
  let categoryHtml = "";
  skillsData.forEach((item) => {
    const skillsList = item.items
      .map(
        (skill) => `
      <li>
        <p>${skill.name}</p>
        ${skill.icon_content}
      </li>
      `,
      )
      .join("");

    categoryHtml += `
      <h4 class="deelTitle">${item.category}</h4>
      <ul>
        ${skillsList}
      </ul>
    `;
  });

  console.log("---", categoryHtml);

  // inject everything; fall back to available fields on skillsData
  skillsarticle.innerHTML += `
    ${categoryHtml}    
  `;
}

function renderProjectsCards(projectsData) {
  const projectsList = document.querySelector(".projectsList");
  if (!projectsList) return;

  const fragment = document.createDocumentFragment();
  const statusArray = {
    InProgress: "In Ontwikkeling",
    completed: "Voltooid",
    paused: "Gepauzeerd",
  };

  projectsData.forEach((projectData) => {
    const li = document.createElement("li");
    li.className = "project";
    const img = document.createElement("img");

    if (projectData.main_image) {
      img.src = projectData.main_image;
      img.alt = projectData.title || "";
    } else {
      img.src = "/images/website-placeholder.svg";
      img.alt = "project placeholder image";
    }

    const title = document.createElement("h3");
    title.textContent = projectData.title;
    title.classList.add("underline");
    const info = document.createElement("p");
    info.className = "info";
    info.innerHTML = projectData.short_description;
    const imgContainer = document.createElement("div");
    imgContainer.className = "imgContainer";
    imgContainer.appendChild(img);
    const badge = document.createElement("div");
    const projectStatus = projectData.status;
    badge.innerText = statusArray[projectStatus] || projectStatus;
    badge.classList.add("badge", projectStatus);
    const button = document.createElement("button");
    button.textContent = "Meer details";

    button.addEventListener("click", () => {
      openProjectModal(projectData, statusArray[projectStatus]);
      document.body.classList.add("no-scroll");
    });

    li.append(title, info, imgContainer, badge, button);
    fragment.appendChild(li);
  });
  projectsList.appendChild(fragment);
}

function openProjectModal(project, displayStatus) {
  const dialog = document.getElementById("project-dialog");
  const modalContent = document.getElementById("modal-dynamic-content");
  if (!dialog || !modalContent) return;

  // 1. making dynamic project links
  let linksHtml = "";
  if (project.links) {
    if (project.links.live_demo)
      linksHtml += `<li><a href="${project.links.live_demo}" target="_blank" class="hilight">🌐 Live Demo</a></li>`;
    if (project.links.repo_fe)
      linksHtml += `<li><a href="${project.links.repo_fe}" target="_blank">💻 Frontend Repo</a></li>`;
    if (project.links.repo_be)
      linksHtml += `<li><a href="${project.links.repo_be}" target="_blank">⚙️ Backend Repo</a></li>`;
    if (project.links.repo_scraping)
      linksHtml += `<li><a href="${project.links.repo_scraping}" target="_blank">🕷️ Scraping Repo</a></li>`;
    if (project.links.originele_site)
      linksHtml += `<li><a href="${project.links.originele_site}" target="_blank">📟 originele site</a></li>`;
  }

  const techHtml = project.tech_stack
    ? project.tech_stack.map((tech) => `<li>${tech}</li>`).join("")
    : "";

  // 2. foto's gallery
  let galleryHtml = "";
  if (
    project.gallery &&
    project.id !== "ajax-fanshop" &&
    project.gallery.length > 0
  ) {
    galleryHtml = `
    <div class="gallery-container"><h3>Visuals</h3> <ul class="gallery-grid">`;
    project.gallery.forEach((item) => {
      galleryHtml += `<li>
        <h4 style="margin:.5em 0;">${item.title}</h4>
        <div class="gallery-item ${item.type_image}">
          <img src="${item.image_src}" loading="lazy" alt="${project.title}">
        `;
      if (item.short_description) {
        galleryHtml += `<span>${item.short_description}</span>`;
      }
    });

    galleryHtml += `</div></li></ul></div>`;
  }

  // 3. if the project was (AYAX - webshop) then make a gallery
  let AjaxGalleryHtml = "";
  if (project.id === "ajax-fanshop" && project.gallery.length > 0) {
    AjaxGalleryHtml = `<div class="gallery-container"><h3>Visuals & Vergelijkingen</h3>`;
    project.gallery.forEach((item) => {
      AjaxGalleryHtml += `
        <h4 style="margin:.5em 0;">${item.title}</h4>
        <div class="gallery-grid">
          ${item.old_img ? `<div class="gallery-item"><img src="${item.old_img}" loading="lazy" alt="${project.title}" /><span>Oud Design</span></div>` : ""}
          <div class="gallery-item"><img src="${item.new_img}" loading="lazy" alt="${project.title}" /><span>${item.old_img ? "Nieuw Design" : "Definitief Design"}</span></div>
        </div>
      `;
    });
    AjaxGalleryHtml += `</div>`;
  }

  const uitdaging = project.details?.uitdaging || "";
  const rolEnAanpak = project.details?.rol_en_aanpak || "";
  const resultaat = project.details?.resultaat || "";

  // 4. inject the dialog html data
  modalContent.innerHTML = `
    <section class="modal-header">
      <h2>${project.title}</h2>
      <span class="modal-status badge ${project.status}">${displayStatus}</span>
    </section>
    <section class="modal-grid">
      <div class="modal-left">
        <h3 class="section-title">De Uitdaging:</h3>
        <p>${uitdaging}</p>
        
        <h3 class="section-title">Mijn Rol & Aanpak:</h3>
        <p>${rolEnAanpak}</p>
        
        <h3 class="section-title">Het Resultaat:</h3>
        <p>${resultaat}</p>
      </div>
      <div class="modal-right">
        <div class="section-title">Technologieën:</div>
        <ul class="modal-tech-list">
          ${techHtml}
        </ul>
        <div class="section-title" style="margin-top:2rem;">Links:</div>
        <ul class="modal-links" style="line-height: 2;">
          ${linksHtml || "<span>Geen openbare links</span>"}
        </ul>
      </div>
    </section>
    ${AjaxGalleryHtml}
  `;

  if (galleryHtml) {
    modalContent.innerHTML += `${galleryHtml}`;
  }

  dialog.showModal();
}

getWebsiteData();
// getProjectsData();

// ===========================================================
// ===========================================================

// NAV LINKS
// haal alle links en sections op
const navLinks = document.querySelectorAll("header nav a");
const articles = document.querySelectorAll("main article");

// --------------------
// CLICK EVENTS
// --------------------

// functie om active class te veranderen
function setActiveLink(targetId) {
  // verwijder class van alle links
  navLinks.forEach((link) => {
    link.classList.remove("selected");
  });

  // voeg class toe aan juiste link
  const activeLink = document.querySelector(
    `header nav a[href="#${targetId}"]`,
  );

  if (activeLink) {
    activeLink.classList.add("selected");
  }
}

// wanneer er op een link geklikt wordt
navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    // haal id op uit href
    const targetId = this.getAttribute("href").replace("#", "");

    // activeer link
    setActiveLink(targetId);
  });
});

// --------------------
// INTERSECTION OBSERVER
// --------------------

const options = {
  rootMargin: "-30% 0px -30% 0px",
};

// callback functie
function observerFunction(entries) {
  entries.forEach((entry) => {
    // check of article zichtbaar is
    if (entry.isIntersecting) {
      // activeer juiste link

      setActiveLink(entry.target.id);
    }
  });
}

// maak observer aan
const observer = new IntersectionObserver(observerFunction, options);

// observeer alle articles
articles.forEach((article) => {
  observer.observe(article);
});
