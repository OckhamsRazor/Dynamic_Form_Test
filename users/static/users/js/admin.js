/**
 * ModuleName    [ Admin ]
 * Synopsis      [ Administrator tools ]
 * Author        [ OckhamsRazor (yl871804@gmail.com) ]
*/

Admin = function() {
    /* consts */
    var __generate_user_url = '/users/generate_user/';

    /* private methods */
    var _generate_user = function() {
        var people = $("#people").val();
        if (people == '' || parseInt(people) == NaN) {
            alert("Invalid input number of people!");
            return;
        }

        $.ajax({
            data: $("#user_generating_form").serialize(),
            datatype: "text",
            success: function(data, textStatus, XMLHttpRequest) {
                if (data.result == 'success')
                    alert("SUCCESS creating users.");
                else if (data.result == 'failed')
                    alert("ERROR creating users: " + data.reason);
                else
                    alert("ERROR no result.");
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
                alert(textStatus+": "+errorThrown);
            },
            type: "POST",
            url: __generate_user_url,
        });
    };

    /* interface */
    return {
        /* properties */

        /* public methods */
        init: function() {
            $("#user_generating_button").click(_generate_user);
        },
    };
} ();
