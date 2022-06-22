import { Universe, Cell } from "wasm-exploration";
import { memory } from "wasm-exploration/wasm_exploration_bg";

const CELL_SIZE = 20; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

const universe = Universe.new()
const width = universe.width();
const height = universe.height();

const playPauseButton = document.getElementById("play-pause");
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

canvas.addEventListener("click", event => {
    const boundingRect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;

    const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
    const canvasTop = (event.clientY - boundingRect.top) * scaleY;

    const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
    const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);

    universe.toggle_cell(row, col);
    // Create a glider on ctrl+click
    if (event.ctrlKey) {
        // Add edge handling using modulo
        // Should set the value to 1... not really toggle
        universe.toggle_cell(row-1, col-1);
        universe.toggle_cell(row-1, col+1);
        universe.toggle_cell(row, col+1);
        universe.toggle_cell(row+1, col);
    }

    drawGrid();
    drawCells();
});

const ctx = canvas.getContext('2d');

const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    for (let i = 0; i <= width; i++) {
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }

    for (let j = 0; j <= height; j++) {
        ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
        ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
};

const getIndex = (row, column) => {
    return row * width + column;
};

const drawCells = () => {
    const cellsPtr = universe.cells();
    // BIT VERSION
    // const cells = new Uint8Array(memory.buffer, cellsPtr, width * height / 8);
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

    ctx.beginPath();

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const idx = getIndex(row, col);

            // TODO: BIT VERSION
            // ctx.fillStyle = isBitSet(idx, cells)
            //   ? ALIVE_COLOR
            //   : DEAD_COLOR;

            ctx.fillStyle = cells[idx] === Cell.Dead
                ? DEAD_COLOR
                : ALIVE_COLOR;

            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }

    ctx.stroke();
};

// BIT VERSION
// const isBitSet = (n, arr) => {
//     const byte = Math.floor(n / 8);
//     const mask = 1 << (n % 8);
//     return (arr[byte] & mask) === mask;
// };

let animationId = null;

const renderLoop = () => {
    // debugger;
    universe.tick()
    drawGrid();
    drawCells();

    animationId = requestAnimationFrame(renderLoop);
}

const isPaused = () => {
    return animationId === null;
};


const play = () => {
    playPauseButton.textContent = "⏸";
    renderLoop();
};

const pause = () => {
    playPauseButton.textContent = "▶";
    cancelAnimationFrame(animationId);
    animationId = null;
};

playPauseButton.addEventListener("click", event => {
    if (isPaused()) {
        play();
    } else {
        pause();
    }
});

drawGrid();
drawCells();
play()
// requestAnimationFrame(renderLoop);
