

$('#seccion-noticias').on('click','.btn-mostrar-comentarios',function (e) {
    console.log('MOSTRANDO COMENTARIOS');
    let publi = $(this).data('publicacion');

    const contenedorInteracciones = $(this).closest('.contenedor-interacciones');
    let seccionComentarios = contenedorInteracciones.siblings('.seccion-comentarios-post');
    let listaComentarios = seccionComentarios.find('.contenedor-comentarios').find('.lista-comentarios');

    seccionComentarios.fadeIn();

    /**
     * Haremos una petición AJAX 
     */

    $.ajax({
        type: "GET",
        url: `/inicio/${publi}/cargandoComentarios`,
        success: function (response) {
            let { usernamesComentarios, fechasComentarios, Comentarios } = response;

            for (let i = 0; i < Comentarios.length; i++) {

                listaComentarios.append(`
                <li>
                    <div class="avatar-post">
                        ${usernamesComentarios[i].charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p class="contenido-comentario">
                            ${Comentarios[i].contenido}
                        </p>
                        <footer class="fecha-comentario">
                            ${fechasComentarios[i]}
                        </footer>
                    </div>
                </li>`)
            }
        }
    });

});