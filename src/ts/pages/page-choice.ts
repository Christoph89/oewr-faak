/*! OEWR - pages/page-choice.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="pages.ts" />
"use strict";

module $oewr.$pages
{
  /** Main page. */
  export class PageChoice extends Page
  {
    /** Initializes the page */
    constructor(name: string, pageCnt: JQuery, wait: JQueryDeferred<Page>)
    {
      super(name, pageCnt, wait);

      // init title, text
      this.title=$("h2.title", this.pageCnt);
      this.text=$("p.text", this.pageCnt);

      // ready
      wait.resolve(this);
    }

    
    /** The title header. */
    private title: JQuery;
    /** The text paragraph. */
    private text: JQuery;
    /** Result deferred. */
    private _result: JQueryDeferred<any>;
    /** Result promise. */
    public result: JQueryPromise<any>;

    /** Called when the page gets loaded. */
    public load(wait: JQueryDeferred<Page>, args?: any)
    {
      // init result promise
      this._result=$.Deferred<any>();
      this.result=this._result.promise();

      // set title and text
      if (!args) args=$url.args;
      this.title.text(args.title);
      this.text.text(args.text);
      
      // add buttons
      var actions=$(".actions", this.pageCnt).empty();
      $q(<object>args.items).ForEach(it => 
      {
        var val=it.Key;
        var text=it.Value;
        var item=$("<li>").appendTo(actions);
        var btn=$("<a>").addClass("button special").text(text).appendTo(item).click(() =>
        {
          // resolve with val
          this._result.resolve(val);
        });
      });

      // append cancel button
      actions.append($('<li><a href="#poppage" class="button cancel special icon fa-close">'+$res.common.cancel+'</a></li>'))

      // init links
      $ui.link.init(this.pageCnt);

      // ready
      wait.resolve(this);
    }
  }
}