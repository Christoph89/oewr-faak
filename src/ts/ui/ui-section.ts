/*! OEWR - ui-section.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="ui.ts" />
"use strict";

module $oewr.$ui.section
{
  /** Initializes all item lists. */
  export function init(context?: JQuery, opt?: UIOptions)
  {
    // activate sections on scroll
    var page=(context?$util.getPage(context):null) || $pages.get("main");
    var active: string[]=[];
    var scrollex=$ui.scrollex.init($((context?"":".page ")+"> section, section > section", context), 
    {
      enter: !opt||!opt.setHashOnScroll?null:(sx, el) =>
      {
        if ($body.hasClass("is-loading"))
          return false;
        // add active element with href attr
        var href=el.attr("href");
        if (href)
        {
          if (active.indexOf(href)==-1) active.push(href); // add to array
          if (active.length==1) $app.setHash(active[0]); // set hash
        }
      },
      leave: !opt||!opt.setHashOnScroll?null:(sx, el) =>
      {
        if ($body.hasClass("is-loading"))
          return false;
        // remove active element with href attr
        var href=el.attr("href");
        if (href)
        {
          // remove inactive element
          var idx=active.indexOf(href);
          if (idx > -1) 
          {
            active.splice(idx, 1); // remove from active array
            if (active.length==1) 
              $app.setHash(active[0]); // set hash
          }
        }
      }
    });

    // en-/disable scrollex on page load/hide
    page.pageCnt.on("pageload", () => { scrollex.options.enabled=true; });
    page.pageCnt.on("pagehide", () => { scrollex.options.enabled=false; });
  } 
}