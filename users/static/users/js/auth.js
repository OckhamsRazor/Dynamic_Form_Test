function offer_login() {
    $("#login_form").dialog("open");
    $('.ui-widget-overlay').click(function() {
        close_login();
    });
}

function offer_logout() {
    var logout = confirm("Are you sure you want to log out?");
    if (logout) {
        $.ajax({
            data: {
                'csrfmiddlewaretoken': getCookie('csrftoken'),
            },
            datatype: 'text',
            success: function() { window.location.reload(); },
            type: 'POST',
            url: '/users/logout/',
        });
    }
}

function close_login() {
    $("#login_form input").val('');
    $("#login_form").dialog("close");
    $(".ui-widget-overlay").unbind("click");
}

function send_notification(msg) {
    alert(msg);
}

function login_success(data, textStatus, XMLHttpRequest) {
    if (data) {
        switch (data.result) {
            case "success":
                send_notification("You have successfully logged in");
                window.location.reload();
                break;
            case "not active":
            case "failure":
            default:
                send_notification(
                    "Your login was not successful."
                );
        }
    } else {
        send_notification(
            "Your login was not successful."
        );
    }
}

function login() {
    $("#login_form").dialog("close");
    $.ajax({
        data: $("#login_form").serialize(),
        datatype: 'text',
        success: login_success,
        type: 'POST',
        url: '/users/login/',
    });
}

function offer_sign_up() {
    close_login();
    $("#sign_up_form").dialog("open");
};

function login_dialog() {
    $("#login_form").dialog({
        autoOpen: false,
        height: 250,
        width: 350,
        modal: true,
        buttons: {
            'Log in': login,
            'Forgot password': function() {
                send_notification("This feature has not been implemented.");
            },
            'Sign up': offer_sign_up,
        },
    });
}

function form_show_error(obj) {
    obj.effect("highlight", {color: "red"}, 3000);
}

function sign_up_submit() {
    $(".form_field_error").html("");

    var omitted = false;
    $(".required_field").each(function(idx) {
        if ($(this).val().length == 0) {
            omitted = true;
            $(this).next("span").html("This field is required!");
            form_show_error($(this).parent());
        }
    });
    if (omitted) return;

    if (!sign_up_dialog_username(false)) {
        form_show_error($("#username_signup").parent());
        return;
    }
    if (!sign_up_dialog_password()) {
        form_show_error($("#password_signup").parent());
        return;
    }
    if (!sign_up_dialog_password_confirm()) {
        form_show_error($("#password_confirm").parent());
        return;
    }
    if (!sign_up_dialog_email(false)) {
        form_show_error($("#email").parent());
        return;
    }

    $.ajax({
        data: $("#sign_up_form").serialize(),
        datatype: 'text',
        success: function(data, textStatus, XMLHttpRequest) {
            if (data.result == 'failed') {
                if (data.reason == 'invalid form') {
                    alert("FAILED: Invalid Form");
                } else {
                    alert("FAILED anyway");
                }
            } else if (data.result == 'success') {
                alert("SUCCESS");
            }
            sign_up_close(false);
            window.location.reload();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.responseText);
        },
        type: 'POST',
        url: '/users/signup/',
    });
}

function sign_up_reset() {
    var reset = confirm("Do you really want to reset the form?");
    if (reset) {
        $("#sign_up_form input").val('');
        $(".form_field_error").html('');
    }
};

function sign_up_close(toConfirm) {
    toConfirm = (typeof toConfirm == "undefined") ? true : toConfirm;

    var close = true;
    if (toConfirm)
        close = confirm("Do you really want to cancel the signup progress?");

    if (close) {
        $("#sign_up_form input").val('');
        $(".form_field_error").html('');
        return true;
    }
    else return false;
}

function sign_up_dialog() {
    $("#sign_up_form").dialog({
        autoOpen: false,
        height: 600,
        width: 350,
        modal: true,
        beforeClose: sign_up_close,
        buttons: {
            'Submit': sign_up_submit,
            'Reset': sign_up_reset,
        },
    });

    $(".required_field").blur(function() {
        var content = $(this).val();
        if (content.length == 0) {
            $(this).next("span").html("This field is required!");
        }
    });

    $(".required_field").focus(function() {
        var error = $(this).next("span").text();
        if (error == "This field is required!") {
            $(this).next("span").html('');
        }
    });

    $("#username_signup").change(sign_up_dialog_username);
    $("#password_signup").change(sign_up_dialog_password);
    $("#password_confirm").change(sign_up_dialog_password_confirm);
    $("#email").change(sign_up_dialog_email);
}

function sign_up_dialog_username(async) {
    async = (typeof async == "undefined") ? true : async;
    var username = $("#username_signup").val();
    if (sign_up_dialog_length_check("username", username, 4, 30)) {
        return sign_up_dialog_existence_check('username', username, "Available", "Username already taken!", async);
    }
    else return false;
}

function sign_up_dialog_password() {
    var password = $("#password_signup").val();
    if (sign_up_dialog_length_check("password", password, 8, 128)) {
        $("#password_error").html("OK");
        return true;
    }
    else return false;
}

function sign_up_dialog_password_confirm() {
    var password = $("#password_signup").val();
    var password_confirm = $("#password_confirm").val();
    if (sign_up_dialog_length_check("password_confirm", password_confirm, 8, 128)) {
        if (password != password_confirm) {
            $("#password_confirm_error").html("Password match failed!");
            return false;
        } else {
            $("#password_confirm_error").html("OK");
            return true;
        }
    }
    else return false;
}

function sign_up_dialog_email(async) {
    async = (typeof async == "undefined") ? true : async;
    var email = $("#email").val();
    var email_regex = /^[^@]+@[^@]+\.[^@]+$/;
    if (sign_up_dialog_regex_check("email", email, email_regex)) {
        return sign_up_dialog_existence_check("email", email, "Available", "Email already taken!", async);
    }
    else return false;
}

function sign_up_dialog_length_check(to_check, content, min, max) {
    var result = true;
    if (content.length < min) {
        $("#"+to_check+"_error").html("Must be at least "+min+" letters!");
        result = false;
    } else if (content.length > max) {
        $("#"+to_check+"_error").html("Must be at most "+max+" letters!");
        result = false;
    }
    return result;
}

function sign_up_dialog_regex_check(to_check, content, regex) {
    var result = true;
    if (content.match(regex) == null) {
        $("#"+to_check+"_error").html("Invalid "+to_check+" format!");
        result = false;
    }
    return result;
}

function sign_up_dialog_existence_check(to_check, content, ack, nak, async) {
    var result = false;
    async = (typeof async == "undefined") ? true : async;
    $.ajax({
        async: async,
        data: {
            'to_check': to_check,
            'content': content,
            'csrfmiddlewaretoken': getCookie('csrftoken'),
        },
        datatype: 'text',
        success: function(data, textStatus, XMLHttpRequest) {
            if (!data.exist) {
                $("#"+to_check+"_error").html(ack);
                result = true;
            } else {
                $("#"+to_check+"_error").html(nak);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.responseText);
            return false;
        },
        type: 'POST',
        url: '/users/check/',
    });

    return result;
}

function account_activation() {
    var code = $("#activation_code").val();
    if (code.length != 30) {
        alert("Activation code must be a string with character length of 30.");
        return;
    }

    $.ajax({
        data: $("#account_activation_form").serialize(),
        datatype: "text",
        success: function(data, textStatus, XMLHttpRequest) {
            if (data.result == 'success') {
                alert("SUCCESS activating your account.");
                window.location.reload();
            }
            else if (data.result == 'failed')
                alert("ERROR activating your account: " + data.reason);
            else
                alert("ERROR no result.");
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            alert(textStatus+": "+errorThrown);
        },
        type: "POST",
        url: "/users/activate/",
    });
}
