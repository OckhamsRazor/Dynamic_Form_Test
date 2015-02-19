/**
 * @fileoverview Wiki Post-related issues.
 * @author yl871804@gmail.com (Lang-Chi Yu)
 */

Posts = function() {

    /**
     * variables
     */
    var numEntries_ = 1;

    /**
     * consts
     */
    var CREATE_POST_URL = "/wiki/create_post/";
    var EntryTypeName_ = Object.freeze({
        NIL: "--",
        INT: "Integer",
        DBL: "Real Number",
        STR: "Text",
        MAIL: "Email Address",
        URL: "Link",
        GPS: "Position",
        DATETIME: "Date/Time"
    });

    /**
     * class methods
     */
    var onEntryTypeChange_ = function() {
        var div = $(this).parent().parent().parent().attr("id");
        var content = $("#"+div+" .entry_value");
        var idx = div.match(/new_post_(\d+)/)[1];
        var name = idx+"_content";
        alert($(this).val());
        switch($(this).val()) {
            case EntryTypeName_.NIL:
                alert("NIL");
                content.children().prop("readonly", "readonly");
                break;
            case EntryTypeName_.INT:
                alert("INT");
                content.html("<input type='text' name='"+name+"' />");
                content.append("<span id='"+name+"_error' class='form_field_error'></span>");
                // content.change();
                break;
            case EntryTypeName_.DBL:
                alert("DBL");
                content.html("<input type='text' name='"+idx+"_content' />");
                content.append("<span id='"+name+"_error' class='form_field_error'></span>");
                // content.change();
                break;
            case EntryTypeName_.STR:
            default:
                alert("DEF");
                content.html("<textarea rows='4' cols='50' name='"+idx+"_content' />");
                break;
        }
    };

    var addEntry_ = function(e) {
        numEntries_ += 1;
        var idx = numEntries_.toString();
        var newDivId = "new_post_"+idx;

        $("#new_post_form_body").append(
            "<div id='"+newDivId+"'></div>"
        );
        $("#"+newDivId).append(
            "<div class='entry_header'><div class='entry_name'></div><div class='entry_type'></div></div><div class='entry_value'></div><div class='entry_options'></div>"
        );

        $("#"+newDivId+" .entry_name").html(
            "<input type='text' name='"+idx+"_name' class='text' />"
        );
        $("#"+newDivId+" .entry_type").html("<select name='"+idx+"_type', function></select>");
        for (type in EntryTypeName_) {
            $("#"+newDivId+" .entry_type"+" select").append(
                "<option value='"+EntryTypeName_[type]+"'>"+EntryTypeName_[type]+"</option>"
            );
        }
        $("#"+newDivId+" .entry_type"+" select").change(onEntryTypeChange_);

        // $("#"+newDivId+" .entry_value").append(
            // "<textarea rows='4' cols='50' name='"+idx+"_content' />"
        // );

        // $("#"+newDivId+" .entry_options").html(
            // "<button type='button' class='edit_entry_button'>Edit</button>"
        // );
        $("#"+newDivId+" .entry_options").append(
            "<button type='button' class='delete_entry_button'>Delete</button>"
        );
        // $("#"+newDivId+" .edit_entry_button").click(Util.button_default(_edit_entry));

        $("#"+newDivId+" .delete_entry_button").click(Util.buttonDefault(deleteEntry_));
    };

    var editEntry_ = function() {

    };

    var deleteEntry_ = function(button) {
        $("#"+button.parent().parent().attr("id")).remove();
    };

    var offerTemplateSetting_ = function() {

    };

    var buttonSettings_ = function() {
        $("#template_setting_button").click(Util.buttonDefault(offerTemplateSetting_));
        $("#add_entry_button").click(Util.buttonDefault(addEntry_));
    };

    /**
     * interface
     */
    return {

        /**
         * properties
         */
        numEntries: numEntries_,

        /**
         * public methods
         */
        init: function() {
            buttonSettings_();
            numEntries_ = $("#new_post_form_body").length;
        },
    };
} ();
