'use strict'

function onClearSearch() {
    const elSearchInput = document.querySelector('input[name="search-input"]');
    elSearchInput.value = '';
}

function onGalleryInit() {
    const images = getImages();
    renderGallery(images);
}

function onSearch(value) {
    const images = getImages().filter(image => image.keyWords.find(keyWord => keyWord.toLocaleLowerCase() === value.toLocaleLowerCase()))
    renderGallery(images);
    if (!value) renderGallery(getImages());
}

function renderGallery(images) {
    var galleryHTML = '';
    images.forEach(image => {
        galleryHTML += `<img class="non-square-image"  src="${image.url}" onClick="onImageClicked(${image.id})">`
    });

    var gallery = document.querySelector('.gallery-images');
    gallery.innerHTML = galleryHTML;
}

function onImageClicked(id) {
    renderEditView();
    memeInit(id);
    // onChangeLineAligment('center');
}

function renderEditView() {
    const elGallery = document.querySelector('.gallery');
    elGallery.hidden = true;
    elGallery.classList.remove('flex');
    const elMemeEditor = document.querySelector('.editor');
    elMemeEditor.hidden = false;
    elMemeEditor.classList.add('flex');
}


