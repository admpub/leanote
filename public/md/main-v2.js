define('constants', [], function () {
    var constants = {};
    constants.EDITOR_DEFAULT_PADDING = 5;
    constants.fontSize = 14;
    constants.fontFamily = "Menlo, 'Ubuntu Mono', Consolas, 'Courier New',  'Hiragino Sans GB', 'WenQuanYi Micro Hei', 'Microsoft Yahei', sans-serif;";
    return constants;
});

define('utils', [
    "underscore",
    "crel",
    "xregexp",
    // "stacktrace",
    // "FileSaver",
], function (_, crel, XRegExp) {

    var utils = {};

    // Return a parameter from the URL
    utils.getURLParameter = function (name) {
        // Parameter can be either a search parameter (&name=...) or a hash fragment parameter (#!name=...)
        var regex = new RegExp("(?:\\?|\\#\\!|&)" + name + "=(.+?)(?:&|\\#|$)");
        try {
            return decodeURIComponent(regex.exec(location.search + location.hash)[1]);
        }
        catch (e) {
            return undefined;
        }
    };

    // Transform a selector into a jQuery object
    function jqElt(element) {
        if (_.isString(element)) {
            return $(element);
        }
        return element;
    }

    // For input control
    function inputError(element, event) {
        if (event !== undefined) {
            element.stop(true, true).addClass("error").delay(1000).switchClass("error");
            event.stopPropagation();
        }
    }

    // Return input value
    utils.getInputValue = function (element) {
        element = jqElt(element);
        return element.val();
    };

    // Set input value
    utils.setInputValue = function (element, value) {
        element = jqElt(element);
        element.val(value);
    };

    // Return input text value
    utils.getInputTextValue = function (element, event, validationRegex) {
        element = jqElt(element);
        var value = element.val();
        if (value === undefined) {
            inputError(element, event);
            return undefined;
        }
        // trim
        value = utils.trim(value);
        if ((value.length === 0) || (validationRegex !== undefined && !value.match(validationRegex))) {
            inputError(element, event);
            return undefined;
        }
        return value;
    };

    // Return input integer value
    utils.getInputIntValue = function (element, event, min, max) {
        element = jqElt(element);
        var value = utils.getInputTextValue(element, event);
        if (value === undefined) {
            return undefined;
        }
        value = parseInt(value, 10);
        if (isNaN(value) || (min !== undefined && value < min) || (max !== undefined && value > max)) {
            inputError(element, event);
            return undefined;
        }
        return value;
    };

    // Return input value and check that it's a valid RegExp
    utils.getInputRegExpValue = function (element, event) {
        element = jqElt(element);
        var value = utils.getInputTextValue(element, event);
        if (value === undefined) {
            return undefined;
        }
        try {
            new RegExp(value);
        }
        catch (e) {
            inputError(element, event);
            return undefined;
        }
        return value;
    };

    // Return input value and check that it's a valid JavaScript object
    utils.getInputJsValue = function (element, event) {
        element = jqElt(element);
        var value = utils.getInputTextValue(element, event);
        if (value === undefined) {
            return undefined;
        }
        try {
            /*jshint evil:true */
            eval("var test=" + value);
            /*jshint evil:false */
        }
        catch (e) {
            inputError(element, event);
            return undefined;
        }
        return value;
    };

    // Return checkbox boolean value
    utils.getInputChecked = function (element) {
        element = jqElt(element);
        return element.prop("checked");
    };

    // Set checkbox state
    utils.setInputChecked = function (element, checked) {
        element = jqElt(element);
        element.prop("checked", checked).change();
    };

    // Get radio button value
    utils.getInputRadio = function (name) {
        return $("input:radio[name=" + name + "]:checked").prop("value");
    };

    // Set radio button value
    utils.setInputRadio = function (name, value) {
        $("input:radio[name=" + name + "][value=" + value + "]").prop("checked", true).change();
    };

    // Reset input control in all modals
    utils.resetModalInputs = function () {
        $(".modal input[type=text]:not([disabled]), .modal input[type=password], .modal textarea").val("");
        $(".modal input[type=checkbox]").prop("checked", false).change();
    };

    // Basic trim function
    utils.trim = function (str) {
        return $.trim(str);
    };

    // Slug function
    var nonWordChars = XRegExp('[^\\p{L}\\p{N}-]', 'g');
    utils.slugify = function (text) {
        return text.toLowerCase().replace(/\s/g, '-') // Replace spaces with -
            .replace(nonWordChars, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, ''); // Trim - from end of text
    };

    // Check an URL
    utils.checkUrl = function (url, addSlash) {
        if (!url) {
            return url;
        }
        if (url.indexOf("http") !== 0) {
            url = "http://" + url;
        }
        if (addSlash && url.indexOf("/", url.length - 1) === -1) {
            url += "/";
        }
        return url;
    };


    utils.randomString = function () {
        return _.random(4294967296).toString(36);
    };

    // Time shared by others modules
    utils.updateCurrentTime = function () {
        utils.currentTime = new Date().getTime();
    };
    utils.updateCurrentTime();

    // Serialize sync/publish attributes and store it in the storage
    utils.storeAttributes = function (attributes) {
    };

    // Retrieve/parse an index array from storage
    utils.retrieveIndexArray = function (storeIndex) {
    };

    // Append an index to an array in storage
    utils.appendIndexToArray = function (storeIndex, index) {
    };

    // Remove an index from an array in storage
    utils.removeIndexFromArray = function (storeIndex, index) {
    };

    // Retrieve/parse an object from storage. Returns undefined if error.
    utils.retrieveIgnoreError = function (storeIndex) {
    };

    var eventList = [];
    utils.logValue = function (value) {
    };
    utils.logStackTrace = function () {
    };
    utils.formatEventList = function () {
        var result = [];
        _.each(eventList, function (event) {
            result.push("\n");
            if (_.isString(event)) {
                result.push(event);
            }
            else if (_.isArray(event)) {
                result.push(event[5] || "");
                result.push(event[6] || "");
            }
        });
        return result.join("");
    };

    return utils;
});

define('classes/Extension', [], function () {

    function Extension(extensionId, extensionName, isOptional, disableInViewer, disableInLight) {
        this.extensionId = extensionId;
        this.extensionName = extensionName;
        this.isOptional = isOptional;
        this.disableInViewer = disableInViewer;
        this.disableInLight = disableInLight;
    }

    return Extension;
});
define('settings', [
], function () {
    var settings = {
        layoutOrientation: "horizontal",
        lazyRendering: true,
        editorFontFamily: 'Menlo, Consolas, "Courier New", Courier, monospace',
        editorFontSize: 13,
        shortcuts: {},
        extensionSettings: {}
    };
    return settings;
});

var Markdown;
if (typeof exports === "object" && typeof require === "function") // we're in a CommonJS (e.g. Node.js) module
    Markdown = exports;
else
    Markdown = {};
// 定义 Markdown.HookCollection
(function () {
    function identity(x) { return x; }
    Markdown.HookCollection = function () { };
    Markdown.HookCollection.prototype = {
        chain: function (hookname, func) {
            var original = this[hookname];
            if (!original)
                throw new Error("unknown hook " + hookname);

            if (original === identity)
                this[hookname] = func;
            else
                this[hookname] = function (text) {
                    var args = Array.prototype.slice.call(arguments, 0);
                    args[0] = original.apply(null, args);
                    return func.apply(null, args);
                };
        },
        set: function (hookname, func) {
            if (!this[hookname])
                throw new Error("unknown hook " + hookname);
            this[hookname] = func;
        },
        addNoop: function (hookname) {
            this[hookname] = identity;
        },
        addFalse: function (hookname) {
            this[hookname] = function (x) { return false };
        }
    };
})();

/*globals Markdown */
define('extensions/markdownExtra', [
    "underscore",
    "utils",
    "classes/Extension",
    //   'google-code-prettify',
    // 'highlightjs',
    'pagedown-extra',
], function (_, utils, Extension) {

    var markdownExtra = new Extension("markdownExtra", "Markdown Extra", true);
    markdownExtra.defaultConfig = {
        extensions: [
            "fenced_code_gfm",
            "tables",
            "def_list",
            "attr_list",
            "footnotes",
            // smartypants不要, 因为它把'和"转成了中文引号, --转成了一个–
            // "smartypants", // https://daringfireball.net/projects/smartypants/
            /*s
            SmartyPants is a free web publishing plug-in for Movable Type, Blosxom, and BBEdit that easily translates plain ASCII punctuation characters into “smart” typographic punctuation HTML entities.
SmartyPants can perform the following transformations:
 
Straight quotes ( " and ' ) into “curly” quote HTML entities
Backticks-style quotes (``like this'') into “curly” quote HTML entities
Dashes (“--” and “---”) into en- and em-dash entities
Three consecutive dots (“...”) into an ellipsis entity
This means you can write, edit, and save your posts using plain old ASCII straight quotes, plain dashes, and plain dots, but your published posts (and final HTML output) will appear with smart quotes, em-dashes, and proper ellipses.
 
SmartyPants is a combination plug-in — a single plug-in file that works with Movable Type, Blosxom, and BBEdit. It can also be used from a Unix-style command-line.
 
SmartyPants does not modify characters within <pre>, <code>, <kbd>, or <script> tag blocks. Typically, these tags are used to display text where smart quotes and other “smart punctuation” would not be appropriate, such as source code or example markup.
             */
            "strikethrough",
            "newlines",
        ],
        intraword: true,
        comments: true,
        highlighter: "prettify"
    };

    var eventMgr;
    markdownExtra.onEventMgrCreated = function (eventMgrParameter) {
        eventMgr = eventMgrParameter;
    };

    function onToggleMode(editor) {
        // 不能加linenums, 加了后, uml不能显示
        // 但是, 有人说没有行号了, 很不好
        // 怎么办
        editor.hooks.chain("onPreviewRefresh", function () {
            $('#preview-contents pre code').each(function () {
                var classes = $(this).attr('class');
                if (classes != 'language-flow' && classes != 'language-sequence' && classes != 'language-mermaid' && classes != 'language-chart') {
                    $(this).parent().addClass('prettyprint linenums');
                }
            });
            //   prettify.prettyPrint();
        });
    }

    markdownExtra.onToggleMode = onToggleMode;

    markdownExtra.onPagedownConfigure = function (editor) {
        var converter = editor.getConverter();
        if (markdownExtra.config.intraword === true) {
            var converterOptions = {
                _DoItalicsAndBold: function (text) {
                    text = text.replace(/([^\w*]|^)(\*\*|__)(?=\S)(.+?[*_]*)(?=\S)\2(?=[^\w*]|$)/g, "$1<strong>$3</strong>");
                    text = text.replace(/([^\w*]|^)(\*|_)(?=\S)(.+?)(?=\S)\2(?=[^\w*]|$)/g, "$1<em>$3</em>");
                    return text;
                }
            };
            converter.setOptions(converterOptions);
        }
        if (markdownExtra.config.comments === true) {
            converter.hooks.chain("postConversion", function (text) {
                return text.replace(/<!--.*?-->/g, function (wholeMatch) {
                    return wholeMatch.replace(/^<!---(.+?)-?-->$/, ' <span class="comment label label-danger">$1</span> ');
                });
            });
        }

        var extraOptions = {
            extensions: markdownExtra.config.extensions
        };

        extraOptions.highlighter = "prettify";

        onToggleMode(editor);

    }; // end of the Markdown.Converter constructor

})();

define("bower-libs/pagedown-ace/Markdown.Converter", function(){});

// needs Markdown.Converter.js at the moment

(function () {

    return markdownExtra;
});
define('libs/mathjax_init', [
    "underscore",
    "settings",
], function (settings, _/*, mathjaxConfigJS*/) {
    var script = document.createElement('script');
    script.type = 'text/x-mathjax-config';
    var mathjaxConfigJS = 'MathJax.Hub.Config({\n\tskipStartupTypeset: true,\n    "HTML-CSS": {\n        preferredFont: "TeX",\n        availableFonts: [\n            "STIX",\n            "TeX"\n        ],\n        linebreaks: {\n            automatic: true\n        },\n        EqnChunk: 10,\n        imageFont: null\n    },\n    tex2jax: <%= tex2jax || \'{ inlineMath: [["$","$"],["\\\\\\\\\\\\\\\\(","\\\\\\\\\\\\\\\\)"]], displayMath: [["$$","$$"],["\\\\\\\\[","\\\\\\\\]"]], processEscapes: true }\' %>,\n    TeX: $.extend({\n        noUndefined: {\n            attributes: {\n                mathcolor: "red",\n                mathbackground: "#FFEEEE",\n                mathsize: "90%"\n            }\n        },\n        Safe: {\n            allow: {\n                URLs: "safe",\n                classes: "safe",\n                cssIDs: "safe",\n                styles: "safe",\n                fontsize: "all"\n            }\n        }\n    }, <%= tex %>),\n    messageStyle: "none"\n});\n';
    script.innerHTML = _.template(mathjaxConfigJS, {
        tex: settings.extensionSettings.mathJax ? settings.extensionSettings.mathJax.tex : 'undefined',
        tex2jax: settings.extensionSettings.mathJax ? settings.extensionSettings.mathJax.tex2jax : undefined
    });
    document.getElementsByTagName('head')[0].appendChild(script);
});
/*defines MathJax */
define('extensions/mathJax', [
    "utils",
    "classes/Extension",
    "mathjax",
], function (utils, Extension) {

    var mathJax = new Extension("mathJax", "MathJax", true);
    mathJax.defaultConfig = {
        tex: "{}",
        tex2jax: '{ inlineMath: [["$","$"],["\\\\\\\\(","\\\\\\\\)"]], displayMath: [["$$","$$"],["\\\\[","\\\\]"]], processEscapes: true }'
    };

    /*jshint ignore:start */
    mathJax.onPagedownConfigure = function (editorObject) {
        t = document.getElementById("preview-contents");

    var defaultsStrings = {
        bold: getMsg("Strong") + " <strong>",
        boldexample: getMsg("strong text"),
        
        italic: getMsg("Emphasis") + " <em>",
        italicexample: getMsg("emphasized text"),
        
        link: getMsg("Hyperlink") + " <a>",
        linkdescription: getMsg("enter link description here"),
        linkdialog: "<p><b>Insert Hyperlink</b></p><p>http://example.com/ \"optional title\"</p>",
        
        quote: getMsg("Blockquote") + " <blockquote>",
        quoteexample: getMsg("Blockquote"),
        
        code: getMsg("Code Sample") + " <pre><code>",
        codeexample: getMsg("enter code here"),
        
        image: getMsg("Image") + " <img>",
        imagedescription: getMsg("enter image description here"),
        imagedialog: "<p><b>Insert Image</b></p><p>http://example.com/images/diagram.jpg \"optional title\"<br><br>Need <a href='http://www.google.com/search?q=free+image+hosting' target='_blank'>free image hosting?</a></p>",
        
        olist: getMsg("Numbered List") + " <ol>",
        ulist: getMsg("Bulleted List") + " <ul>",
        litem: getMsg("List item"),
        
        heading: getMsg("Heading") + " <h1>/<h2>",
        headingexample: getMsg("Heading"),
        
        hr: getMsg("Horizontal Rule") + " <hr>",
        
        undo: getMsg("Undo") + " -",
        redo: getMsg("Redo") + " -",
        
        help: "Markdown Editing Help"
    };

    var afterRefreshCallback;
    mathJax.onAsyncPreview = function (callback) {
        afterRefreshCallback = callback;
        j();
    };

    // From math.stackexchange.com...

    function b(a, f, b) {
        var c = k.slice(a, f + 1).join("").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        for (h.Browser.isMSIE && (c = c.replace(/(%[^\n]*)\n/g, "$1<br/>\n")); f > a;)
            k[f] = "", f--;
        k[a] = "@@" + m.length + "@@";
        b && (c = b(c));
        m.push(c);
        i = o = l = null
    }
    function p(a) {
        i = o = l = null;
        m = [];
        var f;
        /`/.test(a) ? (a = a.replace(/~/g, "~T").replace(/(^|[^\\])(`+)([^\n]*?[^`\n])\2(?!`)/gm, function (a) {
            return a.replace(/\$/g, "~D")
        }), f = function (a) {
            return a.replace(/~([TD])/g,
                function (a, c) {
                    return { T: "~", D: "$" }[c]
                })
        }) : f = function (a) {
            return a
        };
        k = r(a.replace(/\r\n?/g, "\n"), u);
        for (var a = 1, d = k.length; a < d; a += 2) {
            var c = k[a];
            "@" === c.charAt(0) ? (k[a] = "@@" + m.length + "@@", m.push(c)) : i ? c === o ? n ? l = a : b(i, a, f) : c.match(/\n.*\n/) ? (l && (a = l, b(i, a, f)), i = o = l = null, n = 0) : "{" === c ? n++ : "}" === c && n && n-- : c === s || "$$" === c ? (i = a, o = c, n = 0) : "begin" === c.substr(1, 5) && (i = a, o = "\\end" + c.substr(6), n = 0)
        }
        l && b(i, l, f);
        return f(k.join(""))
    }
    function d(a) {
        a = a.replace(/@@(\d+)@@/g, function (a, b) {
            return m[b]
        });
        m = null;
        return a
    }
    function e() {
        q = !1;
        h.cancelTypeset = !1;
        h.Queue(["Typeset", h, t])
        h.Queue(afterRefreshCallback); //benweet
    }
    function j() {
        !q && /*benweet (we need to call our afterRefreshCallback) g &&*/ (q = !0, h.Cancel(), h.Queue(e))
    }
    var g = !1, q = !1, t = null, s = "$", k, i, o, l, n, m, h = MathJax.Hub;
    h.Queue(function () {
        g = !0;
        h.processUpdateTime = 50;
        h.Config({ "HTML-CSS": { EqnChunk: 10, EqnChunkFactor: 1 }, SVG: { EqnChunk: 10, EqnChunkFactor: 1 } })
    });
    var u = /(\$\$?|\\(?:begin|end)\{[a-z]*\*?\}|\\[\\{}$]|[{}]|(?:\n\s*)+|@@\d+@@)/i, r;
    r = 3 === "aba".split(/(b)/).length ? function (a, f) {
        return a.split(f)
    } : function (a, f) {
        var b = [], c;
        if (!f.global) {
            c = f.toString();
            var d = "";
            c = c.replace(/^\/(.*)\/([im]*)$/, function (a, c, b) {
                d = b;
                return c
            });
            f = RegExp(c, d + "g")
        }
        for (var e = f.lastIndex = 0; c = f.exec(a);)
            b.push(a.substring(e, c.index)), b.push.apply(b, c.slice(1)), e = c.index + c[0].length;
        b.push(a.substring(e));
        return b
    };

    (function () {
        var b = MathJax.Hub;
        if (!b.Cancel) {
            b.cancelTypeset = !1;
            b.Register.StartupHook("HTML-CSS Jax Config", function () {
                var d = MathJax.OutputJax["HTML-CSS"], e = d.Translate;
                d.Augment({
                    Translate: function (j, g) {
                        if (b.cancelTypeset || g.cancelled)
                            throw Error("MathJax Canceled");
                        return e.call(d, j, g)
                    }
                })
            });
            b.Register.StartupHook("SVG Jax Config", function () {
                var d = MathJax.OutputJax.SVG, e = d.Translate;
                d.Augment({
                    Translate: function (j, g) {
                        if (b.cancelTypeset || g.cancelled)
                            throw Error("MathJax Canceled");
                        return e.call(d,
                            j, g)
                    }
                })
            });
            b.Register.StartupHook("TeX Jax Config", function () {
                var d = MathJax.InputJax.TeX, e = d.Translate;
                d.Augment({
                    Translate: function (j, g) {
                        if (b.cancelTypeset || g.cancelled)
                            throw Error("MathJax Canceled");
                        return e.call(d, j, g)
                    }
                })
            });
            var p = b.processError;
            b.processError = function (d, e, j) {
                if ("MathJax Canceled" !== d.message)
                    return p.call(b, d, e, j);
                MathJax.Message.Clear(0, 0);
                e.jaxIDs = [];
                e.jax = {};
                e.scripts = [];
                e.i = e.j = 0;
                e.cancelled = !0;
                return null
            };
            b.Cancel = function () {
                this.cancelTypeset = !0
            }
        }
        var getString = function (identifier) { return options.strings[identifier] || defaultsStrings[identifier]; }

        idPostfix = idPostfix || "";

        var hooks = this.hooks = new Markdown.HookCollection();
        hooks.addNoop("onPreviewRefresh");       // called with no arguments after the preview has been refreshed
        hooks.addNoop("postBlockquoteCreation"); // called with the user's selection *after* the blockquote was created; should return the actual to-be-inserted text
        hooks.addFalse("insertImageDialog");     /* called with one parameter: a callback to be called with the URL of the image. If the application creates
                                                  * its own image insertion dialog, this hook should return true, and the callback should be called with the chosen
                                                  * image url (or null if the user cancelled). If this hook returns false, the default dialog will be used.
                                                  */
        hooks.addFalse("insertLinkDialog");

        this.getConverter = function () { return markdownConverter; }

        var that = this,
            panels;

        var undoManager;
        this.run = function (aceEditor, previewWrapper) {
            if (panels)
                return; // already initialized

            panels = new PanelCollection(idPostfix, aceEditor);
            var commandManager = new CommandManager(hooks, getString);
            var previewManager = new PreviewManager(markdownConverter, panels, function () { hooks.onPreviewRefresh(); }, previewWrapper);
            var uiManager;

            /*benweet
            if (!/\?noundo/.test(doc.location.href)) {
                undoManager = new UndoManager(function () {
                    previewManager.refresh();
                    if (uiManager) // not available on the first call
                        uiManager.setUndoRedoButtonStates();
                }, panels);
                this.textOperation = function (f) {
                    undoManager.setCommandMode();
                    f();
                    that.refreshPreview();
                }
            }
            */

    return mathJax;
});
define('extensions/markdownSectionParser', [
    "underscore",
    "extensions/markdownExtra",
    //   "extensions/mathJax",
    "classes/Extension",
], function (_, markdownExtra, /*mathJax,*/ Extension) {

            // var useragent = typeof require !== 'undefined' ? require('ace/lib/useragent') : ace.require('ace/lib/useragent');
            var getKey = function (identifier) {
                var keyStroke = keyStrokes[identifier][isMac ? "mac" : "win"];
                var orIndex = keyStroke.indexOf('|');
                return keyStroke.substring(0, orIndex > 0 ? orIndex : keyStroke.length);
            };
            uiManager = new UIManager(idPostfix, panels, undoManager, previewManager, commandManager, options.helpButton, getString, getKey);
            uiManager.setUndoRedoButtonStates();

    var eventMgr;
    markdownSectionParser.onEventMgrCreated = function (eventMgrParameter) {
        eventMgr = eventMgrParameter;
    };

    markdownSectionParser.onPagedownConfigure = function (editor) {

        // Build a regexp to look for section delimiters
        var regexp = '^.+[ \\t]*\\n=+[ \\t]*\\n+|^.+[ \\t]*\\n-+[ \\t]*\\n+|^\\#{1,6}[ \\t]*.+?[ \\t]*\\#*\\n+'; // Title delimiters
        if (markdownExtra.enabled) {
            if (_.some(markdownExtra.config.extensions, function (extension) {
                return extension == "fenced_code_gfm";
            })) {
                regexp = '^```.*\\n[\\s\\S]*?\\n```|' + regexp; // Fenced block delimiters
            }
        }

    }

        //   if(mathJax.enabled) {
        // Math delimiter has to follow 1 empty line to be considered as a section delimiter
        regexp = '^[ \\t]*\\n\\$\\$[\\s\\S]*?\\$\\$|' + regexp; // $$ math block delimiters
        regexp = '^[ \\t]*\\n\\\\\\\\[[\\s\\S]*?\\\\\\\\]|' + regexp; // \\[ \\] math block delimiters
        regexp = '^[ \\t]*\\n\\\\?\\\\begin\\{[a-z]*\\*?\\}[\\s\\S]*?\\\\end\\{[a-z]*\\*?\\}|' + regexp; // \\begin{...} \\end{...} math block delimiters
        //   }
        regexp = '^```.*\\n[\\s\\S]*?\\n```|' + regexp;
        regexp = new RegExp(regexp, 'gm');

        var converter = editor.getConverter();
        converter.hooks.chain("preConversion", function (text) {
            // console.log('preConversion');
            // console.log(text);
            eventMgr.previewStartTime = new Date();
            var tmpText = text + "\n\n";
            function addSection(startOffset, endOffset) {
                var sectionText = tmpText.substring(startOffset, endOffset);
                sectionList.push({
                    text: sectionText,
                    textWithDelimiter: '\n<div class="se-section-delimiter"></div>\n\n' + sectionText + '\n'
                });
            }
            var sectionList = [], offset = 0;
            // Look for delimiters
            tmpText.replace(regexp, function (match, matchOffset) {
                // Create a new section with the text preceding the delimiter
                addSection(offset, matchOffset);
                offset = matchOffset;
            });
            // Last section
            addSection(offset, text.length);
            eventMgr.onSectionsCreated(sectionList);
            return _.reduce(sectionList, function (result, section) {
                return result + section.textWithDelimiter;
            }, '');
        });
    };

    return markdownSectionParser;
});
define('extensions/partialRendering', [
    "underscore",
    "crel",
    "extensions/markdownExtra",
    "classes/Extension"
], function (_, crel, markdownExtra, Extension, partialRenderingSettingsBlockHTML) {

        var chunkObj = this;
        var regex;

        if (startRegex) {

        // Render everything if file or linkDefinition changed
        if (fileChanged === true || linkDefinition != newLinkDefinition) {
            fileChanged = false;
            linkDefinition = newLinkDefinition;
            sectionsToRemove = sectionList;
            sectionList = newSectionList;
            modifiedSections = newSectionList;
            return;
        }

        // Find modified section starting from top
        var leftIndex = sectionList.length;
        _.some(sectionList, function (section, index) {
            if (index >= newSectionList.length || section.text != newSectionList[index].text) {
                leftIndex = index;
                return true;
            }
        });

        // Find modified section starting from bottom
        var rightIndex = -sectionList.length;
        _.some(sectionList.slice().reverse(), function (section, index) {
            if (index >= newSectionList.length || section.text != newSectionList[newSectionList.length - index - 1].text) {
                rightIndex = -index;
                return true;
            }
        });

        if (leftIndex - rightIndex > sectionList.length) {
            // Prevent overlap
            rightIndex = leftIndex - sectionList.length;
        }

        // Create an array composed of left unmodified, modified, right
        // unmodified sections
        var leftSections = sectionList.slice(0, leftIndex);
        modifiedSections = newSectionList.slice(leftIndex, newSectionList.length + rightIndex);
        var rightSections = sectionList.slice(sectionList.length + rightIndex, sectionList.length);
        insertBeforeSection = _.first(rightSections);
        sectionsToRemove = sectionList.slice(leftIndex, sectionList.length + rightIndex);
        sectionList = leftSections.concat(modifiedSections).concat(rightSections);
    }

    var doFootnotes = false;
    var hasFootnotes = false;
    partialRendering.onSectionsCreated = function (sectionListParam) {

        var newSectionList = [];
        var newLinkDefinition = '\n';
        hasFootnotes = false;
        _.each(sectionListParam, function (section) {
            var text = section.textWithDelimiter + '\n';

            // Strip footnotes
            if (doFootnotes) {
                text = text.replace(/^```.*\n[\s\S]*?\n```|\n[ ]{0,3}\[\^(.+?)\]\:[ \t]*\n?([\s\S]*?)\n{1,2}((?=\n[ ]{0,3}\S)|$)/gm, function (wholeMatch, footnote) {
                    if (footnote) {
                        hasFootnotes = true;
                        newLinkDefinition += wholeMatch.replace(/^\s*\n/gm, '') + '\n';
                        return "";
                    }
                    return wholeMatch;
                });

            // Strip link definitions
            text = text.replace(/^```.*\n[\s\S]*?\n```|^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?(?=\s|$)[ \t]*\n?[ \t]*((\n*)["(](.+?)[")][ \t]*)?(?:\n+)/gm, function (wholeMatch, link) {
                if (link) {
                    newLinkDefinition += wholeMatch.replace(/^\s*\n/gm, '') + '\n';
                    return "";
                });
        }
    };

    // If remove is false, the whitespace is transferred
    // to the before/after regions.
    //
    // If remove is true, the whitespace disappears.
    Chunks.prototype.trimWhitespace = function (remove) {
        var beforeReplacer, afterReplacer, that = this;
        if (remove) {
            beforeReplacer = afterReplacer = "";
        } else {
            beforeReplacer = function (s) { that.before += s; return ""; }
            afterReplacer = function (s) { that.after = s + that.after; return ""; }
        }

        this.selection = this.selection.replace(/^(\s*)/, beforeReplacer).replace(/(\s*)$/, afterReplacer);
    };

    var footnoteMap = {};
    // Store one footnote elt in the footnote map
    function storeFootnote(footnoteElt) {
        var id = footnoteElt.id.substring(3);
        footnoteMap[id] = footnoteElt;
    }

    var footnoteContainerElt;
    var previewContentsElt;
    function refreshSections() {

        // Remove outdated sections
        _.each(sectionsToRemove, function (section) {
            var sectionElt = document.getElementById("wmd-preview-section-" + section.id);
            previewContentsElt.removeChild(sectionElt);
        });

        var wmdPreviewElt = document.getElementById("wmd-preview");
        var childNode = wmdPreviewElt.firstChild;
        function createSectionElt(section) {
            var sectionElt = crel('div', {
                id: 'wmd-preview-section-' + section.id,
                class: 'wmd-preview-section preview-content'
            });
            var isNextDelimiter = false;
            while (childNode) {
                var nextNode = childNode.nextSibling;
                if (isNextDelimiter === true && childNode.tagName == 'DIV' && childNode.className == 'se-section-delimiter') {
                    // Stop when encountered the next delimiter
                    break;
                }
                isNextDelimiter = true;
                if (childNode.tagName == 'DIV' && childNode.className == 'footnotes') {
                    _.each(childNode.querySelectorAll("ol > li"), storeFootnote);
                }
                else {
                    sectionElt.appendChild(childNode);
                }
                childNode = nextNode;
            }
            return sectionElt;
        }

        var newSectionEltList = document.createDocumentFragment();
        _.each(modifiedSections, function (section) {
            newSectionEltList.appendChild(createSectionElt(section));
        });
        wmdPreviewElt.innerHTML = '';
        var insertBeforeElt = footnoteContainerElt;
        if (insertBeforeSection !== undefined) {
            insertBeforeElt = document.getElementById("wmd-preview-section-" + insertBeforeSection.id);
        }

        // Rewrite footnotes in the footer and update footnote numbers
        footnoteContainerElt.innerHTML = '';
        var usedFootnoteIds = [];
        if (hasFootnotes === true) {
            var footnoteElts = crel('ol');
            _.each(previewContentsElt.querySelectorAll('a.footnote'), function (elt, index) {
                elt.textContent = index + 1;
                var id = elt.id.substring(6);
                usedFootnoteIds.push(id);
                footnoteElts.appendChild(footnoteMap[id].cloneNode(true));
            });
            if (usedFootnoteIds.length > 0) {
                // Append the whole footnotes at the end of the document
                footnoteContainerElt.appendChild(crel('div', {
                    class: 'footnotes'
                }, crel('hr'), footnoteElts));
            }

            if (findExtraNewlines) {
                regexText = "\\n*";
            }
            this.before = this.before.replace(new re(regexText + "$", ""), replacementText);
        }

    // 初始化时, toggleMode时
    function onPagedownConfigure(editor) {
        converter = editor.getConverter();
        converter.hooks.chain("preConversion", function () {
            var result = _.map(modifiedSections, function (section) {
                return section.text;
            });
            result.push(linkDefinition + "\n\n");
            return result.join("");
        });
        editor.hooks.chain("onPreviewRefresh", function () {
            refreshSections();
        });
    }

            regexText = replacementText = "";

    partialRendering.onInit = function () {
        if (markdownExtra.enabled) {
            if (_.some(markdownExtra.config.extensions, function (extension) {
                return extension == "footnotes";
            })) {
                doFootnotes = true;
            }

            this.after = this.after.replace(new re(regexText, ""), replacementText);
        }
    };

    partialRendering.onReady = function () {
        footnoteContainerElt = crel('div', {
            id: 'wmd-preview-section-footnotes',
            class: 'preview-content'
        });
        previewContentsElt = document.getElementById("preview-contents");
        previewContentsElt.appendChild(footnoteContainerElt);
    };

    partialRendering.onFileSelected = function () {
        fileChanged = true;
    };

    return partialRendering;
});

define('extensions/prismJsToolbar', ['require', 'underscore', 'utils', 'classes/Extension',
], function (require, _, utils, Extension) {
    let prismPluginToolbar = new Extension("prismPluginToolbar", "prism Plugin Toolbar", true);
    let previewContentsElt = document.getElementById('preview-contents');

    function selectRange(elt) {
        var selection;
        // Source: http://stackoverflow.com/a/11128179/2757940
        if (document.body.createTextRange) { // ms
            selection = document.body.createTextRange();
            selection.moveToElementText(elt);
            selection.select();
        } else if (window.getSelection) { // moz, opera, webkit
            selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(elt);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        return selection;
    }

    function emptyToolbar() {
        let toolbars = previewContentsElt.querySelectorAll('pre > .code-toolbar > .toolbar');
        _.each(toolbars, function (t) {
            t.innerHTML = '';
        });
    }

    function registerSelectCodeButton() {
        let toolbars = previewContentsElt.querySelectorAll('pre > .code-toolbar > .toolbar');
        _.each(toolbars, function (t) {
            let button = document.createElement('button'); // 一个节点不可能同时出现在文档的不同位置，每次都新建一个
            button.innerHTML = 'Select Code';
            button.addEventListener('click', function () {
                selectRange(this.parentNode.parentNode.previousElementSibling);
            });

            let div = document.createElement('div');
            div.classList.add('toolbar-item');
            div.appendChild(button);
            t.appendChild(div);
        });
    }

    function registerCopyButton() {
        let toolbars = previewContentsElt.querySelectorAll('pre > .code-toolbar > .toolbar');
        _.each(toolbars, function (t) {
            let button = document.createElement('button');
            button.innerHTML = 'Copy';
            button.addEventListener('click', function () {
                if (nodeIsLocked(this)) { return; }
                let selection = selectRange(this.parentNode.parentNode.previousElementSibling);
                document.execCommand('Copy');
                selection.empty();
                button.innerHTML = 'Copied!';
                lockNode(this);
                setTimeout(() => {
                    this.innerHTML = 'Copy';
                    unlockNode(this);
                    this.blur();
                }, ATTR_TIMEOUT_VALUE);
            });

            let div = document.createElement('div');
            div.classList.add('toolbar-item');
            div.appendChild(button);
            t.appendChild(div);
        });
    }

    function onToggleMode(editor) {
        if (typeof Prism === "undefined") throw new Error("Prism has not loaded yet.");
        // if (typeof Prism.plugins.toolbar === "undefined") { return; }
        editor.hooks.chain("onPreviewRefresh", function () {
            emptyToolbar();
            registerCopyButton();
        });
    }

    prismPluginToolbar.onPagedownConfigure = onToggleMode;
    prismPluginToolbar.onToggleMode = onToggleMode;

    return prismPluginToolbar;
});

define('extensions/umlDiagrams', [
    'require',
    // "jquery",
    "underscore",
    "utils",
    "classes/Extension",
    'crel'
    // ', Diagram', // 如果加了这两个, 338 KB, 不加, 207KB
    // 'flow-chart'
], function (require, _, utils, Extension, crel
    // ,Diagram, 
    // flowChart
) {

    var umlDiagrams = new Extension("umlDiagrams", "UML Diagrams", true);
    // umlDiagrams.settingsBlock = umlDiagramsSettingsBlockHTML;
    umlDiagrams.defaultConfig = {
        flowchartOptions: [
            '{',
            '   "line-width": 2,',
            '   "font-family": "sans-serif",',
            '   "font-weight": "normal"',
            '}'
        ].join('\n')
    };

    var previewContentsElt = document.getElementById('preview-contents');
    function renderFlow() {
        var flows = previewContentsElt.querySelectorAll('.prettyprint > .language-flow');
        if (!flows || flows.length == 0) {
            return;
        }
        // console.log('flows')
        require(['flow-chart'], function (flowChart) {
            _.each(flows, function (elt) {
                try {
                    var chart = flowChart.parse(elt.textContent);
                    var preElt = elt.parentNode;
                    var containerElt = crel('div', {
                        class: 'flow-chart'
                    });
                    preElt.parentNode.replaceChild(containerElt, preElt);
                    chart.drawSVG(containerElt, JSON.parse(umlDiagrams.config.flowchartOptions));
                }
                catch (e) {
                    console.error(e);
                }
            });
        });
    }
    function renderSequence() {
        var ses = previewContentsElt.querySelectorAll('.prettyprint > .language-sequence');
        if (!ses || ses.length == 0) {
            return;
        }
        require(['Diagram'], function (Diagram) {
            _.each(ses, function (elt) {
                try {
                    var diagram = Diagram.parse(elt.textContent);
                    var preElt = elt.parentNode;
                    var containerElt = crel('div', {
                        class: 'sequence-diagram'
                    });
                    preElt.parentNode.replaceChild(containerElt, preElt);
                    diagram.drawSVG(containerElt, {
                        theme: 'simple'
                    });

                }
                catch (e) {
                    console.error(e);
                }
            });
        });
    }

    function renderChart() {
        //   var c = previewContentsElt.querySelectorAll('.prettyprint > .language-chart');
        //   var c = previewContentsElt.querySelectorAll('canvas.chartjs');
        var c = previewContentsElt.querySelectorAll('pre.prettyprint.linenums.language-chart');
        if (!c || c.length == 0) {
            return;
        }
        //   console.log(c);
        //   require(['chart'], function (chart) {
        _.each(c, function (elt) {
            try {
                //   var jsonObject = JSON.parse(elt.textContent);
                var jsonObject = JSON.parse($(elt).children().children()[0].textContent);
                //   var preElt = elt.parentNode;
                var containerElt = crel('canvas', {
                    //class: 'flow-chart'
                });
                elt.replaceWith(containerElt);
                //   preElt.parentNode.replaceChild(containerElt, preElt);
                var ctx = containerElt.getContext('2d');
                new Chart(ctx, jsonObject);
            }
            catch (e) {
                console.error(e);
            }
        });
        //   });
    }

    function renderMermaid() {
        //   var mer = previewContentsElt.querySelectorAll('.prettyprint > .language-mermaid');
        var mer = previewContentsElt.querySelectorAll('pre.prettyprint.linenums.language-mermaid');
        if (!mer || mer.length == 0) {
            return;
        }

        //loadJs('https://cdn.bootcss.com/mermaid/7.1.2/mermaid.js', function () {
        _.each(mer, function (elt) {
            try {
                //   var text = elt.textContent;
                // var text = $(elt).children().children()[0].textContent;
                let svgCode = "";
                $(elt).children().children("ol").children("li").each(function () {
                    svgCode = svgCode + $(this).text() + "\n";
                });
                //   var preElt = elt.parentNode;
                var containerElt = crel('div', {
                    class: 'mermaid flow-chart',
                    style: 'max-width: 960px; margin:0 auto;'
                }, svgCode);
                elt.replaceWith(containerElt);
                //   preElt.parentNode.replaceChild(containerElt, preElt);
                mermaid.init({ noteMargin: 10 }, ".mermaid");
            }
            catch (e) {
                console.error(e);
            }
        });
        //});
    }

    function onToggleMode(editor) {
        editor.hooks.chain("onPreviewRefresh", function () {
            renderSequence();
            renderFlow();
            renderMermaid(); // 交给markdownit插件实现
            renderChart();
        });
    }

    umlDiagrams.onPagedownConfigure = onToggleMode;
    umlDiagrams.onToggleMode = onToggleMode;

    return umlDiagrams;
});

define('extensions/toc', [
    "underscore",
    "utils",
    "classes/Extension",
], function (_, utils, Extension) {

        return new re(pattern, flags);
    }

    // UNFINISHED
    // The assignment in the while loop makes jslint cranky.
    // I'll change it to a better loop later.
    position.getTop = function (elem, isInner) {
        var result = elem.offsetTop;
        if (!isInner) {
            while (elem = elem.offsetParent) {
                result += elem.offsetTop;
            }
        }
        return result;
    };

    position.getHeight = function (elem) {
        return elem.offsetHeight || elem.scrollHeight;
    };

    position.getWidth = function (elem) {
        return elem.offsetWidth || elem.scrollWidth;
    };

    position.getPageSize = function () {

        var scrollWidth, scrollHeight;
        var innerWidth, innerHeight;

        // It's not very clear which blocks work with which browsers.
        if (self.innerHeight && self.scrollMaxY) {
            scrollWidth = doc.body.scrollWidth;
            scrollHeight = self.innerHeight + self.scrollMaxY;
        }
        else if (doc.body.scrollHeight > doc.body.offsetHeight) {
            scrollWidth = doc.body.scrollWidth;
            scrollHeight = doc.body.scrollHeight;
        }
        else {
            scrollWidth = doc.body.offsetWidth;
            scrollHeight = doc.body.offsetHeight;
        }

    // TOC element description
    function TocElement(tagName, anchor, text) {
        this.tagName = tagName;
        this.anchor = anchor;
        this.text = text;
        this.children = [];
    }
    TocElement.prototype.childrenToString = function () {
        if (this.children.length === 0) {
            return "";
        }
        var result = "<ul>\n";
        _.each(this.children, function (child) {
            result += child.toString();
        });
        result += "</ul>\n";
        return result;
    };
    TocElement.prototype.toString = function () {
        var result = "<li>";
        if (this.anchor && this.text) {
            result += '<a href="#' + this.anchor + '">' + this.text + '</a>';
        }

        var maxWidth = Math.max(scrollWidth, innerWidth);
        var maxHeight = Math.max(scrollHeight, innerHeight);
        return [maxWidth, maxHeight, innerWidth, innerHeight];
    };

        var currentElement;
        function pushCurrentElement() {
            if (currentElement !== undefined) {
                if (currentElement.children.length > 0) {
                    currentElement.children = groupTags(currentElement.children, level + 1);
                }
            }

        _.each(array, function (element) {
            if (element.tagName != tagName) {
                if (level !== toc.config.maxDepth) {
                    if (currentElement === undefined) {
                        currentElement = new TocElement();
                    }
                    currentElement.children.push(element);
                }
            }
            else {
                inputStateObj = null;
            }
        };

        var refreshState = function (isInitialState) {
            inputStateObj = new TextareaState(panels, isInitialState);
            timer = undefined;
        };

        this.setCommandMode = function () {
            mode = "command";
            saveState();
            timer = setTimeout(refreshState, 0);
        };

        this.canUndo = function () {
            return stackPtr > 1;
        };

        this.canRedo = function () {
            if (undoStack[stackPtr + 1]) {
                return true;
            }
            return false;
        };

        var elementList = [];
        _.each(previewContentsElt.querySelectorAll('h1, h2, h3, h4, h5, h6'), function (elt) {
            elementList.push(new TocElement(elt.tagName, createAnchor(elt), elt.textContent));
        });
        elementList = groupTags(elementList);
        return '<div class="toc">\n<ul>\n' + elementList.join("") + '</ul>\n</div>\n';
    }

    toc.onPagedownConfigure = function (editor) {
        previewContentsElt = document.getElementById('preview-contents');
        var tocExp = new RegExp("^" + toc.config.marker + "$");
        // Run TOC generation when conversion is finished directly on HTML
        editor.hooks.chain("onPreviewRefresh", function () {
            var tocEltList = document.querySelectorAll('.table-of-contents, .toc');
            var htmlToc = buildToc();
            // Replace toc paragraphs
            _.each(previewContentsElt.getElementsByTagName('p'), function (elt) {
                if (tocExp.test(elt.innerHTML)) {
                    elt.innerHTML = htmlToc;
                }
            });
            // Add toc in the TOC button 
            _.each(tocEltList, function (elt) {
                elt.innerHTML = htmlToc;
            });

            $("#leanoteNavContentMd").height("auto"); // auto
            try {
                if (!$(htmlToc).text()) {
                    $("#leanoteNavContentMd").html("&nbsp; &nbsp; Nothing...");
                }
            } catch (e) { }
            // 这里, resize Height
            var curH = $("#leanoteNavContentMd").height();
            var pH = $("#mdEditor").height() - 100;
            if (curH > pH) {
                $("#leanoteNavContentMd").height(pH);
            }

    toc.onReady = function () {
        // $('.extension-preview-buttons .table-of-contents').on('click', 'a', function(evt) {
        //     evt.preventDefault();
        // });
    };

        // Redo an action.
        this.redo = function () {

define('extensions/emailConverter', [
    "classes/Extension",
], function (Extension) {
    var emailConverter = new Extension("emailConverter", "Markdown Email", true);
    emailConverter.onPagedownConfigure = function (editor) {
        editor.getConverter().hooks.chain("postConversion", function (text) {
            return text.replace(/<(mailto\:)?([^\s>]+@[^\s>]+\.\S+?)>/g, function (match, mailto, email) {
                return '<a href="mailto:' + email + '">' + email + '</a>';
            });
        });
    };

                undoStack[++stackPtr].restore();

define('extensions/containerConverter', [
    "classes/Extension",
], function (Extension) {
    var converter = new Extension("containerConverter", "Markdown Container", true);
    converter.onPagedownConfigure = function (editor) {
        editor.getConverter().hooks.chain("postConversion", function (text) {
            return text.replace(/::: (success|warning|info|danger) <br>\n(.+)\n:::/gm, function (match, level, context) {
                return '<div class="' + level + '">' + context + '</div>';
            });
        });
    };

    return converter;
});

define('extensions/todoList', [
    "classes/Extension",
], function (Extension) {
    var todoList = new Extension("todoList", "Markdown todoList", true);
    todoList.onPagedownConfigure = function (editor) {
        editor.getConverter().hooks.chain("postConversion", function (text) {
            return text.replace(/<li>(<p>)?\[([ xX]?)\] /g, function (matched, p, b) {
                p || (p = '');
                return !(b == 'x' || b == 'X') ? '<li class="m-todo-item m-todo-empty">' + p + '<input type="checkbox" /> ' : '<li class="m-todo-item m-todo-done">' + p + '<input type="checkbox" checked /> '
            });
        });
    };
    return todoList;
});

/**
scrollLink原理
 
1) preview分出一个个section
2) Md text通过这些section一个个取高度, 成mdSection
3) 将mdSection和previewSection建立映射
4) 滚动时, 通过scollTop()得到section的位置, 到另一边的section得到另一方scrollTop(), 滚动之
 
注意要点:
light下得到左侧的mdSection是通过helper, 每一个section的文字设到helper容器内得到高度. 所以helper的样式要和wmd-input的样式要一模一样, 不然就会有误差!!
 
 */
define('extensions/scrollLink', [
    // "jquery",
    "underscore",
    "classes/Extension",
    // "text!html/scrollLinkSettingsBlock.html"
], function (_, Extension) {

            var handled = false;

    var aceEditor;
    scrollLink.onAceCreated = function (aceEditorParam) {
        aceEditor = aceEditorParam;
    };

    var sectionList;
    scrollLink.onSectionsCreated = function (sectionListParam) {
        sectionList = sectionListParam;
    };

    var offsetBegin = 0;
    scrollLink.onMarkdownTrim = function (offsetBeginParam) {
        offsetBegin = offsetBeginParam;
    };

    var $textareaElt;
    var $textareaHelperElt;
    var $previewElt;
    var mdSectionList = [];
    var htmlSectionList = [];
    var lastEditorScrollTop;
    var lastPreviewScrollTop;
    var buildSections = _.debounce(function () {

        mdSectionList = [];
        var mdTextOffset = 0;
        var mdSectionOffset = 0;
        var firstSectionOffset = offsetBegin;
        var padding = 0;
        function addTextareaSection(sectionText) {
            var sectionHeight = padding;
            if (sectionText !== undefined) {
                var textNode = document.createTextNode(sectionText);
                $textareaHelperElt.empty().append(textNode);
                sectionHeight += $textareaHelperElt.prop('scrollHeight');
            }
            var newSectionOffset = mdSectionOffset + sectionHeight;
            mdSectionList.push({
                startOffset: mdSectionOffset,
                endOffset: newSectionOffset,
                height: sectionHeight
            });
            mdSectionOffset = newSectionOffset;
        }
        if (window.lightMode) {
            // Special treatment for light mode
            $textareaHelperElt.innerWidth($textareaElt.innerWidth());
            _.each(sectionList, function (section, index) {
                var sectionText = section.text;
                if (index !== sectionList.length - 1) {
                    if (sectionText.length === 0) {
                        sectionText = undefined;
                    }
                }
                else {
                    if (/\n$/.test(sectionText)) {
                        // Need to add a line break to take into account a final empty line
                        sectionText += '\n';
                    }
                }
                return;
            }
        };

            // Apply a coef to manage divergence in some browsers
            var theoricalHeight = _.last(mdSectionList).endOffset;
            var realHeight = $textareaElt[0].scrollHeight;
            var coef = realHeight / theoricalHeight;
            mdSectionList = _.map(mdSectionList, function (mdSection) {
                return {
                    startOffset: mdSection.startOffset * coef,
                    endOffset: mdSection.endOffset * coef,
                    height: mdSection.height * coef,
                };
            });
        }
        else {
            // Everything's much simpler with ACE
            _.each(sectionList, function (section) {
                mdTextOffset += section.text.length + firstSectionOffset;
                firstSectionOffset = 0;
                var documentPosition = aceEditor.session.doc.indexToPosition(mdTextOffset);
                var screenPosition = aceEditor.session.documentToScreenPosition(documentPosition.row, documentPosition.column);
                var newSectionOffset = screenPosition.row * aceEditor.renderer.lineHeight;
                var sectionHeight = newSectionOffset - mdSectionOffset;
                mdSectionList.push({
                    startOffset: mdSectionOffset,
                    endOffset: newSectionOffset,
                    height: sectionHeight
                });
                mdSectionOffset = newSectionOffset;
            });

            panels.input.onpaste = handlePaste;
            panels.input.ondrop = handlePaste;
        };

        var init = function () {
            setEventHandlers();
            refreshState(true);
            //Not necessary
            //saveState();
        };
        
        this.reinit = function(content, start, end, scrollTop) {
            undoStack = [];
            stackPtr = 0;
            mode = "none";
            lastState = undefined;
            timer = undefined;
            refreshState();
            inputStateObj.text = content;
            inputStateObj.start = start;
            inputStateObj.end = end;
            inputStateObj.scrollTop = scrollTop;
            inputStateObj.setInputAreaSelection();
            saveState();
        };
        this.setMode = setMode;

        init();
    }

    // end of UndoManager
    */

    // The input textarea state/contents.
    // This is used to implement undo/redo by the undo manager.
    function TextareaState(panels, isInitialState) {

        // Aliases
        var stateObj = this;
        var inputArea = panels.input;
        this.init = function () {
            /*benweet
            if (!util.isVisible(inputArea)) {
                return;
            }
            if (!isInitialState && doc.activeElement && doc.activeElement !== inputArea) { // this happens when tabbing out of the input box
                return;
            }
            */

            var Range = ace.require('ace/range').Range;
            (function(range) {
                stateObj.before = inputArea.session.getTextRange(new Range(0,0,range.start.row, range.start.column));
                stateObj.selection = inputArea.session.getTextRange();
                stateObj.after = inputArea.session.getTextRange(new Range(range.end.row, range.end.column, Number.MAX_VALUE, Number.MAX_VALUE));
            })(inputArea.selection.getRange());
            this.text = [this.before, this.selection, this.after].join('');
            this.length = this.text.length;
            this.setInputAreaSelectionStartEnd();
            this.scrollTop = inputArea.renderer.getScrollTop();
            /*benweet
            if (!this.text && inputArea.selectionStart || inputArea.selectionStart === 0) {
                this.text = inputArea.value;
            }
            */
        }

        // Try to find corresponding sections in the preview
        htmlSectionList = [];
        var htmlSectionOffset;
        var previewScrollTop = $previewElt.scrollTop();
        $previewElt.find(".preview-content > .se-section-delimiter").each(function () {
            if (htmlSectionOffset === undefined) {
                // Force start to 0 for the first section
                htmlSectionOffset = 0;
                return;
            }

            if (inputArea.selectionStart !== undefined && !uaSniffed.isOpera) {

    function getDestScrollTop(srcScrollTop, srcSectionList, destSectionList) {
        // Find the section corresponding to the offset
        var sectionIndex;
        var srcSection = _.find(srcSectionList, function (section, index) {
            sectionIndex = index;
            return srcScrollTop < section.endOffset;
        });
        if (srcSection === undefined) {
            // Something wrong in the algorithm...
            return;
        }
        var posInSection = (srcScrollTop - srcSection.startOffset) / (srcSection.height || 1);
        var destSection = destSectionList[sectionIndex];
        return destSection.startOffset + destSection.height * posInSection;
    }

    var isScrollEditor = false;
    var isScrollPreview = false;
    var isEditorMoving = false;
    var isPreviewMoving = false;
    var scrollingHelper = $('<div>');
    var doScrollLink = _.throttle(function () {
        if (mdSectionList.length === 0 || mdSectionList.length !== htmlSectionList.length) {
            // Delay
            doScrollLink();
            return;
        }
        var editorScrollTop = window.lightMode ? $textareaElt.scrollTop() : aceEditor.renderer.getScrollTop();
        editorScrollTop < 0 && (editorScrollTop = 0);
        var previewScrollTop = $previewElt.scrollTop();

        var destScrollTop;
        // Perform the animation if diff > 9px
        if (isScrollEditor === true) {
            if (Math.abs(editorScrollTop - lastEditorScrollTop) <= 9) {
                return;
            }
            isScrollEditor = false;
            // Animate the preview
            lastEditorScrollTop = editorScrollTop;
            destScrollTop = getDestScrollTop(editorScrollTop, mdSectionList, htmlSectionList);
            destScrollTop = _.min([
                destScrollTop,
                $previewElt.prop('scrollHeight') - $previewElt.outerHeight()
            ]);
            if (Math.abs(destScrollTop - previewScrollTop) <= 9) {
                // Skip the animation if diff is <= 9
                lastPreviewScrollTop = previewScrollTop;
                return;
            }
            scrollingHelper.stop('scrollLinkFx', true).css('value', 0).animate({
                value: destScrollTop - previewScrollTop
            }, {
                easing: 'linear',
                duration: 200,
                queue: 'scrollLinkFx',
                step: function (now) {
                    isPreviewMoving = true;
                    lastPreviewScrollTop = previewScrollTop + now;
                    $previewElt.scrollTop(lastPreviewScrollTop);
                },
                done: function () {
                    _.defer(function () {
                        isPreviewMoving = false;
                    });
                },
            }).dequeue('scrollLinkFx');
        }
        else if (isScrollPreview === true) {
            if (Math.abs(previewScrollTop - lastPreviewScrollTop) <= 9) {
                return;
            }
            isScrollPreview = false;
            // Animate the editor
            lastPreviewScrollTop = previewScrollTop;
            destScrollTop = getDestScrollTop(previewScrollTop, htmlSectionList, mdSectionList);
            if (window.lightMode) {
                destScrollTop = _.min([
                    destScrollTop,
                    $textareaElt.prop('scrollHeight') - $textareaElt.outerHeight()
                ]);
            }
            // Find the last modified char
            var endIndex = 0;
            var endIndexMax = stateObj.after.length;
            var beforeMaxOffset = stateObj.after.length - 1;
            var afterMaxOffset = stateObj.text.length - 1;
            while(endIndex < endIndexMax) {
                if(stateObj.after.charCodeAt(beforeMaxOffset - endIndex) !== stateObj.text.charCodeAt(afterMaxOffset - endIndex))
                    break;
                endIndex++;
            }
            if (Math.abs(destScrollTop - editorScrollTop) <= 9) {
                // Skip the animation if diff is <= 9
                lastEditorScrollTop = editorScrollTop;
                return;
            }
            scrollingHelper.stop('scrollLinkFx', true).css('value', 0).animate({
                value: destScrollTop - editorScrollTop
            }, {
                easing: 'linear',
                duration: 200,
                queue: 'scrollLinkFx',
                step: function (now) {
                    isEditorMoving = true;
                    lastEditorScrollTop = editorScrollTop + now;
                    window.lightMode || aceEditor.session.setScrollTop(lastEditorScrollTop);
                    window.lightMode && $textareaElt.scrollTop(lastEditorScrollTop);
                },
                done: function () {
                    _.defer(function () {
                        isEditorMoving = false;
                    });
                },
            }).dequeue('scrollLinkFx');
        }
    }, 100);

    scrollLink.onLayoutResize = function () {
        isScrollEditor = true;
        buildSections();
    };

    scrollLink.onFileClosed = function () {
        mdSectionList = [];
    };

    function initScrollEvent() {

        var managerObj = this;
        var timeout;
        var elapsedTime;
        var oldInputText;
        var maxDelay = 3000;
        var startType = "delayed"; // The other legal value is "manual"

        // Adds event listeners to elements
        /*benweet
        var setupEvents = function (inputElem, listener) {

        $previewElt.scroll(function () {
            if (isPreviewMoving === false && scrollAdjust === false) {
                isScrollPreview = true;
                isScrollEditor = false;
                doScrollLink();
            }
            scrollAdjust = false;
        });
        var handleEditorScroll = function () {
            if (isEditorMoving === false) {
                isScrollEditor = true;
                isScrollPreview = false;
                doScrollLink();
            }
            else
                if (doc.documentElement && doc.documentElement.scrollTop) {
                    result = doc.documentElement.scrollTop;
                }
                else
                    if (doc.body) {
                        result = doc.body.scrollTop;
                    }

            return result;
        };

        // editor 滚动时操作
        var timeout = isOnToggleMode ? 500 : 0;
        setTimeout(function () {
            if (window.lightMode) {
                $textareaElt.scroll(handleEditorScroll);
            }
            else {
                oldInputText = text;
            }

            var prevTime = new Date().getTime();

            text = converter.makeHtml(text);

            // Calculate the processing time of the HTML creation.
            // It's used as the delay time in the event listener.
            var currTime = new Date().getTime();
            elapsedTime = currTime - prevTime;

            pushPreviewHtml(text);
        };
        if(previewWrapper !== undefined) {
            makePreviewHtml = previewWrapper(makePreviewHtml);
        }

        // setTimeout is already used.  Used as an event listener.
        var applyTimeout = function () {

    var scrollAdjust = false;
    scrollLink.onReady = function () {
        $previewElt = $(".preview-container");
        $textareaElt = $("#wmd-input");
        // This helper is used to measure sections height in light mode
        $textareaHelperElt = $('.textarea-helper');

            if (startType !== "manual") {

        // 添加目录, 两种目录
        // Reimplement anchor scrolling to work without preview
        $('.extension-preview-buttons .table-of-contents, #preview-contents').on('click', 'a', function (evt) {
            var id = this.hash;
            if (!id) {
                return;
            }
            evt.preventDefault();
            var anchorElt = $('#preview-contents ' + decodeURIComponent(id));
            if (!anchorElt.length) {
                return;
            }
            return panel.scrollTop / (panel.scrollHeight - panel.clientHeight);
        };

        var setPanelScrollTops = function () {
            if (panels.preview) {
                panels.preview.scrollTop = (panels.preview.scrollHeight - panels.preview.clientHeight) * getScaleFactor(panels.preview);
            }
        };

    var $previewContentsElt;
    scrollLink.onPagedownConfigure = function (editor) {
        $previewContentsElt = $("#preview-contents");
        editor.getConverter().hooks.chain("postConversion", function (text) {
            // To avoid losing scrolling position before elements are fully
            // loaded
            $previewContentsElt.height($previewContentsElt.height());
            return text;
        });
    };

    scrollLink.onPreviewFinished = function () {
        // Now set the correct height
        var previousHeight = $previewContentsElt.height();
        $previewContentsElt.height("auto");
        var newHeight = $previewContentsElt.height();
        isScrollEditor = true;
        if (newHeight < previousHeight) {
            // We expect a scroll adjustment
            scrollAdjust = true;
        }

        var nonSuckyBrowserPreviewSet = function (text) {
            panels.preview.innerHTML = text;
        }

define('extensions/htmlSanitizer', [
    // "jquery",
    "underscore",
    "utils",
    "classes/Extension",
    // "ext!html/htmlSanitizerSettingsBlock.html"
], function (_, utils, Extension) {

    var htmlSanitizer = new Extension("htmlSanitizer", "HTML Sanitizer", true);
    // htmlSanitizer.settingsBlock = htmlSanitizerSettingsBlockHTML;

    var buf;
    htmlSanitizer.onPagedownConfigure = function (editor) {
        var converter = editor.getConverter();
        converter.hooks.chain("postConversion", function (html) {
            buf = [];
            html.split('<div class="se-preview-section-delimiter"></div>').forEach(function (sectionHtml) {
                htmlParser(sectionHtml, htmlSanitizeWriter(buf
                      /*, function(uri, isImage) {
                      return !/^unsafe/.test(sanitizeUri(uri, isImage));
                  }*/));
                buf.push('<div class="se-preview-section-delimiter"></div>');
            });
            return buf.slice(0, -1).join('');
        });
    };

    /**
     * @license AngularJS v1.2.16
     * (c) 2010-2014 Google, Inc. http://angularjs.org
     * License: MIT
     */

    // var aHrefSanitizationWhitelist = /^\s*(https?|ftp|mailto|tel|file):/,
    // imgSrcSanitizationWhitelist = /^\s*(https?|ftp|file|leanote):|data:image\//;
    /*
    var urlResolve = (function() {
        var urlParsingNode = document.createElement("a");
        return function urlResolve(url) {
            var href = url;
 
            if (utils.msie) {
                // Normalize before parse.  Refer Implementation Notes on why this is
                // done in two steps on IE.
                urlParsingNode.setAttribute("href", href);
                href = urlParsingNode.href;
            }
 
            urlParsingNode.setAttribute('href', href);
 
            // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
            return {
                href: urlParsingNode.href,
                protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
                host: urlParsingNode.host,
                search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
                hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
                hostname: urlParsingNode.hostname,
                port: urlParsingNode.port,
                pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                    urlParsingNode.pathname : '/' + urlParsingNode.pathname
            };
        };
    })();
 
    function sanitizeUri(uri, isImage) {
        var regex = isImage ? imgSrcSanitizationWhitelist : aHrefSanitizationWhitelist;
        var normalizedVal;
        normalizedVal = urlResolve(uri).href;
        if(normalizedVal !== '' && !normalizedVal.match(regex)) {
            return 'unsafe:' + normalizedVal;
        }
    }
    */

    // Regular Expressions for parsing tags and attributes
    var START_TAG_REGEXP =
        /^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/,
        END_TAG_REGEXP = /^<\s*\/\s*([\w:-]+)[^>]*>/,
        ATTR_REGEXP = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
        BEGIN_TAG_REGEXP = /^</,
        BEGING_END_TAGE_REGEXP = /^<\s*\//,
        COMMENT_REGEXP = /<!--(.*?)-->/g,
        DOCTYPE_REGEXP = /<!DOCTYPE([^>]*?)>/i,
        CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g,
        // Match everything outside of normal chars and " (quote character)
        NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;

    function makeMap(str) {
        var obj = {}, items = str.split(','), i;
        for (i = 0; i < items.length; i++) {
            obj[items[i]] = true;
        }
        return obj;
    }

    // Good source of info about elements and attributes
    // http://dev.w3.org/html5/spec/Overview.html#semantics
    // http://simon.html5.org/html-elements

    // Safe Void Elements - HTML5
    // http://dev.w3.org/html5/spec/Overview.html#void-elements
    var voidElements = makeMap("area,br,col,hr,img,wbr");

    // Elements that you can, intentionally, leave open (and which close themselves)
    // http://dev.w3.org/html5/spec/Overview.html#optional-tags
    var optionalEndTagBlockElements = makeMap("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
        optionalEndTagInlineElements = makeMap("rp,rt"),
        optionalEndTagElements = _.extend({},
            optionalEndTagInlineElements,
            optionalEndTagBlockElements);

    // 允许的elements
    // Safe Block Elements - HTML5
    var blockElements = _.extend({}, optionalEndTagBlockElements, makeMap("address,article," +
        "aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5," +
        "h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul,embed,iframe"));

    // Inline Elements - HTML5
    var inlineElements = _.extend({}, optionalEndTagInlineElements, makeMap("a,abbr,acronym,b," +
        "bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s," +
        "samp,small,span,strike,strong,sub,sup,time,tt,u,var,input"));

    // Special Elements (can contain anything)
    // var specialElements = makeMap("script,style"); //  style为什么需要, 是因为表格style="align:left"
    var specialElements = makeMap("script"); //  style为什么需要, 是因为表格style="align:left"

    // benweet: Add iframe
    // blockElements.iframe = true;

    var validElements = _.extend({},
        voidElements,
        blockElements,
        inlineElements,
        optionalEndTagElements);

    //Attributes that have href and hence need to be sanitized
    var uriAttrs = makeMap("background,cite,href,longdesc,src,usemap");
    var validAttrs = _.extend({}, uriAttrs, makeMap(
        'abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,' +
        'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,' +
        'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,' +
        'scope,scrolling,shape,size,span,start,summary,target,title,type,' +
        'valign,value,vspace,width,checked,style')); // style为什么需要, 是因为表格style="align:left"

    // benweet: Add id and allowfullscreen (YouTube iframe)
    validAttrs.id = true;
    validAttrs.allowfullscreen = true;

    /*
     * HTML Parser By Misko Hevery (misko@hevery.com)
     * based on:  HTML Parser By John Resig (ejohn.org)
     * Original code by Erik Arvidsson, Mozilla Public License
     * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
     *
     * // Use like so:
     * htmlParser(htmlString, {
     *     start: function(tag, attrs, unary) {},
     *     end: function(tag) {},
     *     chars: function(text) {},
     *     comment: function(text) {}
     * });
     *
     */
    /* jshint -W083 */
    function htmlParser(html, handler) {
        var index, chars, match, stack = [], last = html;
        stack.last = function () {
            return stack[stack.length - 1];
        };

        function parseStartTag(tag, tagName, rest, unary) {
            tagName = tagName && tagName.toLowerCase();
            if (blockElements[tagName]) {
                while (stack.last() && inlineElements[stack.last()]) {
                    parseEndTag("", stack.last());
                }
            }

            if (optionalEndTagElements[tagName] && stack.last() == tagName) {
                parseEndTag("", tagName);
            }

            unary = voidElements[tagName] || !!unary;

            if (!unary) {
                stack.push(tagName);
            }

            var attrs = {};

            rest.replace(ATTR_REGEXP,
                function (match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
                    var value = doubleQuotedValue ||
                        singleQuotedValue ||
                        unquotedValue ||
                        '';

                    attrs[name] = decodeEntities(value);
                });
            if (handler.start) {
                handler.start(tagName, attrs, unary);
            }
        }

        function parseEndTag(tag, tagName) {
            var pos = 0, i;
            tagName = tagName && tagName.toLowerCase();
            if (tagName) {
                // Find the closest opened tag of the same type
                for (pos = stack.length - 1; pos >= 0; pos--) {
                    if (stack[pos] == tagName) {
                        break;
                    }
                }
            }

            if (pos >= 0) {
                // Close all the open elements, up the stack
                for (i = stack.length - 1; i >= pos; i--) {
                    if (handler.end) {
                        handler.end(stack[i]);
                    }
                }

                // Remove the open elements from the stack
                stack.length = pos;
            }
        }

        while (html) {
            chars = true;

            // Make sure we're not in a script or style element
            if (!stack.last() || !specialElements[stack.last()]) {

                // Comment
                if (html.indexOf("<!--") === 0) {
                    // comments containing -- are not allowed unless they terminate the comment
                    index = html.indexOf("--", 4);

                    if (index >= 0 && html.lastIndexOf("-->", index) === index) {
                        if (handler.comment) {
                            handler.comment(html.substring(4, index));
                        }
                        html = html.substring(index + 3);
                        chars = false;
                    }
                    // DOCTYPE
                } else if (DOCTYPE_REGEXP.test(html)) {
                    match = html.match(DOCTYPE_REGEXP);

                    if (match) {
                        html = html.replace(match[0], '');
                        chars = false;
                    }
                    // end tag
                } else if (BEGING_END_TAGE_REGEXP.test(html)) {
                    match = html.match(END_TAG_REGEXP);

                    if (match) {
                        html = html.substring(match[0].length);
                        match[0].replace(END_TAG_REGEXP, parseEndTag);
                        chars = false;
                    }

                    // start tag
                } else if (BEGIN_TAG_REGEXP.test(html)) {
                    match = html.match(START_TAG_REGEXP);

                    if (match) {
                        html = html.substring(match[0].length);
                        match[0].replace(START_TAG_REGEXP, parseStartTag);
                        chars = false;
                    }
                }

                if (chars) {
                    index = html.indexOf("<");

                    var text = index < 0 ? html : html.substring(0, index);
                    html = index < 0 ? "" : html.substring(index);

                    if (handler.chars) {
                        handler.chars(decodeEntities(text));
                    }
                }

            } else {
                html = html.replace(new RegExp("(.*)<\\s*\\/\\s*" + stack.last() + "[^>]*>", 'i'),
                    function (all, text) {
                        text = text.replace(COMMENT_REGEXP, "$1").replace(CDATA_REGEXP, "$1");

                        if (handler.chars) {
                            handler.chars(decodeEntities(text));
                        }

                        return "";
                    });

                parseEndTag("", stack.last());
            }

            if (html == last) {
                //throw new Error("The sanitizer was unable to parse the following block of html: " + html);
                stack.reverse();
                return stack.forEach(function (tag) {
                    buf.push('</');
                    buf.push(tag);
                    buf.push('>');
                });
            }
            last = html;
        }

        // Clean up any remaining tags
        parseEndTag();
    }

    var hiddenPre = document.createElement("pre");
    var spaceRe = /^(\s*)([\s\S]*?)(\s*)$/;

    /**
     * decodes all entities into regular string
     * @param value
     * @returns {string} A string with decoded entities.
     */
    function decodeEntities(value) {
        if (!value) {
            return '';
        }

        // Note: IE8 does not preserve spaces at the start/end of innerHTML
        // so we must capture them and reattach them afterward
        var parts = spaceRe.exec(value);
        var spaceBefore = parts[1];
        var spaceAfter = parts[3];
        var content = parts[2];
        if (content) {
            hiddenPre.innerHTML = content.replace(/</g, "&lt;");
            // innerText depends on styling as it doesn't display hidden elements.
            // Therefore, it's better to use textContent not to cause unnecessary
            // reflows. However, IE<9 don't support textContent so the innerText
            // fallback is necessary.
            content = 'textContent' in hiddenPre ?
                hiddenPre.textContent : hiddenPre.innerText;
        }
        return spaceBefore + content + spaceAfter;
    }

    /**
     * Escapes all potentially dangerous characters, so that the
     * resulting string can be safely inserted into attribute or
     * element text.
     * @param value
     * @returns {string} escaped text
     */
    function encodeEntities(value) {
        return value.
            replace(/&/g, '&amp;').
            replace(NON_ALPHANUMERIC_REGEXP, function (value) {
                return '&#' + value.charCodeAt(0) + ';';
            }).
            replace(/</g, '&lt;').
            replace(/>/g, '&gt;');
    }


    /**
     * create an HTML/XML writer which writes to buffer
     * @param {Array} buf use buf.jain('') to get out sanitized html string
     * @returns {object} in the form of {
     *     start: function(tag, attrs, unary) {},
     *     end: function(tag) {},
     *     chars: function(text) {},
     *     comment: function(text) {}
     * }
     */
    function htmlSanitizeWriter(buf /* , uriValidator */) {
        var ignore = false;
        var out = _.bind(buf.push, buf);
        return {
            start: function (tag, attrs, unary) {
                tag = tag && tag.toLowerCase();
                if (!ignore && specialElements[tag]) {
                    ignore = tag;
                }
                if (!ignore && validElements[tag] === true) {
                    out('<');
                    out(tag);
                    _.forEach(attrs, function (value, key) {
                        var lkey = key && key.toLowerCase();
                        // var isImage = (tag === 'img' && lkey === 'src') || (lkey === 'background');
                        if (validAttrs[lkey] === true &&
                            (uriAttrs[lkey] !== true || true/* || uriValidator(value, isImage) */)) {
                            out(' ');
                            out(key);
                            out('="');
                            out(encodeEntities(value));
                            out('"');
                        }
                    });
                    out(unary ? '/>' : '>');
                }
            },
            end: function (tag) {
                tag = tag && tag.toLowerCase();
                if (!ignore && validElements[tag] === true) {
                    out('</');
                    out(tag);
                    out('>');
                }
                if (tag == ignore) {
                    ignore = false;
                }
            },
            chars: function (chars) {
                if (!ignore) {
                    out(encodeEntities(chars));
                }
            },
            comment: function (comment) {
                if (!ignore) {
                    out('<!--');
                    out(encodeEntities(comment));
                    out('-->');
                }
            }
        };
    }

    return htmlSanitizer;
});

define('eventMgr', [
    // "jquery",
    "underscore",
    "crel",
    "utils",
    "classes/Extension",
    "settings",
    // "text!html/settingsExtensionsAccordion.html",
    // "extensions/yamlFrontMatterParser",
    "extensions/markdownSectionParser",
    "extensions/partialRendering",
    // "extensions/buttonMarkdownSyntax",
    // "extensions/googleAnalytics",
    // "extensions/twitter",
    // "extensions/dialogAbout",
    // "extensions/dialogManagePublication",
    // "extensions/dialogManageSynchronization",
    // "extensions/dialogManageSharing",
    // "extensions/dialogOpenHarddrive",
    // "extensions/documentTitle",
    // "extensions/documentSelector",
    // "extensions/documentPanel",
    // "extensions/documentManager",
    // "extensions/workingIndicator",
    // "extensions/notifications",
    "extensions/prismJsToolbar",
    "extensions/umlDiagrams",
    //   "extensions/markdownExtra",
    "extensions/toc",
    //   "extensions/mathJax",
    //   "extensions/emailConverter",
    //   "extensions/containerConverter",
    //   "extensions/todoList",
    "extensions/scrollLink",
    //   "extensions/htmlSanitizer",
    // "extensions/buttonFocusMode",
    // "extensions/buttonSync",
    // "extensions/buttonPublish",
    // "extensions/buttonStat",
    // "extensions/buttonHtmlCode",
    // "extensions/buttonViewer",
    // "extensions/welcomeTour",
    // "extensions/spellCheck",
    // "extensions/userCustom",
    // "bootstrap",
    "jquery-waitforimages"
], function (_, crel, utils, Extension, settings, settingsExtensionsAccordionHTML) {

    // chunk: The selected region that will be enclosed with */**
    // nStars: 1 for italics, 2 for bold
    // insertText: If you just click the button without highlighting text, this gets inserted
    commandProto.doBorI = function (chunk, postProcessing, nStars, insertText) {

    // Create a list of extensions from module arguments
    var extensionList = _.chain(arguments).map(function (argument) {
        return argument instanceof Extension && argument;
    }).compact().value();

    // Configure extensions
    var extensionSettings = settings.extensionSettings || {};
    _.each(extensionList, function (extension) {
        // Set the extension.config attribute from settings or default
        // configuration
        extension.config = _.extend({}, extension.defaultConfig, extensionSettings[extension.extensionId]);
        if (window.viewerMode === true && extension.disableInViewer === true) {
            // Skip enabling the extension if we are in the viewer and extension
            // doesn't support it
            extension.enabled = false;
        }
        else if (window.lightMode === true && extension.disableInLight === true) {
            // Same for light mode
            extension.enabled = false;
        }
        else {

            // In most cases, if you don't have any selected text and click the button
            // you'll get a selected, marked up region with the default text inserted.
            if (!chunk.selection && !starsAfter) {
                chunk.selection = insertText;
            }

            // Add the true markup.
            var markup = nStars <= 1 ? "*" : "**"; // shouldn't the test be = ?
            chunk.before = chunk.before + markup;
            chunk.after = markup + chunk.after;
        }

    // Returns all listeners with the specified name that are implemented in the
    // enabled extensions
    function getExtensionListenerList(eventName) {
        return _.chain(extensionList).map(function (extension) {
            return extension.enabled && extension[eventName];
        }).compact().value();
    }

    // Returns a function that calls every listeners with the specified name
    // from all enabled extensions
    var eventListenerListMap = {};
    function createEventHook(eventName) {
        eventListenerListMap[eventName] = getExtensionListenerList(eventName);
        return function () {
            var eventArguments = arguments;
            _.each(eventListenerListMap[eventName], function (listener) {
                // Use try/catch in case userCustom listener contains error
                try {
                    listener.apply(null, eventArguments);
                }
                catch (e) {
                    console.error(_.isObject(e) ? e.stack : e);
                }
                return "";
            });

        return text;
    };

    commandProto.addLinkDef = function (chunk, linkDef) {

        var refNumber = 0; // The current reference number
        var defsToAdd = {}; //
        // Start with a clean slate by removing all previous link definitions.
        chunk.before = this.stripLinkDefs(chunk.before, defsToAdd);
        chunk.selection = this.stripLinkDefs(chunk.selection, defsToAdd);
        chunk.after = this.stripLinkDefs(chunk.after, defsToAdd);

        var defs = "";
        var regex = /(\[)((?:\[[^\]]*\]|[^\[\]])*)(\][ ]?(?:\n[ ]*)?\[)(\d+)(\])/g;

        var addDefNumber = function (def) {
            refNumber++;
            def = def.replace(/^[ ]{0,3}\[(\d+)\]:/, "  [" + refNumber + "]:");
            defs += "\n" + def;
        };

        // note that
        // a) the recursive call to getLink cannot go infinite, because by definition
        //    of regex, inner is always a proper substring of wholeMatch, and
        // b) more than one level of nesting is neither supported by the regex
        //    nor making a lot of sense (the only use case for nesting is a linked image)
        var getLink = function (wholeMatch, before, inner, afterInner, id, end) {
            inner = inner.replace(regex, getLink);
            if (defsToAdd[id]) {
                addDefNumber(defsToAdd[id]);
                return before + inner + afterInner + refNumber + end;
            }
            return wholeMatch;
        };

    // Used by external modules (not extensions) to listen to events
    eventMgr.addListener = function (eventName, listener) {
        try {
            eventListenerListMap[eventName].push(listener);
        }
        catch (e) {
            console.error('No event listener called ' + eventName);
        }

        var refOut = refNumber;

    // Load/Save extension config from/to settings
    eventMgr.onLoadSettings = function () {
        _.each(extensionList, function (extension) {
            var isChecked = !extension.isOptional || extension.config.enabled === undefined || extension.config.enabled === true;
            utils.setInputChecked("#input-enable-extension-" + extension.extensionId, isChecked);
            // Special case for Markdown Extra and MathJax
            if (extension.extensionId == 'markdownExtra') {
                utils.setInputChecked("#input-settings-markdown-extra", isChecked);
            }
            else if (extension.extensionId == 'mathJax') {
                utils.setInputChecked("#input-settings-mathjax", isChecked);
            }
            return title ? link + ' "' + title + '"' : link;
        });
    };
    eventMgr.onSaveSettings = function (newExtensionSettings, event) {
        _.each(extensionList, function (extension) {
            if (window.lightMode === true && extension.disableInLight === true) {
                newExtensionSettings[extension.extensionId] = extension.config;
                return;
            }
            var newExtensionConfig = _.extend({}, extension.defaultConfig);
            newExtensionConfig.enabled = utils.getInputChecked("#input-enable-extension-" + extension.extensionId);
            var isChecked;
            // Special case for Markdown Extra and MathJax
            if (extension.extensionId == 'markdownExtra') {
                isChecked = utils.getInputChecked("#input-settings-markdown-extra");
                if (isChecked != extension.enabled) {
                    newExtensionConfig.enabled = isChecked;
                }
            }
            else if (extension.extensionId == 'mathJax') {
                isChecked = utils.getInputChecked("#input-settings-mathjax");
                if (isChecked != extension.enabled) {
                    newExtensionConfig.enabled = isChecked;
                }
                postProcessing();
            };

            background = ui.createBackground();
            linkEnteredCallback(link);
            return true;
        }
    };

    commandProto.doLinkOrImage = function (chunk, postProcessing, isImage) {

        chunk.trimWhitespace();
        //chunk.findTags(/\s*!?\[/, /\][ ]?(?:\n[ ]*)?(\[.*?\])?/);
        chunk.findTags(/\s*!?\[/, /\][ ]?(?:\n[ ]*)?(\(.*?\))?/);

        var background;

        if (chunk.endTag.length > 1 && chunk.startTag.length > 0) {

            chunk.startTag = chunk.startTag.replace(/!?\[/, "");
            chunk.endTag = "";
            this.addLinkDef(chunk, null);

        }
        else {

            // We're moving start and end tag back into the selection, since (as we're in the else block) we're not
            // *removing* a link, but *adding* one, so whatever findTags() found is now back to being part of the
            // link text. linkEnteredCallback takes care of escaping any brackets.
            chunk.selection = chunk.startTag + chunk.selection + chunk.endTag;
            chunk.startTag = chunk.endTag = "";

            if (/\n\n/.test(chunk.selection)) {
                this.addLinkDef(chunk, null);
                return;
            }
            var that = this;
            // The function to be executed when you enter a link and press OK or Cancel.
            // Marks up the link and adds the ref.
            var linkEnteredCallback = function (link, text) {
                background.parentNode.removeChild(background);

                if (link !== null) {
                    // (                          $1
                    //     [^\\]                  anything that's not a backslash
                    //     (?:\\\\)*              an even number (this includes zero) of backslashes
                    // )
                    // (?=                        followed by
                    //     [[\]]                  an opening or closing bracket
                    // )
                    //
                    // In other words, a non-escaped bracket. These have to be escaped now to make sure they
                    // don't count as the end of the link or similar.
                    // Note that the actual bracket has to be a lookahead, because (in case of to subsequent brackets),
                    // the bracket in one match may be the "not a backslash" character in the next match, so it
                    // should not be consumed by the first match.
                    // The "prepend a space and finally remove it" steps makes sure there is a "not a backslash" at the
                    // start of the string, so this also works if the selection begins with a bracket. We cannot solve
                    // this by anchoring with ^, because in the case that the selection starts with two brackets, this
                    // would mean a zero-width match at the start. Since zero-width matches advance the string position,
                    // the first bracket could then not act as the "not a backslash" for the second.
                    chunk.selection = (" " + chunk.selection).replace(/([^\\](?:\\\\)*)(?=[[\]])/g, "$1\\").substr(1);

                    /*
                    var linkDef = " [999]: " + properlyEncoded(link);

                    var num = that.addLinkDef(chunk, linkDef);
                    */
                    chunk.startTag = isImage ? "![" : "[";
                    // chunk.endTag = "][" + num + "]";
                    chunk.endTag = "](" + properlyEncoded(link) + ")";

                    if (!chunk.selection) {
                        var str = '';
                        if (text) {
                            str = text;
                        } else if (isImage) {
                            str = that.getString("imagedescription");
                        }
                        else {
                            str = that.getString("linkdescription");
                        }

                        chunk.selection = str;
                    }
                }
                postProcessing();
            };

    // Operation on ACE
    addEventHook("onAceCreated");

    // Refresh twitter buttons
    // addEventHook("onTweet");


    var onPreviewFinished = createEventHook("onPreviewFinished");
    var onAsyncPreviewListenerList = getExtensionListenerList("onAsyncPreview");
    var previewContentsElt;
    var $previewContentsElt;
    eventMgr.onAsyncPreview = function () {
        function recursiveCall(callbackList) {
            var callback = callbackList.length ? callbackList.shift() : function () {
                _.defer(function () {
                    var html = "";
                    _.each(previewContentsElt.children, function (elt) {
                        html += elt.innerHTML;
                    });
                    html = html.replace(/^<div class="se-section-delimiter"><\/div>\n\n/gm, '');
                    var htmlWithComments = utils.trim(html);
                    var htmlWithoutComments = htmlWithComments.replace(/ <span class="comment label label-danger">.*?<\/span> /g, '');
                    onPreviewFinished(htmlWithComments, htmlWithoutComments);
                });
            };
            callback(function () {
                recursiveCall(callbackList);
            });
            fakeSelection = true;
        }

        if (/(\n|^)[ ]{0,3}([*+-]|\d+[.])[ \t]+.*\n$/.test(chunk.before)) {
            if (commandMgr.doList) {
                commandMgr.doList(chunk);
            }
        }
        if (/(\n|^)[ ]{0,3}>[ \t]+.*\n$/.test(chunk.before)) {
            if (commandMgr.doBlockquote) {
                commandMgr.doBlockquote(chunk);
            }
        }
        if (/(\n|^)(\t|[ ]{4,}).*\n$/.test(chunk.before)) {
            if (commandMgr.doCode) {
                commandMgr.doCode(chunk);
            }
        }

        if (fakeSelection) {
            chunk.after = chunk.selection + chunk.after;
            chunk.selection = "";
        }
        recursiveCall(onAsyncPreviewListenerList.concat([function (callback) {
            // We assume some images are loading asynchronously after the preview
            $previewContentsElt.waitForImages(callback);
        }]));
    };

    var onReady = createEventHook("onReady");
    eventMgr.onReady = function () {
        previewContentsElt = document.getElementById('preview-contents');
        $previewContentsElt = $(previewContentsElt);

        // Create a button from an extension listener
        var createBtn = function (listener) {
            var buttonGrpElt = crel('div', {
                class: 'btn-group'
            });
            var btnElt = listener();
            if (_.isString(btnElt)) {
                buttonGrpElt.innerHTML = btnElt;
            }
            else if (_.isElement(btnElt)) {
                buttonGrpElt.appendChild(btnElt);
            }
        };

        if (window.viewerMode === false) {
            // // Create accordion in settings dialog
            // var accordionHtml = _.chain(extensionList).sortBy(function(extension) {
            //     return extension.extensionName.toLowerCase();
            // }).reduce(function(html, extension) {
            //     return html + (extension.settingsBlock && !(window.lightMode === true && extension.disableInLight === true) ? _.template(settingsExtensionsAccordionHTML, {
            //         extensionId: extension.extensionId,
            //         extensionName: extension.extensionName,
            //         isOptional: extension.isOptional,
            //         settingsBlock: extension.settingsBlock
            //     }) : "");
            // }, "").value();
            // document.querySelector('.accordion-extensions').innerHTML = accordionHtml;

            // // Create extension buttons
            // logger.log("onCreateButton");
            // var onCreateButtonListenerList = getExtensionListenerList("onCreateButton");
            // var extensionButtonsFragment = document.createDocumentFragment();
            // _.each(onCreateButtonListenerList, function(listener) {
            //     extensionButtonsFragment.appendChild(createBtn(listener));
            // });
            // document.querySelector('.extension-buttons').appendChild(extensionButtonsFragment);

            // Create extension editor buttons
            // logger.log("onCreateEditorButton");
            var onCreateEditorButtonListenerList = getExtensionListenerList("onCreateEditorButton");
            var extensionEditorButtonsFragment = document.createDocumentFragment();
            _.each(onCreateEditorButtonListenerList, function (listener) {
                extensionEditorButtonsFragment.appendChild(createBtn(listener));
            });
            // var editorButtonsElt = document.querySelector('.extension-editor-buttons');
            // editorButtonsElt.appendChild(extensionEditorButtonsFragment);
        }

        // Create extension preview buttons
        // logger.log("onCreatePreviewButton");
        var onCreatePreviewButtonListenerList = getExtensionListenerList("onCreatePreviewButton");
        var extensionPreviewButtonsFragment = document.createDocumentFragment();
        _.each(onCreatePreviewButtonListenerList, function (listener) {
            extensionPreviewButtonsFragment.appendChild(createBtn(listener));
        });
        var previewButtonsElt = document.querySelector('.extension-preview-buttons');
        previewButtonsElt.appendChild(extensionPreviewButtonsFragment);

        // A bit of jQuery...
        var $previewButtonsElt = $(previewButtonsElt);
        var previewButtonsWidth = $previewButtonsElt.width();
        $previewButtonsElt.find('.btn-group').each(function () {
            var $btnGroupElt = $(this);
            // Align dropdown to the left of the screen
            $btnGroupElt.find('.dropdown-menu').css({
                right: -previewButtonsWidth + $btnGroupElt.width() + $btnGroupElt.position().left
            });
        });

        // Call onReady listeners
        onReady();
    };

    // For extensions that need to call other extensions
    eventMgr.onEventMgrCreated(eventMgr);
    return eventMgr;
});

define('shortcutMgr', [
    "underscore",
    "eventMgr",
    "utils",
], function (_, eventMgr, utils, settingsShortcutEntryHTML) {

        var hasTextBefore = /\S[ ]*$/.test(chunk.before);
        var hasTextAfter = /^[ ]*\S/.test(chunk.after);

        // Use 'four space' markdown if the selection is on its own
        // line or is multiline.
        if ((!hasTextAfter && !hasTextBefore) || /\n/.test(chunk.selection)) {

            chunk.before = chunk.before.replace(/[ ]{4}$/,
                function (totalMatch) {
                    chunk.selection = totalMatch + chunk.selection;
                    return "";
                });

            var nLinesBack = 1;
            var nLinesForward = 1;

            if (/(\n|^)(\t|[ ]{4,}).*\n$/.test(chunk.before)) {
                nLinesBack = 0;
            }
            if (/^\n(\t|[ ]{4,})/.test(chunk.after)) {
                nLinesForward = 0;
            }

            chunk.skipLines(nLinesBack, nLinesForward);

            if (!chunk.selection) {
                chunk.startTag = "    ";
                chunk.selection = this.getString("codeexample");
            }
            else {
                if (/^[ ]{0,3}\S/m.test(chunk.selection)) {
                    if (/\n/.test(chunk.selection))
                        chunk.selection = chunk.selection.replace(/^/gm, "    ");
                    else // if it's not multiline, do not select the four added spaces; this is more consistent with the doList behavior
                        chunk.before += "    ";
                }
                else {
                    chunk.selection = chunk.selection.replace(/^(?:[ ]{4}|[ ]{0,3}\t)/gm, "");
                }
            }
        }
        else {
            // Use backticks (`) to delimit the code block.

            chunk.trimWhitespace();
            chunk.findTags(/`/, /`/);

            if (!chunk.startTag && !chunk.endTag) {
                chunk.startTag = chunk.endTag = "`";
                if (!chunk.selection) {
                    chunk.selection = this.getString("codeexample");
                }
            }
            else if (chunk.endTag && !chunk.startTag) {
                chunk.before += chunk.endTag;
                chunk.endTag = "";
            }
            else {
                chunk.startTag = chunk.endTag = "";
            }
        }
    };

    commandProto.doList = function (chunk, postProcessing, isNumberedList) {

        // These are identical except at the very beginning and end.
        // Should probably use the regex extension function to make this clearer.
        var previousItemsRegex = /(\n|^)(([ ]{0,3}([*+-]|\d+[.])[ \t]+.*)(\n.+|\n{2,}([*+-].*|\d+[.])[ \t]+.*|\n{2,}[ \t]+\S.*)*)\n*$/;
        var nextItemsRegex = /^\n*(([ ]{0,3}([*+-]|\d+[.])[ \t]+.*)(\n.+|\n{2,}([*+-].*|\d+[.])[ \t]+.*|\n{2,}[ \t]+\S.*)*)\n*/;

        // The default bullet is a dash but others are possible.
        // This has nothing to do with the particular HTML bullet,
        // it's just a markdown bullet.
        var bullet = "-";

        // The number in a numbered list.
        var num = 1;

        // Get the item prefix - e.g. " 1. " for a numbered list, " - " for a bulleted list.
        var getItemPrefix = function () {
            var prefix;
            if (isNumberedList) {
                prefix = " " + num + ". ";
                num++;
            }
            else {
                prefix = " " + bullet + " ";
            }
            return prefix;
        };

        // Fixes the prefixes of the other list items.
        var getPrefixedItem = function (itemText) {

            // The numbering flag is unset when called by autoindent.
            if (isNumberedList === undefined) {
                isNumberedList = /^\s*\d/.test(itemText);
            }

            // Renumber/bullet the list element.
            itemText = itemText.replace(/^[ ]{0,3}([*+-]|\d+[.])\s/gm,
                function (_) {
                    return getItemPrefix();
                });

            return itemText;
        };

        chunk.findTags(/(\n|^)*[ ]{0,3}([*+-]|\d+[.])\s+/, null);

        if (chunk.before && !/\n$/.test(chunk.before) && !/^\n/.test(chunk.startTag)) {
            chunk.before += chunk.startTag;
            chunk.startTag = "";
        }

        if (chunk.startTag) {

            var hasDigits = /\d+[.]/.test(chunk.startTag);
            chunk.startTag = "";
            chunk.selection = chunk.selection.replace(/\n[ ]{4}/g, "\n");
            this.unwrap(chunk);
            chunk.skipLines();

            if (hasDigits) {
                // Have to renumber the bullet points if this is a numbered list.
                chunk.after = chunk.after.replace(nextItemsRegex, getPrefixedItem);
            }
            if (isNumberedList == hasDigits) {
                return;
            }
        }

        var nLinesUp = 1;

        chunk.before = chunk.before.replace(previousItemsRegex,
            function (itemText) {
                if (/^\s*([*+-])/.test(itemText)) {
                    bullet = re.$1;
                }
                nLinesUp = /[^\n]\n\n[^\n]/.test(itemText) ? 1 : 0;
                return getPrefixedItem(itemText);
            });

        if (!chunk.selection) {
            chunk.selection = this.getString("litem");
        }

        var prefix = getItemPrefix();

        var nLinesDown = 1;

        chunk.after = chunk.after.replace(nextItemsRegex,
            function (itemText) {
                nLinesDown = /[^\n]\n\n[^\n]/.test(itemText) ? 1 : 0;
                return getPrefixedItem(itemText);
            });

        chunk.trimWhitespace(true);
        chunk.skipLines(nLinesUp, nLinesDown, true);
        chunk.startTag = prefix;
        var spaces = prefix.replace(/./g, " ");
        this.wrap(chunk, SETTINGS.lineLength - spaces.length);
        chunk.selection = chunk.selection.replace(/\n/g, "\n" + spaces);

    };

    // 要改成 ## ### #### 
    // life 2015/7/12
    commandProto.doHeading = function (chunk, postProcessing) {
        // Remove leading/trailing whitespace and reduce internal spaces to single spaces.
        chunk.selection = chunk.selection.replace(/\s+/g, " ");
        chunk.selection = chunk.selection.replace(/(^\s+|\s+$)/g, "");

        // If we clicked the button with no selected text, we just
        // make a level 2 hash header around some default text.
        if (!chunk.selection) {
            // 需要skip的时候 life
            if(chunk.before && (chunk.before[chunk.before.length - 1] != "\n")) {
                chunk.skipLines(1, 1);
            }
            chunk.startTag = "# ";
            chunk.selection = this.getString("headingexample");
            chunk.endTag = ""; // ##
            return;
        }

        chunk.findTags(/#+[ ]*/, /[ ]*#+/);
        // console.log(chunk);

        if(chunk.before && (chunk.before[chunk.before.length - 1] != "\n")) {
            chunk.skipLines(1, 1);
        }

        var beforeHLevel = 0;
        var startTag = chunk.startTag;
        if (/^#+[ ]*$/.test(startTag)) {
            startTag = startTag.replace(/ /g, '');
            beforeHLevel = startTag.length;
        }

        // [0, 4]
        var headerLevelToCreate = 0;
        if(beforeHLevel >= 0 && beforeHLevel <= 3) {
            headerLevelToCreate = beforeHLevel + 1;
        }
        if(beforeHLevel >= 4) {
            headerLevelToCreate = 0;
            chunk.startTag = '';
        }

        if (headerLevelToCreate > 0) {
            var header = "";
            while (headerLevelToCreate--) {
                header += "#";
            }
            header += " ";

            chunk.startTag = header;
        }
        return;
    };

    commandProto.doHorizontalRule = function (chunk, postProcessing) {
        chunk.startTag = "----------\n";
        chunk.selection = "";
        chunk.skipLines(1, 1, true);
    }

})();

define("pagedown-ace", function(){});

(function () {
  // A quick way to make sure we're only keeping span-level tags when we need to.
  // This isn't supposed to be foolproof. It's just a quick way to make sure we
  // keep all span-level tags returned by a pagedown converter. It should allow
  // all span-level tags through, with or without attributes.
  var inlineTags = new RegExp(['^(<\\/?(a|abbr|acronym|applet|area|b|basefont|',
                               'bdo|big|button|cite|code|del|dfn|em|figcaption|',
                               'font|i|iframe|img|input|ins|kbd|label|map|',
                               'mark|meter|object|param|progress|q|ruby|rp|rt|s|',
                               'samp|script|select|small|span|strike|strong|',
                               'sub|sup|textarea|time|tt|u|var|wbr)[^>]*>|',
                               '<(br)\\s?\\/?>)$'].join(''), 'i');

  /******************************************************************
   * Utility Functions                                              *
   *****************************************************************/

  // patch for ie7
  if (!Array.indexOf) {
    Array.prototype.indexOf = function(obj) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] == obj) {
          return i;
        }
      }
      return -1;
    };
  }

  function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
  }

  function rtrim(str) {
    return str.replace(/\s+$/g, '');
  }

  // Remove one level of indentation from text. Indent is 4 spaces.
  function outdent(text) {
    return text.replace(new RegExp('^(\\t|[ ]{1,4})', 'gm'), '');
  }

  function contains(str, substr) {
    return str.indexOf(substr) != -1;
  }

  // Sanitize html, removing tags that aren't in the whitelist
  function sanitizeHtml(html, whitelist) {
    return html.replace(/<[^>]*>?/gi, function(tag) {
      return tag.match(whitelist) ? tag : '';
    });
  }

  // Merge two arrays, keeping only unique elements.
  function union(x, y) {
    var obj = {};
    for (var i = 0; i < x.length; i++)
       obj[x[i]] = x[i];
    for (i = 0; i < y.length; i++)
       obj[y[i]] = y[i];
    var res = [];
    for (var k in obj) {
      if (obj.hasOwnProperty(k))
        res.push(obj[k]);
    }
    return res;
  }

  // JS regexes don't support \A or \Z, so we add sentinels, as Pagedown
  // does. In this case, we add the ascii codes for start of text (STX) and
  // end of text (ETX), an idea borrowed from:
  // https://github.com/tanakahisateru/js-markdown-extra
  function addAnchors(text) {
    if(text.charAt(0) != '\x02')
      text = '\x02' + text;
    if(text.charAt(text.length - 1) != '\x03')
      text = text + '\x03';
    return text;
  }

  // Remove STX and ETX sentinels.
  function removeAnchors(text) {
    if(text.charAt(0) == '\x02')
      text = text.substr(1);
    if(text.charAt(text.length - 1) == '\x03')
      text = text.substr(0, text.length - 1);
    return text;
  }

  // Convert markdown within an element, retaining only span-level tags
  function convertSpans(text, extra) {
    return sanitizeHtml(convertAll(text, extra), inlineTags);
  }

  // Convert internal markdown using the stock pagedown converter
  function convertAll(text, extra) {
    var result = extra.blockGamutHookCallback(text);
    // We need to perform these operations since we skip the steps in the converter
    result = unescapeSpecialChars(result);
    result = result.replace(/~D/g, "$$").replace(/~T/g, "~");
    result = extra.previousPostConversion(result);
    return result;
  }

  // Convert escaped special characters
  function processEscapesStep1(text) {
    // Markdown extra adds two escapable characters, `:` and `|`
    return text.replace(/\\\|/g, '~I').replace(/\\:/g, '~i');
  }
  function processEscapesStep2(text) {
    return text.replace(/~I/g, '|').replace(/~i/g, ':');
  }

  // Duplicated from PageDown converter
  function unescapeSpecialChars(text) {
    // Swap back in all the special characters we've hidden.
    text = text.replace(/~E(\d+)E/g, function(wholeMatch, m1) {
      var charCodeToReplace = parseInt(m1);
      return String.fromCharCode(charCodeToReplace);
    });
    return text;
  }
  
  function slugify(text) {
    return text.toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
  }

  /*****************************************************************************
   * Markdown.Extra *
   ****************************************************************************/

  Markdown.Extra = function() {
    // For converting internal markdown (in tables for instance).
    // This is necessary since these methods are meant to be called as
    // preConversion hooks, and the Markdown converter passed to init()
    // won't convert any markdown contained in the html tags we return.
    this.converter = null;

    // Stores html blocks we generate in hooks so that
    // they're not destroyed if the user is using a sanitizing converter
    this.hashBlocks = [];
    
    // Stores footnotes
    this.footnotes = {};
    this.usedFootnotes = [];

    // Special attribute blocks for fenced code blocks and headers enabled.
    this.attributeBlocks = false;

    // Fenced code block options
    this.googleCodePrettify = false;
    this.highlightJs = false;

    // Table options
    this.tableClass = '';

    this.tabWidth = 4;
  };

  Markdown.Extra.init = function(converter, options) {
    // Each call to init creates a new instance of Markdown.Extra so it's
    // safe to have multiple converters, with different options, on a single page
    var extra = new Markdown.Extra();
    var postNormalizationTransformations = [];
    var preBlockGamutTransformations = [];
    var postSpanGamutTransformations = [];
    var postConversionTransformations = ["unHashExtraBlocks"];

    options = options || {};
    options.extensions = options.extensions || ["all"];
    if (contains(options.extensions, "all")) {
      options.extensions = ["tables", "fenced_code_gfm", "def_list", "attr_list", "footnotes", "smartypants", "strikethrough", "newlines"];
    }
    preBlockGamutTransformations.push("wrapHeaders");
    if (contains(options.extensions, "attr_list")) {
      postNormalizationTransformations.push("hashFcbAttributeBlocks");
      preBlockGamutTransformations.push("hashHeaderAttributeBlocks");
      postConversionTransformations.push("applyAttributeBlocks");
      extra.attributeBlocks = true;
    }
    if (contains(options.extensions, "fenced_code_gfm")) {
      // This step will convert fcb inside list items and blockquotes
      preBlockGamutTransformations.push("fencedCodeBlocks");
      // This extra step is to prevent html blocks hashing and link definition/footnotes stripping inside fcb
      postNormalizationTransformations.push("fencedCodeBlocks");
    }
    if (contains(options.extensions, "tables")) {
      preBlockGamutTransformations.push("tables");
    }
    if (contains(options.extensions, "def_list")) {
      preBlockGamutTransformations.push("definitionLists");
    }
    if (contains(options.extensions, "footnotes")) {
      postNormalizationTransformations.push("stripFootnoteDefinitions");
      preBlockGamutTransformations.push("doFootnotes");
      postConversionTransformations.push("printFootnotes");
    }
    if (contains(options.extensions, "smartypants")) {
      postConversionTransformations.push("runSmartyPants");
    }
    if (contains(options.extensions, "strikethrough")) {
      postSpanGamutTransformations.push("strikethrough");
    }
    if (contains(options.extensions, "newlines")) {
      postSpanGamutTransformations.push("newlines");
    }
    
    converter.hooks.chain("postNormalization", function(text) {
      return extra.doTransform(postNormalizationTransformations, text) + '\n';
    });

    converter.hooks.chain("preBlockGamut", function(text, blockGamutHookCallback) {
      // Keep a reference to the block gamut callback to run recursively
      extra.blockGamutHookCallback = blockGamutHookCallback;
      text = processEscapesStep1(text);
      text = extra.doTransform(preBlockGamutTransformations, text) + '\n';
      text = processEscapesStep2(text);
      return text;
    });

    converter.hooks.chain("postSpanGamut", function(text) {
      return extra.doTransform(postSpanGamutTransformations, text);
    });

    // Keep a reference to the hook chain running before doPostConversion to apply on hashed extra blocks
    extra.previousPostConversion = converter.hooks.postConversion;
    converter.hooks.chain("postConversion", function(text) {
      text = extra.doTransform(postConversionTransformations, text);
      // Clear state vars that may use unnecessary memory
      extra.hashBlocks = [];
      extra.footnotes = {};
      extra.usedFootnotes = [];
      return text;
    });

    if ("highlighter" in options) {
      extra.googleCodePrettify = options.highlighter === 'prettify';
      extra.highlightJs = options.highlighter === 'highlight';
    }

    if ("table_class" in options) {
      extra.tableClass = options.table_class;
    }

    extra.converter = converter;

    // Caller usually won't need this, but it's handy for testing.
    return extra;
  };

  // Do transformations
  Markdown.Extra.prototype.doTransform = function(transformations, text) {
    for(var i = 0; i < transformations.length; i++)
      text = this[transformations[i]](text);
    return text;
  };

  // Return a placeholder containing a key, which is the block's index in the
  // hashBlocks array. We wrap our output in a <p> tag here so Pagedown won't.
  Markdown.Extra.prototype.hashExtraBlock = function(block) {
    return '\n<p>~X' + (this.hashBlocks.push(block) - 1) + 'X</p>\n';
  };
  Markdown.Extra.prototype.hashExtraInline = function(block) {
    return '~X' + (this.hashBlocks.push(block) - 1) + 'X';
  };
  
  // Replace placeholder blocks in `text` with their corresponding
  // html blocks in the hashBlocks array.
  Markdown.Extra.prototype.unHashExtraBlocks = function(text) {
    var self = this;
    function recursiveUnHash() {
      var hasHash = false;
      text = text.replace(/(?:<p>)?~X(\d+)X(?:<\/p>)?/g, function(wholeMatch, m1) {
        hasHash = true;
        var key = parseInt(m1, 10);
        return self.hashBlocks[key];
      });
      if(hasHash === true) {
        recursiveUnHash();
      }
    }
    recursiveUnHash();
    return text;
  };
  
  // Wrap headers to make sure they won't be in def lists
  Markdown.Extra.prototype.wrapHeaders = function(text) {
    function wrap(text) {
      return '\n' + text + '\n';
    }
    text = text.replace(/^.+[ \t]*\n=+[ \t]*\n+/gm, wrap);
    text = text.replace(/^.+[ \t]*\n-+[ \t]*\n+/gm, wrap);
    text = text.replace(/^\#{1,6}[ \t]*.+?[ \t]*\#*\n+/gm, wrap);
    return text;
  };


  /******************************************************************
   * Attribute Blocks                                               *
   *****************************************************************/

  // TODO: use sentinels. Should we just add/remove them in doConversion?
  // TODO: better matches for id / class attributes
  var attrBlock = "\\{[ \\t]*((?:[#.][-_:a-zA-Z0-9]+[ \\t]*)+)\\}";
  var hdrAttributesA = new RegExp("^(#{1,6}.*#{0,6})[ \\t]+" + attrBlock + "[ \\t]*(?:\\n|0x03)", "gm");
  var hdrAttributesB = new RegExp("^(.*)[ \\t]+" + attrBlock + "[ \\t]*\\n" +
    "(?=[\\-|=]+\\s*(?:\\n|0x03))", "gm"); // underline lookahead
  var fcbAttributes =  new RegExp("^(```[ \\t]*[^{\\s]*)[ \\t]+" + attrBlock + "[ \\t]*\\n" +
    "(?=([\\s\\S]*?)\\n```[ \\t]*(\\n|0x03))", "gm");
      
  // Extract headers attribute blocks, move them above the element they will be
  // applied to, and hash them for later.
  Markdown.Extra.prototype.hashHeaderAttributeBlocks = function(text) {
    
    var self = this;
    function attributeCallback(wholeMatch, pre, attr) {
      return '<p>~XX' + (self.hashBlocks.push(attr) - 1) + 'XX</p>\n' + pre + "\n";
    }

    text = text.replace(hdrAttributesA, attributeCallback);  // ## headers
    text = text.replace(hdrAttributesB, attributeCallback);  // underline headers
    return text;
  };
  
  // Extract FCB attribute blocks, move them above the element they will be
  // applied to, and hash them for later.
  Markdown.Extra.prototype.hashFcbAttributeBlocks = function(text) {
    // TODO: use sentinels. Should we just add/remove them in doConversion?
    // TODO: better matches for id / class attributes

    var self = this;
    function attributeCallback(wholeMatch, pre, attr) {
      return '<p>~XX' + (self.hashBlocks.push(attr) - 1) + 'XX</p>\n' + pre + "\n";
    }

    return text.replace(fcbAttributes, attributeCallback);
  };

  Markdown.Extra.prototype.applyAttributeBlocks = function(text) {
    var self = this;
    var blockRe = new RegExp('<p>~XX(\\d+)XX</p>[\\s]*' +
                             '(?:<(h[1-6]|pre)(?: +class="(\\S+)")?(>[\\s\\S]*?</\\2>))', "gm");
    text = text.replace(blockRe, function(wholeMatch, k, tag, cls, rest) {
      if (!tag) // no following header or fenced code block.
        return '';

      // get attributes list from hash
      var key = parseInt(k, 10);
      var attributes = self.hashBlocks[key];

      // get id
      var id = attributes.match(/#[^\s#.]+/g) || [];
      var idStr = id[0] ? ' id="' + id[0].substr(1, id[0].length - 1) + '"' : '';

      // get classes and merge with existing classes
      var classes = attributes.match(/\.[^\s#.]+/g) || [];
      for (var i = 0; i < classes.length; i++) // Remove leading dot
        classes[i] = classes[i].substr(1, classes[i].length - 1);

      var classStr = '';
      if (cls)
        classes = union(classes, [cls]);

      if (classes.length > 0)
        classStr = ' class="' + classes.join(' ') + '"';

      return "<" + tag + idStr + classStr + rest;
    });

    return text;
  };

  /******************************************************************
   * Tables                                                         *
   *****************************************************************/

  // Find and convert Markdown Extra tables into html.
  Markdown.Extra.prototype.tables = function(text) {
    var self = this;

    var leadingPipe = new RegExp(
      ['^'                         ,
       '[ ]{0,3}'                  , // Allowed whitespace
       '[|]'                       , // Initial pipe
       '(.+)\\n'                   , // $1: Header Row

       '[ ]{0,3}'                  , // Allowed whitespace
       '[|]([ ]*[-:]+[-| :]*)\\n'  , // $2: Separator

       '('                         , // $3: Table Body
         '(?:[ ]*[|].*\\n?)*'      , // Table rows
       ')',
       '(?:\\n|$)'                   // Stop at final newline
      ].join(''),
      'gm'
    );

    var noLeadingPipe = new RegExp(
      ['^'                         ,
       '[ ]{0,3}'                  , // Allowed whitespace
       '(\\S.*[|].*)\\n'           , // $1: Header Row

       '[ ]{0,3}'                  , // Allowed whitespace
       '([-:]+[ ]*[|][-| :]*)\\n'  , // $2: Separator

       '('                         , // $3: Table Body
         '(?:.*[|].*\\n?)*'        , // Table rows
       ')'                         ,
       '(?:\\n|$)'                   // Stop at final newline
      ].join(''),
      'gm'
    );

    text = text.replace(leadingPipe, doTable);
    text = text.replace(noLeadingPipe, doTable);

    // $1 = header, $2 = separator, $3 = body
    function doTable(match, header, separator, body, offset, string) {
      // remove any leading pipes and whitespace
      header = header.replace(/^ *[|]/m, '');
      separator = separator.replace(/^ *[|]/m, '');
      body = body.replace(/^ *[|]/gm, '');

      // remove trailing pipes and whitespace
      header = header.replace(/[|] *$/m, '');
      separator = separator.replace(/[|] *$/m, '');
      body = body.replace(/[|] *$/gm, '');

      // determine column alignments
      alignspecs = separator.split(/ *[|] */);
      align = [];
      for (var i = 0; i < alignspecs.length; i++) {
        var spec = alignspecs[i];
        if (spec.match(/^ *-+: *$/m))
          align[i] = ' style="text-align:right;"';
        else if (spec.match(/^ *:-+: *$/m))
          align[i] = ' style="text-align:center;"';
        else if (spec.match(/^ *:-+ *$/m))
          align[i] = ' style="text-align:left;"';
        else align[i] = '';
      }

      // TODO: parse spans in header and rows before splitting, so that pipes
      // inside of tags are not interpreted as separators
      var headers = header.split(/ *[|] */);
      var colCount = headers.length;

      // build html
      var cls = self.tableClass ? ' class="' + self.tableClass + '"' : '';
      var html = ['<table', cls, '>\n', '<thead>\n', '<tr>\n'].join('');

      // build column headers.
      for (i = 0; i < colCount; i++) {
        var headerHtml = convertSpans(trim(headers[i]), self);
        html += ["  <th", align[i], ">", headerHtml, "</th>\n"].join('');
      }
      html += "</tr>\n</thead>\n";

      // build rows
      var rows = body.split('\n');
      for (i = 0; i < rows.length; i++) {
        if (rows[i].match(/^\s*$/)) // can apply to final row
          continue;

        // ensure number of rowCells matches colCount
        var rowCells = rows[i].split(/ *[|] */);
        var lenDiff = colCount - rowCells.length;
        for (var j = 0; j < lenDiff; j++)
          rowCells.push('');

        html += "<tr>\n";
        for (j = 0; j < colCount; j++) {
          var colHtml = convertSpans(trim(rowCells[j]), self);
          html += ["  <td", align[j], ">", colHtml, "</td>\n"].join('');
        }
        html += "</tr>\n";
      }

      html += "</table>\n";

      // replace html with placeholder until postConversion step
      return self.hashExtraBlock(html);
    }

    return text;
  };


  /******************************************************************
   * Footnotes                                                      *
   *****************************************************************/
  
  // Strip footnote, store in hashes.
  Markdown.Extra.prototype.stripFootnoteDefinitions = function(text) {
    var self = this;

    text = text.replace(
      /\n[ ]{0,3}\[\^(.+?)\]\:[ \t]*\n?([\s\S]*?)\n{1,2}((?=\n[ ]{0,3}\S)|$)/g,
      function(wholeMatch, m1, m2) {
        m1 = slugify(m1);
        m2 += "\n";
        m2 = m2.replace(/^[ ]{0,3}/g, "");
        self.footnotes[m1] = m2;
        return "\n";
      });

    return text;
  };
  

  // Find and convert footnotes references.
  Markdown.Extra.prototype.doFootnotes = function(text) {
    var self = this;
    if(self.isConvertingFootnote === true) {
      return text;
    }

    var footnoteCounter = 0;
    text = text.replace(/\[\^(.+?)\]/g, function(wholeMatch, m1) {
      var id = slugify(m1);
      var footnote = self.footnotes[id];
      if (footnote === undefined) {
        return wholeMatch;
      }
      footnoteCounter++;
      self.usedFootnotes.push(id);
      var html = '<a href="#fn:' + id + '" id="fnref:' + id
      + '" title="See footnote" class="footnote">' + footnoteCounter
      + '</a>';
      return self.hashExtraInline(html);
    });

    return text;
  };

  // Print footnotes at the end of the document
  Markdown.Extra.prototype.printFootnotes = function(text) {
    var self = this;

    if (self.usedFootnotes.length === 0) {
      return text;
    }

    text += '\n\n<div class="footnotes">\n<hr>\n<ol>\n\n';
    for(var i=0; i<self.usedFootnotes.length; i++) {
      var id = self.usedFootnotes[i];
      var footnote = self.footnotes[id];
      self.isConvertingFootnote = true;
      var formattedfootnote = convertSpans(footnote, self);
      delete self.isConvertingFootnote;
      text += '<li id="fn:'
        + id
        + '">'
        + formattedfootnote
        + ' <a href="#fnref:'
        + id
        + '" title="Return to article" class="reversefootnote">&#8617;</a></li>\n\n';
    }
    text += '</ol>\n</div>';
    return text;
  };
  
  
  /******************************************************************
  * Fenced Code Blocks  (gfm)                                       *
  ******************************************************************/

  // Find and convert gfm-inspired fenced code blocks into html.
  Markdown.Extra.prototype.fencedCodeBlocks = function(text) {
    function encodeCode(code) {
      code = code.replace(/&/g, "&amp;");
      code = code.replace(/</g, "&lt;");
      code = code.replace(/>/g, "&gt;");
      // These were escaped by PageDown before postNormalization 
      code = code.replace(/~D/g, "$$");
      code = code.replace(/~T/g, "~");
      return code;
    }

    var self = this;
    text = text.replace(/(?:^|\n)```[ \t]*(\S*)[ \t]*\n([\s\S]*?)\n```[ \t]*(?=\n)/g, function(match, m1, m2) {
      var language = m1, codeblock = m2;

      // adhere to specified options
      var preclass = self.googleCodePrettify ? ' class="prettyprint"' : '';
      var codeclass = '';
      if (language) {
        if (self.googleCodePrettify || self.highlightJs) {
          // use html5 language- class names. supported by both prettify and highlight.js
          codeclass = ' class="language-' + language + '"';
        } else {
          codeclass = ' class="' + language + '"';
        }
      }

      var html = ['<pre', preclass, '><code', codeclass, '>',
                  encodeCode(codeblock), '</code></pre>'].join('');

      // replace codeblock with placeholder until postConversion step
      return self.hashExtraBlock(html);
    });

    return text;
  };


  /******************************************************************
  * SmartyPants                                                     *
  ******************************************************************/
  
  Markdown.Extra.prototype.educatePants = function(text) {
    var self = this;
    var result = '';
    var blockOffset = 0;
    // Here we parse HTML in a very bad manner
    text.replace(/(?:<!--[\s\S]*?-->)|(<)([a-zA-Z1-6]+)([^\n]*?>)([\s\S]*?)(<\/\2>)/g, function(wholeMatch, m1, m2, m3, m4, m5, offset) {
      var token = text.substring(blockOffset, offset);
      result += self.applyPants(token);
      self.smartyPantsLastChar = result.substring(result.length - 1);
      blockOffset = offset + wholeMatch.length;
      if(!m1) {
        // Skip commentary
        result += wholeMatch;
        return;
      }
      // Skip special tags
      if(!/code|kbd|pre|script|noscript|iframe|math|ins|del|pre/i.test(m2)) {
        m4 = self.educatePants(m4);
      }
      else {
        self.smartyPantsLastChar = m4.substring(m4.length - 1);
      }
      result += m1 + m2 + m3 + m4 + m5;
    });
    var lastToken = text.substring(blockOffset);
    result += self.applyPants(lastToken);
    self.smartyPantsLastChar = result.substring(result.length - 1);
    return result;
  };
    
  function revertPants(wholeMatch, m1) {
    var blockText = m1;
    blockText = blockText.replace(/&\#8220;/g, "\"");
    blockText = blockText.replace(/&\#8221;/g, "\"");
    blockText = blockText.replace(/&\#8216;/g, "'");
    blockText = blockText.replace(/&\#8217;/g, "'");
    blockText = blockText.replace(/&\#8212;/g, "---");
    blockText = blockText.replace(/&\#8211;/g, "--");
    blockText = blockText.replace(/&\#8230;/g, "...");
    return blockText;
  }
  
  Markdown.Extra.prototype.applyPants = function(text) {
    // Dashes
    text = text.replace(/---/g, "&#8212;").replace(/--/g, "&#8211;");
    // Ellipses
    text = text.replace(/\.\.\./g, "&#8230;").replace(/\.\s\.\s\./g, "&#8230;");
    // Backticks
    text = text.replace(/``/g, "&#8220;").replace (/''/g, "&#8221;");
    
    if(/^'$/.test(text)) {
      // Special case: single-character ' token
      if(/\S/.test(this.smartyPantsLastChar)) {
        return "&#8217;";
      }
      return "&#8216;";
    }
    if(/^"$/.test(text)) {
      // Special case: single-character " token
      if(/\S/.test(this.smartyPantsLastChar)) {
        return "&#8221;";
      }
      return "&#8220;";
    }

    // Special case if the very first character is a quote
    // followed by punctuation at a non-word-break. Close the quotes by brute force:
    text = text.replace (/^'(?=[!"#\$\%'()*+,\-.\/:;<=>?\@\[\\]\^_`{|}~]\B)/, "&#8217;");
    text = text.replace (/^"(?=[!"#\$\%'()*+,\-.\/:;<=>?\@\[\\]\^_`{|}~]\B)/, "&#8221;");

    // Special case for double sets of quotes, e.g.:
    //   <p>He said, "'Quoted' words in a larger quote."</p>
    text = text.replace(/"'(?=\w)/g, "&#8220;&#8216;");
    text = text.replace(/'"(?=\w)/g, "&#8216;&#8220;");

    // Special case for decade abbreviations (the '80s):
    text = text.replace(/'(?=\d{2}s)/g, "&#8217;");
    
    // Get most opening single quotes:
    text = text.replace(/(\s|&nbsp;|--|&[mn]dash;|&\#8211;|&\#8212;|&\#x201[34];)'(?=\w)/g, "$1&#8216;");
    
    // Single closing quotes:
    text = text.replace(/([^\s\[\{\(\-])'/g, "$1&#8217;");
    text = text.replace(/'(?=\s|s\b)/g, "&#8217;");

    // Any remaining single quotes should be opening ones:
    text = text.replace(/'/g, "&#8216;");
    
    // Get most opening double quotes:
    text = text.replace(/(\s|&nbsp;|--|&[mn]dash;|&\#8211;|&\#8212;|&\#x201[34];)"(?=\w)/g, "$1&#8220;");
    
    // Double closing quotes:
    text = text.replace(/([^\s\[\{\(\-])"/g, "$1&#8221;");
    text = text.replace(/"(?=\s)/g, "&#8221;");
    
    // Any remaining quotes should be opening ones.
    text = text.replace(/"/ig, "&#8220;");
    return text;
  };

  // Find and convert markdown extra definition lists into html.
  Markdown.Extra.prototype.runSmartyPants = function(text) {
    this.smartyPantsLastChar = '';
    text = this.educatePants(text);
    // Clean everything inside html tags (some of them may have been converted due to our rough html parsing)
    text = text.replace(/(<([a-zA-Z1-6]+)\b([^\n>]*?)(\/)?>)/g, revertPants);
    return text;
  };
  
  /******************************************************************
  * Definition Lists                                                *
  ******************************************************************/

  // Find and convert markdown extra definition lists into html.
  Markdown.Extra.prototype.definitionLists = function(text) {
    var wholeList = new RegExp(
      ['(\\x02\\n?|\\n\\n)'          ,
       '(?:'                         ,
         '('                         , // $1 = whole list
           '('                       , // $2
             '[ ]{0,3}'              ,
             '((?:[ \\t]*\\S.*\\n)+)', // $3 = defined term
             '\\n?'                  ,
             '[ ]{0,3}:[ ]+'         , // colon starting definition
           ')'                       ,
           '([\\s\\S]+?)'            ,
           '('                       , // $4
               '(?=\\0x03)'          , // \z
             '|'                     ,
               '(?='                 ,
                 '\\n{2,}'           ,
                 '(?=\\S)'           ,
                 '(?!'               , // Negative lookahead for another term
                   '[ ]{0,3}'        ,
                   '(?:\\S.*\\n)+?'  , // defined term
                   '\\n?'            ,
                   '[ ]{0,3}:[ ]+'   , // colon starting definition
                 ')'                 ,
                 '(?!'               , // Negative lookahead for another definition
                   '[ ]{0,3}:[ ]+'   , // colon starting definition
                 ')'                 ,
               ')'                   ,
           ')'                       ,
         ')'                         ,
       ')'
      ].join(''),
      'gm'
    );

    var self = this;
    text = addAnchors(text);

    text = text.replace(wholeList, function(match, pre, list) {
      var result = trim(self.processDefListItems(list));
      result = "<dl>\n" + result + "\n</dl>";
      return pre + self.hashExtraBlock(result) + "\n\n";
    });

    return removeAnchors(text);
  };

  // Process the contents of a single definition list, splitting it
  // into individual term and definition list items.
  Markdown.Extra.prototype.processDefListItems = function(listStr) {
    var self = this;

    var dt = new RegExp(
      ['(\\x02\\n?|\\n\\n+)'    , // leading line
       '('                      , // definition terms = $1
         '[ ]{0,3}'             , // leading whitespace
         '(?![:][ ]|[ ])'       , // negative lookahead for a definition
                                  //   mark (colon) or more whitespace
         '(?:\\S.*\\n)+?'       , // actual term (not whitespace)
       ')'                      ,
       '(?=\\n?[ ]{0,3}:[ ])'     // lookahead for following line feed
      ].join(''),                 //   with a definition mark
      'gm'
    );

    var dd = new RegExp(
      ['\\n(\\n+)?'              , // leading line = $1
       '('                       , // marker space = $2
         '[ ]{0,3}'              , // whitespace before colon
         '[:][ ]+'               , // definition mark (colon)
       ')'                       ,
       '([\\s\\S]+?)'            , // definition text = $3
       '(?=\\n*'                 , // stop at next definition mark,
         '(?:'                   , // next term or end of text
           '\\n[ ]{0,3}[:][ ]|'  ,
           '<dt>|\\x03'          , // \z
         ')'                     ,
       ')'
      ].join(''),
      'gm'
    );

    listStr = addAnchors(listStr);
    // trim trailing blank lines:
    listStr = listStr.replace(/\n{2,}(?=\\x03)/, "\n");

    // Process definition terms.
    listStr = listStr.replace(dt, function(match, pre, termsStr) {
      var terms = trim(termsStr).split("\n");
      var text = '';
      for (var i = 0; i < terms.length; i++) {
        var term = terms[i];
        // process spans inside dt
        term = convertSpans(trim(term), self);
        text += "\n<dt>" + term + "</dt>";
      }
      return text + "\n";
    });

    // Process actual definitions.
    listStr = listStr.replace(dd, function(match, leadingLine, markerSpace, def) {
      if (leadingLine || def.match(/\n{2,}/)) {
        // replace marker with the appropriate whitespace indentation
        def = Array(markerSpace.length + 1).join(' ') + def;
        // process markdown inside definition
        // TODO?: currently doesn't apply extensions
        def = outdent(def) + "\n\n";
        def = "\n" + convertAll(def, self) + "\n";
      } else {
        // convert span-level markdown inside definition
        def = rtrim(def);
        def = convertSpans(outdent(def), self);
      }

      return "\n<dd>" + def + "</dd>\n";
    });

    return removeAnchors(listStr);
  };


  /***********************************************************
  * Strikethrough                                            *
  ************************************************************/

  Markdown.Extra.prototype.strikethrough = function(text) {
    // Pretty much duplicated from _DoItalicsAndBold
    return text.replace(/([\W_]|^)~T~T(?=\S)([^\r]*?\S[\*_]*)~T~T([\W_]|$)/g,
      "$1<del>$2</del>$3");
  };


  /***********************************************************
  * New lines                                                *
  ************************************************************/

  Markdown.Extra.prototype.newlines = function(text) {
    // We have to ignore already converted newlines and line breaks in sub-list items
    return text.replace(/(<(?:br|\/li)>)?\n/g, function(wholeMatch, previousTag) {
      return previousTag ? wholeMatch : " <br>\n";
    });
  };
  
})();


define("pagedown-extra", function(){});

/*globals Markdown */
define('extensions/markdownExtra',[
    "underscore",
    "utils",
    "classes/Extension",
    'google-code-prettify',
    // 'highlightjs',
    'pagedown-extra',
], function(_, utils, Extension, prettify) {

    var markdownExtra = new Extension("markdownExtra", "Markdown Extra", true);
    markdownExtra.defaultConfig = {
        extensions: [
            "fenced_code_gfm",
            "tables",
            "def_list",
            "attr_list",
            "footnotes",
            // smartypants不要, 因为它把'和"转成了中文引号, --转成了一个–
            // "smartypants", // https://daringfireball.net/projects/smartypants/
            /*s
            SmartyPants is a free web publishing plug-in for Movable Type, Blosxom, and BBEdit that easily translates plain ASCII punctuation characters into “smart” typographic punctuation HTML entities.
SmartyPants can perform the following transformations:

Straight quotes ( " and ' ) into “curly” quote HTML entities
Backticks-style quotes (``like this'') into “curly” quote HTML entities
Dashes (“--” and “---”) into en- and em-dash entities
Three consecutive dots (“...”) into an ellipsis entity
This means you can write, edit, and save your posts using plain old ASCII straight quotes, plain dashes, and plain dots, but your published posts (and final HTML output) will appear with smart quotes, em-dashes, and proper ellipses.

SmartyPants is a combination plug-in — a single plug-in file that works with Movable Type, Blosxom, and BBEdit. It can also be used from a Unix-style command-line.

SmartyPants does not modify characters within <pre>, <code>, <kbd>, or <script> tag blocks. Typically, these tags are used to display text where smart quotes and other “smart punctuation” would not be appropriate, such as source code or example markup.
             */
            "strikethrough",
            "newlines",
        ],
        intraword: true,
        comments: true,
        highlighter: "prettify"
    };

    var eventMgr;
    markdownExtra.onEventMgrCreated = function(eventMgrParameter) {
        eventMgr = eventMgrParameter;
    };

    function onToggleMode(editor) {
        // 不能加linenums, 加了后, uml不能显示
        // 但是, 有人说没有行号了, 很不好
        // 怎么办
        editor.hooks.chain("onPreviewRefresh", function () {
            $('#preview-contents pre code').each(function () {
                var classes = $(this).attr('class');
                if (classes != 'language-flow' && classes != 'language-sequence') {
                    $(this).parent().addClass('prettyprint linenums'); 
                }
            });
            prettify.prettyPrint();
        });
    }

    markdownExtra.onToggleMode = onToggleMode;

    markdownExtra.onPagedownConfigure = function(editor) {
        var converter = editor.getConverter();
        if(markdownExtra.config.intraword === true) {
            var converterOptions = {
                _DoItalicsAndBold: function(text) {
                    text = text.replace(/([^\w*]|^)(\*\*|__)(?=\S)(.+?[*_]*)(?=\S)\2(?=[^\w*]|$)/g, "$1<strong>$3</strong>");
                    text = text.replace(/([^\w*]|^)(\*|_)(?=\S)(.+?)(?=\S)\2(?=[^\w*]|$)/g, "$1<em>$3</em>");
                    return text;
                }
            };
            converter.setOptions(converterOptions);
        }
        if(markdownExtra.config.comments === true) {
            converter.hooks.chain("postConversion", function(text) {
                return text.replace(/<!--.*?-->/g, function(wholeMatch) {
                    return wholeMatch.replace(/^<!---(.+?)-?-->$/, ' <span class="comment label label-danger">$1</span> ');
                });
            });
        }
        
        var extraOptions = {
            extensions: markdownExtra.config.extensions
        };
      
        extraOptions.highlighter = "prettify";
        
        onToggleMode(editor);

        Markdown.Extra.init(converter, extraOptions);
    };

    return markdownExtra;
});
define('libs/mathjax_init',[
    "settings",
], function(settings/*, mathjaxConfigJS*/) {
    var script = document.createElement('script');
    script.type = 'text/x-mathjax-config';
    var mathjaxConfigJS = 'MathJax.Hub.Config({\n\tskipStartupTypeset: true,\n    "HTML-CSS": {\n        preferredFont: "TeX",\n        availableFonts: [\n            "STIX",\n            "TeX"\n        ],\n        linebreaks: {\n            automatic: true\n        },\n        EqnChunk: 10,\n        imageFont: null\n    },\n    tex2jax: <%= tex2jax || \'{ inlineMath: [["$","$"],["\\\\\\\\\\\\\\\\(","\\\\\\\\\\\\\\\\)"]], displayMath: [["$$","$$"],["\\\\\\\\[","\\\\\\\\]"]], processEscapes: true }\' %>,\n    TeX: $.extend({\n        noUndefined: {\n            attributes: {\n                mathcolor: "red",\n                mathbackground: "#FFEEEE",\n                mathsize: "90%"\n            }\n        },\n        Safe: {\n            allow: {\n                URLs: "safe",\n                classes: "safe",\n                cssIDs: "safe",\n                styles: "safe",\n                fontsize: "all"\n            }\n        }\n    }, <%= tex %>),\n    messageStyle: "none"\n});\n';
    script.innerHTML = _.template(mathjaxConfigJS, {
        tex: settings.extensionSettings.mathJax ? settings.extensionSettings.mathJax.tex : 'undefined',
        tex2jax: settings.extensionSettings.mathJax ? settings.extensionSettings.mathJax.tex2jax : undefined
    });
    document.getElementsByTagName('head')[0].appendChild(script);
});
/*defines MathJax */
define('extensions/mathJax',[
    "utils",
    "classes/Extension",
    "mathjax",
], function(utils, Extension) {
	
	var mathJax = new Extension("mathJax", "MathJax", true);
    mathJax.defaultConfig = {
        tex: "{}",
        tex2jax: '{ inlineMath: [["$","$"],["\\\\\\\\(","\\\\\\\\)"]], displayMath: [["$$","$$"],["\\\\[","\\\\]"]], processEscapes: true }'
    };
    
    /*jshint ignore:start */
    mathJax.onPagedownConfigure = function(editorObject) {
        t = document.getElementById("preview-contents");

        var converter = editorObject.getConverter();
        converter.hooks.chain("preConversion", p);
        converter.hooks.chain("postConversion", d);
    };
    
    var afterRefreshCallback;
    mathJax.onAsyncPreview = function(callback) {
        afterRefreshCallback = callback;
        j();
    };
    
    // From math.stackexchange.com...

    function b(a, f, b) {
        var c = k.slice(a, f + 1).join("").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        for (h.Browser.isMSIE && (c = c.replace(/(%[^\n]*)\n/g, "$1<br/>\n")); f > a; )
            k[f] = "", f--;
        k[a] = "@@" + m.length + "@@";
        b && (c = b(c));
        m.push(c);
        i = o = l = null
    }
    function p(a) {
        i = o = l = null;
        m = [];
        var f;
        /`/.test(a) ? (a = a.replace(/~/g, "~T").replace(/(^|[^\\])(`+)([^\n]*?[^`\n])\2(?!`)/gm, function(a) {
            return a.replace(/\$/g, "~D")
        }), f = function(a) {
            return a.replace(/~([TD])/g, 
            function(a, c) {
                return {T: "~",D: "$"}[c]
            })
        }) : f = function(a) {
            return a
        };
        k = r(a.replace(/\r\n?/g, "\n"), u);
        for (var a = 1, d = k.length; a < d; a += 2) {
            var c = k[a];
            "@" === c.charAt(0) ? (k[a] = "@@" + m.length + "@@", m.push(c)) : i ? c === o ? n ? l = a : b(i, a, f) : c.match(/\n.*\n/) ? (l && (a = l, b(i, a, f)), i = o = l = null, n = 0) : "{" === c ? n++ : "}" === c && n && n-- : c === s || "$$" === c ? (i = a, o = c, n = 0) : "begin" === c.substr(1, 5) && (i = a, o = "\\end" + c.substr(6), n = 0)
        }
        l && b(i, l, f);
        return f(k.join(""))
    }
    function d(a) {
        a = a.replace(/@@(\d+)@@/g, function(a, b) {
            return m[b]
        });
        m = null;
        return a
    }
    function e() {
        q = !1;
        h.cancelTypeset = !1;
        h.Queue(["Typeset", h, t])
        h.Queue(afterRefreshCallback); //benweet
    }
    function j() {
        !q && /*benweet (we need to call our afterRefreshCallback) g &&*/ (q = !0, h.Cancel(), h.Queue(e))
    }
    var g = !1, q = !1, t = null, s = "$", k, i, o, l, n, m, h = MathJax.Hub;
    h.Queue(function() {
        g = !0;
        h.processUpdateTime = 50;
        h.Config({"HTML-CSS": {EqnChunk: 10,EqnChunkFactor: 1},SVG: {EqnChunk: 10,EqnChunkFactor: 1}})
    });
    var u = /(\$\$?|\\(?:begin|end)\{[a-z]*\*?\}|\\[\\{}$]|[{}]|(?:\n\s*)+|@@\d+@@)/i, r;
    r = 3 === "aba".split(/(b)/).length ? function(a, f) {
        return a.split(f)
    } : function(a, f) {
        var b = [], c;
        if (!f.global) {
            c = f.toString();
            var d = "";
            c = c.replace(/^\/(.*)\/([im]*)$/, function(a, c, b) {
                d = b;
                return c
            });
            f = RegExp(c, d + "g")
        }
        for (var e = f.lastIndex = 0; c = f.exec(a); )
            b.push(a.substring(e, c.index)), b.push.apply(b, c.slice(1)), e = c.index + c[0].length;
        b.push(a.substring(e));
        return b
    };
    
    (function() {
        var b = MathJax.Hub;
        if (!b.Cancel) {
            b.cancelTypeset = !1;
            b.Register.StartupHook("HTML-CSS Jax Config", function() {
                var d = MathJax.OutputJax["HTML-CSS"], e = d.Translate;
                d.Augment({Translate: function(j, g) {
                        if (b.cancelTypeset || g.cancelled)
                            throw Error("MathJax Canceled");
                        return e.call(d, j, g)
                    }})
            });
            b.Register.StartupHook("SVG Jax Config", function() {
                var d = MathJax.OutputJax.SVG, e = d.Translate;
                d.Augment({Translate: function(j, g) {
                        if (b.cancelTypeset || g.cancelled)
                            throw Error("MathJax Canceled");
                        return e.call(d, 
                        j, g)
                    }})
            });
            b.Register.StartupHook("TeX Jax Config", function() {
                var d = MathJax.InputJax.TeX, e = d.Translate;
                d.Augment({Translate: function(j, g) {
                        if (b.cancelTypeset || g.cancelled)
                            throw Error("MathJax Canceled");
                        return e.call(d, j, g)
                    }})
            });
            var p = b.processError;
            b.processError = function(d, e, j) {
                if ("MathJax Canceled" !== d.message)
                    return p.call(b, d, e, j);
                MathJax.Message.Clear(0, 0);
                e.jaxIDs = [];
                e.jax = {};
                e.scripts = [];
                e.i = e.j = 0;
                e.cancelled = !0;
                return null
            };
            b.Cancel = function() {
                this.cancelTypeset = !0
            }
        }
    })();
    /*jshint ignore:end */

	return mathJax;
});
define('extensions/markdownSectionParser',[
    "underscore",
    "extensions/markdownExtra",
    "extensions/mathJax",
    "classes/Extension",
], function(_, markdownExtra, mathJax, Extension) {

    var markdownSectionParser = new Extension("markdownSectionParser", "Markdown section parser");

    var eventMgr;
    markdownSectionParser.onEventMgrCreated = function(eventMgrParameter) {
        eventMgr = eventMgrParameter;
    };

    markdownSectionParser.onPagedownConfigure = function(editor) {
        
        // Build a regexp to look for section delimiters
        var regexp = '^.+[ \\t]*\\n=+[ \\t]*\\n+|^.+[ \\t]*\\n-+[ \\t]*\\n+|^\\#{1,6}[ \\t]*.+?[ \\t]*\\#*\\n+'; // Title delimiters
        if(markdownExtra.enabled) {
            if(_.some(markdownExtra.config.extensions, function(extension) {
                return extension == "fenced_code_gfm";
            })) {
                regexp = '^```.*\\n[\\s\\S]*?\\n```|' + regexp; // Fenced block delimiters
            }
        }

        // TODO 代码```
        // regexp = '^```$|' + regexp;

        if(mathJax.enabled) {
            // Math delimiter has to follow 1 empty line to be considered as a section delimiter
            regexp = '^[ \\t]*\\n\\$\\$[\\s\\S]*?\\$\\$|' + regexp; // $$ math block delimiters
            regexp = '^[ \\t]*\\n\\\\\\\\[[\\s\\S]*?\\\\\\\\]|' + regexp; // \\[ \\] math block delimiters
            regexp = '^[ \\t]*\\n\\\\?\\\\begin\\{[a-z]*\\*?\\}[\\s\\S]*?\\\\end\\{[a-z]*\\*?\\}|' + regexp; // \\begin{...} \\end{...} math block delimiters
        }
        regexp = new RegExp(regexp, 'gm');
        
        var converter = editor.getConverter();
        converter.hooks.chain("preConversion", function(text) {
            // console.log('preConversion');
            // console.log(text);
            eventMgr.previewStartTime = new Date();
            var tmpText = text + "\n\n";
            function addSection(startOffset, endOffset) {
                var sectionText = tmpText.substring(offset, endOffset);
                sectionList.push({
                    text: sectionText,
                    textWithDelimiter: '\n<div class="se-section-delimiter"></div>\n\n' + sectionText + '\n'
                });
            }
            var sectionList = [], offset = 0;
            // Look for delimiters
            tmpText.replace(regexp, function(match, matchOffset) {
                // Create a new section with the text preceding the delimiter
                addSection(offset, matchOffset);
                offset = matchOffset;
            });
            // Last section
            addSection(offset, text.length);
            eventMgr.onSectionsCreated(sectionList);
            return _.reduce(sectionList, function(result, section) {
                return result + section.textWithDelimiter;
            }, '');
        });
    };

    return markdownSectionParser;
});
define('extensions/partialRendering',[
    "underscore",
    "crel",
    "extensions/markdownExtra",
    "classes/Extension"
], function(_, crel, markdownExtra, Extension, partialRenderingSettingsBlockHTML) {

    var partialRendering = new Extension("partialRendering", "Partial Rendering", true);

    var converter;
    var sectionCounter = 0;
    var sectionList = [];
    var linkDefinition;
    var sectionsToRemove = [];
    var modifiedSections = [];
    var insertBeforeSection;
    var fileChanged = false;
    function updateSectionList(newSectionList, newLinkDefinition) {
        modifiedSections = [];
        sectionsToRemove = [];
        insertBeforeSection = undefined;

        // Render everything if file or linkDefinition changed
        if(fileChanged === true || linkDefinition != newLinkDefinition) {
            fileChanged = false;
            linkDefinition = newLinkDefinition;
            sectionsToRemove = sectionList;
            sectionList = newSectionList;
            modifiedSections = newSectionList;
            return;
        }

        // Find modified section starting from top
        var leftIndex = sectionList.length;
        _.some(sectionList, function(section, index) {
            if(index >= newSectionList.length || section.text != newSectionList[index].text) {
                leftIndex = index;
                return true;
            }
        });
        
        // Find modified section starting from bottom
        var rightIndex = -sectionList.length;
        _.some(sectionList.slice().reverse(), function(section, index) {
            if(index >= newSectionList.length || section.text != newSectionList[newSectionList.length - index - 1].text) {
                rightIndex = -index;
                return true;
            }
        });
        
        if(leftIndex - rightIndex > sectionList.length) {
            // Prevent overlap
            rightIndex = leftIndex - sectionList.length;
        }

        // Create an array composed of left unmodified, modified, right
        // unmodified sections
        var leftSections = sectionList.slice(0, leftIndex);
        modifiedSections = newSectionList.slice(leftIndex, newSectionList.length + rightIndex);
        var rightSections = sectionList.slice(sectionList.length + rightIndex, sectionList.length);
        insertBeforeSection = _.first(rightSections);
        sectionsToRemove = sectionList.slice(leftIndex, sectionList.length + rightIndex);
        sectionList = leftSections.concat(modifiedSections).concat(rightSections);
    }
    
    var doFootnotes = false;
    var hasFootnotes = false;
    partialRendering.onSectionsCreated = function(sectionListParam) {

        var newSectionList = [];
        var newLinkDefinition = '\n';
        hasFootnotes = false;
        _.each(sectionListParam, function(section) {
            var text = section.textWithDelimiter + '\n';

            // Strip footnotes
            if(doFootnotes) {
                text = text.replace(/^```.*\n[\s\S]*?\n```|\n[ ]{0,3}\[\^(.+?)\]\:[ \t]*\n?([\s\S]*?)\n{1,2}((?=\n[ ]{0,3}\S)|$)/gm, function(wholeMatch, footnote) {
                    if(footnote) {
                        hasFootnotes = true;
                        newLinkDefinition += wholeMatch.replace(/^\s*\n/gm, '') + '\n';
                        return "";
                    }
                    return wholeMatch;
                });
            }

            // Strip link definitions
            text = text.replace(/^```.*\n[\s\S]*?\n```|^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?(?=\s|$)[ \t]*\n?[ \t]*((\n*)["(](.+?)[")][ \t]*)?(?:\n+)/gm, function(wholeMatch, link) {
                if(link) {
                    newLinkDefinition += wholeMatch.replace(/^\s*\n/gm, '') + '\n';
                    return "";
                }
                return wholeMatch;
            });

            // Add section to the newSectionList
            newSectionList.push({
                id: ++sectionCounter,
                text: text + '\n'
            });
        });

        updateSectionList(newSectionList, newLinkDefinition);
    };

    var footnoteMap = {};
    // Store one footnote elt in the footnote map
    function storeFootnote(footnoteElt) {
        var id = footnoteElt.id.substring(3);
        footnoteMap[id] = footnoteElt;
    }
    
    var footnoteContainerElt;
    var previewContentsElt;
    function refreshSections() {

        // Remove outdated sections
        _.each(sectionsToRemove, function(section) {
            var sectionElt = document.getElementById("wmd-preview-section-" + section.id);
            previewContentsElt.removeChild(sectionElt);
        });
        
        var wmdPreviewElt = document.getElementById("wmd-preview");
        var childNode = wmdPreviewElt.firstChild;
        function createSectionElt(section) {
            var sectionElt = crel('div', {
                id: 'wmd-preview-section-' + section.id,
                class: 'wmd-preview-section preview-content'
            });
            var isNextDelimiter = false;
            while (childNode) {
                var nextNode = childNode.nextSibling;
                if(isNextDelimiter === true && childNode.tagName == 'DIV' && childNode.className == 'se-section-delimiter') {
                    // Stop when encountered the next delimiter
                    break;
                }
                isNextDelimiter = true;
                if(childNode.tagName == 'DIV' && childNode.className == 'footnotes') {
                    _.each(childNode.querySelectorAll("ol > li"), storeFootnote);
                }
                else {
                    sectionElt.appendChild(childNode);
                }
                childNode = nextNode;
            }
            return sectionElt;
        }

        var newSectionEltList = document.createDocumentFragment();
        _.each(modifiedSections, function(section) {
            newSectionEltList.appendChild(createSectionElt(section));
        });
        wmdPreviewElt.innerHTML = '';
        var insertBeforeElt = footnoteContainerElt;
        if(insertBeforeSection !== undefined) {
            insertBeforeElt = document.getElementById("wmd-preview-section-" + insertBeforeSection.id);
        }
        previewContentsElt.insertBefore(newSectionEltList, insertBeforeElt);

        // Rewrite footnotes in the footer and update footnote numbers
        footnoteContainerElt.innerHTML = '';
        var usedFootnoteIds = [];
        if(hasFootnotes === true) {
            var footnoteElts = crel('ol');
            _.each(previewContentsElt.querySelectorAll('a.footnote'), function(elt, index) {
                elt.textContent = index + 1;
                var id = elt.id.substring(6);
                usedFootnoteIds.push(id);
                footnoteElts.appendChild(footnoteMap[id].cloneNode(true));
            });
            if(usedFootnoteIds.length > 0) {
                // Append the whole footnotes at the end of the document
                footnoteContainerElt.appendChild(crel('div', {
                    class: 'footnotes'
                }, crel('hr'), footnoteElts));
            }
            // Keep used footnotes only in our map
            footnoteMap = _.pick(footnoteMap, usedFootnoteIds);
        }
    }

    // 初始化时, toggleMode时
    function onPagedownConfigure(editor) {
        converter = editor.getConverter();
        converter.hooks.chain("preConversion", function() {
            var result = _.map(modifiedSections, function(section) {
                return section.text;
            });
            result.push(linkDefinition + "\n\n");
            return result.join("");
        });
        editor.hooks.chain("onPreviewRefresh", function() {
            refreshSections();
        });
    }

    partialRendering.onPagedownConfigure = onPagedownConfigure;
    partialRendering.onToggleMode = onPagedownConfigure;

    partialRendering.onInit = function() {
        if(markdownExtra.enabled) {
            if(_.some(markdownExtra.config.extensions, function(extension) {
                return extension == "footnotes";
            })) {
                doFootnotes = true;
            }
        }
    };
    
    partialRendering.onReady = function() {
        footnoteContainerElt = crel('div', {
            id: 'wmd-preview-section-footnotes',
            class: 'preview-content'
        });
        previewContentsElt = document.getElementById("preview-contents");
        previewContentsElt.appendChild(footnoteContainerElt);
    };

    partialRendering.onFileSelected = function() {
        fileChanged = true;
    };

    return partialRendering;
});
define('extensions/umlDiagrams',[
	'require',
	// "jquery",
	"underscore",
	"utils",
	"classes/Extension",
	'crel'
	// ', Diagram', // 如果加了这两个, 338 KB, 不加, 207KB
	// 'flow-chart'
], function(require, _, utils, Extension, crel
	// ,Diagram, 
	// flowChart
	) {

	var umlDiagrams = new Extension("umlDiagrams", "UML Diagrams", true);
	// umlDiagrams.settingsBlock = umlDiagramsSettingsBlockHTML;
	umlDiagrams.defaultConfig = {
		flowchartOptions: [
			'{',
			'   "line-width": 2,',
			'   "font-family": "sans-serif",',
			'   "font-weight": "normal"',
			'}'
		].join('\n')
	};

	var previewContentsElt = document.getElementById('preview-contents');
	function renderFlow() {
		var flows = previewContentsElt.querySelectorAll('.prettyprint > .language-flow');
		if (!flows || flows.length == 0) {
			return;
		}
		// console.log('flows')
		require(['flow-chart'], function (flowChart) {
			_.each(flows, function(elt) {
				try {
					var chart = flowChart.parse(elt.textContent);
					var preElt = elt.parentNode;
					var containerElt = crel('div', {
						class: 'flow-chart'
					});
					preElt.parentNode.replaceChild(containerElt, preElt);
					chart.drawSVG(containerElt, JSON.parse(umlDiagrams.config.flowchartOptions));
				}
				catch(e) {
					console.error(e);
				}
			});
		});
	}
	function renderSequence() {
		var ses = previewContentsElt.querySelectorAll('.prettyprint > .language-sequence');
		if (!ses || ses.length == 0) {
			return;
		}
		require(['Diagram'], function (Diagram) {
			_.each(ses, function(elt) {
				try {
					var diagram = Diagram.parse(elt.textContent);
					var preElt = elt.parentNode;
					var containerElt = crel('div', {
						class: 'sequence-diagram'
					});
					preElt.parentNode.replaceChild(containerElt, preElt);
					diagram.drawSVG(containerElt, {
						theme: 'simple'
					});

				}
				catch(e) {
					console.error(e);
				}
			});
		});
	}

	function renderFlow() {
		var flows = previewContentsElt.querySelectorAll('.prettyprint > .language-flow');
		if (!flows || flows.length == 0) {
			return;
		}
		// console.log('flows')
		require(['flow-chart'], function (flowChart) {
			_.each(flows, function(elt) {
				try {
					var chart = flowChart.parse(elt.textContent);
					var preElt = elt.parentNode;
					var containerElt = crel('div', {
						class: 'flow-chart'
					});
					preElt.parentNode.replaceChild(containerElt, preElt);
					chart.drawSVG(containerElt, JSON.parse(umlDiagrams.config.flowchartOptions));
				}
				catch(e) {
					console.error(e);
				}
			});
		});
	}

	function onToggleMode(editor) {
		editor.hooks.chain("onPreviewRefresh", function() {
			renderSequence();
			renderFlow();
		});
	}

	umlDiagrams.onPagedownConfigure = onToggleMode;
	umlDiagrams.onToggleMode = onToggleMode;

	return umlDiagrams;
});

define('extensions/toc',[
    "underscore",
    "utils",
    "classes/Extension",
], function(_, utils, Extension) {

    var toc = new Extension("toc", "Table of Contents", true);
    toc.defaultConfig = {
        marker: "\\[(TOC|toc)\\]",
        maxDepth: 6,
        button: true,
    };

    // toc.onLoadSettings = function() {
    //     utils.setInputValue("#input-toc-marker", toc.config.marker);
    //     utils.setInputValue("#input-toc-maxdepth", toc.config.maxDepth);
    //     utils.setInputChecked("#input-toc-button", toc.config.button);
    // };

    // toc.onSaveSettings = function(newConfig, event) {
    //     newConfig.marker = utils.getInputRegExpValue("#input-toc-marker", event);
    //     newConfig.maxDepth = utils.getInputIntValue("#input-toc-maxdepth");
    //     newConfig.button = utils.getInputChecked("#input-toc-button");
    // };

    /*
    toc.onCreatePreviewButton = function() {
        if(toc.config.button) {
            return buttonTocHTML;
        }
    };
    */

    // TOC element description
    function TocElement(tagName, anchor, text) {
        this.tagName = tagName;
        this.anchor = anchor;
        this.text = text;
        this.children = [];
    }
    TocElement.prototype.childrenToString = function() {
        if(this.children.length === 0) {
            return "";
        }
        var result = "<ul>\n";
        _.each(this.children, function(child) {
            result += child.toString();
        });
        result += "</ul>\n";
        return result;
    };
    TocElement.prototype.toString = function() {
        var result = "<li>";
        if(this.anchor && this.text) {
            result += '<a href="#' + this.anchor + '">' + this.text + '</a>';
        }
        result += this.childrenToString() + "</li>\n";
        return result;
    };

    // Transform flat list of TocElement into a tree
    function groupTags(array, level) {
        level = level || 1;
        var tagName = "H" + level;
        var result = [];

        var currentElement;
        function pushCurrentElement() {
            if(currentElement !== undefined) {
                if(currentElement.children.length > 0) {
                    currentElement.children = groupTags(currentElement.children, level + 1);
                }
                result.push(currentElement);
            }
        }

        _.each(array, function(element) {
            if(element.tagName != tagName) {
                if(level !== toc.config.maxDepth) {
                    if(currentElement === undefined) {
                        currentElement = new TocElement();
                    }
                    currentElement.children.push(element);
                }
            }
            else {
                pushCurrentElement();
                currentElement = element;
            }
        });
        pushCurrentElement();
        return result;
    }

    // Build the TOC
    var previewContentsElt;
    function buildToc() {
        var anchorList = {};
        function createAnchor(element) {
            var id = element.id || utils.slugify(element.textContent) || 'title';
            var anchor = id;
            var index = 0;
            while (_.has(anchorList, anchor)) {
                anchor = id + "-" + (++index);
            }
            anchorList[anchor] = true;
            // Update the id of the element
            element.id = anchor;
            return anchor;
        }

        var elementList = [];
        _.each(previewContentsElt.querySelectorAll('h1, h2, h3, h4, h5, h6'), function(elt) {
            elementList.push(new TocElement(elt.tagName, createAnchor(elt), elt.textContent));
        });
        elementList = groupTags(elementList);
        return '<div class="toc">\n<ul>\n' + elementList.join("") + '</ul>\n</div>\n';
    }

    toc.onPagedownConfigure = function(editor) {
        previewContentsElt = document.getElementById('preview-contents');
        var tocExp = new RegExp("^" + toc.config.marker + "$");
        // Run TOC generation when conversion is finished directly on HTML
        editor.hooks.chain("onPreviewRefresh", function() {
            var tocEltList = document.querySelectorAll('.table-of-contents, .toc');
            var htmlToc = buildToc();
            // Replace toc paragraphs
            _.each(previewContentsElt.getElementsByTagName('p'), function(elt) {
                if(tocExp.test(elt.innerHTML)) {
                    elt.innerHTML = htmlToc;
                }
            });
            // Add toc in the TOC button 
            _.each(tocEltList, function(elt) {
                elt.innerHTML = htmlToc;
            });

            $("#leanoteNavContentMd").height("auto"); // auto
            try {
                if(!$(htmlToc).text()) {
                    $("#leanoteNavContentMd").html("&nbsp; &nbsp; Nothing...");
                }
            } catch(e) {}
            // 这里, resize Height
            var curH = $("#leanoteNavContentMd").height();
            var pH = $("#mdEditor").height()-100;
            if(curH > pH) {
                $("#leanoteNavContentMd").height(pH);
            }
        });
    };

    toc.onReady = function() {
        // $('.extension-preview-buttons .table-of-contents').on('click', 'a', function(evt) {
        //     evt.preventDefault();
        // });
    };

    return toc;
});

define('extensions/emailConverter',[
    "classes/Extension",
], function(Extension) {
    var emailConverter = new Extension("emailConverter", "Markdown Email", true);
    emailConverter.onPagedownConfigure = function(editor) {
        editor.getConverter().hooks.chain("postConversion", function(text) {
            return text.replace(/<(mailto\:)?([^\s>]+@[^\s>]+\.\S+?)>/g, function(match, mailto, email) {
                return '<a href="mailto:' + email + '">' + email + '</a>';
            });
        });
    };

    return emailConverter;
});

define('extensions/todoList',[
    "classes/Extension",
], function(Extension) {
    var todoList = new Extension("todoList", "Markdown todoList", true);
    todoList.onPagedownConfigure = function(editor) {
        editor.getConverter().hooks.chain("postConversion", function(text) {
            return text.replace(/<li>(<p>)?\[([ xX]?)\] /g, function(matched, p, b) {
                p || (p = '');
                return !(b == 'x' || b == 'X') ? '<li class="m-todo-item m-todo-empty">' + p + '<input type="checkbox" /> ' : '<li class="m-todo-item m-todo-done">' + p + '<input type="checkbox" checked /> '
            });
        });
    };
    return todoList;
});

/**
scrollLink原理

1) preview分出一个个section
2) Md text通过这些section一个个取高度, 成mdSection
3) 将mdSection和previewSection建立映射
4) 滚动时, 通过scollTop()得到section的位置, 到另一边的section得到另一方scrollTop(), 滚动之

注意要点:
light下得到左侧的mdSection是通过helper, 每一个section的文字设到helper容器内得到高度. 所以helper的样式要和wmd-input的样式要一模一样, 不然就会有误差!!

 */
define('extensions/scrollLink',[
    // "jquery",
    "underscore",
    "classes/Extension",
    // "text!html/scrollLinkSettingsBlock.html"
], function(_, Extension) {

    var scrollLink = new Extension("scrollLink", "Scroll Link", true, true);

    var aceEditor;
    scrollLink.onAceCreated = function(aceEditorParam) {
        aceEditor = aceEditorParam;
    };

    var sectionList;
    scrollLink.onSectionsCreated = function(sectionListParam) {
        sectionList = sectionListParam;
    };

    var offsetBegin = 0;
    scrollLink.onMarkdownTrim = function(offsetBeginParam) {
        offsetBegin = offsetBeginParam;
    };

    var $textareaElt;
    var $textareaHelperElt;
    var $previewElt;
    var mdSectionList = [];
    var htmlSectionList = [];
    var lastEditorScrollTop;
    var lastPreviewScrollTop;
    var buildSections = _.debounce(function() {

        mdSectionList = [];
        var mdTextOffset = 0;
        var mdSectionOffset = 0;
        var firstSectionOffset = offsetBegin;
        var padding = 0;
        function addTextareaSection(sectionText) {
            var sectionHeight = padding;
            if(sectionText !== undefined) {
                var textNode = document.createTextNode(sectionText);
                $textareaHelperElt.empty().append(textNode);
                sectionHeight += $textareaHelperElt.prop('scrollHeight');
            }
            var newSectionOffset = mdSectionOffset + sectionHeight;
            mdSectionList.push({
                startOffset: mdSectionOffset,
                endOffset: newSectionOffset,
                height: sectionHeight
            });
            mdSectionOffset = newSectionOffset;
        }
        if(window.lightMode) {
            // Special treatment for light mode
            $textareaHelperElt.innerWidth($textareaElt.innerWidth());
            _.each(sectionList, function(section, index) {
                var sectionText = section.text;
                if(index !== sectionList.length - 1) {
                    if(sectionText.length === 0) {
                        sectionText = undefined;
                    }
                }
                else {
                    if(/\n$/.test(sectionText)) {
                        // Need to add a line break to take into account a final empty line
                        sectionText += '\n';
                    }
                }
                addTextareaSection(sectionText);
            });

            // Apply a coef to manage divergence in some browsers
            var theoricalHeight = _.last(mdSectionList).endOffset;
            var realHeight = $textareaElt[0].scrollHeight;
            var coef = realHeight/theoricalHeight;
            mdSectionList = _.map(mdSectionList, function(mdSection) {
                return {
                    startOffset: mdSection.startOffset * coef,
                    endOffset: mdSection.endOffset * coef,
                    height: mdSection.height * coef,
                };
            });
        }
        else {
            // Everything's much simpler with ACE
            _.each(sectionList, function(section) {
                mdTextOffset += section.text.length + firstSectionOffset;
                firstSectionOffset = 0;
                var documentPosition = aceEditor.session.doc.indexToPosition(mdTextOffset);
                var screenPosition = aceEditor.session.documentToScreenPosition(documentPosition.row, documentPosition.column);
                var newSectionOffset = screenPosition.row * aceEditor.renderer.lineHeight;
                var sectionHeight = newSectionOffset - mdSectionOffset;
                mdSectionList.push({
                    startOffset: mdSectionOffset,
                    endOffset: newSectionOffset,
                    height: sectionHeight
                });
                mdSectionOffset = newSectionOffset;
            });
        }

        // Try to find corresponding sections in the preview
        htmlSectionList = [];
        var htmlSectionOffset;
        var previewScrollTop = $previewElt.scrollTop();
        $previewElt.find(".preview-content > .se-section-delimiter").each(function() {
            if(htmlSectionOffset === undefined) {
                // Force start to 0 for the first section
                htmlSectionOffset = 0;
                return;
            }
            var $delimiterElt = $(this);
            // Consider div scroll position
            var newSectionOffset = $delimiterElt.position().top + previewScrollTop;
            htmlSectionList.push({
                startOffset: htmlSectionOffset,
                endOffset: newSectionOffset,
                height: newSectionOffset - htmlSectionOffset
            });
            htmlSectionOffset = newSectionOffset;
        });
        // Last section
        var scrollHeight = $previewElt.prop('scrollHeight');
        htmlSectionList.push({
            startOffset: htmlSectionOffset,
            endOffset: scrollHeight,
            height: scrollHeight - htmlSectionOffset
        });

        // apply Scroll Link (-10 to have a gap > 9px)
        lastEditorScrollTop = -10;
        lastPreviewScrollTop = -10;
        doScrollLink();
    }, 500);

    function getDestScrollTop(srcScrollTop, srcSectionList, destSectionList) {
        // Find the section corresponding to the offset
        var sectionIndex;
        var srcSection = _.find(srcSectionList, function(section, index) {
            sectionIndex = index;
            return srcScrollTop < section.endOffset;
        });
        if(srcSection === undefined) {
            // Something wrong in the algorithm...
            return;
        }
        var posInSection = (srcScrollTop - srcSection.startOffset) / (srcSection.height || 1);
        var destSection = destSectionList[sectionIndex];
        return destSection.startOffset + destSection.height * posInSection;
    }

    var isScrollEditor = false;
    var isScrollPreview = false;
    var isEditorMoving = false;
    var isPreviewMoving = false;
    var scrollingHelper = $('<div>');
    var doScrollLink = _.throttle(function() {
        if(mdSectionList.length === 0 || mdSectionList.length !== htmlSectionList.length) {
            // Delay
            doScrollLink();
            return;
        }
        var editorScrollTop = window.lightMode ? $textareaElt.scrollTop() : aceEditor.renderer.getScrollTop();
        editorScrollTop < 0 && (editorScrollTop = 0);
        var previewScrollTop = $previewElt.scrollTop();
        
        var destScrollTop;
        // Perform the animation if diff > 9px
        if(isScrollEditor === true) {
            if(Math.abs(editorScrollTop - lastEditorScrollTop) <= 9) {
                return;
            }
            isScrollEditor = false;
            // Animate the preview
            lastEditorScrollTop = editorScrollTop;
            destScrollTop = getDestScrollTop(editorScrollTop, mdSectionList, htmlSectionList);
            destScrollTop = _.min([
                destScrollTop,
                $previewElt.prop('scrollHeight') - $previewElt.outerHeight()
            ]);
            if(Math.abs(destScrollTop - previewScrollTop) <= 9) {
                // Skip the animation if diff is <= 9
                lastPreviewScrollTop = previewScrollTop;
                return;
            }
            scrollingHelper.stop('scrollLinkFx', true).css('value', 0).animate({
                value: destScrollTop - previewScrollTop
            }, {
                easing: 'linear',
                duration: 200,
                queue: 'scrollLinkFx',
                step: function(now) {
                    isPreviewMoving = true;
                    lastPreviewScrollTop = previewScrollTop + now;
                    $previewElt.scrollTop(lastPreviewScrollTop);
                },
                done: function() {
                    _.defer(function() {
                        isPreviewMoving = false;
                    });
                },
            }).dequeue('scrollLinkFx');
        }
        else if(isScrollPreview === true) {
            if(Math.abs(previewScrollTop - lastPreviewScrollTop) <= 9) {
                return;
            }
            isScrollPreview = false;
            // Animate the editor
            lastPreviewScrollTop = previewScrollTop;
            destScrollTop = getDestScrollTop(previewScrollTop, htmlSectionList, mdSectionList);
            if(window.lightMode) {
                destScrollTop = _.min([
                    destScrollTop,
                    $textareaElt.prop('scrollHeight') - $textareaElt.outerHeight()
                ]);
            }
            else {
                destScrollTop = _.min([
                    destScrollTop,
                    aceEditor.session.getScreenLength() * aceEditor.renderer.lineHeight + aceEditor.renderer.scrollMargin.bottom - aceEditor.renderer.$size.scrollerHeight
                ]);
                // If negative, set it to zero
                destScrollTop < 0 && (destScrollTop = 0);
            }
            if(Math.abs(destScrollTop - editorScrollTop) <= 9) {
                // Skip the animation if diff is <= 9
                lastEditorScrollTop = editorScrollTop;
                return;
            }
            scrollingHelper.stop('scrollLinkFx', true).css('value', 0).animate({
                value: destScrollTop - editorScrollTop
            }, {
                easing: 'linear',
                duration: 200,
                queue: 'scrollLinkFx',
                step: function(now) {
                    isEditorMoving = true;
                    lastEditorScrollTop = editorScrollTop + now;
                    window.lightMode || aceEditor.session.setScrollTop(lastEditorScrollTop);
                    window.lightMode && $textareaElt.scrollTop(lastEditorScrollTop);
                },
                done: function() {
                    _.defer(function() {
                        isEditorMoving = false;
                    });
                },
            }).dequeue('scrollLinkFx');
        }
    }, 100);

    scrollLink.onLayoutResize = function() {
        isScrollEditor = true;
        buildSections();
    };

    scrollLink.onFileClosed = function() {
        mdSectionList = [];
    };

    function initScrollEvent () {

    }

    // 切换编辑模式时
    var onToggleMode = function (isOnToggleMode) {
        $previewElt = $(".preview-container");
        $textareaElt = $("#wmd-input");
        // This helper is used to measure sections height in light mode
        $textareaHelperElt = $('.textarea-helper');

        $previewElt.scroll(function() {
            if(isPreviewMoving === false && scrollAdjust === false) {
                isScrollPreview = true;
                isScrollEditor = false;
                doScrollLink();
            }
            scrollAdjust = false;
        });
        var handleEditorScroll = function() {
            if(isEditorMoving === false) {
                isScrollEditor = true;
                isScrollPreview = false;
                doScrollLink();
            }
        };

        // editor 滚动时操作
        var timeout = isOnToggleMode ? 500 : 0;
        setTimeout(function () {
            if(window.lightMode) {
                $textareaElt.scroll(handleEditorScroll);
            }
            else {
                aceEditor.session.on("changeScrollTop", handleEditorScroll);
            }
        }, timeout);
    };

    scrollLink.onToggleMode = function () {
        $previewElt = $(".preview-container");
        $textareaElt = $("#wmd-input");
        $textareaHelperElt = $('.textarea-helper');

        buildSections();

        // 可以不要这一段
        // isScrollPreview = true;
        // isScrollEditor = false;
        // doScrollLink();

        // console.log('-----------------')
        onToggleMode(true);

        // 左侧滚动到之前的位置
        // $previewElt.scrollTop($previewElt.scrollTop());
    };

    var scrollAdjust = false;
    scrollLink.onReady = function() {
        $previewElt = $(".preview-container");
        $textareaElt = $("#wmd-input");
        // This helper is used to measure sections height in light mode
        $textareaHelperElt = $('.textarea-helper');

        onToggleMode();

        // 添加目录, 两种目录
        // Reimplement anchor scrolling to work without preview
        $('.extension-preview-buttons .table-of-contents, #preview-contents').on('click', 'a', function(evt) {
            var id = this.hash;
            if (!id) {
                return;
            }
            evt.preventDefault();
            var anchorElt = $('#preview-contents ' + decodeURIComponent(id));
            if(!anchorElt.length) {
                return;
            }
            var previewScrollTop = anchorElt[0].getBoundingClientRect().top - $previewElt.get(0).getBoundingClientRect().top + $previewElt.scrollTop();
            var editorScrollTop = getDestScrollTop(previewScrollTop, htmlSectionList, mdSectionList);

            $previewElt.scrollTop(previewScrollTop);
            window.lightMode || aceEditor.session.setScrollTop(editorScrollTop);
            window.lightMode && $textareaElt.scrollTop(editorScrollTop);
        });
    };

    var $previewContentsElt;
    scrollLink.onPagedownConfigure = function(editor) {
        $previewContentsElt = $("#preview-contents");
        editor.getConverter().hooks.chain("postConversion", function(text) {
            // To avoid losing scrolling position before elements are fully
            // loaded
            $previewContentsElt.height($previewContentsElt.height());
            return text;
        });
    };

    scrollLink.onPreviewFinished = function() {
        // Now set the correct height
        var previousHeight = $previewContentsElt.height();
        $previewContentsElt.height("auto");
        var newHeight = $previewContentsElt.height();
        isScrollEditor = true;
        if(newHeight < previousHeight) {
            // We expect a scroll adjustment
            scrollAdjust = true;
        }
        buildSections();
    };

    return scrollLink;
});

define('extensions/htmlSanitizer',[
	// "jquery",
	"underscore",
	"utils",
	"classes/Extension",
	// "ext!html/htmlSanitizerSettingsBlock.html"
], function(_, utils, Extension) {

	var htmlSanitizer = new Extension("htmlSanitizer", "HTML Sanitizer", true);
	// htmlSanitizer.settingsBlock = htmlSanitizerSettingsBlockHTML;

	var buf;
	htmlSanitizer.onPagedownConfigure = function(editor) {
		var converter = editor.getConverter();
		converter.hooks.chain("postConversion", function(html) {
			buf = [];
			html.split('<div class="se-preview-section-delimiter"></div>').forEach(function(sectionHtml) {
				htmlParser(sectionHtml, htmlSanitizeWriter(buf
					/*, function(uri, isImage) {
					return !/^unsafe/.test(sanitizeUri(uri, isImage));
				}*/));
				buf.push('<div class="se-preview-section-delimiter"></div>');
			});
			return buf.slice(0, -1).join('');
		});
	};

	/**
	 * @license AngularJS v1.2.16
	 * (c) 2010-2014 Google, Inc. http://angularjs.org
	 * License: MIT
	 */

	// var aHrefSanitizationWhitelist = /^\s*(https?|ftp|mailto|tel|file):/,
		// imgSrcSanitizationWhitelist = /^\s*(https?|ftp|file|leanote):|data:image\//;
	/*
	var urlResolve = (function() {
		var urlParsingNode = document.createElement("a");
		return function urlResolve(url) {
			var href = url;

			if (utils.msie) {
				// Normalize before parse.  Refer Implementation Notes on why this is
				// done in two steps on IE.
				urlParsingNode.setAttribute("href", href);
				href = urlParsingNode.href;
			}

			urlParsingNode.setAttribute('href', href);

			// urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
			return {
				href: urlParsingNode.href,
				protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
				host: urlParsingNode.host,
				search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
				hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
				hostname: urlParsingNode.hostname,
				port: urlParsingNode.port,
				pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
					urlParsingNode.pathname : '/' + urlParsingNode.pathname
			};
		};
	})();

	function sanitizeUri(uri, isImage) {
		var regex = isImage ? imgSrcSanitizationWhitelist : aHrefSanitizationWhitelist;
		var normalizedVal;
		normalizedVal = urlResolve(uri).href;
		if(normalizedVal !== '' && !normalizedVal.match(regex)) {
			return 'unsafe:' + normalizedVal;
		}
	}
	*/

	// Regular Expressions for parsing tags and attributes
	var START_TAG_REGEXP =
			/^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/,
		END_TAG_REGEXP = /^<\s*\/\s*([\w:-]+)[^>]*>/,
		ATTR_REGEXP = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
		BEGIN_TAG_REGEXP = /^</,
		BEGING_END_TAGE_REGEXP = /^<\s*\//,
		COMMENT_REGEXP = /<!--(.*?)-->/g,
		DOCTYPE_REGEXP = /<!DOCTYPE([^>]*?)>/i,
		CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g,
		// Match everything outside of normal chars and " (quote character)
		NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;

	function makeMap(str) {
		var obj = {}, items = str.split(','), i;
		for(i = 0; i < items.length; i++) {
			obj[items[i]] = true;
		}
		return obj;
	}

	// Good source of info about elements and attributes
	// http://dev.w3.org/html5/spec/Overview.html#semantics
	// http://simon.html5.org/html-elements

	// Safe Void Elements - HTML5
	// http://dev.w3.org/html5/spec/Overview.html#void-elements
	var voidElements = makeMap("area,br,col,hr,img,wbr");

	// Elements that you can, intentionally, leave open (and which close themselves)
	// http://dev.w3.org/html5/spec/Overview.html#optional-tags
	var optionalEndTagBlockElements = makeMap("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
		optionalEndTagInlineElements = makeMap("rp,rt"),
		optionalEndTagElements = _.extend({},
			optionalEndTagInlineElements,
			optionalEndTagBlockElements);

	// 允许的elements
	// Safe Block Elements - HTML5
	var blockElements = _.extend({}, optionalEndTagBlockElements, makeMap("address,article," +
		"aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5," +
		"h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul,embed,iframe"));

	// Inline Elements - HTML5
	var inlineElements = _.extend({}, optionalEndTagInlineElements, makeMap("a,abbr,acronym,b," +
		"bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s," +
		"samp,small,span,strike,strong,sub,sup,time,tt,u,var,input"));

	// Special Elements (can contain anything)
	// var specialElements = makeMap("script,style"); //  style为什么需要, 是因为表格style="align:left"
	var specialElements = makeMap("script"); //  style为什么需要, 是因为表格style="align:left"

	// benweet: Add iframe
	// blockElements.iframe = true;

	var validElements = _.extend({},
		voidElements,
		blockElements,
		inlineElements,
		optionalEndTagElements);

	//Attributes that have href and hence need to be sanitized
	var uriAttrs = makeMap("background,cite,href,longdesc,src,usemap");
	var validAttrs = _.extend({}, uriAttrs, makeMap(
			'abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,' +
			'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,' +
			'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,' +
			'scope,scrolling,shape,size,span,start,summary,target,title,type,' +
			'valign,value,vspace,width,checked,style')); // style为什么需要, 是因为表格style="align:left"

	// benweet: Add id and allowfullscreen (YouTube iframe)
	validAttrs.id = true;
	validAttrs.allowfullscreen = true;

	/*
	 * HTML Parser By Misko Hevery (misko@hevery.com)
	 * based on:  HTML Parser By John Resig (ejohn.org)
	 * Original code by Erik Arvidsson, Mozilla Public License
	 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
	 *
	 * // Use like so:
	 * htmlParser(htmlString, {
	 *     start: function(tag, attrs, unary) {},
	 *     end: function(tag) {},
	 *     chars: function(text) {},
	 *     comment: function(text) {}
	 * });
	 *
	 */
	/* jshint -W083 */
	function htmlParser(html, handler) {
		var index, chars, match, stack = [], last = html;
		stack.last = function() {
			return stack[ stack.length - 1 ];
		};

		function parseStartTag(tag, tagName, rest, unary) {
			tagName = tagName && tagName.toLowerCase();
			if(blockElements[ tagName ]) {
				while(stack.last() && inlineElements[ stack.last() ]) {
					parseEndTag("", stack.last());
				}
			}

			if(optionalEndTagElements[ tagName ] && stack.last() == tagName) {
				parseEndTag("", tagName);
			}

			unary = voidElements[ tagName ] || !!unary;

			if(!unary) {
				stack.push(tagName);
			}

			var attrs = {};

			rest.replace(ATTR_REGEXP,
				function(match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
					var value = doubleQuotedValue ||
						singleQuotedValue ||
						unquotedValue ||
						'';

					attrs[name] = decodeEntities(value);
				});
			if(handler.start) {
				handler.start(tagName, attrs, unary);
			}
		}

		function parseEndTag(tag, tagName) {
			var pos = 0, i;
			tagName = tagName && tagName.toLowerCase();
			if(tagName) {
				// Find the closest opened tag of the same type
				for(pos = stack.length - 1; pos >= 0; pos--) {
					if(stack[ pos ] == tagName) {
						break;
					}
				}
			}

			if(pos >= 0) {
				// Close all the open elements, up the stack
				for(i = stack.length - 1; i >= pos; i--) {
					if(handler.end) {
						handler.end(stack[ i ]);
					}
				}

				// Remove the open elements from the stack
				stack.length = pos;
			}
		}

		while(html) {
			chars = true;

			// Make sure we're not in a script or style element
			if(!stack.last() || !specialElements[ stack.last() ]) {

				// Comment
				if(html.indexOf("<!--") === 0) {
					// comments containing -- are not allowed unless they terminate the comment
					index = html.indexOf("--", 4);

					if(index >= 0 && html.lastIndexOf("-->", index) === index) {
						if(handler.comment) {
							handler.comment(html.substring(4, index));
						}
						html = html.substring(index + 3);
						chars = false;
					}
					// DOCTYPE
				} else if(DOCTYPE_REGEXP.test(html)) {
					match = html.match(DOCTYPE_REGEXP);

					if(match) {
						html = html.replace(match[0], '');
						chars = false;
					}
					// end tag
				} else if(BEGING_END_TAGE_REGEXP.test(html)) {
					match = html.match(END_TAG_REGEXP);

					if(match) {
						html = html.substring(match[0].length);
						match[0].replace(END_TAG_REGEXP, parseEndTag);
						chars = false;
					}

					// start tag
				} else if(BEGIN_TAG_REGEXP.test(html)) {
					match = html.match(START_TAG_REGEXP);

					if(match) {
						html = html.substring(match[0].length);
						match[0].replace(START_TAG_REGEXP, parseStartTag);
						chars = false;
					}
				}

				if(chars) {
					index = html.indexOf("<");

					var text = index < 0 ? html : html.substring(0, index);
					html = index < 0 ? "" : html.substring(index);

					if(handler.chars) {
						handler.chars(decodeEntities(text));
					}
				}

			} else {
				html = html.replace(new RegExp("(.*)<\\s*\\/\\s*" + stack.last() + "[^>]*>", 'i'),
					function(all, text) {
						text = text.replace(COMMENT_REGEXP, "$1").replace(CDATA_REGEXP, "$1");

						if(handler.chars) {
							handler.chars(decodeEntities(text));
						}

						return "";
					});

				parseEndTag("", stack.last());
			}

			if(html == last) {
				//throw new Error("The sanitizer was unable to parse the following block of html: " + html);
				stack.reverse();
				return stack.forEach(function(tag) {
					buf.push('</');
					buf.push(tag);
					buf.push('>');
				});
			}
			last = html;
		}

		// Clean up any remaining tags
		parseEndTag();
	}

	var hiddenPre = document.createElement("pre");
	var spaceRe = /^(\s*)([\s\S]*?)(\s*)$/;

	/**
	 * decodes all entities into regular string
	 * @param value
	 * @returns {string} A string with decoded entities.
	 */
	function decodeEntities(value) {
		if(!value) {
			return '';
		}

		// Note: IE8 does not preserve spaces at the start/end of innerHTML
		// so we must capture them and reattach them afterward
		var parts = spaceRe.exec(value);
		var spaceBefore = parts[1];
		var spaceAfter = parts[3];
		var content = parts[2];
		if(content) {
			hiddenPre.innerHTML = content.replace(/</g, "&lt;");
			// innerText depends on styling as it doesn't display hidden elements.
			// Therefore, it's better to use textContent not to cause unnecessary
			// reflows. However, IE<9 don't support textContent so the innerText
			// fallback is necessary.
			content = 'textContent' in hiddenPre ?
				hiddenPre.textContent : hiddenPre.innerText;
		}
		return spaceBefore + content + spaceAfter;
	}

	/**
	 * Escapes all potentially dangerous characters, so that the
	 * resulting string can be safely inserted into attribute or
	 * element text.
	 * @param value
	 * @returns {string} escaped text
	 */
	function encodeEntities(value) {
		return value.
			replace(/&/g, '&amp;').
			replace(NON_ALPHANUMERIC_REGEXP, function(value) {
				return '&#' + value.charCodeAt(0) + ';';
			}).
			replace(/</g, '&lt;').
			replace(/>/g, '&gt;');
	}


	/**
	 * create an HTML/XML writer which writes to buffer
	 * @param {Array} buf use buf.jain('') to get out sanitized html string
	 * @returns {object} in the form of {
	 *     start: function(tag, attrs, unary) {},
	 *     end: function(tag) {},
	 *     chars: function(text) {},
	 *     comment: function(text) {}
	 * }
	 */
	function htmlSanitizeWriter(buf /* , uriValidator */ ) {
		var ignore = false;
		var out = _.bind(buf.push, buf);
		return {
			start: function(tag, attrs, unary) {
				tag = tag && tag.toLowerCase();
				if(!ignore && specialElements[tag]) {
					ignore = tag;
				}
				if(!ignore && validElements[tag] === true) {
					out('<');
					out(tag);
					_.forEach(attrs, function(value, key) {
						var lkey = key && key.toLowerCase();
						// var isImage = (tag === 'img' && lkey === 'src') || (lkey === 'background');
						if(validAttrs[lkey] === true &&
							(uriAttrs[lkey] !== true || true/* || uriValidator(value, isImage) */)) {
							out(' ');
							out(key);
							out('="');
							out(encodeEntities(value));
							out('"');
						}
					});
					out(unary ? '/>' : '>');
				}
			},
			end: function(tag) {
				tag = tag && tag.toLowerCase();
				if(!ignore && validElements[tag] === true) {
					out('</');
					out(tag);
					out('>');
				}
				if(tag == ignore) {
					ignore = false;
				}
			},
			chars: function(chars) {
				if(!ignore) {
					out(encodeEntities(chars));
				}
			},
			comment: function(comment) {
				if(!ignore) {
					out('<!--');
					out(encodeEntities(comment));
					out('-->');
				}
			}
		};
	}

	return htmlSanitizer;
});
/*
 * waitForImages 1.4.2
 * -------------------
 * Provides a callback when all images have loaded in your given selector.
 * https://github.com/alexanderdickson/waitForImages
 *
 * Copyright (c) 2013 Alex Dickson
 * Licensed under the MIT license.
 */
(function ($) {
    // Namespace all events.
    var eventNamespace = 'waitForImages';

    // CSS properties which contain references to images.
    $.waitForImages = {
        hasImageProperties: ['backgroundImage', 'listStyleImage', 'borderImage', 'borderCornerImage']
    };

    // Custom selector to find `img` elements that have a valid `src` attribute and have not already loaded.
    $.expr[':'].uncached = function (obj) {
        // Ensure we are dealing with an `img` element with a valid `src` attribute.
        if (!$(obj).is('img[src!=""]')) {
            return false;
        }

        // Firefox's `complete` property will always be `true` even if the image has not been downloaded.
        // Doing it this way works in Firefox.
        var img = new Image();
        img.src = obj.src;
        return !img.complete;
    };

    $.fn.waitForImages = function (finishedCallback, eachCallback, waitForAll) {

        var allImgsLength = 0;
        var allImgsLoaded = 0;

        // Handle options object.
        if ($.isPlainObject(arguments[0])) {
            waitForAll = arguments[0].waitForAll;
            eachCallback = arguments[0].each;
			// This must be last as arguments[0]
			// is aliased with finishedCallback.
            finishedCallback = arguments[0].finished;
        }

        // Handle missing callbacks.
        finishedCallback = finishedCallback || $.noop;
        eachCallback = eachCallback || $.noop;

        // Convert waitForAll to Boolean
        waitForAll = !! waitForAll;

        // Ensure callbacks are functions.
        if (!$.isFunction(finishedCallback) || !$.isFunction(eachCallback)) {
            throw new TypeError('An invalid callback was supplied.');
        }

        return this.each(function () {
            // Build a list of all imgs, dependent on what images will be considered.
            var obj = $(this);
            var allImgs = [];
            // CSS properties which may contain an image.
            var hasImgProperties = $.waitForImages.hasImageProperties || [];
            // To match `url()` references.
            // Spec: http://www.w3.org/TR/CSS2/syndata.html#value-def-uri
            var matchUrl = /url\(\s*(['"]?)(.*?)\1\s*\)/g;

            if (waitForAll) {

                // Get all elements (including the original), as any one of them could have a background image.
                obj.find('*').andSelf().each(function () {
                    var element = $(this);

                    // If an `img` element, add it. But keep iterating in case it has a background image too.
                    if (element.is('img:uncached')) {
                        allImgs.push({
                            src: element.attr('src'),
                            element: element[0]
                        });
                    }

                    $.each(hasImgProperties, function (i, property) {
                        var propertyValue = element.css(property);
                        var match;

                        // If it doesn't contain this property, skip.
                        if (!propertyValue) {
                            return true;
                        }

                        // Get all url() of this element.
                        while (match = matchUrl.exec(propertyValue)) {
                            allImgs.push({
                                src: match[2],
                                element: element[0]
                            });
                        }
                    });
                });
            } else {
                // For images only, the task is simpler.
                obj.find('img:uncached')
                    .each(function () {
                    allImgs.push({
                        src: this.src,
                        element: this
                    });
                });
            }

            allImgsLength = allImgs.length;
            allImgsLoaded = 0;

            // If no images found, don't bother.
            if (allImgsLength === 0) {
                finishedCallback.call(obj[0]);
            }

            $.each(allImgs, function (i, img) {

                var image = new Image();

                // Handle the image loading and error with the same callback.
                $(image).bind('load.' + eventNamespace + ' error.' + eventNamespace, function (event) {
                    allImgsLoaded++;

                    // If an error occurred with loading the image, set the third argument accordingly.
                    eachCallback.call(img.element, allImgsLoaded, allImgsLength, event.type == 'load');

                    if (allImgsLoaded == allImgsLength) {
                        finishedCallback.call(obj[0]);
                        return false;
                    }

                });

                image.src = img.src;
            });
        });
    };
}(jQuery));

define("jquery-waitforimages", function(){});

define('eventMgr',[
    // "jquery",
    "underscore",
    "crel",
    "utils",
    "classes/Extension",
    "settings",
    // "text!html/settingsExtensionsAccordion.html",
    // "extensions/yamlFrontMatterParser",
    "extensions/markdownSectionParser",
    "extensions/partialRendering",
    // "extensions/buttonMarkdownSyntax",
    // "extensions/googleAnalytics",
    // "extensions/twitter",
    // "extensions/dialogAbout",
    // "extensions/dialogManagePublication",
    // "extensions/dialogManageSynchronization",
    // "extensions/dialogManageSharing",
    // "extensions/dialogOpenHarddrive",
    // "extensions/documentTitle",
    // "extensions/documentSelector",
    // "extensions/documentPanel",
    // "extensions/documentManager",
    // "extensions/workingIndicator",
    // "extensions/notifications",
    "extensions/umlDiagrams",
    "extensions/markdownExtra",
    "extensions/toc",
    "extensions/mathJax",
    "extensions/emailConverter",
    "extensions/todoList",
    "extensions/scrollLink",
    "extensions/htmlSanitizer",
    // "extensions/buttonFocusMode",
    // "extensions/buttonSync",
    // "extensions/buttonPublish",
    // "extensions/buttonStat",
    // "extensions/buttonHtmlCode",
    // "extensions/buttonViewer",
    // "extensions/welcomeTour",
    // "extensions/spellCheck",
    // "extensions/userCustom",
    // "bootstrap",
    "jquery-waitforimages"
], function(_, crel, utils, Extension, settings, settingsExtensionsAccordionHTML) {

    var eventMgr = {};

    // Create a list of extensions from module arguments
    var extensionList = _.chain(arguments).map(function(argument) {
        return argument instanceof Extension && argument;
    }).compact().value();

    // Configure extensions
    var extensionSettings = settings.extensionSettings || {};
    _.each(extensionList, function(extension) {
        // Set the extension.config attribute from settings or default
        // configuration
        extension.config = _.extend({}, extension.defaultConfig, extensionSettings[extension.extensionId]);
        if(window.viewerMode === true && extension.disableInViewer === true) {
            // Skip enabling the extension if we are in the viewer and extension
            // doesn't support it
            extension.enabled = false;
        }
        else if(window.lightMode === true && extension.disableInLight === true) {
            // Same for light mode
            extension.enabled = false;
        }
        else {
            // Enable the extension if it's not optional or it has not been
            // disabled by the user
            extension.enabled = !extension.isOptional || extension.config.enabled === undefined || extension.config.enabled === true;
        }
    });

    // Returns all listeners with the specified name that are implemented in the
    // enabled extensions
    function getExtensionListenerList(eventName) {
        return _.chain(extensionList).map(function(extension) {
            return extension.enabled && extension[eventName];
        }).compact().value();
    }

    // Returns a function that calls every listeners with the specified name
    // from all enabled extensions
    var eventListenerListMap = {};
    function createEventHook(eventName) {
        eventListenerListMap[eventName] = getExtensionListenerList(eventName);
        return function() {
            var eventArguments = arguments;
            _.each(eventListenerListMap[eventName], function(listener) {
                // Use try/catch in case userCustom listener contains error
                try {
                    listener.apply(null, eventArguments);
                }
                catch(e) {
                    console.error(_.isObject(e) ? e.stack : e);
                }
            });
        };
    }

    // Declare an event Hook in the eventMgr that we can fire using eventMgr.eventName()
    function addEventHook(eventName) {
        eventMgr[eventName] = createEventHook(eventName);
    }

    // Used by external modules (not extensions) to listen to events
    eventMgr.addListener = function(eventName, listener) {
        try {
            eventListenerListMap[eventName].push(listener);
        }
        catch(e) {
            console.error('No event listener called ' + eventName);
        }
    };

    // Call every onInit listeners (enabled extensions only)
    createEventHook("onInit")();

    // Load/Save extension config from/to settings
    eventMgr.onLoadSettings = function() {
        _.each(extensionList, function(extension) {
            var isChecked = !extension.isOptional || extension.config.enabled === undefined || extension.config.enabled === true;
            utils.setInputChecked("#input-enable-extension-" + extension.extensionId, isChecked);
            // Special case for Markdown Extra and MathJax
            if(extension.extensionId == 'markdownExtra') {
                utils.setInputChecked("#input-settings-markdown-extra", isChecked);
            }
            else if(extension.extensionId == 'mathJax') {
                utils.setInputChecked("#input-settings-mathjax", isChecked);
            }
            var onLoadSettingsListener = extension.onLoadSettings;
            onLoadSettingsListener && onLoadSettingsListener();
        });
    };
    eventMgr.onSaveSettings = function(newExtensionSettings, event) {
        _.each(extensionList, function(extension) {
            if(window.lightMode === true && extension.disableInLight === true) {
                newExtensionSettings[extension.extensionId] = extension.config;
                return;
            }
            var newExtensionConfig = _.extend({}, extension.defaultConfig);
            newExtensionConfig.enabled = utils.getInputChecked("#input-enable-extension-" + extension.extensionId);
            var isChecked;
            // Special case for Markdown Extra and MathJax
            if(extension.extensionId == 'markdownExtra') {
                isChecked = utils.getInputChecked("#input-settings-markdown-extra");
                if(isChecked != extension.enabled) {
                    newExtensionConfig.enabled = isChecked;
                }
            }
            else if(extension.extensionId == 'mathJax') {
                isChecked = utils.getInputChecked("#input-settings-mathjax");
                if(isChecked != extension.enabled) {
                    newExtensionConfig.enabled = isChecked;
                }
            }
            var onSaveSettingsListener = extension.onSaveSettings;
            onSaveSettingsListener && onSaveSettingsListener(newExtensionConfig, event);
            newExtensionSettings[extension.extensionId] = newExtensionConfig;
        });
    };

    addEventHook("onMessage");
    addEventHook("onError");
    // addEventHook("onOfflineChanged");
    // addEventHook("onUserActive");
    // addEventHook("onAsyncRunning");
    addEventHook("onPeriodicRun");

    // To access modules that are loaded after extensions
    addEventHook("onFileMgrCreated");
    addEventHook("onSynchronizerCreated");
    addEventHook("onPublisherCreated");
    addEventHook("onEventMgrCreated");

    // Operations on files
    addEventHook("onFileCreated");
    addEventHook("onFileDeleted");
    addEventHook("onFileSelected");
    addEventHook("onFileOpen");
    addEventHook("onFileClosed");
    addEventHook("onContentChanged");

    addEventHook('onToggleMode');
    // addEventHook("onTitleChanged");

    // Operations on folders
    // addEventHook("onFoldersChanged");

    // Sync events
    // addEventHook("onSyncRunning");
    // addEventHook("onSyncSuccess");
    // addEventHook("onSyncImportSuccess");
    // addEventHook("onSyncExportSuccess");
    // addEventHook("onSyncRemoved");

    // Publish events
    // addEventHook("onPublishRunning");
    // addEventHook("onPublishSuccess");
    // addEventHook("onNewPublishSuccess");
    // addEventHook("onPublishRemoved");

    // Operations on Layout
    addEventHook("onLayoutConfigure");
    addEventHook("onLayoutCreated");
    addEventHook("onLayoutResize");

    // Operations on PageDown
    addEventHook("onPagedownConfigure");
    addEventHook("onSectionsCreated");
    addEventHook("onMarkdownTrim");

    // Operation on ACE
    addEventHook("onAceCreated");
    
    // Refresh twitter buttons
    // addEventHook("onTweet");
    

    var onPreviewFinished = createEventHook("onPreviewFinished");
    var onAsyncPreviewListenerList = getExtensionListenerList("onAsyncPreview");
    var previewContentsElt;
    var $previewContentsElt;
    eventMgr.onAsyncPreview = function() {
        function recursiveCall(callbackList) {
            var callback = callbackList.length ? callbackList.shift() : function() {
                _.defer(function() {
                    var html = "";
                    _.each(previewContentsElt.children, function(elt) {
                        html += elt.innerHTML;
                    });
                    html = html.replace(/^<div class="se-section-delimiter"><\/div>\n\n/gm, '');
                    var htmlWithComments = utils.trim(html);
                    var htmlWithoutComments = htmlWithComments.replace(/ <span class="comment label label-danger">.*?<\/span> /g, '');
                    onPreviewFinished(htmlWithComments, htmlWithoutComments);
                });
            };
            callback(function() {
                recursiveCall(callbackList);
            });
        }
        recursiveCall(onAsyncPreviewListenerList.concat([function(callback) {
            // We assume some images are loading asynchronously after the preview
            $previewContentsElt.waitForImages(callback);
        }]));
    };

    var onReady = createEventHook("onReady");
    eventMgr.onReady = function() {
        previewContentsElt = document.getElementById('preview-contents');
        $previewContentsElt = $(previewContentsElt);

        // Create a button from an extension listener
        var createBtn = function(listener) {
            var buttonGrpElt = crel('div', {
                class: 'btn-group'
            });
            var btnElt = listener();
            if(_.isString(btnElt)) {
                buttonGrpElt.innerHTML = btnElt;
            }
            else if(_.isElement(btnElt)) {
                buttonGrpElt.appendChild(btnElt);
            }
            return buttonGrpElt;
        };

        if(window.viewerMode === false) {
            // // Create accordion in settings dialog
            // var accordionHtml = _.chain(extensionList).sortBy(function(extension) {
            //     return extension.extensionName.toLowerCase();
            // }).reduce(function(html, extension) {
            //     return html + (extension.settingsBlock && !(window.lightMode === true && extension.disableInLight === true) ? _.template(settingsExtensionsAccordionHTML, {
            //         extensionId: extension.extensionId,
            //         extensionName: extension.extensionName,
            //         isOptional: extension.isOptional,
            //         settingsBlock: extension.settingsBlock
            //     }) : "");
            // }, "").value();
            // document.querySelector('.accordion-extensions').innerHTML = accordionHtml;
            
            // // Create extension buttons
            // logger.log("onCreateButton");
            // var onCreateButtonListenerList = getExtensionListenerList("onCreateButton");
            // var extensionButtonsFragment = document.createDocumentFragment();
            // _.each(onCreateButtonListenerList, function(listener) {
            //     extensionButtonsFragment.appendChild(createBtn(listener));
            // });
            // document.querySelector('.extension-buttons').appendChild(extensionButtonsFragment);

            // Create extension editor buttons
            // logger.log("onCreateEditorButton");
            var onCreateEditorButtonListenerList = getExtensionListenerList("onCreateEditorButton");
            var extensionEditorButtonsFragment = document.createDocumentFragment();
            _.each(onCreateEditorButtonListenerList, function(listener) {
                extensionEditorButtonsFragment.appendChild(createBtn(listener));
            });
            // var editorButtonsElt = document.querySelector('.extension-editor-buttons');
            // editorButtonsElt.appendChild(extensionEditorButtonsFragment);
        }

        // Create extension preview buttons
        // logger.log("onCreatePreviewButton");
        var onCreatePreviewButtonListenerList = getExtensionListenerList("onCreatePreviewButton");
        var extensionPreviewButtonsFragment = document.createDocumentFragment();
        _.each(onCreatePreviewButtonListenerList, function(listener) {
            extensionPreviewButtonsFragment.appendChild(createBtn(listener));
        });
        var previewButtonsElt = document.querySelector('.extension-preview-buttons');
        previewButtonsElt.appendChild(extensionPreviewButtonsFragment);

        // A bit of jQuery...
        var $previewButtonsElt = $(previewButtonsElt);
        var previewButtonsWidth = $previewButtonsElt.width();
        $previewButtonsElt.find('.btn-group').each(function() {
            var $btnGroupElt = $(this);
            // Align dropdown to the left of the screen
            $btnGroupElt.find('.dropdown-menu').css({
                right: -previewButtonsWidth + $btnGroupElt.width() + $btnGroupElt.position().left
            });
        });
        
        // Call onReady listeners
        onReady();
    };

    // For extensions that need to call other extensions
    eventMgr.onEventMgrCreated(eventMgr);
    return eventMgr;
});
define('shortcutMgr',[
    "underscore",
    "eventMgr",
    "utils",
], function(_, eventMgr, utils, settingsShortcutEntryHTML) {

    var shortcutMgr = {};

    var shortcuts = {
        'bold': {
            title: 'Strong',
            defaultKey: {
                win: 'Ctrl-B',
                mac: 'Command-B|Ctrl-B',
            },
            isPageDown: true
        },
        'italic': {
            title: 'Emphasis',
            defaultKey: {
                win: 'Ctrl-I',
                mac: 'Command-I|Ctrl-I',
            },
            isPageDown: true
        },
        'link': {
            title: 'Hyperlink',
            defaultKey: {
                win: 'Ctrl-L',
                mac: 'Command-L|Ctrl-L',
            },
            isPageDown: true
        },
        'quote': {
            title: 'Blockquote',
            defaultKey: {
                win: 'Ctrl-Q',
                mac: 'Command-Q|Ctrl-Q',
            },
            isPageDown: true
        },
        'code': {
            title: 'Code Sample',
            defaultKey: {
                win: 'Ctrl-K',
                mac: 'Command-K|Ctrl-K',
            },
            isPageDown: true
        },
        'image': {
            title: 'Image',
            defaultKey: {
                win: 'Ctrl-G',
                mac: 'Command-G|Ctrl-G',
            },
            isPageDown: true
        },
        'olist': {
            title: 'Numbered List',
            defaultKey: {
                win: 'Ctrl-O',
                mac: 'Command-O|Ctrl-O',
            },
            isPageDown: true
        },
        'ulist': {
            title: 'Bulleted List',
            defaultKey: {
                win: 'Ctrl-U',
                mac: 'Command-U|Ctrl-U',
            },
            isPageDown: true
        },
        'heading': {
            title: 'Heading',
            defaultKey: {
                win: 'Ctrl-H',
                mac: 'Command-H|Ctrl-H',
            },
            isPageDown: true
        },
        'hr': {
            title: 'Horizontal Rule',
            defaultKey: {
                win: 'Ctrl-R',
                mac: 'Command-R|Ctrl-R',
            },
            isPageDown: true
        },
        'undo': {
            title: 'Undo',
            defaultKey: {
                win: 'Ctrl-Z',
                mac: 'Command-Z',
            },
            exec: function (editor) {
                editor.undo();
            },
            isPageDown: true
        },
        'redo': {
            title: 'Redo',
            defaultKey: {
                win: 'Ctrl-Y|Ctrl-Shift-Z',
                mac: 'Command-Y|Command-Shift-Z',
            },
            exec: function (editor) {
                editor.redo();
            },
            isPageDown: true
        },
        'selectall': {
            title: 'Select All',
            defaultKey: {
                win: 'Ctrl-A',
                mac: 'Command-A',
            },
            exec: function (editor) {
                editor.selectAll();
            },
            readOnly: true
        },
        'removeline': {
            title: 'Remove Line',
            defaultKey: {
                win: 'Ctrl-D',
                mac: 'Command-D',
            },
            exec: function (editor) {
                editor.removeLines();
            },
            multiSelectAction: "forEachLine"
        },
        'duplicateSelection': {
            title: 'Duplicate Selection',
            defaultKey: {
                win: 'Ctrl-Shift-D',
                mac: 'Command-Shift-D',
            },
            exec: function (editor) {
                editor.duplicateSelection();
            },
            multiSelectAction: "forEach"
        },
        'sortlines': {
            title: 'Sort Lines',
            defaultKey: {
                win: 'Ctrl-Alt-S',
                mac: 'Command-Alt-S',
            },
            exec: function (editor) {
                editor.sortLines();
            },
            multiSelectAction: "forEachLine"
        },
        'modifyNumberUp': {
            title: 'Number Up',
            defaultKey: {
                win: 'Ctrl-Shift-Up',
                mac: 'Alt-Shift-Up',
            },
            exec: function (editor) {
                editor.modifyNumber(1);
            },
            multiSelectAction: "forEach"
        },
        'modifyNumberDown': {
            title: 'Number Down',
            defaultKey: {
                win: 'Ctrl-Shift-Down',
                mac: 'Alt-Shift-Down',
            },
            exec: function (editor) {
                editor.modifyNumber(-1);
            },
            multiSelectAction: "forEach"
        },
        'find': {
            title: 'Find',
            defaultKey: {
                win: 'Ctrl-F',
                mac: 'Command-F',
            },
            exec: function (editor) {
                var config = ace.require("ace/config");
                config.loadModule("ace/ext/searchbox", function (e) {
                    e.Search(editor);
                });
            },
            readOnly: true
        },
        'replace': {
            title: 'Replace',
            defaultKey: {
                win: 'Ctrl-Shift-F',
                mac: 'Command-Option-F',
            },
            exec: function (editor) {
                var config = require("ace/config");
                config.loadModule("ace/ext/searchbox", function (e) {
                    e.Search(editor, true);
                });
            },
            readOnly: true
        },
        'findnext': {
            title: 'Find Next',
            defaultKey: {
                win: 'Ctrl-P',
                mac: 'Command-P',
            },
            exec: function (editor) {
                editor.findNext();
            },
            readOnly: true
        },
        'findprevious': {
            title: 'Find Previous',
            defaultKey: {
                win: 'Ctrl-Shift-P',
                mac: 'Command-Shift-P',
            },
            exec: function (editor) {
                editor.findPrevious();
            },
            readOnly: true
        },
        'togglerecording': {
            title: 'Toggle Recording',
            defaultKey: {
                win: 'Ctrl-Alt-E',
                mac: 'Command-Option-E',
            },
            exec: function (editor) {
                editor.commands.toggleRecording(editor);
            },
            readOnly: true
        },
        'replaymacro': {
            title: 'Replay Macro',
            defaultKey: {
                win: 'Ctrl-Shift-E',
                mac: 'Command-Shift-E',
            },
            exec: function (editor) {
                editor.commands.replay(editor);
            },
            readOnly: true
        },
    };

    _.each(shortcuts, function (shortcut, key) {
        shortcut.name = key;
        shortcut.bindKey = shortcut.defaultKey;
    });

    shortcutMgr.configureAce = function (aceEditor) {
        _.each(shortcuts, function (shortcut) {
            shortcut.exec && aceEditor.commands.addCommand(_.pick(shortcut, 'name', 'bindKey', 'exec', 'readOnly', 'multiSelectAction'));
        });
    };

    shortcutMgr.getPagedownKeyStrokes = function () {
        return _.chain(shortcuts).where({
            isPageDown: true
        }).map(function (shortcut) {
            return [shortcut.name, shortcut.bindKey];
        }).object().value();
    };

    return shortcutMgr;
});

/**
 * 已知BUG:
 * 从light切换到normal, 快捷键没用了
 *
 */

/*globals Markdown, requirejs */
define('core', [
    "underscore",
    "crel",
    // "ace",
    "constants",
    "utils",
    // "settings",
    "eventMgr",
    "shortcutMgr",
    'pagedown-ace',
    'pagedown-light',
    //   "markdownit-deps",
    // 'libs/ace_mode',
    // 'ace/requirejs/text!ace/css/editor.css',
    // 'ace/requirejs/text!ace/theme/textmate.css',
    // 'ace/ext/spellcheck',
    // 'ace/ext/searchbox'
], function (_, crel,
    // ace, 
    constants, utils, eventMgr, shortcutMgr) {

    var core = {};

    window['MD'] = { 'eventMgr': eventMgr };

    var insertLinkO = $('<div class="modal fade modal-insert-link"><div class="modal-dialog"><div class="modal-content">'
        + '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
        + '<h4 class="modal-title">' + getMsg('Hyperlink') + '</h4></div>'
        + '<div class="modal-body"><p>' + getMsg('Please provide the link URL and an optional title') + ':</p>'
        + '<div class="input-group"><span class="input-group-addon"><i class="fa fa-link"></i></span><input id="input-insert-link" type="text" class="col-sm-5 form-control" placeholder="http://example.com  ' + getMsg('optional title') + '"></div></div><div class="modal-footer"><a href="#" class="btn btn-default" data-dismiss="modal">' + getMsg('Cancel') + '</a> <a href="#" class="btn btn-primary action-insert-link" data-dismiss="modal">' + getMsg('OK') + '</a></div></div></div></div>');

    var actionInsertLinkO = insertLinkO.find('.action-insert-link');

    // Create ACE editor
    var aceEditor;
    function createAceEditor() {
        aceEditor = ace.edit("wmd-input");
        MD.aceEditor = aceEditor;
        aceEditor.setTheme("ace/theme/chrome");
        // aceEditor.setOption("spellcheck", true);

        // vim
        // aceEditor.setKeyboardHandler("ace/keyboard/vim");

        aceEditor.renderer.setShowGutter(false);
        aceEditor.renderer.setPrintMarginColumn(false);
        aceEditor.renderer.setPadding(constants.EDITOR_DEFAULT_PADDING);
        aceEditor.session.setUseWrapMode(true);
        aceEditor.session.setNewLineMode("unix");
        // aceEditor.session.setMode("libs/ace_mode");
        //   aceEditor.session.setMode("ace/mode/ace_mode");
        aceEditor.session.setMode("ace/mode/markdown");

        aceEditor.session.$selectLongWords = true;
        aceEditor.getSession().on('change', function () {
            content = getEditorContent(true)[0];
            // msg = '字符数：' + content.length + ' 字数：' + calcWords(content);
            msg = '字数：' + calcWords(content);
            $('#calcWords').text(msg);
            // i = $('#wmd-button-bar').find('#calcWords');
            // if(i.length == 0) {
            // } else {
            //     $(i[0]).text(msg);
            // }
        });

        // Make bold titles...
        (function (self) {
            function checkLine(currentLine) {
                var line = self.lines[currentLine];
                if (line.length !== 0) {
                    if (line[0].type.indexOf("markup.heading.multi") === 0) {
                        _.each(self.lines[currentLine - 1], function (previousLineObject) {
                            previousLineObject.type = "markup.heading.prev.multi";
                        });
                    }
                }
            }
            function customWorker() {
                // Duplicate from background_tokenizer.js
                if (!self.running) {
                    return;
                }

                var workerStart = new Date();
                var currentLine = self.currentLine;
                var endLine = -1;
                var doc = self.doc;

                while (self.lines[currentLine]) {
                    currentLine++;
                }

                var startLine = currentLine;

                var len = doc.getLength();
                var processedLines = 0;
                self.running = false;
                while (currentLine < len) {
                    self.$tokenizeRow(currentLine);
                    endLine = currentLine;
                    do {
                        checkLine(currentLine); // benweet
                        currentLine++;
                    } while (self.lines[currentLine]);

                    // only check every 5 lines
                    processedLines++;
                    if ((processedLines % 5 === 0) && (new Date() - workerStart) > 20) {
                        self.running = setTimeout(customWorker, 20); // benweet
                        self.currentLine = currentLine;
                        return;
                    }
                }
                self.currentLine = currentLine;

                if (startLine <= endLine) {
                    self.fireUpdateEvent(startLine, endLine);
                }
            }
            self.$worker = function () {
                self.lines.splice(0, self.lines.length);
                self.states.splice(0, self.states.length);
                self.currentLine = 0;
                customWorker();
            };

        })(aceEditor.session.bgTokenizer);

        shortcutMgr.configureAce(aceEditor);
        eventMgr.onAceCreated(aceEditor);
    }

    // Create the layout
    var $editorButtonsElt;

    var $navbarElt;
    var $leftBtnElts;
    var $rightBtnElts;
    var $leftBtnDropdown;
    var $rightBtnDropdown;

    // Create the PageDown editor
    var editor;
    var $editorElt;
    var fileDesc;
    var documentContent;
    // var UndoManager = require("ace/undomanager").UndoManager;
    var previewWrapper;

    var converter;

    var lightEditor;

    var $mdKeyboardMode;

    core._resetToolBar = function () {
        /*
        <ul class="nav left-buttons">
                <li class="wmd-button-group1 btn-group"></li>
            </ul>
            <ul class="nav left-buttons">
                <li class="wmd-button-group2 btn-group"></li>
            </ul>
            <ul class="nav left-buttons">
                <li class="wmd-button-group3 btn-group"></li>
            </ul>
            <ul class="nav left-buttons">
                <li class="wmd-button-group4 btn-group"></li>
            </ul>
             <ul class="nav left-buttons">
                <li class="wmd-button-group6 btn-group">
                  <li class="wmd-button btn btn-success" id="wmd-help-button" title="Markdown syntax" style="left: 0px; display: none;"><span style="display: none; background-position: 0px 0px;"></span><i class="fa fa-question-circle"></i></li>
                </li>
            </ul>
         */
        $('#wmd-button-row').remove();
        $('#wmd-button-bar .wmd-button-bar-inner').html('<ul class="nav left-buttons"><li class="wmd-button-group1 btn-group"></li></ul><ul class="nav left-buttons"><li class="wmd-button-group2 btn-group"></li></ul><ul class="nav left-buttons"><li class="wmd-button-group3 btn-group"></li></ul><ul class="nav left-buttons"><li class="wmd-button-group4 btn-group"></li></ul><ul class="nav left-buttons"><li class="wmd-button-group6 btn-group"></li><li class="wmd-button btn btn-success" id="wmd-help-button" title="' + getMsg('Markdown syntax') + '" style="left:0;display:none"><span style="display:none;background-position:0 0"></span><i class="fa fa-question-circle"></i></li></ul>');
    };

    core._setEditorHook = function () {
        // Custom insert link dialog
        editor.hooks.set("insertLinkDialog", function (callback) {
            core.insertLinkCallback = callback;
            utils.resetModalInputs();
            insertLinkO.modal();
            return true;
        });
        // Custom insert image dialog
        editor.hooks.set("insertImageDialog", function (callback) {
            core.insertLinkCallback = callback;
            if (core.catchModal) {
                return true;
            }
            utils.resetModalInputs();
            var ifr = $("#leauiIfrForMD");
            if (!ifr.attr('src')) {
                ifr.attr('src', '/album/index?md=1');
            }
            $(".modal-insert-image").modal();
            return true;
        });

        editor.hooks.chain("onPreviewRefresh", eventMgr.onAsyncPreview);
    };

    // 行
    core._moveCursorTo = function (row, column) {
        if (!window.lightMode) {
            aceEditor.moveCursorTo(row, column);
            return;
        }

        // 得到offset
        var offset = core._getTextareaCursorOffset(row, column);

        $('#wmd-input').get(0).setSelectionRange(offset, offset);
        $('#wmd-input').focus();
    };

    // 得到文本编辑器的位置
    // 返回 {row: 0, column: 0}
    core._getTextareaCusorPosition = function () {
        var offset = $('#wmd-input').get(0).selectionStart;
        if (offset == 0) {
            return { row: 0, column: 0 };
        }
        var content = MD.getContent() || '';
        var contentArr = content.split('\n');
        var to = 0;
        var row = 0;
        var column = 0;
        for (var row = 0; row < contentArr.length; ++row) {
            var line = contentArr[row];

            if (offset <= line.length) {
                column = offset;
                break;
            }
            else {
                offset -= line.length;
            }

            // 下一行\n
            offset--;
        }
        return { row: row, column: column };
    };

    // 通过row, column 得到offset
    core._getTextareaCursorOffset = function (row, column) {
        var offset = 0;
        // 得到offset
        var content = MD.getContent();
        var contentArr = content.split('\n');
        var offset = 0;
        for (var i = 0; i < contentArr.length && i < row; ++i) {
            offset += contentArr[i].length + 1;  // \n 算1个
        }
        offset += column;
        return offset + 1;
    }

    // 切换到轻量编辑器
    core.initLightEditor = function () {
        if (window.lightMode) {
            return;
        }

        var scrollTop;
        var pos;
        if (aceEditor) {
            scrollTop = aceEditor.renderer.getScrollTop();
            pos = aceEditor.getCursorPosition();
        }
        else {
            scrollTop = 0;
            pos = 0;
        }
        var content = MD.getContent();

        core._resetToolBar();
        aceEditor && aceEditor.destroy();

        // In light mode, we replace ACE with a textarea
        $('#wmd-input').replaceWith(function () {
            return $('<textarea id="wmd-input" class="ace_editor ace-tm wmd-textarea">').addClass(this.className).addClass('form-control');
        });

        core._pre();

        // unbind all event
        // $editorElt.off();

        editor = new Markdown.EditorLight(converter);

        core._setEditorHook();

        editor.run(previewWrapper);

        core._setToolBars();

        $editorElt.val(content);

        window.lightMode = true;
        aceEditor = null;
        MD.clearUndo();
        eventMgr.onToggleMode(editor);
        core._moveCursorTo(pos.row, pos.column);
        $editorElt.focus();
        $('#wmd-input').scrollTop(scrollTop);
        $('#calcWords').text("");

        // 设置API
        // MD.insertLink = editor.insertLink;
    };

    // 切换到Ace编辑器
    core.initAceEditor = function () {
        if (!window.lightMode) {
            return;
        }

        var scrollTop = $('#wmd-input').scrollTop(); // : 
        var pos = core._getTextareaCusorPosition();
        // console.log(pos);
        var content = MD.getContent();

        core._resetToolBar();
        aceEditor && aceEditor.destroy();

        $('#wmd-input').replaceWith(function () {
            return '<pre id="wmd-input" class="form-control"><div id="wmd-input-sub" class="editor-content mousetrap" contenteditable=true></div><div class="editor-margin"></div></pre>';
        });

        core._pre();

        // ACE editor
        createAceEditor();
        // Editor's element
        $editorElt.find('.ace_content').css({
            "background-size": "64px " + Math.round(constants.fontSize * (20 / 12)) + "px",
        });

        // unbind all event
        // $editorElt.off();

        editor = new Markdown.Editor(converter, undefined, {
            keyStrokes: shortcutMgr.getPagedownKeyStrokes()
        });

        core._setEditorHook();
        editor.run(aceEditor, previewWrapper);

        core._setToolBars();

        aceEditor.setValue(content, -1);
        window.lightMode = false;
        MD.clearUndo();

        eventMgr.onToggleMode(editor);
        core._moveCursorTo(pos.row, pos.column);
        aceEditor.focus();
        aceEditor.session.setScrollTop(scrollTop);

        content = getEditorContent(true)[0];
        $('#calcWords').text('字数：' + calcWords(content))

        // 设置API
        // MD.insertLink = editor.insertLink;
    };
    core._initMarkdownConvert = function () {
        // Create the converter and the editor
        //   converter = new Markdown.Converter();
        //   var options = {
        //       _DoItalicsAndBold: function(text) {
        //           // Restore original markdown implementation
        //           text = text.replace(/(\*\*|__)(?=\S)(.+?[*_]*)(?=\S)\1/g,
        //           "<strong>$2</strong>");
        //           text = text.replace(/(\*|_)(?=\S)(.+?)(?=\S)\1/g,
        //           "<em>$2</em>");
        //           return text;
        //       }
        //   };
        //   converter.setOptions(options);
        MDConverter = function () {
            function SaveHash() { }
            SaveHash.prototype = {
                set: function (key, value) {
                    this["s_" + key] = value;
                },
                get: function (key) {
                    return this["s_" + key];
                }
            };
            var pluginHooks = this.hooks = new Markdown.HookCollection();

            pluginHooks.addNoop("preConversion");
            pluginHooks.addNoop("postConversion");

            var g_urls;
            var g_titles;
            var g_html_blocks;

            // Used to track when we're inside an ordered or unordered list
            // (see _ProcessListItems() for details):
            var g_list_level;
            this.pluginHooks = pluginHooks;
            this.makeHtml = function (text) {
                if (g_urls)
                    throw new Error("Recursive call to converter.makeHtml");
                g_urls = new SaveHash();
                g_titles = new SaveHash();
                g_html_blocks = [];
                g_list_level = 0;
                var markdownit = window.markdownit({
                    html: true,
                })
                    .use(window.markdownitEmoji)
                    .use(window.markdownitKatex)
                    // .use(window.markdownitHeading)
                    // .use(window.markdownitMermaid)
                    .use(window.markdownitPrismjs, { plugins: ['toolbar', 'line-numbers'] })
                    .use(window.markdownitTaskLists)
                    .use(window.markdownitContainer, 'success')
                    .use(window.markdownitContainer, 'info')
                    .use(window.markdownitContainer, 'warning')
                    .use(window.markdownitContainer, 'danger');
                text = pluginHooks.preConversion(text);
                text = markdownit.render(text);
                text = pluginHooks.postConversion(text);
                g_html_blocks = g_titles = g_urls = null;
                return text;
            }
        };
        converter = new MDConverter();
        return converter;
    }

    // 初始化
    core.initEditor = function (fileDescParam) {
        if (fileDesc !== undefined) {
            eventMgr.onFileClosed(fileDesc);
        }
        if (!fileDescParam) {
            fileDescParam = { content: "" };
        }
        fileDesc = fileDescParam;
        documentContent = undefined;
        var initDocumentContent = fileDesc.content;

        if (!window.lightMode) {
            aceEditor.setValue(initDocumentContent, -1);
            // 重新设置undo manage
            // aceEditor.getSession().setUndoManager(new ace.UndoManager());
        }
        else {
            $editorElt.val(initDocumentContent);
        }

        // If the editor is already created
        if (editor !== undefined) {
            if (!window.lightMode) {
                aceEditor && fileDesc.editorSelectRange && aceEditor.selection.setSelectionRange(fileDesc.editorSelectRange);
            }
            // aceEditor ? aceEditor.focus() : $editorElt.focus();
            editor.refreshPreview();

            MD.$editorElt = $editorElt;

            // 滚动到最顶部, 不然ace editor有问题
            if (window.lightMode) {
                $editorElt.scrollTop(0);
            }
            else {
                _.defer(function () {
                    aceEditor.renderer.scrollToY(0);
                });
            }
            return;
        }

        var $previewContainerElt = $(".preview-container");

        if (window.lightMode) {
            editor = new Markdown.EditorLight(converter);
        }
        else {
            editor = new Markdown.Editor(converter, undefined, {
                keyStrokes: shortcutMgr.getPagedownKeyStrokes()
            });
        }

        // editor['eventMgr'] = eventMgr;

        core._setEditorHook();

        function checkDocumentChanges() {
            var newDocumentContent = $editorElt.val();
            if (!window.lightMode && aceEditor) {
                newDocumentContent = aceEditor.getValue();
            }
            if (documentContent !== undefined && documentContent != newDocumentContent) {
                fileDesc.content = newDocumentContent;
                eventMgr.onContentChanged(fileDesc);
            }
            documentContent = newDocumentContent;
        }
        previewWrapper = function (makePreview) {
            var debouncedMakePreview = _.debounce(makePreview, 500);
            return function () {
                if (documentContent === undefined) {
                    makePreview();

                    eventMgr.onFileOpen(fileDesc);
                    $previewContainerElt.scrollTop(fileDesc.previewScrollTop);
                    if (window.lightMode) {
                        $editorElt.scrollTop(fileDesc.editorScrollTop);
                    }
                    else {
                        _.defer(function () {
                            aceEditor.renderer.scrollToY(fileDesc.editorScrollTop);
                        });
                    }
                }
                else {
                    debouncedMakePreview();
                }
                checkDocumentChanges();
            };
        };

        eventMgr.onPagedownConfigure(editor);

        if (window.lightMode) {
            editor.run(previewWrapper);
            editor.undoManager.reinit(initDocumentContent, fileDesc.editorStart, fileDesc.editorEnd, fileDesc.editorScrollTop);
        }
        else {
            editor.run(aceEditor, previewWrapper);
            fileDesc.editorSelectRange && aceEditor.selection.setSelectionRange(fileDesc.editorSelectRange);
        }
    };

    // 工具栏按钮
    core._setToolBars = function () {
        // Hide default buttons
        $(".wmd-button-row li").addClass("btn btn-success").css("left", 0).find("span").hide();

        // Add customized buttons
        var $btnGroupElt = $('.wmd-button-group1');

        $("#wmd-bold-button").append($('<i class="fa fa-bold">')).appendTo($btnGroupElt);
        $("#wmd-italic-button").append($('<i class="fa fa-italic">')).appendTo($btnGroupElt);
        $btnGroupElt = $('.wmd-button-group2');
        $("#wmd-link-button").append($('<i class="fa fa-link">')).appendTo($btnGroupElt);
        $("#wmd-quote-button").append($('<i class="fa fa-quote-left">')).appendTo($btnGroupElt);
        $("#wmd-code-button").append($('<i class="fa fa-code">')).appendTo($btnGroupElt);
        $("#wmd-image-button").append($('<i class="fa fa-picture-o">')).appendTo($btnGroupElt);
        $btnGroupElt = $('.wmd-button-group3');
        $("#wmd-olist-button").append($('<i class="fa fa-list-ol">')).appendTo($btnGroupElt);
        $("#wmd-ulist-button").append($('<i class="fa fa-list-ul">')).appendTo($btnGroupElt);
        $("#wmd-heading-button").append($('<i class="fa fa-header">')).appendTo($btnGroupElt);
        $("#wmd-hr-button").append($('<i class="fa fa-ellipsis-h">')).appendTo($btnGroupElt);
        // $btnGroupElt = $('.wmd-button-group4');
        $("#wmd-undo-button").append($('<i class="fa fa-undo">')).appendTo($btnGroupElt);
        $("#wmd-redo-button").append($('<i class="fa fa-repeat">')).appendTo($btnGroupElt);
        core._initModeToolbar();
    };

    core.setMDApi = function () {
        //==============
        // MD API start

        // 设置API
        // MD.insertLink = editor.insertLink;

        MD.focus = function () {
            !window.lightMode ? aceEditor.focus() : $('#wmd-input').focus();
        };
        MD.setContent = function (content) {
            var desc = {
                content: content
            }
            // Notify extensions
            // eventMgr.onFileSelected(desc);

            // Refresh the editor (even if it's the same file)
            core.initEditor(desc);
        };
        // 初始化, 避免卡死
        MD.setContent("");
        MD.getContent = function () {
            if (!window.lightMode) {
                return aceEditor.getValue();
            }
            return $('#wmd-input').val();
            // return $editorElt.val(); // 有延迟?
        };


        /*
        if (!window.lightMode) {
            MD.aceEditor = aceEditor;
        }
        */

        // 重新refresh preview
        MD.onResize = function () {
            eventMgr.onLayoutResize();
        };

        // aceEditor resize
        MD.resize = function () {
            if (!window.lightMode) {
                aceEditor.resize();
            }
        };

        MD.clearUndo = function () {
            if (window.lightMode) {
                editor.undoManager.reinit();
            }
            else {
                aceEditor.getSession().setUndoManager(new ace.UndoManager());
            }
            // 重新设置undo, redo button是否可用状态
            editor.uiManager.setUndoRedoButtonStates();
        };

        MD.toggleToAce = function () {
            core.initAceEditor();
        };

        // 切换成light模式
        MD.toggleToLight = function () {
            core.initLightEditor();
        };

        // 以下一行是为了i18n能分析到
        // getMsg('Light') getMsg('Normal')
        MD.setModeName = function (mode) {
            if (mode === 'textarea') {
                mode = 'Normal';
            }
            var msg = getMsg(mode);
            $mdKeyboardMode.html(msg);
        };

        MD.changeAceKeyboardMode = function (mode, modeName) {
            // 保存之
            localS.set(localSModeKey, mode);

            // 之前是lightMode
            if (window.lightMode) {
                // 要切换成ace
                if (mode != 'light') {
                    core.initAceEditor();
                    if (!MD.defaultKeyboardMode) {
                        MD.defaultKeyboardMode = aceEditor.getKeyboardHandler();
                    }
                }
                // 还是ligth, 则返回
                else {
                    return;
                }
            }
            // 当前是ace
            else {
                // 如果mode是light, 则切换之, 否则
                if (mode == 'light') {
                    core.initLightEditor();
                    return;
                }
            }

            // ace切换成其它模式

            if (mode != 'vim' && mode != 'emacs') {
                aceEditor.setKeyboardHandler(MD.defaultKeyboardMode);
                // shortcutMgr.configureAce(aceEditor);
            }
            else {
                aceEditor.setKeyboardHandler("ace/keyboard/" + mode);
            }

            // if (mode != 'light') {
            //     aceEditor.focus();
            // }
        };

        // MD API end
        //==============
    };

    core._initModeToolbar = function () {
        // 可以切换
        if (!window.lightModeForce) {
            $('.wmd-button-group4').html(['<div class="btn-group">',
                '<button type="button" class="wmd-button btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="' + getMsg('Edit mode') + '">',
                '<i class="fa fa-gear"></i> <i id="md-keyboard-mode"></i>',
                '</button>',
                '<ul class="dropdown-menu wmd-mode">',
                '<li><a href="#" data-mode="Normal"><i class="fa fa-check"></i> ' + getMsg('Normal mode') + '</a></li>',
                '<li><a href="#" data-mode="Vim"><i class="fa"></i> ' + getMsg('Vim mode') + '</a></li>',
                '<li><a href="#" data-mode="Emacs"><i class="fa"></i> ' + getMsg('Emacs mode') + '</a></li>',
                '<li role="separator" class="divider"></li>',
                '<li><a href="#" data-mode="Light"><i class="fa"></i> ' + getMsg('Light editor') + '</a></li>',
                '</ul>',
                '</div>'].join(''));

            $("#wmd-help-button").show();
            $mdKeyboardMode = $('#md-keyboard-mode');

            // 编辑模式选择
            $('.wmd-mode a').click(function () {
                var $this = $(this);
                var mode = $this.data('mode');
                MD.changeAceKeyboardMode(mode.toLowerCase(), mode);
                MD.setModeName(mode);

                // 切换后可能会重绘html, 所以这里重新获取
                $('.wmd-mode').find('i').removeClass('fa-check');
                $('.wmd-mode a[data-mode="' + mode + '"]').find('i').addClass('fa-check');
            });

            if (!window.LEA
                || (window.LEA
                    && window.LEA.canSetMDModeFromStorage
                    && window.LEA.canSetMDModeFromStorage())) {
                var aceMode = localS.get(localSModeKey);
                if (!aceMode) {
                    return;
                }
                var aceModeUpper = aceMode[0].toUpperCase() + aceMode.substr(1);
                $('.wmd-mode i').removeClass('fa-check');
                $('.wmd-mode a[data-mode="' + aceModeUpper + '"] i').addClass('fa-check');

                MD.setModeName(aceModeUpper);
            }
        }
    };

    core._pre = function () {
        $editorElt = $("#wmd-input, .textarea-helper").css({
            // Apply editor font
            "font-family": constants.fontFamily,
            "font-size": constants.fontSize + "px",
            "line-height": Math.round(constants.fontSize * (20 / 12)) + "px"
        });
    };

    // Initialize multiple things and then fire eventMgr.onReady
    var isDocumentPanelShown = false;
    var isMenuPanelShown = false;
    core.onReady = function () {
        $navbarElt = $('.navbar');
        $leftBtnElts = $navbarElt.find('.left-buttons');
        $rightBtnElts = $navbarElt.find('.right-buttons');
        $leftBtnDropdown = $navbarElt.find('.left-buttons-dropdown');
        $rightBtnDropdown = $navbarElt.find('.right-buttons-dropdown');

        // Editor
        if (window.lightMode) {
            // In light mode, we replace ACE with a textarea
            $('#wmd-input').replaceWith(function () {
                return $('<textarea id="wmd-input" class="ace_editor ace-tm wmd-textarea">').addClass(this.className).addClass('form-control');
            });
        }

        core._pre();

        if (!window.lightMode) {
            // ACE editor
            createAceEditor();

            // Editor's element
            $editorElt.find('.ace_content').css({
                "background-size": "64px " + Math.round(constants.fontSize * (20 / 12)) + "px",
            });
        }

        eventMgr.onReady();
        core._initMarkdownConvert();
        core.initEditor();
        core.setMDApi();
        core._setToolBars();

        // 默认Ace编辑模式
        if (!window.lightMode) {
            MD.defaultKeyboardMode = aceEditor.getKeyboardHandler();
        }
        // 初始时
        // 是否可以从storage中设置md mode
        if (!window.LEA
            || (window.LEA
                && window.LEA.canSetMDModeFromStorage
                && window.LEA.canSetMDModeFromStorage())) {
            var aceMode = localS.get(localSModeKey);
            if (!window.lightMode && aceMode) {
                var aceModeUpper = aceMode[0].toUpperCase() + aceMode.substr(1);
                MD.changeAceKeyboardMode(aceMode, aceModeUpper);
            }
        }
    };

    // Other initialization that are not prioritary
    eventMgr.addListener("onReady", function () {

        $(document.body).on('shown.bs.modal', '.modal', function () {
            var $elt = $(this);
            setTimeout(function () {
                // When modal opens focus on the first button
                $elt.find('.btn:first').focus();
                // Or on the first link if any
                $elt.find('button:first').focus();
                // Or on the first input if any
                $elt.find("input:enabled:visible:first").focus();
            }, 50);
        }).on('hidden.bs.modal', '.modal', function () {
            // Focus on the editor when modal is gone
            // editor.focus();
            // Revert to current theme when settings modal is closed
            // applyTheme(window.theme);
        }).on('keypress', '.modal', function (e) {
            // Handle enter key in modals
            if (e.which == 13 && !$(e.target).is("textarea")) {
                $(this).find(".modal-footer a:last").click();
            }
        });

        // Click events on "insert link" and "insert image" dialog buttons
        actionInsertLinkO.click(function (e) {
            var value = utils.getInputTextValue($("#input-insert-link"), e);
            if (value !== undefined) {
                var arr = value.split(' ');
                var text = '';
                var link = arr[0];
                if (arr.length > 1) {
                    arr.shift();
                    text = $.trim(arr.join(' '));
                }
                if (link && link.indexOf('://') < 0) {
                    link = "http://" + link;
                }
                core.insertLinkCallback(link, text);
                core.insertLinkCallback = undefined;
            }
        });
        // 插入图片
        $(".action-insert-image").click(function () {
            // 得到图片链接或图片
            /*
            https://github.com/leanote/leanote/issues/171
            同遇到了网页编辑markdown时不能添加图片的问题。
            可以上传图片，但是按下“插入图片”按钮之后，编辑器中没有加入![...](...)
            我的控制台有这样的错误： TypeError: document.mdImageManager is undefined
            */
            // mdImageManager是iframe的name, mdGetImgSrc是iframe内的全局方法
            // var value = document.mdImageManager.mdGetImgSrc();
            var value = document.getElementById('leauiIfrForMD').contentWindow.mdGetImgSrc();
            if (value) {
                core.insertLinkCallback(value);
                core.insertLinkCallback = undefined;
            }
        });

        // Hide events on "insert link" and "insert image" dialogs
        insertLinkO.on('hidden.bs.modal', function () {
            if (core.insertLinkCallback !== undefined) {
                core.insertLinkCallback(null);
                core.insertLinkCallback = undefined;
            }
        });

        // Avoid dropdown panels to close on click
        $("div.dropdown-menu").click(function (e) {
            e.stopPropagation();
        });

        // 弹框显示markdown语法
        $('#wmd-button-bar').on('click', '#wmd-help-button', function () {
            window.open("http://leanote.leanote.com/post/Leanote-Markdown-Manual");
        });
    });

    return core;
});

// RequireJS configuration
/*global requirejs */
requirejs.config({
    waitSeconds: 0,
    packages: [
    ],
    paths: {
        underscore: '/public/libs/underscore-1.10.2.min',
        crel: '/public/libs/crel-1.1.2.min',
        //   mathjax: 'libs/MathJax/MathJax.js?a=1&config=TeX-AMS_HTML',
        // requirejs: 'bower-libs/requirejs/require',
        //   'google-code-prettify': 'bower-libs/google-code-prettify/src/prettify',
        'jquery-waitforimages': '/public/libs/jquery/jquery.waitforimages-1.4.2.min',
        'ace': '/public/libs/ace',
        'pagedown-ace': '/public/libs/pagedown-ace/Markdown.Editor',
        'pagedown-light': '/public/libs/pagedown-ace/Markdown.Editor.Light',
        'pagedown-extra': '/public/libs/pagedown-ace/Markdown.Extra',
        'ace/requirejs/text': 'libs/ace_text',
        'ace/commands/default_commands': 'libs/ace_commands',
        xregexp: '/public/libs/xregexp-all-3.0.0.min',

        //   markdownit: '//cdn.jsdelivr.net/npm/markdown-it@12.3.0/dist/markdown-it.min',
        //   'markdownit-emoji': '//cdn.jsdelivr.net/npm/markdown-it-emoji@2.0.0/dist/markdown-it-emoji.min',
        //   mermaid: '//cdn.jsdelivr.net/npm/mermaid@8.13.8/dist/mermaid.min',
        //   'markdownit-mermaid': '/public/md/mermaid',
        // //   mathjax: '//cdn.jsdelivr.net/npm/mathjax-full@3.2.0/es5/mathjax',
        // //   mathjax_tex: '//cdn.jsdelivr.net/npm/mathjax-full@3.2.0/js/input/tex',
        // //   mathjax_svg: '//cdn.jsdelivr.net/npm/mathjax-full@3.2.0/js/output/svg',
        // //   mathjax_liteAdaptor: '//cdn.jsdelivr.net/npm/mathjax-full@3.2.0/js/adaptors/liteAdaptor',
        // //   mathjax_html: 'https://cdn.jsdelivr.net/npm/mathjax-full@3.2.0/js/handlers/html',
        // //   mathjax_AllPackages: '//cdn.jsdelivr.net/npm/mathjax-full@3.2.0/js/input/tex/AllPackages',
        // //   juice_client: '//cdn.jsdelivr.net/npm/juice@8.0.0/client',
        //   katex: '//cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min',
        //   'markdownit-katex': '/public/md/katex',
        //   'markdownit-container': '//cdn.jsdelivr.net/npm/markdown-it-container@3.0.0/dist/markdown-it-container.min',
        //   'markdownit-todo': '//cdn.jsdelivr.net/npm/markdown-it-task-lists@2.1.1/dist/markdown-it-task-lists.min',
        //   'prismjs/plugins': '/public/libs/prismjs/plugins', //'//cdn.jsdelivr.net/npm/prismjs@1/prism.min',
        //   'prismjs/plugins/toolbar': '//cdn.jsdelivr.net/npm/prismjs@1/plugins/toolbar/prism-toolbar.min',
        //   'prismjs/plugins/line-numbers': '//cdn.jsdelivr.net/npm/prismjs@1/plugins/line-numbers/prism-line-numbers.min',
        //   'prismjs/plugins/autoloader': '//cdn.jsdelivr.net/npm/prismjs@1/plugins/autoloader/prism-autoloader.min',
        // //   'prismjs/components/prism-c': '//cdn.jsdelivr.net/npm/prismjs@1.26.0/components/prism-c.min',
        //   'markdownit-prismjs': '/public/md/prismjs',

        // 以下, 异步加载, 不常用
        Diagram: 'libs/uml/sequence-diagram.min',
        'diagram-grammar': 'libs/uml/diagram-grammar.min',
        raphael: 'libs/uml/raphael.min',
        'flow-chart': 'libs/uml/flowchart.amd-1.3.4.min',
        //   'chart': 'js/chart.min'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        //   prismjs: {
        //     exports: "Prism"
        //   },
        //   'markdownit-prismjs': ['prismjs/plugins/toolbar', 'prismjs/plugins/line-numbers', 'prismjs/plugins/autoloader'],
        //   'markdownit-prismjs': function () {
        //     let langs = ['c', 'clike', 'css', 'cmake', 'cpp', 'csv', 'ejs', 'csharp', 'go', 'java', 'json', 'json5', 'julia', 'latex', 'less', 'log', 'lua', 'markdown', 'matlab', 'mermaid', 'nginx', 'php', 'perl', 'qml', 'r', 'racket', 'regex', 'ruby', 'rust', 'scss', 'sql', 'stylus', 'verilog', 'vhdl', 'vim', 'yaml', 'bash', 'clojure']
        //     return langs.map(function (e) {
        //         return "prismjs/components/prism-" + e;
        //     });
        //   },
        //   'prismjs/components/prism-c': ['prismjs'],
        //   'markdownit-katex': ['katex'],
        //   'markdownit-mermaid': {deps: ['mermaid'], exports: 'markdownitMermaid'},
        //   mathjax: [
        //       'libs/mathjax_init'
        //   ],
        'pagedown-extra': [
            'pagedown-ace'
        ],
        'pagedown-ace': [
            'ace/range',
            // 'ace/lib/useragent'
            //   'bower-libs/pagedown-ace/Markdown.Converter'
        ],
        'pagedown-light': [
            //   'bower-libs/pagedown-ace/Markdown.Converter'
        ],
        'flow-chart': [
            'raphael'
        ],
        'diagram-grammar': [
            'underscore'
        ],
        Diagram: [
            'raphael',
            'diagram-grammar'
        ]
    }
});

// 本地缓存
var localS = {
    get: function (key) {
        if (localStorage) {
            return localStorage.getItem(key);
        }
        return;
    },
    set: function (key, value) {
        value += '';
        if (localStorage) {
            localStorage.setItem(key, value);
        }
    }
};
var localSModeKey = 'LeaMdAceMode';

// Viewer mode is deduced from the body class
window.viewerMode = false;

// Light mode is for mobile or viewer
window.lightModeForce = window.viewerMode || /_light_/.test(localStorage.mode) || /(\?|&)light($|&)/.test(location.search) || (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
        return true;
    }
})(navigator.userAgent || navigator.vendor || window.opera);
// 是否是强制lightMode
if (window.lightModeForce) {
    window.lightMode = true;
}
else {
    var mode = localS.get(localSModeKey);
    if (mode === 'light') {
        window.lightMode = true;
    }
}

// window.lightMode = true;

// Keep the theme in a global variable
window.theme = localStorage.themeV3 || 'default';
var themeModule = "less!themes/default";

//   define('markdownit-deps', ['markdownit', 'markdownit-emoji', 'markdownit-mermaid', 'markdownit-katex', 'markdownit-container', 'markdownit-todo', 'markdownit-prismjs'], function() {});
//   var markdownEmoji, markdownItMermaid, markdownItKatex, markdownitContainer, markdownTodo, markdownPrismjs;
//   require(['markdownit-emoji'], (e) => {
//     markdownEmoji = e;
//   });
//   require(['markdownit-mermaid'], (e) => {
//     markdownItMermaid  = e;
//   });
//   require(['markdownit-katex'], (e) => {
//     markdownItKatex  = e;
//   });
//   require(['markdownit-container'], (e) => {
//     markdownitContainer  = e;
//   });
//   require(['markdownit-todo'], (e) => {
//     markdownTodo  = e;
//   });
//   require(['markdownit-prismjs'], (e) => {
//     markdownPrismjs  = e;
//   });

require(["core", "eventMgr",
    // , themeModule
],
    function (core, eventMgr) {
        // window.markdownIt = m({
        //     html: true,
        // })
        //   .use(markdownEmoji)
        //   .use(markdownItMermaid)
        //   .use(markdownItKatex)
        //   .use(markdownTodo)
        //   .use(markdownPrismjs)
        //   .use(markdownitContainer, "success")
        //   .use(markdownitContainer, "info")
        //   .use(markdownitContainer, "danger")
        //   .use(markdownitContainer, "warning");
        $(function () {
            core.onReady();
        });
    });

define("main", function () { });