/*! OEWR - pages/page-event.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="pages.ts" />
"use strict";

module $oewr.$pages
{
  /** Specifies an event date. */
  interface EventDate
  { 
    /** The from date. */
    from: moment.Moment;
    /** The to date. */ 
    to: moment.Moment; 
  }

  /** Event page. */
  export class PageEventEdit extends Page
  {
    /** Initializes the page */
    constructor(name: string, pageCnt: JQuery, wait: JQueryDeferred<Page>)
    {
      super(name, pageCnt, wait);
      var that=this;

      // init input fields
      var inputs=["type", "level", "name-de", "name-en", 
        "short-descr-de", "short-descr-en", "descr-de", "descr-en",
        "requirements-de", "requirements-en", "from", "to"];
      $q(inputs).ForEach(x => { this[x.replace(/-/g, "_")]=this.input(x); });

      // init images
      this.img=$(".event-img", pageCnt).click(function () 
      {
        $(".event-img.selected", pageCnt).removeClass("selected");
        $(this).addClass("selected");
      });

      // init dates table
      this.input("from").change(function() { that.copyFromDate($(this)); });
      this.datesTbl=$("table.dates", pageCnt);
      $("a.add-date", this.datesTbl).click(() => this.addDate());

      // init save button
      $("a.button.save", this.pageCnt).click(() => 
      {
        this.save(); 
      });

      // init ui
      $ui.init(pageCnt);

      // wait for map ready
      (<JQueryPromise<any>>$(".map", this.pageCnt).data("gmap_promise")).done(() => 
      {
        // get map marker
        this.mapMarker=$(".map", this.pageCnt).data("gmap_markers")[0];

        // ready
        wait.resolve(this);
      });
    }

    // input fields/controls
    private mode: "add"|"edit";
    private type: JQuery;
    private level: JQuery;
    private name_de: JQuery;
    private name_en: JQuery;
    private priceType: JQuery;
    private price: JQuery;
    private short_descr_de: JQuery;
    private short_descr_en: JQuery;
    private descr_de: JQuery;
    private descr_en: JQuery;
    private requirements_de: JQuery;
    private requirements_en: JQuery;
    private img: JQuery;
    private datesTbl: JQuery;
    private from: JQuery;
    private to: JQuery;
    private mapMarker: any;

    private occurrences: MTBEvent[];
    private event: MTBEvent;
    private series: MTBEvent;

    /** Called when the page gets loaded. */
    public load(wait: JQueryDeferred<Page>)
    { 
      //get/set page mode
      this.pageCnt.attr("mode", this.mode=<any>$url.dest||"edit");

      // get edit event
      if (this.mode=="edit")
      {
        // ger event id
        var eventId=parseInt($url.args.id);
        if (eventId==null || isNaN(eventId))
          return wait.reject("Missing event id!");

        // get event
        this.event=$data.eventMap.Get(eventId);
        if (!this.event)
          return wait.reject("Missing event "+eventId);

      }
      else
        this.event=new MTBEvent(<any>{});

      // get series
      this.series=this.event.series();

      // init fields
      this.initInputFields(this.event);

      // ready
      if (wait) wait.resolve(this);
    }

    private isSeries(): boolean
    {
      return this.series===this.event;
    }

    private initInputFields(event: MTBEvent)
    {
      this.input("name-de").val(event.name_de());
      this.input("name-en").val(event.name_en());
      var type=event.type() || MTBEventTypes.TechniqueTraining;
      this.input("type").val(type.name);
      var status=event.status() || MTBEventStatus.TakesPlace;
      this.input("status").val(MTBEventStatus[status]);
      var level=event.level();
      this.input("level", "[value="+MTBLevel[level]+"]").click();
      this.input("price-type", "[value="+(event.isErlebniscard()?"erlebniscard":"price")+"]").click();
      if (!event.isErlebniscard()) this.input("price").val(parseInt(event.price()));
      this.input("max-participants").val(event.maxParticipants() || (this.mode=="add"?6:0));
      this.input("allow-reg").val(event.allowReg().toString());
      this.input("short-descr-de").val(event.shortDescription_de());
      this.input("short-descr-en").val(event.shortDescription_en());
      this.input("descr-de").val(event.description_de());
      this.input("descr-en").val(event.description_en());
      this.input("requirements-de").val(event.requirements_de());
      this.input("requirements-en").val(event.requirements_en());
      var img=event.img(false);
      $(".event-img"+(img?"[value='"+img+"']":".first"), this.pageCnt).click();
      this.input("meeting-point-description").val(event.meetingPointDescription());
      var latLng=new google.maps.LatLng(event.lat(), event.lng());
      this.mapMarker.setPosition(latLng);
      var from=event.from();
      if (from) this.input("from").val(from.format("YYYY-MM-DDTHH:mm"));
      var to=event.to();
      if (to) this.input("to").val(to.format("YYYY-MM-DDTHH:mm"));
      this.occurrences=event.occurrences();
      $("table.dates tbody", this.pageCnt).toggle(this.isSeries());
      $(".add-date", this.pageCnt).toggle(this.isSeries());
      $(".button.edit-series", this.pageCnt).attr("href", "#/event/edit?id="+event.parentId()).toggle(event.parentId()!=null);
      $(".button.delete", this.pageCnt).click(() => 
      { 
        // exec delete event cmd
        $cmd.exec("delete-event", { id: event.eventId() }).done(() => 
        {
          // goto events page
          $app.hashChange("#/events");
        }); 
      });
      this.refreshDatesTbl();
    }

    /** Adds the date from the event date row. */
    private addDate()
    {
      var from=moment(this.from.val());
      var to=moment(this.to.val());
      if (!from.isValid())
        return alert("Invalid from date!");
      if (!to.isValid())
        return alert("Invalid to date!");
      if ($q(this.occurrences).Any(x => x.from().isSame(from) && x.to().isSame(to) && x.status()!=MTBEventStatus.Deleted))
        return  alert("Duplicate date");
      // try get existing deleted occurence
      var existing=$q(this.series.occurrences()).FirstOrDefault(null, x => x.from().isSame(from) && x.to().isSame(to));
      if (existing) existing.state.status=MTBEventStatus.TakesPlace;
      this.occurrences.push(existing || new MTBEvent({
        from: from.toISOString(),
        to: to.toISOString()
      }));
      this.refreshDatesTbl();
    }

    /** Refreshes the dates table. */
    private refreshDatesTbl()
    {
      // dates should occur only once
      this.occurrences=$q(this.occurrences).Distinct(x => x.from().toISOString()+"-"+x.to().toISOString()).ToArray();

      var tbody=$("tbody", this.datesTbl).empty();
      $q(this.occurrences).OrderBy(x => x.from()).ForEach(x => {
        if (x.status()!=MTBEventStatus.Deleted)
          tbody.append(this.getDateRow(x));
      });
    }

    private getDateRow(occurrence: MTBEvent)
    {
      var row: JQuery;
      var that=this;
      return (row=$("<tr>")).data("event", occurrence).append(
        // from date
        $("<td>").addClass("event-from").text(occurrence.from().format($res.event.edit.dateFormat)).change(function () { that.copyFromDate($(this)); }),
        // to date
        $("<td>").addClass("event-to").text(occurrence.to().format($res.event.edit.dateFormat)),
        // buttons
        $("<td>").append(
          // repeat next week button
          $("<a>").addClass("icon style2 fa-repeat").attr("title", $res.event.edit.repeat).click(() =>
          {
            this.from.val(occurrence.from().clone().add(7, "days").format("YYYY-MM-DDTHH:mm"));
            this.to.val(occurrence.to().clone().add(7, "days").format("YYYY-MM-DDTHH:mm"));
            this.addDate();
            this.refreshDatesTbl();
          }),
          // edit button
          $("<a>").addClass("icon style2 fa-pencil mode-edit").click(() =>
          {
            $app.hashChange($res.event.edit.occurrenceUrl.format(occurrence.eventId()))
          }),
          // remove button
          $("<a>").addClass("icon style2 fa-minus").click(() =>
          {
            // set deleted
            occurrence.state.status=MTBEventStatus.Deleted;
            // refresh dates table
            this.refreshDatesTbl();
          })
        )
      );
    }

    /** Copies the from-date to the to-date input field. */
    private copyFromDate(from: JQuery)
    {
      var val=from.val();
      if (!val)
        return;
      var type=MTBEventTypes[<any>this.input("type").val()];
      from.parent().next().find("input[name=event-to]").val(moment(val).add(type.duration, "hours").format("YYYY-MM-DDTHH:mm"));
    }

    /** Gets the specified input element by name. */
    private input(name: string, state?: string)
    {
      return $("[name=event-"+name+"]"+(state||""), this.pageCnt);
    }

    /** Returns the event object from the input. */
    private getState(): IMTBEvent
    {
      if (this.isSeries() && this.occurrences.length==0)
        return null;
      var state: IMTBEvent;
      if (this.isSeries())
        state=this.series? this.series.state : { parentId: null, from: null, to: null };
      else
      {
        state=this.event.state;
        state.from=moment(this.from.val()).format("YYYY-MM-DDTHH:mm");
        state.to=moment(this.to.val()).format("YYYY-MM-DDTHH:mm");
      }
      state.type=MTBEventTypes[<any>this.input("type").val()].id;
      state.status=MTBEventStatus[<string>this.input("status").val()];
      state.name=<string>this.input("name-de").val();
      state.name_en=<string>this.input("name-en").val();
      state.shortDescription=<string>this.input("short-descr-de").val();
      state.shortDescription_en=<string>this.input("short-descr-en").val();
      state.description=<string>this.input("descr-de").val();
      state.description_en=<string>this.input("descr-en").val();
      state.requirements=<string>this.input("requirements-de").val();
      state.requirements_en=<string>this.input("requirements-en").val();
      state.price=this.getPrice();
      state.max_participants=parseInt(<string>this.input("max-participants").val());
      state.allow_reg=parseInt(<string>this.input("allow-reg").val()) || 0;
      state.level=MTBLevel[<string>this.input("level", ":checked").val()];
      state.img=$(".event-img.selected", this.pageCnt).attr("value");
      state.meeting=this.getMeetingPoint();
      return state;
    }

    /** Returns all event occurences. */
    private getOccurrences(series: MTBEvent): IMTBEvent[]
    {
      return $q(this.occurrences).Select(x => 
      {
        x.state.parentId=series.eventId();
        return x.state;
      }).ToArray();
    }

    /** Gets the price. */
    private getPrice(): string
    {
      var type=this.input("price-type", ":checked").val();
      if (type=="erlebniscard")
        return MTBEvent.ErlebniscardPrice;
      return <string>this.input("price").val();
    }

    /** Gets the meeting point. */
    private getMeetingPoint(): string
    {
      var pos=this.mapMarker.getPosition();
      var descr=<string>this.input("meeting-point-description").val();
      return pos.lat()+"/"+pos.lng()+"/"+descr;
    }

    /** Saves (inserts or updates) the event. */
    private save()
    {
      // check if date has been added
      if (this.occurrences.length==0 && this.input("from").val() && this.input("to").val())
        $("a.add-date", this.pageCnt).click();

      // get series state
      var state=this.getState();
      
      // show loader
      $ui.loader.show(); 

      // insert/update main event
      $ctx.db.event[this.mode=="add"?"insert":"update"](state).done(event => 
      {
        // saved single event
        if (!this.isSeries())
        {
          $ui.loader.hide(); // hide loader
          $data.change(); // trigger data change event
          // go to edit page
          if (this.mode=="add")
            $app.hashChange("#/event/edit?id="+event.eventId());
          return;
        }
        // else saved series

        // insert/update/delete other occurences
        var occurences=this.getOccurrences(event);
        var insert=$q(occurences).Where(x => x.eventId==null || x.eventId==0).ToArray();
        var update=$q(occurences).Where(x => x.eventId!=null).ToArray();

        $.when(
          insert.length?$ctx.db.event.insert(insert):$.Deferred<any>().resolve().promise(),
          update.length?$ctx.db.event.update(update):$.Deferred<any>().resolve().promise()
        ).done((created, updated) => 
        {
          // add events to data
          if (this.mode=="add") created=[event].concat(created);
          if (created && created.length) $data.addEvent(created);
          else $data.change(); // trigger data change event

          // go to edit page
          if (this.mode=="add")
            $app.hashChange("#/event/edit?id="+event.eventId());
        })
        .always(() => { $ui.loader.hide(); }); // hide loader
      }).fail(() => { $ui.loader.hide(); }); // hide loader
    }
  }
}