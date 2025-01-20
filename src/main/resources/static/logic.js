// Получаем HTML-элемент для игрового поля крестиков-ноликов
const grid = document.getElementById('grid');
// Получаем HTML-элемент для отображения результата игры крестиков-ноликов
const tttResult = document.getElementById('tictactoe-result');
// Получаем HTML-элемент для отображения результата игры "Камень-ножницы-бумага"
const rpsResult = document.getElementById('rps-result');
const player = document.getElementById("player");
const bot = document.getElementById("bot");
// Массив для хранения состояния игрового поля крестиков-ноликов
let cells = Array(9).fill(null);
// Переменная для отслеживания текущего игрока (X или O)
let currentPlayer = 'X';

// Функция для загрузки статистики с сервера и обновления отображения в HTML
async function loadStatsRps() {
    const response = await fetch('/api/stats');
    const stats = await response.json();
    const rpsStats = stats['rps'] || {};
    document.getElementById('rps-wins').textContent = rpsStats['win'];
    document.getElementById('rps-losses').textContent = rpsStats['loss'];
    document.getElementById('rps-draws').textContent = rpsStats['draw'];
}
// Функция для загрузки статистики с сервера и обновления отображения в HTML
async function loadStatsTTT() {
    const response = await fetch('/api/stats');
    const stats = await response.json();
    const tttStats = stats['tic-tac-toe'] || {};
    document.getElementById('ttt-wins').textContent = tttStats['win'];
    document.getElementById('ttt-draws').textContent = tttStats['draw'];
    document.getElementById('ttt-losses').textContent = tttStats['loss'];
}

// Функция для отправки результата игры на сервер для обновления статистики
async function updateStats(game, result) {
    await fetch('/api/stats/update', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({game, result})
    });

    try {
        await loadStatsRps();
    }catch (e){
    }
    try {
        await loadStatsTTT();
    }catch (e){
    }

}
// Проверка победителя с отображением линии
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
            return cells[a];
        }
    }

    return cells.includes(null) ? null : "Ничья";
}

// Обработчик клика по ячейке игрового поля крестиков-ноликов
const handleCellClick = (index) => {
    if (cells[index] || checkWinner()) return;

    cells[index] = currentPlayer;
    grid.children[index].textContent = currentPlayer;

    const winner = checkWinner();
    if (winner) {
        if (winner === 'Ничья') {
            updateStats('tic-tac-toe', 'draw');
            tttResult.textContent = 'Ничья!';
        } else {
            updateStats('tic-tac-toe', winner === 'X' ? 'win' : 'loss');
            tttResult.textContent = `Игрок ${winner} победил!`;
        }
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
};

// Функция для рендера игрового поля крестиков-ноликов и сброса игры
function renderCells() {
    cells = Array(9).fill(null);
    tttResult.textContent = '';
    grid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.addEventListener('click', () => handleCellClick(i));
        grid.appendChild(cell);
        switch (i){
            case 1:
                cell.style.border = "none"
                cell.style.borderInline = "1px solid black"
                break;
            case 3:
                cell.style.border = "none"
                cell.style.borderBlock = "1px solid black"
                break;
            case 4:
                cell.style.border = "1px solid black"
                break;
            case 5:
                cell.style.border = "none"
                cell.style.borderBlock = "1px solid black"
                break;
            case 7:
                cell.style.border = "none"
                cell.style.borderInline = "1px solid black"
                break;
        }
    }
}

// Логика игры "Камень-ножницы-бумага", определяет результат на основе выбора игрока и компьютера
const playRPS = (playerChoice) => {
    const choices = ['камень', 'бумага', 'ножницы'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];

    if (playerChoice === computerChoice) {
        updateStats('rps', 'draw');
        rpsResult.textContent = `Ничья! Оба выбрали ${playerChoice}.`;
        bot.textContent = `Компьютер выбрал: ${computerChoice}`;
        player.textContent = `Вы выбрали: ${playerChoice}`;
    } else if (
        (playerChoice === 'камень' && computerChoice === 'ножницы') ||
        (playerChoice === 'бумага' && computerChoice === 'камень') ||
        (playerChoice === 'ножницы' && computerChoice === 'бумага')
    ) {
        updateStats('rps', 'win');
        rpsResult.textContent = `Вы выиграли! ${playerChoice} бьёт ${computerChoice}.`;
        bot.textContent = `Компьютер выбрал: ${computerChoice}`;
        player.textContent = `Вы выбрали: ${playerChoice}`;
    } else {
        updateStats('rps', 'loss');
        rpsResult.textContent = `Вы проиграли! ${computerChoice} бьёт ${playerChoice}.`;
        bot.textContent = `Компьютер выбрал: ${computerChoice}`;
        player.textContent = `Вы выбрали: ${playerChoice}`;
    }
};
renderCells();