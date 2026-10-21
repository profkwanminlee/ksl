---
layout: home
title: "Home"
permalink: /
hero_tag: "Nanyang Technological University, Singapore"
hero_title: "Contemporary Korean<br>Studies Lab"
hero_subtitle: "An interdisciplinary research initiative advancing scholarship, dialogue, and exchange on contemporary Korea in Singapore and Southeast Asia."
hero_image: "/images/korea1.jpg"
hero_crop: "center 32%"
description: "Contemporary Korean Studies Lab (CKSL) is an interdisciplinary research initiative based at Nanyang Technological University, Singapore, supporting research, publications, and public programs on contemporary Korea."
---

<!-- Editorial Overview Section -->
<section class="section section-overview" id="overview" data-cksl-block="overview">
  <div class="container">
    <div class="overview-grid">
      <div class="overview-lead-col">
        <div class="overview-header-wrap">
          <div class="overview-header-text">
            <div class="kicker-group">
              <span class="section-kicker" data-cksl-editable="true">Academic Initiative</span>
              <span class="kicker-hangul" data-cksl-editable="true">현대한국학연구소</span>
            </div>
            <h2 class="section-title" data-cksl-editable="true">A Hub for Contemporary Korean Studies in Southeast Asia</h2>
            {% include korean-title-underline.html %}
          </div>
          {% include korean-pavilion.html %}
        </div>
        <p class="overview-lead-text" data-cksl-editable="true">
          Contemporary Korean Studies Lab is an interdisciplinary research initiative based at Nanyang Technological University, Singapore. As one of the first initiatives of its kind in Southeast Asia, the Lab supports research, publications, and public programs on contemporary Korea.
        </p>
      </div>

      <div class="overview-body-col">
        <p class="body-para" data-cksl-editable="true">
          The Lab’s current research focuses on three main areas: <strong>Korea’s IT innovation and digital society</strong>; <strong>contemporary Korean culture and the Korean Wave</strong>; and <strong>human and cultural exchange between Korea and Southeast Asia</strong>. Building on existing research and ongoing collaborations, the Lab examines how Korea is interpreted, translated, and discussed in different cultural, social, and political contexts.
        </p>
        <p class="body-para" data-cksl-editable="true">
          Focusing on contemporary Korean culture and its circulation across Singapore and Southeast Asia, the Lab pays particular attention to the ways digital infrastructures, digital media, and technological systems shape cultural exchange and transformation across the region.
        </p>
        <p class="body-para" data-cksl-editable="true">
          The Lab brings together scholars, students, and institutional partners through research, publications, and public programs. It aims to foster dialogue and build collaborations with academic, cultural, and policy institutions across Asia.
        </p>
      </div>
    </div>

    <!-- Korean Divider -->
    {% include korean-divider.html %}

    <!-- Mission Pillars -->
    <div class="mission-section" data-cksl-block="mission">
      <div class="section-header-centered">
        <span class="section-kicker" data-cksl-editable="true">Core Mission</span>
        <h3 class="subsection-title" data-cksl-editable="true">Advancing Inquiry, Exchange, and Dialogue</h3>
        {% include korean-title-underline.html %}
      </div>
      <div class="mission-grid">
        <div class="mission-card" data-cksl-box="card">
          <span class="mission-num">01</span>
          <div class="mission-text">
            <h4 data-cksl-editable="true">Advancing the Study</h4>
            <p data-cksl-editable="true">Advancing the study of contemporary Korea in Singapore and Southeast Asia through rigorous interdisciplinary scholarship.</p>
          </div>
        </div>
        <div class="mission-card" data-cksl-box="card">
          <span class="mission-num">02</span>
          <div class="mission-text">
            <h4 data-cksl-editable="true">Supporting Dialogue</h4>
            <p data-cksl-editable="true">Supporting research, dialogue, and exchange on Korea across academic, cultural, and policy institutions in Southeast Asia.</p>
          </div>
        </div>
        <div class="mission-card" data-cksl-box="card">
          <span class="mission-num">03</span>
          <div class="mission-text">
            <h4 data-cksl-editable="true">Regional Hub</h4>
            <p data-cksl-editable="true">Serving as an international academic hub for research, collaboration, and public engagement on contemporary Korea.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Research Themes Preview Section -->
<section class="section section-research-preview" id="research-themes" data-cksl-block="research-themes">
  <div class="container">
    <div class="section-header-split">
      <div>
        <div class="kicker-group">
          <span class="section-kicker" data-cksl-editable="true">Inquiry &amp; Scholarship</span>
          <span class="kicker-hangul" data-cksl-editable="true">연구 분야</span>
        </div>
        <h2 class="section-title" data-cksl-editable="true">Three Core Research Themes</h2>
        {% include korean-title-underline.html %}
      </div>
      <a href="{{ '/research/' | relative_url }}" class="section-header-link" data-cksl-editable="true">
        View Detailed Themes &amp; Projects &rarr;
      </a>
    </div>

    <div class="themes-grid">
      {% assign research_themes = site.data.research_themes.themes | default: site.data.research_themes %}
      {% for theme in research_themes %}
      <article class="theme-card" data-cksl-box="card">
        <div class="theme-card-header">
          <div class="theme-num-box">
            <span class="theme-number">{{ theme.number }}</span>
          </div>
          <h3 class="theme-title" data-cksl-editable="true">{{ theme.title }}</h3>
        </div>
        <p class="theme-tagline" data-cksl-editable="true">{{ theme.tagline }}</p>
        <p class="theme-description" data-cksl-editable="true">{{ theme.description }}</p>
        <ul class="theme-points">
          {% for pt in theme.focus_points %}
          <li data-cksl-editable="true">{{ pt }}</li>
          {% endfor %}
        </ul>
        <div class="theme-card-footer">
          <a href="{{ '/research/' | relative_url }}#{{ theme.id }}" class="theme-detail-link" data-cksl-editable="true">
            Explore Theme &rarr;
          </a>
        </div>
      </article>
      {% endfor %}
    </div>
  </div>
</section>

<!-- Editorial Pathways: Publications, Events, News & People -->
<section class="section section-pathways" data-cksl-block="pathways">
  <div class="container">
    <div class="section-header-centered">
      <div class="kicker-group">
        <span class="section-kicker" data-cksl-editable="true">Lab Pathways</span>
        <span class="kicker-hangul" data-cksl-editable="true">학술 및 커뮤니티</span>
      </div>
      <h2 class="section-title" data-cksl-editable="true">Scholarship, Programs &amp; Community</h2>
      {% include korean-title-underline.html %}
    </div>

    <div class="pathways-grid">
      <!-- Pathway 1: Selected Publications -->
      <div class="pathway-card" data-cksl-box="card">
        <div class="pathway-card-header">
          <span class="pathway-tag" data-cksl-editable="true">Scholarship</span>
          <h3 class="pathway-title" data-cksl-editable="true">Publications</h3>
        </div>
        <p class="pathway-desc" data-cksl-editable="true">
          Peer-reviewed monographs, journal articles, working papers, and policy briefings examining modern Korean media and society.
        </p>
        <div class="pathway-preview-item">
          <span class="pathway-preview-meta" data-cksl-editable="true">Telematics &amp; Informatics &bull; 2024</span>
          <p class="pathway-preview-title" data-cksl-editable="true">Social Presence and AI Companionship in Smart Living Environments</p>
        </div>
        <a href="{{ '/publications/' | relative_url }}" class="pathway-link" data-cksl-editable="true">
          View Publications &rarr;
        </a>
      </div>

      <!-- Pathway 2: Programs & Events -->
      <div class="pathway-card" data-cksl-box="card">
        <div class="pathway-card-header">
          <span class="pathway-tag" data-cksl-editable="true">Engagement</span>
          <h3 class="pathway-title" data-cksl-editable="true">Programs &amp; Events</h3>
        </div>
        <p class="pathway-desc" data-cksl-editable="true">
          Public symposia, research colloquia, and international seminars connecting scholars and cultural practitioners across Asia.
        </p>
        <div class="pathway-preview-item">
          <span class="pathway-preview-meta" data-cksl-editable="true">18 Nov 2026 &bull; Hybrid Symposium</span>
          <p class="pathway-preview-title" data-cksl-editable="true">Korea-Southeast Asia Transnational Connectivity: Media &amp; Society</p>
        </div>
        <a href="{{ '/programs-events/' | relative_url }}" class="pathway-link" data-cksl-editable="true">
          Explore Programs &amp; Events &rarr;
        </a>
      </div>

      <!-- Pathway 3: News & Announcements -->
      <div class="pathway-card" data-cksl-box="card">
        <div class="pathway-card-header">
          <span class="pathway-tag" data-cksl-editable="true">Notices</span>
          <h3 class="pathway-title" data-cksl-editable="true">News &amp; Opportunities</h3>
        </div>
        <p class="pathway-desc" data-cksl-editable="true">
          Academic opportunities, calls for papers, visiting scholar appointments, and news from KSL research initiatives.
        </p>
        <div class="pathway-preview-item">
          <span class="pathway-preview-meta" data-cksl-editable="true">Oct 2026 &bull; Visiting Fellowship</span>
          <p class="pathway-preview-title" data-cksl-editable="true">Inaugural Call for Visiting Research Fellows in Contemporary Korean Studies</p>
        </div>
        <a href="{{ '/news/' | relative_url }}" class="pathway-link" data-cksl-editable="true">
          Read News &rarr;
        </a>
      </div>

      <!-- Pathway 4: People & Leadership with Prof. Lee Portrait -->
      <div class="pathway-card pathway-card-people" data-cksl-box="card">
        <div class="pathway-card-header">
          <span class="pathway-tag" data-cksl-editable="true">Community</span>
          <h3 class="pathway-title" data-cksl-editable="true">People &amp; Leadership</h3>
        </div>
        <div class="pathway-director-row">
          <img src="{{ '/images/profkwanportrait.jpeg' | relative_url }}" alt="Prof. Kwan Min Lee" class="pathway-director-thumb" data-cksl-image="director">
          <div class="pathway-director-info">
            <strong data-cksl-editable="true">Prof. Kwan Min Lee</strong>
            <span data-cksl-editable="true">Director, KSL</span>
          </div>
        </div>
        <p class="pathway-desc" data-cksl-editable="true">
          Directed by Prof. Kwan Min Lee (Korea Foundation Endowed Chair Professor), supported by affiliate faculty and researchers.
        </p>
        <a href="{{ '/people/' | relative_url }}" class="pathway-link" data-cksl-editable="true">
          Meet the Community &rarr;
        </a>
      </div>
    </div>
  </div>
</section>

<!-- Collaboration & Dialogue Invitation Banner -->
<section class="section section-cta-banner" data-cksl-block="cta">
  <div class="container">
    <div class="cta-banner-box" data-cksl-box="card">
      <div class="cta-banner-content">
        <div class="kicker-group">
          <span class="cta-kicker" data-cksl-editable="true">Regional Collaboration</span>
          <span class="kicker-hangul" data-cksl-editable="true">학술 교류 협력</span>
        </div>
        <h2 class="cta-title" data-cksl-editable="true">Fostering Academic, Cultural &amp; Policy Partnerships</h2>
        <p class="cta-desc" data-cksl-editable="true">
          The Contemporary Korean Studies Lab welcomes proposals for collaborative research projects, visiting scholar visits, joint symposiums, and cultural or policy dialogues from institutions across Singapore, Korea, and Southeast Asia.
        </p>
        <div class="cta-actions">
          <a href="{{ '/contact/' | relative_url }}" class="btn btn-primary" data-cksl-editable="true">
            Contact the Lab &amp; Submit Enquiries
            <span class="btn-arrow" aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
