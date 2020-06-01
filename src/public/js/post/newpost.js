const btnNewpost = $('#newpost-nav');
const btnCerrarModalNewpost = $('#cerrar-newpost');
const modalNewpost = $('#newpost-modal');
const inputFilePost = document.getElementById('file-post');
const previewNewpost = document.querySelector('#newpost-modal .newpost .preview');

btnNewpost.click((e)=>{
    modalNewpost.fadeIn();
});

btnCerrarModalNewpost.click((e)=>{
    modalNewpost.fadeOut();
    previewNewpost.innerHTML = '<p>PREVIEW</p>';
})

inputFilePost.addEventListener('change',(e)=>{
    const files = inputFilePost.files;
    if(!files && !files.length){
        return
    }
    else{
        const archivo = files[0];
        const urlPreview = URL.createObjectURL(archivo);
        previewNewpost.innerHTML = '';
        previewNewpost.innerHTML = `<img src="${urlPreview}">`
    }
})



