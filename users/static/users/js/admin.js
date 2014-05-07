function admin_init() {
    $("#user_generating_button").click(generate_user);
}

function generate_user() {
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
        url: "/users/generate_user/",
    });
}
