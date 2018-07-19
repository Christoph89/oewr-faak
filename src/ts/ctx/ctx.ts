/*! OEWR - ctx/ctx.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="../ref.d.ts" />
/// <reference path="ctx-db.ts" />
/// <reference path="ctx-session.ts" />
/// <reference path="ctx-registration.ts" />
"use strict";

module $oewr.$ctx
{
  /** Performs an API request. */
  export function call(verb: string, url: string, data?: any): JQueryPromise<any>
  {
    return session.wait().then(() => {
      if (data && verb!="GET")
        data=JSON.stringify(data);
      return $.ajax({
        type: verb,
        url: $cfg.ctx.baseurl+url,
        data: data||{},
        accepts: { json: "application/json" },
        contentType: "application/json",
        headers: {
          "X-DreamFactory-API-Key": $cfg.ctx.apikey,
          "X-DreamFactory-Session-Token": session.token()
        }
      });
    });
  }

  /** Checks the specified url. */
  function checkUrl(url: string): string
  {
    return url.replace("/db", "/"+$cfg.ctx.db);
  }

  /** Performs an API GET request. */
  export function get(url: string, data?: any): JQueryPromise<any>
  {
    return call("GET", url, data);
  }

  /** Performs an API POST request. */
  export function post(url: string, data?: any): JQueryPromise<any>
  {
    return call("POST", url, data);
  }

  /** Performs an API PUT request. */
  export function put(url: string, data?: any): JQueryPromise<any>
  {
    return call("PUT", url, data);
  }
  
  /** Performs an API DELETE request. */
  export function del(url: string, data?: any): JQueryPromise<any>
  {
    return call("DELETE", url, data);
  }
}