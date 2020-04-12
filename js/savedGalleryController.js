function onSavedGalleryInit() {
    var memes = loadFromStorage('MEMES');
    if (memes) {
        var images = [];
        console.log(memes);
        // memes = Array.from(memes);
        var savedMemes = [];
        savedMemes.push(memes)
        console.log(savedMemes);
        savedMemes.forEach(meme => {
            console.log(meme.selectedImgId);
            images.push(getImages()[meme.selectedImgId-1])
        });
        
        renderGallery(images);
    }
    else {
        const elGallery = document.querySelector('.gallery')
        elGallery.innerHTML = `<p>There are no saved memes yet</p>`;
    }
}