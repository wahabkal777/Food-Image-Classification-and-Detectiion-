const canvas = document.getElementById('hero-animation');
const ctx = canvas.getContext('2d');
let width = canvas.width = document.querySelector('.hero').offsetWidth;
let height = canvas.height = document.querySelector('.hero').offsetHeight;
window.addEventListener('resize', () => {
    width = canvas.width = document.querySelector('.hero').offsetWidth;
    height = canvas.height = document.querySelector('.hero').offsetHeight;
});
const particles = [];
const particleCount = 80;

for (let i = 0; i < particleCount; i++) {
    particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1,
        d: Math.random() * 1
    });
}
let angle = 0;
function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
    }
    ctx.fill();
    update();
}
function update() {
    angle += 0.01;
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += Math.cos(angle + p.d) + 0.5;
        p.x += Math.sin(angle) * 0.5;

        if (p.x > width + 5 || p.x < -5 || p.y > height) {
            p.x = Math.random() * width;
            p.y = -10;
        }
    }
}
function animate() {
    draw();
    requestAnimationFrame(animate);
}
animate();