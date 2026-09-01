const slides = Array.from(document.querySelectorAll('.slide'));
let current = 0;

const cumTimes = (function() {
  let total = 0;
  return slides.map(slide => {
    const notes = slide.querySelector('aside.notes');
    const words = notes ? notes.innerText.trim().split(/\s+/).filter(w => w).length : 0;
    const extraSeconds = parseFloat(slide.dataset.extraSeconds) || 0;
    total += (words / 120) * 60 + extraSeconds;
    return Math.round(total);
  });
})();

function formatTime(secs) {
  return Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0');
}

let notesFontSize = 14;

function updateNotesPanel() {
  const notes = slides[current].querySelector('aside.notes');
  const el = document.getElementById('notes-content');
  el.textContent = notes ? notes.innerText.trim() : '';
  el.style.fontSize = notesFontSize + 'pt';
  document.getElementById('notes-panel').scrollTop = 0;
}

function adjustNotesFontSize(delta) {
  notesFontSize = Math.max(10, Math.min(32, notesFontSize + delta));
  document.getElementById('notes-content').style.fontSize = notesFontSize + 'pt';
}

function goTo(n) {
  slides[current].classList.remove('active');
  current = Math.max(0, Math.min(n, slides.length - 1));
  slides[current].classList.add('active');
  document.getElementById('counter').textContent = (current + 1) + ' / ' + slides.length;
  document.getElementById('slide-time').textContent = formatTime(cumTimes[current]);
  localStorage.setItem('slide', current);
  if (document.body.classList.contains('notes-visible')) updateNotesPanel();
}

const saved = parseInt(localStorage.getItem('slide'), 10);
goTo(isNaN(saved) ? 0 : saved);

function toggleNotes() {
  document.body.classList.toggle('notes-visible');
  const btn = document.getElementById('notes-btn');
  const visible = document.body.classList.contains('notes-visible');
  btn.textContent = visible ? 'hide notes [N]' : 'notes [N]';
  if (visible) updateNotesPanel();
}

function toggleChrome() {
  document.body.classList.toggle('chrome-hidden');
}

document.addEventListener('keydown', function(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goTo(current + 1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
  if (e.key === 'n' || e.key === 'N') toggleNotes();
  if (e.key === 'p' || e.key === 'P') toggleChrome();
  if (e.key === 'Home') goTo(0);
  if (e.key === 'End') goTo(slides.length - 1);
});
