'use strict';
var gCanvas;
var gCtx;
var isDragMode = false;

function onChangeSelection(ev) {
    const offsetX = ev.offsetX;
    const offsetY = ev.offsetY;

    var selectedLine = findClickedLine(offsetX, offsetY)

    if (selectedLine < 0) return;

    setSelectedLine(selectedLine);
    draw();
}

function updateTextInput() {
    const elTextInput = document.querySelector('.control-box input.txt-input');
    const currLine = getCurrMeme().lines[getSelectedLine()].txt;
    elTextInput.value = currLine;
}


function memeInit(imageId) {
    gCanvas = document.querySelector('#meme-canvas');
    gCtx = gCanvas.getContext('2d');
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    // clearMeme();
    addImage(imageId);
    // setLinesWidth();
    addLine();
    dragAndDrop();
    draw();
}

function dragAndDrop() {
    const elCanvas = document.querySelector('#meme-canvas');
    elCanvas.addEventListener('mousedown', ev => {
        if (ev.offsetX)
            isDragMode = true
    })

    elCanvas.addEventListener('mousemove', ev => {
        if (!isDragMode) return;
        var currLine = gMeme.lines[gMeme.selectedLineIdx]
        currLine.location.x = ev.offsetX
        currLine.location.y = ev.offsetY
        draw();
    })

    elCanvas.addEventListener('mouseup', ev => {
        isDragMode = false;
    })
}

function draw() {
    var img = new Image();
    img.src = `./img/${getCurrMeme().selectedImgId}.jpg`;
    // gCanvas.width = img.width;
    // gCanvas.height = img.height;
    img.onload = () => {
        gCanvas.height = gCanvas.width * img.height / img.width;
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        setLinesWidth();
        markLineFocus();
        getCurrMeme().lines.forEach((line) => drawTxtLine(line));
        updateTextInput();
    };
}

function markLineFocus() {
    
    const currLine = getCurrLine();
    
    
    gCtx.beginPath();
    gCtx.fillStyle = 'rgba(0, 162, 255, 0.4)';
    // gCtx.lineWidth = 3;
    
    gCtx.rect(currLine.location.x - currLine.width / 2  , currLine.location.y - currLine.fontSize, currLine.width, currLine.fontSize + 5);


    // gCtx.rect(currLine.location.x - currLine.width / 2 - 5, currLine.location.y - currLine.fontSize, currLine.width + 10, currLine.fontSize + 5);
    
    // gCtx.stroke();
    gCtx.fill();
}

function drawTxtLine(line) {
    gCtx.strokeStyle = line.stroke;
    gCtx.fillStyle = line.color;
    gCtx.textAlign = line.align;
    gCtx.font = `${line.fontSize}px ${line.font}`;
    gCtx.fillText(line.txt, line.location.x, line.location.y);
    gCtx.strokeText(line.txt, line.location.x, line.location.y);
}

function onAddLine() {
    addLine();
    draw();
}

function onDeleteLine() {
    deleteLine();
    draw();
}

function onUpdateLineTxt(txt) {
    updateLineTxt(txt);
    draw();
}

function onMoveLine(direction) {
    (direction === 'up') ? upDownLine(-10) : upDownLine(10);
    draw();
}

function onSwitchLineFocus() {
    switchSelectedLines();
    updateTextInput();
    draw();
    markLineFocus();
}

function onChangeFontSize(direction) {
    (direction === 'up') ? changeFontSize(7) : changeFontSize(-7);
    draw();
}

function onChangeLineAligment(lcr) {
    if (gMeme.lines.length <= 0) return;
    ChangeLineAligment(lcr);
    draw();
}


function onChangeFontColor() {
    const fontColor = document.querySelector('input[name="fontColor"]').value;
    changeFontColor(fontColor);
    draw();
}

function onChangeStrokeColor() {
    const strokeColor = document.querySelector('input[name="strokeColor"]').value;
    changeStrokeColor(strokeColor);
    draw();
}

function onChangeFontFamily(font) {

}


function onSave() {
    var memes = loadFromStorage('MEMES');
    if (memes) {
        memes = Array.from(memes)
        memes.push(getCurrMeme())
    }
    else memes = getCurrMeme();
    saveToStorage('MEMES', memes);

}