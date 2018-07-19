/*! OEWR - pages/page-event.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="pages.ts" />

"use strict";

declare var grecaptcha: any;

module $oewr.$pages
{
  /** Event page. */
  export class PageEvent extends Page
  {
    /** Initializes the page */
    constructor(name: string, pageCnt: JQuery, wait: JQueryDeferred<Page>)
    {
      super(name, pageCnt, wait);

      // wait for meta/events
      $data.waitEvents.done(() => 
      {
        // init ui
        $ui.init(pageCnt);

        // init submit button
        $("#reg-submit").click((e) => 
        {
          e.preventDefault();
          var reg=this.validateReg();
          if (reg)
          {
            $ui.loader.show();
            grecaptcha.reset();
            this.recaptcha=$.Deferred<any>();
            this.recaptcha.done(token => { this.submitReg(token, reg); });
            grecaptcha.execute(); // execute recaptcha
          }
        });

        // wait for map ready
        (<JQueryPromise<any>>$(".map", this.pageCnt).data("gmap_promise")).done(() => 
        {
          // get map marker
          this.mapMarker=$(".map", this.pageCnt).data("gmap_markers")[0];

          // ready
          wait.resolve(this);
        });
      });
    }

    /** Google maps marker */
    private mapMarker: any;
    /** The current event. */
    public event: MTBEvent;
    /** The registrations the use is allowed to see for the current event. */
    public registrations: IMTBEventRegistration[];
    /** The amount of registrations. */
    public regcount: number;
    /** Google recaptcha promise */
    public recaptcha: JQueryDeferred<any>;

    /** Called when the page gets loaded. */
    public load(wait: JQueryDeferred<Page>)
    { 
      // get url args
      var eventId=parseInt($url.args.id);

      // check if eventId and date is set
      if (!eventId)  
      {
        if (wait) wait.reject("Missing eventId and/or date!");
        return;
      }

      // get event
      var event=this.event=$data.eventMap.Get(eventId);
      if (!event)
      {
        if (wait) wait.reject("Event not found for '"+$url.hash+"'!");
        return;
      }

      // load registrations
      $ctx.getRegistrations(eventId).done(res => 
      {
        // set registrations and count
        this.registrations=res.registrations;
        this.regcount=res.count||0;

        // init details and reg form
        this.initUI(event);

        // ready
        if (wait) wait.resolve(this);
      });
    }

    /** Initialiazes the event */
    private initUI(event: MTBEvent)
    {
      this.initDetails(event);
      this.initRegForm(event);
    }

    /** Initializes the event details with the specified event data. */
    private initDetails(event: MTBEvent)
    {
      var res=$res.event.details;
      var get=(n) => $(".event-"+n, this.pageCnt);

      // set name
      get("name").text(event.name());

      // set description
      get("description").text(event.description());

      // set image
      get("img").attr("src", event.img());

      // set date
      var dateStr=$util.formatFromTo(event.from(), event.to(), $res.event.details.dateFormat);
      get("date").html(res.date.format(dateStr));

      // set level
      get("level").html(res.level.format(event.levelDescription()))

      // set meeting point
      var startTime=event.from().format(res.meetingTimeFormat);
      get("meeting").html(res.meeting.format(startTime, event.meetingPointDescription()));

      // set max participants
      get("participants").html(res.participants.format(event.maxParticipants()))

      // set price
      var price=event.isErlebniscard()?res.erlebniscardPrice:res.price.format(event.priceAsNr());
      get("price").html(price);

      // set map marker
      this.mapMarker.setPosition(new google.maps.LatLng(event.lat(), event.lng()));

      // set access classes
      this.pageCnt.toggleClass("erlebniscard", event.isErlebniscard());
      this.pageCnt.toggleClass("allow-reg", event.isRegAllowed());

      // set requirements
      this.setRequirements(event);
    }

    /** Sets the requirements for the specified event. */
    private setRequirements(event: MTBEvent)
    {
      var requirements: string[]=[];
      var lines=$q((event.requirements()||"").split("\n")).Select(x => x.trim()).ToArray();
      var addDefault=lines[0]!="!";
      var text=$q(lines).FirstOrDefault(null, x => x[0]!="*") || $res.requirements[event.type().name].text;
      var customReq=$q(lines).Where(x => x[0]=="*").ToArray();
      
      // add default requirements
      if (addDefault)
      {
        var i=0;
        while (true)
        {
          var dreq=$res.requirements[event.type().name][i.toString()];
          if (!dreq)
            break;
          requirements.push(dreq);
          i++;
        }
      }
      else if (customReq[0]=="!")
        customReq=$q(customReq).Skip(1).ToArray();

      // add custom requirements
      requirements=requirements.concat(customReq);

      // set text
      $(".event-requirements-text", this.pageCnt).html($util.formatMd(text));

      // set requirements
      $(".event-requirements", this.pageCnt).empty().append($q(requirements).Select(r => $("<li>"+$util.formatMd($util.trimStart(r, "*").trim())+"</li>")).ToArray());
    }

    private initRegForm(event: MTBEvent)
    {
      // set remaining regs
      var remainingLbl=$("#reg-remaining", this.pageCnt);
      var remaining=Math.max(0, event.maxParticipants() - this.regcount);
      remainingLbl.text(remaining);
      this.pageCnt.toggleClass("regs-remaining", remaining>0);

      // prefill phone and accomodation for partners
      if ($ctx.session.isPartner())
      {
        var cur=$ctx.session.profile;
        $("#reg-email", this.pageCnt).val(cur.email);
        $("#reg-phone", this.pageCnt).val(cur.phone)
        $("#reg-accommodation", this.pageCnt).val(cur.name);
      }

      // set reg table
      this.pageCnt.toggleClass("see-regs", this.registrations!=null);
      var table=$("section.registrations table tbody", this.pageCnt);
      table.empty().append($q(this.registrations).Select((x, i) => this.getRegRow(x, i)).ToArray())
    }

    /** Returns a registration row. */
    private getRegRow(reg: IMTBEventRegistration, idx: number): JQuery
    {
      var res=$res.event.details;
      var isOwnReg=$ctx.session.isAdmin() || $ctx.session.isPartner() && reg.createdBy===$ctx.session.current.email;
      var isValid=(idx+1)<=this.event.maxParticipants();
      var isActive=reg.status==MTBRegistrationStatus.Active;
      var setStatus=isActive?MTBRegistrationStatus.Canceled:MTBRegistrationStatus.Active;
      var setType=isActive?"cancel":"reactivate";
      return $("<tr>").toggleClass("error", !isValid).toggleClass("canceled", !isActive)
        .append(
        $("<td>").text(moment(reg.created).format(res.regDateFormat)).attr("title", res.regBy.format(reg.createdBy)),
        $("<td>").text(reg.name),
        $("<td>").text(reg.email),
        $("<td>").text(reg.phone),
        $("<td>").text(reg.age || "***"),
        $("<td>").text(reg.accommodation),
        $("<td>").append(
          // cancel button
          $("<a>").addClass("icon style2 "+(isActive?"fa-close":"fa-check role-admin")).attr("title", res[setType+"Reg"]).toggleClass("disabled", !isOwnReg)
            .click(() => 
            { 
              $cmd.exec("delete-registration", $.extend({}, reg, { force: false, status: setStatus })).done(() => 
              {
                reg.status=setStatus;
                if (setStatus==MTBRegistrationStatus.Canceled) this.regcount--;
                else this.regcount++;
                this.initRegForm(this.event);
              }); 
            }),  
          // delete button
          $("<a>").addClass("icon style2 fa-trash role-admin").attr("title", res.deleteReg).toggleClass("disabled", !isOwnReg)
            .click(() => 
            { 
              $cmd.exec("delete-registration", $.extend({}, reg, { force: true })).done(() => 
              {
                this.registrations=$q(this.registrations).Where(x => x.regId!=reg.regId).ToArray();
                this.regcount--;
                this.initRegForm(this.event);
              }); 
            }),  
        )
      );
    }

    /** Gets the registration data from the form. */
    private getReg(): IMTBEventRegistration
    {
      var reg: IMTBEventRegistration={};
      var get=(n) => (<string>$("#reg-"+n, this.pageCnt).val()).trim()||null;
      reg.eventId=this.event.eventId();
      reg.name=get("name");
      reg.email=get("email");
      reg.phone=get("phone");
      reg.age=parseInt(get("age")) || 0;
      reg.accommodation=get("accommodation");
      reg.status=MTBRegistrationStatus.Active;
      return reg;
    }

    /** Validates the registration input. */
    private validateReg(): IMTBEventRegistration
    {
      var reg=this.getReg();
      var required=(n) => $("#reg-"+n, this.pageCnt).toggleClass("error", reg[n]==null);
      required("name");
      required("email");
      required("phone");
      var agreementChb=$("#reg-agreement", this.pageCnt);
      var agreed=agreementChb.is(":checked");
      agreementChb.toggleClass("error", !agreed);
      if ($("input.error", this.pageCnt).length>0)
        return null;
      return reg;
    }

    /** Validates the registration input. */
    private submitReg(token: string, reg: IMTBEventRegistration): void
    {
      var email: IEmail={
        template: "registration_"+$cfg.lang,
        to: [{ name: reg.name, email: reg.email }],
        bcc: $cfg.email.bcc||[],
        location_origin: location.origin
      };

      // add current user to bcc
      var cur=$ctx.session.current;
      if (cur && cur.email && !$q(email.bcc).Any(x => x.email==cur.email))
        email.bcc.push({ name: cur.first_name+" "+cur.last_name, email: cur.email });

      $ctx.register(reg, token, email)
        .always(() => $ui.loader.hide())
        .done(newReg => 
        {
          // add reg
          if (this.registrations)
            this.registrations.push(newReg); // only add if allowed to see
          this.regcount++;
          this.initUI(this.event);
          this.setRegMsg($res.event.details.regSuccess, false);
        })
        .fail(err => 
        {
          this.setRegMsg($res.event.details.regFail, true);
        });
    }

    private setRegMsg(msg: string, err: boolean)
    {
      $("p.msg", this.pageCnt).toggleClass("error", err).toggleClass("success", !err).text(msg);
    }
  }
}