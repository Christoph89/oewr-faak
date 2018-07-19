/*! OEWR - ui.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="ui-loader.ts" />
/// <reference path="ui-section.ts" />
/// <reference path="ui-link.ts" />
/// <reference path="ui-img.ts" />
/// <reference path="ui-items.ts" />
/// <reference path="ui-events.ts" />
/// <reference path="ui-gallery.ts" />
/// <reference path="ui-map.ts" />
/// <reference path="ui-map-style.ts" />
/// <reference path="ui-menu.ts" />
/// <reference path="ui-timeline.ts" />
/// <reference path="ui-scrollex.ts" />
"use strict";

module $oewr.$ui
{
  export var $scrollCnt=$("body,html");
  export var $backBtn=$("#back-btn");

  /** Specifies ui options. */
  export interface UIOptions
  {
    setHashOnScroll?: boolean;
  }

  /** Initializes the UI. */
  export function init(context?: JQuery, opt?: UIOptions)
  {
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
    $scrollCnt.trigger("scroll");
  }

  /** Init common ui parts, should be called only once. */
  export function initCommon()
  {
    fixIEFlexbox(); // fix IE flexbox min-height bug
    initBackBtn(); // init back button
    initLangBtn(); // hide language button on scroll
    $ui.menu.init(); // menu
  }

  /** Initializes skel. */
  export function initSkel()
  {
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

  /** Scrolls to the specified element.
   * anchor: top|middle
   * speed: slow|normal|fast|immediate
   */
  export function scrollTo(url: HashUrl, anchor?: string, speed?: string, popstate?: boolean, wait?: JQueryDeferred<any>): JQueryPromise<any>
  {
    // load page
    if (!wait) wait=$.Deferred<any>();
    var pageName=(url.page||"main");
    if ($pages.exists(pageName+"-"+url.dest))
      pageName+="-"+url.dest;
    $pages.load(pageName).done(page => {
      // get destination element
      var dest=url.dest?$("#"+url.dest):null;
      if (dest && !dest.length) dest=$("section[href='#/"+url.dest+"']");
      scrollToPage(page, dest, anchor, speed, popstate, wait);
    })
    .fail(err => 
    {
      wait.reject(err);
    });
    return wait.promise();
  }

  /** Scroll to the specifie page. */
  export function scrollToPage(page: $pages.Page, dest: JQuery, anchor: string="top", speed: string="normal", popstate?: boolean, wait?: JQueryDeferred<any>): JQueryPromise<any>
  {
    // get anchor and speed
    if (!dest || !dest.length) dest=page.pageCnt;
    if (!anchor) anchor=dest.attr("anchor") || "top";
    if (!speed) speed=dest.attr("speed") || "normal";

    // if popstate try get offset from page
    var offset: number;
    if (popstate)
      offset=page.remOffset();
    // otherwise get offset from dest
    if (offset==undefined) 
      offset=$util.getOffset(dest, anchor);

    // scroll to offset
    return scrollToPos(offset, anchor, speed, wait);
  }

  /** Scrolls to the specified position. */
  export function scrollToPos(offset: number, anchor: string="top", speed: string="normal", wait?: JQueryDeferred<any>): JQueryPromise<any>
  {
    if (!wait) wait=$.Deferred<any>();

    // scroll immediate?
    if (speed=="immediate")
    {
      $scrollCnt.stop().scrollTop(offset); 
      setTimeout(() => {
        wait.resolve();
      }, 100);
    }
    else // scroll smooth
    {
      var duration=1000; // normal speed
      if (speed=="slow") duration=2000;
      else if (speed=="fast") duration=300;
      $scrollCnt.stop().animate({ scrollTop: offset }, duration, "swing", function() {
        wait.resolve();
      });
    }
    return wait.promise();
  }

  /** Initializes the back button. */
  function initBackBtn()
  {
    $backBtn.click((e) => 
    {
      // prevent default scrolling
      if (e) e.preventDefault();

      // go back
      $app.back();
    });
  }

  /** Initializes the language button. */
  function initLangBtn()
  {
    var langBtn=$("#lang-btn");
    var check=(e?) =>
    {
      var winHeight=$window.height();
      var scrollHeight=$window.scrollTop();
      langBtn.toggleClass("hidden", scrollHeight>(winHeight/2) || $pages.current && $pages.current.pageCnt.hasClass("no-lang-btn"));
    };
    $window.scroll(check);
    $window.resize(check);
    check();
  }

  /** Fixes IE flexbox min-height bug. */
  function fixIEFlexbox()
  {
    if (skel.vars.browser!='ie')
      return;

    var flexboxFixTimeoutId;
    $window.on('resize.flexbox-fix', function ()
    {
      var $x=$('.fullscreen');
      clearTimeout(flexboxFixTimeoutId);
      flexboxFixTimeoutId=setTimeout(function ()
      {
        if ($x.prop('scrollHeight')>$window.height())
          $x.css('height', 'auto');
        else
          $x.css('height', '100vh');
      }, 250);
    }).triggerHandler('resize.flexbox-fix');
  }

  /** Fixes object fix. */
  function fixObjectFit(context?: JQuery)
  {
    if (skel.canUse('object-fit'))
      return;

    $('.banner .image, .spotlight .image', context).each(function (idx, el)
    {
      var $el=$(el),
        $img=$el.children('img'),
        positionClass=$el.parent().attr('class').match(/image-position-([a-z]+)/);

      // set image.
      $el.css('background-image', 'url("'+$img.attr('src')+'")')
        .css('background-repeat', 'no-repeat')
        .css('background-size', 'cover');

      // set position.
      switch (positionClass.length>1? positionClass[1]:'') 
      {
        case 'left': $el.css('background-position', 'left'); break;
        case 'right': $el.css('background-position', 'right'); break;
        case 'center':
        default: $el.css('background-position', 'center'); break;
      }

      // hide original.
      $img.css('opacity', '0');
    });
  }
}