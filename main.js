import './style.css';
import {Map, View, Feature, Tile} from 'ol';
import { Point } from "ol/geom";
import { Style, Icon } from "ol/style";
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { StadiaMaps, Vector, TileJSON, OSM } from 'ol/source';
import { fromLonLat } from 'ol/proj'

import LayerSwitcher from "ol-ext/control/LayerSwitcher";
import Game from "ol-games/game/Game";

const watercolor = new TileLayer({
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

const overlay = new VectorLayer({ source: new Vector() });

const no1885lyr = new TileLayer({
  preload:Infinity,
  source: new TileJSON({
    url: "https://oldinsurancemaps.net/map/sanborn03376_002/main-content/tilejson",
  })
})
 

let a = 0;
let center = fromLonLat([-90.064089, 29.958815]);
let speed = 0.005;
let zoom = 20;

let plane = new Feature(new Point(center));
plane.setStyle ( new Style({
  image: new Icon({
    src: "img/Biploar_type4_1.png",
    scale:0.6
  }),
  zIndex:1
}) );
let shadow = new Feature(new Point(center));

shadow.setStyle ( new Style({
  image: new Icon({
    src: "img/Biploar_shadow.png",
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
    watercolor,
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

game.on ("render", function(e) {
  center[0] += speed * e.dt * Math.cos(a);
  center[1] -= speed * e.dt * Math.sin(a);
  game.getView().setCenter(center);
  plane.getGeometry().setCoordinates(center);
  shadow.getGeometry().setCoordinates([center[0]+(zoom*0.05), center[1]-zoom*0.09]);
});

game.start();