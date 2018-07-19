/*! OEWR - cmd/cmd-delete-event.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="../ref.d.ts" />
"use strict";

module $oewr.$cmd
{
  /** Sign out command. */
  export class CmdDeleteRegistration
  {
    /** Executes the command. */
    public exec(args: any) : JQueryPromise<any>
    {
      // get event id
      var reg: IMTBEventRegistration=args;
      if (!reg || !reg.regId)
        return $.Deferred<any>().reject("Missing reg!").promise();

      // parse boolean
      if (typeof args.force==="string")
        args.force=args.force==="true";

      // get title and text
      var action="";
      if (args.force) action="Delete";
      else if (args.status==MTBRegistrationStatus.Canceled) action="Cancel";
      else action="Reactivate";
      var title=$res.cmdDeleteReg["title"+action];
      var text=$res.cmdDeleteReg["text"+action].format(reg.name); 

      // get email
      var email: IEmail={
        template: (args.force || action=="Cancel"?"delete_":"")+"registration_"+$cfg.lang,
        to: [{ name: reg.name, email: reg.email }],
        bcc: $cfg.email.bcc||[],
        location_origin: location.origin
      };

      // add current user to bcc
      var cur=$ctx.session.current;
      if (cur && cur.email && !$q(email.bcc).Any(x => x.email==cur.email))
        email.bcc.push({ name: cur.first_name+" "+cur.last_name, email: cur.email });

      return $app.confirm(title, text, args.ok, args.cancel).done(res =>
      {
        $ui.loader.show(); // show loader
        return $ctx.deleteRegistration(reg, args.force, args.status, email)
          .always(() => { $ui.loader.hide(); }); // hide loader
      });
    }
  }
}