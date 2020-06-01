$('#galeria-profile').on('click', '.btn-update-delete', function (e) {
    $(this).siblings('ul').fadeIn();
});

$("#galeria-profile").on('mouseleave', 'ul', function (e) {
    $(this).fadeOut();
});

$('#galeria-profile').on('mouseleave', '.item-galeria', function (e) {
    $(this).find('ul').fadeOut();
})

const btnGuardarCambios = document.getElementById('btn-guardar-cambios');

$('#galeria-profile').on('click', '.opcion-update', function (e) {
    $('#update-post-modal').fadeIn();
    $('#ventana-update-post').fadeIn();

    const parrafoTitulo = $(this).closest('.item-galeria').find('.contenedor-descripcion-item p');
    const srcImagen = $(this).closest('.item-galeria').find('img').attr('src');
    const titulo = parrafoTitulo.html();

    $('#ventana-update-post .preview').html(`<img src="${srcImagen}">`)

    const textareaTitulo = $('#ventana-update-post #form-update-post textarea');

    textareaTitulo.val(titulo);
    btnGuardarCambios.dataset.publicacion = $(this).data('publicacion');

    btnGuardarCambios.addEventListener('click', (e) => {
        e.preventDefault();
        let pathPublicacion = btnGuardarCambios.dataset.publicacion;

        let nuevoTitulo = textareaTitulo.val();

        $('#ventana-update-post').fadeOut()
        $('#ventana-actualizado-satisfactoriamente').fadeIn();
        $('#ventana-actualizado-satisfactoriamente').html(`<img src="/img/preloader.gif">`)
        $.ajax({
            type: "PUT",
            url: "/updatepost",
            data: {
                nuevoTitulo,
                pathPublicacion
            },
            success: function (response) {
                parrafoTitulo.html(nuevoTitulo);
                setTimeout(() => {
                    $('#ventana-actualizado-satisfactoriamente').html(`<p>Actualizado satisfactoriamente</p>`);
                    setTimeout(() => {
                        $('#update-post-modal').fadeOut();
                        $('#ventana-actualizado-satisfactoriamente').fadeOut();
                    }, 500)
                }, 500)
            }
        });
    })
});

$('#galeria-profile').on('click','.opcion-delete',function(e){
    let pathPublicacion = $(this).data('publicacion');

    //Seleccionamos el item de la galería que borraremos
    const itemGaleria = $(this).closest('.item-galeria');

    $('#update-post-modal').fadeIn();
    $('#ventana-actualizado-satisfactoriamente').fadeIn();
    $('#ventana-actualizado-satisfactoriamente').html(`<img src="/img/preloader.gif">`)
    $.ajax({
        type: "DELETE",
        url: `/deletepost/${pathPublicacion}`,
        success: function (response) {
            setTimeout(() => {
                $('#ventana-actualizado-satisfactoriamente').html(`<p>Eliminado satisfactoriamente</p>`);
                setTimeout(() => {
                    $('#update-post-modal').fadeOut();
                    $('#ventana-actualizado-satisfactoriamente').fadeOut();
                    $container.masonry('remove',itemGaleria);
                    $container.masonry('layout');
                }, 500)
            }, 500)
        }
    });
});


$('#cerrar-update-post').click((e) => {
    $('#update-post-modal').fadeOut();
})



