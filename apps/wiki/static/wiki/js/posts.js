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

    /**
     * consts
     */
    var PostUrls_ = Object.freeze({
        CREATE_POST_URL: "/wiki/create_post/",
        SAVE_TEMPLATE_AS_URL: "/wiki/save_template_as/",
        TEMPLATE_TITLE_EXISTS_URL: "/wiki/template_title_exists/",
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

    };

    /* CREATE */
    var saveTemplateAs_ = function() {

    };

    var offerSaveTemplateAs_ = function() {
        /*
            3/18 TODO
                Finish Template CRUD
        */

        $(".save_template_as_modal.first")
            .modal("show")
        ;
    };

    var buttonSettings_ = function() {
        $("#template_setting_button")
            .click(Util.buttonDefault(offerTemplateSetting_))
        ;
    };

    var semanticUiInit_ = function() {
        $.fn.form.settings.rules["number"] = function(e) {
            return !isNaN(e);
        };

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
                entryEditorValidationRules_,
                entryEditorValidationSettings_
            )
        ;
        $("#entry_editor .dropdown")
            .dropdown({
                onChange: onEntryEditorTypeChange_
            })
        ;

        $(".save_template_as_modal.main")
            .modal({
                closable: false,
                selector: {
                    approve: ".actions .primary"
                }
            })
            .modal("setting", "transition", "horizontal flip")
        ;

        $("#template_title_form")
            .form(
                {
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
                {
                    inline: true
                }
            )
        ;
    };

    var onEntryEditorTypeChange_ = function(newType) {
        saveTemplateAsModalEditRemoveError_();
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

    var saveTemplateAsModalEditRemoveError_ = function() {
        $("#entry_editor .prompt").each(function() {
            $(this).remove();
        });
        $("#entry_editor .error").each(function() {
            $(this).removeClass("error");
        });
    };

    var saveTemplateAsModalTitleRemoveError_ = function() {
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
        getUrl: function(name) { return PostUrls_[name]; },
        postFormValidationRules: postFormValidationRules_,
        postFormValidationSettings: postFormValidationSettings_,
        entryEditorValidationRules: entryEditorValidationRules_,
        entryEditorValidationSettings: entryEditorValidationSettings_,
        newPostEntries: newPostEntries_,

        /**
         * public methods
         */
        init: function() {
            buttonSettings_();
            semanticUiInit_();
        },
        onEntryEditorTypeChange: onEntryEditorTypeChange_,
        saveTemplateAsModalEditRemoveError:
            saveTemplateAsModalEditRemoveError_,
        saveTemplateAsModalTitleRemoveError:
            saveTemplateAsModalTitleRemoveError_
    };
} ();
