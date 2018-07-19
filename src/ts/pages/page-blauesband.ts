/*! OEWR - pages/page-blauesband.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="pages.ts" />
"use strict";

module $oewr.$pages
{
  /** Main page. */
  export class PageBlauesband extends Page
  {
    /** Initializes the page */
    constructor(name: string, pageCnt: JQuery, wait: JQueryDeferred<Page>)
    {
      super(name, pageCnt, wait);

      // init ui
      $ui.init(pageCnt);

      // ready
      wait.resolve(this);
    }

    /** Called when the page gets loaded. */
    public load(wait: JQueryDeferred<Page>)
    { 
      var res=$res.blauesband;
      var year=parseInt($url.dest) || (new Date()).getFullYear();
      var occurence=year-1964;

      // set organizational infos
      var el=n => $(".bb-"+n);
      el("header").text(res.header.format(occurence));
      el("descr").html(res.description.format(occurence));
      el("date").text($util.formatDate(moment($util.nthWeekdayOfMonth(0, 1, new Date("2018-08-01"))), res.dateFormat));

      //set classes
      var tbl=$("section.classes table tbody", this.pageCnt);
      tbl.empty();
      $q(res.classes).ForEach((c: any) => 
      {
        var row=$("<tr>").append(
          $("<td>").text(c.name),
          $("<td>").text((c.from==-1)?"":year - c.from),
          $("<td>").text((c.to==-1)?"":year - c.to)
        );
        tbl.append(row);
      });

      // set poster
      el("poster").attr("src", $cfg.root+"img/blauesband/plakat-"+year+".jpg");


      // ready
      wait.resolve(this);
    }
  }
}