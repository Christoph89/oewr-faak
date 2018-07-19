/*! OEWR - pages/pages.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="../ref.d.ts" />
/// <reference path="page-base.ts" />
/// <reference path="page-main.ts" />
/// <reference path="page-events.ts" />
/// <reference path="page-event.ts" />
/// <reference path="page-event-edit.ts" />
/// <reference path="page-signin.ts" />
/// <reference path="page-admin.ts" />
/// <reference path="page-choice.ts" />
/// <reference path="page-confirm.ts" />
/// <reference path="page-blauesband.ts" />
"use strict";

module $oewr
{
  /** Defines page infos. */
  export interface PageInfo
  {
    /** The name of the page. */
    name: string;
    /** Specifies whether to preload the page. */
    preload: boolean;
    /** Specifies synonym page names. */
    synonyms: string[];
    /** Specifies the name for synonym pages. */
    synname: string;
  }

  export module $pages
  {
    interface PageCtor { (pageCnt: JQuery, wait: JQueryDeferred<Page>): void }
    var waiting: { [name: string]: JQueryPromise<Page> }={};
    var pages: { [name: string]: Page }={};

    /** Gets the current page */
    export var current: Page;
    /** Gets the page stack. */
    export var stack: Page[]=[];

    /** Loads the specified page. */
    export function load(name: string, preload?: boolean, args?: any): JQueryPromise<Page>
    {
      // check if page exists
      var pageInfo=$cfg.pages[name];
      if (pageInfo==null)
        return $.Deferred<Page>().reject("Missing page "+name).fail((err) => { fail(err, name, preload); }).promise();
      if (!$ctx.session.granted("page/"+name))
      {
        if (preload)
          return $.Deferred<Page>().reject("Unauthorized page preload "+name).promise();
        return $.Deferred<Page>().reject("Unauthorized page load "+name).fail((err) => { fail(err, name, preload); }).promise();
      }
      // check if page is synonym
      if (pageInfo.synname)
        return load(pageInfo.synname, preload);

      // already waiting?
      var wait=<JQueryPromise<Page>>waiting[name];

      // not already waiting
      if (!wait)
      {
        // create promise
        var df=$.Deferred<Page>().fail((err) => { fail(err, name, preload); });
        wait=df.promise();

        // get page
        var page: Page=get(name);
        var ctor: typeof Page;

        // does page and ctor exist?
        if (!page && !(ctor=getCtor(name)))
          return df.reject().promise(); // page and ctor does not exist -> reject
        else if (page)
          df.resolve(page); // page exists -> page load
        else // page does not exist -> init page befor load
        {
          if (!preload) $ui.loader.show();
          getPageCnt(name).then(pageCnt => 
          {
            // create page
            page=pages[name]=new ctor(name, pageCnt, df);
            if (ctor==$pages["Page"]) df.resolve(page); // default page -> resolve
          }, () => { df.reject(); });
        }
      }
        
      // load page
      // it's necessary to remember the promise to prevent duplicate loading while preloading
      return (waiting[name]=wait.then(page =>
        {
          if (!page.load || preload)
            return page;
          var waitLoad=$.Deferred<Page>();
          page.load(waitLoad, args);
          return <any>waitLoad;
        })
        .then(page => {
          setCurrentPage(page, preload);
          $ui.loader.hide();
          return page;
        })).fail((err) => { fail(err, name, preload); }); // catch fail
    }

    function setCurrentPage(page: Page, preload?: boolean, isBack?: boolean)
    {
      // init current page on app start, should be main page
      if (!current)
      {
        current=page;
        if (!isBack) stack.push(current);
      }

      // hide loader and set current page if not preloading
      if (preload)
        return;
        
      if (current!=page)
      {
        // hide old current
        if (current) 
        {
          current.remOffset($window.scrollTop()); // remember scroll offset
          current.pageCnt.removeClass("current").addClass("hidden");
          current.pageCnt.trigger("pagehide");
        }

        // set new current
        (current=page).pageCnt.addClass("current").removeClass("hidden");
        current.pageCnt.trigger("pageload");

        // add page to stack
        if (!isBack) stack.push(current);
      }
      // set back btn
      $ui.$backBtn.toggleClass("hidden", current==get("main") || current.pageCnt.hasClass("no-back-btn"));
    }

    /** Preloads the specified page. */
    export function preload(name: string): JQueryPromise<Page>
    {
      return load(name, true);
    }

    /** Loads the previous page. */
    export function back(): JQueryPromise<any>
    {
      var wait=$.Deferred<any>();
      if (stack.length<2)
        return wait.resolve().promise();
      stack.pop();
      var prev=stack[stack.length-1];
      if (!prev)
        prev=$pages.get("main");
      setCurrentPage(prev, false, true);
      return $ui.scrollToPage(prev, undefined, undefined, "immediate", true, wait);
    }

    function fail(err: any, name: string, preload: boolean)
    {
      $ui.loader.hide();
      delete waiting[name];

      // redirect
      if (err && err.redirect)
        return $app.hashChange(err.redirect);

      if (!preload) $app.back();
      console.error("Could not load page "+name+"! "+err);
    }

    /** Gets or loads the specified page container from DOM or Server. */
    function getPageCnt(name: string): JQueryPromise<JQuery>
    {
      var pageCnt=$("#"+name+".page");
      if (pageCnt.length>0)
        return $.Deferred<JQuery>().resolve(pageCnt).promise();
      return $.ajax({
        type: "GET",
        url: "pages/"+name+".html"
      }).then(pageHtml => 
      {
        // any page html?
        if (!pageHtml)
        pageHtml='<div id="'+name+'"></div>';
      
        // append page cnt
        pageCnt=$(pageHtml);
        $body.append(pageCnt);

        return pageCnt;
      });
    }

    /** Returns the constructor for the specified page. */
    function getCtor(name: string): typeof Page
    {
      // remove - from name
      var parts=name.split("-");
      name=$q(parts).Select(p => p[0].toUpperCase()+p.substr(1)).ToArray().join("");
      
      return $pages["Page"+name] || Page;
    }

    /** Gets the specified page container. */
    export function get(name: string): Page
    {
      return pages[name];
    }

    /** Returns whether the specified page exists. */
    export function exists(name: string) : boolean
    {
      return $cfg.pages[name]!=null;
    }
  }
}