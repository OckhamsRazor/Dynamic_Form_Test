"use strict"

$("#new_post_with_template_button").click(
    Util.buttonDefault(function() {
        $.ajax({
            data: {
                'csrfmiddlewaretoken': Util.getCookie("csrftoken"),
                'tid': $("#tid").val()
            },
            datatype: "text",
            success: function(data, textStatus, httpRequest) {
                var templateModalMain =
                    React.render(<TemplateModalMain
                        entries={data.template.entries} />,
                    document.getElementById(
                        "template_modal_1_content"
                    )
                );
                $(".template_modal.main .header")
                    .html("Template Editor")
                ;
                $(".template_modal.main .primary.button")
                    .html("Apply <i class='ui checkmark icon'></i>")
                ;

                $(".template_modal.main")
                    .modal({
                        closable: false,
                        selector: {
                            approve: ".actions .primary"
                        },
                        onApprove: function() {
                            Util.setSessionStorage(
                                "loadedTemplate", data.template.entries
                            );
                            document.location.href = Wiki.getUrl(
                                "NEW_POST_URL"
                            );
                        }
                    })
                    .modal("show")
                ;
            },
            error: function(httpRequest, textStatus, errorThrown) {
                window.document.write(httpRequest.responseText);
            },
            type: "POST",
            url: Posts.getUrl("READ_TEMPLATE_URL")
        });
    })
);
