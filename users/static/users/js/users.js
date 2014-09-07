/**
 * ModuleName    [ Users ]
 * Synopsis      [ For user settings AFTER log-in; used with module Auth ]
 * Author        [ OckhamsRazor (yl871804@gmail.com) ]
*/

Users = function() {
    var _jcrop;

    /* consts */
    var __upload_avatar_url = '/users/upload_avatar/';
    var __crop_avatar_url = '/users/crop_avatar/';
    var __change_password_url = '/users/change_password/';
    var __valid_avatar_image_type = [
        "image/jpeg",
        "image/gif",
        "image/png"
    ];
    var __max_avatar_image_size = 10485760;
    var __avatar_default_width = 150;
    var __avatar_resizing_width = 400;
    var __avatar_resizing_width_min = 30;
    var __avatar_resizing_dialog_width
        = __avatar_resizing_width + 20;

    /* private methods */
    var _file_validation = function(id, max_size, types) {
        max_size = (typeof max_size == "undefined") ? __max_avatar_image_size : max_size;
        types = (typeof types == "undefined") ? __valid_avatar_image_type : types;

        var file = document.getElementById(id).files[0];
        if (!file) {
            alert("未選擇檔案！");
            return;
        }
        if (file.size > max_size) {
            alert("檔案過大！(限20MB以下)");
            return;
        }
        if (types.indexOf(file.type) == -1) {
            alert("大頭貼只能使用: JPG, GIF, 或PNG檔");
            return;
        }

        return file;
    };

    var _avatar_upload = function() {
        var new_avatar = _file_validation("new_avatar");
        if (!new_avatar) {
            return;
        }

        var data = new FormData();
        data.append('csrfmiddlewaretoken', Util.get_cookie('csrftoken'));
        data.append('profile_pic', new_avatar);

        var xhr = new XMLHttpRequest();
        xhr.file = data;
        /*
        if ( xhr.upload ) {
            xhr.upload.onprogress = function(e) {
                var done = e.position || e.loaded, total = e.totalSize || e.total;
                console.log('xhr.upload progress: ' + done + ' / ' + total + ' = ' + (Math.floor(done/total*1000)/10) + '%');
            };
        }
        */
        xhr.onreadystatechange = function(e) {
            if (this.readyState == 4) {
                switch (this.status) {
                    case 200:
                        data = JSON.parse(this.response);
                        if (data.result == Util.Response_status.SUCCESSFUL) {
                            var avatar = $("#user_avatar");
                            avatar.attr("src", "");
                            avatar.load(function() {
                                _crop(data.profile_pic_path);
                            });
                            avatar.attr("src", data.profile_pic_path);
                        } else if (data.result == Util.Response_status.FAILED)
                            alert("上傳失敗！");
                        break;
                    default:
                        alert("喔不！出了點錯！");
                        // document.write(this.response);
                        break;
                }
            }
        };
        xhr.open('POST', __upload_avatar_url, true);
        xhr.send(data);
    };

    var _user_avatar_resize_dialog = function() {
        $("#user_avatar_resize").dialog({
            autoOpen: false,
            width: __avatar_resizing_dialog_width,
            modal: true,
            beforeClose: _user_avatar_resize_close,
            buttons: {
                '切圖': _user_avatar_resize_done,
                '保持原樣': function() {
                    $("#user_avatar_resize").dialog("close");
                },
            },
        });
    };

    var _crop = function(avatar_path) {
        if (typeof _jcrop != "undefined") {
            _jcrop.destroy();
        }

        var resizing_img = window.document.getElementById("user_avatar_resize_img");
        $(resizing_img).attr("src", "");
        $(resizing_img).load(function() {
            var original_w = resizing_img.width;
            var original_h = resizing_img.height;
            if (original_w > original_h) {
                resizing_img.width = __avatar_resizing_width;
                resizing_img.height = original_h*__avatar_resizing_width/original_w;
            }
            else {
                resizing_img.height = __avatar_resizing_width;
                resizing_img.width = original_w*__avatar_resizing_width/original_h;
            }

            $(resizing_img).Jcrop({
                aspectRatio: 1,
                minSize: [__avatar_resizing_width_min, __avatar_resizing_width_min],
                setSelect: [
                    __avatar_resizing_width/2 - __avatar_resizing_width_min/2,
                    __avatar_resizing_width/2 - __avatar_resizing_width_min/2,
                    __avatar_resizing_width/2 + __avatar_resizing_width_min/2,
                    __avatar_resizing_width/2 + __avatar_resizing_width_min/2,
                ],
            }, function() {
                _jcrop = this;
            });

            $("#user_avatar_resize").dialog("open");
        });

        $(resizing_img).attr("src", avatar_path);
    };

    var _user_avatar_resize_done = function() {
        var img_width = $("#user_avatar_resize_img").css("width");
        var img_height = $("#user_avatar_resize_img").css("height");
        var original_img_info = {
            "csrfmiddlewaretoken": Util.get_cookie('csrftoken'),
            "img_width": parseInt(img_width),
            "img_height": parseInt(img_height),
        };
        var crop_info = _jcrop.tellSelect();

        $.ajax({
            data: $.extend({}, original_img_info, crop_info),
            datatype: 'text',
            success: function(data, textStatus, XMLHttpRequest) {
                if (data.result == Util.Response_status.FAILED) {
                    alert("切圖失敗");
                }
                window.location.reload();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                window.location.reload();
            },
            type: 'POST',
            url: __crop_avatar_url,
        });
    };

    var _user_avatar_resize_close = function(toConfirm) {
        toConfirm = (typeof toConfirm == "undefined") ? true : toConfirm;

        var close = false;
        if (toConfirm)
            close = confirm("確定不切圖？");

        if (close)
            window.location.reload();

        return close;
    };

    var _offer_change_password = function() {
        $("#change_password_form").dialog("open");
    };

    var _change_password_dialog = function() {
        $("#change_password_form").dialog({
            autoOpen: false,
            height: 400,
            width: 500,
            modal: true,
            beforeClose: _change_password_close,
            buttons: {
                '送出': _change_password_submit,
                '重填': function() {
                    if (confirm("清空表單？")) {
                        $("#change_password_form input").val('');
                        $(".form_field_error").html('');
                    }
                },
            },
        });

        $("#change_password_form .required_field").blur(function() {
            var content = $(this).val();
            if (content.length == 0) {
                Util.status_error($(this).next("span"), "這一欄是必須的！");
            }
        });

        $("#change_password_form .required_field").focus(function() {
            var error = $(this).next("span").text();
            if (error == "這一欄是必須的！") {
                $(this).next("span").html('');
            }
        });

        $("#password_new").change(_change_password_dialog_password_new);
        $("#password_new_confirm").change(_change_password_dialog_password_new_confirm);
    };

    var _change_password_dialog_password_new = function() {
        var password = $("#password_new").val();
        if (Util.length_check("password_new", password, 8, 128)) {
            Util.status_OK($("#password_new_error"), "OK");
            return true;
        }
        else return false;
    };

    var _change_password_dialog_password_new_confirm = function() {
        var password = $("#password_new").val();
        var password_confirm = $("#password_new_confirm").val();
        if (Util.length_check("password_new_confirm", password_confirm, 8, 128)) {
            if (password != password_confirm) {
                Util.status_error($("#password_new_confirm_error"), "與密碼不符！");
                return false;
            } else {
                Util.status_OK($("#password_new_confirm_error"), "OK");
                return true;
            }
        }
        else return false;
    };

    var _change_password_submit = function() {
        $("#change_password_form .form_field_error").html("");

        var omitted = false;
        $("#change_password_form .required_field").each(function(idx) {
            if ($(this).val().length == 0) {
                omitted = true;
                Util.status_error($(this).next("span"), "這一欄是必須的！");
                Util.form_show_error($(this).parent());
            }
        });
        if (omitted) return;

        if (!_change_password_dialog_password_new()) {
            Util.form_show_error($("#password_new").parent());
            return;
        }
        if (!_change_password_dialog_password_new_confirm()) {
            Util.form_show_error($("#password_new_confirm").parent());
            return;
        }

        $.ajax({
            data: $("#change_password_form").serialize(),
            datatype: 'text',
            success: function(data, textStatus, XMLHttpRequest) {
                if (textStatus != "success") {
                    alert("更改密碼失敗：原因未知");
                } else if (data.result == Util.Response_status.SUCCESSFUL) {
                    alert("更改密碼成功。");
                } else if (data.result == Util.Response_status.FORM_INVALID) {
                    alert("更改密碼失敗：表單錯誤");
                } else if (data.result == Util.Response_status.AUTH_FAILED) {
                    alert("更改密碼失敗：舊密碼錯誤");
                } else {
                    alert("更改密碼失敗：原因未知");
                }
                _change_password_close(false);
                window.location.reload();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.responseText);
                alert("FAILED");
                _change_password_close(false);
            },
            type: 'POST',
            url: __change_password_url,
        });
    };

    var _change_password_close = function(toConfirm) {
        toConfirm = (typeof toConfirm == "undefined") ? true : toConfirm;

        var close = false;
        if (toConfirm)
            close = confirm("取消更改密碼？");

        if (close) {
            $("#change_password_form input").val('');
            $(".form_field_error").html('');
            return true;
        }
        else return false;
    };

    var _offer_admin_interface = function() {
        window.location.href = "/users/settings/admin";
    };

    /* interface */
    return {
        /* properties */

        /* public methods */
        init: function() {
            _change_password_dialog();
            _user_avatar_resize_dialog();
            $("#change_password_button").click(_offer_change_password);
            $("#new_avatar_button").click(_avatar_upload);
            $("#admin_button").click(_offer_admin_interface);
        },
    };
} ();
