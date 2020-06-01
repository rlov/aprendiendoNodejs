const comentariosPost = document.getElementById('contenedor-comentarios-post');

$('#btn-comentar').click((e)=>{
    e.preventDefault();
    let formulario = $('#btn-comentar').closest('.form-comentario');
    let contenido = formulario.find('textarea').val();
    let idPublicacion = $('#btn-comentar').data('idpublicacion');

    //Aquí haremos una petición ajax para guardar los datos y el servidor nos dirá que guardar
    $.ajax({
        type: "POST",
        url: `/gallery/${idPublicacion}/newcomentario`,
        data: {
            comentario: contenido.trim(),
            idPublicacion: idPublicacion
        },
        success: function (response) {
            console.log(response);
            const {comentario,fecha,username } = response;
            comentariosPost.innerHTML += `<div class="contenedor-comentario">
            <p class="username-comentario">${username} <span>${fecha}</span></p>
            <p class="contenido-comentario">${comentario}</p>
            </div>`
            document.getElementById('numero-comentarios').textContent = parseInt(document.getElementById('numero-comentarios').textContent) + 1;
        }
    });
})

document.querySelectorAll('.btn-like-post').forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        let thisBoton = e.currentTarget;
        let idpublicacion = thisBoton.dataset.idpublicacion;
        let botonDislike = thisBoton.nextSibling.nextSibling;
        if(botonDislike.classList.contains('activo')){
            botonDislike.classList.remove('activo');
        }
        thisBoton.classList.toggle('activo');
        if(thisBoton.classList.contains('activo')){
            //Entonces le hemos dado un like
            /**
             * TENDREMOS QUE ENVIAR UNA NOTIFICACIÓN AL USUARIO DE LA PUBLICACIÓN
             */
            $.ajax({
                type: "POST",
                url: `/gallery/${idpublicacion}/like`,
                data: {
                    clase: 'activo'
                },
                success: function (response) {
                    
                }
            });
        }
        else{
            //No hemos dado like

            $.ajax({
                type: "POST",
                url: `/gallery/${idpublicacion}/like`,
                data: {
                    class: 'noactivo'
                },
                success: function (response) {
                    
                }
            });
        }
    })
})

document.querySelectorAll('.btn-dislike-post').forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        let thisBoton = e.currentTarget;
        let idpublicacion = thisBoton.dataset.idpublicacion;
        let botonLike = thisBoton.previousSibling.previousSibling;
        if(botonLike.classList.contains('activo')){
            botonLike.classList.remove('activo');
        }
        thisBoton.classList.toggle('activo');
        if(thisBoton.classList.contains('activo')){
            //Entonces le hemos dado un like
            console.log('dislike');
            $.ajax({
                type: "POST",
                url: `/gallery/${idpublicacion}/dislike`,
                data: {
                    class: 'activo'
                },
                success: function (response) {
                    
                }
            });
        }
        else{
            //No hemos dado like
            console.log('no dislike');
            $.ajax({
                type: "POST",
                url: `/gallery/${idpublicacion}/dislike`,
                data: {
                    class: 'noactivo'
                },
                success: function (response) {
                    
                }
            });
        }
    })
})
