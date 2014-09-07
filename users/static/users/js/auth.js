/**
 * ModuleName    [ Auth ]
 * Synopsis      [ Front-end methods and constants for Django Authentication System ]
 * Author        [ OckhamsRazor (yl871804@gmail.com) ]
*/

Auth = function() {
    /* consts */
    var __login_url = '/users/login/';
    var __logout_url = '/users/logout/';
    var __signup_url = '/users/signup/';
    var __existence_check_url = '/users/check/';

    /* private methods */
    var _offer_login = function () {
        $("#login_form").dialog("open");
        $('.ui-widget-overlay').click(function() {
            _close_login();
        });
    };

    var _offer_logout = function() {
        $.ajax({
            data: {
                'csrfmiddlewaretoken': Util.get_cookie('csrftoken'),
            },
            datatype: 'text',
            success: function(data, textStatus, XMLHttpRequest) {
                if (data.result != Util.Response_status.SUCCESSFUL) {
                    Util.send_notification("出了點錯！");
                }
                window.location.reload();
            },
            error: function() {
                Util.send_notification("出了點錯！");
            },
            type: 'POST',
            url: __logout_url,
        });
    };

    var _close_login = function() {
        $("#login_form input").val('');
        $("#login_form").dialog("close");
        $(".ui-widget-overlay").unbind("click");
    };

    var _login_success = function(data, textStatus, XMLHttpRequest) {
        _close_login();
        if (data) {
            switch (data.result) {
                case Util.Response_status.SUCCESSFUL:
                    break;
                case Util.Response_status.AUTH_FAILED:
                    Util.send_notification(
                        "使用者帳號或密碼錯誤。"
                    );
                    break;
                case Util.Response_status.INACTIVE:
                    Util.send_notification(
                        "這個帳號已被停權，請與客服人員聯絡。"
                    );
                    break;
                case Util.Response_status.EXPIRED:
                    Util.send_notification(
                        "您未在有效期限內活化您的帳號。\n"
                        +"請註冊新帳號，只要其他人還未使用，您可以用相同的帳號註冊。"
                    );
                    break;
                case Util.Response_status.UNACTIVATED:
                    Util.send_notification(
                        "此帳號尚未被活化。\n"
                        +"請到您註冊時用的信箱收認證信，依照信中指示活化您的帳號。\n"
                        +"帳號活化後客服人員會審核您的身份，請耐心等候，\n"
                        +"對於您的不便，Metis深感抱歉！"
                    );
                    break;
                default:
                    Util.send_notification(
                        "登入失敗，原因未知。\n"
                        +"請聯絡客服人員。"
                    );
            }
        } else {
            Util.send_notification(
                "登入失敗，原因未知。\n"
                +"請聯絡客服人員。"
            );
        }
        window.location.reload();
    };

    var _login = function() {
        $("#login_form").dialog("close");
        $.ajax({
            data: $("#login_form").serialize(),
            datatype: 'text',
            success: _login_success,
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.responseText);
                Util.send_notification("出了點錯！");
                window.location.reload();
            },
            type: 'POST',
            url: __login_url,
        });
    };

    var _offer_sign_up = function() {
        _close_login();
        $("#sign_up_form").dialog("open");
    };

    var _login_dialog = function() {
        $("#login_form").dialog({
            autoOpen: false,
            height: 300,
            width: 450,
            modal: true,
            buttons: {
                '登入': _login,
                '忘記密碼': function() {
                    Util.send_notification("請聯絡客服人員。");
                },
                '註冊': _offer_sign_up,
            },
        });
    };

    var _sign_up_submit = function() {
        $("#sign_up_form .form_field_error").html("");

        var omitted = false;
        $("#sign_up_form .required_field").each(function(idx) {
            if ($(this).val().length == 0) {
                omitted = true;
                Util.status_error($(this).next("span"), "這一欄是必須的！");
                Util.form_show_error($(this).parent());
            }
        });
        if (omitted) return;

        if (!_sign_up_dialog_username(false)) {
            Util.form_show_error($("#username_signup").parent());
            return;
        }
        if (!_sign_up_dialog_password()) {
            Util.form_show_error($("#password_signup").parent());
            return;
        }
        if (!_sign_up_dialog_password_confirm()) {
            Util.form_show_error($("#password_confirm").parent());
            return;
        }
        if (!_sign_up_dialog_email(false)) {
            Util.form_show_error($("#email").parent());
            return;
        }

        $.ajax({
            data: $("#sign_up_form").serialize(),
            datatype: 'text',
            success: function(data, textStatus, XMLHttpRequest) {
                if (textStatus != "success") {
                    alert("註冊失敗。請重試，或聯絡客服人員。");
                } else if (data.result == Util.Response_status.FORM_INVALID) {
                    alert("註冊失敗：表單錯誤");
                } else {
                    Util.send_notification(
                        "Thanks for joining Counselsior! "+
                        "Please activate your account with your email "+
                        "within three days."
                    );
                }
                _sign_up_close(false);
                window.location.reload();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                // console.log(XMLHttpRequest.responseText);
                Util.send_notification("出了點錯！");
                window.location.reload();
            },
            type: 'POST',
            url: __signup_url,
        });
    };

    var _sign_up_reset = function() {
        var reset = confirm("確定要清空表單？");
        if (reset) {
            $("#sign_up_form input").val('');
            $(".form_field_error").html('');
        }
    };

    var _sign_up_close = function(toConfirm) {
        toConfirm = (typeof toConfirm == "undefined") ? true : toConfirm;

        var close = true;
        if (toConfirm)
            close = confirm("確定要取消註冊程序？");

        if (close) {
            $("#sign_up_form input").val('');
            $(".form_field_error").html('');
            return true;
        }
        else return false;
    };

    var _sign_up_dialog = function() {
        $("#sign_up_form").dialog({
            autoOpen: false,
            height: 600,
            width: 450,
            modal: true,
            beforeClose: _sign_up_close,
            buttons: {
                '送出': _sign_up_submit,
                '重填': _sign_up_reset,
            },
        });

        $("#sign_up_form .required_field").blur(function() {
            var content = $(this).val();
            if (content.length == 0) {
                Util.status_error($(this).next("span"), "這一欄是必須的！");
            }
        });

        $("#sign_up_form .required_field").focus(function() {
            var error = $(this).next("span").text();
            if (error == "這一欄是必須的！") {
                $(this).next("span").html('');
            }
        });

        $("#username_signup").change(_sign_up_dialog_username);
        $("#password_signup").change(_sign_up_dialog_password);
        $("#password_confirm").change(_sign_up_dialog_password_confirm);
        $("#email").change(_sign_up_dialog_email);
    };

    var _sign_up_dialog_username = function(async) {
        async = (typeof async == "undefined") ? true : async;
        var username = $("#username_signup").val();
        if (Util.length_check("username", username, 4, 30)) {
            return _sign_up_dialog_existence_check('username', username, "可用", "此帳號已有人使用", async);
        }
        else return false;
    };

    var _sign_up_dialog_password = function() {
        var password = $("#password_signup").val();
        if (Util.length_check("password", password, 8, 128)) {
            Util.status_OK($("#password_error"), "OK");
            return true;
        }
        else return false;
    };

    var _sign_up_dialog_password_confirm = function() {
        var password = $("#password_signup").val();
        var password_confirm = $("#password_confirm").val();
        if (Util.length_check("password_confirm", password_confirm, 8, 128)) {
            if (password != password_confirm) {
                Util.status_error($("#password_confirm_error"), "與密碼不符");
                return false;
            } else {
                Util.status_OK($("#password_confirm_error"), "OK");
                return true;
            }
        }
        else return false;
    };

    var _sign_up_dialog_email = function(async) {
        async = (typeof async == "undefined") ? true : async;
        var email = $("#email").val();
        var email_regex = /^[^@]+@[^@]+\.[^@]+$/;
        if (_sign_up_dialog_regex_check("email", email, email_regex)) {
            return _sign_up_dialog_existence_check("email", email, "可用", "此信箱已有人使用", async);
        }
        else return false;
    };

    var _sign_up_dialog_regex_check = function(to_check, content, regex) {
        var result = true;
        if (content.match(regex) == null) {
            Util.status_error($("#"+to_check+"_error"), "無效的"+to_check+"格式");
            result = false;
        }
        return result;
    };

    var _sign_up_dialog_existence_check = function(to_check, content, ack, nak, async) {
        var result = false;
        async = (typeof async == "undefined") ? true : async;
        var checking_span = $("#"+to_check+"_error");
        Util.status_loading(checking_span);
        $.ajax({
            async: async,
            data: {
                'to_check': to_check,
                'content': content,
                'csrfmiddlewaretoken': Util.get_cookie('csrftoken'),
            },
            datatype: 'text',
            success: function(data, textStatus, XMLHttpRequest) {
                if (textStatus != "success") {
                    Util.status_error(checking_span, "出了點錯！");
                } else if (data.result == Util.Response_status.FAILED) {
                    Util.status_OK($("#"+to_check+"_error"), ack);
                    result = true;
                } else {
                    Util.status_error($("#"+to_check+"_error"), nak);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.responseText);
                Util.status_error(checking_span, "出了點錯！");
                return false;
            },
            type: 'POST',
            url: __existence_check_url,
        });

        return result;
    };

    /* interface */
    return {
        /* properties */

        /* public methods */
        init: function() {
            _login_dialog();
            _sign_up_dialog();
            $("#log_in_button").click(_offer_login);
            $("#log_out_button").click(_offer_logout);
            $("#signup_button").click(_offer_sign_up);

            $(".dialog").css("display", "block");
        },
    };
} ();
