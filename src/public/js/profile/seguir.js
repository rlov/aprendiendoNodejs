const btnSeguir = $('#btn-seguir');

let siguiendo = $('#btn-seguir').data('siguiendo'),
    username = $('#btn-seguir').data('username');

btnSeguir.click((e) => {

    /**
     * Haremos una petición AJAX y le mandaremos el data-username
     */

    if (siguiendo) {
        $.ajax({
            type: "POST",
            url: `/profile/${username}/notfollow`,
            data: {
                username
            },
            success: function (response) {
                btnSeguir.html('<i class="fas fa-heart"></i>&nbsp;Follow');
            }
        });
        siguiendo = false;
        
    }
    else {
        $.ajax({
            type: "POST",
            url: `/profile/${username}/follow`,
            data: {
                username
            },
            success: function (response) {
                btnSeguir.html('<i class="fab fa-strava"></i>&nbsp;Following')
            }
        });
        siguiendo = true;
    }
})