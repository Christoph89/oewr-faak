/*! OEWR - ui-img.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="ui.ts" />
"use strict";

module $oewr.$ui.img
{
  /** Initializes all images. */
  export function init(context?: JQuery)
  {
    // at the moment we only check for svg support
    // so we can return if svg is supported
    if (Modernizr.svgasimg)
      return;

    // init images
    $("img.svg", context).each((i, el) =>
    {
      // check svg compatibility
      var img=$(el);
      if (img.hasClass("svg"))
        convertSvgToPng(img);
    });
  }

  /** Replaces .svg by .png of the specified image source. */
  function convertSvgToPng(img: JQuery)
  {
    var src=img.attr("src");
    img.attr("src", src.replace(".svg", ".png"));
  }
}