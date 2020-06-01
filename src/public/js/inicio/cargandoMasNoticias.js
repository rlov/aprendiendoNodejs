/**
 * Vamos a calcular con eventos, el scroll realizado y si es mayor o igual
 * al altura de la sección noticias, entonces haremos una petición AJAX para
 * traer más contenido
 */


$(document).ready(function () {
    let seccionNoticias = document.getElementById('seccion-noticias');
    let desde = 6,
        hasta = 12;
    $(window).on("scroll", function () {
        let scrollHeight = $(document).height();
        let scrollPosition = $(window).height() + $(window).scrollTop();
        if ((scrollHeight - scrollPosition) / scrollHeight === 0) {

            $.ajax({
                type: "POST",
                url: "/inicio/cargandoMasNoticias",
                data: {
                    desde: desde,
                    hasta: hasta
                },
                success: function (response) {
                    if (response != 'fin') {
                        let { Noticias, fechasNoticias, pathImagenesNoticias, urlPublicacionesNoticias, usernamesNoticias, estadoLike, estadoDislike } = response;
                        for (let i = 0; i < Noticias.length; i++) {
                            seccionNoticias.innerHTML += `
                            <div class="item-seccion-noticias">
                                <div class="informacion-post">
                                    <div class="avatar-post">
                                        ${usernamesNoticias[i].charAt(0).toUpperCase()}
                                    </div>
                                    <div class="titulo-post">
                                        <h2><a target="_blank" href="/profile/${usernamesNoticias[i]}"> ${usernamesNoticias[i]}</a>
                                            <span> ${fechasNoticias[i]}</span></h2>
                                        <h3>${Noticias[i].description} </h3>
                                    </div>
                                </div>
                                <p class="description-post">
                                Lorem ipsum dolor, sit amet
                                consectetur adipisicing elit. Illum molestias et sequi harum laboriosam, maiores asperiores
                                molestiae repellat, nisi totam blanditiis quo rerum aliquam voluptas cumque, eveniet pariatur
                                suscipit porro.
                                </p>
                                <div class="contenedor-imagen-post">
                                    <a href="/gallery/${urlPublicacionesNoticias[i]}">
                                        <img src="${pathImagenesNoticias[i]}">
                                    </a>
                                </div>
                                    <div class="contenedor-interacciones">
                                        <div class="stats-post">
                                            <p data-publicacion="${urlPublicacionesNoticias[i]}"  class="cantidad-likes"> ${Noticias[i].likes}   likes</p>
                                            <p data-publicacion="${urlPublicacionesNoticias[i]}"  class="cantidad-dislikes"> ${Noticias[i].dislike}  dislikes</p>
                                            <p data-publicacion="${urlPublicacionesNoticias[i]}"  class="cantidad-comentarios"> ${Noticias[i].numeroComentarios}  comentarios</p>
                                            <p data-publicacion="${urlPublicacionesNoticias[i]}"  class="cantidad-vistas"> ${Noticias[i].views}   vistas</p>
                                            <div class="contenedor-redes-sociales">
                                                <button><i class="fab fa-facebook"></i></button>
                                                <button><i class="fab fa-instagram"></i></button>
                                                <button><i class="fab fa-twitter"></i></button>
                                                <button><i class="fab fa-reddit"></i></button>
                                            </div>
                                        </div>
                                        <div class="contenedor-botones">
                                            <button data-publicacion="${urlPublicacionesNoticias[i]}" class="btn-like-post success-${estadoLike[i]}"><i
                                                    class="far fa-thumbs-up"></i>&nbsp;&nbsp;Like</button>
                                            <button data-publicacion="${urlPublicacionesNoticias[i]}" class="btn-dislike-post success-${estadoDislike[i]}"><i
                                                    class="far fa-thumbs-down"></i>&nbsp;&nbsp;Dislike</button>
                                            <button data-publicacion="${urlPublicacionesNoticias[i]}" class="btn-mostrar-comentarios"><i
                                                    class="far fa-comment"></i>&nbsp;&nbsp;Comentar</button>
                                        </div>
                                    </div>

                                    <section class="seccion-comentarios-post">
                                        <div class="formulario-comentar">
                                            <div class="avatar-post">
                                                R
                                            </div>
                                            <form class="caja-formulario-comentar" data-publicacion="${urlPublicacionesNoticias[i]}">
                                                <textarea class="textarea" required placeholder="Escribe tu comentario" rows="2"></textarea>
                                                <footer>
                                                    <button type="submit" class="btn-comentar"><i class="far fa-paper-plane"></i></button>
                                                </footer>
                                            </form>
                                        </div>
                                        <div class="contenedor-comentarios" id="contenedor-comentarios">
                                            <ul class="lista-comentarios">

                                            </ul>
                                        </div>
                                    </section>
                            </div>
                        `
                        }
                    }
                }
            });
            desde = hasta,
                hasta += 6;
        }
    });

    $('#seccion-noticias').on('click', '.btn-mostrar-comentarios', function (e) {
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
                        
                        <p class="informacion-comentario">
                            <span>${usernamesComentarios[i]}</span>
                            <span class="fecha-comentario">
                            ${fechasComentarios[i]}
                            </span>
                        </p>
                        <p class="contenido-comentario">${Comentarios[i].contenido}</p>
                        
                    </div>
                </li>`)
                }
            }
        });

    });

    $('#seccion-noticias').on('submit', '.caja-formulario-comentar', function (e) {
        e.preventDefault();
        let pathPublicacion = $(this).data('publicacion');
        let contenidoComentario = $(this).find('textarea').val();

        let ListaComentarios = $(this).closest('.formulario-comentar').siblings('.contenedor-comentarios').find('.lista-comentarios');

        $.ajax({
            type: "POST",
            url: "/inicio/publicacion/newcomentario",
            data: {
                pathPublicacion,
                contenidoComentario
            },
            success: function (response) {
                let { contenido, fecha, username } = response;
                ListaComentarios.prepend(`
                <li>
                    <div class="avatar-post">
                        ${username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                    <p class="informacion-comentario">
                        <span>${username}</span>
                        <span class="fecha-comentario">
                        ${fecha}
                        </span>
                    </p>
                        <p class="contenido-comentario">${contenido}</p>

                    </div>
                </li>
                `)
            }
        });
        $(this).find('textarea').val('');
    })

    $('#seccion-noticias').on('click', '.btn-like-post', function (e) {
        let pathPublicacion = $(this).data('publicacion');

        /**
         * Obteniendo el btn-dislike hermano
         */
        const btnDislike = $(this).siblings('.btn-dislike-post');

        //Parrafo cantidad-likes
        let parrafoLikes = $(this).closest('.contenedor-interacciones').find('.cantidad-likes');
        let cantidadLikes = parrafoLikes.html();
        //Parrafo cantidad-dislikes
        let parrafoDislikes = $(this).closest('.contenedor-interacciones').find('.cantidad-dislikes');
        let cantidadDislikes = parrafoDislikes.html();
        if ($(this).hasClass('success-like')) {

            $.ajax({
                type: "POST",
                url: "/inicio/publicacion/like",
                data: {
                    pathPublicacion,
                    action: 'noLike'
                },
                success: function (response) {
                    parrafoLikes.html(parseInt(cantidadLikes) - 1 + ' ' + ' likes');
                }
            });

            $(this).removeClass('success-like');
        }
        else {
            //Queremos darle like

            btnDislike.removeClass('success-dislike');

            $.ajax({
                type: "POST",
                url: "/inicio/publicacion/like",
                data: {
                    pathPublicacion,
                    action: 'like'
                },
                success: function (response) {
                    let { dislikeExiste } = response;
                    if (dislikeExiste == 'si') {
                        //Entonces deberíamos disminuir en 1 la cantidad de dislike
                        parrafoDislikes.html(parseInt(cantidadDislikes) - 1 + ' ' + 'dislikes');
                    }
                    parrafoLikes.html(parseInt(cantidadLikes) + 1 + ' ' + 'likes');
                }
            });
            $(this).addClass('success-like');
        }
    });

    $('#seccion-noticias').on('click', '.btn-dislike-post', function (e) {
        let pathPublicacion = $(this).data('publicacion');

        //Obteniendo el boton like hermano
        let btnLike = $(this).siblings('.btn-like-post');

        //Parrafo cantidad-likes
        let parrafoLikes = $(this).closest('.contenedor-interacciones').find('.cantidad-likes');
        let cantidadLikes = parrafoLikes.html();
        //Parrafo cantidad-dislikes
        let parrafoDislikes = $(this).closest('.contenedor-interacciones').find('.cantidad-dislikes');
        let cantidadDislikes = parrafoDislikes.html();

        if ($(this).hasClass('success-dislike')) {

            $.ajax({
                type: "POST",
                url: "/inicio/publicacion/dislike",
                data: {
                    pathPublicacion,
                    action: 'noDislike'
                },
                success: function (response) {
                    parrafoDislikes.html(parseInt(cantidadDislikes) - 1 + ' ' + ' dislikes');
                }
            });
            $(this).removeClass('success-dislike');
        }
        else {
            //Queremos darle dislike
            btnLike.removeClass('success-like');

            $.ajax({
                type: "POST",
                url: "/inicio/publicacion/dislike",
                data: {
                    pathPublicacion,
                    action: 'dislike'
                },
                success: function (response) {
                    let { likeExiste } = response;
                    if (likeExiste == 'si') {
                        //Entonces deberíamos disminuir en 1 la cantidad de dislike
                        parrafoLikes.html(parseInt(cantidadLikes) - 1 + ' ' + 'likes');
                    }
                    parrafoDislikes.html(parseInt(cantidadDislikes) + 1 + ' ' + 'dislikes');
                }
            });
            $(this).addClass('success-dislike');
        }
    })

    //-----------------

    $('#seccion-noticias').on('click','.cantidad-likes', function (e){
        let pathPublicacion = $(this).data('publicacion');
        $('#lista-likes-dislikes-views').css({
            'display' : 'flex'
        });
        
        document.getElementById('lista-likes-dislikes-views').dataset.publicacion= pathPublicacion;
        
        $('#lista-likes-dislikes-views .listas').html('<img src="/img/preloader.gif">');

        $.ajax({
            type: "GET",
            url: `/inicio/${pathPublicacion}/listalikes`,
            success: function (response) {
                $('#lista-likes-dislikes-views .listas').html('');
                let { usernamesLikes, fullnameLikes} = response;
                for (let i = 0; i < usernamesLikes.length; i++) {
                    $('#lista-likes-dislikes-views .listas').append(`
                    <li>
                        <div>
                            ${usernamesLikes[i].charAt(0).toUpperCase()}
                        </div>
                        <a href="profile/${usernamesLikes[i]}">
                            <p>
                                ${fullnameLikes[i]}
                            </p>
                        </a>
                    </li>
                    `)
                }
            }
        });
    });

    $('#seccion-noticias').on('click','.cantidad-dislikes', function (e){
        let pathPublicacion = $(this).data('publicacion');
        $('#lista-likes-dislikes-views').css({
            'display' : 'flex'
        });

        document.getElementById('lista-likes-dislikes-views').dataset.publicacion= pathPublicacion;
        $('#lista-likes-dislikes-views .listas').html('<img src="/img/preloader.gif">');
        $.ajax({
            type: "GET",
            url: `/inicio/${pathPublicacion}/listalikes`,
            success: function (response) {
                $('#lista-likes-dislikes-views .listas').html('');
                let { usernamesLikes, fullnameLikes} = response;
                for (let i = 0; i < usernamesLikes.length; i++) {
                    $('#lista-likes-dislikes-views .listas').append(`
                    <li>
                        <div>
                            ${usernamesLikes[i].charAt(0).toUpperCase()}
                        </div>
                        <a href="profile/${usernamesLikes[i]}">
                            <p>
                                ${fullnameLikes[i]}
                            </p>
                        </a>
                    </li>
                    `)
                }
            }
        });
    });

    //------------------------

    $('#lista-likes-dislikes-views').on('click','.pestaña-dislike',function(e){

        $(this).siblings('.pestaña-like').css({
            'border' : 'none'
        })
    
        $(this).css({
            'border-bottom': '2px solid gray'
        })

        let pathPublicacion = document.getElementById('lista-likes-dislikes-views').dataset.publicacion;

        $('#lista-likes-dislikes-views .listas').html('<img src="/img/preloader.gif">');

        $.ajax({
            type: "GET",
            url: `/inicio/${pathPublicacion}/listadislikes`,
            success: function (response) {
                $('#lista-likes-dislikes-views .listas').html('');
                let { usernamesDislikes, fullnameDislikes} = response;
                for (let i = 0; i < usernamesDislikes.length; i++) {
                    $('#lista-likes-dislikes-views .listas').append(`
                    <li>
                        <div>
                            ${usernamesDislikes[i].charAt(0).toUpperCase()}
                        </div>
                        <a href="profile/${usernamesDislikes[i]}">
                            <p>
                                ${fullnameDislikes[i]}
                            </p>
                        </a>
                    </li>
                    `)
                }
            }
        });
    })

    $('#lista-likes-dislikes-views').on('click','.pestaña-like',function(e){

        $(this).siblings('.pestaña-dislike').css({
            'border' : 'none'
        })
    
        $(this).css({
            'border-bottom': '2px solid gray'
        })

        let pathPublicacion = document.getElementById('lista-likes-dislikes-views').dataset.publicacion;

        $('#lista-likes-dislikes-views .listas').html('<img src="/img/preloader.gif">');

        $.ajax({
            type: "GET",
            url: `/inicio/${pathPublicacion}/listalikes`,
            success: function (response) {
                $('#lista-likes-dislikes-views .listas').html('');
                let { usernamesLikes, fullnameLikes} = response;
                for (let i = 0; i < usernamesLikes.length; i++) {
                    $('#lista-likes-dislikes-views .listas').append(`
                    <li>
                        <div>
                            ${usernamesLikes[i].charAt(0).toUpperCase()}
                        </div>
                        <a href="profile/${usernamesLikes[i]}">
                            <p>
                                ${fullnameLikes[i]}
                            </p>
                        </a>
                    </li>
                    `)
                }
            }
        });
    })

    $('#lista-likes-dislikes-views').on('click','#cerrar-lista-likes-dislikes-views',function (e) {
        $('#lista-likes-dislikes-views').fadeOut();
        document.getElementById('lista-likes-dislikes-views').dataset.publicacion= 'nulo';
    })

});