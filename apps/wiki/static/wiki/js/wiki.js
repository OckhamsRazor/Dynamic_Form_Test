/**
 * @fileoverview Utilities for Wiki.
 * @author yl871804@gmail.com (Lang-Chi Yu)
 */

Wiki = function() {

    /**
     * consts
    */
    var WikiUrls_ = Object.freeze({
        WIKI_MAIN_URL: "/wiki/main/",
        NEW_POST_URL: "/wiki/new_post/"
    });

    /**
     * private methods
    */

    var buttonSettings_ = function() {
        // $("#new_post_button").click(Util.buttonDefault(offerNewPost_));
        $("#new_choice_button").click(Util.buttonDefault(function() {
            $(".choice_modal.edit")
                .modal({
                    onApprove: function() {
                        alert("Hell World!");
                    }
                })
                .modal("show")
            ;

            $(".choice_modal.edit .content .menu .item")
                .tab()
            ;
        }));
    };

    /**
     * interface
    */
    return {

        /**
         * properties
        */
        getUrl: function(name) { return WikiUrls_[name] },

        /**
         * public methods
        */
        init: function() {
            buttonSettings_();
        },
    };
} ();
