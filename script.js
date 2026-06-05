const triviaBtn = document.getElementById('trivia-btn');
const triviaText = document.getElementById('trivia-text');

const triviaAuthor = document.getElementById('trivia-author');

async function fetchQuote() {
    triviaBtn.textContent = 'Ładowanie...';
    triviaBtn.disabled = true;

    try {
        const response = await fetch('https://api.quotable.io/random?tags=music');
        const data = await response.json();
        triviaText.textContent = data.content;
        triviaAuthor.textContent = '— ' + data.author;
    } catch (error) {
        triviaText.textContent = 'Nie udało się pobrać cytatu. Spróbuj ponownie!';
        triviaAuthor.textContent = '';
    }

    triviaBtn.textContent = 'Losuj cytat';
    triviaBtn.disabled = false;
}

triviaBtn.addEventListener('click', fetchQuote);

fetchQuote();