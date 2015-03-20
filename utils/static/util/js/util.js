/**
 * @fileoverview Utilities for Metis-Project.
 * @author yl871804@gmail.com (Lang-Chi Yu)
 */

Util = function() {

    /**
     * consts
     */
    var OK_ICON_URL_ = '/static/util/img/OK.gif';
    var ERROR_ICON_URL_ = '/static/util/img/error.gif';
    var LOADING_ICON_URL_ = '/static/util/img/loading.gif';
    var ResponseStatus_ = Object.freeze({

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
    });

    /**
     * private methods
     */
    var getCookie_ = function(name) {
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

    var sendNotification_ = function(msg) {
        alert(msg);
    };

    var lengthCheck_ = function(
        toCheck, content, min, max, opt_errorHandler) {

        opt_errorHandler = (typeof opt_errorHandler == "undefined")
            ? checkFailedDefault_ : opt_errorHandler;

        var result = true;
        if (content.length < min) {
            opt_errorHandler(toCheck, "至少"+min+"個字符");
            result = false;
        } else if (content.length > max) {
            opt_errorHandler(toCheck, "至多"+max+"個字符");
            result = false;
        }
        return result;
    };

    var checkFailedDefault_ = function(toCheck, errorMessage) {
        statusError_($("#"+toCheck+"_error"), errorMessage);
    };

    var formShowError_ = function(obj) {
        obj.effect("highlight", {color: "red"}, 3000);
    }

    var statusOk_ = function(okSpan, msg) {
        okSpan.html("<img src='"+OK_ICON_URL_+"'>");
        okSpan.append(msg);
    };

    var statusLoading_ = function(loadingSpan) {
        loadingSpan.html("<img src='"+LOADING_ICON_URL_+"'>");
    };

    var statusError_ = function(errorSpan, msg) {
        errorSpan.html("<img src='"+ERROR_ICON_URL_+"' />");
        errorSpan.append(msg);
    };

    var buttonDefault_ = function(f) {
        function wrapper() {
            e = arguments[0];

            e.preventDefault();
            $(this).attr("disabled");
            $(this).hide();

            f($(this));

            $(this).removeAttr("disabled");
            $(this).show();
        }

        return wrapper;
    }

    /**
     * @serializeObject_ Transform form data to hash
     * @author http://stackoverflow.com/a/1186309 (Tobias Cohen)
     */
    var serializeObject_ = function(rawData) {
        var o = {};
        var a = rawData.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    /**
     * interface
     */
    return {

        /**
         * properties
         */
        OK_ICON_URL: OK_ICON_URL_,
        ERROR_ICON_URL: ERROR_ICON_URL_,
        LOADING_ICON_URL: LOADING_ICON_URL_,
        ResponseStatus: ResponseStatus_,

        /**
         * public methods
         */
        getCookie: getCookie_,
        sendNotification: sendNotification_,
        lengthCheck: lengthCheck_,
        formShowError: formShowError_,
        statusOk: statusOk_,
        statusLoading: statusLoading_,
        statusError: statusError_,
        buttonDefault: buttonDefault_,
        serializeObject: serializeObject_,
        init: function() {
            $(".dialog").css("display", "inline");
        },
    };
} ();
