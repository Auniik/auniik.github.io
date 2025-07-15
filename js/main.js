// main.js

document.addEventListener("DOMContentLoaded", function () {
    fetch("./data.json")
      .then((response) => response.json())
      .then((data) => {
        loadSite(data.site);
        loadProfile(data.profile);
        loadResume(data);
        loadProjects(data.projects);
        loadPapers(data.papers);
        loadContact(data.contact);
      });
  });
  
  function loadSite(site) {
    // Update page title
    document.title = site.title;
    
    // Update header
    document.querySelector("#logo h2").textContent = site.header.name;
    document.querySelector("#logo h4").textContent = site.header.title;
    document.querySelector(".socials-text").textContent = site.header.social_text;
    
    // Update footer
    document.querySelector(".copyright").innerHTML = `Copyright © <script>document.write(new Date().getFullYear())</script> ${site.footer.copyright}.`;
  }
  
  function loadProfile(profile) {
    document.querySelector(".about h1").textContent = profile.name;
    document.querySelector(".about h3").textContent = profile.title;
    document.querySelector(".about p:nth-of-type(1)").textContent = profile.about;
    document.querySelector(".about p:nth-of-type(2)").textContent = profile.location;
    
    // Update personal info
    const personalInfo = document.querySelector(".personal-info");
    personalInfo.innerHTML = "";

    Object.entries(profile.info).forEach(([label, value]) => {
      if (label === "GitHub" || label === "LinkedIn") {
        personalInfo.innerHTML += `<li><label>${label}</label><span class="word-wrap"><a href="${value}" target="_blank">${value}</a></span></li>`;
      } else {
        personalInfo.innerHTML += `<li><label>${label}</label><span>${value}</span></li>`;
      }
    });
    
    // Update social icons in header
    const socialIcons = document.querySelectorAll(".socialicons li a");
    socialIcons[0].href = profile.socials.GitHub;
    socialIcons[1].href = profile.socials.LinkedIn;
    socialIcons[2].href = profile.socials.Twitter;
    socialIcons[3].href = profile.socials.Facebook;
  }
  
  function loadResume(resume) {
    const employment = resume.employment
      .map(
        (job) => `
        <li>
            <div class="timelineUnit">
                <h4>${job.position}<span class="timelineDate">${job.duration}</span></h4>
                <h5><a target="_blank" href="${job.url}">${job.company}</a> </h5>
                <p>- ${job.description.join("<br> - ")}</p>
            </div>
        </li>`
      )
      .join("");

      let clear = `<div class="clear"></div>`;
    
  
    document.querySelectorAll("#resume .timeline-section ul.timeline")[0].innerHTML = employment + clear;
  
    const education = resume.education
      .map(
        (edu) => `
      <li>
        <div class="timelineUnit">
          <h4>${edu.institute}<span class="timelineDate">${edu.duration}</span></h4>
          <h5>${edu.degree}</h5>
          <p>${edu.note}</p>
        </div>
      </li>`
      )
      .join("");
  
    document.querySelectorAll("#resume .timeline-section ul.timeline")[1].innerHTML = education + clear;
  
    // const skills = resume.skills
    //   .map(
    //     (skill) => `
    //   <li>
    //     <h4>${skill.name}</h4>
    //     <div class="rating" data-rat="${skill.level}"></div>
    //   </li>`
    //   )
    //   .join("");
  
    // document.querySelector("#resume .skills-section ul.skills").innerHTML = skills;
  }
  
  function loadProjects(projects) {
    const projectList = projects
      .map(
        (proj) => {
          // Generate simple tech badges (limit to 3-4 key technologies)
          const techBadges = proj.tech_stack ? proj.tech_stack.map(tech => 
            `<span class="tech-badge">${tech}</span>`
          ).join('') : '';

          return `
            <div class="project-card">
              <div class="project-header">
                <h3 class="project-title">${proj.title}</h3>
                ${proj.type ? `<span class="project-type">${proj.type}</span>` : ''}
              </div>
              
              ${proj.company ? `<div class="project-company">${proj.company} • ${proj.year || proj.category}</div>` : ''}
              
              ${proj.impact ? `<div class="project-impact">${proj.impact}</div>` : ''}
              
              ${proj.hook ? `<div class="project-hook">${proj.hook}</div>` : ''}
              
              ${proj.responsibility ? `<div class="project-responsibility"><strong>Responsibility:</strong> ${proj.responsibility}</div>` : ''}
              
              ${techBadges ? `<div class="tech-stack">${techBadges}</div>` : ''}
            </div>
          `;
        }
      )
      .join("");

    document.querySelector("#projects-timeline").innerHTML = projectList;
  }
  
  function loadPapers(papers) {
    const papersList = papers
  .map((paper) => `
    <li style="margin-bottom: 290px;">                   
      <div class="timelineUnit left">
        <h4>${paper.title}<span class="timelineDate">${paper.year}</span></h4>
        <h5>${paper.subtitle}</h5>
        <p>${paper.description}</p>
      </div>
      <div class="right">
        <ul class="skills">
          ${paper.authors.map(author => `
            <li>
              <h4>${author.name}</h4>
              <div class="intouch">
                <a href="${author.website}" target="_blank"><span data-icon="&#xe000;" aria-hidden="true"></span></a>
                ${author.linkedin ? `<a href="${author.linkedin}" target="_blank"><span data-icon="&#xe02c;" aria-hidden="true"></span></a>` : ''}
                ${author.github ? `<a href="${author.github}" target="_blank"><span data-icon="&#xe01f;" aria-hidden="true"></span></a>` : ''}
              </div>
            </li>
          `).join('')}
        </ul>
        <div class="clear"></div>
        <a href="${paper.pdf_link}" class="button transition" target="_blank">Download Paper in PDF Format</a>
      </div>
    </li>
  `)
  .join("");
    document.querySelector("#papers .timeline").innerHTML = papersList;
  }
  
  function loadContact(contact) {
    const contactInfo = document.querySelector(".contact-info ul");
    contactInfo.innerHTML = `
      <li>${contact.address}</li>
      <li>Email: <a href="mailto:${contact.email}">${contact.email}</a></li>
      <li>Phone: <a href="tel:${contact.phone}">${contact.phone}</a></li>
      <li><a href="${contact.website}">${contact.website}</a></li>
    `;
  }