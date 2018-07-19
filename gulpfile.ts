import * as fs from "fs";
import * as $p from "path";
import * as $ from "gulp-web-build";

/** Set meta log. */
$.logMeta((logLevel, lvl, meta) => lvl!="error"?JSON.stringify(meta, (key, val) =>
{
  if (logLevel!="silly" && (key=="res" || key=="data"))
    return "...[use silly log]";
  return val;
}, "  "):(meta?meta.toString():""));

/** Installs all dependencies and prepares the project. */
$.task("prep", function (cb) {
  new $.VSCode()
    .exclude(
      "docs",
      "docs_debug",
      "LICENSE.txt",
      ".editorconfig")
    // exclude all paths from .gitignore
    .excludeGitIgnores()
    // add all gulp task runners to vsc
    .addGulpTasks() 
    // add debuggers to vsc
    .addDebugger($.VSCodeDebuggers.Gulp())
    // don't forget to run
    .run(cb);
});

// adds build tasks
function add(mode: string, lang: string="de") {
  $.task("build-"+mode+"-"+lang, function (cb) {
    var cfg: any={ src: "./src" };
    new $.Build(cfg)
      .config("./cfg.json", ["<common", "client", "<"+mode+"-"+lang])
      .config("res=%src/res/**/"+lang+"*.json")
      .config(getPages)
      .config(getClientCfg)
      .add("%vendor", "%dest/js/vendor.js") // copy and join vendor scripts
      .add("%iframeResizer", "%dest/js") // copy iframeResizer
      .add("%styles", "%dest/css") // copy pure css styles
      .add("%fonts", "%dest/fonts") // copy fonts
      .addTpl("%html", "%src/", "%dest", cfg) // build html templates 
      .addTpl("%pages", "%src/", "%dest/pages", cfg) // build page templates
      .add("%tpl", "%dest") // copy cname, robots.txt, favicon,...
      .addFile(b => cfg.cname, "CNAME", "%dest")
      .add("%images", "%dest/img") // copy images
      .addTs("%typescript", "%dest/js/app.js") // build main ts  
      .addScss("%scss", "%dest/css") // build scss
      .add("%forms", "%dest/forms") // copy forms
      .addJson("%src/res/events.json", "%dest/data") // copy events
      .run(cb);
  });
  // @@lng if (lang=="de") add(mode, "en");
  /* @@lng else */ $.task("build-"+mode, ["build-"+mode+"-de"/* @@lng, "build-"+mode+"-en"*/]);
};

/** Builds the project unminified with sourcemaps. */
add("dbg"); add("release");
$.task("build", ["build-dbg"]);
$.task("release", ["build", "build-release"]);

/** Cleans the project. */
$.task("clean", function (cb) {
  new $.Clean()
    .delVSCodeExcludes("node_modules")
    .del("./docs", "./docs_debug")
    .run(cb);
});

/** Rebuilds the project. */
$.task("rebuild", $.series("clean", "build"));


/** Returns all pages. */
function getPages(b: $.Build) : any
{
  return {
    htmlPages: $.linq.from(fs.readdirSync(b.cfg.pageDir)||[])
    .where(f => (<any>f).endsWith(".html"))
    .select(function (f) { 
      var el=$.jq(new String(fs.readFileSync(b.cfg.pageDir+"/"+f)).toString()); // toString is necessary
      return {
        name: f.replace(".html", ""),
        preload: el.attr("preload")=="true",
        synonyms: $.linq.from(<string[]>(el.attr("synonyms")||"").split(",")).where((x, i) => x!="").toArray()
      };
    })
    .toArray()
  };
}

/** Returns the client config. */
function getClientCfg(b: $.Build): any
{
  var cfg=b.cfg;
  if (!cfg.res) cfg.res={};

  // add event dummies
  cfg.res.eventDummies=new Array(cfg.client.shownEvents);

  // add event images
  if (cfg.res.event) cfg.res.event.images=getEventImages(b);

  var clientCfg=$.merge({}, cfg.client, {
    root: cfg.root,
    lang: cfg.lang,
    res: cfg.res.client||{},
    pages: $.linq.from([{ name: "main", preload: true, synonyms: [] }].concat(cfg.htmlPages)).toObject(
      function (p) { return p.name; },
      function (p) { return p; })
  });

  return {
    clientCfg: JSON.stringify(clientCfg, null, cfg.minify?"":"  ")
  }
}

/** Returns all event images. */
function getEventImages(b: $.Build): string[]
{
  return $.linq.from(fs.readdirSync(b.resolve("%src/img/events")[0]))
    .where(x => { var ext=$p.extname(x).toLowerCase(); return  ext==".jpg" || ext==".png"; })
    .toArray();
}