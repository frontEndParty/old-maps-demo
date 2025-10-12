import '../style.css';
import {Map, View, Feature, Tile} from 'ol';
import {Attribution} from 'ol/control';
import { Point } from "ol/geom";
import { Style, Icon } from "ol/style";
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { StadiaMaps, Vector, TileJSON, OSM } from 'ol/source';
import { fromLonLat, transformExtent } from 'ol/proj'

import LayerSwitcher from "ol-ext/control/LayerSwitcher";
import Swipe from "ol-ext/control/Swipe";
import Game from "ol-games/game/Game";

// StadiaMaps - Other available layer options listed here:
// https://openlayers.org/en/latest/apidoc/module-ol_source_StadiaMaps-StadiaMaps.html
const basemap = new TileLayer({
  title: "Basemap",
  preload:Infinity,
  source: new StadiaMaps({
    layer: 'osm_bright'
  })
});

const streets = new TileLayer({
  preload:Infinity,
  source: new OSM({
    maxZoom: 20
  })
});

const overlay = new VectorLayer({
  title: "Plane",
  source: new Vector(),
});

// go to the "tilejson" link and copy out the bounds listed there into this variable.
const no1885lyrBounds = [-90.09063720703124, 29.943779130679083, -90.03089904785155, 29.987947253623624]
const no1885lyr = new TileLayer({
  title: "New Orleans 1885",
  preload:Infinity,
  extent: transformExtent(no1885lyrBounds, "EPSG:4326", "EPSG:3857"),
  source: new TileJSON({
    url: "https://oldinsurancemaps.net/map/sanborn03376_002/main-content/tilejson",
    attributions: ["OldInsuranceMaps contributors; Library of Congress"]
  })
})
 

let a = 0;
let center = fromLonLat([-90.063637, 29.958022]);
let zoom = 20;

// IMPORTANT: don't set the speed too high! The map
// tile servers won't be able to keep up.
let speed = 0.008;

let plane = new Feature(new Point(center));
plane.setStyle ( new Style({
  image: new Icon({
    src: "../img/Biploar_type4_1.png",
    scale:0.6
  }),
  zIndex:11
}) );
let shadow = new Feature(new Point(center));

shadow.setStyle ( new Style({
  image: new Icon({
    src: "../img/Biploar_shadow.png",
    scale:0.45,
    opacity:.8
  }),
  zIndex:0
}) );
overlay.getSource().addFeatures([
  shadow,
  plane
]);

function getDirection(pt){
  if (pt) a = Math.atan2 ( pt[0]-center[0], pt[1]-center[1] ) - Math.PI/2;
  else a = Math.random()*2*Math.PI;
  plane.getStyle().getImage().setRotation(a + Math.PI/2);
  shadow.getStyle().getImage().setRotation(a + Math.PI/2);
}
const game = new Game({
  target: 'map',
  layers: [
    basemap,
    no1885lyr,
    overlay
  ],
  center: center,
  zoom: zoom,
});
getDirection()

game.getMap().on("click", function(e){
  getDirection(e.coordinate);
})

const switcher = new LayerSwitcher;
game.getMap().addControl(switcher)

const swipe = new Swipe({
  rightLayers: no1885lyr,
  position: .25,
})
game.getMap().addControl(swipe)

game.getMap().addControl(new Attribution())

game.on ("render", function(e) {
  center[0] += speed * e.dt * Math.cos(a);
  center[1] -= speed * e.dt * Math.sin(a);
  game.getView().setCenter(center);
  plane.getGeometry().setCoordinates(center);
  shadow.getGeometry().setCoordinates([center[0]+(zoom*0.1), center[1]-zoom*0.15]);
});

game.start();

function endFlight() {
  game.pause();
  alert("This flight has ended.");
}

setTimeout(endFlight, 15000)