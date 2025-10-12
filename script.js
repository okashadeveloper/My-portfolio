/* =========================
   MOBILE MENU
========================= */
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
if (burger && menu) {
    burger.addEventListener('click', () => menu.classList.toggle('show'));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('show')));
}

/* =========================
   NAV ACTIVE + PAGE WIPE
========================= */
const wipe = document.getElementById('wipe');
const links = document.querySelectorAll('[data-route]');

function routeTo(hash) {
    if (!hash) return;
    wipe.classList.remove('hide');
    wipe.classList.add('show');

    setTimeout(() => {
        document.querySelectorAll('.nav__links a').forEach(a => a.classList.remove('active'));
        const match = document.querySelector(`.nav__links a[data-route="${hash}"]`);
        if (match) match.classList.add('active');
        const targetEl = document.getElementById(hash);
        if (targetEl) targetEl.scrollIntoView({ behavior: 'instant', block: 'start' });
        wipe.classList.remove('show');
        wipe.classList.add('hide');
    }, 400);
}

links.forEach(a => {
    a.addEventListener('click', e => {
        const target = a.getAttribute('data-route');
        if (target) {
            e.preventDefault();
            routeTo(target);
            history.replaceState(null, '', `#${target}`);
        }
    });
});

window.addEventListener('load', () => {
    const initial = (location.hash || '#home').replace('#', '');
    routeTo(initial);
    setTimeout(() => { wipe.classList.remove('hide'); }, 700);
});

/* =========================
   SCROLL REVEAL & SKILLS ANIMATION
========================= */
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
            if (e.target.classList.contains('skill')) {
                const span = e.target.querySelector('.meter > span');
                if (span) { span.style.width = span.dataset.val + '%'; }
            }
        }
    });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* =========================
   HERO 'VIEW' BUTTON FOCUS RING
========================= */
const viewBtn = document.getElementById('viewBtn');
if (viewBtn) {
    viewBtn.addEventListener('mouseenter', () => {
        viewBtn.animate([
            { boxShadow: '0 0 0 rgba(0,0,0,0)' },
            { boxShadow: '0 0 0 rgba(0,0,0,0)', offset: 0.3 },
            { boxShadow: '0 0 30px rgba(0,229,255,.45)' }
        ], { duration: 500, fill: 'forwards' });
    });
    viewBtn.addEventListener('mouseleave', () => {
        viewBtn.animate([
            { boxShadow: '0 0 30px rgba(0,229,255,.45)' },
            { boxShadow: '0 0 0 rgba(0,0,0,0)' }
        ], { duration: 350, fill: 'forwards' });
    });
}

/* =========================
   BACKGROUND PARTICLES
========================= */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let w, h, stars;

function resize() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    stars = Array.from({ length: Math.min(160, Math.floor(w * h / 12000)) }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 0.8 + 0.2,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25
    }));
}

function tick() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
        s.x += s.vx * s.z;
        s.y += s.vy * s.z;
        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h;
        if (s.y > h) s.y = 0;

        const r = 1.1 + s.z * 1.8;
        ctx.beginPath();
        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 3);
        grd.addColorStop(0, 'rgba(0,229,255,.9)');
        grd.addColorStop(1, 'rgba(122,92,255,0)');
        ctx.fillStyle = grd;
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();
    }
    requestAnimationFrame(tick);
}

addEventListener('resize', resize);
resize();
tick();
