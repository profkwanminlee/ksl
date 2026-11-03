---
layout: page
title: "Publications"
permalink: /publications/
hero_image: "/images/hero/publications.jpg"
hero_crop: "center 30%"
hero_tag: "Scholarship & Outputs"
hero_subtitle: "Books, peer-reviewed articles, keynote addresses, and public intellectual contributions."
description: "Academic publications, e-books, conference papers, and news columns of the Korean Studies Lab."
---

<section id="books" style="margin-bottom: 3.5rem;">
  <h2 style="font-size: 1.65rem; font-weight: 700; color: var(--color-ink); margin-bottom: 1.25rem;">
    Books
  </h2>

  <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--color-ink); text-transform: uppercase; letter-spacing: 0.05em; margin: 1.5rem 0 1rem 0;">
    Academic Publication
  </h3>
  <ul class="pub-bullet-list" style="margin-bottom: 1.75rem;">
    <li>
      <h4 style="margin: 0 0 0.25rem 0; font-size: 1.12rem; font-weight: 700; color: var(--color-ink);">
        Korea and Southeast Asia: Shared Histories and Contemporary Connections
      </h4>
      <p style="margin: 0; font-size: 0.95rem; color: var(--color-ink-muted);">
        <em>Status:</em> Forthcoming academic publication exploring transnational historical ties, socio-cultural interactions, and contemporary digital media flows.
      </p>
    </li>
  </ul>

  <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--color-ink); text-transform: uppercase; letter-spacing: 0.05em; margin: 2rem 0 0.5rem 0;">
    E-book Series: Engaging Korea
  </h3>
  <p style="font-size: 0.98rem; color: var(--color-ink-light); margin-bottom: 1.25rem;">
    Companion e-books to the course <em>“Introduction to Korea Studies.”</em> Click any volume below to read directly on the website, or click again to close.
  </p>

  <!-- Interactive E-Book Viewer with Click-to-Open and Toggle-to-Close -->
  <div class="ebook-interactive-section" id="ebookViewer">
    <div class="ebook-tabs-bar" role="tablist" aria-label="Engaging Korea Volumes">
      <button type="button" class="ebook-vol-btn" id="tabVol1" onclick="toggleEbook(1)" aria-expanded="false">
        <span class="ebook-vol-tag">Vol. I</span> Spring 2021
        <span class="ebook-toggle-icon">&darr;</span>
      </button>
      <button type="button" class="ebook-vol-btn" id="tabVol2" onclick="toggleEbook(2)" aria-expanded="false">
        <span class="ebook-vol-tag">Vol. II</span> Spring 2022
        <span class="ebook-toggle-icon">&darr;</span>
      </button>
      <button type="button" class="ebook-vol-btn" id="tabVol3" onclick="toggleEbook(3)" aria-expanded="false">
        <span class="ebook-vol-tag">Vol. III</span> Fall 2022
        <span class="ebook-toggle-icon">&darr;</span>
      </button>
      <button type="button" class="ebook-vol-btn" id="tabVol4" onclick="toggleEbook(4)" aria-expanded="false">
        <span class="ebook-vol-tag">Vol. IV</span> Fall 2025
        <span class="ebook-toggle-icon">&darr;</span>
      </button>
    </div>

    <div class="ebook-reader-collapse" id="ebookCollapse">
      <div class="ebook-frame-wrapper">
        <iframe id="ebookFrame" class="ebook-iframe" src="" title="Engaging Korea Reader"></iframe>
      </div>

      <div class="ebook-actions-bar">
        <span class="ebook-active-label" id="ebookActiveLabel">Currently Reading: <strong>Engaging Korea</strong></span>
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <a id="btnEbookDownload" href="#" download="" class="btn btn-primary" style="padding: 0.5rem 1.25rem; font-size: 0.88rem; text-decoration: none; border-radius: 4px;">
            Download PDF &darr;
          </a>
          <button type="button" onclick="closeEbook()" style="padding: 0.5rem 1rem; font-size: 0.88rem; font-weight: 600; color: var(--color-ink); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 4px; cursor: pointer;">
            Close Reader &times;
          </button>
        </div>
      </div>
    </div>
  </div>

  <script>
    var currentVol = null;
    var baseUrl = "{{ '' | relative_url }}";
    var ebooks = {
      1: { url: baseUrl + '/assets/ebooks/Engaging_Korea_Volume_1.pdf', label: 'Volume 1 (Spring 2021)' },
      2: { url: baseUrl + '/assets/ebooks/Engaging_Korea_Volume_2.pdf', label: 'Volume 2 (Spring 2022)' },
      3: { url: baseUrl + '/assets/ebooks/Engaging_Korea_Volume_3.pdf', label: 'Volume 3 (Fall 2022)' },
      4: { url: baseUrl + '/assets/ebooks/Engaging_Korea_Volume_4.pdf', label: 'Volume 4 (Fall 2025)' }
    };

    function toggleEbook(vol) {
      var collapse = document.getElementById('ebookCollapse');
      var frame = document.getElementById('ebookFrame');
      var dlBtn = document.getElementById('btnEbookDownload');
      var label = document.getElementById('ebookActiveLabel');

      if (currentVol === vol) {
        closeEbook();
        return;
      }

      var target = ebooks[vol];
      if (!target) return;

      currentVol = vol;
      if (frame.src !== target.url) {
        frame.src = target.url;
      }
      if (dlBtn) {
        dlBtn.href = target.url;
        dlBtn.download = 'Engaging_Korea_Volume_' + vol + '.pdf';
      }
      if (label) {
        label.innerHTML = 'Currently Reading: <strong>Engaging Korea: ' + target.label + '</strong>';
      }

      collapse.classList.add('is-open');

      for (var i = 1; i <= 4; i++) {
        var btn = document.getElementById('tabVol' + i);
        if (btn) {
          if (i === vol) {
            btn.classList.add('is-active');
            btn.setAttribute('aria-expanded', 'true');
          } else {
            btn.classList.remove('is-active');
            btn.setAttribute('aria-expanded', 'false');
          }
        }
      }
    }

    function closeEbook() {
      currentVol = null;
      var collapse = document.getElementById('ebookCollapse');
      if (collapse) collapse.classList.remove('is-open');
      for (var i = 1; i <= 4; i++) {
        var btn = document.getElementById('tabVol' + i);
        if (btn) {
          btn.classList.remove('is-active');
          btn.setAttribute('aria-expanded', 'false');
        }
      }
    }
  </script>
</section>

<section id="journal-articles-conference-presentations" style="margin: 2.25rem 0;">
  <h2 style="font-size: 1.65rem; font-weight: 700; color: var(--color-ink); margin-bottom: 1.25rem;">
    Journal Articles &amp; Conference Presentations
  </h2>

  <ul class="pub-bib-list">
    <li>
      Lee, K. M. (2002). Modeling the regional differences in 3G standardization: The entrepreneur, the committee, and the gambler. <em>Communications and Strategies</em>, 47, 11-32.
    </li>
    <li>
      Kwon, Y., Lee, C., Lee, K., &amp; Nam, K. (2011). The inhibitory effect of phonological syllables, rather than orthographic syllables, as evidenced in Korean lexical decision tasks. <em>Psychologia</em>, 54(1), 1-14.
    </li>
  </ul>
</section>

<section id="keynote-speeches-invited-talks" style="margin: 2.25rem 0;">
  <h2 style="font-size: 1.65rem; font-weight: 700; color: var(--color-ink); margin-bottom: 1.25rem;">
    Keynote Speeches &amp; Invited Talks
  </h2>

  <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--color-ink); text-transform: uppercase; letter-spacing: 0.05em; margin: 1.5rem 0 1rem 0;">
    Keynote Speeches
  </h3>

  <ul class="pub-bullet-list">
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Physical AI and Expansion of Humanity</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">K-Edu Expo, Official Forum of the APEC 2025 Summit, Gyeongju, South Korea. October 26, 2025.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">New Era of Korea Studies</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">2025 Korea-Vietnam Korea Studies Forum, Korea Foundation and Ministry of Education, Vietnam. Hanoi, Vietnam. May 9, 2025.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Designing Human-Centric Intelligent Xs Powered by XAI (Explainable AI)</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">SK Telecom FLY AI Challenger Program Commencement Speech. Seoul, South Korea. February 7, 2025.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Human-Centric Responsible AI</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">2024 International Workshop on Responsible AI, Sungkyunkwan University. Seoul, South Korea. December 23, 2024.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Welcome Keynote Address</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">International Symposium: Mapping the Global Impacts of Hallyu, the Korean Wave. La Salle University, Singapore. December 6, 2024.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Living with AI</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">ChinDaeJae AMP (Advanced Management Program) Annual Symposium. Seoul, South Korea. March 19, 2024.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Key Dimensions for Human-Centered Design of Educational Technologies</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">International EduTech Innovation Symposium, Jeju University, South Korea. December 12, 2023.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Social Presence of Virtual Humans</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Yonsei ICAT Colloquium, Yonsei University, South Korea. November 23, 2023.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Human Evolution &amp; ICT Innovation</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Hallym Communication Colloquium, Hallym University, South Korea. November 21, 2023.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Key Dimensions for the Human-Centered Design of AI Agents</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Annual Conference of the Asia-Pacific Communication Alliance (APCA), Tsinghua University. Beijing, China. November 5, 2023.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">UX Innovation in South Korea’s ICT Industry: Theories and Applications</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Center for Asian and Pacific Studies, University of Oregon, USA. October 19, 2023.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Evolutionary Psychology and Customer Experience Innovation</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Kia Motors Worldwide HQ. Seoul, South Korea. October 11, 2023.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Virtual Experience and Feelings of Presence: Implications for National Defence</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Department of Journalism, National Defense University, Taiwan. July 20, 2023.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Behavioral Sciences and AI</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">World Innovation Day, Colombia. April 21, 2023.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Human-Centered Design of Metaverse Experience</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Annual Conference of the Taiwan Academy for Information Society. Taipei, Taiwan. November 5, 2022.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Exploring VR &amp; AR: Emerging Technologies in the New Media Realm</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Universiti Kuala Lumpur. Kuala Lumpur, Malaysia. October 21, 2022.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">UX in the Age of Virtual Reality (Meta)</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Brain Korea (BK) 21 Special Lecture, Department of Digital Culture &amp; Contents, Konkuk University. Seoul, South Korea. December 15, 2021.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">User-Avatar Bond: Risks and Opportunities in Gaming and Beyond</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Victoria University Webinar. Melbourne, Australia. November 11, 2021.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">User Experience of ICT Products</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">IMCOM 2020: International Conference on Ubiquitous Information Management and Communication. Taichung, Taiwan. January 4, 2020.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Media Psychology and User Experience</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">7th Asia-Korea Conference on Science and Technology: Science and Technology for Humanity (AKC 2019), Marina Bay Sands, Singapore. November 22, 2019.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">UX Innovation in South Korea’s IT Industry</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Korea Foundation Special Lectures on Korea 2019, Burapha University, Thailand. October 11, 2019.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">ICT Innovation and Media Psychology</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Annual Meeting of the Korean Scientists and Engineers Association in Singapore, NUS, Singapore. February 11, 2019.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Human Evolution and User Experience</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">World Usability Congress. Graz, Austria. October 11, 2017.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Human Evolution and User Experience (UX World Speech Tour 2017)</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted); display: block; margin-bottom: 0.25rem;">International keynotes delivered across Asia and Middle East:</span>
      <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.9rem; color: var(--color-ink-muted);">
        <li>Shanghai Jiao Tong University, Shanghai, China (September 29)</li>
        <li>Uchida Yoko Co., Tokyo, Japan (October 1)</li>
        <li>Park Royal Hotel, Singapore (October 4)</li>
        <li>Shangri-La Hotel, Bengaluru, India (October 6)</li>
        <li>AstroLabs, Dubai, UAE (October 8)</li>
      </ul>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Korean Communication Research and Practice: Looking Back, Looking Forward</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Korean Communication Research Conference. July 27, 2017.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Psychology and Design of Smart Media (Closing Keynote)</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">World Usability Congress. Graz, Austria. October 19, 2016.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Psychology of Human-Computer Interaction</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Annual Opinion Mining Workshop, Daum Soft. Seoul, South Korea. April 26, 2013.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Interaction Science</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">14th Annual Workshop on Information Communications Application Technology 2009: IT Fusion with Human Life. South Korea. April 8, 2009.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">A Comprehensive Review on Positive Effects of Games</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">1st World Game Culture Conference (sponsored by Korea Game Development Agency). Daegu, South Korea. October 27, 2007.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Social Presence in Virtual Experience</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">International Conference on Digital Contents and Communication, Seoul National University (sponsored by Korea Culture &amp; Content Agency). Seoul, South Korea. December 16, 2005.</span>
    </li>
  </ul>

  <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--color-ink); text-transform: uppercase; letter-spacing: 0.05em; margin: 2.5rem 0 1rem 0;">
    Invited Talks
  </h3>

  <ul class="pub-bullet-list">
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">K-Content x Embodied AI: South Korea’s Playbook for Global Leadership</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">National AI Strategy Committee for the President of South Korea. Seoul, South Korea. October 24, 2025.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Exploring New Horizons in Korean Studies</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Cyber Hankuk University of Foreign Studies (online). Seoul, South Korea. October 18, 2025.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Moderating Chair: AI and the Transformation of the News Industry</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">International Symposium, Korea Press Foundation, Korea Press Center. Seoul, South Korea. November 9, 2023.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">User Experience in the Age of Virtual Reality</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">International Symposium on VR/AR-Mixed Reality in the Age of AI, Sungkyunkwan University (online). November 9, 2020.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Interaction Science for Singapore’s Competitive Edge in Smart Home, Smart Car, and the Seamless Interaction between the Two</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">K-TAG Singapore Annual Meeting, KIAT &amp; KSEA. October 30, 2020.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">UX Research at NTU</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Perspectives for Asia Pacific: Humanities &amp; Communication Sharing Symposium, The University of Melbourne &amp; Nanyang Technological University. Melbourne, Australia. November 19, 2019.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Experiences of Human-Machine Interaction, Explicated</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Future of Adult Learning Research Symposium, Institute for Adult Learning, Singapore. November 14, 2019.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Human Evolution, Media Psychology, and ICT Innovation</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Communication Seminar Series, The Chinese University of Hong Kong. November 6, 2018.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Media Psychology of ICT Products and Services</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Hong Kong Baptist University. November 5, 2018.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Media Psychology and User Experience of Digital Media</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">City University of Hong Kong. November 3, 2018.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Media Psychology and User Experience of ICT Products and Services</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">IEEE Singapore Section Computational Intelligence Society (CIS) Chapter Seminar, NTU, Singapore. September 28, 2018.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">UX Design and Human Evolution</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Korea-Singapore International Global Industry Forum 2017, 5th Asia-Korea Conference on Science and Technology. Singapore. November 18, 2017.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Psychology and Design of Smart Cars</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Hyundai Motors. Namyang, South Korea. April 20, 2016.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Creativity, Concepts, &amp; Products</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Hyundai Motors. Seoul, South Korea. July 20, 2012.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">User Experience in Human-Car Interaction</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Hyundai Mobis. Seoul, South Korea. November 23, 2011.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Psychology of Smart TV</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">CTO Forum, Korea Industrial Technology Association, InterContinental Hotel. Seoul, South Korea. September 22, 2011.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Psychology of Smart TV</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Special Lecture for Senior Managers, KBS (Korean Broadcasting System), KBS Radio Hall. Seoul, South Korea. June 22, 2011.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Product Design and Feelings of Immersion</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Special Lecture, Department of Digital Contents Convergence, Seoul National University. June 8, 2011.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">The Effects of Social Presence in Designing HRI</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">5th ACM/IEEE International Conference on Human-Robot Interaction (HRI 2010). Osaka, Japan. March 2, 2010.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Strategies for the Development of Korean Serious Games</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Korea Serious Game Forum, Ministry of Culture and Tourism, South Korea. December 10, 2008.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Serious Games for Defense</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Army Training &amp; Doctrine Command, Republic of Korea. Daejeon, South Korea. October 23, 2008.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Feelings of Presence in Interactive Media</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Entertainment Meets Technology: KAIST Info-Media Forum, KAIST Graduate School of Information and Media Management. Seoul, South Korea. September 26, 2008.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Mind and Media</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Graduate School of Culture Technology, KAIST. Daejeon, South Korea. February 23-27, 2007.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Product Design and Feelings of Presence</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">LG Techno-Conference. Palo Alto, CA, USA. November 18, 2006.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Making Renaissance Scholars of the 21st Century at USC</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Korea Press Center. Seoul, South Korea. September 28, 2006.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Presence and Computer Games</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">NCSOFT. South Korea. May 13, 2005.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Implications of Digital Technologies on the Future of Journalism</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Informal lecture to the delegation of the Press Arbitration Commission of South Korea, University of Southern California. October 29, 2004.</span>
    </li>
    <li>
      <strong style="font-size: 1.05rem; color: var(--color-ink); display: block; margin-bottom: 0.25rem;">Asia, Next Generation Networks, and Global Competition Workshop</strong>
      <span style="font-size: 0.92rem; color: var(--color-ink-muted);">Berkeley Roundtable on the International Economy (BRIE), University of California, Berkeley. August 25, 2003.</span>
    </li>
  </ul>
</section>

<section id="news-columns-op-eds" style="margin-top: 2.25rem;">
  <h2 style="font-size: 1.65rem; font-weight: 700; color: var(--color-ink); margin-bottom: 1.25rem;">
    News Columns &amp; Op-Eds
  </h2>

  <ul class="pub-bib-list">
    <li>
      Lee, K. M. (2026, March). Asia outlook: Strategic design for survival, the Singapore deep-tech ecosystem. <em>Chief Executive</em>, 280, 70-73.
    </li>
    <li>
      Lee, K. M. (2026, February 8). <a href="https://www.mk.co.kr/news/contributors/11955993" target="_blank" rel="noopener"><strong>Lee Kwan Min’s Deep Thought: Singapore’s deep tech strategy</strong></a>. <em>Maeil Business Newspaper</em>.
    </li>
    <li>
      Lee, K. M. (2025, December 31). <a href="https://www.khan.co.kr/article/202512311915005" target="_blank" rel="noopener"><strong>Who are we in the digital world?</strong></a> <em>The Kyunghyang Shinmun</em>.
    </li>
    <li>
      Lee, K. M. (2025, December 3). <a href="https://www.khan.co.kr/article/202512032157005" target="_blank" rel="noopener"><strong>News in the age of AI</strong></a>. <em>The Kyunghyang Shinmun</em>.
    </li>
    <li>
      Lee, K. M. (2025, November 5). <a href="https://www.khan.co.kr/article/202511052225005" target="_blank" rel="noopener"><strong>Six virtual experiences created by AI - Part 2</strong></a>. <em>The Kyunghyang Shinmun</em>.
    </li>
    <li>
      Lee, K. M. (2025, October 1). <a href="https://www.khan.co.kr/article/202510012226005" target="_blank" rel="noopener"><strong>Six virtual experiences created by AI - Part 1</strong></a>. <em>The Kyunghyang Shinmun</em>.
    </li>
    <li>
      Lee, K. M. (2025, September 3). <a href="https://www.khan.co.kr/article/202509032059005" target="_blank" rel="noopener"><strong>Reasons for endowing quasi-human rights to embodied AI</strong></a>. <em>The Kyunghyang Shinmun</em>.
    </li>
    <li>
      Lee, K. M. (2025, August 6). <a href="https://www.khan.co.kr/article/202508062108005" target="_blank" rel="noopener"><strong>Bat, metaverse, and robots</strong></a>. <em>The Kyunghyang Shinmun</em>.
    </li>
    <li>
      Lee, K. M. (2025, July 9). <a href="https://www.khan.co.kr/article/202507092049005" target="_blank" rel="noopener"><strong>The case for critical thinking in the age of AI</strong></a>. <em>The Kyunghyang Shinmun</em>.
    </li>
    <li>
      Lee, K. M. (2025, June 29). <a href="https://www.joongang.co.kr/article/25347622" target="_blank" rel="noopener"><strong>Lee Kwan Min’s Economics: AI social simulation for public opinion surveys and public policy assessment</strong></a>. <em>JoongAng Ilbo</em>.
    </li>
    <li>
      Lee, K. M. (2025, June 11). <a href="https://www.khan.co.kr/article/202506112058005" target="_blank" rel="noopener"><strong>AI social simulation can read public opinion</strong></a>. <em>The Kyunghyang Shinmun</em>.
    </li>
    <li>
      Lee, K. M. (2025, May 14). <a href="https://www.khan.co.kr/article/202505142018015" target="_blank" rel="noopener"><strong>Three elements of policy innovation for the new South Korean government</strong></a>. <em>The Kyunghyang Shinmun</em>.
    </li>
    <li>
      Lee, K. M. (2025, April 16). <a href="https://www.khan.co.kr/article/202504162002005" target="_blank" rel="noopener"><strong>“AI for all” and deep thought innovation</strong></a>. <em>The Kyunghyang Shinmun</em>.
    </li>
    <li>
      Lee, K. M. (2025, March 19). <a href="https://www.khan.co.kr/article/202503192123035" target="_blank" rel="noopener"><strong>Future innovation: Deep tech &amp; deep thought</strong></a>. <em>The Kyunghyang Shinmun</em>.
    </li>
    <li>
      Lee, K. M. (2025, February 19). <a href="https://www.khan.co.kr/article/202502192122005" target="_blank" rel="noopener"><strong>The coming era of AI simulation</strong></a>. <em>The Kyunghyang Shinmun</em>.
    </li>
    <li>
      Lee, K. M. (2025, January 15). <a href="https://www.khan.co.kr/article/202501152048015" target="_blank" rel="noopener"><strong>The dawn of the era of AI agents</strong></a>. <em>The Kyunghyang Shinmun</em>.
    </li>
    <li>
      Lee, K. M. (2019, October 3). <a href="https://www.hankookilbo.com/News/Read/201910010806042756" target="_blank" rel="noopener"><strong>No consideration of users in the 8K TV standard debate</strong></a>. <em>The Hankook Ilbo</em>.
    </li>
    <li>
      Lee, K. M. (2013, April 5). <a href="https://biz.chosun.com/site/data/html_dir/2013/04/04/2013040402035.html" target="_blank" rel="noopener"><strong>The reason for 3D TV’s market failure</strong></a>. <em>Chosun Ilbo</em>.
    </li>
    <li>
      Park, S., &amp; Lee, K. M. (2013, March 22). <a href="https://biz.chosun.com/site/data/html_dir/2013/03/21/2013032101359.html" target="_blank" rel="noopener"><strong>On human-technology interaction</strong></a>. <em>Chosun Ilbo</em>.
    </li>
  </ul>
</section>
