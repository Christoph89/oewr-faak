/*! OEWR - ui-menu.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="ui.ts" />
"use strict";

module $oewr.$ui.menu
{
  var mbtn=$("#menu-btn");
  var menu=$("#menu");

  /** Initializes the menu. */
  export function init()
  {
    // init links
    $ui.link.init(menu);

    // toggle menu on menu button click
    mbtn.click(function () {
      if ($main.hasClass("menu-opened"))
        close();
      else
        open();
    });

    // close menu when clicking outside of the inner container
    menu.click(function (e) {
      var target=$(e.target);
      if (target.attr("id")=="menu" || target.hasClass("icon"))
        close();
    });
  }

  /** Opens the menu. */
  export function open() 
  {
    mbtn.addClass("fa-close").removeClass("fa-bars");
    $main.addClass("menu-opened").addClass("no-scroll");
    menu.addClass("opened");
  }

  /** Closes the menu. */
  export function close() 
  {
    mbtn.addClass("fa-bars").removeClass("fa-close");
    $main.removeClass("menu-opened").removeClass("no-scroll");
    menu.removeClass("opened");
  }
}