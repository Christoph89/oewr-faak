/*! OEWR - pages/page-signin.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="pages.ts" />
"use strict";

module $oewr.$pages
{
  /** Main page. */
  export class PageSignin extends Page
  {
    /** Initializes the page */
    constructor(name: string, pageCnt: JQuery, wait: JQueryDeferred<Page>)
    {
      super(name, pageCnt, wait);

      // init ui
      $ui.init(pageCnt);
      this.signInBtn=$("#signin-btn", pageCnt).click((e) =>
      {
        if (e) e.preventDefault();
        this.signIn();
      });
      this.email=$("#signin-email", this.pageCnt);
      this.pwd=$("#signin-pwd", this.pageCnt);
      this.errorLbl=$("#signin-error", this.pageCnt);

      // ready
      wait.resolve(this);
    }

    /** The sign in button. */
    private signInBtn: JQuery;
    /** The email textbox. */
    private email: JQuery;
    /** The password textbox. */
    private pwd: JQuery;
    /** The error label. */
    private errorLbl: JQuery;

    private signIn()
    {
      // signin
      $ui.loader.show();
      $cmd.exec("signin", {
        email: this.email.val(),
        pwd: this.pwd.val(),
        return: $url.args?$url.args.return:null
      })
      .always(() => 
      { 
        // hide loader and empty form
        $ui.loader.hide(); 
        this.email.val("");
        this.pwd.val("");
      })
      .done(() => 
      {
        // hide error
        this.errorLbl.addClass("hidden");
      })
      .fail((jqXHR, status, err) => 
      { 
        // set error
        this.errorLbl.text(err).removeClass("hidden");
      });
    }
  }
}