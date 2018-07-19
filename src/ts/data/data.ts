/*! OEWR - data/data.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="../ref.d.ts" />
/// <reference path="data-eventtype.ts" />
/// <reference path="data-event.ts" />
/// <reference path="data-registration.ts" />
/// <reference path="data-email.ts" />
"use strict";

module $oewr.$data
{
  export var waitEvents: JQueryPromise<MTBEvent[]>;
  export var events: MTBEvent[];
  export var eventMap: linq.Dictionary<MTBEvent>;

  /** Initializes all app data. */
  export function init(): JQueryPromise<any>
  {
    if ($doc.hasClass("no-data"))
    {
      waitEvents=$.Deferred().resolve().promise();
      return $.Deferred().resolve().promise();
    }

    return $.when(
      // load events
      (waitEvents=$ctx.db.event.q().orderBy("from asc").find())
        .then((res => 
        {
          events=res;
          refreshEventMap();
        }))
    )
  }

  /** Registers or executes the data change event. */
  export function change(handler?: () => any)
  {
    if (!handler)
      $doc.trigger("data-change");
    else
      $doc.bind("data-change", handler);
  }

  function refreshEventMap()
  {
    eventMap=$q(events).ToDictionary(x => x.state.eventId, x => x)
  }

  /** Adds the specified event(s). */
  export function addEvent(event: MTBEvent|MTBEvent[])
  {
    if (!Array.isArray(event)) event=[event];
    events=$q(events).Concat(event).OrderBy(x => x.from()).ToArray();
    refreshEventMap();
    change(); // trigger change event
  }

  /** Adds the specified event(s). */
  export function deleteEvent(event: MTBEvent|MTBEvent[])
  {
    var arr: MTBEvent[]=Array.isArray(event)?event:[event];
    events=$q(events).Where(x => !$q(arr).Any(e => e.eventId()==x.eventId())).ToArray();
    refreshEventMap();
    change(); // trigger change event
  }
}