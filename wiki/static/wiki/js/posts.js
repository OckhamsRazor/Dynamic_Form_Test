/**
 * ModuleName    [ Posts ]
 * Synopsis      [ Wiki Post-related issues ]
 * Author        [ OckhamsRazor (yl871804@gmail.com) ]
*/

Posts = function() {
    /**
     * consts
    */
    __wiki_main_url = "/wiki/main/";
    __create_post_url = "/wiki/create_post/";

    /**
     * private methods
    */
    var _offer_create_post = function() {
        alert("CREATE!!");
    };

    var _button_settings = function() {
        $("#create_post_button").click(_offer_create_post);
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
