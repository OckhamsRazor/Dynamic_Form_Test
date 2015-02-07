/**
 * ModuleName    [ Posts ]
 * Synopsis      [ Wiki Post-related issues ]
 * Author        [ OckhamsRazor (yl871804@gmail.com) ]
*/

Posts = function() {

    /**
     * variables
    */

    var _num_entries = 1;

    /**
     * consts
    */

    var __create_post_url = "/wiki/create_post/";
    var __entry_types = {
        "nil": "--",
        "int": "Integer",
        "dbl": "Real Number",
        "str": "Text",
        "mail": "Email Address",
        "url": "Link",
        "gps": "Position",
        "datetime": "Date/Time"
    };

    /**
     * class methods
    */

    var _on_entry_type_change = function() {
        var div = $(this).parent().parent().parent().attr("id");
        var content = $("#"+div+" .entry_value");
        var idx = div.match(/new_post_(\d+)/)[1];
        switch($(this).val()) {
            case "nil":
                content.children().prop("readonly", "readonly");
                break;
            case "str":
            default:
                content.html("<textarea rows='4' cols='50' name='"+idx+"_content' />");
                break;
        }
    };

    var _add_entry = function(e) {
        _num_entries += 1;
        var idx = _num_entries.toString();
        var new_div_id = "new_post_"+idx;

        $("#new_post_form_body").append(
            "<div id='"+new_div_id+"'></div>"
        );
        $("#"+new_div_id).append(
            "<div class='entry_header'><div class='entry_name'></div><div class='entry_type'></div></div><div class='entry_value'></div><div class='entry_options'></div>"
        );

        $("#"+new_div_id+" .entry_name").html(
            "<input type='text' name='"+idx+"_name' class='text' />"
        );
        $("#"+new_div_id+" .entry_type").html("<select name='"+idx+"_type', function></select>");
        for (type in __entry_types) {
            $("#"+new_div_id+" .entry_type"+" select").append(
                "<option value='"+type+"'>"+__entry_types[type]+"</option>"
            );
        }
        $("#"+new_div_id+" .entry_type"+" select").change(_on_entry_type_change);

        // $("#"+new_div_id+" .entry_value").append(
            // "<textarea rows='4' cols='50' name='"+idx+"_content' />"
        // );

        // $("#"+new_div_id+" .entry_options").html(
            // "<button type='button' class='edit_entry_button'>Edit</button>"
        // );
        $("#"+new_div_id+" .entry_options").append(
            "<button type='button' class='delete_entry_button'>Delete</button>"
        );
        // $("#"+new_div_id+" .edit_entry_button").click(Util.button_default(_edit_entry));

        $("#"+new_div_id+" .delete_entry_button").click(Util.button_default(_delete_entry));
    };

    var _edit_entry = function() {

    };

    var _delete_entry = function(button) {
        $("#"+button.parent().parent().attr("id")).remove();
    };

    var _offer_template_setting = function() {

    };

    var _button_settings = function() {
        $("#template_setting_button").click(Util.button_default(_offer_template_setting));
        $("#add_entry_button").click(Util.button_default(_add_entry));
    };

    /**
     * interface
    */

    return {

        /**
         * properties
        */

        num_entries: _num_entries,

        /**
         * public methods
        */

        init: function() {
            _button_settings();
            _num_entries = $("#new_post_form_body").length;
        },
    };
} ();
