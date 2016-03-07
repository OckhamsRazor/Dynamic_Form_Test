"use strict"

$("#new_post_with_template_button").click(
    Util.buttonDefault(function() {
        $.ajax({
            data: {
                'csrfmiddlewaretoken': Util.getCookie("csrftoken"),
                'idx': $("#tid").val()
            },
            datatype: "text",
            success: function(data, textStatus, httpRequest) {
                React.unmountComponentAtNode(
                    document.getElementById("template_modal_1_content")
                );

                // TODO: READ_TEMPLATE_URL should get only one template!
                var templateModalMain =
                    React.render(<TemplateModalMain
                        entries={data.objs[0].entries} />,
                    document.getElementById(
                        "template_modal_1_content"
                    )
                );
                Posts.setTemplateModalMain(templateModalMain);
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
                                "loadedTemplate",
                                Posts.getTemplateModalMain().state.entries
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
