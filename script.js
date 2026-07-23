const startDate = new Date('2026-07-21T00:00:00');
const JOINVILLE_COORDS = {
  latitude: -26.3045,
  longitude: -48.8486,
};

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const motivationEl = document.getElementById('motivation');
const weatherStatusEl = document.getElementById('weatherStatus');

const motivationPool = Array.from({ length: 366 }, (_, index) => {
  const verbs = [
    'Acredite',
    'Continue',
    'Insista',
    'Avance',
    'Confie',
    'Siga',
    'Persista',
    'Mantenha',
    'Forje',
    'Construa',
  ];
  const endings = [
    'na sua própria jornada.',
    'no seu próximo passo.',
    'com foco e coragem.',
    'mesmo quando o caminho parecer longo.',
    'porque o progresso é real.',
    'e transforme esforço em resultado.',
    'com consistência e disciplina.',
    'até o próximo grande avanço.',
    'e escreva o próximo capítulo da vitória.',
    'porque o momento certo já chegou.',
  ];

  const verb = verbs[index % verbs.length];
  const ending = endings[(index * 3) % endings.length];

  return `${verb} ${ending}`;
});

function getMotivation(days) {
  const index = (days + 7) % motivationPool.length;
  return motivationPool[index];
}

function updateCounter() {
  const now = new Date();
  const diff = Math.max(0, now - startDate);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');

  motivationEl.textContent = getMotivation(days);
}

function getThemeByHour(hour) {
  if (hour >= 5 && hour < 12) return 'theme-morning';
  if (hour >= 12 && hour < 18) return 'theme-afternoon';
  return 'theme-night';
}

function getWeatherLabel(code) {
  const map = {
    0: 'céu limpo',
    1: 'predominantemente limpo',
    2: 'parcialmente nublado',
    3: 'nublado',
    45: 'neblina',
    48: 'geada',
    51: 'garoa leve',
    53: 'garoa',
    55: 'garoa intensa',
    56: 'garoa gelada',
    57: 'garoa gelada forte',
    61: 'chuva leve',
    63: 'chuva',
    65: 'chuva forte',
    66: 'chuva gelada',
    67: 'chuva gelada forte',
    71: 'neve leve',
    73: 'neve',
    75: 'neve forte',
    77: 'granizo',
    80: 'chuvas isoladas',
    81: 'chuvas fortes',
    82: 'chuvas muito fortes',
    85: 'neve leve',
    86: 'neve forte',
    95: 'trovoada',
    96: 'trovoada com granizo',
    99: 'trovoada severa',
  };

  return map[code] || 'condições variáveis';
}

function applyTheme(hour, weatherCode) {
  const theme = weatherCode >= 61 || weatherCode >= 80 ? 'theme-rain' : getThemeByHour(hour);
  document.body.className = theme;
}

async function loadWeather() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${JOINVILLE_COORDS.latitude}&longitude=${JOINVILLE_COORDS.longitude}&current=temperature_2m,weather_code&timezone=auto`;
    const response = await fetch(url);
    const data = await response.json();

    const current = data.current;
    const temperature = Math.round(current.temperature_2m);
    const weatherLabel = getWeatherLabel(current.weather_code);
    const time = new Date(current.time);
    const localHour = time.getHours();

    weatherStatusEl.textContent = `Joinville/SC • ${temperature}°C • ${weatherLabel}`;
    applyTheme(localHour, current.weather_code);
  } catch (error) {
    weatherStatusEl.textContent = 'Joinville/SC • clima indisponível no momento';
    applyTheme(new Date().getHours(), 0);
  }
}

updateCounter();
setInterval(updateCounter, 1000);
loadWeather();
setInterval(loadWeather, 60 * 1000 * 15);
