// main.js

document.addEventListener("DOMContentLoaded", function () {
    fetch("./data.json")
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
      })
      .then((data) => {
        loadSite(data.site);
        loadProfile(data.profile);
        loadResume(data);
        loadProjects(data.projects);
        loadPapers(data.papers, data.profile.name);
        loadContact(data);
      })
      .catch(() => {
        // Without data the skeletons would shimmer forever; say what happened instead
        document.querySelector(".about p").innerHTML =
          'This page couldn\'t load its content. <a href="" onclick="location.reload(); return false;">Try again</a>.';
      })
      .finally(() => document.body.classList.remove("is-loading"));
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
    // Whole years since career_start ("2018-11"), so "{years}+" in the summary never goes stale
    const [startYear, startMonth] = profile.career_start.split("-").map(Number);
    const now = new Date();
    const years = now.getFullYear() - startYear - (now.getMonth() + 1 < startMonth ? 1 : 0);
    document.querySelector(".about p:nth-of-type(1)").textContent = profile.about.replace("{years}", years);
    document.querySelector(".personal-info").innerHTML = profile.info
      .map(
        (item) => `<li><label>${item.label}</label><span>${
          item.url
            ? `<a href="${item.url}"${item.url.startsWith("http") ? ' target="_blank"' : ""}>${item.value}</a>`
            : item.value
        }</span></li>`
      )
      .join("");
    
    // Update social icons in header
    const socialIcons = document.querySelectorAll(".socialicons li a");
    socialIcons[0].href = profile.socials.GitHub;
    socialIcons[1].href = profile.socials.LinkedIn;
    socialIcons[2].href = profile.socials.Twitter;
    socialIcons[3].href = profile.socials.Facebook;
  }
  
  // Emphasise metrics like "60+ TPS", "33M+ events/month", "~50%" so they stand out when skimming
  const metric =
    /[~$]?\d[\d.,]*(?:ms\b)?[KMB]?(?:\+%?|%\+?)?(?::\d+)?(?:\s(?:TPS|kbps|KB\/s|MB|hours|days|weeks|events\/month|peak requests\/hour|daily users|emails\/day|clinics|merged PRs|test files))?/g;
  // Only figures with a +, %, ~, $, ratio or unit count as metrics; plain numbers like "BLE 5.4" stay as they are
  const highlight = (text) =>
    text.replace(metric, (m) => (/[+%~$:]|\s|ms$/.test(m) ? `<strong>${m}</strong>` : m));

  function loadResume(resume) {
    const describe = (job) =>
      job.description.length
        ? `<ul class="duties">${job.description.map((d) => `<li>${highlight(d)}</li>`).join("")}</ul>`
        : "";

    // Group consecutive roles at the same company, LinkedIn style
    const groups = [];
    resume.employment.forEach((job) => {
      const last = groups[groups.length - 1];
      if (last && last[0].company === job.company) last.push(job);
      else groups.push([job]);
    });

    const employment = groups
      .map((jobs) => {
        const single = jobs.length === 1;
        const start = jobs[jobs.length - 1].duration.split(" - ")[0];
        const end = jobs[0].duration.split(" - ").pop();
        const duration = single ? jobs[0].duration : `${start} - ${end}`;
        const roles = jobs
          .map(
            (job) => `
                <li class="role${job.duration.includes("Running") ? " current" : ""}">
                    <h4>${job.position}<span class="timelineDate">${job.duration}</span></h4>
                    ${describe(job)}
                </li>`
          )
          .join("");

        return `
        <li class="company-group">
            <div class="timelineUnit">
                <h4><a target="_blank" href="${jobs[0].url}">${jobs[0].company}</a><span class="timelineDate">${duration}</span></h4>
                ${single ? "" : `<h5>${jobs.length} roles</h5>`}
                <ul class="roles">${roles}
                </ul>
            </div>
        </li>`;
      })
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
  
    // shields.io badge; "-" and "_" are separators in its path, so they are doubled to escape them
    const badge = (item) => {
      const label = encodeURIComponent(item.name).replace(/-/g, "--").replace(/_/g, "__");
      const logo = item.logo ? `&logo=${item.logo}&logoColor=white` : "";
      return `<img src="https://img.shields.io/badge/${label}-${item.color}?style=for-the-badge${logo}" alt="${item.name}" />`;
    };

    const skills = resume.skills
      .map(
        (skill) => `
      <div class="skill-group">
        <h4>${skill.group}</h4>
        <ul>${skill.items.map((item) => `<li>${badge(item)}</li>`).join("")}</ul>
      </div>`
      )
      .join("");

    document.querySelector("#resume .skills-section .skill-groups").innerHTML = skills;
  }
  
  function loadProjects(projects) {
    const slug = (proj) => proj.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const menu = projects
      .map(
        (proj) => `
            <li><a href="?project=${slug(proj)}#projects" data-project="${slug(proj)}">
              <span class="project-menu-meta">${proj.year} · ${proj.type}</span>
              <span class="project-menu-title">${proj.title}</span>
            </a></li>`
      )
      .join("");

    // Every project is rendered once; desktop shows the selected one, phones show them all stacked
    const details = projects
      .map(
        (proj) => `
            <article class="project-card" data-project="${slug(proj)}">
              <div class="project-type">${proj.type}<span class="timelineDate">${proj.year}</span></div>
              <h4 class="project-title">${proj.title}</h4>
              <div class="project-company">${[proj.product, proj.company].filter(Boolean).join(" · ")}${
                proj.url ? ` · <a href="${proj.url}" target="_blank">Visit site</a>` : ""
              }</div>
              <p class="project-hook">${proj.hook}</p>
              <div class="project-impact">${proj.impact
                .map((i) => `<div><strong>${i.value}</strong><span>${i.label}</span></div>`)
                .join("")}</div>
              <ul class="duties">${proj.highlights.map((h) => `<li>${highlight(h)}</li>`).join("")}</ul>
              <div class="tech-stack">${proj.tech_stack.map((t) => `<span>${t}</span>`).join("")}</div>
            </article>`
      )
      .join("");

    const $menu = document.querySelector("#projects .project-menu");
    const $detail = document.querySelector("#projects .project-detail");
    $menu.innerHTML = menu;
    $detail.innerHTML = details;

    // Keep the selected project in the URL (?project=karmo) so reloads and shared links open it
    const select = (key, updateUrl) => {
      if (!$detail.querySelector(`[data-project="${key}"]`)) key = slug(projects[0]);
      document.querySelectorAll("#projects [data-project]").forEach((el) => {
        el.classList.toggle("active", el.dataset.project === key);
      });
      if (updateUrl) {
        const url = new URL(location.href);
        url.searchParams.set("project", key);
        history.replaceState(history.state, "", url);
        document.querySelector("#projects").scrollTop = 0;
      }
    };

    $menu.addEventListener("click", (e) => {
      const link = e.target.closest("a[data-project]");
      if (!link) return;
      e.preventDefault();
      select(link.dataset.project, true);
    });

    select(new URLSearchParams(location.search).get("project"), false);
  }
  
  // "Md Samim Ahmed Bin Hossain" -> "Hossain, M. S. A. B." (APA style)
  const apaName = (name) => {
    const parts = name.replace(/\./g, "").split(/\s+/);
    const last = parts.pop();
    return `${last}, ${parts.map((p) => `${p[0]}.`).join(" ")}`;
  };

  const citations = (paper) => {
    const names = paper.authors.map(apaName);
    const authors = names.length > 1 ? `${names.slice(0, -1).join(", ")}, & ${names[names.length - 1]}` : names[0];
    const source = paper.journal
      ? `. <i>${paper.journal}</i>, <i>${paper.volume}</i>(${paper.issue}).`
      : " [Preprint].";
    // APA prefers the DOI link over any other URL
    const link = paper.doi ? `https://doi.org/${paper.doi}` : paper.url;
    const apa = `${authors} (${paper.year}). ${paper.title}${source}${link ? ` ${link}` : ""}`;

    const key = `${paper.authors[0].split(" ").pop()}${paper.year}${paper.title.split(/\W+/)[0]}`.toLowerCase();
    const fields = [
      ["title", `{${paper.title}}`],
      ["author", paper.authors.join(" and ")],
      paper.journal && ["journal", paper.journal],
      paper.volume && ["volume", paper.volume],
      paper.issue && ["number", paper.issue],
      ["year", paper.year],
      paper.doi && ["doi", paper.doi],
      paper.url && ["url", paper.url],
      !paper.journal && ["note", "Preprint"],
    ].filter(Boolean);
    const bibtex = `@${paper.journal ? "article" : "misc"}{${key},\n${fields
      .map(([k, v]) => `  ${k} = {${v}}`)
      .join(",\n")}\n}`;

    return { apa, bibtex };
  };

  function loadPapers(papers, me) {
    const cites = papers.map(citations);
    const $list = document.querySelector("#research .papers-list");

    $list.innerHTML = papers
      .map(
        (paper, i) => `
        <article class="project-card paper">
          <div class="project-type">${[paper.type, paper.venue].filter(Boolean).join(" · ")}<span class="timelineDate">${paper.year}</span></div>
          <h4 class="project-title">${paper.title}</h4>
          <div class="project-company">${paper.authors
            .map((name) => (name === me ? `<strong>${name}</strong>` : name))
            .join(", ")}</div>
          <h5 class="paper-abstract-label">Abstract</h5>
          <p class="paper-abstract">${highlight(paper.description)}</p>
          <div class="paper-links">
            ${paper.url ? `<a class="paper-link external" href="${paper.url}" target="_blank">View on ${paper.venue.split(" · ")[0]}</a>` : ""}
            <a class="paper-link" href="${paper.pdf_link}" target="_blank">PDF</a>
            <button type="button" class="paper-link cite-toggle" data-paper="${i}">Cite</button>
            ${paper.doi ? `<a class="paper-doi" href="https://doi.org/${paper.doi}" target="_blank">DOI: ${paper.doi}</a>` : ""}
          </div>
          <div class="paper-cite" data-paper="${i}" hidden>
            <p>${cites[i].apa}</p>
            <button type="button" class="cite-copy" data-paper="${i}" data-format="apa">Copy APA</button>
            <button type="button" class="cite-copy" data-paper="${i}" data-format="bibtex">Copy BibTeX</button>
          </div>
        </article>`
      )
      .join("");

    $list.addEventListener("click", (e) => {
      const toggle = e.target.closest(".cite-toggle");
      if (toggle) {
        const panel = $list.querySelector(`.paper-cite[data-paper="${toggle.dataset.paper}"]`);
        panel.hidden = !panel.hidden;
        toggle.classList.toggle("active", !panel.hidden);
        return;
      }
      const copy = e.target.closest(".cite-copy");
      if (copy) {
        const cite = cites[copy.dataset.paper];
        // APA is copied as plain text, without the <i> tags used for display
        const text = copy.dataset.format === "apa" ? cite.apa.replace(/<\/?i>/g, "") : cite.bibtex;
        navigator.clipboard.writeText(text).then(() => {
          const label = copy.textContent;
          copy.textContent = "Copied";
          setTimeout(() => (copy.textContent = label), 1500);
        });
      }
    });
  }
  
  function loadContact(data) {
    const { contact, profile } = data;
    const [city, country] = contact.address.split(",").slice(-2).map((part) => part.trim());
    const [first, ...rest] = profile.name.split(" ");
    const phone = contact.phone.replace(/[^+\d]/g, "");

    // vCard 3.0, the version phone cameras and contact apps read most reliably
    const vcard = (lines) => ["BEGIN:VCARD", "VERSION:3.0", ...lines, "END:VCARD"].join("\r\n");
    const essentials = [
      `N:${rest.join(" ")};${first};;;`,
      `FN:${profile.name}`,
      `TEL:${phone}`,
      `EMAIL:${contact.email}`,
      `URL:${contact.website}`,
    ];

    // The QR code carries only the essentials so it stays coarse enough for any phone camera;
    // the downloadable file has the full card
    if (window.qrcode) {
      const qr = qrcode(0, "L");
      qr.addData(vcard(essentials));
      qr.make();
      document.querySelector("#contact .vcard-qr").innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
    }

    const full = vcard([
      ...essentials,
      `TITLE:${profile.title}`,
      `ORG:${data.employment[0].company}`,
      `ADR;TYPE=WORK:;;;${city};;;${country}`,
      `X-SOCIALPROFILE;TYPE=linkedin:${profile.socials.LinkedIn}`,
    ]);
    document.querySelector("#contact .vcard-download").href = URL.createObjectURL(new Blob([full], { type: "text/vcard" }));

    // The form's error message offers this address as a fallback
    document.querySelector("#contactform").dataset.email = contact.email;
  }
