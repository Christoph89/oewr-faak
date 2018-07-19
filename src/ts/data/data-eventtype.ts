/*! OEWR - data/data-eventtype.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="../ref.d.ts" />
"use strict";

module $oewr
{
  /** Specifies all event types. (Extended by resource!) */
  export var MTBEventTypes:{ [type: string]: MTBEventType }={};
  MTBEventTypes[0]=MTBEventTypes["None"]={ id: 0, name: "None", description: "@@cfg", icon: "@@cfg", duration: 0 },
  MTBEventTypes[1]=MTBEventTypes["TechniqueTraining"]={ id: 1, name: "TechniqueTraining", description: "@@cfg", icon: "@@cfg", duration: 3.5 };
  MTBEventTypes[2]=MTBEventTypes["GuidedTour"]={ id: 2, name: "GuidedTour", description: "@@cfg", icon: "@@cfg", duration: 4 };
  MTBEventTypes[3]=MTBEventTypes["EBikeTour"]={ id: 3, name: "EBikeTour", description: "@@cfg", icon: "@@cfg", duration: 4 };
  MTBEventTypes[4]=MTBEventTypes["Camp"]={ id: 4, name: "Camp", description: "@@cfg", icon: "@@cfg", duration: 72 };
  MTBEventTypes[5]=MTBEventTypes["MechanicalTraining"]={ id: 5, name: "MechanicalTraining", description: "@@cfg", icon: "@@cfg", duration: 2 };

  /** Defines a mtb event type. */
  export interface MTBEventType
  {
    /** The event type id. */
    id: number;
    /** The event type name. */
    name: string;
    /** The event type description. */
    description: string;
    /** The event type icon. */
    icon: string;
    /** The default duration. */
    duration: number;
    /** Specifies whether to show the event type in the offer section. */
    offer?: boolean;
  }
}