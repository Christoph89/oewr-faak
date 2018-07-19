/*! OEWR - pages/page-events.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="pages.ts" />
"use strict";

module $oewr.$pages
{
  /** Timeline page. */
  export class PageEvents extends Page
  {
    /** Initializes the page */
    constructor(name: string, pageCnt: JQuery, wait: JQueryDeferred<Page>)
    {
      super(name, pageCnt, wait);

      // get timeline element
      this.timelineCnt=$("#event-timeline");

      // wait for meta/events
      $data.waitEvents.done(() => 
      {
        // init timeline
        this.initTimeline(true);

        // ready
        wait.resolve(this);
      })
      .fail(() => { wait.reject(); });

      // reinit on data or session change
      $data.change(() => { this.initTimeline(false); });
    }

    private timelineCnt: JQuery;
    private timeline: $ui.Timeline;
    private timelineItems: { event: MTBEvent, item: JQuery }[];

    /** Loads the timeline page */
    public load(wait: JQueryDeferred<Page>)
    {
      // init blocks on first load
      if (!this.timeline.hasBlocks())
        this.timeline.initBlocks();

      // show/hide blocks
      this.timeline.refreshBlocks();

      // loaded
      wait.resolve(this);
    }

    /** Initializes the event search form. */
    private initForm()
    {
      // init ui
      $ui.init($("form", this.pageCnt));

      // init from date
      $("input#event-from-date", this.pageCnt).val((new Date()).toISOString().substr(0, 10));

      // init tour select
      var typeSelect=$("select#event-type", this.pageCnt);
      $q(<Object>$res.eventTypes).ForEach(x => {
        var type=<MTBEventType>MTBEventTypes[x.Key];
        typeSelect.append('<option value="'+type.id+'">'+type.description+'</option>');
      });

      // set change event
      $("input,select", this.pageCnt).change(() => this.filterTimeline());
    }

    private initTimeline(initial: boolean)
    {
      // append events
      this.appendEvents();

      // init ui, search form and timeline
      $ui.init(this.timelineCnt.parent());
      if (initial) this.initForm();
      this.timeline=this.timelineCnt.timeline();
      this.filterTimeline();
    }

    /** Appends all events. */
    private appendEvents()
    {
      this.timelineCnt.empty();
      this.timelineItems=$q($data.events).Where(ev => ev.isOccurrence() && (ev.status()==MTBEventStatus.TakesPlace || $ctx.session.isAdmin())).Select(ev => <any>{
        event: ev,
        item: this.getTimelineItem(ev)
      }).ToArray();
      this.timelineCnt.append($q(this.timelineItems).Select((x, i) => x.item.toggleClass("even", i%2!=0)).ToArray());
    }

    /** Filters the events by the criteria specified in the search form. */
    private filterTimeline()
    {
      var v: any;
      var fromDate=(v=$("#event-from-date").val())?moment(v):null;
      var toDate=(v=$("#event-to-date").val())?moment(v):null;
      var type=$("#event-type").val();
      var level=MTBLevel.Everyone 
        | ($("#event-level-beginner").is(":checked")?MTBLevel.Beginner:MTBLevel.Everyone)
        | ($("#event-level-advanced").is(":checked")?MTBLevel.Advanced:MTBLevel.Everyone);
        
      var visible=0;
      $q(this.timelineItems).ForEach(x =>
      {
        var ev=x.event;
        var hide=fromDate && ev.from()<fromDate
          || toDate && ev.to()>toDate
          || type && type!="all" && ev.typeId()!=type
          || level<MTBLevel.All && ev.level()!=MTBLevel.Everyone && (ev.level()&level)==0;
        x.item.toggleClass("hidden", hide);
        if (!hide) 
        {
          x.item.toggleClass("even", visible%2!=0).toggleClass("first-child", visible==0);
          visible++;
        }
      });

      // show/hide blocks
      this.timeline.refreshBlocks();
    }

    /** Returns a timeline item. */
    private getTimelineItem(event: MTBEvent): JQuery
    {
      var price=event.priceText();
      var eventUrl=(<string>$res.events.eventUrl).format(event.eventId());
      var editUrl="#/cmd/edit-event?id="+event.eventId();
      return $('<div class="timeline-block" eventId="'+event.eventId()+'">'+
        '<div class="timeline-img bg-color-'+this.getLevelColor(event)+'" title="'+event.type().name+'">'+
          '<span class="icon style2 major '+event.type().icon+'"></span>'+
        '</div>'+
        '<div class="timeline-content">'+
          '<h3>'+event.name()+'<br /><code><span class="icon fa-money"></span> '+price+'</code></h3>'+
          '<p>'+
            '<img src="'+event.img()+'" />'+
            '<strong>'+
              $util.formatFromTo(event.from(), event.to(), $res.events.dateFormat, $res.events.multiDayFormat)+
              "<br />"+$res.events.level+": "+$res.level[MTBLevel[event.level()]]+
            '</strong><br /><br />'+
            event.shortDescription()+
          '</p><br style="clear: both;" />'+
          '<a href="'+eventUrl+'" class="button special icon fa-pencil">'+$res.events.details+'</a> '+
          '<a href="'+editUrl+'" class="button icon fa-pencil role-admin">'+$res.events.edit+'</a>'+
          '<span class="date">'+$util.formatDate(event.from(), $res.events.fromFormat)+'</span>'+
        '</div>'+
      '</div>').data("event", event);
    }

    /** Returns the color for the specified event's level. */
    private getLevelColor(event: MTBEvent)
    {
      switch (event.level())
      {
        case MTBLevel.Beginner: return "green";
        case MTBLevel.Advanced: return "orange";
        default: return  "blue";
      }
    }
  }
}