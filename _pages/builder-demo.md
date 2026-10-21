---
layout: builder
title: "Interactive Modular Page Showcase"
permalink: /builder-demo/
hero_tag: "CKSL Visual Page Architecture"
hero_subtitle: "Demonstration of modular blocks, Korean heritage ornaments, and dynamic layouts editable via Sveltia CMS"
sections:
  - type: text_block
    kicker: "Academic Scope"
    hangul: "연구 개요"
    heading: "Bridging Contemporary Korean Innovation & Global Humanities"
    show_underline: true
    lead: "This page is built entirely out of polymorphic blocks that can be rearranged, edited, added, or deleted directly through the Sveltia CMS browser interface."
    content: |
      Editors can compose paragraphs, embed citations, and customize typography without touching HTML or CSS. Every element is responsive and styled according to the lab's editorial design system.

  - type: ornament
    style: flower_divider

  - type: card_grid
    kicker: "Initiative Clusters"
    hangul: "중점 과제"
    heading: "Active Research & Engagement Projects"
    show_underline: true
    columns: "3"
    cards:
      - badge: "Digital Culture"
        dates: "2026 – 2028"
        title: "K-Media & Algorithmic Diffusion"
        meta: "Principal Investigator: Prof. Kwan Min Lee"
        desc: "Investigating the transnational circulation of Korean webtoons, streaming series, and interactive gaming ecosystems across Southeast Asia."
        link: "/research/"
        link_label: "Explore Research →"
      - badge: "Social Robotics"
        dates: "2026 – Present"
        title: "Human-AI Social Interaction in Korea"
        meta: "Joint Initiative with HAIL Lab"
        desc: "Empirical behavioral investigations into human perception, affective trust, and social robotics adoption in aging and educational contexts."
        link: "https://profkwanminlee.github.io/hail/"
        link_label: "Visit HAIL Lab →"
      - badge: "Symposium"
        dates: "Autumn 2026"
        title: "Singapore Korean Studies Forum"
        meta: "Wee Kim Wee School & Korea Foundation"
        desc: "Annual flagship international colloquium convening leading scholars, industry leaders, and policy strategists across the Asia-Pacific."
        link: "/programs-events/"
        link_label: "View Program →"

  - type: ornament
    style: hanok_roof

  - type: callout_box
    style: context
    title: "Institutional Heritage & Mission"
    include_pavilion: true
    content: "Supported by the **Korea Foundation Endowed Chair**, the Contemporary Korean Studies Lab (CKSL) serves as an intellectual nexus at Nanyang Technological University, Singapore, bridging technological innovation, media transformation, and Korean cultural resonance."
    button_label: "Contact Directorate →"
    button_url: "/contact/"

  - type: director_card
    embed_director: true

  - type: cta_banner
    kicker: "Scholarly Collaboration"
    hangul: "학술 교류"
    title: "Partner with Contemporary Korean Studies Lab"
    desc: "We welcome visiting scholars, postdoctoral fellows, collaborative research proposals, and international symposium partnerships."
    button_label: "Initiate Academic Inquiry →"
    button_url: "/contact/"
---
