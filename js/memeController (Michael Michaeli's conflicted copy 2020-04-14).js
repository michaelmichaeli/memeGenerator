'use strict';
var gCanvas;
var gCtx;
var isDragMode = false;
var gSavedMemes = loadFromStorage('MEMES')


function onDownloadImg(elLink) {
    clearMark();
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent;
}

function clearMark() {
    draw(false);
}

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
    addImage(imageId);
    addLine();
    dragAndDrop();
    draw();
}


// on submit call to this function
function uploadImg(elForm, ev) {
    ev.preventDefault();
    document.getElementById('imgData').value = gCanvas.toDataURL("image/jpeg");

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
        <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share   
        </a>`
    }

    doUploadImg(elForm, onSuccess);
}
function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(function (res) {
            return res.text()
        })
        .then(onSuccess)
        .catch(function (err) {
            console.error(err)
        })
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

function draw(mark = true) {
    var img = new Image();
    if (!gIsUpload) img.src = `img/${getCurrMeme().selectedImgId}.jpg`;
    else {
        img.src = gUploadSrc;
    }
    img.onload = () => {
        gCanvas.height = gCanvas.width * img.height / img.width;
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        setLinesWidth();

        if (mark) markLineFocus();

        getCurrMeme().lines.forEach((line) => drawTxtLine(line));
        updateTextInput();
    };
}

function markLineFocus() {
    const currLine = getCurrLine();
    gCtx.beginPath();
    gCtx.fillStyle = 'rgba(0, 162, 255, 0.4)';
    gCtx.rect(currLine.location.x - currLine.width / 2, currLine.location.y - currLine.fontSize, currLine.width, currLine.fontSize + 5);
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
    // markLineFocus();
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
    clearMark();
    openModal();
    setTimeout(() => {
        closeModal;
        let imgContent = gCanvas.toDataURL();
        let meme = getCurrMeme();
        gSavedMemes.push({ imgContent, id: makeId(2), meme });
        saveToStorage('MEMES', gSavedMemes);
    }, 1500);
}

function openModal() {
    document.querySelector('.modal').style.display = 'block';
    const elModalTitle = document.querySelector('.modal-title');
    elModalTitle.innerHTML = `Your meme has been saved successfully`;
}

function closeModal() {
    document.querySelector('.modal').style.display = 'none';
}