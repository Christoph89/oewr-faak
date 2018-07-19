/*! OEWR - data/data-registration.ts
* Copyright Christoph Schaunig 2018
*/

"use strict";

module $oewr
{
  /** Specifies the registration status. */
  export enum MTBRegistrationStatus
  {
    /** Canceled */
    Canceled=0,
    /** Active */
    Active=1,
  }

  /** Defines an MTB event registration. */
  export interface IMTBEventRegistration
  {
    /** The registration id. */
    regId?: number;
    /** The event id. */
    eventId?: number;
    /** The creation date of the registration. */
    created?: string;
    /** The username of the creator (null if public, *** if not allowed). */
    createdBy?: string;
    /** The name of the participant. */
    name?: string;
    /** The email address of the participant (*** if not allowed). */
    email?: string;
    /** The phone nr. of the participant (*** if not allowed). */
    phone?: string;
    /** The age of the participant (0 if not allowed). */
    age?: number;
    /** The accommodation of the participant. */
    accommodation?: string;
    /** The registration status. */
    status?: MTBRegistrationStatus;
  }
}