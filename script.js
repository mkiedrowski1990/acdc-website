const triviaBtn = document.getElementById('trivia-btn');
const triviaText = document.getElementById('trivia-text');

async function fetchTrivia() {
    triviaBtn.textContent = 'Ładowanie...';
    triviaBtn.disabled = true;

    try {
        const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');
        const data = await response.json();
        triviaText.textContent = data.text;
    } catch (error) {
        triviaText.textContent = 'Nie udało się pobrać ciekawostki. Spróbuj ponownie!';
    }

    triviaBtn.textContent = 'Losuj ciekawostkę';
    triviaBtn.disabled = false;
}

triviaBtn.addEventListener('click', fetchTrivia);

fetchTrivia();