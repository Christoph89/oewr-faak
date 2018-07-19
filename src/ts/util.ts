/*! OEWR - util.ts
* Copyright Christoph Schaunig 2018
*/

"use strict";

module $oewr.$util
{
  /** Returns the formatted date string of the specified datetime. */
  export function formatDate(date: moment.Moment, format: string)
  {
    return date.format(format);
  }

  /** Returns the formatted string for the specified from/to date. */
  export function formatFromTo(from: moment.Moment, to: moment.Moment, format: string, multiDayFormat?: string)
  {
    if (multiDayFormat &&  !dateEquals(from, to)) format=multiDayFormat; // mulitple days
    var parts=format.split("-");
    return from.format(parts[0].trim())+" - "+to.format(parts[1].trim());
  }

  /** Returns whether the date part of the specified datetimes is equal. */
  export function dateEquals(from: moment.Moment, to: moment.Moment)
  {
    return from.year()==to.year() && from.month()==to.month() && from.date()==to.date();
  }

  /** Merges the specified dates. */
  export function mergeDates(target: moment.Moment, dt: moment.Moment) : moment.Moment
  {
    // no valid target date -> clone
    if (!target || !target.isValid())
      return dt?dt.clone():null;
    if (target.hour()==0 && target.minute()==0)
    {
      target.hour(dt.hour());
      target.minute(dt.minute());
    }
    return target;
  }

  /** Merges the specified dates. */
  export function mergeDatesStr(target: string, dt: string) : moment.Moment
  {
    return mergeDates(moment(target||null), moment(dt||null));
  }

  /** Gets the nth weekday of the specified month/date. */
  export function nthWeekdayOfMonth(weekday: number, n: number, date: Date) 
  {
    var count=0;
    var idate=new Date(date.getFullYear(), date.getMonth(), 1);
    while (true) {
      if (idate.getDay()===weekday) {
        if (++count==n)
          break;
      }
      idate.setDate(idate.getDate() + 1);
    }
    return idate;
  }

  /** Ensures that the specified string starts with the prefix. */
  export function ensureStartsWith(str: string, prefix: string)
  {
    if (str==null) str="";
    if (str[0]==prefix) 
      return str;
    return prefix+str;
  }
 
  /** Gets the offset to the specified element.
   * anchor = top|middle
   */
  export function getOffset(element: JQuery|string, anchor: string="top"): number 
  {
    element=<JQuery>(typeof element=="string"?$(element):element);
    if (element.length==0)
      return null;
    var offset=element.offset().top;
    if (anchor=="middle")
      return offset - ($(window).height() - element.outerHeight()) / 2;
    return Math.max(offset, 0); 
  }

  /** Localizes the specified object propery (if possible). */
  export function localize(obj: any, property?: string)
  {
    if (!obj) return null;
    if (!property) property="name";
    var val=obj[property+"_"+$cfg.lang];
    if (val===undefined)
      val=obj[property];
    return val;
  }

  /** Returns the page wrapper of the specified element. */
  export function getPage(el: JQuery): $pages.Page
  {
    // get parent wrapper
    var pw=el;
    while (pw && !pw.hasClass("page"))
      pw=pw.parent();
    return pw.hasClass("page")?pw.data("page"):null;
  }

  /** Returns specified hash url. */
  export function parseUrl(hash: string): HashUrl
  {
    hash=hash.replace("#/", "").replace("#", "");
    var url: HashUrl={ hash: "#/"+hash };
    var parts=hash.split("?");

    // set stack
    var loc=(parts[0]||"").split("/");
    url.page=loc[0];
    if (url.page!="cmd" && !$pages.exists(url.page))
    {
      url.dest=url.page;
      url.page="main";
    }
    else
      url.dest=loc[loc.length-1];
    
    // add args
    url.args=splitArgs(parts[1]);

    return url;
  }

  /** Parses the specified hash args. */
  export function splitArgs(argStr: string): any
  {
    if (!argStr)
      return {};
    var args={};
    $q(argStr.split("&")).ForEach(x => 
    {
      var parts=x.split("=");
      args[decodeURIComponent(parts[0])]=decodeURIComponent(parts[1]);
    });
    return args;
  }

  /** Simple markdown format for bold, strong and italic. */
  export function formatMd(text: string): string
  {
    var bold=0, strong=0, italic=0;
    return text.replace(/\*\*/g, (substr, args) => // bold
    {
      return (++bold)%2==1?"<b>":"</b>";
    }).replace(/\*/g, (substr, args) => // strong
    {
      return (++strong)%2==1?"<strong>":"</strong>";
    }).replace(/_/g, (substr, args) => // italic
    {
      return (++italic)%2==1?"<i>":"</i>";
    });
  }

  /** Trims the specified character. */
  export function trim (text, character) {
    if (character === "]") character = "\\]";
    if (character === "\\") character = "\\\\";
    return text.replace(new RegExp(
      "^[" + character + "]+|[" + character + "]+$", "g"
    ), "");
  }
  
  /** Trims the specified character at the start of the text. */
  export function trimStart (text, character) {
    if (character === "]") character = "\\]";
    if (character === "\\") character = "\\\\";
    return text.replace(new RegExp(
      "^[" + character + "]", "g"
    ), "");
  }

  /** Returns the object at the specified path. */
  export function expandPath(obj: any, path: string)
  {
    var parts=path.split(".");
    for (var i=0; i<parts.length; i++)
      obj=obj[parts[i]];
    return obj;
  }

  // extend String prototype
  (<any>String.prototype).format=function() 
  { 
    var str=this;
    var args=arguments;
    if (!args || !args.length)
      return str;
    // format object?
    if (args.length==1 && (typeof args[0]=="object"))
      args=args[0];
    for (var k in args)
        str=str.replace("{" + k + "}", args[k]);
    return str;
  };
}

// extends String interface
interface String
{
  format(...args: any[]): string;
  format(obj: any): string;
}