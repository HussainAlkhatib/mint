const fs = require('fs');
const path = 'index.html';
let html = fs.readFileSync(path, 'utf8');

// Add ripple JS and accessibility improvements
const rippleAndA11yScript = `
        // Ripple effect on glass cards
        document.querySelectorAll('.glass-card').forEach(card => {
          card.addEventListener('click', (e) => {
            const rect = card.getBoundingClientRect();
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';
            card.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
          });
        });

        // Accessibility: ensure all interactive elements have focus styles
        document.querySelectorAll('button, a, .glass-card').forEach(el => {
          if (!el.hasAttribute('tabindex') && el.tagName !== 'A' && el.tagName !== 'BUTTON') {
            el.setAttribute('tabindex', '0');
          }
        });

        // Smooth member counter animation
        const memberCountEl = document.getElementById('memberCount');
        if (memberCountEl) {
          let currentCount = parseInt(memberCountEl.textContent.replace(/,/g, '')) || 1247;
          setInterval(() => {
            currentCount += Math.floor(Math.random() * 3) + 1;
            memberCountEl.textContent = currentCount.toLocaleString();
            memberCountEl.style.transform = 'scale(1.1)';
            setTimeout(() => { memberCountEl.style.transform = 'scale(1)'; }, 150);
          }, 5000);
        }

        // Tab filtering with stagger animation
        document.querySelectorAll('.filter-tab').forEach(tab => {
          tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => {
              t.classList.remove('active');
              t.setAttribute('aria-pressed', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-pressed', 'true');
            
            const filter = tab.dataset.filter;
            const sections = document.querySelectorAll('section[data-category]');
            sections.forEach((section, index) => {
              const shouldShow = filter === 'all' || section.dataset.category === filter;
              if (shouldShow) {
                section.classList.remove('hidden-section');
                setTimeout(() => section.classList.add('visible'), index * 100);
              } else {
                section.classList.add('hidden-section');
                section.classList.remove('visible');
              }
            });
          });
        });

        // Season button aria labels
        document.querySelectorAll('.season-btn').forEach(btn => {
          btn.setAttribute('aria-label', 'فصل ' + btn.textContent.trim());
        });

        // Settings panel ARIA
        const settingsPanel = document.getElementById('settingsPanel');
        const settingsToggle = document.getElementById('settingsToggle');
        if (settingsToggle && settingsPanel) {
          settingsToggle.addEventListener('click', () => {
            const isOpen = settingsPanel.classList.contains('open');
            settingsPanel.classList.toggle('open');
            settingsPanel.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
            settingsToggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
          });
        }
`;

// Find the end of the script tag and add our new code before it
const scriptEndMatch = html.match(/<\/script>\s*<\/body>/i);
if (scriptEndMatch) {
  const beforeScript = html.substring(0, scriptEndMatch.index);
  const afterScript = html.substring(scriptEndMatch.index);
  html = beforeScript + rippleAndA11yScript + '\n    ' + afterScript;
}

fs.writeFileSync(path, html);
console.log('done');
