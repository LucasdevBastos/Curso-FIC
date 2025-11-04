// Iniciar AOS
AOS.init({ duration: 650, once: true, offset: 120, throttleDelay: 150, debounceDelay: 150 });

// Navbar sombra ao rolar
const nav = document.querySelector('.navbar');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Vídeo: controles e UI
const box       = document.getElementById('videoBox');
const video     = document.getElementById('videoHero');
const btnToggle = document.getElementById('btnToggle');
const btnPlay   = document.getElementById('btnPlay');
const btnMute   = document.getElementById('btnMute');
const bar       = document.getElementById('bar');
const timeLabel = document.getElementById('timeLabel');

const fmt = t => {
  const m = Math.floor(t / 60).toString().padStart(2, '0');
  const s = Math.floor(t % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

function updateUI() {
  const playing = !video.paused && !video.ended;
  btnToggle.innerHTML = playing ? '<i class="bi bi-pause-fill"></i>' : '<i class="bi bi-play-fill"></i>';
  btnPlay.innerHTML   = playing ? '<i class="bi bi-pause-fill fs-3"></i>' : '<i class="bi bi-play-fill fs-3"></i>';
  box.classList.toggle('playing', playing);
  box.classList.toggle('dim', playing);
}

function updateTime() {
  if (video.duration) {
    bar.style.width = `${(video.currentTime / video.duration) * 100}%`;
    timeLabel.textContent = `${fmt(video.currentTime)}`;
  }
}

// Botões
btnToggle.addEventListener('click', () => video.paused ? video.play() : video.pause());
btnPlay  .addEventListener('click', () => video.paused ? video.play() : video.pause());
btnMute  .addEventListener('click', () => {
  video.muted = !video.muted;
  btnMute.innerHTML = video.muted ? '<i class="bi bi-volume-mute-fill"></i>' : '<i class="bi bi-volume-up-fill"></i>';
});

// Eventos do vídeo
video.addEventListener('play',  updateUI);
video.addEventListener('pause', updateUI);
video.addEventListener('ended', updateUI);
video.addEventListener('timeupdate', updateTime);
video.addEventListener('loadedmetadata', updateTime);

// Auto play/pause quando entra/sai da tela (silencioso)
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}, { threshold: .6 });
io.observe(box);

// Ocultar UI quando o mouse fica parado
box.addEventListener('mousemove', () => {
  box.classList.remove('dim');
  clearTimeout(box._t);
  box._t = setTimeout(() => box.classList.add('dim'), 1200);
});

// Acessibilidade via teclado (quando o foco está no card)
document.addEventListener('keydown', (ev) => {
  if (!box.contains(document.activeElement)) return;
  if (ev.code === 'Space') {
    ev.preventDefault();
    video.paused ? video.play() : video.pause();
  }
  if (ev.code === 'KeyM') {
    video.muted = !video.muted;
    btnMute.innerHTML = video.muted ? '<i class="bi bi-volume-mute-fill"></i>' : '<i class="bi bi-volume-up-fill"></i>';
  }
});
