const fs = require('fs');
const path = 'index.html';
let html = fs.readFileSync(path, 'utf8');

// 1) iOS Glassmorphism tokens
html = html.replace('--glass-bg: rgba(255, 255, 255, 0.05);', '--glass-bg: rgba(255, 255, 255, 0.04);');
html = html.replace('--glass-border: rgba(255, 255, 255, 0.12);', '--glass-border: rgba(255, 255, 255, 0.1);');
html = html.replace('--card-radius: 16px;', '--card-radius: 22px;');

// 2) header iOS glass
html = html.replace(
  'border-bottom: 1px solid var(--glass-border);',
  'border-bottom: 0.5px solid rgba(255, 255, 255, 0.1); box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);'
);
html = html.replace(
  'background: rgba(10, 10, 15, 0.7);',
  'background: rgba(255, 255, 255, 0.06);'
);

// 3) settings panel iOS glass
html = html.replace(
  'border: 1px solid var(--glass-border);\n            border-radius: 16px;',
  'border: 0.5px solid rgba(255, 255, 255, 0.15);\n            border-radius: 22px;'
);
html = html.replace(
  'background: rgba(20, 20, 28, 0.72);',
  'background: rgba(255, 255, 255, 0.06);'
);
html = html.replace(
  'box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);',
  'box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.2);'
);

// 4) glass card iOS glass base
html = html.replace(
  '.glass-card {\n            backdrop-filter: blur(15px);\n            background: var(--glass-bg);\n            border: 1px solid var(--glass-border);\n            border-radius: 16px;',
  '.glass-card {\n            -webkit-backdrop-filter: blur(30px) saturate(180%);\n            backdrop-filter: blur(30px) saturate(180%);\n            background: rgba(255, 255, 255, 0.04);\n            border: 0.5px solid rgba(255, 255, 255, 0.15);\n            border-radius: 22px;'
);
html = html.replace(
  'box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 30px var(--accent-glow);',
  'box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 30px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.15);'
);

// 5) snowflake performance + webkit prefixes
html = html.replace(
  'animation: snowFall linear infinite;\n            text-shadow: 0 0 5px rgba(255,255,255,0.8);\n        }',
  'animation: snowFall linear infinite;\n            text-shadow: 0 0 5px rgba(255,255,255,0.8);\n            -webkit-will-change: transform;\n            will-change: transform;\n        }'
);

// 6) localStorage settings + season buttons aria
const settingsScript = `
        const savedSeason = localStorage.getItem('mint-season');
        const savedPrimary = localStorage.getItem('mint-primary');
        const savedGlow = localStorage.getItem('mint-glow');
        if (savedPrimary) { document.documentElement.style.setProperty('--accent', savedPrimary); document.getElementById('primaryColor').value = savedPrimary; }
        if (savedGlow) { document.documentElement.style.setProperty('--accent-glow', savedGlow + '66'); document.getElementById('glowColor').value = savedGlow; }
        const settingsToggle = document.getElementById('settingsToggle');
`;
html = html.replace(
  'const settingsToggle = document.getElementById("settingsToggle");',
  settingsScript
);

// 7) season click save
html = html.replace(
  "btn.addEventListener('click', () => {",
  "btn.addEventListener('click', () => { localStorage.setItem('mint-season', btn.dataset.season);"
);
html = html.replace(
  "document.querySelectorAll('.season-btn').forEach(b => b.classList.remove('active');",
  "document.querySelectorAll('.season-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });"
);
html = html.replace(
  "btn.classList.add('active');",
  "btn.classList.add('active'); btn.setAttribute('aria-pressed','true');"
);

// 8) color inputs save
html = html.replace(
  "document.getElementById('primaryColor').addEventListener('input', (e) => {",
  "document.getElementById('primaryColor').addEventListener('input', (e) => { localStorage.setItem('mint-primary', e.target.value);"
);
html = html.replace(
  "document.getElementById('glowColor').addEventListener('input', (e) => {",
  "document.getElementById('glowColor').addEventListener('input', (e) => { localStorage.setItem('mint-glow', e.target.value);"
);

// 9) snowflake max 15
html = html.replace(
  'for (let i = 0; i < 20; i++) setTimeout(createSnowflake, i * 200);',
  'for (let i = 0; i < 15; i++) setTimeout(createSnowflake, i * 200);'
);

// 10) ripple effect on glass cards + accessibility
html = html.replace(
  "document.querySelectorAll('.glass-card').forEach(card => observer.observe(card));",
  `document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('click', (e) => {
    const rect = card.getBoundingClientRect();
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';
    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
  observer.observe(card);
});`
);

fs.writeFileSync(path, html);
console.log('done');
