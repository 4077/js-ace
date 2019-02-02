// head {
var __nodeId__ = "js_ace__dispatcher";
var __nodeNs__ = "js_ace";
// }

(function (__nodeNs__, __nodeId__) {
    $.widget(__nodeNs__ + "." + __nodeId__, {
        options: {},

        _create: function () {
            var widget = this;
        },

        resizeAll: function () {
            $(".ace_editor").each(function () {
                ace.edit($(this).attr("id")).resize();
            });
        }
    });
})(__nodeNs__, __nodeId__);
