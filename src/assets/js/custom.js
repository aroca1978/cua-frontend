function init_plugins() {
    $(function() {
        "use strict";
        $(function() {
            $('#loader').fadeOut('fast', function() {
                $(this).remove();
            });
        });
    });
}