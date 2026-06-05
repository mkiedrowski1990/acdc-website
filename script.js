const triviaBtn = document.getElementById('trivia-btn');
const triviaText = document.getElementById('trivia-text');
const triviaAuthor = document.getElementById('trivia-author');

async function fetchBandInfo() {
    triviaBtn.textContent = 'Ładowanie...';
    triviaBtn.disabled = true;

    try {
        const response = await fetch(
            'https://musicbrainz.org/ws/2/artist/66c662b6-6e2f-4930-8610-912e24c63ed1?fmt=json',
            { headers: { 'User-Agent': 'acdc-fansite/1.0 (student-project)' } }
        );
        const data = await response.json();

        const began = data['life-span'].begin;
        const country = data.area.name;
        const type = data.type;
        const active = data['life-span'].ended ? 'Nieaktywny' : 'Aktywny';

        triviaText.textContent =
            `Zespół założony: ${began} | Kraj: ${country} | Typ: ${type} | Status: ${active}`;
        triviaAuthor.textContent = '— Źródło: MusicBrainz';

    } catch (error) {
        triviaText.textContent = 'Nie udało się pobrać danych. Spróbuj ponownie!';
        triviaAuthor.textContent = '';
    }

    triviaBtn.textContent = 'Odśwież dane';
    triviaBtn.disabled = false;
}

triviaBtn.addEventListener('click', fetchBandInfo);

fetchBandInfo();

const timezones = [
    { id: 'clock-warsaw', zone: 'Europe/Warsaw', label: '🇵🇱 Warszawa' },
    { id: 'clock-london', zone: 'Europe/London', label: '🇬🇧 Londyn' },
    { id: 'clock-newyork', zone: 'America/New_York', label: '🇺🇸 Nowy Jork' },
    { id: 'clock-sydney', zone: 'Australia/Sydney', label: '🇦🇺 Sydney' },
];

const offsets = {};

async function fetchOffsets() {
    for (const city of timezones) {
        try {
            const response = await fetch(
                `https://time.now/developer/api/timezone/${city.zone}`
            );
            const data = await response.json();
            offsets[city.zone] = data.utc_offset;
        } catch (error) {
            offsets[city.zone] = '+00:00';
        }
    }
}

function getTimeForOffset(utcOffset) {
    const sign = utcOffset[0] === '+' ? 1 : -1;
    const parts = utcOffset.slice(1).split(':');
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const totalMinutes = sign * (hours * 60 + minutes);

    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const localMs = utcMs + totalMinutes * 60000;
    const local = new Date(localMs);

    return local.toTimeString().substring(0, 8);
}

function updateClocks() {
    for (const city of timezones) {
        const el = document.getElementById(city.id);
        if (offsets[city.zone]) {
            const time = getTimeForOffset(offsets[city.zone]);
            el.innerHTML = `${city.label}: <span>${time}</span>`;
        }
    }
}

async function startClock() {
    await fetchOffsets();
    updateClocks();
    setInterval(updateClocks, 1000);
}

startClock();