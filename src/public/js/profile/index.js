
var $container = $('.galeria');
$container.imagesLoaded(function () {
    $container.masonry();
    document.querySelectorAll('.item-galeria').forEach((e) => {
        e.style.opacity = '1';
    });
});

var scrollRealizado;
window.addEventListener('scroll', () => {
    scrollRealizado = document.documentElement.scrollTop;
    if (scrollRealizado >= 200) {
        document.querySelector('.nav').style.position = 'fixed';
        if(document.body.classList.contains('dark')){
            document.querySelector('.nav').style.background = '#060818';
            document.querySelector('#logo a').style.color = '#888ea8';
            document.querySelector('.contenedor-input-nav form').style.backgroundColor = '#0e1726';
            document.querySelector('.contenedor-input-nav form').style.color = '#888ea8';
            document.querySelector('.contenedor-input-nav form').style.border = '1px solid rgba(81, 83, 101, 0.28)';
            document.querySelector('.contenedor-input-nav button').style.color = '#888ea8'
            $('button.btn-inicio a').css('color', '#888ea8');
            $('button.btn-perfil a').css('color','#888ea8');
            $('.contenedor-avatar-nav button').css('color','#888ea8');
            $('.contenedor-avatar-nav p').css('color','#888ea8');
        }
        else{
            document.querySelector('.nav').style.background = 'white';
            document.querySelector('#logo a').style.color = 'black';
            document.querySelector('.contenedor-input-nav form').style.backgroundColor = 'rgba(0,0,0,0.05)';
            $('button.btn-inicio a').css('color', 'black');
            $('button.btn-perfil a').css('color','black');
            $('.contenedor-avatar-nav button').css('color','black');
            $('.contenedor-avatar-nav p').css('color','black');
        }
    }
    else {
        document.querySelector('.nav').style.position = 'relative';
        document.querySelector('.nav').style.background = 'transparent';
        document.querySelector('#logo a').style.color = 'white';
        document.querySelector('.contenedor-input-nav form').style.backgroundColor = 'rgba(0,0,0,.5)';
        document.querySelector('.contenedor-input-nav form').style.border = 'none';
        $('button.btn-inicio a').css('color', 'white');
        $('button.btn-perfil a').css('color','white');
        $('.contenedor-avatar-nav button').css('color','white');
        $('.contenedor-avatar-nav p').css('color','white');

    }
})

const btnCambiarPortada = $('#cambiar-portada');
const formularioPortadaQuery = $('#form-portada');
const formularioPortadaJS = document.getElementById('form-portada');

btnCambiarPortada.click((e) => {
    $('#ventana-update-portada').fadeIn();
});

$('#cerrar-update-portada').click((e) => {
    $('#ventana-update-portada').fadeOut();
});

/**
 * PREVISUALIZACIÓN
 */
const inputPortada = document.getElementById('filePortada');
const portadaPreview = document.getElementById('portadaPreview');
const fondoPortada = document.getElementById('fondo-portada');

inputPortada.addEventListener('change', () => {
    const archivos = inputPortada.files;

    if (!archivos.length && !archivos) {
        return;
    }
    const imagen = archivos[0];

    const urlImagen = URL.createObjectURL(imagen);
    portadaPreview.setAttribute('src', urlImagen);
})


formularioPortadaQuery.submit((e) => {
    e.preventDefault();
    const username = btnCambiarPortada.data('username');
    const form = new FormData(formularioPortadaJS);

    e.preventDefault();
    fetch(`/profile/${username}/updatecover`, {
        method: 'POST',
        body: form
    }).then((response) => {
        return response.text();
    }).then((response) => {
        console.log(response);
        fondoPortada.setAttribute('src', response);
    });
    $('#ventana-update-portada').fadeOut();
})


/**
 * CAMBIANDO FOTO DE PERFIL
 */

const formularioAvatar = document.getElementById('form-avatar'),
        inputFileAvatar = document.getElementById('fileAvatar'),
        avatarPreview = document.querySelector('.preview-update-avatar .contenedor-imagen img'),
        btnUpdateAvatar = document.getElementById('btn-update-avatar'),
        contenedorAvatar = document.getElementById('contenedor-avatar');


$('#contenedor-portada').on('click','#btn-update-avatar',()=>{
    $('#modal-update-avatar').fadeIn();
})

inputFileAvatar.addEventListener('change',(e)=>{
    const archivos = inputFileAvatar.files;

    if(!archivos && !archivos.length){
        return
    }
    let imagen = archivos[0];
    const urlImagen = URL.createObjectURL(imagen);
    avatarPreview.setAttribute('src',urlImagen);
})

formularioAvatar.addEventListener('submit',(e)=>{
    e.preventDefault();
    let username = btnUpdateAvatar.dataset.username;
    const form = new FormData(formularioAvatar);
    fetch(`/profile/${username}/updateavatar`,{
        method: 'POST',
        body: form
    }).then((response) => {
        return response.text();
    }).then((response) => {
        /* contenedorAvatar.innerHTML = ''; */
        contenedorAvatar.style.backgroundColor = 'transparent';
        contenedorAvatar.innerHTML = `<img src="${response}">
        <div class="btn-update-avatar" id="btn-update-avatar" data-username= "${username}">
                        <i class="fas fa-pencil-alt"></i>
                    </div>
        `
        $('#modal-update-avatar').fadeOut();
    });
})



$('#btn-close-update-avatar').click((e)=>{
    $('#modal-update-avatar').fadeOut();
    avatarPreview.setAttribute('src',"/img/avatar5.jpg");
})


/**
 * HEADER DEL MAIN-GALERIA
 */

const btnMostrarDescripcionGaleria = $('#btn-galeria-mostrar-descripcion'),
    btnOcultarDescripcionGaleria = $('#btn-galeria-ocultar-description');

btnMostrarDescripcionGaleria.click(function (e){
    $(this).css('color','white');
    $(this).siblings().css('color','#888ea8')
    $(this).closest('h2').siblings('.galeria').find('.item-galeria img').css({
        'border-bottom-left-radius': '0px',
        'border-bottom-right-radius': '0px'
    })
    $(this).closest('h2').siblings('.galeria').find('.item-galeria').find('.contenedor-descripcion-item').css('display','block');
    $container.masonry();
})
btnOcultarDescripcionGaleria.click(function (e){
    $(this).css('color','white');
    $(this).siblings().css('color','#888ea8');
    $(this).closest('h2').siblings('.galeria').find('.item-galeria img').css('border-radius','10px');
    $(this).closest('h2').siblings('.galeria').find('.item-galeria').find('.contenedor-descripcion-item').css('display','none');
    $container.masonry();
})



/**
 * MOSTRAR PROFILE-FOLLOWERS
 */
const btnProfilePost = $('#btn-profile-post');


const btnProfileFollowers = $('#btn-about-followers'),
    galeriaProfile = $('#galeria-profile'),
    followersProfile = $('#followers-profile'),
    listaFollowers = document.getElementById('lista-followers-profile'),
    main = $('#main');

btnProfileFollowers.click((e) => {
    e.preventDefault();
    /* galeriaProfile.fadeOut(); */
    followingProfile.fadeOut();

    let username = $('#btn-about-followers').data('username');

    setTimeout(() => {
        followersProfile.fadeIn();
    }, 400)

    $.ajax({
        type: "GET",
        url: `/profile/${username}/followers`,
        success: function (response) {
            listaFollowers.innerHTML = '';
            let resultado = response.resultado,
                fecha = response.fecha;
            for (let i = 0; i < resultado.length; i++) {
                listaFollowers.innerHTML += `
                <a target="_blank" href= "/profile/${resultado[i].userSeguidor}">
                    <li><span class="username">${resultado[i].userSeguidor.charAt(0).toUpperCase()}</span>
                        <p>${resultado[i].userSeguidor}
                            <span class="time">${fecha[i]}</span>
                        </p>
                    </li>
                </a>`
            }
        }
    });
})

/**
 * MOSTRAR PROFILE-FOLLOWING
 */


const btnProfileFollowing = $('#btn-about-following'),
    followingProfile = $('#following-profile'),
    listaFollowing = document.getElementById('lista-following-profile');

btnProfileFollowing.click((e) => {
    e.preventDefault();
    /* galeriaProfile.fadeOut(); */
    followersProfile.fadeOut();
    let username = $('#btn-about-following').data('username');
    setTimeout(() => {
        followingProfile.fadeIn();
    }, 400)

    $.ajax({
        type: "GET",
        url: `/profile/${username}/following`,
        success: function (response) {
            listaFollowing.innerHTML = '';
            let resultado = response.resultado,
                fecha = response.fecha;
            for (let i = 0; i < resultado.length; i++) {
                listaFollowing.innerHTML += `
                <a target="_blank" href= "/profile/${resultado[i].userSiguiendo}">
                    <li><span class="username">${resultado[i].userSiguiendo.charAt(0).toUpperCase()}</span>
                    <p>${resultado[i].userSiguiendo}
                        <span class="time">${fecha[i]}</span>
                    </p>
                    </li>
                </a>`
            }
        }
    });
})


/**
 * ABOUT
 */

 $('.columna-informacion-general .biografia header').click(function(e){
    $(this).closest('.biografia').find('div').toggle('slow');
 })
 const $btnAboutProfile = $('#btn-profile-about');
        $seccionProfileAbout = $('#seccion-profile-about');

$btnAboutProfile.click(function(e){

    galeriaProfile.fadeOut();

    btnProfilePost.css('border','none');

    $btnAboutProfile.css('border-bottom', '2px solid white');

    $('#main').find('h2').html('INFORMACION');

     setTimeout(()=>{
         $seccionProfileAbout.css('display', 'flex');
            $("body,html").animate({
                scrollTop: "250px"
            },400);
     },400);
 })


 /**
  * ACTUALIZANDO INFORMACIÓN DEL ABOUT
  * 
  * 
  */
 $('.seccion-informacion .columna-informacion-personal > div').mouseover(function (e) { 
    $(this).css('height','180px')
});

$('.seccion-informacion .columna-informacion-personal > div').mouseleave(function (e) { 
    $(this).css('height','30px')
});


$('.columna-informacion-personal .btn-update-about').click(function(e){

    if(!$(this).hasClass('activo')){
        $(this).prev().fadeOut('fast');
        $(this).closest('div').css('height','200px');
        /* $(this).css('display','inline-block'); */
        $(this).siblings('.form-update-about').show();
        let texto = $(this).prev().text();
        if(texto.trim() == 'No hay información'){
            $(this).siblings('.form-update-about').find('input[type="text"]').val('');
        }
        else{
            $(this).siblings('.form-update-about').find('input[type="text"]').val(texto);
        }
        $(this).text('Cancelar');

    }
    else{
        $(this).prev().fadeIn();
        $(this).closest('div').css('height','30px');
/*         $(this).css('display','none'); */
        $(this).siblings('.form-update-about').fadeOut();
        $(this).html('<i class="far fa-edit"></i>');
    }

    $(this).toggleClass('activo');
})

$('.columna-informacion-general .btn-update-about').click(function(e){

    if(!$(this).hasClass('activo')){
        $(this).prev().fadeOut('fast');
        $(this).siblings('.form-update-about').show();
        $(this).text('Cancelar');
    }
    else{
        $(this).prev().fadeIn();
        $(this).siblings('.form-update-about').fadeOut();
        $(this).html('<i class="far fa-edit"></i>');
    }

    $(this).toggleClass('activo');
})


    //Ahora haremos peticiones ajax para cada formulario del about


$('#form-fullname').submit(function(e){
    e.preventDefault();
    let username = $(this).data('username');
    let name = $(this).find('.name').val();
    let lastname = $(this).find('.lastname').val();
    
    //Obteniendo el parrafo para llenarlo
    let parrafoFullname = $(this).siblings('.parrafo-fullname'),
        btnUpdate = $(this).siblings('.btn-update-about');

    $.ajax({
        type: "POST",
        url: `/about/${username}/fullname`,
        data: {
            username,
            name,
            lastname
        },
        success: function (response) {
            let { fullname } = response;
            parrafoFullname.text(fullname);
            
            $('#form-fullname').fadeOut();
            parrafoFullname.fadeIn();
            setTimeout(()=>{
                $('#form-fullname').closest('div').css('height','30px');
                btnUpdate.html('<i class="far fa-edit"></i>');

            },500)
            $('#form-fullname').siblings('.btn-update-about').removeClass('activo');
        }
    });
})

$('#form-home').submit(function(e){
    e.preventDefault();
    let username = $(this).data('username');
    let home = $(this).find('.home').val();

    //Obteniendo el parrafo para llenarlo
    let parrafoHome = $(this).siblings('.parrafo-home'),
        btnUpdate = $(this).siblings('.btn-update-about');

    let miData = {
        username,
        home
    }

    $.ajax({
        type: "POST",
        url: `/about/${username}/home`,
        data: miData,
        success: function (response) {
            let { home } = response;
            parrafoHome.text(home);
            
            $('#form-home').fadeOut();
            parrafoHome.fadeIn();
            setTimeout(()=>{
                $('#form-home').closest('div').css('height','30px');
                btnUpdate.html('<i class="far fa-edit"></i>');

            },500)
            $('#form-home').siblings('.btn-update-about').removeClass('activo');
        }
    });
})

$('#form-correo').submit(function(e){
    e.preventDefault();
    let username = $(this).data('username');
    let email = $(this).find('.correo').val();
    
    //Obteniendo el parrafo para llenarlo
    let parrafoCorreo = $(this).siblings('.parrafo-correo'),
        btnUpdate = $(this).siblings('.btn-update-about');

    $.ajax({
        type: "POST",
        url: `/about/${username}/email`,
        data: {
            username,
            email
        },
        success: function (response) {
            let { email } = response;
            parrafoCorreo.text(email);
            
            $('#form-correo').fadeOut();
            parrafoCorreo.fadeIn();
            setTimeout(()=>{
                $('#form-correo').closest('div').css('height','30px');
                btnUpdate.html('<i class="far fa-edit"></i>');

            },500)
            $('#form-correo').siblings('.btn-update-about').removeClass('activo');
        }
    });
}) 

$('#form-mobile').submit(function(e){
    e.preventDefault();
    let username = $(this).data('username');
    let mobile = $(this).find('.mobile').val();
    
    //Obteniendo el parrafo para llenarlo
    let parrafoMobile = $(this).siblings('.parrafo-mobile'),
        btnUpdate = $(this).siblings('.btn-update-about');

    $.ajax({
        type: "POST",
        url: `/about/${username}/mobile`,
        data: {
            username,
            mobile
        },
        success: function (response) {
            let { mobile } = response;
            parrafoMobile.text(mobile);
            
            $('#form-mobile').fadeOut();
            parrafoMobile.fadeIn();
            setTimeout(()=>{
                $('#form-mobile').closest('div').css('height','30px');
                btnUpdate.html('<i class="far fa-edit"></i>');

            },500)
            $('#form-mobile').siblings('.btn-update-about').removeClass('activo');
        }
    });
}) 

$('#form-ocupacion').submit(function(e){
    e.preventDefault();
    let username = $(this).data('username');
    let ocupacion = $(this).find('.ocupacion').val();
    
    //Obteniendo el parrafo para llenarlo
    let parrafoOcupacion = $(this).siblings('.parrafo-ocupacion'),
        btnUpdate = $(this).siblings('.btn-update-about');

    $.ajax({
        type: "POST",
        url: `/about/${username}/ocupacion`,
        data: {
            username,
            ocupacion
        },
        success: function (response) {
            let { ocupacion } = response;
            parrafoOcupacion.text(ocupacion);
            
            $('#form-ocupacion').fadeOut();
            parrafoOcupacion.fadeIn();
            setTimeout(()=>{
                $('#form-ocupacion').closest('div').css('height','30px');
                btnUpdate.html('<i class="far fa-edit"></i>');

            },500)
            $('#form-ocupacion').siblings('.btn-update-about').removeClass('activo');
        }
    });
}) 

$('#form-biografia').submit(function(e){
    e.preventDefault();
    let username = $(this).data('username');
    let biografia = $(this).find('.biografia').val();
    
    //Obteniendo el parrafo para llenarlo
    let parrafoBiografia = $(this).siblings('.parrafo-biografia'),
        btnUpdate = $(this).siblings('.btn-update-about');

    $.ajax({
        type: "POST",
        url: `/about/${username}/biografia`,
        data: {
            username,
            biografia
        },
        success: function (response) {
            let { biografia } = response;
            parrafoBiografia.text(biografia);
            
            $('#form-biografia').fadeOut();
            parrafoBiografia.fadeIn();
            setTimeout(()=>{
                btnUpdate.html('<i class="far fa-edit"></i>');

            },500)
            $('#form-biografia').siblings('.btn-update-about').removeClass('activo');
        }
    });
}) 

$('#form-hobbies').submit(function(e){
    e.preventDefault();
    let username = $(this).data('username');
    let hobbies = $(this).find('.hobbies').val();
    
    //Obteniendo el parrafo para llenarlo
    let parrafoHobbies = $(this).siblings('.parrafo-hobbies'),
        btnUpdate = $(this).siblings('.btn-update-about');

    $.ajax({
        type: "POST",
        url: `/about/${username}/hobbies`,
        data: {
            username,
            hobbies
        },
        success: function (response) {
            let { hobbies } = response;
            parrafoHobbies.text(hobbies);
            
            $('#form-hobbies').fadeOut();
            parrafoHobbies.fadeIn();
            setTimeout(()=>{
                btnUpdate.html('<i class="far fa-edit"></i>');

            },500)
            $('#form-hobbies').siblings('.btn-update-about').removeClass('activo');
        }
    });
})

$('#form-intereses').submit(function(e){
    e.preventDefault();
    let username = $(this).data('username');
    let intereses = $(this).find('.intereses').val();
    
    //Obteniendo el parrafo para llenarlo
    let parrafoIntereses = $(this).siblings('.parrafo-intereses'),
        btnUpdate = $(this).siblings('.btn-update-about');

    $.ajax({
        type: "POST",
        url: `/about/${username}/intereses`,
        data: {
            username,
            intereses
        },
        success: function (response) {
            let { intereses } = response;
            parrafoIntereses.text(intereses);
            
            $('#form-intereses').fadeOut();
            parrafoIntereses.fadeIn();
            setTimeout(()=>{
                btnUpdate.html('<i class="far fa-edit"></i>');

            },500)
            $('#form-intereses').siblings('.btn-update-about').removeClass('activo');
        }
    });
})

$('#form-educacion').submit(function(e){
    e.preventDefault();
    let username = $(this).data('username');
    let educacion = $(this).find('.educacion').val();
    
    //Obteniendo el parrafo para llenarlo
    let parrafoEducacion = $(this).siblings('.parrafo-educacion'),
        btnUpdate = $(this).siblings('.btn-update-about');

    $.ajax({
        type: "POST",
        url: `/about/${username}/educacion`,
        data: {
            username,
            educacion
        },
        success: function (response) {
            let { educacion } = response;
            parrafoEducacion.text(educacion);
            
            $('#form-educacion').fadeOut();
            parrafoEducacion.fadeIn();
            setTimeout(()=>{
                btnUpdate.html('<i class="far fa-edit"></i>');

            },500)
            $('#form-educacion').siblings('.btn-update-about').removeClass('activo');
        }
    });
})

$('#form-trabajo').submit(function(e){
    e.preventDefault();
    let username = $(this).data('username');
    let trabajo = $(this).find('.trabajo').val();
    
    //Obteniendo el parrafo para llenarlo
    let parrafoTrabajo = $(this).siblings('.parrafo-trabajo'),
        btnUpdate = $(this).siblings('.btn-update-about');

    $.ajax({
        type: "POST",
        url: `/about/${username}/trabajo`,
        data: {
            username,
            trabajo
        },
        success: function (response) {
            let { trabajo } = response;
            parrafoTrabajo.text(trabajo);
            
            $('#form-trabajo').fadeOut();
            parrafoTrabajo.fadeIn();
            setTimeout(()=>{
                btnUpdate.html('<i class="far fa-edit"></i>');

            },500)
            $('#form-trabajo').siblings('.btn-update-about').removeClass('activo');
        }
    });
})


