/**
 * ModuleName    [ Util ]
 * Synopsis      [ Global constants & JS utility functions for Metis-Project ]
 * Author        [ OckhamsRazor (yl871804@gmail.com) ]
*/

Util = function() {
    /* consts */
    var __OK_icon_url = '/static/util/img/OK.gif';
    var __error_icon_url = '/static/util/img/error.gif';
    var __loading_icon_url = '/static/util/img/loading.gif';

    var __response_status = {
        /**
         * general request response status code
        */
        SUCCESSFUL: 0,
        FAILED: 1000, // reason unknown; catch-all case
        FORM_INVALID: 1001,
        FORBIDDEN: 1403, // 403

        /**
         * user status code
        */
        ACTIVE: 2000,
        INACTIVE: 2001,
        EXPIRED: 2002,
        UNACTIVATED: 2003,
        AUTH_FAILED: 2999,
    };

    var _get_cookie = function(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    var _send_notification = function(msg) {
        alert(msg);
    };

    var _length_check = function(to_check, content, min, max) {
        var result = true;
        if (content.length < min) {
            _status_error($("#"+to_check+"_error"), "至少"+min+"個字符");
            result = false;
        } else if (content.length > max) {
            _status_error($("#"+to_check+"_error"), "至多"+max+"個字符");
            result = false;
        }
        return result;
    };

    var _form_show_error = function(obj) {
        obj.effect("highlight", {color: "red"}, 3000);
    }

    var _status_OK = function(OK_span, msg) {
        OK_span.html("<img src='"+__OK_icon_url+"'>");
        OK_span.append(msg);
    };

    var _status_loading = function(loading_span) {
        loading_span.html("<img src='"+__loading_icon_url+"'>");
    };

    var _status_error = function(error_span, msg) {
        error_span.html("<img src='"+__error_icon_url+"' />");
        error_span.append(msg);
    };

    /* interface */
    return {
        /* properties */
        OK_icon_url: __OK_icon_url,
        error_icon_url: __error_icon_url,
        loading_icon_url: __loading_icon_url,
        Response_status: __response_status,

        /* public methods */
        get_cookie: _get_cookie,
        send_notification: _send_notification,
        length_check: _length_check,
        form_show_error: _form_show_error,
        status_OK: _status_OK,
        status_loading: _status_loading,
        status_error: _status_error,
        init: function() {
            $(".dialog").css("display", "inline");
        },
    };
} ();
