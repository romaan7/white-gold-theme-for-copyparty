/* copyparty custom theme: replace emojis with Font Awesome icons
   Usage:
     copyparty \
       --html-head '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">' \
       --js-browser /path/to/white-gold.js \
       --css-browser /path/to/white-gold.css
*/
document.addEventListener("DOMContentLoaded", function () {

    // helper: build an <i> FA icon tag
    function fa(icon) {
        return '<i class="fa-solid ' + icon + '"></i>';
    }

    // helper: replace innerHTML by element ID
    function replaceById(id, html) {
        var el = document.getElementById(id);
        if (el) el.innerHTML = html;
    }

    // helper: replace emoji text node inside an element, preserving siblings
    function replaceEmoji(el, emoji, iconHtml) {
        if (!el) return;
        if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
            if (el.textContent.indexOf(emoji) !== -1) {
                el.innerHTML = el.innerHTML.replace(emoji, iconHtml);
            }
            return;
        }
        for (var i = 0; i < el.childNodes.length; i++) {
            var node = el.childNodes[i];
            if (node.nodeType === 3 && node.textContent.indexOf(emoji) !== -1) {
                var span = document.createElement('span');
                span.innerHTML = node.textContent.replace(emoji, iconHtml);
                el.replaceChild(span, node);
                break;
            }
        }
    }

    // helper: replace emoji inside a <label> by its "for" attribute
    function replaceLabelEmoji(forAttr, emoji, iconHtml) {
        var el = document.querySelector('label[for="' + forAttr + '"]');
        if (el) replaceEmoji(el, emoji, iconHtml);
    }

    // helper: batch replace by ID map { id: { emoji, icon } }
    function batchReplace(map) {
        Object.keys(map).forEach(function (id) {
            var el = document.getElementById(id);
            var def = map[id];
            if (el) replaceEmoji(el, def.emoji, fa(def.icon));
        });
    }

    /* =====================================================
       TOP TOOLBAR (#ops)
       ===================================================== */
    var opaX = document.getElementById("opa_x");
    if (opaX) opaX.style.display = "none";

    var toolbar = {
        "opa_srch": { icon: "fa-magnifying-glass",  label: "Search"   },
        "opa_del":  { icon: "fa-trash",             label: "Unpost"   },
        "opa_up":   { icon: "fa-upload",            label: "Upload"   },
        "opa_bup":  { icon: "fa-file-arrow-up",     label: "Basic Up" },
        "opa_mkd":  { icon: "fa-folder-plus",       label: "New Dir"  },
        "opa_md":   { icon: "fa-file-lines",        label: "New File" },
        "opa_msg":  { icon: "fa-comment",           label: "Message"  },
        "opa_auc":  { icon: "fa-music",             label: "Player"   },
        "opa_cfg":  { icon: "fa-gear",              label: "Settings" },
    };

    Object.keys(toolbar).forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        var def = toolbar[id];
        el.innerHTML =
            fa(def.icon) +
            '<span class="toolbar-label">' + def.label + '</span>';
    });

    /* =====================================================
       BREADCRUMB / PATH BAR
       ===================================================== */
    replaceById("entree", fa("fa-folder-tree"));

    var detree = document.getElementById("detree");
    if (detree) {
        detree.innerHTML = fa("fa-ellipsis");
    }

    /* =====================================================
       SIDEBAR / NAVPANE (#treeh)
       ===================================================== */
    batchReplace({
        "visdir":    { emoji: "🎯", icon: "fa-crosshairs"  },
        "filetree":  { emoji: "📃", icon: "fa-file-alt"    },
        "parpane":   { emoji: "📌", icon: "fa-thumbtack"   },
        "hovertree": { emoji: "👀", icon: "fa-eye"         },
    });

    /* =====================================================
       BOTTOM BAR / WIDGET
       ===================================================== */
    batchReplace({
        "fshr": { emoji: "📨", icon: "fa-share-from-square" },
        "fren": { emoji: "✎",  icon: "fa-pen"               },
        "fdel": { emoji: "⌫",  icon: "fa-trash-can"         },
        "fcut": { emoji: "✂",  icon: "fa-scissors"          },
        "fcpy": { emoji: "⧉",  icon: "fa-copy"              },
        "fpst": { emoji: "📋", icon: "fa-clipboard"         },
        "zip1": { emoji: "📦", icon: "fa-file-zipper"       },
    });

    // nowplaying / playlist clipboard
    batchReplace({
        "npirc": { emoji: "📋", icon: "fa-clipboard"  },
        "nptxt": { emoji: "📋", icon: "fa-clipboard"  },
        "m3ua":  { emoji: "📻", icon: "fa-list-ol"    },
        "m3uc":  { emoji: "📻", icon: "fa-list-check" },
    });

    /* =====================================================
       MEDIA PLAYER CONTROLS
       ===================================================== */
    batchReplace({
        "bprev": { emoji: "⏮", icon: "fa-backward-step" },
        "bplay": { emoji: "▶",  icon: "fa-play"          },
        "bnext": { emoji: "⏭", icon: "fa-forward-step"  },
    });

    // observe play/pause toggle (copyparty swaps ▶/⏸ dynamically)
    var bplay = document.getElementById("bplay");
    if (bplay) {
        new MutationObserver(function () {
            var txt = bplay.textContent.trim();
            if (txt === "▶" || txt === "⏸") {
                bplay.innerHTML = fa(txt === "▶" ? "fa-play" : "fa-pause");
            }
        }).observe(bplay, { childList: true, characterData: true, subtree: true });
    }

    /* =====================================================
       UPLOAD PANEL (up2k options row)
       ===================================================== */
    // label emojis next to checkboxes
    replaceLabelEmoji("multitask", "🏃", fa("fa-bolt"));
    replaceLabelEmoji("potato",    "🥔", fa("fa-microchip"));
    replaceLabelEmoji("u2rand",    "🎲", fa("fa-shuffle"));
    replaceLabelEmoji("fsearch",   "🔎", fa("fa-magnifying-glass"));

    // upload notification / sound toggles
    batchReplace({
        "upnag": { emoji: "🔔", icon: "fa-bell"        },
        "upsfx": { emoji: "🔊", icon: "fa-volume-high" },
    });

    // overwrite mode button — cycles through 🛡️🕒♻️⏭️ dynamically (up2k.js)
    var owLabel = document.querySelector('label[for="u2ow"]');
    if (owLabel) {
        var owMap = {
            "🛡️": "fa-shield-halved",
            "🕒": "fa-clock",
            "♻️": "fa-recycle",
            "⏭️": "fa-forward-fast",
        };
        function replaceOwEmoji() {
            var txt = owLabel.textContent.trim();
            Object.keys(owMap).forEach(function (emoji) {
                if (txt.indexOf(emoji) !== -1 || owLabel.innerHTML.indexOf(emoji) !== -1) {
                    owLabel.innerHTML = fa(owMap[emoji]);
                }
            });
        }
        replaceOwEmoji();
        new MutationObserver(replaceOwEmoji).observe(owLabel, {
            childList: true, characterData: true, subtree: true
        });
    }

    // drop zone text (🚀 upload / 🔎 search)
    var upZd = document.getElementById("up_zd");
    if (upZd) upZd.innerHTML = upZd.innerHTML.replace(/🚀/g, fa("fa-upload"));
    var srchZd = document.getElementById("srch_zd");
    if (srchZd) srchZd.innerHTML = srchZd.innerHTML.replace(/🔎/g, fa("fa-magnifying-glass"));

    /* =====================================================
       SETTINGS PANEL (op_cfg)
       ===================================================== */
    // settings "switches" row — these have emoji in the visible button text
    // the text is baked into the tt attribute as: tt="tooltip">VISIBLE_TEXT
    // so the visible text is the innerHTML after the closing quote
    var cfgEmojis = {
        "tooltips": { emoji: "ℹ️",  icon: "fa-circle-info"       },
        "thumbs":   { emoji: "🖼️", icon: "fa-image"             },
        "dir1st":   { emoji: "📁",  icon: "fa-folder"            },
        "ireadme":  { emoji: "📜",  icon: "fa-scroll"            },
    };

    Object.keys(cfgEmojis).forEach(function (id) {
        var el = document.getElementById(id);
        var def = cfgEmojis[id];
        if (el) {
            el.innerHTML = el.innerHTML.replace(def.emoji, fa(def.icon));
        }
    });

    // up2k switches inside settings
    var u2kSettings = {
        "ask_up":  { emoji: "💭", icon: "fa-comment-dots" },
        "u2ts":    { emoji: "📅", icon: "fa-calendar"     },
        "umod":    { emoji: "📅", icon: "fa-calendar"     },
        "flag_en": { emoji: "💤", icon: "fa-flag"         },
    };

    Object.keys(u2kSettings).forEach(function (id) {
        var el = document.getElementById(id);
        var def = u2kSettings[id];
        if (el) {
            el.innerHTML = el.innerHTML.replace(def.emoji, fa(def.icon));
        }
    });

    // favicon preview emoji
    var ico1 = document.getElementById("ico1");
    if (ico1) ico1.innerHTML = fa("fa-palette");

    /* =====================================================
       PLAYER PANEL (op_player) options
       ===================================================== */
    var playerOpts = {
        "aloop":   { emoji: "🔁", icon: "fa-repeat"         },
        "ashuf":   { emoji: "🔀", icon: "fa-shuffle"        },
        "afau":    { emoji: "☕️", icon: "fa-mug-hot"        },
        "am3uc":   { emoji: "📻", icon: "fa-list-check"     },
        "afollow": { emoji: "🎯", icon: "fa-crosshairs"     },
        "amloop":  { emoji: "🔁", icon: "fa-repeat"         },
        "amnext":  { emoji: "📂", icon: "fa-folder-open"    },
        "amstop":  { emoji: "⏸",  icon: "fa-pause"          },
    };

    // 1️⃣ (keycap one) — "stop after one song"
    var auOne = document.getElementById("au_one");
    if (auOne) {
        auOne.innerHTML = auOne.innerHTML.replace(/1️⃣/, fa("fa-1"));
    }

    Object.keys(playerOpts).forEach(function (id) {
        var el = document.getElementById(id);
        var def = playerOpts[id];
        if (el) {
            el.innerHTML = el.innerHTML.replace(def.emoji, fa(def.icon));
        }
    });

    /* =====================================================
       SUBMENU FORMS (HTML template emojis)
       These are baked into browser.html as text nodes
       inside form elements
       ===================================================== */
    var formPanels = {
        "op_mkdir":  { emoji: "📂", icon: "fa-folder-plus" },
        "op_new_md": { emoji: "📝", icon: "fa-file-lines"  },
        "op_msg":    { emoji: "📟", icon: "fa-envelope"     },
    };

    Object.keys(formPanels).forEach(function (id) {
        var panel = document.getElementById(id);
        if (!panel) return;
        var def = formPanels[id];
        var form = panel.querySelector("form");
        if (!form) return;
        for (var i = 0; i < form.childNodes.length; i++) {
            var node = form.childNodes[i];
            if (node.nodeType === 3 && node.textContent.indexOf(def.emoji) !== -1) {
                var span = document.createElement("span");
                span.innerHTML = node.textContent.replace(def.emoji, fa(def.icon));
                span.className = "form-icon";
                form.replaceChild(span, node);
                break;
            }
        }
    });

    /* =====================================================
       UPLOAD BUTTON — replace rocket emoji in #u2bm
       (the spinner/rocket shown on the upload drop zone)
       ===================================================== */
    var u2bm = document.getElementById("u2bm");
    if (u2bm && u2bm.textContent.indexOf("🚀") !== -1) {
        u2bm.innerHTML = fa("fa-cloud-arrow-up");
    }

    /* =====================================================
       GENERIC SWEEP — catch remaining emojis in .tgl.btn
       elements that we may have missed
       ===================================================== */
    var emojiMap = [
        ["🔔", "fa-bell"],
        ["🔊", "fa-volume-high"],
        ["🔇", "fa-volume-xmark"],
        ["📻", "fa-radio"],
        ["🎯", "fa-crosshairs"],
        ["📁", "fa-folder"],
        ["📂", "fa-folder-open"],
        ["📜", "fa-scroll"],
        ["📋", "fa-clipboard"],
        ["📦", "fa-file-zipper"],
        ["🔁", "fa-repeat"],
        ["🔀", "fa-shuffle"],
        ["📌", "fa-thumbtack"],
        ["📃", "fa-file-alt"],
        ["👀", "fa-eye"],
        ["🖼️", "fa-image"],
        ["ℹ️",  "fa-circle-info"],
        ["💭", "fa-comment-dots"],
        ["💤", "fa-flag"],
        ["📅", "fa-calendar"],
        ["🎉", "fa-palette"],
        ["🚀", "fa-upload"],
        ["🔎", "fa-magnifying-glass"],
        ["🧯", "fa-trash"],
        ["🎈", "fa-file-arrow-up"],
        ["📝", "fa-file-lines"],
        ["📟", "fa-comment"],
        ["🎺", "fa-music"],
        ["⚙️", "fa-gear"],
        ["🏃", "fa-bolt"],
        ["🥔", "fa-microchip"],
        ["🎲", "fa-shuffle"],
        ["☕️", "fa-mug-hot"],
        ["1️⃣", "fa-1"],
    ];

    // sweep all toggle buttons and labels that still have emojis
    var btns = document.querySelectorAll('.tgl.btn, #op_cfg label, #op_player label, #op_player a, #u2conf label');
    btns.forEach(function (el) {
        emojiMap.forEach(function (pair) {
            if (el.innerHTML.indexOf(pair[0]) !== -1) {
                el.innerHTML = el.innerHTML.replace(new RegExp(pair[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), fa(pair[1]));
            }
        });
    });
});
