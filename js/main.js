'use strict';

var gCanvas;
var gCtx;
var gCurrShape = 'rect';
var gCurrColor = '#fff';
var gCurrBorderColor = '#000';


function init() {
    gCanvas = document.getElementById('my-canvas');
    gCtx = gCanvas.getContext('2d');
}

function draw(ev) {
    const { offsetX, offsetY } = ev
    let elShapeSelect = document.getElementById('select-shape');
    gCurrShape = elShapeSelect.value;
    let elColorSelect = document.getElementById('shape-color');
    gCurrColor = elColorSelect.value;
    let elBorderColorSelect = document.getElementById('border-color');
    gCurrBorderColor = elBorderColorSelect.value;
    switch (gCurrShape) {
        case 'triangle':
            drawTriangle(offsetX, offsetY);
            break;
        case 'rect':
            drawRect(offsetX, offsetY);
            break;
        case 'arc':
            drawArc(offsetX, offsetY);
            break;
    }
}

function drawRect(x, y) {
    gCtx.beginPath();
    gCtx.rect(x - 50, y - 50, 100, 100);
    gCtx.lineWidth = 6;
    gCtx.fillStyle = gCurrColor;
    gCtx.fillRect(x - 50, y - 50, 100, 100);
    gCtx.strokeStyle = gCurrBorderColor;
    gCtx.stroke();
}

function drawArc(x, y) {
    gCtx.beginPath();
    gCtx.lineWidth = 6;
    gCtx.arc(x, y, 60, 0, 2 * Math.PI);
    gCtx.fillStyle = gCurrColor;
    gCtx.fill();
    gCtx.strokeStyle = gCurrBorderColor;
    gCtx.stroke();
}

function downloadCanvas(elLink) {
    const data = gCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-canvas.jpg'
}