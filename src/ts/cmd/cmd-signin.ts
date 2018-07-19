/*! OEWR - cmd/cmd-test.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="../ref.d.ts" />
"use strict";

module $oewr.$cmd
{
  /** Sign out command. */
  export class CmdSignin
  {
    /** Executes the command. */
    public exec(args: any) : JQueryPromise<any>
    {
      // get/check email and pwd
      var hash=args.hash, email=args.email, pwd=args.pwd;
      if (!hash && (!email || !pwd))
        return $.Deferred<any>().reject("Missing credentials!").promise();

      // get return url
      var returnUrl=args.return || "#/";

      // sign in
      $ui.loader.show(); // show loader
      return (hash ? $ctx.session.hashauth(hash) : $ctx.session.signin(email, pwd))
        .always(() => {  $ui.loader.hide(); }) // always hide loader
        .done(session => 
        {
          // set document session classes
          //$app.setAuthenticated(true);

          // goto return url
          return $app.hashChange($util.ensureStartsWith(returnUrl, "#"));
        })
        .fail((jqXHR, status, err) => 
        { 
          // log error
          console.error(err);
        });  
    }
  }
}