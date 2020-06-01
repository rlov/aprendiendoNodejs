$('#btn-notificaciones').click((e)=>{
    $('#ventana-notificaciones-nav').toggle();
})

$('#avatar-nav').click((e) => {
    $('#opciones-nav').toggle('slow')
})


/**
 * ALGORITMO PARA LA BÚSQUEDA
 */
let barraBusquedaNav = document.getElementById('barra-busqueda-nav');
let contenedorResultadosBusquedaNav = document.getElementById('resultado-busqueda-nav');

barraBusquedaNav.addEventListener('input',(e)=>{

    contenedorResultadosBusquedaNav.style.display = 'block';

    if(barraBusquedaNav.value == ''){
        contenedorResultadosBusquedaNav.style.display = 'none'
    }

    else{
        contenedorResultadosBusquedaNav.innerHTML = `<img src="/img/preloader.gif">`
        let busqueda = barraBusquedaNav.value
        $.ajax({
            type: 'GET',
            url: `/search/ajax/${busqueda}`,
            success: function (response) {
                let { fullnames } = response;
                setTimeout(()=>{
                    contenedorResultadosBusquedaNav.innerHTML = '';
                for(let i=0;i < fullnames.length;i++){
                    contenedorResultadosBusquedaNav.innerHTML += `
                    <li>
                        <a target="_blank" href="/profile/${fullnames[i].username}">
                            ${fullnames[i].fullname}
                        </a>
                    </li>
                    `
                }
                        if(fullnames.length ==  0){
                            contenedorResultadosBusquedaNav.innerHTML = `
                            <p>No results found</p>`
                        }
            },300)
            }
        });
    }
})