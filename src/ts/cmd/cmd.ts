/*! OEWR - cmd/cmd.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="../ref.d.ts" />
/// <reference path="cmd-signin.ts" />
/// <reference path="cmd-signout.ts" />
/// <reference path="cmd-agree-cookies.ts" />
/// <reference path="cmd-edit-event.ts" />
/// <reference path="cmd-delete-event.ts" />
/// <reference path="cmd-delete-registration.ts" />
"use strict";

module $oewr.$cmd
{
  /** Executes the specified command. */
  export function exec(name: string, args: any): JQueryPromise<any>
  {
    var ctor=$cmd[getName(name)];
    if (!ctor)
      return $.Deferred<any>().reject("Cmd "+name+" not found!").promise();
    return (<Cmd>new ctor()).exec(args||{});
  }

  function getName(name: string): string
  {
    var parts=name.split("-");
    name=$q(parts).Select(p => p[0].toUpperCase()+p.substr(1)).ToArray().join("");
    return "Cmd"+name;
  }

  /** Executes the specified command. */
  export function execUrl(url: HashUrl): JQueryPromise<any>
  {
    if (!url || url.page!="cmd" || !url.dest)
      return $.Deferred<any>().reject("Invalid cmd url '"+(url?url.hash:"")+"'").promise();
    return exec(url.dest, url.args);
  }

  /** Specifies an executable command. */
  export class Cmd
  {
    /** Initializes a new instance. */
    constructor()
    {
    }

    /** Executes the command. */
    public exec(args: any) : JQueryPromise<any>
    {
      return $.Deferred<any>().resolve().promise();
    }
  }
}