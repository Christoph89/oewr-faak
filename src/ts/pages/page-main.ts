/*! OEWR - pages/page-main.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="pages.ts" />
"use strict";

module $oewr.$pages
{
  /** Main page. */
  export class PageMain extends Page
  {
    /** Initializes the page */
    constructor(name: string, pageCnt: JQuery, wait: JQueryDeferred<Page>)
    {
      super(name, pageCnt, wait);

      // init ui
      $ui.initCommon();
      $ui.init(pageCnt, { setHashOnScroll: Modernizr.history });

      // ready
      wait.resolve(this);
    }
  }
}