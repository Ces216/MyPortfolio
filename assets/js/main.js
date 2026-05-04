// PARTÍCULAS — canvas interactivo
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');

const ACCENT  = '#20fc8f';
const ACCENT2 = '#7f2ccb';
const COUNT   = 55;
const MAX_DIST = 130;

let W, H, particles, mouse = { x: null, y: null };

function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
}

function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.r  = Math.random() * 2 + 1;
}

Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
};

Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = ACCENT;
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.globalAlpha = 1;
};

function distanceTo(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

function drawLine(a, b, alpha) {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = ACCENT2;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 0.6;
    ctx.stroke();
    ctx.globalAlpha = 1;
}

function loop() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => p.update());

    // líneas entre partículas cercanas
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const d = distanceTo(particles[i], particles[j]);
            if (d < MAX_DIST) drawLine(particles[i], particles[j], 1 - d / MAX_DIST);
        }
        // líneas hacia el ratón
        if (mouse.x) {
            const dm = distanceTo(particles[i], mouse);
            if (dm < MAX_DIST * 1.5) drawLine(particles[i], mouse, 1 - dm / (MAX_DIST * 1.5));
        }
        particles[i].draw();
    }

    requestAnimationFrame(loop);
}

function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
    loop();
}

window.addEventListener('resize', () => { resize(); });
window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});
window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

init();