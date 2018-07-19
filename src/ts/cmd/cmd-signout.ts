/*! OEWR - cmd/cmd-test.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="../ref.d.ts" />
"use strict";

module $oewr.$cmd
{
  /** Sign out command. */
  export class CmdSignout
  {
    /** Executes the command. */
    public exec(args: any) : JQueryPromise<any>
    {
      return $ctx.session.signout()
        .always(() => { $app.back(); })
        .done(() => 
        {
          // set app unauthenticated
          //$app.setAuthenticated(false);
        })
    }
  }
}