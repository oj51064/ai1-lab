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

    const imgUrl = `https://static-maps.yandex.ru/1.x/?ll=${(west + east) / 2},${(north + south) / 2}&size=600,400&z=${zoom}&l=sat`;
    
    const mapImage = document.getElementById('mapImage');
    if (mapImage) {
        mapImage.src = imgUrl;
        mapImage.onload = () => {
            createScrambledPuzzle(imgUrl);
        };
    }
}

function createScrambledPuzzle(imgUrl) {
    const container = document.getElementById('scrambledImages');
    container.innerHTML = '';

    const rows = 4;
    const cols = 4;
    const pieceWidth = 150;
    const pieceHeight = 100;

    let pieces = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const piece = document.createElement('div');
            piece.style.backgroundImage = `url(${imgUrl})`;
            piece.style.backgroundPosition = `-${col * pieceWidth}px -${row * pieceHeight}px`;
            piece.style.width = `${pieceWidth}px`;
            piece.style.height = `${pieceHeight}px`;
            piece.style.backgroundSize = `${cols * pieceWidth}px ${rows * pieceHeight}px`;
            piece.draggable = true;

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

const emptyFrame = document.getElementById('emptyFrame');

emptyFrame.addEventListener('dragover', (e) => {
    e.preventDefault(); // Pozwól na upuszczenie
});

emptyFrame.addEventListener('drop', (e) => {
    e.preventDefault();

    const piecePosition = e.dataTransfer.getData('pieceId');
    const piece = document.createElement('div');
    piece.style.backgroundImage = `url(${document.getElementById('mapImage').src})`;
    piece.style.backgroundPosition = piecePosition;
    piece.style.width = '150px';
    piece.style.height = '100px';
    piece.style.backgroundSize = '600px 400px';

    // Obliczanie pozycji w ramce
    const frameRect = emptyFrame.getBoundingClientRect();
    const offsetX = e.clientX - frameRect.left;
    const offsetY = e.clientY - frameRect.top;

    const col = Math.floor((offsetX / emptyFrame.offsetWidth) * 4);
    const row = Math.floor((offsetY / emptyFrame.offsetHeight) * 4);
    const targetIndex = row * 4 + col;

    console.log(`Target Index: ${targetIndex}`); // Dodaj log do debugowania

    // Upewnij się, że pole, na które upuszczamy, jest puste
    if (targetIndex >= 0 && targetIndex < 16) {
        const existingPiece = emptyFrame.children[targetIndex];

        if (!existingPiece) {
            // Wstaw puzzel na odpowiednią pozycję
            if (targetIndex < emptyFrame.children.length) {
                emptyFrame.insertBefore(piece, emptyFrame.children[targetIndex]);
            } else {
                emptyFrame.appendChild(piece);
            }
        } else {
            alert("To pole jest już zajęte!");
        }
    }

    // Usunięcie puzzla z kontenera
    const originalPiece = document.querySelector(`#scrambledImages div[style*="${piecePosition}"]`);
    if (originalPiece) {
        originalPiece.remove();
    }

    checkPuzzleCompletion();
});



// Sprawdzenie ukończenia układanki
function checkPuzzleCompletion() {
    const emptyFramePieces = emptyFrame.children;

    if (emptyFramePieces.length === 16) {
        alert("Gratulacje! Ułożyłeś puzzle!");
    }
}

// Nasłuchuj przycisków
document.getElementById('locationButton').addEventListener('click', getLocation);
document.getElementById('downloadMap').addEventListener('click', downloadMap);

window.onload = initMap;
