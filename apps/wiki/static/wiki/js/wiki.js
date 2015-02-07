/**
 * ModuleName    [ Wiki ]
 * Synopsis      [ Utilities for Wiki ]
 * Author        [ OckhamsRazor (yl871804@gmail.com) ]
*/

Wiki = function() {
    /**
     * consts
    */
    __wiki_main_url = "/wiki/main/";
    __new_post_url = "/wiki/new_post/";

    /**
     * private methods
    */

    var _offer_new_post = function() {
        window.location.href = __new_post_url;
    };

    var _button_settings = function() {
        $("#new_post_button").click(Util.button_default(_offer_new_post));
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
            _button_settings();
        },
    };
} ();
