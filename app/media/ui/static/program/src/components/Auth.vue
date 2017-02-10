<template>
    <div class="pure-menu pure-menu-horizontal">
        <a href="#" class="pure-menu-heading pure-menu-link">MEDIA SERVER</a>
        <ul class="pure-menu-list">
            <li class="pure-menu-item"><a href="/feed" class="pure-menu-link">Feed</a></li>
            <li class="pure-menu-item"><a href="/chat" class="pure-menu-link">Chat</a></li>
            <li class="pure-menu-item"><a href="/media" class="pure-menu-link">Media Gallery</a></li>
        </ul>
        <!-- {% block userlogin %} -->
        <form class="pure-form">
            <fieldset>
                <input type="text" placeholder="username">
                <input type="password" placeholder="password">

                <label for="remember">
                    <input id="remember" type="checkbox"> Remember Me
                </label>

                <button type="submit" class="pure-button pure-button-primary">Sign in</button>
            </fieldset>

            {% csrf_token %}
        </form>
    </div>
</template>

<template>
    <div class="pure-g">
        <div class="pure-u-1-2">
            <form class="pure-form pure-form-aligned">
                <div class="info">
                    Please enter the following information below.
                </div>

                <div class="success hidden">
                    Your account was created successfully.
                </div>

                <div class="error hidden">
                </div>

                <fieldset>
                    <div class="pure-control-group">
                        <label for="name">Username</label>
                        <input id="name" type="text" placeholder="Username">
                    </div>

                    <div class="pure-control-group">
                        <label for="name">Display Name</label>
                        <input id="first-name" type="text" placeholder="First Name">
                        <input id="last-name" type="text" placeholder="Surname">
                    </div>

                    <div class="pure-control-group">
                        <label for="country">Country of Residence</label>
                        <select id="country">
                            {% for country in view.countries %}
                            <option value="{{ country }}">{{ country }}</option>
                            {% endfor %}
                        </select>
                    </div>

                    <div class="pure-control-group">
                        <label for="password">Password</label>
                        <input id="password" type="password" placeholder="Password">
                    </div>

                    <div class="pure-control-group">
                        <label for="retype-password">Re-type Password</label>
                        <input id="retype-password" type="password" placeholder="Password">
                    </div>

                    <div class="pure-control-group">
                        <label for="email">Email Address</label>
                        <input id="email" type="email" placeholder="Email Address">
                    </div>

                    <div class="pure-control-group">
                        <label>I wish to subscribe to the mailing list</label>
                        <input id="cb" type="checkbox"> 
                    </div>

                    <div class="pure-control-group">
                        <button type="submit" class="pure-button pure-button-primary">Submit</button>
                    </div>

                </fieldset>
            </form>
        </div>
    </div>
</template>

<script>

 $registerButton = $('.pure-form :submit');
 $registerButton.click(function(e) {
     e.preventDefault();
     createAccount();
 });

 function createAccount() {
     // Send a request with decoded json data parsed from the form
     var data = getFormData('.register-form');

     // TODO use fetch() polyfill
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
</script>
