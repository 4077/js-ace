// head {
var __nodeId__ = "js_ace__main";
var __nodeNs__ = "js_ace";
// }

(function (__nodeNs__, __nodeId__) {
    $.widget(__nodeNs__ + "." + __nodeId__, $.ewma.node, {
        options: {},

        __create: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            var editor = ace.edit(o.containerId);
            var session = editor.getSession();

            ace.config.set('basePath', o.basePath);
            ace.config.set('modePath', o.basePath);
            ace.config.set('themePath', o.basePath);
            ace.config.set('workerPath', o.basePath);

            editor.setTheme("ace/theme/tomorrow_night");

            editor.setOptions({
                fontFamily: "monospace",
                fontSize:   "14px"
            });

            session.setMode("ace/mode/" + o.mode);
            session.setValue(o.code);

            //

            var Range = require('ace/range').Range;
            var Fold = require("ace/edit_session/fold").Fold;

            var setSubFoldsRecursion = function (fold, subFolds) {
                subFolds.forEach(function (subFold) {
                    if (fold) {
                        fold.subFolds.push(new Fold(new Range(
                            subFold.range.start.row,
                            subFold.range.start.column,
                            subFold.range.end.row,
                            subFold.range.end.column
                        ), "..."));

                        var newSubFold = fold.subFolds[fold.subFolds.length - 1];

                        setSubFoldsRecursion(newSubFold, subFold.subFolds);
                    }
                });
            };

            o.folds.forEach(function (fold) {
                var newFold = session.addFold("...", new Range(
                    fold.range.start.row,
                    fold.range.start.column,
                    fold.range.end.row,
                    fold.range.end.column
                ));

                setSubFoldsRecursion(newFold, fold.subFolds);
            });

            editor.focus();
            editor.moveCursorTo(o.cursor.row, o.cursor.column);

            editor.selection.setRange(new Range(
                o.selection.start.row,
                o.selection.start.column,
                o.selection.end.row,
                o.selection.end.column
            ));

            session.setScrollTop(o.scrollTop);
            session.setScrollLeft(o.scrollLeft);

            //

            var getFolds = function () {
                var folds = session.getAllFolds();

                var foldsTree = [];

                var getFoldsRecursion = function (target, folds) {
                    folds.forEach(function (fold) {
                        target.push({
                            range:    fold.range,
                            subFolds: []
                        });

                        getFoldsRecursion(target[target.length - 1].subFolds, fold.subFolds)
                    });
                };

                getFoldsRecursion(foldsTree, folds);

                return foldsTree;
            };

            //

            var requestTimeout = 0;

            session.on('change', function () {
                clearTimeout(requestTimeout);

                requestTimeout = setTimeout(function () {
                    var requestData = o.requestData || {};

                    $.extend(requestData, {
                        value: session.getValue()
                    });

                    w.mr('updateValue', requestData);

                    w.mr('update', {
                        cursor: editor.getCursorPosition()
                    });

                    w.mr('updateFolds', getFolds());
                }, 400);
            });

            session.on("changeFold", function () {
                w.r('updateFolds', getFolds());
            });

            session.on("changeScrollTop", function () {
                w.r('update', {
                    scroll_top: session.getScrollTop()
                });
            });

            session.on("changeScrollLeft", function () {
                w.r('update', {
                    scroll_left: session.getScrollLeft()
                });
            });

            var cursorUpdateTimeout;

            session.selection.on("changeCursor", function () {
                clearTimeout(cursorUpdateTimeout);

                cursorUpdateTimeout = setTimeout(function () {
                    w.mr('update', {
                        cursor: editor.getCursorPosition()
                    });
                }, 200);
            });

            var selectionUpdateTimeout;

            editor.on("changeSelection", function () {
                clearTimeout(selectionUpdateTimeout);

                selectionUpdateTimeout = setTimeout(function () {
                    w.mr('update', {
                        selection: editor.getSelectionRange()
                    });
                }, 200);
            });
        }
    });
})(__nodeNs__, __nodeId__);
