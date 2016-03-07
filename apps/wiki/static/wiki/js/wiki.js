/**
 * @fileoverview Utilities for Wiki.
 * @author yl871804@gmail.com (Lang-Chi Yu)
 */

Wiki = function() {

    /**
     * variables
     */

    var cModalSearch_ = null; // <ChoiceModalSearch />
    var newChoiceFormValidationSettings_ = {};

    /**
     * consts
    */

    var WikiUrls_ = Object.freeze({
        WIKI_MAIN_URL: "/wiki/main/",
        NEW_POST_URL: "/wiki/new_post/",
        CREATE_CHOICE_URL: "/wiki/create_choice/",
        READ_CHOICE_URL: "/wiki/read_choice/",
        READ_CHOICE_ALL_URL: "/wiki/read_choice_all/",
        UPDATE_CHOICE_URL: "/wiki/update_choice/",
        CHOICE_TITLE_EXISTS_URL: "/wiki/choice_title_exists/",
    });

    /**
     * private methods
    */

    var generalSubmit_ = function(formdata, name, url) {
        formdata.csrfmiddlewaretoken = Util.getCookie("csrftoken");
        $.ajax({
            data: formdata,
            datatype: "text",
            success: function(ajaxData, textStatus, httpRequest) {
                if (ajaxData.result
                    == Util.ResponseStatus.SUCCESSFUL) {
                    Util.sendNotification(
                        "Success",
                        Util.capitalizeTheFirst(name)+" saved.",
                        false,
                        function() {
                            window.location.reload();
                        }
                    );
                } else {
                    Util.sendNotification(
                        "Failed",
                        "Something went wrong; your "+name
                            +" has not been saved.",
                        false,
                        function() {
                            window.location.reload();
                        }
                    );
                }
            },
            error: function(httpRequest, textStatus, errorThrown) {
                Util.sendNotification(
                    "Failed",
                    "Something went wrong; your "
                    + name + " "
                    +"has not been saved.",
                    false,
                    function() {
                        window.location.reload();
                    }
                );
            },
            type: "POST",
            url: url
        });
    };

    var generalSubmitWithUniqueTitle_ = function(
        title, formdata, name, checkingUrl, createUrl, updateUrl) {
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
                        Util.capitalizeTheFirst(name)
                            +" with the title \""
                            +Util.capitalizeTheFirst(title)
                            +"\" exists. Overwrite it?",
                        function() {
                            generalSubmit_(formdata, name, updateUrl);
                        }
                    );
                } else {
                    generalSubmit_(formdata, name, createUrl);
                }
            },
            error: function(httpRequest, textStatus, errorThrown) {
                Util.sendNotification(
                    "Failed",
                    "Something went wrong; your "
                    + name + " "
                    +"has not been saved.",
                    false,
                    function() {
                        window.location.reload();
                    }
                );
            },
            type: "POST",
            url: checkingUrl
        });
    };

    var offerNewPost_ = function() {
        window.location = WikiUrls_["NEW_POST_URL"];
    };

    /* CREATE */
    var submitNewChoice_ = function(formdata) {
        generalSubmitWithUniqueTitle_(
            formdata.title, formdata, "choice",
            WikiUrls_["CHOICE_TITLE_EXISTS_URL"],
            WikiUrls_["CREATE_CHOICE_URL"],
            WikiUrls_["UPDATE_CHOICE_URL"]
        );
    };

    /* READ */

    /**
     * Retrieve Choices from backend by keywords.
     * @param {Array} kws - An array of keywords. if empty, function will
     *     try fetch all Choices.
     */
    var getChoices_ = function(kws, onSuccess) {
        $.ajax({
            data: {
                csrfmiddlewaretoken: Util.getCookie("csrftoken"),
                kws: kws
            },
            datatype: "text",
            error: function(httpRequest, textStatus, errorThrown) {
                    console.log("ERROR");
                // window.document.write(httpRequest.responseText);
            },
            success: onSuccess,
            type: "POST",
            url: WikiUrls_["READ_CHOICE_ALL_URL"]
        });
    };

    /* UPDATE */

    /* DELETE */

    var buttonSettings_ = function() {
        $("#new_post_button").click(Util.buttonDefault(offerNewPost_));
        $("#new_choice_button").click(Util.buttonDefault(function() {
            React.unmountComponentAtNode(
                document.getElementById("choice_modal_new")
            );
            var cModalNew = React.render(
                React.createElement(ChoiceModalNew, {
                    items: [{
                        value: "empty",
                        isActive: true,
                        idx: -1,
                        onDelete: null
                    }]
                }),
                document.getElementById("choice_modal_new")
            );
            Posts.setChoiceModalNew(cModalNew);

            $(".choice_modal.edit")
                .modal({
                    onApprove: function() {
                        var newCForm = $("#new_choice_form");
                        if (!newCForm.form("validate form"))
                           return false;

                        var formdata =
                            newCForm.form('get values')
                        ;
                        var options = [];
                        for (oid in formdata.values) {
                            var option = formdata.values[oid];
                            if (Util.isNonEmptyStr(option)) {
                                options.push(option);
                            }
                        }
                        if (options.length == 0) {
                            Util.sendNotification(
                                "ERROR", "Valid Option not found."
                            );
                            return false;
                        } else {
                            formdata.values = options;
                            submitNewChoice_(formdata);
                        }
                    }
                })
                .modal("show")
            ;

            $(".choice_modal.edit .content .menu .item")
                .tab()
            ;
        }));
    };

    var semanticUiInit_ = function() {
        newChoiceFormValidationSettings_ = {
            // on: 'blur',
            inline: 'true',
            onSuccess: function() {
                return true;
            },
            onFailure: function() {
                return false;
            }
        };
    };

    /**
     * interface
    */

    return {

        /**
         * properties
        */

        getUrl: function(name) { return WikiUrls_[name] },
        getChoiceModalSearch: function() { return cModalSearch_; },
        setChoiceModalSearch: function(cModalSearch) {
            cModalSearch_ = cModalSearch;
        },
        getNewChoiceFormValidationSettings: function() {
            return newChoiceFormValidationSettings_;
        },
        setNewChoiceFormValidationSettings: function(name, value) {
            newChoiceFormValidationSettings_[name] = value;
        },

        /**
         * public methods
        */

        generalSubmit: generalSubmit_,
        generalSubmitWithUniqueTitle: generalSubmitWithUniqueTitle_,
        getChoices: getChoices_,

        init: function() {
            buttonSettings_();
            semanticUiInit_();
        },
    };
} ();
