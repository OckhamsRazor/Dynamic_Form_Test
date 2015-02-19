/**
 * @fileoverview Administrator tools.
 * @author yl871804@gmail.com (Lang-Chi Yu)
 */

Admin = function() {

    /**
     * consts
     */
    var GENERATE_USER_URL_ = '/users/generate_user/';

    /**
     * private methods
     */
    var generateUser_ = function() {
        var people = $("#people").val();
        if (people == '' || parseInt(people) == NaN) {
            alert("Invalid input number of people!");
            return;
        }

        $.ajax({
            data: $("#user_generating_form").serialize(),
            datatype: "text",
            success: function(data, textStatus, XMLHttpRequest) {
                if (data.result == Util.ResponseStatus.SUCCESSFUL)
                    alert("SUCCESS creating users.");
                else
                    alert("ERROR creating users.");
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
                alert(textStatus+": "+errorThrown);
            },
            type: "POST",
            url: GENERATE_USER_URL_,
        });
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
            $("#user_generating_button").click(generateUser_);
        },
    };
} ();
