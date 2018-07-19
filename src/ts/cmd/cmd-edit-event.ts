/*! OEWR - cmd/cmd-edit-event.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="../ref.d.ts" />
"use strict";

module $oewr.$cmd
{
  /** Sign out command. */
  export class CmdEditEvent
  {
    /** Executes the command. */
    public exec(args: any) : JQueryPromise<any>
    {
      // get event id
      var eventId=parseInt(args.id);
      if (eventId==null || isNaN(eventId))
        return $.Deferred<any>().reject("Missing id!").promise();
      
      // get event
      var event: MTBEvent=$data.eventMap.Get(eventId);
      if (!event)
        return $.Deferred<any>().reject("Missing event with id "+eventId+"!").promise();

      // choose between series and occurrence
      return $app.choice($res.cmdEditEvent).done(res =>
      {
        var id=res=="series"?event.seriesId():event.eventId();
        $app.hashChange("#/event/edit?id="+id);
      });
    }
  }
}