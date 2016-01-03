/**
 * @fileoverview Front-end methods and constants for
 *      Django Authentication System
 * @author yl871804@gmail.com (Lang-Chi Yu)
 */

Auth = function() {

    /**
     * consts
     */
    var LOGIN_URL_ = '/users/login/';
    var LOGOUT_URL_ = '/users/logout/';
    var SIGNUP_URL_ = '/users/signup/';
    var EXISTENCE_CHECK_URL_ = '/users/check/';

    /**
     * private methods
     */
    var offerLogin_ = function () {
        $('#login_form').dialog('open');
        $('.ui-widget-overlay').click(function() {
            closeLogin_();
        });
    };

    var offerLogout_ = function() {
        $.ajax({
            data: {
                'csrfmiddlewaretoken': Util.getCookie('csrftoken'),
            },
            datatype: 'text',
            success: function(data, textStatus, XMLHttpRequest) {
                if (data.result != Util.ResponseStatus.SUCCESSFUL) {
                    Util.sendNotification(
                        'ERROR',
                        '出了點錯！',
                        true,
                        function() { window.location.reload(); }
                    );
                } else {
                    window.location.reload();
                }
            },
            error: function() {
                Util.sendNotification(
                    'ERROR',
                    '出了點錯！',
                    true,
                    function() { window.location.reload(); }
                );
            },
            type: 'POST',
            url: LOGOUT_URL_,
        });
    };

    var closeLogin_ = function() {
        $('#login_form input').val('');
        $('#login_form').dialog('close');
        $('.ui-widget-overlay').unbind('click');
    };

    var loginSuccess_ = function(data, textStatus, XMLHttpRequest) {
        closeLogin_();
        if (data) {
            switch (data.result) {
                case Util.ResponseStatus.SUCCESSFUL:
                    window.location.reload();
                    break;
                case Util.ResponseStatus.AUTH_FAILED:
                    Util.sendNotification(
                        'ERROR',
                        '使用者帳號或密碼錯誤。',
                        true,
                        function() { window.location.reload(); }
                    );
                    break;
                case Util.ResponseStatus.INACTIVE:
                    Util.sendNotification(
                        'ERROR',
                        '這個帳號已被停權，請與客服人員聯絡。',
                        true,
                        function() { window.location.reload(); }
                    );
                    break;
                case Util.ResponseStatus.EXPIRED:
                    Util.sendNotification(
                        'ERROR',
                        '您未在有效期限內活化您的帳號。\n'
                        +'請註冊新帳號，只要其他人還未使用，您可以用相同的帳號註冊。',
                        true,
                        function() { window.location.reload(); }
                    );
                    break;
                case Util.ResponseStatus.UNACTIVATED:
                    Util.sendNotification(
                        'ERROR',
                        '此帳號尚未被活化。\n'
                        +'請到您註冊時用的信箱收認證信，依照信中指示活化您的帳號。\n'
                        +'帳號活化後客服人員會審核您的身份，請耐心等候，\n'
                        +'對於您的不便，Metis深感抱歉！',
                        true,
                        function() { window.location.reload(); }
                    );
                    break;
                default:
                    Util.sendNotification(
                        'ERROR',
                        '登入失敗，原因未知。\n'
                        +'請聯絡客服人員。',
                        true,
                        function() { window.location.reload(); }
                    );
            }
        } else {
            Util.sendNotification(
                'ERROR',
                '登入失敗，原因未知。\n'
                +'請聯絡客服人員。',
                true,
                function() { window.location.reload(); }
            );
        }
    };

    var login_ = function() {
        $('#login_form').dialog('close');
        $.ajax({
            data: $('#login_form').serialize(),
            datatype: 'text',
            success: loginSuccess_,
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                // console.log(XMLHttpRequest.responseText);
                window.document.write(XMLHttpRequest.responseText);
                Util.sendNotification(
                    'ERROR','出了點錯！'
                );
                // window.location.reload();
            },
            type: 'POST',
            url: LOGIN_URL_,
        });
    };

    var offerSignUp_ = function() {
        closeLogin_();
        $('#sign_up_form').dialog('open');
    };

    var loginDialog_ = function() {
        $('#login_form').dialog({
            autoOpen: false,
            height: 300,
            width: 450,
            modal: true,
            buttons: {
                '登入': login_,
                '忘記密碼': function() {
                    Util.sendNotification(
                        'ERROR',
                        '請聯絡客服人員。'
                    );
                },
                '註冊': offerSignUp_,
            },
        });
    };

    var signUpSubmit_ = function() {
        $('#sign_up_form .form_field_error').html('');

        var omitted = false;
        $('#sign_up_form .required_field').each(function(idx) {
            if ($(this).val().length == 0) {
                omitted = true;
                Util.statusError($(this).next('span'), '這一欄是必須的！');
                Util.formShowError($(this).parent());
            }
        });
        if (omitted) return;

        if (!signUpDialogUsername_(false)) {
            Util.formShowError($("#username_signup").parent());
            return;
        }
        if (!signUpDialogPassword_()) {
            Util.formShowError($("#password_signup").parent());
            return;
        }
        if (!signUpDialogPasswordConfirm_()) {
            Util.formShowError($("#password_confirm").parent());
            return;
        }
        if (!signUpDialogEmail_(false)) {
            Util.formShowError($("#email").parent());
            return;
        }

        $.ajax({
            data: $("#sign_up_form").serialize(),
            datatype: 'text',
            success: function(data, textStatus, XMLHttpRequest) {
                if (textStatus != "success") {
                    alert("註冊失敗。請重試，或聯絡客服人員。");
                } else if (data.result == Util.ResponseStatus.FORM_INVALID) {
                    alert("註冊失敗：表單錯誤");
                } else {
                    Util.sendNotification(
                        'SUCCESS',
                        "Thanks for joining Counselsior! "+
                        "Please activate your account with your email "+
                        "within three days."
                    );
                }
                signUpClose_(false);
                window.location.reload();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                // console.log(XMLHttpRequest.responseText);
                Util.sendNotification('ERROR',"出了點錯！");
                window.location.reload();
            },
            type: 'POST',
            url: SIGNUP_URL_,
        });
    };

    var signUpReset_ = function() {
        var reset = confirm("確定要清空表單？");
        if (reset) {
            $("#sign_up_form input").val('');
            $(".form_field_error").html('');
        }
    };

    var signUpClose_ = function(opt_toConfirm) {
        opt_toConfirm = (typeof opt_toConfirm == "undefined") ? true : opt_toConfirm;

        var close = true;
        if (opt_toConfirm)
            close = confirm("確定要取消註冊程序？");

        if (close) {
            $("#sign_up_form input").val('');
            $(".form_field_error").html('');
            return true;
        }
        else return false;
    };

    var signUpDialog_ = function() {
        $("#sign_up_form").dialog({
            autoOpen: false,
            height: 600,
            width: 450,
            modal: true,
            beforeClose: signUpClose_,
            buttons: {
                '送出': signUpSubmit_,
                '重填': signUpReset_,
            },
        });

        $('#sign_up_form .required_field').blur(function() {
            var content = $(this).val();
            if (content.length == 0) {
                Util.statusError($(this).next('span'), '這一欄是必須的！');
            }
        });

        $('#sign_up_form .required_field').focus(function() {
            var error = $(this).next('span').text();
            if (error == '這一欄是必須的！') {
                $(this).next("span").html('');
            }
        });

        $('#username_signup').change(signUpDialogUsername_);
        $('#password_signup').change(signUpDialogPassword_);
        $('#password_confirm').change(signUpDialogPasswordConfirm_);
        $('#email').change(signUpDialogEmail_);
    };

    var signUpDialogUsername_ = function(opt_async) {
        opt_async = (typeof opt_async == "undefined") ? true : opt_async;
        var username = $("#username_signup").val();
        if (Util.lengthCheck("username", username, 4, 30)) {
            return signUpDialogExistenceCheck_('username', username, "可用", "此帳號已有人使用", opt_async);
        }
        else return false;
    };

    var signUpDialogPassword_ = function() {
        var password = $("#password_signup").val();
        if (Util.lengthCheck("password", password, 8, 128)) {
            Util.statusOk($("#password_error"), "OK");
            return true;
        }
        else return false;
    };

    var signUpDialogPasswordConfirm_ = function() {
        var password = $("#password_signup").val();
        var passwordConfirm = $("#password_confirm").val();
        if (Util.lengthCheck("password_confirm", passwordConfirm, 8, 128)) {
            if (password != passwordConfirm) {
                Util.statusError($("#password_confirm_error"), "與密碼不符");
                return false;
            } else {
                Util.statusOk($("#password_confirm_error"), "OK");
                return true;
            }
        }
        else return false;
    };

    var signUpDialogEmail_ = function(opt_async) {
        opt_async = (typeof opt_async == "undefined") ? true : opt_async;
        var email = $("#email").val();
        var emailRegex = /^[^@]+@[^@]+\.[^@]+$/; // TODO
        if (signUpDialogRegexCheck_("email", email, emailRegex)) {
            return signUpDialogExistenceCheck_(
                "email", email, "可用", "此信箱已有人使用", opt_async
            );
        }
        else return false;
    };

    var signUpDialogRegexCheck_ = function(toCheck, content, regex) {
        var result = true;
        if (content.match(regex) == null) {
            Util.statusError($("#"+toCheck+"_error"), "無效的"+toCheck+"格式");
            result = false;
        }
        return result;
    };

    var signUpDialogExistenceCheck_ = function(
        toCheck, content, ack, nak, opt_async) {
        opt_async = (typeof opt_async == "undefined") ? true : opt_async;
        var result = false;
        var checkingSpan = $("#"+toCheck+"_error");
        Util.statusLoading(checkingSpan);
        $.ajax({
            async: opt_async,
            data: {
                'to_check': toCheck,
                'content': content,
                'csrfmiddlewaretoken': Util.getCookie('csrftoken'),
            },
            datatype: 'text',
            success: function(data, textStatus, XMLHttpRequest) {
                if (textStatus != "success") {
                    Util.statusError(checkingSpan, "出了點錯！");
                } else if (data.result == Util.ResponseStatus.FAILED) {
                    Util.statusOk($("#"+toCheck+"_error"), ack);
                    result = true;
                } else {
                    Util.statusError($("#"+toCheck+"_error"), nak);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.responseText);
                Util.statusError(checkingSpan, "出了點錯！");
                return false;
            },
            type: 'POST',
            url: EXISTENCE_CHECK_URL_,
        });

        return result;
    };

    /**
     * interface
     */
    return {

        /**
         * properties
         */

        /**
         * public methods
         */
        init: function() {
            loginDialog_();
            signUpDialog_();
            $("#log_in_button").click(offerLogin_);
            $("#log_out_button").click(offerLogout_);
            $("#signup_button").click(offerSignUp_);

            $(".dialog").css("display", "block");
        },
    };
} ();
