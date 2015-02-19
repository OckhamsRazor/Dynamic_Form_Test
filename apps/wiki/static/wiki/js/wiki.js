/**
 * @fileoverview Utilities for Wiki.
 * @author yl871804@gmail.com (Lang-Chi Yu)
 */

Wiki = function() {

    /**
     * consts
    */
    var WIKI_MAIN_URL_ = "/wiki/main/";
    var NEW_POST_URL_ = "/wiki/new_post/";

    /**
     * private methods
    */
    var offerNewPost_ = function() {
        window.location.href = NEW_POST_URL_;
    };

    var buttonSettings_ = function() {
        $("#new_post_button").click(Util.buttonDefault(offerNewPost_));
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
            buttonSettings_();
        },
    };
} ();
