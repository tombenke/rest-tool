jQuery(document).ready(function() {

    function toggleBlock() {
        $(this).next().toggle(100);
    }

    function initEventHandlers() {
        $('div.block-title').next().toggle();
        $('div.block-title').bind('click', toggleBlock );
    }

    initEventHandlers();
});