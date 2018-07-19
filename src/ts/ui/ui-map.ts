/*! OEWR - ui-map.ts
* Copyright Christoph Schaunig 2018
*/

/// <reference path="ui.ts" />
"use strict";

declare var google: any;

interface GMapPosition
{
  lat?: number;
  lng?: number;
}

interface GMapMarker
{
  position?: GMapPosition;
  title?: string;
  label?: string;
  draggable?: boolean;
}

interface GMapPath
{
  path: GMapPosition[],
  geodesic?: boolean;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWeight?: number;
}

interface GMap
{
  element: JQuery;
  start?: GMapPosition;
  zoom?: number;
  marker?: GMapMarker[];
  paths?: GMapPath[];
  wait?: JQueryDeferred<any>;
}

module $oewr.$ui.map
{
  var apikey="AIzaSyBdO_cpM267sMdq2GO-ujjfch3dMjUHMjY";
  var currentIdx=0;
  var apiAdded: boolean;
  var wait: JQueryDeferred<any>=$.Deferred<any>();
  export var maps: GMap[]=[];

  /** Initializes all maps. */
  export function init(context?: JQuery)
  {
    $(".map", context).q().ForEach(x => maps.push(createMap(x)));
  }

  function createMap(cnt: JQuery): GMap
  {
    var map: GMap={ element: cnt, wait: $.Deferred<any>() };
    var lat=parseFloat(cnt.attr("lat"));
    var lng=parseFloat(cnt.attr("lng"));
    var zoom=parseFloat(cnt.attr("zoom"));
    if (lat&&lng) map.start={ lat: lat, lng: lng };
    if (zoom) map.zoom=zoom;

    // add map promise
    map.element.data("gmap_promise", map.wait.promise());

    // read markers
    map.marker=$q($(".marker", cnt)).Select(x => 
    {
      var marker: GMapMarker={
        position: 
        {
          lat: parseFloat(x.attr("lat")),
          lng: parseFloat(x.attr("lng"))
        },
        title: x.attr("title"),
        label: x.attr("label"),
        draggable: x.hasClass("draggable")
      };
      return marker;
    }).ToArray();

    // read paths
    map.paths=$q($(".path", cnt)).Select(p => 
    {
      var path: GMapPath={
        path: $q(p.children()).Select(x => <GMapPosition>{ lat: parseFloat(x.attr("lat")), lng: parseFloat(x.attr("lng")) }).ToArray(),
        geodesic: true,
        strokeColor: p.attr("color"),
        strokeOpacity: parseFloat(p.attr("opacity")) | 1.0,
        strokeWeight: parseFloat(p.attr("weight")) | 2.0
      };
      return path;
    }).ToArray();

    window["initMap"+currentIdx]=function () { initMap(map, currentIdx); };

    // add api only once
    if (!apiAdded)
    {
      cnt.after('<script async defer src="https://maps.googleapis.com/maps/api/js?key='+apikey+'&callback=initMap'+currentIdx+'"></script>');
      apiAdded=true;
    }
    else
      wait.done(() => { initMap(map, currentIdx) });

    currentIdx++;

    return map;
  }

  function initMap(map: GMap, idx: number)
  {
    // stop waiting
    wait.resolve();

    // initialize the map and set the start location
    var gmap=new google.maps.Map(map.element[0], 
    {
      center: map.start?{ lat: map.start.lat, lng: map.start.lng }:null,
      zoom: map.zoom,
      styles: mapStyle
    });
    map.element.data("gmap", gmap);

    // add markers
    var markers=[];
    $q(map.marker).ForEach((m, midx) => 
    {
      var marker=new google.maps.Marker({
        position: new google.maps.LatLng(m.position.lat, m.position.lng),
        title: m.title,
        label: m.label,
        draggable: m.draggable
      });
      marker.setMap(gmap);
      markers.push(marker);

      // set marker pos
      map.element.attr("m"+midx+"_lat", m.position.lat);
      map.element.attr("m"+midx+"_lng", m.position.lng);

      // set marker pos on drag
      if (m.draggable)
        marker.addListener("drag", function() {
          var pos=marker.getPosition();
          map.element.attr("m"+midx+"_lat", pos.lat);
          map.element.attr("m"+midx+"_lng", pos.lng);
        });
    });
    map.element.data("gmap_markers", markers);

    // add paths
    var paths=[];
    $q(map.paths).ForEach((p) =>
    {
      var path=new google.maps.Polyline(p);
      paths.push(path);
      path.setMap(gmap);
    });
    map.element.data("gmap_paths", paths);

    // prevent mouse event capturing
    var innerMap: JQuery;
    map.element.mouseenter(() => 
    { 
      if (!innerMap)
      {
        innerMap=map.element.children().first();
        innerMap.mouseleave(() => { innerMap.addClass("no-pointer-events"); });
      }
      innerMap.addClass("no-pointer-events"); 
    });
    map.element.click(() => { innerMap.removeClass("no-pointer-events"); });

    // map ready
    map.wait.resolve();
  }
}