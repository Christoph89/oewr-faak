/*! OEWR - ui-gallery.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="ui.ts" />
"use strict";

interface HTMLElement
{
  _locked: boolean;
}

module $oewr.$ui.gallery
{
  /** Initializes all galleries. */
  export function init(context?: JQuery)
  {
    // basic init
    $ui.scrollex.init($(".gallery", context)
      .wrapInner('<div class="inner"></div>')
      .prepend(skel.vars.mobile? "":'<div class="forward"></div><div class="backward"></div>'), { delay: 50 })
      .context.children(".inner")
      .css("overflow-y", skel.vars.mobile? "visible":"hidden")
      .css("overflow-x", skel.vars.mobile? "scroll":"hidden")
      .scrollLeft(0);

    // initialize lighbox feature
    initLightbox(context);
  }

  /** Initializes the lightbox feature. */
  function initLightbox(context?: JQuery)
  {
    $(".gallery.lightbox", context).on("click", "a", function (e) 
    {
      var $a=$(this),
        $gallery=$a.parents(".gallery"),
        $modal=$gallery.children(".modal"),
        $modalImg=$modal.find("img"),
        href=$a.attr("href");

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
      $modal[0]._locked=true;
      $modal.data("cur", $a);

      // set src, visible and focus
      $modalImg.attr("src", href);
      $modal.addClass("visible");
      $modal.focus();

      // disable bg scrolling
      $main.addClass("no-scroll");

      // delay and unlock.
      setTimeout(() => { $modal[0]._locked=false; }, 300);

    })
    .on("click", ".modal", function (e)
    {
      var $modal=$(this),
        $modalImg=$modal.find("img");

      // locked?
      if ($modal[0]._locked)
        return;

      // already hidden?
      if (!$modal.hasClass("visible"))
        return;

      // lock
      $modal[0]._locked=true;

      // clear visible, loaded.
      $modal.removeClass("loaded");

      // delay and hide.
      setTimeout(function ()
      {
        $modal.removeClass("visible"); // hide
        $main.removeClass("no-scroll"); // enable scrolling
        setTimeout(function ()
        {
          // clear src, unlock and set focus to body
          $modalImg.attr("src", "");
          $modal[0]._locked=false;
          $modal.removeData("cur"); // remove current img
          $body.focus();
        }, 175);
      }, 125);

    })
    // prev lick
    .on("click", ".prev", function (e)
    {
      var $modal=$(this).parents(".gallery").children(".modal");
      
      // get current
      var $cur=$modal.data("cur");
      if (!$cur)
        return;

      // get prev
      var $prev=$cur.parent().prev().find("a");

      // take last if we are at the top
      if (!$prev || !$prev.length)
        $prev=$cur.parent().parent().children().last().find("a");

      // check
      if (!$prev || !$prev.length)
        return;

      // load prev
      $prev.trigger("click");
    })
    // next click
    .on("click", ".next", function (e)
    {
      var $modal=$(this).parents(".gallery").children(".modal");
      
      // get current
      var $cur=$modal.data("cur");
      if (!$cur)
        return;

      // get next
      var $next=$cur.parent().next().find("a");

      // take first if we are at the end
      if (!$next || !$next.length)
        $next=$cur.parent().parent().children().first().find("a");

      // check
      if (!$next || !$next.length)
        return;

      // load next
      $next.trigger("click");
    })
    // keyboard listener
    .on("keydown", ".modal", function (e)
    {
      var $modal=$(this);
      switch (e.keyCode)
      {
        // escape, hide lightbox
        case 27: $modal.trigger("click"); break;
        // left, prev img
        case 37: $modal.parent().find(".prev").trigger("click"); break;
        // right, next img
        case 39: $modal.parent().find(".next").trigger("click"); break;
      }
    })
    .prepend('<div class="modal" tabIndex="-1">'
        +'<a class="prev icon style2 fa-angle-left"></a>'
        +'<div class="inner"><img src="" /></div>'
        +'<a class="next icon style2 fa-angle-right"></a>'
      +'</div>')
    .find("img")
    .on("load", function (e)
    {
      var $modalImg=$(this),
        $modal=$modalImg.parents(".modal");

      setTimeout(function ()
      {
        // no longer visible?
        if (!$modal.hasClass("visible"))
          return;
        // set loaded.
        $modal.addClass("loaded");
      }, 275);

    });
  }
}