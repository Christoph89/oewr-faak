/*! OEWR - ui-timeline.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="ui.ts" />
"use strict";

/** JQuery timelien extension */
interface JQuery
{
  timeline(): $oewr.$ui.Timeline;
}

module $oewr.$ui
{
  /** JQuery timeline extension */
  $.fn.timeline=function() 
  {
    return this.data("timeline");
  };

  export module timeline
  {
    export function init(context?: JQuery)
    {
      $(".timeline", context).each((i, el) =>
      {
        new Timeline($(el));
      })
    }
  }

  export class Timeline
  {
    /** Initializes a new instance of Timeline */
    constructor(el: JQuery)
    {
      this.element=el.data("timeline", this);
      this.page=$util.getPage(this.element);
      this.initBlocks();
      this.initScrolling();
      $ui.link.init(el);
    }

    /** Offset for show/hide blocks; */
    public static offset=0.8;

    /** The timeline element. */
    public element: JQuery;
    /** The timeline blocks. */
    public blocks: JQuery;
    /** The timeline page wrapper parent. */
    public page: $pages.Page;

    private initScrolling()
    {
      this.hideBlocks();
      $window.on("scroll", () =>
      {
        if (!this || !this.hasBlocks() || !this.pageIsActive())
          return;
        if (!window.requestAnimationFrame) 
          setTimeout(() => { this.showBlocks(); }, 100)
        else
          window.requestAnimationFrame(() => { this.showBlocks(); });
      });
    }

    /** Returns whether the timeline has blocks. */
    public hasBlocks(): boolean
    {
      return this.blocks && this.blocks.length>0;
    }

    /** Returns whether the timeline's page is active. */
    public pageIsActive(): boolean
    {
      return this.page && this.page.pageCnt.hasClass("current");
    }

    /** Initializes the blocks. */
    public initBlocks()
    {
      this.blocks=$('.timeline-block', this.element);
    }

    /** Hides timeline blocks which are not on the viewport. */
    public hideBlocks()
    {
      this.blocks.each((i, el) =>
      {
        this.hideBlock($(el));
      });
    }

    /** Shows timeline blocks which are on or near the viewport. */
    public showBlocks()
    {
      this.blocks.each((i, el) =>
      {
        this.showBlock($(el));
      });
    }

    /** Refreshes (show/hides) all blocks. */
    public refreshBlocks()
    {
      this.blocks.each((i, el) =>
      {
        var block=$(el);
        this.hideBlock(block);
        this.showBlock(block);
      });
    }

    private hideBlock(block: JQuery)
    {
      if (block.offset().top > $window.scrollTop()+$window.height()*Timeline.offset) 
        block.find('.timeline-img, .timeline-content').addClass('is-hidden');
    }

    private showBlock(block: JQuery)
    {
      if (block.offset().top <= $window.scrollTop()+$window.height()*Timeline.offset && block.find('.timeline-img').hasClass('is-hidden') ) 
        block.find('.timeline-img, .timeline-content').removeClass('is-hidden').addClass('bounce-in');
    }
  }
}