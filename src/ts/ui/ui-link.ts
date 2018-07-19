/*! OEWR - ui-link.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="ui.ts" />
"use strict";

module $oewr.$ui.link
{
  /** Initializes all links */
  export function init(context?: JQuery)
  {
    $("a", context).each(function ()
    {
      initLink($(this));
    });
  }

  /** Initializes the specified link. */
  function initLink(link: JQuery)
  {
    var href=link.attr("href");

    // disable empty href links
    if (!href)
      link.off("click.href").on("click.href", e => 
      {
        e.preventDefault();
        return false;
      });
    // hash -> scroll to
    else if (href[0]=="#")
      link.off("click.href").on("click.href", e => 
      {
        // prevent default scrolling
        if (e) e.preventDefault();

        // change hash
        var hash=link.attr("href");
        if (hash) hash=hash.format($url.args);
        $app.hashChange(hash, link.attr("anchor"), link.attr("speed"));
      });
  }
}