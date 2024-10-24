const pieces = document.querySelectorAll('.piece');
const targets = document.querySelectorAll('.target-piece');
const piecesContainer = document.getElementById('pieces');

pieces.forEach(piece => {
    piece.addEventListener('dragstart', dragStart);
});

targets.forEach(target => {
    target.addEventListener('dragover', dragOver);
    target.addEventListener('drop', drop);
});

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData('text/plain');
    const piece = document.getElementById(pieceId);
    
    // Sprawdzenie, czy pole docelowe jest zajęte
    if (e.target.hasChildNodes()) {
        const existingPiece = e.target.firstChild; // Istniejący kawałek puzzla
        
        // Znajdź najbliższe wolne miejsce
        const freeTarget = findNextFreeTarget(e.target);
        if (freeTarget) {
            freeTarget.appendChild(existingPiece); // Przenieś istniejący kawałek
        }
    }

    e.target.appendChild(piece); // Umieść nowy kawałek w docelowym miejscu
    checkPuzzle();
}

// Funkcja do znajdowania najbliższego wolnego miejsca
function findNextFreeTarget(currentTarget) {
    for (let target of targets) {
        if (!target.hasChildNodes()) {
            return target; // Zwraca pierwsze wolne miejsce
        }
    }
    return null; // Brak wolnych miejsc
}

function checkPuzzle() {
    const correctOrder = ['piece1', 'piece2', 'piece3', 'piece4'];
    const placedPieces = Array.from(targets).map(target => target.firstChild ? target.firstChild.id : null);

    if (JSON.stringify(placedPieces) === JSON.stringify(correctOrder)) {
        alert('Gratulacje! Ułożyłeś puzzle poprawnie!');
    }
}
