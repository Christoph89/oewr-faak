/*! OEWR - cfg.ts
* Copyright Christoph Schaunig 2018
*/

"use strict";

module $oewr
{
  /** The app resource. */
  export var $res: any;

  /** The app config. */
  export module $cfg
  {
    /** The app root path. */
    export var root: string;
    /** The app language. */
    export var lang: string;
    /** Specifies the amount of news events */
    export var shownEvents: number;
    /** Specifies whether registration is allowed. */
    export var allow_reg: boolean;
    /** Gets all page infos. */
    export var pages: { [name: string]: PageInfo };
    /** Gets the app resource. */
    export var res: any;
    /** Gets the app context config. */
    export var ctx:
    {
      /** The context api key. */
      apikey: string;
      /** The base url of the rest service. */
      baseurl: string;
      /** The database name. */
      db: string;
    }
    /** Gets the email config. */
    export var email:
    {
      /** Gets the predefined bcc recipients. */
      bcc: IEmailRecipient[]
    }
    /** Gets the role map. */
    export var roles: any;
    /** Gets the access control object. */
    export var access: any;

    /** Initializes the app config. */
    export function init(cfg: any)
    {
      $.extend(this, cfg);
      $res=cfg.res;
      localize();
      addPageSynonyms();
    }

    /** Localizes the app config/data */
    function localize()
    {
      // localize event types
      $q(MTBEventTypes).ForEach(x => $.extend(x.Value, $res.eventTypes[x.Key]));

      // localize moment
      moment.locale($cfg.lang);
    }

    /** Adds all page synonyms. */
    function addPageSynonyms()
    {
      // add page synonyms
      $q($cfg.pages).ForEach(p => 
      {
        $q((<PageInfo>p.Value).synonyms).ForEach(s => 
        {
          $cfg.pages[s]=<PageInfo>{
            name: s,
            preload: false,
            synonyms: [],
            synname: p.Key
          };
        });
      });
    }
  }
}