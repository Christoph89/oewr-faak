/*! OEWR - pages/page-base.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="pages.ts" />
"use strict";

module $oewr.$pages
{
  /** Defines a page. */
  export class Page
  {
    /** Initializes the page. */
    constructor(name: string, pageCnt: JQuery, wait: JQueryDeferred<Page>)
    {
      this.name=name;
      this.pageCnt=pageCnt;
      this.pageCnt.data("page", this);
      if (this.pageCnt.hasClass("init-ui")) 
      {
        $ui.init(this.pageCnt);
        this.pageCnt.removeClass("init-ui");
      }
    }

    /** The page name. */
    public name: string;
    /** The page element/container. */
    public pageCnt: JQuery;

    /** Returns whether the page is the current visible one. */
    public isCurrent(): boolean
    {
      return this.pageCnt.hasClass("current");
    }

    /** Returns whether the page is hidden. */
    public isHidden(): boolean
    {
      return this.pageCnt.hasClass("hidden");
    }

    /** Returns the default back url for the current page. */
    public defaultBack(): string
    {
      return this.pageCnt.attr("back");
    }

    /** Gets or remembers the page offset. Needed for popstate. */
    public remOffset() : number;
    public remOffset(offset: number) : void;
    public remOffset(offset?: number) : number|void
    {
      if (offset===null)
        this.pageCnt.removeAttr("offset");
      else if (offset!==undefined)
        this.pageCnt.attr("offset", offset);
      else
      {
        var attr=this.pageCnt.attr("offset");
        if (attr!=null)
          return parseInt(attr);
        return null;
      }
    }

    /** Called when the page gets loaded. */
    public load(wait: JQueryDeferred<Page>, args?: any)
    { 
      if (wait) wait.resolve(this);
    }
  }
}