/* ============================================
   MCP Security Slides — Animations & Interactions
   ============================================ */

// --- Presenter badge: animate directly (position:absolute at bottom, outside scroll-trigger range) ---
// Presenter badge is handled by playSectionAnimations / resetSectionAnimations
// via the anim-fade-up class — no separate setup needed.

// --- Conference info from localStorage (set via config.html) ---
(function () {
    const conf = localStorage.getItem('mcp_conf_name');
    const loc  = localStorage.getItem('mcp_conf_location');
    const date = localStorage.getItem('mcp_conf_date');
    const label = document.getElementById('conf-label');
    if (!label) return;
    const parts = [conf, loc, date].filter(Boolean);
    if (parts.length > 0) {
        label.textContent = parts.join(' · ');
    }
})();

gsap.registerPlugin(ScrollTrigger);

// --- Slide metadata for progress nav ---
const slidesMeta = [
    { id: 'slide-title',          en: 'Title',              de: 'Titel' },
    { id: 'slide-what-is-mcp',    en: 'What is MCP?',       de: 'Was ist MCP?' },
    { id: 'slide-adoption',       en: 'Growing Fast',       de: 'Wächst schnell' },
    { id: 'slide-security-gap',   en: 'Security Gap',       de: 'Sicherheitslücke' },
    { id: 'slide-protocol-init',  en: 'Init Handshake',     de: 'Verbindungsaufbau' },
    { id: 'slide-protocol-tools', en: 'Tool Discovery',     de: 'Tool-Discovery' },
    { id: 'slide-protocol-call',  en: 'Tool Call',          de: 'Tool-Aufruf' },
    { id: 'slide-prompt-context', en: 'Prompt Context',     de: 'Prompt-Kontext' },
    { id: 'slide-demo',           en: 'Live Demo',          de: 'Live-Demo' },
    { id: 'slide-mitigations',    en: 'Defenses',           de: 'Abwehr' },
    { id: 'slide-checklist',      en: 'Checklist',          de: 'Checkliste' },
    { id: 'slide-safe-arch',      en: 'Safe Architecture',  de: 'Sichere Architektur' },
    { id: 'slide-ide-auth',       en: 'IDE Auth Problem',   de: 'IDE-Auth-Problem' },
    { id: 'slide-h2m-service',    en: 'h2m Service',        de: 'h2m-Dienst' },
    { id: 'slide-further-challenges', en: 'More Challenges', de: 'Weitere Probleme' },
    { id: 'slide-spec-added',     en: 'Spec Updates',       de: 'Spec-Updates' },
    { id: 'slide-spec-gaps',      en: 'Still Missing',      de: 'Noch fehlend' },
    { id: 'slide-takeaways',      en: 'Takeaways',          de: 'Fazit' },
    { id: 'slide-thankyou',       en: 'Thank You',          de: 'Danke' },
];

// --- Build Progress Nav ---
const navEl = document.getElementById('progress-nav');
slidesMeta.forEach((slide, i) => {
    const dot = document.createElement('button');
    dot.className = 'progress-dot';
    dot.dataset.index = i;
    dot.setAttribute('aria-label', slide.en);
    const label = document.createElement('span');
    label.className = 'progress-label';
    label.dataset.en = slide.en;
    label.dataset.de = slide.de;
    label.textContent = document.documentElement.getAttribute('data-lang') === 'de' ? slide.de : slide.en;
    dot.appendChild(label);
    dot.addEventListener('click', () => navigateTo(i));
    navEl.appendChild(dot);
});

const progressDots = document.querySelectorAll('.progress-dot');

function setActiveDot(index) {
    progressDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
}

const sections = slidesMeta.map(s => document.getElementById(s.id)).filter(Boolean);

// --- Navigation-driven animation helpers ---
// All animations (generic + custom) are triggered by navigateTo, not by
// ScrollTrigger or IntersectionObserver. This works identically in normal
// and fullscreen mode.

function resetSectionAnimations(idx) {
    const sec = sections[idx];
    if (!sec) return;
    const id = slidesMeta[idx] && slidesMeta[idx].id;
    if (id && _sectionReset[id]) _sectionReset[id]();
    gsap.set(sec.querySelectorAll('.anim-fade-up'),    { opacity: 0, y: 40 });
    gsap.set(sec.querySelectorAll('.anim-slide-left'), { opacity: 0, x: -60 });
    gsap.set(sec.querySelectorAll('.anim-slide-right'),{ opacity: 0, x: 60 });
}

function playSectionAnimations(idx) {
    const sec = sections[idx];
    if (!sec) return;
    const id = slidesMeta[idx] && slidesMeta[idx].id;
    if (id && _sectionPlay[id]) _sectionPlay[id]();
    sec.querySelectorAll('.anim-fade-up').forEach(el => {
        const delay = parseFloat(el.dataset.delay) || 0;
        gsap.fromTo(el, { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, delay, ease: 'power3.out' });
    });
    sec.querySelectorAll('.anim-slide-left').forEach(el => {
        gsap.fromTo(el, { opacity: 0, x: -60 },
            { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' });
    });
    sec.querySelectorAll('.anim-slide-right').forEach(el => {
        gsap.fromTo(el, { opacity: 0, x: 60 },
            { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' });
    });
}

// --- Section animation registry ---
// watchSection registers play/reset per slide ID AND sets up an
// IntersectionObserver so scroll-based navigation also triggers animations.
// navigateTo additionally calls these directly for immediate keyboard response.
const _sectionPlay  = {};
const _sectionReset = {};

function watchSection(id, play, reset) {
    _sectionPlay[id]  = play;
    _sectionReset[id] = reset;
    reset(); // start hidden
    const el = document.getElementById(id);
    if (!el) return;
    new IntersectionObserver(entries => {
        entries[0].isIntersecting ? play() : reset();
    }, { threshold: 0.3 }).observe(el);
}

// --- Slide 03: Stats Count-Up ---
let _statsTween = null;

function playAdoptionStats() {
    if (_statsTween) { _statsTween.kill(); _statsTween = null; }

    const row      = document.getElementById('stats-row');
    const elServers  = document.getElementById('stat-servers');
    const elMonths   = document.getElementById('stat-months');
    const elStandard = document.getElementById('stat-standard');

    gsap.set(row, { opacity: 0 });
    if (elServers) {
        elServers.textContent = '10000+';
        elServers.style.minWidth = elServers.offsetWidth + 'px';
        elServers.textContent = '0+';
    }
    if (elMonths)   elMonths.textContent   = '0';
    if (elStandard) elStandard.textContent = '0';

    gsap.to(row, {
        opacity: 1, duration: 0.5, ease: 'power2.out',
        onComplete: () => {
            const obj = { servers: 0, months: 0, standard: 0 };
            _statsTween = gsap.to(obj, {
                servers: 10000, months: 6, standard: 1,
                duration: 1.6, ease: 'power2.out',
                onUpdate: () => {
                    if (elServers)  elServers.textContent  = Math.round(obj.servers) + '+';
                    if (elMonths)   elMonths.textContent   = String(Math.round(obj.months));
                    if (elStandard) elStandard.textContent = String(Math.round(obj.standard));
                },
                onComplete: () => {
                    if (elServers)  elServers.textContent  = '10000+';
                    if (elMonths)   elMonths.textContent   = '6';
                    if (elStandard) elStandard.textContent = '1';
                }
            });
        }
    });
}

function resetAdoptionStats() {
    if (_statsTween) { _statsTween.kill(); _statsTween = null; }
    const row = document.getElementById('stats-row');
    if (row) gsap.set(row, { opacity: 0 });
    const els = ['stat-servers', 'stat-months', 'stat-standard'];
    els.forEach(id => { const el = document.getElementById(id); if (el) el.textContent = '0'; });
}

watchSection('slide-adoption', playAdoptionStats, resetAdoptionStats);

// --- Slide 04: Timeline ---
function playTimeline() {
    gsap.fromTo('.timeline-progress', { width: '0%' }, { width: '100%', duration: 1.8, ease: 'power2.out', delay: 0.2 });
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.fromTo(item, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.15 + i * 0.35, ease: 'power2.out' });
    });
}
function resetTimeline() {
    gsap.set('.timeline-progress', { width: '0%' });
    gsap.set('.timeline-item', { opacity: 0, y: 20 });
}
watchSection('slide-security-gap', playTimeline, resetTimeline);

// --- Slides 05–07: Sequence Diagram Groups ---
['slide-protocol-init', 'slide-protocol-tools', 'slide-protocol-call'].forEach(id => {
    const play  = () => gsap.fromTo(`#${id} .seq-group`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.2, ease: 'power2.out' });
    const reset = () => gsap.set(`#${id} .seq-group`, { opacity: 0, y: 20 });
    watchSection(id, play, reset);
});

// --- Slide 08: Prompt Context — step-by-step reveal ---
// Steps: 0 = only initial rows visible, 1 = ctx-llm1, 2 = ctx-tool, 3 = ctx-llm2
let _ctxStep = 0;
const _ctxStepIds = ['ctx-mcp', 'ctx-user', 'ctx-llm1', 'ctx-tool', 'ctx-llm2'];

function _ctxShow(id) {
    const el = document.getElementById(id);
    if (el) gsap.fromTo(el, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' });
}
function _ctxHide(id) {
    const el = document.getElementById(id);
    if (el) gsap.set(el, { opacity: 0, y: 18 });
}

function playPromptContext() {
    _ctxStep = 0;
    _ctxStepIds.forEach(_ctxHide);
}
function resetPromptContext() {
    _ctxStep = 0;
    _ctxStepIds.forEach(_ctxHide);
}
watchSection('slide-prompt-context', playPromptContext, resetPromptContext);

// --- Slide 12: Defense Principle Cards ---
watchSection('slide-mitigations',
    () => gsap.fromTo('#slide-mitigations .principle-card', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.18, ease: 'power3.out' }),
    () => gsap.set('#slide-mitigations .principle-card', { opacity: 0, y: 30 })
);

// --- Slide 13: Checklist Items ---
watchSection('slide-checklist',
    () => gsap.fromTo('#slide-checklist .checklist-item', { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.07, ease: 'power2.out' }),
    () => gsap.set('#slide-checklist .checklist-item', { opacity: 0, x: -16 })
);

// --- Slide 14: Safe Architecture Groups ---
watchSection('slide-safe-arch',
    () => gsap.fromTo('#slide-safe-arch .arch-group', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.18, ease: 'power2.out' }),
    () => gsap.set('#slide-safe-arch .arch-group', { opacity: 0, y: 20 })
);

// --- Slide 16: h2m Architecture Groups ---
watchSection('slide-h2m-service',
    () => gsap.fromTo('#slide-h2m-service .h2m-group', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.2, ease: 'power2.out' }),
    () => gsap.set('#slide-h2m-service .h2m-group', { opacity: 0, y: 20 })
);

// --- Slide 17: Further Challenges ---
watchSection('slide-further-challenges',
    () => gsap.fromTo('#slide-further-challenges .info-card', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' }),
    () => gsap.set('#slide-further-challenges .info-card', { opacity: 0, y: 30 })
);

// --- Slide 18: Spec Cards ---
watchSection('slide-spec-added',
    () => gsap.fromTo('#slide-spec-added .spec-card', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: 'power3.out' }),
    () => gsap.set('#slide-spec-added .spec-card', { opacity: 0, y: 24 })
);

// --- Slide 18: Feature Items ---
watchSection('slide-spec-gaps',
    () => gsap.fromTo('#slide-spec-gaps .feature-item', { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }),
    () => gsap.set('#slide-spec-gaps .feature-item', { opacity: 0, x: -16 })
);

// --- Slide 19: Takeaway Cards ---
watchSection('slide-takeaways',
    () => gsap.fromTo('#slide-takeaways .takeaway-card', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.2, ease: 'power3.out' }),
    () => gsap.set('#slide-takeaways .takeaway-card', { opacity: 0, y: 30 })
);


// --- Fullscreen toggle (F key) ---
document.addEventListener('keydown', e => {
    if (e.key !== 'f' && e.key !== 'F') return;
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    _fsLock = true; // block observer from corrupting dot/index during resize
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen().catch(() => {});
    }
});

document.addEventListener('fullscreenchange', () => {
    setTimeout(() => {
        _fsLock = false;
        setActiveDot(currentSectionIdx);
        playSectionAnimations(currentSectionIdx);
    }, 350);
});

// --- Arrow-key slide navigation ---
// currentSectionIdx is the single source of truth — set only here, in the
// progress dot click handler, and restored after fullscreen transitions.
// No IntersectionObserver or ScrollTrigger involved, so fullscreen resizes
// cannot corrupt it.
let currentSectionIdx = 0;

function navigateTo(idx) {
    idx = Math.max(0, Math.min(sections.length - 1, idx));
    if (idx === currentSectionIdx) return;
    resetSectionAnimations(currentSectionIdx);
    currentSectionIdx = idx;
    setActiveDot(idx);
    sections[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Animation is triggered by IntersectionObserver as the section enters view
}

document.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    e.preventDefault();

    // Slide 08 (prompt-context): ArrowRight reveals sub-steps before advancing
    const promptIdx = slidesMeta.findIndex(s => s.id === 'slide-prompt-context');
    if (currentSectionIdx === promptIdx && e.key === 'ArrowRight' && _ctxStep < _ctxStepIds.length) {
        _ctxShow(_ctxStepIds[_ctxStep]);
        _ctxStep++;
        return;
    }
    // ArrowLeft on prompt-context: hide last revealed step (or navigate away when fully hidden)
    if (currentSectionIdx === promptIdx && e.key === 'ArrowLeft' && _ctxStep > 0) {
        _ctxStep--;
        _ctxHide(_ctxStepIds[_ctxStep]);
        return;
    }

    navigateTo(currentSectionIdx + (e.key === 'ArrowRight' ? 1 : -1));
});

// --- Hide scroll hint after first navigation ---
const scrollHint = document.querySelector('.scroll-hint');
if (scrollHint) {
    const hideHint = () => {
        gsap.to(scrollHint, { opacity: 0, duration: 0.5, ease: 'power2.out' });
        window.removeEventListener('scroll', hideHint);
    };
    window.addEventListener('scroll', hideHint, { passive: true });
}

// --- Theme toggle ---
(function () {
    const btn = document.getElementById('theme-toggle');
    function apply(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            btn.textContent = '☀';
        } else {
            document.documentElement.removeAttribute('data-theme');
            btn.textContent = '☽';
        }
    }
    apply(localStorage.getItem('theme') || 'dark');
    btn.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', next);
        apply(next);
    });
})();

// --- Language toggle ---
(function () {
    function applyLang(lang) {
        document.documentElement.setAttribute('data-lang', lang);
        document.querySelectorAll('.progress-label').forEach(label => {
            label.textContent = lang === 'de' ? label.dataset.de : label.dataset.en;
        });
    }
    document.querySelectorAll('.lang-seg').forEach(seg => {
        seg.addEventListener('click', () => {
            const lang = seg.dataset.lang;
            localStorage.setItem('lang', lang);
            applyLang(lang);
        });
    });
    applyLang(document.documentElement.getAttribute('data-lang') || 'de');
})();

// --- Scroll to top button ---
// Initial state: hide all animated elements, then play slide 1
sections.forEach((_, i) => resetSectionAnimations(i));
setActiveDot(0);
setTimeout(() => playSectionAnimations(0), 100);

// Single IntersectionObserver for all sections:
// - triggers animations (both scroll and keyboard navigation)
// - updates the active dot on scroll
// - guarded by _fsLock during fullscreen transitions
let _fsLock = false;

const _sectionAnimObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const idx = sections.indexOf(entry.target);
        if (idx === -1) return;
        if (entry.isIntersecting) {
            playSectionAnimations(idx);
            if (!_fsLock) {
                currentSectionIdx = idx;
                setActiveDot(idx);
            }
        } else {
            resetSectionAnimations(idx);
        }
    });
}, { threshold: 0.3 });
sections.forEach(s => _sectionAnimObserver.observe(s));

const scrollToTopBtn = document.getElementById('scroll-to-top');
if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        scrollToTopBtn.classList.toggle('visible', window.scrollY > 400);
    });
    scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
