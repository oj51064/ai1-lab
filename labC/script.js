let map;

function initMap() {
    map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolokalizacja nie jest wspierana przez tę przeglądarkę.");
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    map.setView([lat, lon], 13);
    L.marker([lat, lon]).addTo(map)
        .bindPopup("Twoja lokalizacja")
        .openPopup();
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("Brak zgody na lokalizację.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Lokalizacja niedostępna.");
            break;
        case error.TIMEOUT:
            alert("Czas oczekiwania na lokalizację upłynął.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Wystąpił nieznany błąd.");
            break;
    }
}

function downloadMap() {
    const bounds = map.getBounds();
    const west = bounds.getWest();
    const south = bounds.getSouth();
    const east = bounds.getEast();
    const north = bounds.getNorth();
    const zoom = map.getZoom();

    const imgUrl = `https://static-maps.yandex.ru/1.x/?ll=${(west + east) / 2},${(north + south) / 2}&size=650,450&z=${zoom}&l=sat`;
    
    const mapImage = document.getElementById('mapImage');
    if (mapImage) {
        mapImage.src = imgUrl;
        mapImage.onload = () => {
            createPuzzleGrid();
            createScrambledPuzzle(imgUrl);
        };
    }
}

function createScrambledPuzzle(imgUrl) {
    const container = document.getElementById('scrambledImages');
    container.innerHTML = '';

    const rows = 4;
    const cols = 4;
    const pieceWidth = 150; // Szerokość puzzli
    const pieceHeight = 100; // Wysokość puzzli

    let pieces = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const piece = document.createElement('div');
            piece.style.backgroundImage = `url(${imgUrl})`;
            piece.style.backgroundPosition = `-${col * pieceWidth}px -${row * pieceHeight}px`;
            piece.style.width = `${pieceWidth}px`; // Ustaw stałą szerokość puzzla
            piece.style.height = `${pieceHeight}px`; // Ustaw stałą wysokość puzzla
            piece.style.backgroundSize = `${cols * pieceWidth}px ${rows * pieceHeight}px`;
            piece.draggable = true; // Umożliwienie przeciągania

            // Nasłuchiwanie zdarzeń przeciągania
            piece.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('pieceId', piece.style.backgroundPosition);
                e.target.classList.add('dragging');
            });

            piece.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });

            pieces.push(piece);
        }
    }

    pieces.sort(() => Math.random() - 0.5);
    pieces.forEach(piece => container.appendChild(piece));
}

function createPuzzleGrid() {
    const puzzleContainer = document.getElementById('puzzleContainer');
    puzzleContainer.innerHTML = ''; // Wyczyść zawartość kontenera

    const rows = 4;
    const cols = 4;

    // Tworzenie 16 komórek (4x4)
    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.style.border = '1px solid #000'; // Obramowanie każdej komórki
        cell.style.backgroundColor = '#e0e0e0'; // Kolor tła
        cell.addEventListener('dragover', (e) => {
            e.preventDefault(); // Zapobiega domyślnemu zachowaniu
        });

        cell.addEventListener('drop', (e) => {
            e.preventDefault(); // Zapobiega domyślnemu zachowaniu
            
            const draggingPiece = document.querySelector('.dragging');

            if (!draggingPiece) return;

            // Sprawdź, czy komórka docelowa jest pusta
            if (cell.childElementCount === 0) {
                // Dodaj przeniesiony element do aktualnej komórki
                draggingPiece.classList.remove('dragging');
                draggingPiece.style.width = '100%';
                draggingPiece.style.height = '100%';
                draggingPiece.style.border = '1px solid #ccc';
                draggingPiece.style.backgroundSize = `600px 400px`; // Dopasowanie do rozmiaru obrazka
                draggingPiece.style.boxSizing = 'border-box';
    
                cell.appendChild(draggingPiece); // Dodaj przesunięty puzzel do nowej komórki
            } else {
                // Jeśli komórka jest zajęta, znajdź najbliższą wolną kratkę
                const puzzleContainer = document.getElementById('puzzleContainer');
                const cells = Array.from(puzzleContainer.children);
                const occupiedPiece = cell.firstElementChild;
        
                // Znajdź pierwszą wolną kratkę w siatce
                const emptyCell = cells.find(c => c.childElementCount === 0);
        
                if (emptyCell) {
                    // Przenieś istniejący puzzel do najbliższej wolnej kratki
                    emptyCell.appendChild(occupiedPiece);
                }
        
                // Dodaj przesunięty puzzel do aktualnej komórki
                draggingPiece.classList.remove('dragging');
                
                draggingPiece.style.width = '100%';
                draggingPiece.style.height = '100%';
                draggingPiece.style.border = '1px solid #ccc';
                draggingPiece.style.backgroundSize = `600px 400px`; // Dopasowanie do rozmiaru obrazka
                draggingPiece.style.boxSizing = 'border-box';

                cell.appendChild(draggingPiece);
            }
        });

        puzzleContainer.appendChild(cell);
    }
}

// Wywołaj funkcję tworzącą kratkę przy ładowaniu strony
window.onload = () => {
    initMap(); // Inicjalizacja mapy
    createPuzzleGrid(); // Tworzenie kratki na puzzle
};

// Nasłuchuj przycisków
document.getElementById('locationButton').addEventListener('click', getLocation);
document.getElementById('downloadMap').addEventListener('click', downloadMap);
