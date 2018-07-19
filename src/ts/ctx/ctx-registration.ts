/*! OEWR - ctx/ctx-registration.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="ctx.ts" />
"use strict";

module $oewr.$ctx
{
  /** Loads all registrations for the specified event. */
  export function getRegistrations(eventId: number): JQueryPromise<{ registrations: IMTBEventRegistration[], count: number }>
  {
    return get("/registration/"+eventId+"?db="+$cfg.ctx.db).then(res => 
    {
      if (!res) res={};
      return {
        registrations: res.registrations,
        count: res.count||0
      }
    });
  }

  /** Adds the specified registration with the specified recaptcha token. */
  export function register(reg: IMTBEventRegistration, token: string, email?: IEmail): JQueryPromise<IMTBEventRegistration>
  {
    return $ctx.post("/registration?lang="+$cfg.lang+"&db="+$cfg.ctx.db, { token: token, reg: reg, email: email });
  }

  /** Deletes the specified event registration. */
  export function deleteRegistration(reg: IMTBEventRegistration, force?: boolean, status?: MTBRegistrationStatus, email?: IEmail): JQueryPromise<any>
  {
    return $ctx.del("/registration?lang="+$cfg.lang+"&db="+$cfg.ctx.db, { reg: reg, force: force, status: status||MTBRegistrationStatus.Canceled, email: email });
  }
}