$registerButton = $('.pure-form :submit');
$registerButton.click(function(e) {
    e.preventDefault();
    createAccount();
});

function createAccount() {
    // Send a request with decoded json data parsed from the form
    var data = getFormData('.register-form');

    $.ajax(API_ROOT + '/accounts/', {
        method: 'POST',
        data: {
            username: data.username,
            email: data.email,
            country: data.country,
            first_name: data.firstName,
            last_name: data.lastName,
            password: data.password
        },
        success: function(response) {
            $('.info').addClass('hidden');
            $('.success').removeClass('hidden');

            window.location.href = '/profile';
        },
        error: function(error) {
            $('.info').removeClass('hidden');

            var $register_error = $('.error');
            console.dir(error);
            $register_error.text('The account could not be created for the following reason: ' + error.responseJSON.detail);
            $register_error.removeClass('hidden');
        },
    });
}
