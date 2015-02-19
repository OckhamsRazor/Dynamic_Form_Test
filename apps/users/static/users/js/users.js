/**
 * @fileoverview For user settings AFTER log-in; used with module Auth.
 * @author yl871804@gmail.com (Lang-Chi Yu)
 */

Users = function() {
    var jcrop_;

    /**
     * consts
     */
    var UPLOAD_PROFILE_PIC_URL_ = '/users/upload_profile_pic/';
    var CROP_PROFILE_PIC_URL_ = '/users/crop_profile_pic/';
    var CHANGE_PROFILE_PIC_URL_ = '/users/change_profile_pic';
    var DELETE_PROFILE_PIC_URL_ = 'users/delete_profile_pics';
    var SHOW_PROFILE_PICS_URL_ = '/users/show_profile_pics/';
    var CHANGE_PASSWORD_URL_ = '/users/change_password/';
    var VALID_PROFILE_PIC_IMAGE_TYPE_ = [
        "image/jpeg",
        "image/gif",
        "image/png"
    ];
    var MAX_PROFILE_PIC_IMAGE_SIZE_ = 10485760;
    var PROFILE_PIC_DEFAULT_WIDTH_ = 150;
    var PROFILE_PIC_RESIZING_WIDTH_ = 400;
    var PROFILE_PIC_RESIZING_WIDTH_MIN_ = 30;
    var PROFILE_PIC_RESIZING_DIALOG_WIDTH_
        = PROFILE_PIC_RESIZING_WIDTH_ + 20;

    /**
     * private methods
     */
    var fileValidation_ = function(id, opt_maxSize, opt_types) {
        opt_maxSize = (typeof opt_maxSize == "undefined") ?
                  MAX_PROFILE_PIC_IMAGE_SIZE_ :
                  opt_max_size;
        opt_types = (typeof opt_types == "undefined") ?
                VALID_PROFILE_PIC_IMAGE_TYPE_ :
                opt_types;

        var file = document.getElementById(id).files[0];
        if (!file) {
            alert("未選擇檔案！");
            return;
        }
        if (file.size > opt_maxSize) {
            alert("檔案過大！(限20MB以下)");
            return;
        }
        if (opt_types.indexOf(file.type) == -1) {
            alert("大頭貼只能使用: JPG, GIF, 或PNG檔"); // TODO: Too specific!
            return;
        }

        return file;
    };

    var profilePicUpload_ = function() {
        var newProfilePic = fileValidation_("new_avatar");
        if (!newProfilePic) {
            return;
        }

        var data = new FormData();
        data.append('csrfmiddlewaretoken', Util.getCookie('csrftoken'));
        data.append('profile_pic', newProfilePic);

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
                        if (data.result ==
                            Util.ResponseStatus.SUCCESSFUL) {
                            var profilePic = $("#user_avatar");
                            profilePic.attr("src", "");
                            profilePic.load(function() {
                                crop_(data.profile_pic_path);
                            });
                            profilePic.attr(
                                "src", data.profile_pic_path);
                        } else if (data.result ==
                            Util.ResponseStatus.FAILED)
                            alert("上傳失敗！");
                        break;
                    default:
                        alert("喔不！出了點錯！");
                        // document.write(this.response);
                        break;
                }
            }
        };
        xhr.open('POST', UPLOAD_PROFILE_PIC_URL_, true);
        xhr.send(data);
    };

    var userProfilePicResizeDialog_ = function() {
        $("#user_avatar_resize").dialog({
            autoOpen: false,
            width: PROFILE_PIC_RESIZING_DIALOG_WIDTH_,
            modal: true,
            beforeClose: userProfilePicResizeClose_,
            buttons: {
                '切圖': userProfilePicResizeDone_,
                '保持原樣': function() {
                    $("#user_avatar_resize").dialog("close");
                },
            },
        });
    };

    var crop_ = function(profilePicPath) {
        if (typeof jcrop_ != "undefined") {
            jcrop_.destroy();
        }

        var resizingImg =
            window.document.getElementById("user_avatar_resize_img");
        $(resizingImg).attr("src", "");
        $(resizingImg).load(function() {
            var originalW = resizingImg.width;
            var originalH = resizingImg.height;
            if (originalW > originalH) {
                resizingImg.width = PROFILE_PIC_RESIZING_WIDTH_;
                resizingImg.height =
                    originalH*PROFILE_PIC_RESIZING_WIDTH_/originalW;
            }
            else {
                resizingImg.height = PROFILE_PIC_RESIZING_WIDTH_;
                resizingImg.width =
                    original_w*PROFILE_PIC_RESIZING_WIDTH_/original_h;
            }

            $(resizingImg).Jcrop({
                aspectRatio: 1,
                minSize: [PROFILE_PIC_RESIZING_WIDTH_MIN_,
                    PROFILE_PIC_RESIZING_WIDTH_],
                setSelect: [
                    PROFILE_PIC_RESIZING_WIDTH_/2 -
                        PROFILE_PIC_RESIZING_WIDTH_MIN_/2,
                    PROFILE_PIC_RESIZING_WIDTH_/2 -
                        PROFILE_PIC_RESIZING_WIDTH_MIN_/2,
                    PROFILE_PIC_RESIZING_WIDTH_/2 +
                        PROFILE_PIC_RESIZING_WIDTH_MIN_/2,
                    PROFILE_PIC_RESIZING_WIDTH_/2 +
                        PROFILE_PIC_RESIZING_WIDTH_MIN_/2,
                ],
            }, function() {
                jcrop_ = this;
            });

            $("#user_avatar_resize").dialog("open");
        });

        $(resizingImg).attr("src", profilePicPath);
    };

    var userProfilePicResizeDone_ = function() {
        var imgWidth = $("#user_avatar_resize_img").css("width");
        var imgHeight = $("#user_avatar_resize_img").css("height");
        var originalImgInfo = {
            "csrfmiddlewaretoken": Util.getCookie('csrftoken'),
            "img_width": parseInt(imgWidth),
            "img_height": parseInt(imgHeight),
        };
        var cropInfo = jcrop_.tellSelect();

        $.ajax({
            data: $.extend({}, originalImgInfo, cropInfo),
            datatype: 'text',
            success: function(data, textStatus, XMLHttpRequest) {
                if (data.result == Util.ResponseStatus.FAILED) {
                    alert("切圖失敗");
                }
                window.location.reload();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                window.location.reload();
            },
            type: 'POST',
            url: CROP_PROFILE_PIC_URL_,
        });
    };

    var userProfilePicResizeClose_ = function(opt_toConfirm) {
        opt_toConfirm = (typeof opt_toConfirm == "undefined") ?
                        true :
                        opt_toConfirm;

        var close = false;
        if (opt_toConfirm)
            close = confirm("確定不切圖？");

        if (close)
            window.location.reload();

        return close;
    };

    var offerChangePassword_ = function() {
        $("#change_password_form").dialog("open");
    };

    var changePasswordDialog_ = function() {
        $("#change_password_form").dialog({
            autoOpen: false,
            height: 400,
            width: 500,
            modal: true,
            beforeClose: changePasswordClose_,
            buttons: {
                '送出': changePasswordSubmit_,
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
                Util.statusError(
                    $(this).next("span"), "這一欄是必須的！");
            }
        });

        $("#change_password_form .required_field").focus(function() {
            var error = $(this).next("span").text();
            if (error == "這一欄是必須的！") {
                $(this).next("span").html('');
            }
        });

        $("#password_new").change(changePasswordDialogPasswordNew_);
        $("#password_new_confirm").
            change(changePasswordDialogPasswordNewConfirm_);
    };

    var changePasswordDialogPasswordNew_ = function() {
        var password = $("#password_new").val();
        if (Util.lengthCheck("password_new", password, 8, 128)) {
            Util.statusOk($("#password_new_error"), "OK");
            return true;
        }
        else return false;
    };

    var changePasswordDialogPasswordNewConfirm_ = function() {
        var password = $("#password_new").val();
        var passwordConfirm = $("#password_new_confirm").val();
        if (Util.lengthCheck(
                "password_new_confirm", passwordConfirm, 8, 128)) {
            if (password != passwordConfirm) {
                Util.statusError(
                    $("#password_new_confirm_error"), "與密碼不符！");
                return false;
            } else {
                Util.statusOk($("#password_new_confirm_error"), "OK");
                return true;
            }
        }
        else return false;
    };

    var changePasswordSubmit_ = function() {
        $("#change_password_form .form_field_error").html("");

        var omitted = false;
        $("#change_password_form .required_field").each(function(idx) {
            if ($(this).val().length == 0) {
                omitted = true;
                Util.statusError(
                    $(this).next("span"), "這一欄是必須的！");
                Util.formShowError($(this).parent());
            }
        });
        if (omitted) return;

        if (!changePasswordDialogPasswordNew_()) {
            Util.formShowError($("#password_new").parent());
            return;
        }
        if (!changePasswordDialogPasswordNewConfirm_()) {
            Util.formShowError($("#password_new_confirm").parent());
            return;
        }

        $.ajax({
            data: $("#change_password_form").serialize(),
            datatype: 'text',
            success: function(data, textStatus, XMLHttpRequest) {
                if (textStatus != "success") {
                    alert("更改密碼失敗：原因未知");
                } else if (data.result ==
                    Util.ResponseStatus.SUCCESSFUL) {
                    alert("更改密碼成功。");
                } else if (data.result ==
                    Util.ResponseStatus.FORM_INVALID) {
                    alert("更改密碼失敗：表單錯誤");
                } else if (data.result ==
                    Util.ResponseStatus.AUTH_FAILED) {
                    alert("更改密碼失敗：舊密碼錯誤");
                } else {
                    alert("更改密碼失敗：原因未知");
                }
                changePasswordClose_(false);
                window.location.reload();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.responseText);
                alert("FAILED");
                changePasswordClose_(false);
            },
            type: 'POST',
            url: CHANGE_PASSWORD_URL_,
        });
    };

    var changePasswordClose_ = function(opt_toConfirm) {
        opt_toConfirm = (typeof opt_toConfirm == "undefined") ?
                        true :
                        opt_toConfirm;

        var close = false;
        if (opt_toConfirm)
            close = confirm("取消更改密碼？");

        if (close) {
            $("#change_password_form input").val('');
            $(".form_field_error").html('');
            return true;
        }
        else return false;
    };

    var offerAdminInterface_ = function() {
        window.location.href = "/users/settings/admin";
    };

    var offerShowProfilePics_ = function() {
        window.location.href = SHOW_PROFILE_PICS_URL_;
    };

    var offerChangeProfilePic_ = function() {
        // alert("change!");
    };

    var offerDeleteProfilePics_ = function() {
        // alert("delete!");
    };

    var buttonSettings_ = function() {
        $("#change_password_button").click(offerChangePassword_);
        $("#new_avatar_button").click(profilePicUpload_);
        $("#admin_button").click(offerAdminInterface_);
        $("#show_profile_pics_button").click(offerShowProfilePics_);
        $("#change_profile_pic_button").click(offerChangeProfilePic_);
        $("#delete_profile_pics_button").click(offerDeleteProfilePics_);
    };

    var hrefSettings_ = function() {
        // $("#profile_pic_candidates img").click(function() {
        //     alert($(this).attr("src"));
        // });
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
            changePasswordDialog_();
            userProfilePicResizeDialog_();
            buttonSettings_();
            hrefSettings_();
        },
    };
} ();
