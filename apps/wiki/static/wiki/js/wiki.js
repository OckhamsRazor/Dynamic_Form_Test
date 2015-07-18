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
