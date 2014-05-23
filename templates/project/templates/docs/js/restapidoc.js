jQuery(document).ready(function() {

    function toggleBlock() {
        if( $(this).is('.toggle-down') ) {
            $(this).toggleClass( "toggle-up", true );
            $(this).toggleClass( "toggle-down", false );
        } else {
            $(this).toggleClass( "toggle-up", false );
            $(this).toggleClass( "toggle-down", true );
        }
        $(this).next().toggle(100);
    }

    function initEventHandlers() {
        $('div.block-title').toggleClass( "toggle-down", true );
        $('div.block-title').next().toggle();
        $('div.block-title').bind('click', toggleBlock );
    }

    initEventHandlers();
});