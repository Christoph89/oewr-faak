/*! OEWR - ui-loader.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="ui.ts" />
"use strict";

module $oewr.$ui.loader
{
  var timeout: any;
  var delay=300;
  var count=0;
  var loader=$("#loader");

  /** Shows the loader. */
  export function show()
  {
    if (timeout)
      return;
    count++;
    $body.addClass("is-loading");
    timeout=setTimeout(() => {
      loader.addClass("show");
    }, delay);
  }

  /** Hides the loader. */
  export function hide()
  {
    count=Math.max(0, count-1);
    if (count>0)
      return;
    if (timeout) 
    {
      clearTimeout(timeout);
      timeout=null;
    }
    loader.removeClass("show");
    $body.removeClass("is-loading");
  }

  /** Shows/hides the loader. */
  export function toggle(showLoader?: boolean)
  {
    if (showLoader==undefined) showLoader=!loader.hasClass("show");
    if (showLoader) show();
    else hide();
  }
}