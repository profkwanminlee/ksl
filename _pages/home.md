---
layout: home
title: "Home"
permalink: /
hero_tag: "Nanyang Technological University, Singapore"
hero_title: "Korean Studies Lab"
hero_subtitle: "An interdisciplinary research initiative advancing scholarship, dialogue, and exchange on contemporary Korea in Singapore and Southeast Asia."
hero_image: "/images/korea1.jpg"
hero_crop: "center 32%"
description: "Korean Studies Lab (KSL) is an interdisciplinary research initiative based at Nanyang Technological University, Singapore, supporting research, publications, and public programs on contemporary Korea."
---

<!-- Editorial Overview Section -->
<section class="section section-overview" id="overview">
  <div class="container">
    <div class="overview-grid">
      <div class="overview-lead-col">
        <div class="overview-header-wrap">
          <div class="overview-header-text">
            <div class="kicker-group">
              <span class="section-kicker">Academic Initiative</span>
            </div>
            <h2 class="section-title">A Hub for Contemporary Korean Studies in Southeast Asia</h2>
            {% include korean-title-underline.html %}
          </div>
        </div>
        <p class="overview-lead-text">
          Korean Studies Lab is an interdisciplinary research initiative based at Nanyang Technological University, Singapore. As one of the first initiatives of its kind in Southeast Asia, the Lab supports research, publications, and public programs on contemporary Korea.
        </p>
      </div>

      <div class="overview-body-col">
        <p class="body-para">
          The Lab’s current research focuses on three main areas: <strong>Korea’s IT innovation and digital society</strong>; <strong>contemporary Korean culture and the Korean Wave</strong>; and <strong>human and cultural exchange between Korea and Southeast Asia</strong>. Building on existing research and ongoing collaborations, the Lab examines how Korea is interpreted, translated, and discussed in different cultural, social, and political contexts.
        </p>
        <p class="body-para">
          Focusing on contemporary Korean culture and its circulation across Singapore and Southeast Asia, the Lab pays particular attention to the ways digital infrastructures, digital media, and technological systems shape cultural exchange and transformation across the region.
        </p>
        <p class="body-para">
          The Lab brings together scholars, students, and institutional partners through research, publications, and public programs. It aims to foster dialogue and build collaborations with academic, cultural, and policy institutions across Asia.
        </p>
      </div>
    </div>

    <!-- Divider -->
    {% include korean-divider.html %}

    <!-- Mission Pillars -->
    <div class="mission-section">
      <div class="section-header-centered">
        <span class="section-kicker">Core Mission</span>
        <h3 class="subsection-title">Advancing Inquiry, Exchange, and Dialogue</h3>
        {% include korean-title-underline.html %}
      </div>
      <div class="mission-grid">
        <div class="mission-card">
          <span class="mission-num">01</span>
          <div class="mission-text">
            <h4>Advancing the Study</h4>
            <p>Advancing the study of contemporary Korea in Singapore and Southeast Asia through rigorous interdisciplinary scholarship.</p>
          </div>
        </div>
        <div class="mission-card">
          <span class="mission-num">02</span>
          <div class="mission-text">
            <h4>Supporting Dialogue</h4>
            <p>Supporting research, dialogue, and exchange on Korea across academic, cultural, and policy institutions in Southeast Asia.</p>
          </div>
        </div>
        <div class="mission-card">
          <span class="mission-num">03</span>
          <div class="mission-text">
            <h4>Regional Hub</h4>
            <p>Serving as an international academic hub for research, collaboration, and public engagement on contemporary Korea.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Research Themes Preview Section -->
<section class="section section-research-preview" id="research-themes">
  <div class="container">
    <div class="section-header-split">
      <div>
        <div class="kicker-group">
          <span class="section-kicker">Inquiry &amp; Scholarship</span>
        </div>
        <h2 class="section-title">Three Core Research Themes</h2>
        {% include korean-title-underline.html %}
      </div>
      <a href="{{ '/research/' | relative_url }}" class="section-header-link">
        View Detailed Themes &amp; Projects &rarr;
      </a>
    </div>

    <div class="themes-grid">
      {% assign research_themes = site.data.research_themes.themes | default: site.data.research_themes %}
      {% for theme in research_themes %}
      <article class="theme-card">
        <div class="theme-card-header">
          <div class="theme-num-box">
            <span class="theme-number">{{ theme.number }}</span>
          </div>
          <h3 class="theme-title">{{ theme.title }}</h3>
        </div>
        <p class="theme-tagline">{{ theme.tagline }}</p>
        <p class="theme-description">{{ theme.description }}</p>
        <ul class="theme-points">
          {% for pt in theme.focus_points %}
          <li>{{ pt }}</li>
          {% endfor %}
        </ul>
        <div class="theme-card-footer">
          <a href="{{ '/research/' | relative_url }}#{{ theme.id }}" class="theme-detail-link">
            Explore Theme &rarr;
          </a>
        </div>
      </article>
      {% endfor %}
    </div>
  </div>
</section>

<!-- Editorial Pathways: Publications, News & Events, & People -->
<section class="section section-pathways">
  <div class="container">
    <div class="section-header-centered">
      <div class="kicker-group">
        <span class="section-kicker">Lab Pathways</span>
      </div>
      <h2 class="section-title">Scholarship, Programs &amp; Community</h2>
      {% include korean-title-underline.html %}
    </div>

    <div class="pathways-grid">
      <!-- Pathway 1: Selected Publications -->
      <div class="pathway-card">
        <div class="pathway-card-header">
          <span class="pathway-tag">Scholarship</span>
          <h3 class="pathway-title">Publications</h3>
        </div>
        <p class="pathway-desc">
          Peer-reviewed monographs, journal articles, working papers, and policy briefings examining modern Korean media and society.
        </p>
        <div class="pathway-preview-item">
          <span class="pathway-preview-meta">Telematics &amp; Informatics &bull; 2024</span>
          <p class="pathway-preview-title">Social Presence and AI Companionship in Smart Living Environments</p>
        </div>
        <a href="{{ '/publications/' | relative_url }}" class="pathway-link">
          View Publications &rarr;
        </a>
      </div>

      <!-- Pathway 2: News & Events -->
      <div class="pathway-card">
        <div class="pathway-card-header">
          <span class="pathway-tag">Engagement</span>
          <h3 class="pathway-title">News &amp; Events</h3>
        </div>
        <p class="pathway-desc">
          Academic symposia, research collaborations, announcements, and international seminars connecting scholars across Asia.
        </p>
        <div class="pathway-preview-item">
          <span class="pathway-preview-meta">Jan 2027 &bull; Upcoming Symposium</span>
          <p class="pathway-preview-title">Korean Studies and Digital Regionalism</p>
        </div>
        <a href="{{ '/events/' | relative_url }}" class="pathway-link">
          Explore News &amp; Events &rarr;
        </a>
      </div>

      <!-- Pathway 3: Research Focus -->
      <div class="pathway-card">
        <div class="pathway-card-header">
          <span class="pathway-tag">Inquiry</span>
          <h3 class="pathway-title">Research Themes</h3>
        </div>
        <p class="pathway-desc">
          Three interdisciplinary research pillars investigating IT innovation, contemporary culture &amp; Hallyu, and regional exchange.
        </p>
        <div class="pathway-preview-item">
          <span class="pathway-preview-meta">Core Focus 01</span>
          <p class="pathway-preview-title">Korea's IT Innovation and Digital Society</p>
        </div>
        <a href="{{ '/research/' | relative_url }}" class="pathway-link">
          Explore Research &rarr;
        </a>
      </div>

      <!-- Pathway 4: People & Leadership with Prof. Lee Portrait -->
      <div class="pathway-card pathway-card-people">
        <div class="pathway-card-header">
          <span class="pathway-tag">Community</span>
          <h3 class="pathway-title">People &amp; Leadership</h3>
        </div>
        <div class="pathway-director-row">
          <img src="{{ '/images/profkwanportrait.jpeg' | relative_url }}" alt="Prof. Kwan Min Lee" class="pathway-director-thumb">
          <div class="pathway-director-info">
            <strong>Prof. Kwan Min Lee</strong>
            <span>Director, KSL</span>
          </div>
        </div>
        <p class="pathway-desc">
          Directed by Prof. Kwan Min Lee (Korea Foundation Endowed Chair Professor), supported by affiliate faculty and scholars.
        </p>
        <a href="{{ '/people/' | relative_url }}" class="pathway-link">
          Meet the Community &rarr;
        </a>
      </div>
    </div>
  </div>
</section>

<!-- Collaboration & Dialogue Invitation Banner -->
<section class="section section-cta-banner">
  <div class="container">
    <div class="cta-banner-box">
      <div class="cta-banner-content">
        <div class="kicker-group">
          <span class="cta-kicker">Regional Collaboration</span>
        </div>
        <h2 class="cta-title">Fostering Academic, Cultural &amp; Policy Partnerships</h2>
        <p class="cta-desc">
          The Korean Studies Lab welcomes proposals for collaborative research projects, visiting scholar visits, joint symposiums, and cultural or policy dialogues from institutions across Singapore, Korea, and Southeast Asia.
        </p>
        <div class="cta-actions">
          <a href="{{ '/contact/' | relative_url }}" class="btn btn-primary">
            Contact the Lab &amp; Submit Enquiries
            <span class="btn-arrow" aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
