/*! OEWR - def.ts
* Copyright Christoph Schaunig 2018
*/
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var $oewr;
(function ($oewr) {
    /** Specifies all roles. */
    var Roles;
    (function (Roles) {
        /** WWW role. */
        Roles[Roles["WWW"] = 1] = "WWW";
        /** Admin role. */
        Roles[Roles["Admin"] = 2] = "Admin";
        /** Partner role. */
        Roles[Roles["Partner"] = 3] = "Partner";
    })(Roles = $oewr.Roles || ($oewr.Roles = {}));
    var MTBLevel;
    (function (MTBLevel) {
        MTBLevel[MTBLevel["Everyone"] = 0] = "Everyone";
        MTBLevel[MTBLevel["Beginner"] = 1] = "Beginner";
        MTBLevel[MTBLevel["Advanced"] = 2] = "Advanced";
        MTBLevel[MTBLevel["All"] = 3] = "All";
    })(MTBLevel = $oewr.MTBLevel || ($oewr.MTBLevel = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $util;
    (function ($util) {
        /** Returns the formatted date string of the specified datetime. */
        function formatDate(date, format) {
            return date.format(format);
        }
        $util.formatDate = formatDate;
        /** Returns the formatted string for the specified from/to date. */
        function formatFromTo(from, to, format, multiDayFormat) {
            if (multiDayFormat && !dateEquals(from, to))
                format = multiDayFormat; // mulitple days
            var parts = format.split("-");
            return from.format(parts[0].trim()) + " - " + to.format(parts[1].trim());
        }
        $util.formatFromTo = formatFromTo;
        /** Returns whether the date part of the specified datetimes is equal. */
        function dateEquals(from, to) {
            return from.year() == to.year() && from.month() == to.month() && from.date() == to.date();
        }
        $util.dateEquals = dateEquals;
        /** Merges the specified dates. */
        function mergeDates(target, dt) {
            // no valid target date -> clone
            if (!target || !target.isValid())
                return dt ? dt.clone() : null;
            if (target.hour() == 0 && target.minute() == 0) {
                target.hour(dt.hour());
                target.minute(dt.minute());
            }
            return target;
        }
        $util.mergeDates = mergeDates;
        /** Merges the specified dates. */
        function mergeDatesStr(target, dt) {
            return mergeDates(moment(target || null), moment(dt || null));
        }
        $util.mergeDatesStr = mergeDatesStr;
        /** Gets the nth weekday of the specified month/date. */
        function nthWeekdayOfMonth(weekday, n, date) {
            var count = 0;
            var idate = new Date(date.getFullYear(), date.getMonth(), 1);
            while (true) {
                if (idate.getDay() === weekday) {
                    if (++count == n)
                        break;
                }
                idate.setDate(idate.getDate() + 1);
            }
            return idate;
        }
        $util.nthWeekdayOfMonth = nthWeekdayOfMonth;
        /** Ensures that the specified string starts with the prefix. */
        function ensureStartsWith(str, prefix) {
            if (str == null)
                str = "";
            if (str[0] == prefix)
                return str;
            return prefix + str;
        }
        $util.ensureStartsWith = ensureStartsWith;
        /** Gets the offset to the specified element.
         * anchor = top|middle
         */
        function getOffset(element, anchor) {
            if (anchor === void 0) { anchor = "top"; }
            element = (typeof element == "string" ? $(element) : element);
            if (element.length == 0)
                return null;
            var offset = element.offset().top;
            if (anchor == "middle")
                return offset - ($(window).height() - element.outerHeight()) / 2;
            return Math.max(offset, 0);
        }
        $util.getOffset = getOffset;
        /** Localizes the specified object propery (if possible). */
        function localize(obj, property) {
            if (!obj)
                return null;
            if (!property)
                property = "name";
            var val = obj[property + "_" + $oewr.$cfg.lang];
            if (val === undefined)
                val = obj[property];
            return val;
        }
        $util.localize = localize;
        /** Returns the page wrapper of the specified element. */
        function getPage(el) {
            // get parent wrapper
            var pw = el;
            while (pw && !pw.hasClass("page"))
                pw = pw.parent();
            return pw.hasClass("page") ? pw.data("page") : null;
        }
        $util.getPage = getPage;
        /** Returns specified hash url. */
        function parseUrl(hash) {
            hash = hash.replace("#/", "").replace("#", "");
            var url = { hash: "#/" + hash };
            var parts = hash.split("?");
            // set stack
            var loc = (parts[0] || "").split("/");
            url.page = loc[0];
            if (url.page != "cmd" && !$oewr.$pages.exists(url.page)) {
                url.dest = url.page;
                url.page = "main";
            }
            else
                url.dest = loc[loc.length - 1];
            // add args
            url.args = splitArgs(parts[1]);
            return url;
        }
        $util.parseUrl = parseUrl;
        /** Parses the specified hash args. */
        function splitArgs(argStr) {
            if (!argStr)
                return {};
            var args = {};
            $q(argStr.split("&")).ForEach(function (x) {
                var parts = x.split("=");
                args[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
            });
            return args;
        }
        $util.splitArgs = splitArgs;
        /** Simple markdown format for bold, strong and italic. */
        function formatMd(text) {
            var bold = 0, strong = 0, italic = 0;
            return text.replace(/\*\*/g, function (substr, args) {
                return (++bold) % 2 == 1 ? "<b>" : "</b>";
            }).replace(/\*/g, function (substr, args) {
                return (++strong) % 2 == 1 ? "<strong>" : "</strong>";
            }).replace(/_/g, function (substr, args) {
                return (++italic) % 2 == 1 ? "<i>" : "</i>";
            });
        }
        $util.formatMd = formatMd;
        /** Trims the specified character. */
        function trim(text, character) {
            if (character === "]")
                character = "\\]";
            if (character === "\\")
                character = "\\\\";
            return text.replace(new RegExp("^[" + character + "]+|[" + character + "]+$", "g"), "");
        }
        $util.trim = trim;
        /** Trims the specified character at the start of the text. */
        function trimStart(text, character) {
            if (character === "]")
                character = "\\]";
            if (character === "\\")
                character = "\\\\";
            return text.replace(new RegExp("^[" + character + "]", "g"), "");
        }
        $util.trimStart = trimStart;
        /** Returns the object at the specified path. */
        function expandPath(obj, path) {
            var parts = path.split(".");
            for (var i = 0; i < parts.length; i++)
                obj = obj[parts[i]];
            return obj;
        }
        $util.expandPath = expandPath;
        // extend String prototype
        String.prototype.format = function () {
            var str = this;
            var args = arguments;
            if (!args || !args.length)
                return str;
            // format object?
            if (args.length == 1 && (typeof args[0] == "object"))
                args = args[0];
            for (var k in args)
                str = str.replace("{" + k + "}", args[k]);
            return str;
        };
    })($util = $oewr.$util || ($oewr.$util = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    /** The app config. */
    var $cfg;
    (function ($cfg) {
        /** Initializes the app config. */
        function init(cfg) {
            $.extend(this, cfg);
            $oewr.$res = cfg.res;
            localize();
            addPageSynonyms();
        }
        $cfg.init = init;
        /** Localizes the app config/data */
        function localize() {
            // localize event types
            $q($oewr.MTBEventTypes).ForEach(function (x) { return $.extend(x.Value, $oewr.$res.eventTypes[x.Key]); });
            // localize moment
            moment.locale($cfg.lang);
        }
        /** Adds all page synonyms. */
        function addPageSynonyms() {
            // add page synonyms
            $q($cfg.pages).ForEach(function (p) {
                $q(p.Value.synonyms).ForEach(function (s) {
                    $cfg.pages[s] = {
                        name: s,
                        preload: false,
                        synonyms: [],
                        synname: p.Key
                    };
                });
            });
        }
    })($cfg = $oewr.$cfg || ($oewr.$cfg = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    /** Specifies all event types. (Extended by resource!) */
    $oewr.MTBEventTypes = {};
    $oewr.MTBEventTypes[0] = $oewr.MTBEventTypes["None"] = { id: 0, name: "None", description: "@@cfg", icon: "@@cfg", duration: 0 },
        $oewr.MTBEventTypes[1] = $oewr.MTBEventTypes["TechniqueTraining"] = { id: 1, name: "TechniqueTraining", description: "@@cfg", icon: "@@cfg", duration: 3.5 };
    $oewr.MTBEventTypes[2] = $oewr.MTBEventTypes["GuidedTour"] = { id: 2, name: "GuidedTour", description: "@@cfg", icon: "@@cfg", duration: 4 };
    $oewr.MTBEventTypes[3] = $oewr.MTBEventTypes["EBikeTour"] = { id: 3, name: "EBikeTour", description: "@@cfg", icon: "@@cfg", duration: 4 };
    $oewr.MTBEventTypes[4] = $oewr.MTBEventTypes["Camp"] = { id: 4, name: "Camp", description: "@@cfg", icon: "@@cfg", duration: 72 };
    $oewr.MTBEventTypes[5] = $oewr.MTBEventTypes["MechanicalTraining"] = { id: 5, name: "MechanicalTraining", description: "@@cfg", icon: "@@cfg", duration: 2 };
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    /** Defines the status of mtb events. */
    var MTBEventStatus;
    (function (MTBEventStatus) {
        /** The event will take place. */
        MTBEventStatus[MTBEventStatus["TakesPlace"] = 0] = "TakesPlace";
        /** The event is in progress. */
        MTBEventStatus[MTBEventStatus["InProgress"] = 1] = "InProgress";
        /** The event is canceled and will not take place. */
        MTBEventStatus[MTBEventStatus["Canceled"] = 2] = "Canceled";
        /** The event has been deleted. */
        MTBEventStatus[MTBEventStatus["Deleted"] = 3] = "Deleted";
    })(MTBEventStatus = $oewr.MTBEventStatus || ($oewr.MTBEventStatus = {}));
    /** Defines different kinds of registrations. */
    var MTBEventRegType;
    (function (MTBEventRegType) {
        /** Denies regisration for everyone. */
        MTBEventRegType[MTBEventRegType["NoOne"] = 0] = "NoOne";
        /** Allows registration for admins. */
        MTBEventRegType[MTBEventRegType["Admins"] = 1] = "Admins";
        /** Allows registration for partners */
        MTBEventRegType[MTBEventRegType["Partner"] = 3] = "Partner";
        /** Allows regisration for everyone. */
        MTBEventRegType[MTBEventRegType["Everyone"] = 7] = "Everyone";
    })(MTBEventRegType = $oewr.MTBEventRegType || ($oewr.MTBEventRegType = {}));
    /** Defines a mtb event. */
    var MTBEvent = /** @class */ (function () {
        /** Initializes a new instance. */
        function MTBEvent(state) {
            this.state = state;
        }
        /** Gets the value for the specified property. */
        MTBEvent.prototype.get = function (prop, type) {
            switch (type) {
                case "date":
                    var dt = $oewr.$util.mergeDatesStr(this.state[prop], this.p(prop));
                    if (!dt.isValid())
                        dt = null;
                    return dt;
                case "localize":
                    return $oewr.$util.localize(this.state, prop) || $oewr.$util.localize(this.p(), prop);
                default:
                    return this.state[prop] != null ? this.state[prop] : this.p(prop);
            }
        };
        /** Returns the specified property from the parent state or null if the event has no parent. */
        MTBEvent.prototype.p = function (prop) {
            var parent = this.parent();
            if (parent && parent.state)
                return prop ? parent.state[prop] : parent.state;
            return null;
        };
        /** Returns the event id. */
        MTBEvent.prototype.eventId = function () { return this.state.eventId; };
        /** Returns the parent event id. */
        MTBEvent.prototype.parentId = function () { return this.state.parentId; };
        /** Returns the parent event. */
        MTBEvent.prototype.parent = function () { return $oewr.$data.eventMap.Get(this.state.parentId); };
        /** Returns the parent id or if not specified the own one. */
        MTBEvent.prototype.seriesId = function () { return this.parentId() || this.eventId(); };
        /** Returns the parent event or if not specified the current one. */
        MTBEvent.prototype.series = function () { return $oewr.$data.eventMap.Get(this.seriesId()) || this; };
        /*** Returns whether the event is a series. */
        MTBEvent.prototype.isSeries = function () { return this.seriesId() == this.eventId(); };
        /** Returns the event from date/time. */
        MTBEvent.prototype.from = function () { return this.get("from", "date"); };
        /** Returns the event to date/time. */
        MTBEvent.prototype.to = function () { return this.get("to", "date"); };
        /** Returns the event type id */
        MTBEvent.prototype.typeId = function () { return this.get("type"); };
        /** Returns the event type. */
        MTBEvent.prototype.type = function () { return $oewr.MTBEventTypes[this.typeId()]; };
        /** Returns the event status. */
        MTBEvent.prototype.status = function () { return this.get("status"); };
        /** Returns the localized event name. */
        MTBEvent.prototype.name = function () { return this.get("name", "localize"); };
        /** Returns the german event name. */
        MTBEvent.prototype.name_de = function () { return this.get("name"); };
        /** Returns the english event name. */
        MTBEvent.prototype.name_en = function () { return this.get("name_en"); };
        /** Returns the localized event description. */
        MTBEvent.prototype.shortDescription = function () { return this.get("shortDescription", "localize"); };
        /** Returns the german event description. */
        MTBEvent.prototype.shortDescription_de = function () { return this.get("shortDescription"); };
        /** Returns the english event description. */
        MTBEvent.prototype.shortDescription_en = function () { return this.get("shortDescription_en"); };
        /** Returns the localized event description. */
        MTBEvent.prototype.description = function () { return this.get("description", "localize"); };
        /** Returns the german event description. */
        MTBEvent.prototype.description_de = function () { return this.get("description"); };
        /** Returns the english event description. */
        MTBEvent.prototype.description_en = function () { return this.get("description_en"); };
        /** Returns the localized event description. */
        MTBEvent.prototype.requirements = function () { return this.get("requirements", "localize"); };
        /** Returns the german event description. */
        MTBEvent.prototype.requirements_de = function () { return this.get("requirements"); };
        /** Returns the english event description. */
        MTBEvent.prototype.requirements_en = function () { return this.get("requirements_en"); };
        /** Returns the event price */
        MTBEvent.prototype.price = function () { return this.get("price"); };
        /** Returns the price as text. */
        MTBEvent.prototype.priceText = function () { return this.isErlebniscard() ? $oewr.$res.events.erlebniscardPrice : (this.priceAsNr() + " EUR"); };
        /** Returns the event price as number */
        MTBEvent.prototype.priceAsNr = function () { return parseFloat(this.price()); };
        /** Returns whether the event is an Erlebniscard event. */
        MTBEvent.prototype.isErlebniscard = function () { return this.price() === MTBEvent.ErlebniscardPrice; };
        /** Returns the event level */
        MTBEvent.prototype.level = function () { return this.get("level"); };
        /** Returns the level name. */
        MTBEvent.prototype.levelName = function () { return $oewr.MTBLevel[this.level()]; };
        /** Returns the level name. */
        MTBEvent.prototype.levelDescription = function () { return $oewr.$res.level[this.levelName()]; };
        /** Returns the event image */
        MTBEvent.prototype.img = function (addPath) {
            if (addPath === void 0) { addPath = true; }
            var img = this.get("img");
            if (!img)
                return null;
            if (img.substr(0, 5) == "data:")
                return img;
            if (addPath)
                return $oewr.$cfg.root + $oewr.$res.events.imgPath + img;
            return img;
        };
        /** Returns the meeting point coordinates (lat/lng). */
        MTBEvent.prototype.meetingPoint = function () { return this.get("meeting") || MTBEvent.DefaultMeetingPoint; };
        /** Returns the lat coordinate of the meeting point. */
        MTBEvent.prototype.lat = function () { return parseFloat(this.meetingPoint().split("/")[0]) || 46.56681976613046; };
        /** Returns the lng coordinate of the meeting point. */
        MTBEvent.prototype.lng = function () { return parseFloat(this.meetingPoint().split("/")[1]) || 13.920010328292847; };
        /** Returns the lng coordinate of the meeting point. */
        MTBEvent.prototype.meetingPointDescription = function () { return this.meetingPoint().split("/")[2] || "Parkplatz Natur Aktiv Park, Faak am See"; };
        /** Returns the max amount of participants. */
        MTBEvent.prototype.maxParticipants = function () { return this.get("max_participants") || 0; };
        /** Gets the reg type. */
        MTBEvent.prototype.allowReg = function () { return this.get("allow_reg") || 0; };
        /** Returns whether registration is allowed. */
        MTBEvent.prototype.isRegAllowed = function () {
            if (!$oewr.$cfg.allow_reg)
                return false;
            var regtype = this.allowReg();
            switch (regtype) {
                case MTBEventRegType.Admins: return $oewr.$ctx.session.isAdmin();
                case MTBEventRegType.Partner: return $oewr.$ctx.session.isPartner() || $oewr.$ctx.session.isAdmin();
                case MTBEventRegType.Everyone: return true;
            }
            return false;
        };
        /** Returns all occurrences of the series. */
        MTBEvent.prototype.occurrences = function () {
            var seriesId = this.seriesId();
            return $q($oewr.$data.events).Where(function (x) { return x.seriesId() == seriesId && x.isOccurrence(); }).ToArray();
        };
        /** Returns whether the current event is an occurence (has parent). */
        MTBEvent.prototype.isOccurrence = function () {
            return this.from() != null && this.to() != null;
        };
        MTBEvent.ErlebniscardPrice = "Erlebniscard";
        MTBEvent.DefaultMeetingPoint = "46.56681976613046/13.920010328292847/Parkplatz Natur Aktiv Park, Faak am See";
        return MTBEvent;
    }());
    $oewr.MTBEvent = MTBEvent;
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    /** Specifies the registration status. */
    var MTBRegistrationStatus;
    (function (MTBRegistrationStatus) {
        /** Canceled */
        MTBRegistrationStatus[MTBRegistrationStatus["Canceled"] = 0] = "Canceled";
        /** Active */
        MTBRegistrationStatus[MTBRegistrationStatus["Active"] = 1] = "Active";
    })(MTBRegistrationStatus = $oewr.MTBRegistrationStatus || ($oewr.MTBRegistrationStatus = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $data;
    (function ($data) {
        /** Initializes all app data. */
        function init() {
            if ($oewr.$doc.hasClass("no-data")) {
                $data.waitEvents = $.Deferred().resolve().promise();
                return $.Deferred().resolve().promise();
            }
            return $.when(
            // load events
            ($data.waitEvents = $oewr.$ctx.db.event.q().orderBy("from asc").find())
                .then((function (res) {
                $data.events = res;
                refreshEventMap();
            })));
        }
        $data.init = init;
        /** Registers or executes the data change event. */
        function change(handler) {
            if (!handler)
                $oewr.$doc.trigger("data-change");
            else
                $oewr.$doc.bind("data-change", handler);
        }
        $data.change = change;
        function refreshEventMap() {
            $data.eventMap = $q($data.events).ToDictionary(function (x) { return x.state.eventId; }, function (x) { return x; });
        }
        /** Adds the specified event(s). */
        function addEvent(event) {
            if (!Array.isArray(event))
                event = [event];
            $data.events = $q($data.events).Concat(event).OrderBy(function (x) { return x.from(); }).ToArray();
            refreshEventMap();
            change(); // trigger change event
        }
        $data.addEvent = addEvent;
        /** Adds the specified event(s). */
        function deleteEvent(event) {
            var arr = Array.isArray(event) ? event : [event];
            $data.events = $q($data.events).Where(function (x) { return !$q(arr).Any(function (e) { return e.eventId() == x.eventId(); }); }).ToArray();
            refreshEventMap();
            change(); // trigger change event
        }
        $data.deleteEvent = deleteEvent;
    })($data = $oewr.$data || ($oewr.$data = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $ui;
    (function ($ui) {
        var loader;
        (function (loader_1) {
            var timeout;
            var delay = 300;
            var count = 0;
            var loader = $("#loader");
            /** Shows the loader. */
            function show() {
                if (timeout)
                    return;
                count++;
                $oewr.$body.addClass("is-loading");
                timeout = setTimeout(function () {
                    loader.addClass("show");
                }, delay);
            }
            loader_1.show = show;
            /** Hides the loader. */
            function hide() {
                count = Math.max(0, count - 1);
                if (count > 0)
                    return;
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                loader.removeClass("show");
                $oewr.$body.removeClass("is-loading");
            }
            loader_1.hide = hide;
            /** Shows/hides the loader. */
            function toggle(showLoader) {
                if (showLoader == undefined)
                    showLoader = !loader.hasClass("show");
                if (showLoader)
                    show();
                else
                    hide();
            }
            loader_1.toggle = toggle;
        })(loader = $ui.loader || ($ui.loader = {}));
    })($ui = $oewr.$ui || ($oewr.$ui = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $ui;
    (function ($ui) {
        var section;
        (function (section) {
            /** Initializes all item lists. */
            function init(context, opt) {
                // activate sections on scroll
                var page = (context ? $oewr.$util.getPage(context) : null) || $oewr.$pages.get("main");
                var active = [];
                var scrollex = $ui.scrollex.init($((context ? "" : ".page ") + "> section, section > section", context), {
                    enter: !opt || !opt.setHashOnScroll ? null : function (sx, el) {
                        if ($oewr.$body.hasClass("is-loading"))
                            return false;
                        // add active element with href attr
                        var href = el.attr("href");
                        if (href) {
                            if (active.indexOf(href) == -1)
                                active.push(href); // add to array
                            if (active.length == 1)
                                $oewr.$app.setHash(active[0]); // set hash
                        }
                    },
                    leave: !opt || !opt.setHashOnScroll ? null : function (sx, el) {
                        if ($oewr.$body.hasClass("is-loading"))
                            return false;
                        // remove active element with href attr
                        var href = el.attr("href");
                        if (href) {
                            // remove inactive element
                            var idx = active.indexOf(href);
                            if (idx > -1) {
                                active.splice(idx, 1); // remove from active array
                                if (active.length == 1)
                                    $oewr.$app.setHash(active[0]); // set hash
                            }
                        }
                    }
                });
                // en-/disable scrollex on page load/hide
                page.pageCnt.on("pageload", function () { scrollex.options.enabled = true; });
                page.pageCnt.on("pagehide", function () { scrollex.options.enabled = false; });
            }
            section.init = init;
        })(section = $ui.section || ($ui.section = {}));
    })($ui = $oewr.$ui || ($oewr.$ui = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $ui;
    (function ($ui) {
        var link;
        (function (link_1) {
            /** Initializes all links */
            function init(context) {
                $("a", context).each(function () {
                    initLink($(this));
                });
            }
            link_1.init = init;
            /** Initializes the specified link. */
            function initLink(link) {
                var href = link.attr("href");
                // disable empty href links
                if (!href)
                    link.off("click.href").on("click.href", function (e) {
                        e.preventDefault();
                        return false;
                    });
                // hash -> scroll to
                else if (href[0] == "#")
                    link.off("click.href").on("click.href", function (e) {
                        // prevent default scrolling
                        if (e)
                            e.preventDefault();
                        // change hash
                        var hash = link.attr("href");
                        if (hash)
                            hash = hash.format($oewr.$url.args);
                        $oewr.$app.hashChange(hash, link.attr("anchor"), link.attr("speed"));
                    });
            }
        })(link = $ui.link || ($ui.link = {}));
    })($ui = $oewr.$ui || ($oewr.$ui = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $ui;
    (function ($ui) {
        var img;
        (function (img_1) {
            /** Initializes all images. */
            function init(context) {
                // at the moment we only check for svg support
                // so we can return if svg is supported
                if (Modernizr.svgasimg)
                    return;
                // init images
                $("img.svg", context).each(function (i, el) {
                    // check svg compatibility
                    var img = $(el);
                    if (img.hasClass("svg"))
                        convertSvgToPng(img);
                });
            }
            img_1.init = init;
            /** Replaces .svg by .png of the specified image source. */
            function convertSvgToPng(img) {
                var src = img.attr("src");
                img.attr("src", src.replace(".svg", ".png"));
            }
        })(img = $ui.img || ($ui.img = {}));
    })($ui = $oewr.$ui || ($oewr.$ui = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $ui;
    (function ($ui) {
        var items;
        (function (items) {
            var delay;
            /** Initializes all item lists. */
            function init(context) {
                // display items on scroll
                $ui.scrollex.init($(".items", context), { delay: delay })
                    .context.children()
                    .wrapInner('<div class="inner"></div>');
            }
            items.init = init;
        })(items = $ui.items || ($ui.items = {}));
    })($ui = $oewr.$ui || ($oewr.$ui = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $ui;
    (function ($ui) {
        var events;
        (function (events) {
            /** Initializes the events table. */
            function init(context) {
                // wait for meta
                $oewr.$data.waitEvents.done(function () {
                    // init all event-tables after meta has been loaded
                    $(".event-table table", context).each(function (i, el) {
                        appendEvents($(el));
                    });
                });
            }
            events.init = init;
            /** Appends all events. */
            function appendEvents(tbl) {
                var now = moment(new Date());
                $("tr.dummy", tbl).remove();
                tbl.prepend($q($oewr.$data.events)
                    .Where(function (ev) { return ev.isOccurrence() && ev.status() == $oewr.MTBEventStatus.TakesPlace; })
                    .SkipWhile(function (ev) { return ev.from() < now; })
                    .Take($oewr.$cfg.shownEvents)
                    .Select(function (ev) { return getEventRow(ev); })
                    .ToArray());
            }
            /** Returns an event row. */
            function getEventRow(event) {
                var eventUrl = $oewr.$res.events.eventUrl.format(event.eventId());
                return $("<tr>").addClass("event")
                    .append($("<td>").text(event.from().format($oewr.$res.news.dateFormat)))
                    .append($("<td>")
                    .append($("<a>").attr("href", eventUrl).text(event.name())))
                    .append($("<td>").text(event.priceText()));
            }
        })(events = $ui.events || ($ui.events = {}));
    })($ui = $oewr.$ui || ($oewr.$ui = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $ui;
    (function ($ui) {
        var gallery;
        (function (gallery) {
            /** Initializes all galleries. */
            function init(context) {
                // basic init
                $ui.scrollex.init($(".gallery", context)
                    .wrapInner('<div class="inner"></div>')
                    .prepend(skel.vars.mobile ? "" : '<div class="forward"></div><div class="backward"></div>'), { delay: 50 })
                    .context.children(".inner")
                    .css("overflow-y", skel.vars.mobile ? "visible" : "hidden")
                    .css("overflow-x", skel.vars.mobile ? "scroll" : "hidden")
                    .scrollLeft(0);
                // initialize lighbox feature
                initLightbox(context);
            }
            gallery.init = init;
            /** Initializes the lightbox feature. */
            function initLightbox(context) {
                $(".gallery.lightbox", context).on("click", "a", function (e) {
                    var $a = $(this), $gallery = $a.parents(".gallery"), $modal = $gallery.children(".modal"), $modalImg = $modal.find("img"), href = $a.attr("href");
                    // not an image?
                    if (!href || !href.match(/\.(jpg|gif|png|mp4)$/))
                        return;
                    // prevent default.
                    e.preventDefault();
                    e.stopPropagation();
                    // locked?
                    if ($modal[0]._locked)
                        return;
                    // lock and remember current img
                    $modal[0]._locked = true;
                    $modal.data("cur", $a);
                    // set src, visible and focus
                    $modalImg.attr("src", href);
                    $modal.addClass("visible");
                    $modal.focus();
                    // disable bg scrolling
                    $oewr.$main.addClass("no-scroll");
                    // delay and unlock.
                    setTimeout(function () { $modal[0]._locked = false; }, 300);
                })
                    .on("click", ".modal", function (e) {
                    var $modal = $(this), $modalImg = $modal.find("img");
                    // locked?
                    if ($modal[0]._locked)
                        return;
                    // already hidden?
                    if (!$modal.hasClass("visible"))
                        return;
                    // lock
                    $modal[0]._locked = true;
                    // clear visible, loaded.
                    $modal.removeClass("loaded");
                    // delay and hide.
                    setTimeout(function () {
                        $modal.removeClass("visible"); // hide
                        $oewr.$main.removeClass("no-scroll"); // enable scrolling
                        setTimeout(function () {
                            // clear src, unlock and set focus to body
                            $modalImg.attr("src", "");
                            $modal[0]._locked = false;
                            $modal.removeData("cur"); // remove current img
                            $oewr.$body.focus();
                        }, 175);
                    }, 125);
                })
                    // prev lick
                    .on("click", ".prev", function (e) {
                    var $modal = $(this).parents(".gallery").children(".modal");
                    // get current
                    var $cur = $modal.data("cur");
                    if (!$cur)
                        return;
                    // get prev
                    var $prev = $cur.parent().prev().find("a");
                    // take last if we are at the top
                    if (!$prev || !$prev.length)
                        $prev = $cur.parent().parent().children().last().find("a");
                    // check
                    if (!$prev || !$prev.length)
                        return;
                    // load prev
                    $prev.trigger("click");
                })
                    // next click
                    .on("click", ".next", function (e) {
                    var $modal = $(this).parents(".gallery").children(".modal");
                    // get current
                    var $cur = $modal.data("cur");
                    if (!$cur)
                        return;
                    // get next
                    var $next = $cur.parent().next().find("a");
                    // take first if we are at the end
                    if (!$next || !$next.length)
                        $next = $cur.parent().parent().children().first().find("a");
                    // check
                    if (!$next || !$next.length)
                        return;
                    // load next
                    $next.trigger("click");
                })
                    // keyboard listener
                    .on("keydown", ".modal", function (e) {
                    var $modal = $(this);
                    switch (e.keyCode) {
                        // escape, hide lightbox
                        case 27:
                            $modal.trigger("click");
                            break;
                        // left, prev img
                        case 37:
                            $modal.parent().find(".prev").trigger("click");
                            break;
                        // right, next img
                        case 39:
                            $modal.parent().find(".next").trigger("click");
                            break;
                    }
                })
                    .prepend('<div class="modal" tabIndex="-1">'
                    + '<a class="prev icon style2 fa-angle-left"></a>'
                    + '<div class="inner"><img src="" /></div>'
                    + '<a class="next icon style2 fa-angle-right"></a>'
                    + '</div>')
                    .find("img")
                    .on("load", function (e) {
                    var $modalImg = $(this), $modal = $modalImg.parents(".modal");
                    setTimeout(function () {
                        // no longer visible?
                        if (!$modal.hasClass("visible"))
                            return;
                        // set loaded.
                        $modal.addClass("loaded");
                    }, 275);
                });
            }
        })(gallery = $ui.gallery || ($ui.gallery = {}));
    })($ui = $oewr.$ui || ($oewr.$ui = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $ui;
    (function ($ui) {
        var map;
        (function (map_1) {
            var apikey = "AIzaSyBdO_cpM267sMdq2GO-ujjfch3dMjUHMjY";
            var currentIdx = 0;
            var apiAdded;
            var wait = $.Deferred();
            map_1.maps = [];
            /** Initializes all maps. */
            function init(context) {
                $(".map", context).q().ForEach(function (x) { return map_1.maps.push(createMap(x)); });
            }
            map_1.init = init;
            function createMap(cnt) {
                var map = { element: cnt, wait: $.Deferred() };
                var lat = parseFloat(cnt.attr("lat"));
                var lng = parseFloat(cnt.attr("lng"));
                var zoom = parseFloat(cnt.attr("zoom"));
                if (lat && lng)
                    map.start = { lat: lat, lng: lng };
                if (zoom)
                    map.zoom = zoom;
                // add map promise
                map.element.data("gmap_promise", map.wait.promise());
                // read markers
                map.marker = $q($(".marker", cnt)).Select(function (x) {
                    var marker = {
                        position: {
                            lat: parseFloat(x.attr("lat")),
                            lng: parseFloat(x.attr("lng"))
                        },
                        title: x.attr("title"),
                        label: x.attr("label"),
                        draggable: x.hasClass("draggable")
                    };
                    return marker;
                }).ToArray();
                // read paths
                map.paths = $q($(".path", cnt)).Select(function (p) {
                    var path = {
                        path: $q(p.children()).Select(function (x) { return ({ lat: parseFloat(x.attr("lat")), lng: parseFloat(x.attr("lng")) }); }).ToArray(),
                        geodesic: true,
                        strokeColor: p.attr("color"),
                        strokeOpacity: parseFloat(p.attr("opacity")) | 1.0,
                        strokeWeight: parseFloat(p.attr("weight")) | 2.0
                    };
                    return path;
                }).ToArray();
                window["initMap" + currentIdx] = function () { initMap(map, currentIdx); };
                // add api only once
                if (!apiAdded) {
                    cnt.after('<script async defer src="https://maps.googleapis.com/maps/api/js?key=' + apikey + '&callback=initMap' + currentIdx + '"></script>');
                    apiAdded = true;
                }
                else
                    wait.done(function () { initMap(map, currentIdx); });
                currentIdx++;
                return map;
            }
            function initMap(map, idx) {
                // stop waiting
                wait.resolve();
                // initialize the map and set the start location
                var gmap = new google.maps.Map(map.element[0], {
                    center: map.start ? { lat: map.start.lat, lng: map.start.lng } : null,
                    zoom: map.zoom,
                    styles: $ui.mapStyle
                });
                map.element.data("gmap", gmap);
                // add markers
                var markers = [];
                $q(map.marker).ForEach(function (m, midx) {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(m.position.lat, m.position.lng),
                        title: m.title,
                        label: m.label,
                        draggable: m.draggable
                    });
                    marker.setMap(gmap);
                    markers.push(marker);
                    // set marker pos
                    map.element.attr("m" + midx + "_lat", m.position.lat);
                    map.element.attr("m" + midx + "_lng", m.position.lng);
                    // set marker pos on drag
                    if (m.draggable)
                        marker.addListener("drag", function () {
                            var pos = marker.getPosition();
                            map.element.attr("m" + midx + "_lat", pos.lat);
                            map.element.attr("m" + midx + "_lng", pos.lng);
                        });
                });
                map.element.data("gmap_markers", markers);
                // add paths
                var paths = [];
                $q(map.paths).ForEach(function (p) {
                    var path = new google.maps.Polyline(p);
                    paths.push(path);
                    path.setMap(gmap);
                });
                map.element.data("gmap_paths", paths);
                // prevent mouse event capturing
                var innerMap;
                map.element.mouseenter(function () {
                    if (!innerMap) {
                        innerMap = map.element.children().first();
                        innerMap.mouseleave(function () { innerMap.addClass("no-pointer-events"); });
                    }
                    innerMap.addClass("no-pointer-events");
                });
                map.element.click(function () { innerMap.removeClass("no-pointer-events"); });
                // map ready
                map.wait.resolve();
            }
        })(map = $ui.map || ($ui.map = {}));
    })($ui = $oewr.$ui || ($oewr.$ui = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $ui;
    (function ($ui) {
        $ui.mapStyle = [
            {
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "gamma": 1
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.business",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.business",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.place_of_worship",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.place_of_worship",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "water",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "saturation": 50
                    },
                    {
                        "gamma": 0
                    },
                    {
                        "hue": "#50a5d1"
                    }
                ]
            },
            {
                "featureType": "administrative.neighborhood",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#333333"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "weight": 0.5
                    },
                    {
                        "color": "#333333"
                    }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "gamma": 1
                    },
                    {
                        "saturation": 50
                    }
                ]
            }
        ];
    })($ui = $oewr.$ui || ($oewr.$ui = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $ui;
    (function ($ui) {
        var menu;
        (function (menu_1) {
            var mbtn = $("#menu-btn");
            var menu = $("#menu");
            /** Initializes the menu. */
            function init() {
                // init links
                $ui.link.init(menu);
                // toggle menu on menu button click
                mbtn.click(function () {
                    if ($oewr.$main.hasClass("menu-opened"))
                        close();
                    else
                        open();
                });
                // close menu when clicking outside of the inner container
                menu.click(function (e) {
                    var target = $(e.target);
                    if (target.attr("id") == "menu" || target.hasClass("icon"))
                        close();
                });
            }
            menu_1.init = init;
            /** Opens the menu. */
            function open() {
                mbtn.addClass("fa-close").removeClass("fa-bars");
                $oewr.$main.addClass("menu-opened").addClass("no-scroll");
                menu.addClass("opened");
            }
            menu_1.open = open;
            /** Closes the menu. */
            function close() {
                mbtn.addClass("fa-bars").removeClass("fa-close");
                $oewr.$main.removeClass("menu-opened").removeClass("no-scroll");
                menu.removeClass("opened");
            }
            menu_1.close = close;
        })(menu = $ui.menu || ($ui.menu = {}));
    })($ui = $oewr.$ui || ($oewr.$ui = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $ui;
    (function ($ui) {
        /** JQuery timeline extension */
        $.fn.timeline = function () {
            return this.data("timeline");
        };
        var timeline;
        (function (timeline) {
            function init(context) {
                $(".timeline", context).each(function (i, el) {
                    new Timeline($(el));
                });
            }
            timeline.init = init;
        })(timeline = $ui.timeline || ($ui.timeline = {}));
        var Timeline = /** @class */ (function () {
            /** Initializes a new instance of Timeline */
            function Timeline(el) {
                this.element = el.data("timeline", this);
                this.page = $oewr.$util.getPage(this.element);
                this.initBlocks();
                this.initScrolling();
                $ui.link.init(el);
            }
            Timeline.prototype.initScrolling = function () {
                var _this = this;
                this.hideBlocks();
                $oewr.$window.on("scroll", function () {
                    if (!_this || !_this.hasBlocks() || !_this.pageIsActive())
                        return;
                    if (!window.requestAnimationFrame)
                        setTimeout(function () { _this.showBlocks(); }, 100);
                    else
                        window.requestAnimationFrame(function () { _this.showBlocks(); });
                });
            };
            /** Returns whether the timeline has blocks. */
            Timeline.prototype.hasBlocks = function () {
                return this.blocks && this.blocks.length > 0;
            };
            /** Returns whether the timeline's page is active. */
            Timeline.prototype.pageIsActive = function () {
                return this.page && this.page.pageCnt.hasClass("current");
            };
            /** Initializes the blocks. */
            Timeline.prototype.initBlocks = function () {
                this.blocks = $('.timeline-block', this.element);
            };
            /** Hides timeline blocks which are not on the viewport. */
            Timeline.prototype.hideBlocks = function () {
                var _this = this;
                this.blocks.each(function (i, el) {
                    _this.hideBlock($(el));
                });
            };
            /** Shows timeline blocks which are on or near the viewport. */
            Timeline.prototype.showBlocks = function () {
                var _this = this;
                this.blocks.each(function (i, el) {
                    _this.showBlock($(el));
                });
            };
            /** Refreshes (show/hides) all blocks. */
            Timeline.prototype.refreshBlocks = function () {
                var _this = this;
                this.blocks.each(function (i, el) {
                    var block = $(el);
                    _this.hideBlock(block);
                    _this.showBlock(block);
                });
            };
            Timeline.prototype.hideBlock = function (block) {
                if (block.offset().top > $oewr.$window.scrollTop() + $oewr.$window.height() * Timeline.offset)
                    block.find('.timeline-img, .timeline-content').addClass('is-hidden');
            };
            Timeline.prototype.showBlock = function (block) {
                if (block.offset().top <= $oewr.$window.scrollTop() + $oewr.$window.height() * Timeline.offset && block.find('.timeline-img').hasClass('is-hidden'))
                    block.find('.timeline-img, .timeline-content').removeClass('is-hidden').addClass('bounce-in');
            };
            /** Offset for show/hide blocks; */
            Timeline.offset = 0.8;
            return Timeline;
        }());
        $ui.Timeline = Timeline;
    })($ui = $oewr.$ui || ($oewr.$ui = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $ui;
    (function ($ui) {
        var scrollex;
        (function (scrollex_1) {
            /** Initializes a new scrollex element. */
            function init(context, opt) {
                return new Scrollex(context, opt);
            }
            scrollex_1.init = init;
            /** Adds new scrolling events to change elements on scrolling. */
            var Scrollex = /** @class */ (function () {
                /** Initializes a new scrollex element. */
                function Scrollex(context, opt) {
                    var _this = this;
                    // set element
                    this.context = context;
                    this.context.each(function (i, el) { $(el).data("scrollex", _this); });
                    // extend default options
                    var t = this;
                    var init = opt.initialize, terminate = opt.terminate, enter = opt.enter, leave = opt.leave;
                    this.options = opt = $.extend({}, Scrollex.defaultOptions, opt, {
                        initialize: function () { t.initialize($(this), init); },
                        terminate: function () { t.terminate($(this), terminate); },
                        enter: function () { t.enter($(this), enter); },
                        leave: function () { t.leave($(this), leave); }
                    });
                    // execute jquery scrollex plugin
                    this.context.scrollex(opt);
                }
                /** Triggered when scrollex is called on an element. */
                Scrollex.prototype.initialize = function (el, init) {
                    if (!this.options.enabled || init && init(this, el) === false)
                        return;
                    el.addClass(this.options.inactiveClass);
                };
                /** Triggered when unscrollex is called on an element. */
                Scrollex.prototype.terminate = function (el, terminate) {
                    if (!this.options.enabled || terminate && terminate(this, el) === false)
                        return;
                    el.removeClass(this.options.inactiveClass);
                };
                /** Triggered when the viewport enters an element's contact area. */
                Scrollex.prototype.enter = function (el, enter) {
                    if (!this.options.enabled || enter && enter(this, el) === false)
                        return;
                    // set active
                    el.removeClass(this.options.inactiveClass);
                };
                /** Triggered when the viewport leaves an element's contact area. */
                Scrollex.prototype.leave = function (el, leave) {
                    if (!this.options.enabled || leave && leave(this, el) === false)
                        return;
                    // set inactive
                    var opt = this.options;
                    if (opt.bidirectional == true || opt.bidirectional && el.hasClass(opt.bidirectional))
                        el.addClass(opt.inactiveClass);
                };
                /** Default options. */
                Scrollex.defaultOptions = {
                    enabled: true,
                    top: "30vh",
                    bottom: "30vh",
                    inactiveClass: "is-inactive",
                    bidirectional: "onscroll-bidirectional"
                };
                return Scrollex;
            }());
            scrollex_1.Scrollex = Scrollex;
        })(scrollex = $ui.scrollex || ($ui.scrollex = {}));
    })($ui = $oewr.$ui || ($oewr.$ui = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $ui;
    (function ($ui) {
        $ui.$scrollCnt = $("body,html");
        $ui.$backBtn = $("#back-btn");
        /** Initializes the UI. */
        function init(context, opt) {
            // init ui parts
            fixObjectFit(context); // fix object fit
            $ui.section.init(context, opt);
            $ui.img.init(context);
            $ui.items.init(context); // init item lists
            $ui.events.init(context); // init events
            $ui.gallery.init(context); // init gallery
            $ui.timeline.init(context); // init timeline
            $ui.map.init(context); // google maps
            $ui.link.init(context); // init links and smooth scrolling, do this last because the other functions may create/change some link
            // trigger scroll event to ensure scrollex works fine
            $ui.$scrollCnt.trigger("scroll");
        }
        $ui.init = init;
        /** Init common ui parts, should be called only once. */
        function initCommon() {
            fixIEFlexbox(); // fix IE flexbox min-height bug
            initBackBtn(); // init back button
            initLangBtn(); // hide language button on scroll
            $ui.menu.init(); // menu
        }
        $ui.initCommon = initCommon;
        /** Initializes skel. */
        function initSkel() {
            // set skel breakpoints
            skel.breakpoints({
                xlarge: '(max-width: 1680px)',
                large: '(max-width: 1280px)',
                medium: '(max-width: 980px)',
                small: '(max-width: 736px)',
                xsmall: '(max-width: 480px)',
                xxsmall: '(max-width: 360px)',
                minxlarge: '(min-width: 1680px)',
                minlarge: '(min-width: 1280px)',
                minmedium: '(min-width: 980px)',
                minsmall: '(min-width: 736px)',
                minxsmall: '(min-width: 480px)',
                minxxsmall: '(min-width: 360px)'
            });
        }
        $ui.initSkel = initSkel;
        /** Scrolls to the specified element.
         * anchor: top|middle
         * speed: slow|normal|fast|immediate
         */
        function scrollTo(url, anchor, speed, popstate, wait) {
            // load page
            if (!wait)
                wait = $.Deferred();
            var pageName = (url.page || "main");
            if ($oewr.$pages.exists(pageName + "-" + url.dest))
                pageName += "-" + url.dest;
            $oewr.$pages.load(pageName).done(function (page) {
                // get destination element
                var dest = url.dest ? $("#" + url.dest) : null;
                if (dest && !dest.length)
                    dest = $("section[href='#/" + url.dest + "']");
                scrollToPage(page, dest, anchor, speed, popstate, wait);
            })
                .fail(function (err) {
                wait.reject(err);
            });
            return wait.promise();
        }
        $ui.scrollTo = scrollTo;
        /** Scroll to the specifie page. */
        function scrollToPage(page, dest, anchor, speed, popstate, wait) {
            if (anchor === void 0) { anchor = "top"; }
            if (speed === void 0) { speed = "normal"; }
            // get anchor and speed
            if (!dest || !dest.length)
                dest = page.pageCnt;
            if (!anchor)
                anchor = dest.attr("anchor") || "top";
            if (!speed)
                speed = dest.attr("speed") || "normal";
            // if popstate try get offset from page
            var offset;
            if (popstate)
                offset = page.remOffset();
            // otherwise get offset from dest
            if (offset == undefined)
                offset = $oewr.$util.getOffset(dest, anchor);
            // scroll to offset
            return scrollToPos(offset, anchor, speed, wait);
        }
        $ui.scrollToPage = scrollToPage;
        /** Scrolls to the specified position. */
        function scrollToPos(offset, anchor, speed, wait) {
            if (anchor === void 0) { anchor = "top"; }
            if (speed === void 0) { speed = "normal"; }
            if (!wait)
                wait = $.Deferred();
            // scroll immediate?
            if (speed == "immediate") {
                $ui.$scrollCnt.stop().scrollTop(offset);
                setTimeout(function () {
                    wait.resolve();
                }, 100);
            }
            else // scroll smooth
             {
                var duration = 1000; // normal speed
                if (speed == "slow")
                    duration = 2000;
                else if (speed == "fast")
                    duration = 300;
                $ui.$scrollCnt.stop().animate({ scrollTop: offset }, duration, "swing", function () {
                    wait.resolve();
                });
            }
            return wait.promise();
        }
        $ui.scrollToPos = scrollToPos;
        /** Initializes the back button. */
        function initBackBtn() {
            $ui.$backBtn.click(function (e) {
                // prevent default scrolling
                if (e)
                    e.preventDefault();
                // go back
                $oewr.$app.back();
            });
        }
        /** Initializes the language button. */
        function initLangBtn() {
            var langBtn = $("#lang-btn");
            var check = function (e) {
                var winHeight = $oewr.$window.height();
                var scrollHeight = $oewr.$window.scrollTop();
                langBtn.toggleClass("hidden", scrollHeight > (winHeight / 2) || $oewr.$pages.current && $oewr.$pages.current.pageCnt.hasClass("no-lang-btn"));
            };
            $oewr.$window.scroll(check);
            $oewr.$window.resize(check);
            check();
        }
        /** Fixes IE flexbox min-height bug. */
        function fixIEFlexbox() {
            if (skel.vars.browser != 'ie')
                return;
            var flexboxFixTimeoutId;
            $oewr.$window.on('resize.flexbox-fix', function () {
                var $x = $('.fullscreen');
                clearTimeout(flexboxFixTimeoutId);
                flexboxFixTimeoutId = setTimeout(function () {
                    if ($x.prop('scrollHeight') > $oewr.$window.height())
                        $x.css('height', 'auto');
                    else
                        $x.css('height', '100vh');
                }, 250);
            }).triggerHandler('resize.flexbox-fix');
        }
        /** Fixes object fix. */
        function fixObjectFit(context) {
            if (skel.canUse('object-fit'))
                return;
            $('.banner .image, .spotlight .image', context).each(function (idx, el) {
                var $el = $(el), $img = $el.children('img'), positionClass = $el.parent().attr('class').match(/image-position-([a-z]+)/);
                // set image.
                $el.css('background-image', 'url("' + $img.attr('src') + '")')
                    .css('background-repeat', 'no-repeat')
                    .css('background-size', 'cover');
                // set position.
                switch (positionClass.length > 1 ? positionClass[1] : '') {
                    case 'left':
                        $el.css('background-position', 'left');
                        break;
                    case 'right':
                        $el.css('background-position', 'right');
                        break;
                    case 'center':
                    default:
                        $el.css('background-position', 'center');
                        break;
                }
                // hide original.
                $img.css('opacity', '0');
            });
        }
    })($ui = $oewr.$ui || ($oewr.$ui = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $ctx;
    (function ($ctx) {
        var db;
        (function (db) {
            /** Specifies a database table. */
            var DBTable = /** @class */ (function () {
                /** Initializes a new instance of DBTable. */
                function DBTable(name, id, parse, staticRes, failLoadStatic) {
                    this.name = name;
                    this.id = id;
                    this.parse = parse;
                    this.staticRes = staticRes;
                    this.failLoadStatic = failLoadStatic;
                }
                /** Starts a new query. */
                DBTable.prototype.q = function () {
                    return new DBQuery(this);
                };
                DBTable.prototype.set = function (method, arg) {
                    var _this = this;
                    var items = Array.isArray(arg) ? arg : [arg];
                    if (method == "post" && this.id) //remove id for insert
                        $q(items).ForEach(function (x) { return delete x[_this.id]; });
                    return $ctx[method]("/" + $oewr.$cfg.ctx.db + "/_table/" + this.name, { resource: items }).then(function (res) {
                        if (res && res.resource && res.resource.length)
                            $q(res.resource).ForEach(function (x, i) { return $.extend(items[i], x); });
                        return Array.isArray(arg) ? $q(arg).Select(function (x) { return _this.parse(x); }).ToArray() : _this.parse(arg);
                    });
                };
                DBTable.prototype.insert = function (arg) {
                    return this.set("post", arg);
                };
                DBTable.prototype.update = function (arg) {
                    return this.set("put", arg);
                };
                DBTable.prototype["delete"] = function (arg) {
                    return this.set("del", arg);
                };
                return DBTable;
            }());
            db.DBTable = DBTable;
            /** Specifies a database call. */
            var DBQuery = /** @class */ (function () {
                /** Initializes a new instance of DBCall. */
                function DBQuery(table) {
                    this._table = table;
                    this._url = "/" + $oewr.$cfg.ctx.db + "/_table/" + table.name;
                }
                /** Selects the specified fields. */
                DBQuery.prototype.select = function (fields) {
                    this._select = fields;
                    return this;
                };
                /** Specifies a filter. */
                DBQuery.prototype.where = function (filter) {
                    this._where = filter;
                    return this;
                };
                /** Specifies a relation. */
                DBQuery.prototype.related = function (fields) {
                    this._related = fields;
                    return this;
                };
                /** Specifies to order the result by the given fields. */
                DBQuery.prototype.orderBy = function (fields) {
                    this._orderBy = fields;
                    return this;
                };
                /** Specifies to group the result by the fiven fields. */
                DBQuery.prototype.groupBy = function (fields) {
                    this._groupBy = fields;
                    return this;
                };
                /** Limits the amount of records returned. */
                DBQuery.prototype.limit = function (limit) {
                    this._limit = limit;
                    return this;
                };
                /** Specifies an offset for the result records. */
                DBQuery.prototype.offset = function (offset) {
                    this._offset = offset;
                    return this;
                };
                /** Parses a single record. */
                DBQuery.prototype.parseSingle = function (res) {
                    if (!res)
                        return null;
                    else if (this._table.parse)
                        return this._table.parse(res);
                    else
                        return res;
                };
                /** Parses multiple records. */
                DBQuery.prototype.parseMany = function (res) {
                    var _this = this;
                    if (!res || !res.resource)
                        return [];
                    if (this._table.parse)
                        return $q(res.resource).Select(function (x) { return _this._table.parse(x); }).ToArray();
                    else
                        return res.resource;
                };
                /** Retrieves a single records. */
                DBQuery.prototype.get = function (id) {
                    var _this = this;
                    var data = {};
                    if (this._select)
                        data["fields"] = this._select;
                    return $ctx.get(this._url + "/" + id, data).then(function (res) { return _this.parseSingle(res); });
                };
                /** Retrieves multiple records. */
                DBQuery.prototype.find = function () {
                    var _this = this;
                    var data = {};
                    if (this._select)
                        data["fields"] = this._select;
                    if (this._where)
                        data["filter"] = this._where;
                    if (this._orderBy)
                        data["order"] = this._orderBy;
                    if (this._groupBy)
                        data["group"] = this._groupBy;
                    if (this._limit)
                        data["limit"] = this._limit;
                    if (this._offset)
                        data["offset"] = this._offset;
                    if (this._related)
                        data["related"] = this._related;
                    return $ctx.get(this._url, data).then(function (res) { return _this.parseMany(res); }, // success
                    function () {
                        // retry from static resource
                        if (_this._table.staticRes) {
                            console.debug("Failed to load " + _this._table.name + " from service, try using static resource.");
                            if (_this._table.failLoadStatic)
                                _this._table.failLoadStatic();
                            return _this.retryStatic(_this._table.staticRes).then(function (res) { return _this.parseMany(res); });
                        }
                    });
                };
                DBQuery.prototype.retryStatic = function (res) {
                    return $.ajax({
                        type: "GET",
                        url: $oewr.$cfg.root + res,
                        accepts: { json: "application/json" },
                        contentType: "application/json"
                    });
                };
                return DBQuery;
            }());
            db.DBQuery = DBQuery;
            // init tables
            db.event = new DBTable("event", "eventId", function (ev) { return new $oewr.MTBEvent(ev); }, "data/events.json", function () { $oewr.$cfg.allow_reg = false; });
        })(db = $ctx.db || ($ctx.db = {}));
    })($ctx = $oewr.$ctx || ($oewr.$ctx = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $ctx;
    (function ($ctx) {
        var session;
        (function (session_1) {
            var sessionCookie = "alpbros_session";
            var agreementCookie = "alpbros_cookie_agreement";
            /** The current session. */
            session_1.current = null;
            /** The current profile. */
            session_1.profile = null;
            /** Promise to wait for session interactions. */
            var _wait = $.Deferred().resolve();
            /** Returns the session token. */
            function token() {
                return (session_1.current ? session_1.current.session_token : null) || Cookies.get(sessionCookie);
            }
            session_1.token = token;
            /** Returns the promise to wait for session interactions. */
            function wait() {
                return _wait.promise();
            }
            session_1.wait = wait;
            /** Signs in the specified user. */
            function signin(email, pwd, duration) {
                if (duration === void 0) { duration = 0; }
                if (!_wait)
                    _wait = $.Deferred();
                var data = { email: email, password: pwd };
                if (duration)
                    data["duration"] = duration;
                else
                    data["remember_me"] = true;
                console.debug("sign in " + JSON.stringify(data));
                return $ctx.post("/user/session", data)
                    .always(function () {
                    // resolve session promise
                    if (_wait)
                        _wait.resolve();
                })
                    .then(function (session) {
                    // set session
                    setSession(session);
                    // load profile
                    return $ctx.get("/user/profile");
                })
                    .then(function (profile) {
                    // set profile
                    session.profile = profile;
                    return session.current;
                })
                    .fail(function (jqXHR, status, err) {
                    // cancel session
                    return setSession(null);
                });
            }
            session_1.signin = signin;
            /** Signs in the specified user by hash. */
            function hashauth(hash) {
                if (!_wait)
                    _wait = $.Deferred();
                return $ctx.post("/hashauth", { hash: hash })
                    .always(function () {
                    // resolve session promise
                    if (_wait)
                        _wait.resolve();
                })
                    .then(function (session) {
                    // set session
                    setSession(session);
                    // load profile
                    return $ctx.get("/user/profile");
                })
                    .then(function (profile) {
                    // set profile
                    session.profile = profile;
                    return session.current;
                })
                    .fail(function (jqXHR, status, err) {
                    // cancel session
                    return setSession(null);
                });
            }
            session_1.hashauth = hashauth;
            /** Signs out the current user. */
            function signout() {
                if (!_wait)
                    _wait = $.Deferred();
                if (!session_1.current || !session_1.current.session_token) {
                    if (_wait)
                        _wait.resolve(); // resolve session promise
                    return $.Deferred().resolve().promise();
                }
                console.debug("sign out");
                return $ctx.del("/user/session")
                    .always(function () {
                    // resolve session promise
                    if (_wait)
                        _wait.resolve();
                })
                    .then(function () {
                    // cancel session
                    return setSession(null);
                });
            }
            session_1.signout = signout;
            /** Refreshes the current session. */
            function refresh() {
                if (!_wait)
                    _wait = $.Deferred();
                // try get session from cookie
                var token = session_1.current ? session_1.current.session_token : null;
                if (!token)
                    token = Cookies.get(sessionCookie);
                console.debug("refresh session " + token);
                if (!token) {
                    if (_wait)
                        _wait.resolve(); // resolve session promise
                    return $.Deferred().reject().promise();
                }
                return $ctx.put("/user/session") //, { "session_token": token })
                    .always(function () {
                    // resolve session promise
                    if (_wait)
                        _wait.resolve();
                })
                    .then(function (session) {
                    // refresh session
                    setSession(session);
                    console.debug("session refreshed " + session.session_token);
                    // load profile
                    return $ctx.get("/user/profile");
                })
                    .then(function (profile) {
                    // set profile
                    session.profile = profile;
                    console.debug("got profile for session");
                    return session.current;
                })
                    .fail(function (jqXHR, status, err) {
                    // cancel session
                    return setSession(null);
                });
            }
            session_1.refresh = refresh;
            /** Sets the current session and cookie. */
            function setSession(session) {
                console.debug("set session " + JSON.stringify(session));
                session_1.current = session;
                if (session_1.current)
                    Cookies.set(sessionCookie, session_1.current.session_token, { expires: 1 });
                else {
                    Cookies.remove(sessionCookie);
                    session_1.profile = null;
                }
                change(); // trigger session change event
                return session_1.current;
            }
            function role() {
                var r = (session_1.current ? session_1.current.role : "") || "";
                return $oewr.$cfg.roles[r];
            }
            /** Returns whether the specified path is granted. */
            function granted(path) {
                var parts = path.split("/").reverse();
                var acl = $oewr.$cfg.access;
                while (acl && parts.length)
                    acl = acl[parts.pop()];
                // allow all for default
                if (!acl)
                    return true;
                return $q(acl).Contains(role()) || $q(acl).Contains("*");
            }
            session_1.granted = granted;
            /** Returns whether the current user is a public user. */
            function isPublic() {
                return session_1.current == null || session_1.current.role == null || session_1.current.role == "OEWR WWW";
            }
            session_1.isPublic = isPublic;
            /** Returns whether the current user is partner. */
            function isPartner() {
                return session_1.current != null && session_1.current.role == "OEWR Partner";
            }
            session_1.isPartner = isPartner;
            /** Returns whether the current user is admin. */
            function isAdmin() {
                return session_1.current != null && session_1.current.role == "OEWR Admin";
            }
            session_1.isAdmin = isAdmin;
            /** Returns whether cookies has been agreed. */
            function hasCookieAgreement() {
                return Cookies.get(agreementCookie) != null;
            }
            session_1.hasCookieAgreement = hasCookieAgreement;
            /** Sets the cookie agreement. */
            function agreeCookies() {
                Cookies.set(agreementCookie, "true", { expires: 365 });
            }
            session_1.agreeCookies = agreeCookies;
            /** Registers or executes the session change event. */
            function change(handler) {
                if (!handler)
                    $oewr.$doc.trigger("session-change");
                else
                    $oewr.$doc.bind("session-change", handler);
            }
            session_1.change = change;
        })(session = $ctx.session || ($ctx.session = {}));
    })($ctx = $oewr.$ctx || ($oewr.$ctx = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $ctx;
    (function ($ctx) {
        /** Loads all registrations for the specified event. */
        function getRegistrations(eventId) {
            return $ctx.get("/registration/" + eventId + "?db=" + $oewr.$cfg.ctx.db).then(function (res) {
                if (!res)
                    res = {};
                return {
                    registrations: res.registrations,
                    count: res.count || 0
                };
            });
        }
        $ctx.getRegistrations = getRegistrations;
        /** Adds the specified registration with the specified recaptcha token. */
        function register(reg, token, email) {
            return $ctx.post("/registration?lang=" + $oewr.$cfg.lang + "&db=" + $oewr.$cfg.ctx.db, { token: token, reg: reg, email: email });
        }
        $ctx.register = register;
        /** Deletes the specified event registration. */
        function deleteRegistration(reg, force, status, email) {
            return $ctx.del("/registration?lang=" + $oewr.$cfg.lang + "&db=" + $oewr.$cfg.ctx.db, { reg: reg, force: force, status: status || $oewr.MTBRegistrationStatus.Canceled, email: email });
        }
        $ctx.deleteRegistration = deleteRegistration;
    })($ctx = $oewr.$ctx || ($oewr.$ctx = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $ctx;
    (function ($ctx) {
        /** Performs an API request. */
        function call(verb, url, data) {
            return $ctx.session.wait().then(function () {
                if (data && verb != "GET")
                    data = JSON.stringify(data);
                return $.ajax({
                    type: verb,
                    url: $oewr.$cfg.ctx.baseurl + url,
                    data: data || {},
                    accepts: { json: "application/json" },
                    contentType: "application/json",
                    headers: {
                        "X-DreamFactory-API-Key": $oewr.$cfg.ctx.apikey,
                        "X-DreamFactory-Session-Token": $ctx.session.token()
                    }
                });
            });
        }
        $ctx.call = call;
        /** Checks the specified url. */
        function checkUrl(url) {
            return url.replace("/db", "/" + $oewr.$cfg.ctx.db);
        }
        /** Performs an API GET request. */
        function get(url, data) {
            return call("GET", url, data);
        }
        $ctx.get = get;
        /** Performs an API POST request. */
        function post(url, data) {
            return call("POST", url, data);
        }
        $ctx.post = post;
        /** Performs an API PUT request. */
        function put(url, data) {
            return call("PUT", url, data);
        }
        $ctx.put = put;
        /** Performs an API DELETE request. */
        function del(url, data) {
            return call("DELETE", url, data);
        }
        $ctx.del = del;
    })($ctx = $oewr.$ctx || ($oewr.$ctx = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $pages;
    (function ($pages) {
        /** Defines a page. */
        var Page = /** @class */ (function () {
            /** Initializes the page. */
            function Page(name, pageCnt, wait) {
                this.name = name;
                this.pageCnt = pageCnt;
                this.pageCnt.data("page", this);
                if (this.pageCnt.hasClass("init-ui")) {
                    $oewr.$ui.init(this.pageCnt);
                    this.pageCnt.removeClass("init-ui");
                }
            }
            /** Returns whether the page is the current visible one. */
            Page.prototype.isCurrent = function () {
                return this.pageCnt.hasClass("current");
            };
            /** Returns whether the page is hidden. */
            Page.prototype.isHidden = function () {
                return this.pageCnt.hasClass("hidden");
            };
            /** Returns the default back url for the current page. */
            Page.prototype.defaultBack = function () {
                return this.pageCnt.attr("back");
            };
            Page.prototype.remOffset = function (offset) {
                if (offset === null)
                    this.pageCnt.removeAttr("offset");
                else if (offset !== undefined)
                    this.pageCnt.attr("offset", offset);
                else {
                    var attr = this.pageCnt.attr("offset");
                    if (attr != null)
                        return parseInt(attr);
                    return null;
                }
            };
            /** Called when the page gets loaded. */
            Page.prototype.load = function (wait, args) {
                if (wait)
                    wait.resolve(this);
            };
            return Page;
        }());
        $pages.Page = Page;
    })($pages = $oewr.$pages || ($oewr.$pages = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $pages;
    (function ($pages) {
        /** Main page. */
        var PageMain = /** @class */ (function (_super) {
            __extends(PageMain, _super);
            /** Initializes the page */
            function PageMain(name, pageCnt, wait) {
                var _this = _super.call(this, name, pageCnt, wait) || this;
                // init ui
                $oewr.$ui.initCommon();
                $oewr.$ui.init(pageCnt, { setHashOnScroll: Modernizr.history });
                // ready
                wait.resolve(_this);
                return _this;
            }
            return PageMain;
        }($pages.Page));
        $pages.PageMain = PageMain;
    })($pages = $oewr.$pages || ($oewr.$pages = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $pages;
    (function ($pages) {
        /** Timeline page. */
        var PageEvents = /** @class */ (function (_super) {
            __extends(PageEvents, _super);
            /** Initializes the page */
            function PageEvents(name, pageCnt, wait) {
                var _this = _super.call(this, name, pageCnt, wait) || this;
                // get timeline element
                _this.timelineCnt = $("#event-timeline");
                // wait for meta/events
                $oewr.$data.waitEvents.done(function () {
                    // init timeline
                    _this.initTimeline(true);
                    // ready
                    wait.resolve(_this);
                })
                    .fail(function () { wait.reject(); });
                // reinit on data or session change
                $oewr.$data.change(function () { _this.initTimeline(false); });
                return _this;
            }
            /** Loads the timeline page */
            PageEvents.prototype.load = function (wait) {
                // init blocks on first load
                if (!this.timeline.hasBlocks())
                    this.timeline.initBlocks();
                // show/hide blocks
                this.timeline.refreshBlocks();
                // loaded
                wait.resolve(this);
            };
            /** Initializes the event search form. */
            PageEvents.prototype.initForm = function () {
                var _this = this;
                // init ui
                $oewr.$ui.init($("form", this.pageCnt));
                // init from date
                $("input#event-from-date", this.pageCnt).val((new Date()).toISOString().substr(0, 10));
                // init tour select
                var typeSelect = $("select#event-type", this.pageCnt);
                $q($oewr.$res.eventTypes).ForEach(function (x) {
                    var type = $oewr.MTBEventTypes[x.Key];
                    typeSelect.append('<option value="' + type.id + '">' + type.description + '</option>');
                });
                // set change event
                $("input,select", this.pageCnt).change(function () { return _this.filterTimeline(); });
            };
            PageEvents.prototype.initTimeline = function (initial) {
                // append events
                this.appendEvents();
                // init ui, search form and timeline
                $oewr.$ui.init(this.timelineCnt.parent());
                if (initial)
                    this.initForm();
                this.timeline = this.timelineCnt.timeline();
                this.filterTimeline();
            };
            /** Appends all events. */
            PageEvents.prototype.appendEvents = function () {
                var _this = this;
                this.timelineCnt.empty();
                this.timelineItems = $q($oewr.$data.events).Where(function (ev) { return ev.isOccurrence() && (ev.status() == $oewr.MTBEventStatus.TakesPlace || $oewr.$ctx.session.isAdmin()); }).Select(function (ev) { return ({
                    event: ev,
                    item: _this.getTimelineItem(ev)
                }); }).ToArray();
                this.timelineCnt.append($q(this.timelineItems).Select(function (x, i) { return x.item.toggleClass("even", i % 2 != 0); }).ToArray());
            };
            /** Filters the events by the criteria specified in the search form. */
            PageEvents.prototype.filterTimeline = function () {
                var v;
                var fromDate = (v = $("#event-from-date").val()) ? moment(v) : null;
                var toDate = (v = $("#event-to-date").val()) ? moment(v) : null;
                var type = $("#event-type").val();
                var level = $oewr.MTBLevel.Everyone
                    | ($("#event-level-beginner").is(":checked") ? $oewr.MTBLevel.Beginner : $oewr.MTBLevel.Everyone)
                    | ($("#event-level-advanced").is(":checked") ? $oewr.MTBLevel.Advanced : $oewr.MTBLevel.Everyone);
                var visible = 0;
                $q(this.timelineItems).ForEach(function (x) {
                    var ev = x.event;
                    var hide = fromDate && ev.from() < fromDate
                        || toDate && ev.to() > toDate
                        || type && type != "all" && ev.typeId() != type
                        || level < $oewr.MTBLevel.All && ev.level() != $oewr.MTBLevel.Everyone && (ev.level() & level) == 0;
                    x.item.toggleClass("hidden", hide);
                    if (!hide) {
                        x.item.toggleClass("even", visible % 2 != 0).toggleClass("first-child", visible == 0);
                        visible++;
                    }
                });
                // show/hide blocks
                this.timeline.refreshBlocks();
            };
            /** Returns a timeline item. */
            PageEvents.prototype.getTimelineItem = function (event) {
                var price = event.priceText();
                var eventUrl = $oewr.$res.events.eventUrl.format(event.eventId());
                var editUrl = "#/cmd/edit-event?id=" + event.eventId();
                return $('<div class="timeline-block" eventId="' + event.eventId() + '">' +
                    '<div class="timeline-img bg-color-' + this.getLevelColor(event) + '" title="' + event.type().name + '">' +
                    '<span class="icon style2 major ' + event.type().icon + '"></span>' +
                    '</div>' +
                    '<div class="timeline-content">' +
                    '<h3>' + event.name() + '<br /><code><span class="icon fa-money"></span> ' + price + '</code></h3>' +
                    '<p>' +
                    '<img src="' + event.img() + '" />' +
                    '<strong>' +
                    $oewr.$util.formatFromTo(event.from(), event.to(), $oewr.$res.events.dateFormat, $oewr.$res.events.multiDayFormat) +
                    "<br />" + $oewr.$res.events.level + ": " + $oewr.$res.level[$oewr.MTBLevel[event.level()]] +
                    '</strong><br /><br />' +
                    event.shortDescription() +
                    '</p><br style="clear: both;" />' +
                    '<a href="' + eventUrl + '" class="button special icon fa-pencil">' + $oewr.$res.events.details + '</a> ' +
                    '<a href="' + editUrl + '" class="button icon fa-pencil role-admin">' + $oewr.$res.events.edit + '</a>' +
                    '<span class="date">' + $oewr.$util.formatDate(event.from(), $oewr.$res.events.fromFormat) + '</span>' +
                    '</div>' +
                    '</div>').data("event", event);
            };
            /** Returns the color for the specified event's level. */
            PageEvents.prototype.getLevelColor = function (event) {
                switch (event.level()) {
                    case $oewr.MTBLevel.Beginner: return "green";
                    case $oewr.MTBLevel.Advanced: return "orange";
                    default: return "blue";
                }
            };
            return PageEvents;
        }($pages.Page));
        $pages.PageEvents = PageEvents;
    })($pages = $oewr.$pages || ($oewr.$pages = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $pages;
    (function ($pages) {
        /** Event page. */
        var PageEvent = /** @class */ (function (_super) {
            __extends(PageEvent, _super);
            /** Initializes the page */
            function PageEvent(name, pageCnt, wait) {
                var _this = _super.call(this, name, pageCnt, wait) || this;
                // wait for meta/events
                $oewr.$data.waitEvents.done(function () {
                    // init ui
                    $oewr.$ui.init(pageCnt);
                    // init submit button
                    $("#reg-submit").click(function (e) {
                        e.preventDefault();
                        var reg = _this.validateReg();
                        if (reg) {
                            $oewr.$ui.loader.show();
                            grecaptcha.reset();
                            _this.recaptcha = $.Deferred();
                            _this.recaptcha.done(function (token) { _this.submitReg(token, reg); });
                            grecaptcha.execute(); // execute recaptcha
                        }
                    });
                    // wait for map ready
                    $(".map", _this.pageCnt).data("gmap_promise").done(function () {
                        // get map marker
                        _this.mapMarker = $(".map", _this.pageCnt).data("gmap_markers")[0];
                        // ready
                        wait.resolve(_this);
                    });
                });
                return _this;
            }
            /** Called when the page gets loaded. */
            PageEvent.prototype.load = function (wait) {
                var _this = this;
                // get url args
                var eventId = parseInt($oewr.$url.args.id);
                // check if eventId and date is set
                if (!eventId) {
                    if (wait)
                        wait.reject("Missing eventId and/or date!");
                    return;
                }
                // get event
                var event = this.event = $oewr.$data.eventMap.Get(eventId);
                if (!event) {
                    if (wait)
                        wait.reject("Event not found for '" + $oewr.$url.hash + "'!");
                    return;
                }
                // load registrations
                $oewr.$ctx.getRegistrations(eventId).done(function (res) {
                    // set registrations and count
                    _this.registrations = res.registrations;
                    _this.regcount = res.count || 0;
                    // init details and reg form
                    _this.initUI(event);
                    // ready
                    if (wait)
                        wait.resolve(_this);
                });
            };
            /** Initialiazes the event */
            PageEvent.prototype.initUI = function (event) {
                this.initDetails(event);
                this.initRegForm(event);
            };
            /** Initializes the event details with the specified event data. */
            PageEvent.prototype.initDetails = function (event) {
                var _this = this;
                var res = $oewr.$res.event.details;
                var get = function (n) { return $(".event-" + n, _this.pageCnt); };
                // set name
                get("name").text(event.name());
                // set description
                get("description").text(event.description());
                // set image
                get("img").attr("src", event.img());
                // set date
                var dateStr = $oewr.$util.formatFromTo(event.from(), event.to(), $oewr.$res.event.details.dateFormat);
                get("date").html(res.date.format(dateStr));
                // set level
                get("level").html(res.level.format(event.levelDescription()));
                // set meeting point
                var startTime = event.from().format(res.meetingTimeFormat);
                get("meeting").html(res.meeting.format(startTime, event.meetingPointDescription()));
                // set max participants
                get("participants").html(res.participants.format(event.maxParticipants()));
                // set price
                var price = event.isErlebniscard() ? res.erlebniscardPrice : res.price.format(event.priceAsNr());
                get("price").html(price);
                // set map marker
                this.mapMarker.setPosition(new google.maps.LatLng(event.lat(), event.lng()));
                // set access classes
                this.pageCnt.toggleClass("erlebniscard", event.isErlebniscard());
                this.pageCnt.toggleClass("allow-reg", event.isRegAllowed());
                // set requirements
                this.setRequirements(event);
            };
            /** Sets the requirements for the specified event. */
            PageEvent.prototype.setRequirements = function (event) {
                var requirements = [];
                var lines = $q((event.requirements() || "").split("\n")).Select(function (x) { return x.trim(); }).ToArray();
                var addDefault = lines[0] != "!";
                var text = $q(lines).FirstOrDefault(null, function (x) { return x[0] != "*"; }) || $oewr.$res.requirements[event.type().name].text;
                var customReq = $q(lines).Where(function (x) { return x[0] == "*"; }).ToArray();
                // add default requirements
                if (addDefault) {
                    var i = 0;
                    while (true) {
                        var dreq = $oewr.$res.requirements[event.type().name][i.toString()];
                        if (!dreq)
                            break;
                        requirements.push(dreq);
                        i++;
                    }
                }
                else if (customReq[0] == "!")
                    customReq = $q(customReq).Skip(1).ToArray();
                // add custom requirements
                requirements = requirements.concat(customReq);
                // set text
                $(".event-requirements-text", this.pageCnt).html($oewr.$util.formatMd(text));
                // set requirements
                $(".event-requirements", this.pageCnt).empty().append($q(requirements).Select(function (r) { return $("<li>" + $oewr.$util.formatMd($oewr.$util.trimStart(r, "*").trim()) + "</li>"); }).ToArray());
            };
            PageEvent.prototype.initRegForm = function (event) {
                var _this = this;
                // set remaining regs
                var remainingLbl = $("#reg-remaining", this.pageCnt);
                var remaining = Math.max(0, event.maxParticipants() - this.regcount);
                remainingLbl.text(remaining);
                this.pageCnt.toggleClass("regs-remaining", remaining > 0);
                // prefill phone and accomodation for partners
                if ($oewr.$ctx.session.isPartner()) {
                    var cur = $oewr.$ctx.session.profile;
                    $("#reg-email", this.pageCnt).val(cur.email);
                    $("#reg-phone", this.pageCnt).val(cur.phone);
                    $("#reg-accommodation", this.pageCnt).val(cur.name);
                }
                // set reg table
                this.pageCnt.toggleClass("see-regs", this.registrations != null);
                var table = $("section.registrations table tbody", this.pageCnt);
                table.empty().append($q(this.registrations).Select(function (x, i) { return _this.getRegRow(x, i); }).ToArray());
            };
            /** Returns a registration row. */
            PageEvent.prototype.getRegRow = function (reg, idx) {
                var _this = this;
                var res = $oewr.$res.event.details;
                var isOwnReg = $oewr.$ctx.session.isAdmin() || $oewr.$ctx.session.isPartner() && reg.createdBy === $oewr.$ctx.session.current.email;
                var isValid = (idx + 1) <= this.event.maxParticipants();
                var isActive = reg.status == $oewr.MTBRegistrationStatus.Active;
                var setStatus = isActive ? $oewr.MTBRegistrationStatus.Canceled : $oewr.MTBRegistrationStatus.Active;
                var setType = isActive ? "cancel" : "reactivate";
                return $("<tr>").toggleClass("error", !isValid).toggleClass("canceled", !isActive)
                    .append($("<td>").text(moment(reg.created).format(res.regDateFormat)).attr("title", res.regBy.format(reg.createdBy)), $("<td>").text(reg.name), $("<td>").text(reg.email), $("<td>").text(reg.phone), $("<td>").text(reg.age || "***"), $("<td>").text(reg.accommodation), $("<td>").append(
                // cancel button
                $("<a>").addClass("icon style2 " + (isActive ? "fa-close" : "fa-check role-admin")).attr("title", res[setType + "Reg"]).toggleClass("disabled", !isOwnReg)
                    .click(function () {
                    $oewr.$cmd.exec("delete-registration", $.extend({}, reg, { force: false, status: setStatus })).done(function () {
                        reg.status = setStatus;
                        if (setStatus == $oewr.MTBRegistrationStatus.Canceled)
                            _this.regcount--;
                        else
                            _this.regcount++;
                        _this.initRegForm(_this.event);
                    });
                }), 
                // delete button
                $("<a>").addClass("icon style2 fa-trash role-admin").attr("title", res.deleteReg).toggleClass("disabled", !isOwnReg)
                    .click(function () {
                    $oewr.$cmd.exec("delete-registration", $.extend({}, reg, { force: true })).done(function () {
                        _this.registrations = $q(_this.registrations).Where(function (x) { return x.regId != reg.regId; }).ToArray();
                        _this.regcount--;
                        _this.initRegForm(_this.event);
                    });
                })));
            };
            /** Gets the registration data from the form. */
            PageEvent.prototype.getReg = function () {
                var _this = this;
                var reg = {};
                var get = function (n) { return $("#reg-" + n, _this.pageCnt).val().trim() || null; };
                reg.eventId = this.event.eventId();
                reg.name = get("name");
                reg.email = get("email");
                reg.phone = get("phone");
                reg.age = parseInt(get("age")) || 0;
                reg.accommodation = get("accommodation");
                reg.status = $oewr.MTBRegistrationStatus.Active;
                return reg;
            };
            /** Validates the registration input. */
            PageEvent.prototype.validateReg = function () {
                var _this = this;
                var reg = this.getReg();
                var required = function (n) { return $("#reg-" + n, _this.pageCnt).toggleClass("error", reg[n] == null); };
                required("name");
                required("email");
                required("phone");
                var agreementChb = $("#reg-agreement", this.pageCnt);
                var agreed = agreementChb.is(":checked");
                agreementChb.toggleClass("error", !agreed);
                if ($("input.error", this.pageCnt).length > 0)
                    return null;
                return reg;
            };
            /** Validates the registration input. */
            PageEvent.prototype.submitReg = function (token, reg) {
                var _this = this;
                var email = {
                    template: "registration_" + $oewr.$cfg.lang,
                    to: [{ name: reg.name, email: reg.email }],
                    bcc: $oewr.$cfg.email.bcc || [],
                    location_origin: location.origin
                };
                // add current user to bcc
                var cur = $oewr.$ctx.session.current;
                if (cur && cur.email && !$q(email.bcc).Any(function (x) { return x.email == cur.email; }))
                    email.bcc.push({ name: cur.first_name + " " + cur.last_name, email: cur.email });
                $oewr.$ctx.register(reg, token, email)
                    .always(function () { return $oewr.$ui.loader.hide(); })
                    .done(function (newReg) {
                    // add reg
                    if (_this.registrations)
                        _this.registrations.push(newReg); // only add if allowed to see
                    _this.regcount++;
                    _this.initUI(_this.event);
                    _this.setRegMsg($oewr.$res.event.details.regSuccess, false);
                })
                    .fail(function (err) {
                    _this.setRegMsg($oewr.$res.event.details.regFail, true);
                });
            };
            PageEvent.prototype.setRegMsg = function (msg, err) {
                $("p.msg", this.pageCnt).toggleClass("error", err).toggleClass("success", !err).text(msg);
            };
            return PageEvent;
        }($pages.Page));
        $pages.PageEvent = PageEvent;
    })($pages = $oewr.$pages || ($oewr.$pages = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $pages;
    (function ($pages) {
        /** Event page. */
        var PageEventEdit = /** @class */ (function (_super) {
            __extends(PageEventEdit, _super);
            /** Initializes the page */
            function PageEventEdit(name, pageCnt, wait) {
                var _this = _super.call(this, name, pageCnt, wait) || this;
                var that = _this;
                // init input fields
                var inputs = ["type", "level", "name-de", "name-en",
                    "short-descr-de", "short-descr-en", "descr-de", "descr-en",
                    "requirements-de", "requirements-en", "from", "to"];
                $q(inputs).ForEach(function (x) { _this[x.replace(/-/g, "_")] = _this.input(x); });
                // init images
                _this.img = $(".event-img", pageCnt).click(function () {
                    $(".event-img.selected", pageCnt).removeClass("selected");
                    $(this).addClass("selected");
                });
                // init dates table
                _this.input("from").change(function () { that.copyFromDate($(this)); });
                _this.datesTbl = $("table.dates", pageCnt);
                $("a.add-date", _this.datesTbl).click(function () { return _this.addDate(); });
                // init save button
                $("a.button.save", _this.pageCnt).click(function () {
                    _this.save();
                });
                // init ui
                $oewr.$ui.init(pageCnt);
                // wait for map ready
                $(".map", _this.pageCnt).data("gmap_promise").done(function () {
                    // get map marker
                    _this.mapMarker = $(".map", _this.pageCnt).data("gmap_markers")[0];
                    // ready
                    wait.resolve(_this);
                });
                return _this;
            }
            /** Called when the page gets loaded. */
            PageEventEdit.prototype.load = function (wait) {
                //get/set page mode
                this.pageCnt.attr("mode", this.mode = $oewr.$url.dest || "edit");
                // get edit event
                if (this.mode == "edit") {
                    // ger event id
                    var eventId = parseInt($oewr.$url.args.id);
                    if (eventId == null || isNaN(eventId))
                        return wait.reject("Missing event id!");
                    // get event
                    this.event = $oewr.$data.eventMap.Get(eventId);
                    if (!this.event)
                        return wait.reject("Missing event " + eventId);
                }
                else
                    this.event = new $oewr.MTBEvent({});
                // get series
                this.series = this.event.series();
                // init fields
                this.initInputFields(this.event);
                // ready
                if (wait)
                    wait.resolve(this);
            };
            PageEventEdit.prototype.isSeries = function () {
                return this.series === this.event;
            };
            PageEventEdit.prototype.initInputFields = function (event) {
                this.input("name-de").val(event.name_de());
                this.input("name-en").val(event.name_en());
                var type = event.type() || $oewr.MTBEventTypes.TechniqueTraining;
                this.input("type").val(type.name);
                var status = event.status() || $oewr.MTBEventStatus.TakesPlace;
                this.input("status").val($oewr.MTBEventStatus[status]);
                var level = event.level();
                this.input("level", "[value=" + $oewr.MTBLevel[level] + "]").click();
                this.input("price-type", "[value=" + (event.isErlebniscard() ? "erlebniscard" : "price") + "]").click();
                if (!event.isErlebniscard())
                    this.input("price").val(parseInt(event.price()));
                this.input("max-participants").val(event.maxParticipants() || (this.mode == "add" ? 6 : 0));
                this.input("allow-reg").val(event.allowReg().toString());
                this.input("short-descr-de").val(event.shortDescription_de());
                this.input("short-descr-en").val(event.shortDescription_en());
                this.input("descr-de").val(event.description_de());
                this.input("descr-en").val(event.description_en());
                this.input("requirements-de").val(event.requirements_de());
                this.input("requirements-en").val(event.requirements_en());
                var img = event.img(false);
                $(".event-img" + (img ? "[value='" + img + "']" : ".first"), this.pageCnt).click();
                this.input("meeting-point-description").val(event.meetingPointDescription());
                var latLng = new google.maps.LatLng(event.lat(), event.lng());
                this.mapMarker.setPosition(latLng);
                var from = event.from();
                if (from)
                    this.input("from").val(from.format("YYYY-MM-DDTHH:mm"));
                var to = event.to();
                if (to)
                    this.input("to").val(to.format("YYYY-MM-DDTHH:mm"));
                this.occurrences = event.occurrences();
                $("table.dates tbody", this.pageCnt).toggle(this.isSeries());
                $(".add-date", this.pageCnt).toggle(this.isSeries());
                $(".button.edit-series", this.pageCnt).attr("href", "#/event/edit?id=" + event.parentId()).toggle(event.parentId() != null);
                $(".button.delete", this.pageCnt).click(function () {
                    // exec delete event cmd
                    $oewr.$cmd.exec("delete-event", { id: event.eventId() }).done(function () {
                        // goto events page
                        $oewr.$app.hashChange("#/events");
                    });
                });
                this.refreshDatesTbl();
            };
            /** Adds the date from the event date row. */
            PageEventEdit.prototype.addDate = function () {
                var from = moment(this.from.val());
                var to = moment(this.to.val());
                if (!from.isValid())
                    return alert("Invalid from date!");
                if (!to.isValid())
                    return alert("Invalid to date!");
                if ($q(this.occurrences).Any(function (x) { return x.from().isSame(from) && x.to().isSame(to) && x.status() != $oewr.MTBEventStatus.Deleted; }))
                    return alert("Duplicate date");
                // try get existing deleted occurence
                var existing = $q(this.series.occurrences()).FirstOrDefault(null, function (x) { return x.from().isSame(from) && x.to().isSame(to); });
                if (existing)
                    existing.state.status = $oewr.MTBEventStatus.TakesPlace;
                this.occurrences.push(existing || new $oewr.MTBEvent({
                    from: from.toISOString(),
                    to: to.toISOString()
                }));
                this.refreshDatesTbl();
            };
            /** Refreshes the dates table. */
            PageEventEdit.prototype.refreshDatesTbl = function () {
                var _this = this;
                // dates should occur only once
                this.occurrences = $q(this.occurrences).Distinct(function (x) { return x.from().toISOString() + "-" + x.to().toISOString(); }).ToArray();
                var tbody = $("tbody", this.datesTbl).empty();
                $q(this.occurrences).OrderBy(function (x) { return x.from(); }).ForEach(function (x) {
                    if (x.status() != $oewr.MTBEventStatus.Deleted)
                        tbody.append(_this.getDateRow(x));
                });
            };
            PageEventEdit.prototype.getDateRow = function (occurrence) {
                var _this = this;
                var row;
                var that = this;
                return (row = $("<tr>")).data("event", occurrence).append(
                // from date
                $("<td>").addClass("event-from").text(occurrence.from().format($oewr.$res.event.edit.dateFormat)).change(function () { that.copyFromDate($(this)); }), 
                // to date
                $("<td>").addClass("event-to").text(occurrence.to().format($oewr.$res.event.edit.dateFormat)), 
                // buttons
                $("<td>").append(
                // repeat next week button
                $("<a>").addClass("icon style2 fa-repeat").attr("title", $oewr.$res.event.edit.repeat).click(function () {
                    _this.from.val(occurrence.from().clone().add(7, "days").format("YYYY-MM-DDTHH:mm"));
                    _this.to.val(occurrence.to().clone().add(7, "days").format("YYYY-MM-DDTHH:mm"));
                    _this.addDate();
                    _this.refreshDatesTbl();
                }), 
                // edit button
                $("<a>").addClass("icon style2 fa-pencil mode-edit").click(function () {
                    $oewr.$app.hashChange($oewr.$res.event.edit.occurrenceUrl.format(occurrence.eventId()));
                }), 
                // remove button
                $("<a>").addClass("icon style2 fa-minus").click(function () {
                    // set deleted
                    occurrence.state.status = $oewr.MTBEventStatus.Deleted;
                    // refresh dates table
                    _this.refreshDatesTbl();
                })));
            };
            /** Copies the from-date to the to-date input field. */
            PageEventEdit.prototype.copyFromDate = function (from) {
                var val = from.val();
                if (!val)
                    return;
                var type = $oewr.MTBEventTypes[this.input("type").val()];
                from.parent().next().find("input[name=event-to]").val(moment(val).add(type.duration, "hours").format("YYYY-MM-DDTHH:mm"));
            };
            /** Gets the specified input element by name. */
            PageEventEdit.prototype.input = function (name, state) {
                return $("[name=event-" + name + "]" + (state || ""), this.pageCnt);
            };
            /** Returns the event object from the input. */
            PageEventEdit.prototype.getState = function () {
                if (this.isSeries() && this.occurrences.length == 0)
                    return null;
                var state;
                if (this.isSeries())
                    state = this.series ? this.series.state : { parentId: null, from: null, to: null };
                else {
                    state = this.event.state;
                    state.from = moment(this.from.val()).format("YYYY-MM-DDTHH:mm");
                    state.to = moment(this.to.val()).format("YYYY-MM-DDTHH:mm");
                }
                state.type = $oewr.MTBEventTypes[this.input("type").val()].id;
                state.status = $oewr.MTBEventStatus[this.input("status").val()];
                state.name = this.input("name-de").val();
                state.name_en = this.input("name-en").val();
                state.shortDescription = this.input("short-descr-de").val();
                state.shortDescription_en = this.input("short-descr-en").val();
                state.description = this.input("descr-de").val();
                state.description_en = this.input("descr-en").val();
                state.requirements = this.input("requirements-de").val();
                state.requirements_en = this.input("requirements-en").val();
                state.price = this.getPrice();
                state.max_participants = parseInt(this.input("max-participants").val());
                state.allow_reg = parseInt(this.input("allow-reg").val()) || 0;
                state.level = $oewr.MTBLevel[this.input("level", ":checked").val()];
                state.img = $(".event-img.selected", this.pageCnt).attr("value");
                state.meeting = this.getMeetingPoint();
                return state;
            };
            /** Returns all event occurences. */
            PageEventEdit.prototype.getOccurrences = function (series) {
                return $q(this.occurrences).Select(function (x) {
                    x.state.parentId = series.eventId();
                    return x.state;
                }).ToArray();
            };
            /** Gets the price. */
            PageEventEdit.prototype.getPrice = function () {
                var type = this.input("price-type", ":checked").val();
                if (type == "erlebniscard")
                    return $oewr.MTBEvent.ErlebniscardPrice;
                return this.input("price").val();
            };
            /** Gets the meeting point. */
            PageEventEdit.prototype.getMeetingPoint = function () {
                var pos = this.mapMarker.getPosition();
                var descr = this.input("meeting-point-description").val();
                return pos.lat() + "/" + pos.lng() + "/" + descr;
            };
            /** Saves (inserts or updates) the event. */
            PageEventEdit.prototype.save = function () {
                var _this = this;
                // check if date has been added
                if (this.occurrences.length == 0 && this.input("from").val() && this.input("to").val())
                    $("a.add-date", this.pageCnt).click();
                // get series state
                var state = this.getState();
                // show loader
                $oewr.$ui.loader.show();
                // insert/update main event
                $oewr.$ctx.db.event[this.mode == "add" ? "insert" : "update"](state).done(function (event) {
                    // saved single event
                    if (!_this.isSeries()) {
                        $oewr.$ui.loader.hide(); // hide loader
                        $oewr.$data.change(); // trigger data change event
                        // go to edit page
                        if (_this.mode == "add")
                            $oewr.$app.hashChange("#/event/edit?id=" + event.eventId());
                        return;
                    }
                    // else saved series
                    // insert/update/delete other occurences
                    var occurences = _this.getOccurrences(event);
                    var insert = $q(occurences).Where(function (x) { return x.eventId == null || x.eventId == 0; }).ToArray();
                    var update = $q(occurences).Where(function (x) { return x.eventId != null; }).ToArray();
                    $.when(insert.length ? $oewr.$ctx.db.event.insert(insert) : $.Deferred().resolve().promise(), update.length ? $oewr.$ctx.db.event.update(update) : $.Deferred().resolve().promise()).done(function (created, updated) {
                        // add events to data
                        if (_this.mode == "add")
                            created = [event].concat(created);
                        if (created && created.length)
                            $oewr.$data.addEvent(created);
                        else
                            $oewr.$data.change(); // trigger data change event
                        // go to edit page
                        if (_this.mode == "add")
                            $oewr.$app.hashChange("#/event/edit?id=" + event.eventId());
                    })
                        .always(function () { $oewr.$ui.loader.hide(); }); // hide loader
                }).fail(function () { $oewr.$ui.loader.hide(); }); // hide loader
            };
            return PageEventEdit;
        }($pages.Page));
        $pages.PageEventEdit = PageEventEdit;
    })($pages = $oewr.$pages || ($oewr.$pages = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $pages;
    (function ($pages) {
        /** Main page. */
        var PageSignin = /** @class */ (function (_super) {
            __extends(PageSignin, _super);
            /** Initializes the page */
            function PageSignin(name, pageCnt, wait) {
                var _this = _super.call(this, name, pageCnt, wait) || this;
                // init ui
                $oewr.$ui.init(pageCnt);
                _this.signInBtn = $("#signin-btn", pageCnt).click(function (e) {
                    if (e)
                        e.preventDefault();
                    _this.signIn();
                });
                _this.email = $("#signin-email", _this.pageCnt);
                _this.pwd = $("#signin-pwd", _this.pageCnt);
                _this.errorLbl = $("#signin-error", _this.pageCnt);
                // ready
                wait.resolve(_this);
                return _this;
            }
            PageSignin.prototype.signIn = function () {
                var _this = this;
                // signin
                $oewr.$ui.loader.show();
                $oewr.$cmd.exec("signin", {
                    email: this.email.val(),
                    pwd: this.pwd.val(),
                    "return": $oewr.$url.args ? $oewr.$url.args["return"] : null
                })
                    .always(function () {
                    // hide loader and empty form
                    $oewr.$ui.loader.hide();
                    _this.email.val("");
                    _this.pwd.val("");
                })
                    .done(function () {
                    // hide error
                    _this.errorLbl.addClass("hidden");
                })
                    .fail(function (jqXHR, status, err) {
                    // set error
                    _this.errorLbl.text(err).removeClass("hidden");
                });
            };
            return PageSignin;
        }($pages.Page));
        $pages.PageSignin = PageSignin;
    })($pages = $oewr.$pages || ($oewr.$pages = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $pages;
    (function ($pages) {
        /** Main page. */
        var PageAdmin = /** @class */ (function (_super) {
            __extends(PageAdmin, _super);
            /** Initializes the page */
            function PageAdmin(name, pageCnt, wait) {
                var _this = _super.call(this, name, pageCnt, wait) || this;
                // init ui
                $oewr.$ui.init(pageCnt);
                // ready
                wait.resolve(_this);
                return _this;
            }
            /** Called when the page gets loaded. */
            PageAdmin.prototype.load = function (wait) {
                // check if user logged in and admin
                var session = $oewr.$ctx.session.current;
                if (!session || session.role_id != $oewr.Roles.Admin) {
                    // redirect to signin
                    wait.reject({ redirect: "#/signin?return=/admin" });
                    return;
                }
                // ready
                wait.resolve(this);
            };
            return PageAdmin;
        }($pages.Page));
        $pages.PageAdmin = PageAdmin;
    })($pages = $oewr.$pages || ($oewr.$pages = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $pages;
    (function ($pages) {
        /** Main page. */
        var PageChoice = /** @class */ (function (_super) {
            __extends(PageChoice, _super);
            /** Initializes the page */
            function PageChoice(name, pageCnt, wait) {
                var _this = _super.call(this, name, pageCnt, wait) || this;
                // init title, text
                _this.title = $("h2.title", _this.pageCnt);
                _this.text = $("p.text", _this.pageCnt);
                // ready
                wait.resolve(_this);
                return _this;
            }
            /** Called when the page gets loaded. */
            PageChoice.prototype.load = function (wait, args) {
                var _this = this;
                // init result promise
                this._result = $.Deferred();
                this.result = this._result.promise();
                // set title and text
                if (!args)
                    args = $oewr.$url.args;
                this.title.text(args.title);
                this.text.text(args.text);
                // add buttons
                var actions = $(".actions", this.pageCnt).empty();
                $q(args.items).ForEach(function (it) {
                    var val = it.Key;
                    var text = it.Value;
                    var item = $("<li>").appendTo(actions);
                    var btn = $("<a>").addClass("button special").text(text).appendTo(item).click(function () {
                        // resolve with val
                        _this._result.resolve(val);
                    });
                });
                // append cancel button
                actions.append($('<li><a href="#poppage" class="button cancel special icon fa-close">' + $oewr.$res.common.cancel + '</a></li>'));
                // init links
                $oewr.$ui.link.init(this.pageCnt);
                // ready
                wait.resolve(this);
            };
            return PageChoice;
        }($pages.Page));
        $pages.PageChoice = PageChoice;
    })($pages = $oewr.$pages || ($oewr.$pages = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $pages;
    (function ($pages) {
        /** Main page. */
        var PageConfirm = /** @class */ (function (_super) {
            __extends(PageConfirm, _super);
            /** Initializes the page */
            function PageConfirm(name, pageCnt, wait) {
                var _this = _super.call(this, name, pageCnt, wait) || this;
                // init ui
                $oewr.$ui.init(pageCnt);
                // init title, text, buttons
                _this.title = $("h2.title", _this.pageCnt);
                _this.text = $("p.text", _this.pageCnt);
                _this.okBtn = $(".button.ok", _this.pageCnt).click(function () {
                    if (_this._result)
                        _this._result.resolve(true);
                });
                _this.cancelBtn = $(".button.cancel", _this.pageCnt).click(function () {
                    if (_this._result)
                        _this._result.resolve(false);
                });
                // ready
                wait.resolve(_this);
                return _this;
            }
            /** Called when the page gets loaded. */
            PageConfirm.prototype.load = function (wait, args) {
                // get args
                if (!args)
                    args = $oewr.$url.args || {};
                var res = args.res;
                if (res) {
                    res = $oewr.$util.expandPath($oewr.$res, res);
                    if (res.title)
                        args.title = res.title;
                    if (res.text)
                        args.text = res.text;
                    if (res.ok)
                        args.ok = res.ok;
                    if (res.cancel)
                        args.cancel = res.cancel;
                }
                // init result promise
                this._result = $.Deferred();
                this.result = this._result.promise();
                // set title, text, buttons
                $("h2", this.pageCnt).text((args.title || "").format(args));
                $("p", this.pageCnt).text((args.text || "").format(args));
                this.okBtn.attr("href", args.ok || "#poppage");
                if (args.cancel)
                    this.cancelBtn.attr("href", args.cancel);
                this.cancelBtn.parent().toggle(args.mode != "info");
                // reinit links
                $oewr.$ui.link.init(this.pageCnt);
                // ready
                wait.resolve(this);
            };
            return PageConfirm;
        }($pages.Page));
        $pages.PageConfirm = PageConfirm;
    })($pages = $oewr.$pages || ($oewr.$pages = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $pages;
    (function ($pages) {
        /** Main page. */
        var PageBlauesband = /** @class */ (function (_super) {
            __extends(PageBlauesband, _super);
            /** Initializes the page */
            function PageBlauesband(name, pageCnt, wait) {
                var _this = _super.call(this, name, pageCnt, wait) || this;
                // init ui
                $oewr.$ui.init(pageCnt);
                // ready
                wait.resolve(_this);
                return _this;
            }
            /** Called when the page gets loaded. */
            PageBlauesband.prototype.load = function (wait) {
                var res = $oewr.$res.blauesband;
                var year = parseInt($oewr.$url.dest) || (new Date()).getFullYear();
                var occurence = year - 1964;
                // set organizational infos
                var el = function (n) { return $(".bb-" + n); };
                el("header").text(res.header.format(occurence));
                el("descr").html(res.description.format(occurence));
                el("date").text($oewr.$util.formatDate(moment($oewr.$util.nthWeekdayOfMonth(0, 1, new Date("2018-08-01"))), res.dateFormat));
                //set classes
                var tbl = $("section.classes table tbody", this.pageCnt);
                tbl.empty();
                $q(res.classes).ForEach(function (c) {
                    var row = $("<tr>").append($("<td>").text(c.name), $("<td>").text((c.from == -1) ? "" : year - c.from), $("<td>").text((c.to == -1) ? "" : year - c.to));
                    tbl.append(row);
                });
                // set poster
                el("poster").attr("src", $oewr.$cfg.root + "img/blauesband/plakat-" + year + ".jpg");
                // ready
                wait.resolve(this);
            };
            return PageBlauesband;
        }($pages.Page));
        $pages.PageBlauesband = PageBlauesband;
    })($pages = $oewr.$pages || ($oewr.$pages = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $pages;
    (function ($pages) {
        var waiting = {};
        var pages = {};
        /** Gets the page stack. */
        $pages.stack = [];
        /** Loads the specified page. */
        function load(name, preload, args) {
            // check if page exists
            var pageInfo = $oewr.$cfg.pages[name];
            if (pageInfo == null)
                return $.Deferred().reject("Missing page " + name).fail(function (err) { fail(err, name, preload); }).promise();
            if (!$oewr.$ctx.session.granted("page/" + name)) {
                if (preload)
                    return $.Deferred().reject("Unauthorized page preload " + name).promise();
                return $.Deferred().reject("Unauthorized page load " + name).fail(function (err) { fail(err, name, preload); }).promise();
            }
            // check if page is synonym
            if (pageInfo.synname)
                return load(pageInfo.synname, preload);
            // already waiting?
            var wait = waiting[name];
            // not already waiting
            if (!wait) {
                // create promise
                var df = $.Deferred().fail(function (err) { fail(err, name, preload); });
                wait = df.promise();
                // get page
                var page = get(name);
                var ctor;
                // does page and ctor exist?
                if (!page && !(ctor = getCtor(name)))
                    return df.reject().promise(); // page and ctor does not exist -> reject
                else if (page)
                    df.resolve(page); // page exists -> page load
                else // page does not exist -> init page befor load
                 {
                    if (!preload)
                        $oewr.$ui.loader.show();
                    getPageCnt(name).then(function (pageCnt) {
                        // create page
                        page = pages[name] = new ctor(name, pageCnt, df);
                        if (ctor == $pages["Page"])
                            df.resolve(page); // default page -> resolve
                    }, function () { df.reject(); });
                }
            }
            // load page
            // it's necessary to remember the promise to prevent duplicate loading while preloading
            return (waiting[name] = wait.then(function (page) {
                if (!page.load || preload)
                    return page;
                var waitLoad = $.Deferred();
                page.load(waitLoad, args);
                return waitLoad;
            })
                .then(function (page) {
                setCurrentPage(page, preload);
                $oewr.$ui.loader.hide();
                return page;
            })).fail(function (err) { fail(err, name, preload); }); // catch fail
        }
        $pages.load = load;
        function setCurrentPage(page, preload, isBack) {
            // init current page on app start, should be main page
            if (!$pages.current) {
                $pages.current = page;
                if (!isBack)
                    $pages.stack.push($pages.current);
            }
            // hide loader and set current page if not preloading
            if (preload)
                return;
            if ($pages.current != page) {
                // hide old current
                if ($pages.current) {
                    $pages.current.remOffset($oewr.$window.scrollTop()); // remember scroll offset
                    $pages.current.pageCnt.removeClass("current").addClass("hidden");
                    $pages.current.pageCnt.trigger("pagehide");
                }
                // set new current
                ($pages.current = page).pageCnt.addClass("current").removeClass("hidden");
                $pages.current.pageCnt.trigger("pageload");
                // add page to stack
                if (!isBack)
                    $pages.stack.push($pages.current);
            }
            // set back btn
            $oewr.$ui.$backBtn.toggleClass("hidden", $pages.current == get("main") || $pages.current.pageCnt.hasClass("no-back-btn"));
        }
        /** Preloads the specified page. */
        function preload(name) {
            return load(name, true);
        }
        $pages.preload = preload;
        /** Loads the previous page. */
        function back() {
            var wait = $.Deferred();
            if ($pages.stack.length < 2)
                return wait.resolve().promise();
            $pages.stack.pop();
            var prev = $pages.stack[$pages.stack.length - 1];
            if (!prev)
                prev = $pages.get("main");
            setCurrentPage(prev, false, true);
            return $oewr.$ui.scrollToPage(prev, undefined, undefined, "immediate", true, wait);
        }
        $pages.back = back;
        function fail(err, name, preload) {
            $oewr.$ui.loader.hide();
            delete waiting[name];
            // redirect
            if (err && err.redirect)
                return $oewr.$app.hashChange(err.redirect);
            if (!preload)
                $oewr.$app.back();
            console.error("Could not load page " + name + "! " + err);
        }
        /** Gets or loads the specified page container from DOM or Server. */
        function getPageCnt(name) {
            var pageCnt = $("#" + name + ".page");
            if (pageCnt.length > 0)
                return $.Deferred().resolve(pageCnt).promise();
            return $.ajax({
                type: "GET",
                url: "pages/" + name + ".html"
            }).then(function (pageHtml) {
                // any page html?
                if (!pageHtml)
                    pageHtml = '<div id="' + name + '"></div>';
                // append page cnt
                pageCnt = $(pageHtml);
                $oewr.$body.append(pageCnt);
                return pageCnt;
            });
        }
        /** Returns the constructor for the specified page. */
        function getCtor(name) {
            // remove - from name
            var parts = name.split("-");
            name = $q(parts).Select(function (p) { return p[0].toUpperCase() + p.substr(1); }).ToArray().join("");
            return $pages["Page" + name] || $pages.Page;
        }
        /** Gets the specified page container. */
        function get(name) {
            return pages[name];
        }
        $pages.get = get;
        /** Returns whether the specified page exists. */
        function exists(name) {
            return $oewr.$cfg.pages[name] != null;
        }
        $pages.exists = exists;
    })($pages = $oewr.$pages || ($oewr.$pages = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $cmd;
    (function ($cmd) {
        /** Sign out command. */
        var CmdSignin = /** @class */ (function () {
            function CmdSignin() {
            }
            /** Executes the command. */
            CmdSignin.prototype.exec = function (args) {
                // get/check email and pwd
                var hash = args.hash, email = args.email, pwd = args.pwd;
                if (!hash && (!email || !pwd))
                    return $.Deferred().reject("Missing credentials!").promise();
                // get return url
                var returnUrl = args["return"] || "#/";
                // sign in
                $oewr.$ui.loader.show(); // show loader
                return (hash ? $oewr.$ctx.session.hashauth(hash) : $oewr.$ctx.session.signin(email, pwd))
                    .always(function () { $oewr.$ui.loader.hide(); }) // always hide loader
                    .done(function (session) {
                    // set document session classes
                    //$app.setAuthenticated(true);
                    // goto return url
                    return $oewr.$app.hashChange($oewr.$util.ensureStartsWith(returnUrl, "#"));
                })
                    .fail(function (jqXHR, status, err) {
                    // log error
                    console.error(err);
                });
            };
            return CmdSignin;
        }());
        $cmd.CmdSignin = CmdSignin;
    })($cmd = $oewr.$cmd || ($oewr.$cmd = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $cmd;
    (function ($cmd) {
        /** Sign out command. */
        var CmdSignout = /** @class */ (function () {
            function CmdSignout() {
            }
            /** Executes the command. */
            CmdSignout.prototype.exec = function (args) {
                return $oewr.$ctx.session.signout()
                    .always(function () { $oewr.$app.back(); })
                    .done(function () {
                    // set app unauthenticated
                    //$app.setAuthenticated(false);
                });
            };
            return CmdSignout;
        }());
        $cmd.CmdSignout = CmdSignout;
    })($cmd = $oewr.$cmd || ($oewr.$cmd = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $cmd;
    (function ($cmd) {
        /** Sign out command. */
        var CmdAgreeCookies = /** @class */ (function () {
            function CmdAgreeCookies() {
            }
            /** Executes the command. */
            CmdAgreeCookies.prototype.exec = function (args) {
                $oewr.$ctx.session.agreeCookies();
                $oewr.$app.setCookieAgreement(true);
                $oewr.$app.back();
                return $.Deferred().resolve().promise();
            };
            return CmdAgreeCookies;
        }());
        $cmd.CmdAgreeCookies = CmdAgreeCookies;
    })($cmd = $oewr.$cmd || ($oewr.$cmd = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $cmd;
    (function ($cmd) {
        /** Sign out command. */
        var CmdEditEvent = /** @class */ (function () {
            function CmdEditEvent() {
            }
            /** Executes the command. */
            CmdEditEvent.prototype.exec = function (args) {
                // get event id
                var eventId = parseInt(args.id);
                if (eventId == null || isNaN(eventId))
                    return $.Deferred().reject("Missing id!").promise();
                // get event
                var event = $oewr.$data.eventMap.Get(eventId);
                if (!event)
                    return $.Deferred().reject("Missing event with id " + eventId + "!").promise();
                // choose between series and occurrence
                return $oewr.$app.choice($oewr.$res.cmdEditEvent).done(function (res) {
                    var id = res == "series" ? event.seriesId() : event.eventId();
                    $oewr.$app.hashChange("#/event/edit?id=" + id);
                });
            };
            return CmdEditEvent;
        }());
        $cmd.CmdEditEvent = CmdEditEvent;
    })($cmd = $oewr.$cmd || ($oewr.$cmd = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $cmd;
    (function ($cmd) {
        /** Sign out command. */
        var CmdDeleteEvent = /** @class */ (function () {
            function CmdDeleteEvent() {
            }
            /** Executes the command. */
            CmdDeleteEvent.prototype.exec = function (args) {
                // get event id
                var eventId = parseInt(args.id);
                if (eventId == null || isNaN(eventId))
                    return $.Deferred().reject("Missing id!").promise();
                // get event
                var event = $oewr.$data.eventMap.Get(eventId);
                if (!event)
                    return $.Deferred().reject("Missing event with id " + eventId + "!").promise();
                // is series?
                var events = [event];
                if (event.isSeries())
                    events = event.occurrences().concat(event);
                // confirm
                return $oewr.$app.confirm($oewr.$res.cmdDeleteEvent.title, $oewr.$res.cmdDeleteEvent.text, args.ok, args.cancel).done(function (res) {
                    $oewr.$ui.loader.show(); // show loader
                    return $oewr.$ctx.db.event["delete"]($q(events).Select(function (x) { return x.state; }).ToArray())
                        .always(function () { $oewr.$ui.loader.hide(); }) // hide loader
                        .done(function (deleted) {
                        // delete from data
                        $oewr.$data.deleteEvent(deleted);
                        return deleted;
                    });
                });
            };
            return CmdDeleteEvent;
        }());
        $cmd.CmdDeleteEvent = CmdDeleteEvent;
    })($cmd = $oewr.$cmd || ($oewr.$cmd = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $cmd;
    (function ($cmd) {
        /** Sign out command. */
        var CmdDeleteRegistration = /** @class */ (function () {
            function CmdDeleteRegistration() {
            }
            /** Executes the command. */
            CmdDeleteRegistration.prototype.exec = function (args) {
                // get event id
                var reg = args;
                if (!reg || !reg.regId)
                    return $.Deferred().reject("Missing reg!").promise();
                // parse boolean
                if (typeof args.force === "string")
                    args.force = args.force === "true";
                // get title and text
                var action = "";
                if (args.force)
                    action = "Delete";
                else if (args.status == $oewr.MTBRegistrationStatus.Canceled)
                    action = "Cancel";
                else
                    action = "Reactivate";
                var title = $oewr.$res.cmdDeleteReg["title" + action];
                var text = $oewr.$res.cmdDeleteReg["text" + action].format(reg.name);
                // get email
                var email = {
                    template: (args.force || action == "Cancel" ? "delete_" : "") + "registration_" + $oewr.$cfg.lang,
                    to: [{ name: reg.name, email: reg.email }],
                    bcc: $oewr.$cfg.email.bcc || [],
                    location_origin: location.origin
                };
                // add current user to bcc
                var cur = $oewr.$ctx.session.current;
                if (cur && cur.email && !$q(email.bcc).Any(function (x) { return x.email == cur.email; }))
                    email.bcc.push({ name: cur.first_name + " " + cur.last_name, email: cur.email });
                return $oewr.$app.confirm(title, text, args.ok, args.cancel).done(function (res) {
                    $oewr.$ui.loader.show(); // show loader
                    return $oewr.$ctx.deleteRegistration(reg, args.force, args.status, email)
                        .always(function () { $oewr.$ui.loader.hide(); }); // hide loader
                });
            };
            return CmdDeleteRegistration;
        }());
        $cmd.CmdDeleteRegistration = CmdDeleteRegistration;
    })($cmd = $oewr.$cmd || ($oewr.$cmd = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    var $cmd;
    (function ($cmd) {
        /** Executes the specified command. */
        function exec(name, args) {
            var ctor = $cmd[getName(name)];
            if (!ctor)
                return $.Deferred().reject("Cmd " + name + " not found!").promise();
            return new ctor().exec(args || {});
        }
        $cmd.exec = exec;
        function getName(name) {
            var parts = name.split("-");
            name = $q(parts).Select(function (p) { return p[0].toUpperCase() + p.substr(1); }).ToArray().join("");
            return "Cmd" + name;
        }
        /** Executes the specified command. */
        function execUrl(url) {
            if (!url || url.page != "cmd" || !url.dest)
                return $.Deferred().reject("Invalid cmd url '" + (url ? url.hash : "") + "'").promise();
            return exec(url.dest, url.args);
        }
        $cmd.execUrl = execUrl;
        /** Specifies an executable command. */
        var Cmd = /** @class */ (function () {
            /** Initializes a new instance. */
            function Cmd() {
            }
            /** Executes the command. */
            Cmd.prototype.exec = function (args) {
                return $.Deferred().resolve().promise();
            };
            return Cmd;
        }());
        $cmd.Cmd = Cmd;
    })($cmd = $oewr.$cmd || ($oewr.$cmd = {}));
})($oewr || ($oewr = {}));
var $oewr;
(function ($oewr) {
    $oewr.$window = $(window);
    $oewr.$doc = $(document.documentElement);
    $oewr.$body = $(document.body);
    $oewr.$main = $("#main.page");
    /** Main application */
    var $app;
    (function ($app) {
        /** History length on app start. */
        var historyLength;
        /** En-/disables the hash change event. */
        var pauseHashChange = false;
        /** En-/disables the popstate event. */
        var pausePopState = false;
        /** True if the current hash change is a history pop/back. */
        var popstate = false;
        /** Initializes the app. */
        function init(cfg) {
            // get config and main elements
            $oewr.$cfg.init(cfg);
            // disable automatic scrolling on history changes
            if (Modernizr.history) {
                history.scrollRestoration = "manual";
                historyLength = history.length;
            }
            // listen for hash change
            $oewr.$window.on("hashchange", function () {
                if (!pauseHashChange)
                    hashChange();
            });
            // listen history pop/back
            if (Modernizr.history)
                $oewr.$window.on("popstate", function () {
                    if (!pausePopState)
                        popstate = true;
                });
            // init session refresh
            // var refreshTimeout: any;
            // $doc.click(() => 
            // {
            //   if (refreshTimeout)
            //     return;
            //   $ctx.session.refresh()
            //     .done(() => { setAuthenticated(true); })
            //     .fail(() => { setAuthenticated(false); });
            //   refreshTimeout=setTimeout(() => {
            //     refreshTimeout=null;
            //   }, 15000); // wait at least 15sec
            // });
            // show cookie agreement if not already agreed
            setCookieAgreement($oewr.$ctx.session.hasCookieAgreement());
            // init session and preload main page to ensure it gets the current one on app start
            $oewr.$ctx.session.change(function () {
                setAuthenticated($oewr.$ctx.session.current != null);
            });
            $oewr.$ctx.session.refresh()
                //.done(() => { setAuthenticated(true); })
                //.fail(() => { setAuthenticated(false); })
                .always(function () {
                // init app data
                $oewr.$data.init();
                // preload main page
                $oewr.$pages.preload("main").done(function () {
                    // init hash / load start page
                    hashChange(undefined, undefined, "immediate")
                        .done(function () {
                        // preload configured pages
                        $q($oewr.$cfg.pages).Where(function (p) { return p.Value.preload; }).ForEach(function (p) { return $oewr.$pages.preload(p.Key); });
                    });
                });
            });
        }
        $app.init = init;
        function hashChange(hash, anchor, speed) {
            // go back
            if (hash === "#back" || hash == "#pophistory" || hash == "#poppage") {
                $app.back(hash);
                return;
            }
            // disable hash change event
            pauseHashChange = true;
            if (!popstate)
                pausePopState = true;
            // get url
            $oewr.$url = $oewr.$util.parseUrl(hash || window.location.hash);
            // is command?
            if ($oewr.$url.page == "cmd")
                return $oewr.$cmd.execUrl($oewr.$url)
                    .fail(function (err) {
                    console.error(err);
                    return $app.back();
                });
            // is page change?
            var isPageChange = $oewr.$pages.current && $oewr.$url.page != $oewr.$pages.current.name;
            // set location hash
            if (hash && window.location.hash != hash) {
                if (isPageChange) {
                    $oewr.$ui.$backBtn.attr("href", window.location.hash); // set back btn
                    window.location.hash = hash; // use location.hash to remember page change in history
                }
                if (Modernizr.history)
                    setHash(hash); // set history and hash without triggering hashchange event
            }
            if (isPageChange) {
                speed = "immediate"; // scroll immediate on page change
                document.title = getTitle($oewr.$url); // change page title
                if (!popstate)
                    $oewr.$pages.current.remOffset($oewr.$window.scrollTop()); // remember scroll position on page change, but not on popstate
            }
            // check anchor and speed args
            var args = $oewr.$url.args;
            if (args) {
                if (args.anchor)
                    anchor = args.anchor;
                if (args.speed)
                    speed = args.speed;
            }
            // smooth scroll
            return $oewr.$ui.scrollTo($oewr.$url, anchor, speed, popstate)
                .fail(function (err) { back(); }) // go back on error
                .done(function () { pauseHashChange = pausePopState = popstate = false; }); // enable hash change event
        }
        $app.hashChange = hashChange;
        /** Gets the title for the specified url. */
        function getTitle(url) {
            var p = $oewr.$res[url.page];
            var d = url.dest && p ? p[url.dest] : null;
            if (d && d.title)
                return d.title;
            else if (p && p.title)
                return p.title;
            return $oewr.$res["main"].title;
        }
        /** Set's the hash without triggering hashchange event. Only call if history api is supported! */
        function setHash(hash) {
            history.replaceState(hash, undefined, hash);
        }
        $app.setHash = setHash;
        /** Go home. */
        function home() {
            hashChange("#/");
        }
        $app.home = home;
        /** Go back. */
        function back(hash) {
            popstate = true; // next hashchange will run as popstate
            if (hash === "#back")
                hash = null;
            if (!hash)
                hash = $oewr.$ui.$backBtn.attr("back") || $oewr.$pages.current && $oewr.$pages.current.defaultBack() || "#/";
            if (hash == "#pophistory")
                history.back();
            else if (hash == "#poppage")
                $oewr.$pages.back().always(function () { popstate = false; });
            else
                hashChange(hash).always(function () { popstate = false; });
        }
        $app.back = back;
        /** Sets the app authentication state. */
        function setAuthenticated(authenticated) {
            $oewr.$doc.toggleClass("authenticated", authenticated)
                .toggleClass("unauthenticated", !authenticated)
                .toggleClass("role-public", $oewr.$ctx.session.isPublic())
                .toggleClass("role-partner", $oewr.$ctx.session.isPartner())
                .toggleClass("role-admin", $oewr.$ctx.session.isAdmin());
        }
        $app.setAuthenticated = setAuthenticated;
        /** Shows/hides the cookie agreement. */
        function setCookieAgreement(agreed) {
            $oewr.$doc.toggleClass("missing-cookie-agreement", !agreed);
        }
        $app.setCookieAgreement = setCookieAgreement;
        function confirm(args, text, ok, cancel, mode) {
            if (typeof args == "string")
                args = { title: args, text: text, ok: ok, cancel: cancel };
            args.mode = mode || "confirm";
            return $oewr.$pages.load("confirm", false, args).then(function (page) {
                return page.result;
            });
        }
        $app.confirm = confirm;
        function info(args, text, ok) {
            return confirm(args, text, ok, "info");
        }
        $app.info = info;
        function choice(args, text, items) {
            if (typeof args == "string")
                args = { title: args, text: text, items: items };
            return $oewr.$pages.load("choice", false, args).then(function (page) {
                return page.result;
            });
        }
        $app.choice = choice;
    })($app = $oewr.$app || ($oewr.$app = {}));
    // set skel breakpoints
    $oewr.$ui.initSkel();
})($oewr || ($oewr = {}));
