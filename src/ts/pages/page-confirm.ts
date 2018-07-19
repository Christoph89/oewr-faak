/*! OEWR - pages/page-confirm.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="pages.ts" />
"use strict";

module $oewr.$pages
{
  /** Main page. */
  export class PageConfirm extends Page
  {
    /** Initializes the page */
    constructor(name: string, pageCnt: JQuery, wait: JQueryDeferred<Page>)
    {
      super(name, pageCnt, wait);

      // init ui
      $ui.init(pageCnt);

      // init title, text, buttons
      this.title=$("h2.title", this.pageCnt);
      this.text=$("p.text", this.pageCnt);
      this.okBtn=$(".button.ok", this.pageCnt).click(() =>
      {
        if (this._result)
          this._result.resolve(true);
      });
      this.cancelBtn=$(".button.cancel", this.pageCnt).click(() =>
      {
        if (this._result)
          this._result.resolve(false);
      });

      // ready
      wait.resolve(this);
    }
    
    /** The title header. */
    private title: JQuery;
    /** The text paragraph. */
    private text: JQuery;
    /** The ok button. */
    private okBtn: JQuery;
    /** The cancel button. */
    private cancelBtn: JQuery;
    /** Result deferred. */
    private _result: JQueryDeferred<any>;
    /** Result promise. */
    public result: JQueryPromise<any>;

    /** Called when the page gets loaded. */
    public load(wait: JQueryDeferred<Page>, args?: any)
    {
      // get args
      if (!args) args=$url.args||{};
      var res=args.res;
      if (res)
      {
        res=$util.expandPath($res, res);
        if (res.title) args.title=res.title;
        if (res.text) args.text=res.text;
        if (res.ok) args.ok=res.ok;
        if (res.cancel) args.cancel=res.cancel;
      }

      // init result promise
      this._result=$.Deferred<any>();
      this.result=this._result.promise();

      // set title, text, buttons
      $("h2", this.pageCnt).text((args.title||"").format(args));
      $("p", this.pageCnt).text((args.text||"").format(args));
      this.okBtn.attr("href", args.ok||"#poppage");
      if (args.cancel) this.cancelBtn.attr("href", args.cancel);
      this.cancelBtn.parent().toggle(args.mode!="info");

      // reinit links
      $ui.link.init(this.pageCnt);

      // ready
      wait.resolve(this);
    }
  }
}