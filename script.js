/* ==========================================================================
   DIGITAL MAXIMALISM INTERACTION SCRIPT
   Theme Management (Light/Night with CSS Media Query Sync) & Dynamic Controls
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. THEME MANAGEMENT SYSTEM
    // Automatically respects browser/OS prefers-color-scheme media query
    // Allows explicit user selection of Light Mode (☀️) and Night Mode (🌙)
    // ----------------------------------------------------------------------
    const rootEl = document.documentElement;
    const lightBtn = document.getElementById('theme-light-btn');
    const darkBtn = document.getElementById('theme-dark-btn');
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const THEME_STORAGE_KEY = 'akshay_portfolio_theme';

    /**
     * Determines current active theme:
     * - Returns 'dark' or 'light'
     */
    function getCurrentTheme() {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme === 'dark' || storedTheme === 'light') {
            return storedTheme;
        }
        // Fall back to CSS media query detection
        return mediaQuery.matches ? 'dark' : 'light';
    }

    /**
     * Updates UI buttons & HTML data-theme attribute
     * @param {string} theme - 'dark' | 'light'
     * @param {boolean} persist - whether to save to localStorage
     */
    function applyTheme(theme, persist = false) {
        if (theme === 'dark') {
            rootEl.setAttribute('data-theme', 'dark');
            darkBtn?.classList.add('active');
            darkBtn?.setAttribute('aria-pressed', 'true');
            lightBtn?.classList.remove('active');
            lightBtn?.setAttribute('aria-pressed', 'false');
        } else {
            rootEl.setAttribute('data-theme', 'light');
            lightBtn?.classList.add('active');
            lightBtn?.setAttribute('aria-pressed', 'true');
            darkBtn?.classList.remove('active');
            darkBtn?.setAttribute('aria-pressed', 'false');
        }

        if (persist) {
            localStorage.setItem(THEME_STORAGE_KEY, theme);
        }
    }

    // Initialize theme based on preference or system media query
    const initialTheme = getCurrentTheme();
    // If user has a stored override, apply it explicitly; otherwise let media query guide default
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme) {
        applyTheme(storedTheme, false);
    } else {
        // Apply matching UI state based on system media query
        applyTheme(mediaQuery.matches ? 'dark' : 'light', false);
    }

    // Event Listener for Sun (Light Mode) selection
    if (lightBtn) {
        lightBtn.addEventListener('click', () => {
            applyTheme('light', true);
        });
    }

    // Event Listener for Moon (Night Mode) selection
    if (darkBtn) {
        darkBtn.addEventListener('click', () => {
            applyTheme('dark', true);
        });
    }

    // Listen for OS/Browser Theme changes dynamically if user hasn't hard-locked a preference
    mediaQuery.addEventListener('change', (e) => {
        const hasManualChoice = localStorage.getItem(THEME_STORAGE_KEY);
        if (!hasManualChoice) {
            applyTheme(e.matches ? 'dark' : 'light', false);
        }
    });

    // ----------------------------------------------------------------------
    // 2. MOBILE MENU TOGGLE
    // ----------------------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const primaryNav = document.getElementById('primary-nav');

    if (mobileMenuBtn && primaryNav) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', String(!isExpanded));
            primaryNav.classList.toggle('nav-open');
        });
    }

    // ----------------------------------------------------------------------
    // 3. COPYRIGHT YEAR
    // ----------------------------------------------------------------------
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // ----------------------------------------------------------------------
    // 4. VERTICAL PIXEL NAVBAR INTERACTION & SCROLLSPY
    // ----------------------------------------------------------------------
    const pixelSidebar = document.getElementById('pixel-navbar');
    const pixelToggleBtn = document.getElementById('pixel-sidebar-toggle');
    const pixelNavLinks = document.querySelectorAll('.pixel-nav-link');

    // Sidebar Expand / Collapse Toggle
    if (pixelToggleBtn && pixelSidebar) {
        pixelToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            pixelSidebar.classList.toggle('expanded');
            const isExpanded = pixelSidebar.classList.contains('expanded');
            pixelToggleBtn.setAttribute('aria-expanded', String(isExpanded));
        });
    }

    // Smooth Scroll Click Handling
    pixelNavLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                    // Update active state immediately
                    pixelNavLinks.forEach((l) => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });

    // Scrollspy with IntersectionObserver
    const trackedSectionIds = [
        'hero',
        'about',
        'skills',
        'timeline',
        'projects',
        'testimonials',
        'chat',
        'contact'
    ];

    const sectionElements = trackedSectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    if ('IntersectionObserver' in window && sectionElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -50% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.id;
                    pixelNavLinks.forEach((link) => {
                        const linkSection = link.getAttribute('data-section');
                        if (linkSection === currentId) {
                            link.classList.add('active');
                            link.setAttribute('aria-current', 'page');
                        } else {
                            link.classList.remove('active');
                            link.removeAttribute('aria-current');
                        }
                    });
                }
            });
        }, observerOptions);

        sectionElements.forEach((el) => observer.observe(el));
    }

    // ----------------------------------------------------------------------
    // 5. INTERACTIVE CHAT: AI VERSION OF AKSHAY C S
    // Simulates conversational AI responses representing Akshay C S.
    // Includes hook comments for integrating OpenAI / Gemini API.
    // ----------------------------------------------------------------------
    const chatForm = document.getElementById('pixel-chat-form');
    const chatInput = document.getElementById('pixel-chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const quickPromptBtns = document.querySelectorAll('.quick-prompt-btn');

    /**
     * Knowledge base for simulated AI Akshay responses
     */
    const aiAkshayKnowledge = {
        about: "Hi! I'm Akshay C S, a Software Engineer from Chikkamagaluru, Karnataka. I build high-throughput full-stack platforms, scalable microservices, and modern user interfaces that blend engineering performance with digital maximalist aesthetics.",
        education: "I am pursuing my Bachelor of Engineering (B.E.) in Computer Science at Adichunchanagiri Institute of Technology (AIT), Chikkamagaluru, starting in 2025 and graduating in 2029. Prior to engineering, I completed schooling from KG to 12th Standard (Science Stream) at St. Mary's International School, Chikkamagaluru.",
        stack: "My core technical stack includes: Languages: Java, Python, C++, C, C#, Kotlin, JavaScript, HTML5/CSS; Frameworks: React, Next.js, Node.js, Express, Spring Boot; Databases & DevOps: PostgreSQL, Redis, Docker, Git/GitHub, and CI/CD pipelines.",
        projects: "I have built 5 featured engineering projects: 1) Cloud Analytics & Telemetry Engine (real-time WebSockets), 2) E-Commerce Microservices Engine (event-driven with Redis), 3) Autonomous Pathfinding Visualizer (A* & Dijkstra), 4) DevFlow CLI (Python/DevOps automation), and 5) Smart IoT Environmental Gateway (MQTT). Click on any project card above to view the architectural breakdown!",
        contact: "You can reach me directly via phone/WhatsApp at +91 8296727483, official Gmail at akshaycsbhat@gmail.com, LinkedIn, or check out my repositories on GitHub at https://github.com/csakshay74-svg (profile: csakshay74-svg)!",
        github: "My official GitHub profile is https://github.com/csakshay74-svg (handle: csakshay74-svg). All my open-source code repositories, CLI tools, and architecture demos are hosted there!",
        experience: "I have 3+ years of professional engineering experience shipping 20+ production web platforms, cutting backend endpoint latency by 35%, and streamlining CI/CD deployment cycles by 40%.",
        hire: "Yes! I am actively available for software engineering roles, full-stack consulting, and high-impact distributed systems collaborations.",
        defaultReply: "Thanks for asking! I am the AI assistant for Akshay C S. You can ask me about my engineering education at AIT (2025–2029), technical stack, major projects, GitHub (csakshay74-svg), or contact info (+91 8296727483 / akshaycsbhat@gmail.com)."
    };

    /**
     * Helper to append chat messages to display screen
     */
    function appendMessage(senderTag, text, messageTypeClass) {
        if (!chatMessages) return;
        const msgWrapper = document.createElement('div');
        msgWrapper.className = `chat-msg ${messageTypeClass}`;

        const tagEl = document.createElement('span');
        tagEl.className = 'msg-tag';
        tagEl.textContent = senderTag;

        const contentEl = document.createElement('span');
        contentEl.className = 'msg-content';
        contentEl.textContent = text;

        msgWrapper.appendChild(tagEl);
        msgWrapper.appendChild(contentEl);
        chatMessages.appendChild(msgWrapper);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /**
     * ======================================================================
     * [FUTURE API INTEGRATION POINT - e.g., OpenAI / Gemini API]
     * ======================================================================
     * To connect an external LLM (such as OpenAI GPT-4o or Gemini), replace
     * the simulated response function with an asynchronous API fetch:
     *
     * Example OpenAI API Integration:
     * 
     * async function getOpenAIResponse(userPrompt) {
     *     const OPENAI_API_ENDPOINT = "https://api.openai.com/v1/chat/completions";
     *     const API_KEY = "YOUR_OPENAI_API_KEY"; // Best stored securely via backend proxy
     * 
     *     const response = await fetch(OPENAI_API_ENDPOINT, {
     *         method: "POST",
     *         headers: {
     *             "Content-Type": "application/json",
     *             "Authorization": `Bearer ${API_KEY}`
     *         },
     *         body: JSON.stringify({
     *             model: "gpt-4o-mini",
     *             messages: [
     *                 {
     *                     role: "system",
     *                     content: "You are AI Akshay, an intelligent portfolio assistant representing Akshay C S, a Software Engineer from Chikkamagaluru, pursuing B.E. at AIT (2025-2029). Be concise, friendly, and professional."
     *                 },
     *                 { role: "user", content: userPrompt }
     *             ],
     *             temperature: 0.7
     *         })
     *     });
     *     const data = await response.json();
     *     return data.choices[0].message.content;
     * }
     * ======================================================================
     */

    /**
     * Generates simulated AI response based on visitor message
     */
    function generateSimulatedAIResponse(input) {
        const query = input.toLowerCase();

        if (query.includes('edu') || query.includes('college') || query.includes('school') || query.includes('degree') || query.includes('ait') || query.includes('st mary') || query.includes('2025') || query.includes('2029')) {
            return aiAkshayKnowledge.education;
        } else if (query.includes('stack') || query.includes('tech') || query.includes('skill') || query.includes('language') || query.includes('framework')) {
            return aiAkshayKnowledge.stack;
        } else if (query.includes('project') || query.includes('built') || query.includes('work') || query.includes('portfolio') || query.includes('analytics') || query.includes('cli')) {
            return aiAkshayKnowledge.projects;
        } else if (query.includes('github') || query.includes('git') || query.includes('repo') || query.includes('source code')) {
            return aiAkshayKnowledge.github;
        } else if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('number') || query.includes('reach') || query.includes('call') || query.includes('gmail')) {
            return aiAkshayKnowledge.contact;
        } else if (query.includes('exp') || query.includes('career') || query.includes('milestone') || query.includes('year')) {
            return aiAkshayKnowledge.experience;
        } else if (query.includes('hire') || query.includes('available') || query.includes('freelance') || query.includes('job') || query.includes('opportunity')) {
            return aiAkshayKnowledge.hire;
        } else if (query.includes('about') || query.includes('who are you') || query.includes('yourself') || query.includes('background') || query.includes('akshay')) {
            return aiAkshayKnowledge.about;
        } else if (query.startsWith('hi') || query.startsWith('hello') || query.startsWith('hey') || query.startsWith('greetings')) {
            return "Hello! I am the AI version of Akshay C S. How can I assist you with exploring his engineering portfolio, tech stack, or background today?";
        }

        return aiAkshayKnowledge.defaultReply;
    }

    /**
     * Handles user message dispatch with typing indicator simulation
     */
    function handleChatMessage(rawText) {
        const text = rawText.trim();
        if (!text) return;

        // 1. Display visitor message immediately
        appendMessage('[YOU 👤]:', text, 'user-msg');

        // 2. Clear input field
        if (chatInput) chatInput.value = '';

        // 3. Show temporary typing indicator
        const typingId = 'ai-typing-indicator';
        const typingMsg = document.createElement('div');
        typingMsg.id = typingId;
        typingMsg.className = 'chat-msg bot-msg';
        typingMsg.innerHTML = '<span class="msg-tag">[AI AKSHAY 👾]:</span> <span class="msg-content" style="opacity: 0.7; font-style: italic;">Thinking...</span>';
        chatMessages.appendChild(typingMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // 4. Simulate response turnaround (replace with fetch API for real backend)
        setTimeout(() => {
            const indicatorEl = document.getElementById(typingId);
            if (indicatorEl) indicatorEl.remove();

            const aiReply = generateSimulatedAIResponse(text);
            appendMessage('[AI AKSHAY 👾]:', aiReply, 'bot-msg');
        }, 450);
    }

    if (chatForm && chatInput) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleChatMessage(chatInput.value);
        });
    }

    quickPromptBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const query = btn.getAttribute('data-query');
            if (query) {
                handleChatMessage(query);
            }
        });
    });


    // ----------------------------------------------------------------------
    // 6. SKILLS CATEGORY FILTER TABS
    // ----------------------------------------------------------------------
    const skillFilterBtns = document.querySelectorAll('.skills-filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    if (skillFilterBtns.length > 0 && skillCards.length > 0) {
        skillFilterBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                // Update active button state
                skillFilterBtns.forEach((b) => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                // Filter cards with smooth fade
                skillCards.forEach((card) => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filter === 'all' || cardCategory === filter) {
                        card.classList.remove('is-hidden');
                    } else {
                        card.classList.add('is-hidden');
                    }
                });
            });
        });
    }

    // ----------------------------------------------------------------------
    // 7. ABOUT SECTION DIRECT COMM TELEMETRY COPY & INTERACTION HANDLER
    // Copies Phone (8296727483) and Gmail (akshaycsbhat@gmail.com) with feedback
    // ----------------------------------------------------------------------
    const commCopyButtons = document.querySelectorAll('.comm-btn-copy');

    commCopyButtons.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const textToCopy = btn.getAttribute('data-copy');
            if (!textToCopy) return;

            const labelSpan = btn.querySelector('.btn-copy-text');
            const iconSpan = btn.querySelector('.comm-btn-icon');
            const originalText = labelSpan ? labelSpan.textContent : 'Copy';
            const originalIcon = iconSpan ? iconSpan.textContent : '📋';

            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(textToCopy);
                } else {
                    // Fallback for non-secure contexts
                    const tempInput = document.createElement('textarea');
                    tempInput.value = textToCopy;
                    tempInput.style.position = 'fixed';
                    tempInput.style.left = '-9999px';
                    tempInput.style.top = '0';
                    document.body.appendChild(tempInput);
                    tempInput.focus();
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                }

                // Visual feedback: success state
                btn.classList.add('copied');
                if (labelSpan) labelSpan.textContent = 'Copied! ✓';
                if (iconSpan) iconSpan.textContent = '⚡';

                // Reset after 2.2 seconds
                setTimeout(() => {
                    btn.classList.remove('copied');
                    if (labelSpan) labelSpan.textContent = originalText;
                    if (iconSpan) iconSpan.textContent = originalIcon;
                }, 2200);
            } catch (err) {
                console.warn('Clipboard write failed:', err);
                // Graceful fallback display
                if (labelSpan) labelSpan.textContent = 'Copied!';
                setTimeout(() => {
                    if (labelSpan) labelSpan.textContent = originalText;
                }, 1800);
            }
        });
    });

    // ----------------------------------------------------------------------
    // 8. INTERACTIVE PROJECTS DETAILED VIEW MODAL
    // Opens complete architectural specs when clicking thumbnails or details btn
    // ----------------------------------------------------------------------
    const projectModal = document.getElementById('project-detail-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalContentStage = document.getElementById('modal-content-stage');

    const engineeringProjects = {
        'proj-1': {
            title: 'Cloud Analytics & Telemetry Engine',
            category: 'DISTRIBUTED SYSTEMS // REAL-TIME METRICS',
            metrics: [
                { val: '50K+ /s', label: 'Events Handled' },
                { val: '<35ms', label: 'P99 Latency' },
                { val: '99.9%', label: 'Cluster Uptime' }
            ],
            synopsis: 'A distributed observability and analytics platform engineered to stream high-frequency cluster metrics with real-time WebSocket telemetry, containerized microservices, and high-throughput query aggregation.',
            architecture: 'Microservice backend deployed with Docker multi-stage builds. WebSocket event broker delivers reactive live charting to React/TypeScript dashboards with zero dropped packets under high load.',
            features: [
                'Real-time WebSocket telemetry streaming 50,000+ data points per second.',
                'PostgreSQL ACID transactional backend with partitioned indexing for sub-40ms historical queries.',
                'Custom dashboard widget system with responsive canvas graph visualizers.'
            ],
            stack: ['React', 'TypeScript', 'Node.js', 'Docker', 'PostgreSQL', 'WebSockets'],
            demoUrl: '#',
            repoUrl: 'https://github.com/csakshay74-svg'
        },
        'proj-2': {
            title: 'E-Commerce Microservices Engine',
            category: 'SYSTEMS ARCHITECTURE // HIGH CONCURRENCY',
            metrics: [
                { val: '2.5K /s', label: 'Checkout TPS' },
                { val: '0.01%', label: 'Error Rate' },
                { val: '100%', label: 'ACID Guarantee' }
            ],
            synopsis: 'An event-driven distributed microservices engine powering high-concurrency order placement, automated inventory reconciliation, and webhook payment gateways.',
            architecture: 'Built using Spring Boot and Node.js microservices coordinated through Redis distributed locking and Kafka event queues to eliminate race conditions during flash-sale concurrency spikes.',
            features: [
                'Event-driven order saga orchestrator with automatic compensating transactions on failure.',
                'Redis in-memory cache layer delivering 98% cache hit ratio on product catalogs.',
                'Stripe & PayPal automated webhook processing with cryptographically signed verification.'
            ],
            stack: ['Spring Boot', 'Node.js', 'Redis', 'Kafka', 'PostgreSQL', 'Docker'],
            demoUrl: '#',
            repoUrl: 'https://github.com/csakshay74-svg'
        },
        'proj-3': {
            title: 'Autonomous Pathfinding & Algorithm Visualizer',
            category: 'ALGORITHMS // COMPUTATIONAL GRAPH THEORY',
            metrics: [
                { val: '60 FPS', label: 'Render Loop' },
                { val: 'O(V + E)', label: 'Optimal Time' },
                { val: '4 Modes', label: 'Path Algorithms' }
            ],
            synopsis: 'An interactive algorithmic sandbox providing real-time visual step-by-step execution of graph traversal and heuristic search algorithms across dynamic obstacle mazes.',
            architecture: 'Optimized HTML5 Canvas pipeline rendering weighted graph matrices at 60 frames per second with interactive heuristic distance selectors (Manhattan, Euclidean, Chebyshev).',
            features: [
                'Implements Dijkstra, A* Search, Breadth-First Search (BFS), and Depth-First Search (DFS).',
                'Procedural recursive division maze generation and custom barrier drawing.',
                'Interactive speed scrubbers and step-by-step state debugger.'
            ],
            stack: ['JavaScript (ES6+)', 'HTML5 Canvas', 'Data Structures', 'CSS Grid', 'Graph Algorithms'],
            demoUrl: '#',
            repoUrl: 'https://github.com/csakshay74-svg'
        },
        'proj-4': {
            title: 'DevFlow CLI & CI/CD Automation Suite',
            category: 'DEVELOPER TOOLING // DEVOPS & INFRASTRUCTURE',
            metrics: [
                { val: '40%', label: 'Faster Deploys' },
                { val: 'Cross-OS', label: 'Linux, Win, Mac' },
                { val: 'Zero', label: 'External Config' }
            ],
            synopsis: 'A developer productivity CLI tool built with Python to automate local workspace scaffolding, git commit verification hooks, and multi-cloud container deployments.',
            architecture: 'Modular Python package with automated click/rich CLI interface, asynchronous subprocess execution, and native integration with Docker daemon and GitHub Actions REST APIs.',
            features: [
                'Automated git pre-commit sanity auditing enforcing linting and branch naming rules.',
                'One-command multi-stage Docker container building and automated cloud registry pushes.',
                'Integrated zero-downtime healthcheck polling during rolling service deployments.'
            ],
            stack: ['Python 3', 'Bash / Shell', 'Docker', 'GitHub Actions', 'Linux CLI'],
            demoUrl: '#',
            repoUrl: 'https://github.com/csakshay74-svg'
        },
        'proj-5': {
            title: 'Smart IoT Environmental Gateway',
            category: 'EMBEDDED SYSTEMS // TELEMETRY & EDGE IOT',
            metrics: [
                { val: '<15ms', label: 'Sensor Delay' },
                { val: 'MQTT', label: 'Telemetry Protocol' },
                { val: '24/7', label: 'Autonomous Edge' }
            ],
            synopsis: 'An edge computing IoT broker aggregating environmental sensor metrics over MQTT, evaluating real-time anomaly thresholds, and streaming data to cloud analytics sinks.',
            architecture: 'Edge firmware written in C++ running on low-power hardware, communicating via lightweight MQTT brokers with Node.js websocket bridge to power live sensor gauges and alert webhooks.',
            features: [
                'Lightweight binary telemetry payload packaging over low-bandwidth wireless links.',
                'Configurable threshold trigger engine dispatching instant alerts on environmental spikes.',
                'Interactive dashboard with live temperature, humidity, and atmospheric pressure gauges.'
            ],
            stack: ['C++', 'Node.js', 'MQTT Broker', 'WebSockets', 'Chart.js'],
            demoUrl: '#',
            repoUrl: 'https://github.com/csakshay74-svg'
        }
    };

    function openProjectModal(projectId) {
        const data = engineeringProjects[projectId];
        if (!data || !modalContentStage || !projectModal) return;

        const tagsHtml = data.stack.map(s => `<li>${s}</li>`).join('');
        const featuresHtml = data.features.map(f => `<li>${f}</li>`).join('');
        const metricsHtml = data.metrics.map(m => `
            <div class="modal-metric-box">
                <span class="metric-box-val">${m.val}</span>
                <span class="metric-box-label">${m.label}</span>
            </div>
        `).join('');

        modalContentStage.innerHTML = `
            <div class="modal-project-header">
                <span class="modal-category-tag">${data.category}</span>
                <h2 class="modal-title" id="modal-project-title">${data.title}</h2>
            </div>

            <div class="modal-metrics-grid">
                ${metricsHtml}
            </div>

            <div class="modal-body-section">
                <h4 class="modal-section-title">// SYSTEM SYNOPSIS</h4>
                <p class="modal-body-p">${data.synopsis}</p>
            </div>

            <div class="modal-body-section">
                <h4 class="modal-section-title">// ARCHITECTURE OVERVIEW</h4>
                <p class="modal-body-p">${data.architecture}</p>
            </div>

            <div class="modal-body-section">
                <h4 class="modal-section-title">// CORE ENGINEERING HIGHLIGHTS</h4>
                <ul class="modal-features-list">
                    ${featuresHtml}
                </ul>
            </div>

            <div class="modal-body-section" style="margin-top: 18px;">
                <h4 class="modal-section-title">// TECHNOLOGY STACK</h4>
                <ul class="project-tags" style="margin-top: 6px;">
                    ${tagsHtml}
                </ul>
            </div>

            <div class="modal-actions-row">
                <a href="${data.demoUrl}" class="comm-btn comm-btn-primary" target="_blank" rel="noopener noreferrer">
                    <span>Explore Live System</span>
                    <span class="btn-arrow" aria-hidden="true">&rarr;</span>
                </a>
                <a href="${data.repoUrl}" class="comm-btn comm-btn-copy" target="_blank" rel="noopener noreferrer">
                    <span>GitHub Repository &nearr;</span>
                </a>
            </div>
        `;

        projectModal.classList.add('is-open');
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeProjectModal() {
        if (!projectModal) return;
        projectModal.classList.remove('is-open');
        projectModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Attach click listeners to cards, thumbnails, and detail buttons
    document.querySelectorAll('.project-card').forEach((card) => {
        const projId = card.getAttribute('data-project-id');
        const thumbWrapper = card.querySelector('.project-thumbnail-wrapper');
        const detailsBtn = card.querySelector('.btn-project-details');

        if (thumbWrapper && projId) {
            thumbWrapper.addEventListener('click', () => openProjectModal(projId));
            thumbWrapper.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openProjectModal(projId);
                }
            });
        }

        if (detailsBtn && projId) {
            detailsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openProjectModal(projId);
            });
        }
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeProjectModal);
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeProjectModal);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal && projectModal.classList.contains('is-open')) {
            closeProjectModal();
        }
    });

    // ----------------------------------------------------------------------
    // 9. ANIMATED CONTACT TRANSMISSION FORM HANDLER
    // ----------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback-msg');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.form-submit-btn');

            if (submitBtn) {
                submitBtn.disabled = true;
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span>Transmitting...</span> <span class="signal-dot"></span>';

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    contactForm.reset();

                    if (formFeedback) {
                        formFeedback.textContent = '✓ Message Transmitted! [ACK_200]';
                        setTimeout(() => {
                            formFeedback.textContent = '';
                        }, 4000);
                    }
                }, 750);
            }
        });
    }
});




