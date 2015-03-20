/**
 * @fileoverview Wiki Post-related issues.
 * @author yl871804@gmail.com (Lang-Chi Yu)
 */

Posts = function() {

    /**
     * variables
     */
    var numEntries_;
    var postFormValidationRules_;
    var postFormValidationSettings_;

    /**
     * consts
     */
    var CREATE_POST_URL = "/wiki/create_post/";
    var SAVE_TEMPLATE_AS_URL = "/wiki/save_template_as/";
    var EntryTypeName_ = Object.freeze({
        CHOICE: "Choice",
        DBL: "Real Number",
        STR: "Text", // no need to validate
        MAIL: "Email Address",
        URL: "Link",
        GPS: "Position",
        DATETIME: "Date/Time",
        COLOR: "Color",
    });

    /**
     * class methods
     */

    var setPostForm_ = function() {
        $("#new_post_form").form(
            postFormValidationRules_,
            postFormValidationSettings_
        );
    };

    var onEntryTypeChange_ = function(val) {
        var idx = $(this).children("input").attr("name")
                          .match(/(\d+)_type/)[1];
        var content = $("#new_post_"+idx+" .entry_content");
        content.attr("class", "field entry_content");
        switch(val) {
            case EntryTypeName_.DBL:
                content.html(
                    "<div class='ui input'>"+
                        "<input type='text' name='"+idx+"_content' />"+
                    "</div>"
                );
                postFormValidationRules_[idx+"_content"] = {
                    identifier: idx+"_content",
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Please enter the content.'
                        },
                        {
                            type: 'number',
                            prompt: 'Invalid Number!'
                        }
                    ]
                };
                setPostForm_();
                break;
            case EntryTypeName_.MAIL:
                content.html(
                    "<div class='ui input'>"+
                        "<input type='text' name='"+idx+"_content' />"+
                    "</div>"
                );
                postFormValidationRules_[idx+"_content"] = {
                    identifier: idx+"_content",
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Please enter the content.'
                        },
                        {
                            type: 'email',
                            prompt: 'Invalid Email Address!'
                        }
                    ]
                };
                setPostForm_();
                break;
            case EntryTypeName_.URL:
                content.html(
                    "<div class='ui input'>"+
                        "<input type='text' name='"+idx+"_content' />"+
                    "</div>"
                );
                postFormValidationRules_[idx+"_content"] = {
                    identifier: idx+"_content",
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Please enter the content.'
                        },
                    ]
                };
                setPostForm_();
                break;
            case EntryTypeName_.STR:
            default:
                content.html("<textarea name='"+idx+"_content' />");
                break;
        }
    };

    var addEntry_ = function() {
        numEntries_ += 1;
        var idx = numEntries_.toString();
        var newDivId = "new_post_"+idx;

        $("#new_post_form").append(
            "<div id='"+newDivId+"' class='three fields'></div>"
        );
        $("#"+newDivId).append(
            "<div class='ui dividing header'></div>"+
            "<div class='field entry_header'>"+
                "<div class='field'>"+
                    "<div class='ui input'>"+
                        "<input type='text' placeholder='Name'"+
                        " name='"+idx+"_name' />"+
                    "</div>"+
                "</div>"+
                "<div class='field'>"+
                    "<div class='ui selection dropdown entry_type'>"+
                        "<input type='hidden' name='"+idx+"_type' />"+
                        "<div class='default text'>Type</div>"+
                        "<i class='dropdown icon'></i>"+
                        "<div class='menu'></div>"+
                    "</div>"+
                "</div>"+
            "</div>"
        );
        for (type in EntryTypeName_) {
            $("#"+newDivId+" .menu").append(
                "<div class='item' data-value='"+EntryTypeName_[type]+
                "'>"+EntryTypeName_[type]+"</div>"
            );
        }
        $("#"+newDivId+" .entry_type").dropdown({
            onChange: onEntryTypeChange_
        });

        $("#"+newDivId).append(
            "<div class='field entry_content'></div>"+
            "<div class='field entry_options'>"+
                "<div class='ui negative button delete_entry_button'>"+
                    "Delete"+
                "</div>"+
            "</div>"
        );
        $("#"+newDivId+" .delete_entry_button")
            .click(Util.buttonDefault(deleteEntry_));

        postFormValidationRules_[idx+"_name"] = {
            identifier: idx+"_name",
            rules: [
                {
                    type: 'empty',
                    prompt: 'Please enter the entry name.'
                }
            ]
        };
        postFormValidationRules_[idx+"_type"] = {
            identifier: idx+"_type",
            rules: [
                {
                    type: 'empty',
                    prompt: 'Please choose the data type.'
                }
            ]
        };
        setPostForm_();
    };

    var editEntry_ = function() {

    };

    var deleteEntry_ = function(button) {
        $("#"+button.parent().parent().attr("id")).remove();
        numEntries_ -= 1;
    };

    var submit_ = function() {
        var data = $("#new_post_form").serialize();
        $.ajax({

        });
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
        var formData = Util.serializeObject($("#new_post_form"));
        /*
            3/18 TODO
                Finish Template CRUD
        */

        console.log(formData);

        for (key in formData) {
            if (re = key.match(/^(\d+)_name$/)) {
                var idx = re[1];

            }
        }

        $(".save_template_as_modal.first")
            .modal("show")
        ;
    };

    var buttonSettings_ = function() {
        $("#template_setting_button")
            .click(Util.buttonDefault(offerTemplateSetting_));
        $("#add_entry_button").click(Util.buttonDefault(addEntry_));
        $("#save_template_as_button")
            .click(Util.buttonDefault(offerSaveTemplateAs_));
        // $("#new_post_submit_button").click(function() {
        //     console.log($("#new_post_form").serialize());
        // });
    };

    var semanticUiInit_ = function() {
        $.fn.form.settings.rules["number"] = function(e) {
            return !isNaN(e);
        };
        setPostForm_();

        $(".save_template_as_modal.coupled.modal")
            .modal({
                allowMultiple: false
            })
        ;
        $(".save_template_as_modal.second")
            .modal(
                "attach events",
                ".save_template_as_modal.first .actions .primary"
            )
            .modal("setting", "transition", "horizontal flip")
        ;
        $(".save_template_as_modal.first")
            .modal("setting", "transition", "horizontal flip")
        ;

        $(".save_template_as_modal .checkbox")
            .checkbox()
        ;
    };

    /**
     * interface
     */
    return {

        /**
         * properties
         */
        getNumEntries: function() { return numEntries_; },
        getPostFormValidationRules: function() { return postFormValidationRules_; },
        /**
         * public methods
         */
        init: function() {
            buttonSettings_();
            numEntries_ = $("#new_post_form_body").length;
            postFormValidationRules_ = {
                title: {
                    identifier: "title",
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Please enter the title.'
                        }
                    ]
                }
            };
            postFormValidationSettings_ = {
                on: 'blur',
                inline: 'true'
            };
            semanticUiInit_();
        },
    };
} ();
