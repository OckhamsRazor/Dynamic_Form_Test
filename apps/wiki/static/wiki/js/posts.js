/**
 * @fileoverview Wiki Post-related issues.
 * @author yl871804@gmail.com (Lang-Chi Yu)
 */

Posts = function() {

    /**
     * variables
     */
    var postFormValidationRules_ = {};
    var postFormValidationSettings_ = {};
    var entryEditorValidationRules_ = {};
    var entryEditorValidationSettings_ = {};

    var newPostEntries_ = [];
    var newPostForm_ = null; // <NewPostForm />
    var templateModalMain_ = null; // <TemplateModalMain />

    /**
     * consts
     */
    var PostUrls_ = Object.freeze({
        CREATE_POST_URL: "/wiki/create_post/",
        CREATE_TEMPLATE_URL: "/wiki/create_template/",
        READ_TEMPLATE_URL: "/wiki/read_template/",
        UPDATE_TEMPLATE_URL: "/wiki/update_template/",
        TEMPLATE_TITLE_EXISTS_URL: "/wiki/template_title_exists/",

        TEMPLATE_MAIN_URL: "/wiki/template/main/",
    });
    var EntryTypeName_ = Object.freeze({
        CHOICE: "Choice",
        DBL: "Real Number",
        STR: "Text",
        MAIL: "Email Address",
        URL: "Link",
        GPS: "Position",
        DATETIME: "Date/Time",
        COLOR: "Color",
    });
    var EntryTypeNameToEnum_ = Object.freeze({
        "Choice": 0,
        "Real Number": 10,
        "Text": 20,
        "Email Address": 21,
        "Link": 22,
        "Position": 30,
        "Date/Time": 40,
        "Color": 1
    });

    /**
     * class methods
     */

    var editEntry_ = function() {

    };

    var submit_ = function() {
        var data = $("#new_post_form").serialize();
        // $.ajax({

        // });
    };

    /* UPDATE, DELETE */
    var templateSetting_ = function() {

    };

    var offerTemplateSetting_ = function() {

    };

    /* READ */
    var changeTemplate_ = function() {
        Util.sendConfirm(
            "Warning",
            "Your post will be lost if you leave this page. Proceed?",
            function() {
                window.location.href = PostUrls_["TEMPLATE_MAIN_URL"];
            }
        );
    };

    var loadTemplate_ = function() {
        if (sessionStorage.loadedTemplate) {
            newPostForm_ = React.render(
                React.createElement(
                    NewPostForm, {
                        entries: Util.getSessionStorage("loadedTemplate")
                    }
                ),
                document.getElementById("new_post_form")
            );

            Util.delSessionStorage("loadedTemplate");
        } else {
            newPostForm_ = React.render(
                React.createElement(NewPostForm, null),
                document.getElementById("new_post_form")
            );
        }
    };

    /* CREATE */
    var saveTemplateAs_ = function(title, data) {
        $.ajax({
            data: {
                "csrfmiddlewaretoken": Util.getCookie("csrftoken"),
                "new_title": title
            },
            datatype: "text",
            success: function(ajaxData, textStatus, httpRequest) {
                if (ajaxData.title_exists) {
                    Util.sendConfirm(
                        "Title exists",
                        "Template with the title \""+title+"\" exists. "
                            +"Overwrite it?",
                        function() {
                            data["csrfmiddlewaretoken"]
                                = Util.getCookie("csrftoken");
                            $.ajax({
                                data: data,
                                datatype: "text",
                                success: function(d, status, req) {
                                    if (d.result
                                        == Util.ResponseStatus.SUCCESSFUL) {
                                        Util.sendNotification(
                                            "Success",
                                            "Template saved.",
                                            false,
                                            function() {
                                                window.location.reload();
                                            }
                                        )
                                    } else {
                                        Util.sendNotification(
                                            "Failed",
                                            "Something went wrong; your "+
                                            "template has not been saved.",
                                            false,
                                            function() {
                                                window.location.reload();
                                            }
                                        )
                                    }
                                },
                                error: function(req, status, err) {
                                    console.log(req.responseText);
                                },
                                type: "POST",
                                url: Posts.getUrl("UPDATE_TEMPLATE_URL")
                            });
                                }
                            );
                } else {
                    data["csrfmiddlewaretoken"] = Util.getCookie("csrftoken");
                    $.ajax({
                        data: data,
                        datatype: "text",
                        success: function(d, status, req) {
                            if (d.result
                                == Util.ResponseStatus.SUCCESSFUL) {
                                Util.sendNotification(
                                    "Success",
                                    "Template saved.",
                                    false,
                                    function() {
                                        window.location.reload();
                                    }
                                );
                            } else {
                                Util.sendNotification(
                                    "Failed",
                                    "Something went wrong; your template "
                                        +"has not been saved.",
                                    false,
                                    function() {
                                        window.location.reload();
                                    }
                                );
                            }
                        },
                        error: function(req, status, err) {
                            console.log(req.responseText);
                            Util.sendNotification(
                                "Failed",
                                "Something went wrong; your template "
                                    +"has not been saved.",
                                false,
                                function() {
                                    window.location.reload();
                                }
                            );
                        },
                        type: "POST",
                        url: PostUrls_["CREATE_TEMPLATE_URL"]
                    });
                }
            },
            error: function(httpRequest, textStatus, errorThrown) {
                console.log(httpRequest.responseText);
            },
            type: "POST",
            url: PostUrls_["TEMPLATE_TITLE_EXISTS_URL"]
        });
    };

    var offerSaveTemplateAs_ = function() {
        $(".template_modal.first")
            .modal("show")
        ;
    };

    var offerChangeTemplate_ = function() {
        // $("#confirm_modal")
        //     .modal("show")
        // ;
    };

    var buttonSettings_ = function() {
        $("#template_setting_button")
            .click(Util.buttonDefault(offerTemplateSetting_))
        ;
        $("#change_template_button")
            .click(Util.buttonDefault(changeTemplate_))
        ;
    };

    var semanticUiInit_ = function() {

        /**
         * customized form validation rules
         */
        $.fn.form.settings.rules["number"] = function(e) {
            return !isNaN(e);
        };

        /**
         * entry editor
         */
        for (var typeEnum in EntryTypeName_) {
            var type = EntryTypeName_[typeEnum];
            $("#entry_editor_type_menu")
                .append(
                    "<div class='item' data-value='"+type+"'>"
                        +type+
                    "</div>"
                )
            ;
        }
        entryEditorValidationRules_["entry_editor_name"] = {
            identifier: "entry_editor_name",
            rules: [
                {
                    type: 'empty',
                    prompt: 'Please enter the entry name.'
                },
            ]
        };
        entryEditorValidationRules_["entry_editor_type"] = {
            identifier: "entry_editor_type",
            rules: [
                {
                    type: 'empty',
                    prompt: 'Please choose the entry type.'
                },
            ]
        };
        entryEditorValidationSettings_ = {
            // on: 'blur',
            fields: entryEditorValidationRules_,
            inline: 'true',
            onSuccess: function() {
                return true;
            },
            onFailure: function() {
                return false;
            }
        };
        $("#entry_editor")
            .form(
                // entryEditorValidationRules_,
                entryEditorValidationSettings_
            )
        ;
        $("#entry_editor .dropdown")
            .dropdown({
                onChange: onEntryEditorTypeChange_
            })
        ;

        /**
         * template modal(s)
         */
        $(".template_modal.main")
            .modal({
                // allowMultiple: true,
                closable: false,
                selector: {
                    approve: ".actions .primary"
                }
            })
            // .modal("setting", "transition", "scale")
        ;

        $("#template_title_form")
            .form({
                fields: {
                    title: {
                        identifier: "template_title_value",
                        rules: [
                            {
                                type: "empty",
                                prompt: "Please enter the template name."
                            }
                        ]
                    }
                },
                inline: true
            })
        ;

        /**
         * choice editor
         */
        $(".choice_modal.edit")

    };

    var onEntryEditorTypeChange_ = function(newType) {
        // saveTemplateAsModalEditRemoveError_();
        $("#entry_editor .selection .prompt").each(function() {
            $(this).remove();
        });
        $("#entry_editor .selection .error").each(function() {
            $(this).removeClass("error");
        });

        switch(newType) {
            case EntryTypeName_.DBL:
                entryEditorValidationRules_["entry_editor_value"] = {
                    identifier: "entry_editor_value",
                    rules: [
                        {
                           type: 'number',
                           prompt: "Invalid Number!"
                        }
                    ]
                };
                break;
            case EntryTypeName_.MAIL:
                entryEditorValidationRules_["entry_editor_value"] =
                {
                    identifier: "entry_editor_value",
                    rules: [
                        {
                            type: 'email',
                            prompt: "Invalid Email Address!"
                        }
                    ]
                };
                break;
            case EntryTypeName_.URL:
            default:
                entryEditorValidationRules_["entry_editor_value"] = undefined;
                break;
        }
        $("#entry_editor")
            .form(
                entryEditorValidationRules_,
                entryEditorValidationSettings_
            )
        ;
    };

    var templateModalEditRemoveError_ = function() {
        $("#entry_editor .prompt").each(function() {
            $(this).remove();
        });
        $("#entry_editor .error").each(function() {
            $(this).removeClass("error");
        });
    };

    var templateModalTitleRemoveError_ = function() {
        $("#template_title_form .prompt").each(function() {
            $(this).remove();
        });
        $("#template_title_form .error").each(function() {
            $(this).removeClass("error");
        });
    };

    /**
     * interface
     */
    return {

        /**
         * properties
         */
        getEntryTypeName: function() { return EntryTypeName_; },
        getEntryTypeNameToEnum: function() { return EntryTypeNameToEnum_; },
        getUrl: function(name) { return PostUrls_[name]; },
        postFormValidationRules: postFormValidationRules_,
        postFormValidationSettings: postFormValidationSettings_,
        entryEditorValidationRules: entryEditorValidationRules_,
        entryEditorValidationSettings: entryEditorValidationSettings_,
        newPostEntries: newPostEntries_,

        getNewPostForm: function() { return newPostForm_; },
        setNewPostForm: function(newForm) { newPostForm_ = newForm; },
        getTemplateModalMain: function() { return templateModalMain_; },
        setTemplateModalMain: function(tModalMain) {
            templateModalMain_ = tModalMain;
        },

        /**
         * public methods
         */
        init: function() {
            newPostForm_ = null;

            buttonSettings_();
            semanticUiInit_();
        },
        onEntryEditorTypeChange: onEntryEditorTypeChange_,
        templateModalEditRemoveError:
            templateModalEditRemoveError_,
        templateModalTitleRemoveError:
            templateModalTitleRemoveError_,
        saveTemplateAs: saveTemplateAs_,
        loadTemplate: loadTemplate_,
    };
} ();
