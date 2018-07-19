/*! OEWR - ui-scrollex.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="ui.ts" />
"use strict";

module $oewr.$ui.scrollex
{
  /** Initializes a new scrollex element. */
  export function init(context: JQuery, opt?: ScrollexOptions): Scrollex
  {
    return new Scrollex(context, opt);
  }

  /** Defines a scrollex event. */
  export interface ScrollexEvent
  {
    (scrollex: Scrollex, el: JQuery) : boolean|void
  }

  /** Scrollex options. */
  export interface ScrollexOptions
  {
    /** top padding (in pixels, %, or vh). */
    top?: string;
    /** Bottom padding (in pixels, %, or vh). */
    bottom?: string;
    /** Delay (in ms) between position checks. */
    delay?: number;
    /** En-/disables the scrollex events. */
    enabled?: boolean;
    /** Css class which is set when the scrollex element is inactive. */
    inactiveClass?: string;
    /** En-/Disables bidirectional activating.
     * true to enable always
     * string to enable only if the element has the specified css class (string)
     */
    bidirectional?: string|boolean;
    /** Triggered when scrollex is called on an element. */
    initialize?: ScrollexEvent;
    /** Triggered when unscrollex is called on an element. */
    terminate?: ScrollexEvent;
    /** Triggered when the viewport enters an element's contact area. */
    enter?: ScrollexEvent;
    /** Triggered when the viewport leaves an element's contact area. */
    leave?: ScrollexEvent;
  }

  /** Adds new scrolling events to change elements on scrolling. */
  export class Scrollex
  {
    /** Initializes a new scrollex element. */
    constructor(context: JQuery, opt?: ScrollexOptions)
    {
      // set element
      this.context=context;
      this.context.each((i, el) => { $(el).data("scrollex", this);  });

      // extend default options
      var t=this;
      var init=opt.initialize, terminate=opt.terminate, enter=opt.enter, leave=opt.leave;
      this.options=opt=$.extend({}, Scrollex.defaultOptions, opt, <ScrollexOptions>{
        initialize: function () { t.initialize($(this), init); },
        terminate:  function () { t.terminate($(this), terminate); },
        enter:  function () { t.enter($(this), enter); },
        leave:  function () { t.leave($(this), leave); },
      });

      // execute jquery scrollex plugin
      this.context.scrollex(<JQueryScrollexOptions>opt);
    }

    /** Default options. */
    public static defaultOptions: ScrollexOptions=
    {
      enabled: true,
      top: "30vh",
      bottom: "30vh",
      inactiveClass: "is-inactive",
      bidirectional: "onscroll-bidirectional"
    };

    /** The scrollex elements. */
    public context: JQuery;
    /** The scrollex options. */
    public options: ScrollexOptions;

    /** Triggered when scrollex is called on an element. */
    private initialize(el: JQuery, init?: ScrollexEvent)
    {
      if (!this.options.enabled || init && init(this, el)===false)
        return;
      el.addClass(this.options.inactiveClass);
    }

    /** Triggered when unscrollex is called on an element. */
    private terminate(el: JQuery, terminate?: ScrollexEvent)
    {
      if (!this.options.enabled || terminate && terminate(this, el)===false)
        return;
      el.removeClass(this.options.inactiveClass); 
    }

    /** Triggered when the viewport enters an element's contact area. */
    private enter(el: JQuery, enter?: ScrollexEvent)
    {
      if (!this.options.enabled || enter && enter(this, el)===false)
        return;

      // set active
      el.removeClass(this.options.inactiveClass); 
    }

    /** Triggered when the viewport leaves an element's contact area. */
    private leave(el: JQuery, leave?: ScrollexEvent)
    {
      if (!this.options.enabled || leave && leave(this, el)===false)
        return;

      // set inactive
      var opt=this.options;
      if (opt.bidirectional==true || opt.bidirectional && el.hasClass(opt.bidirectional))
        el.addClass(opt.inactiveClass);
    }
  }
}