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
import Clip from "ol-ext/filter/Clip";

import Game from "ol-games/game/Game";

const basemap = new TileLayer({
  // preload:Infinity,
  source: new OSM(),
  // tileLoadFunction: (imageTile, src) => {
  //     const img = imageTile.getImage();
  //     // Set the per-image referrer policy before assigning the src
  //     if (img && 'referrerPolicy' in img) {
  //       img.referrerPolicy = 'origin-when-cross-origin';
  //     }
  //     img.src = src;
  //   }
});

// StadiaMaps - Other available layer options listed here:
// https://openlayers.org/en/latest/apidoc/module-ol_source_StadiaMaps-StadiaMaps.html
const basemap2 = new TileLayer({
  title: "Basemap",
  preload:Infinity,
  source: new StadiaMaps({
    layer: 'osm_bright'
  })
});

const overlay = new VectorLayer({
  title: "Plane",
  source: new Vector(),
});

// go to the "tilejson" link and copy out the bounds listed there into this variable.
const tilejsonUrl = "https://oldinsurancemaps.net/map/sanborn03376_002/main-content/tilejson"
const no1885lyrBounds = [-90.09063720703124, 29.943779130679083, -90.03089904785155, 29.987947253623624]
const no1885lyr = new TileLayer({
  title: "New Orleans 1885",
  extent: transformExtent(no1885lyrBounds, "EPSG:4326", "EPSG:3857"),
  source: new TileJSON({
    url: tilejsonUrl,
    attributions: ["OldInsuranceMaps contributors; Library of Congress"]
  })
})
 

let a = 0;
let center = fromLonLat([-90.063637, 29.958022]);
let zoom = 20;

// IMPORTANT: don't set the speed too high! The map
// tile servers won't be able to keep up.
let speed = 0.01;

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

// based on example: https://viglino.github.io/ol-ext/examples/filter/map.filter.clip.html
// and example code: https://github.com/Viglino/ol-ext/blob/master/examples/filter/map.filter.clip.html
const clipCoords = []
for (var i=0; i<2*Math.PI; i+=0.1) {
  clipCoords.push([ 600*(0.5+Math.cos(i)/2)+10, 600*(0.5+Math.sin(i)/2)+10 ]);
}
const clip = new Clip({
  coords: clipCoords,
  position: "middle-center",
  extent: [0,0,600,600],
  unit: "px",
})
no1885lyr.addFilter(clip)

game.getMap().addControl(new Attribution())

game.on ("render", function(e) {
  center[0] += speed * e.dt * Math.cos(a);
  center[1] -= speed * e.dt * Math.sin(a);
  game.getView().setCenter(center);
  plane.getGeometry().setCoordinates(center);
  shadow.getGeometry().setCoordinates([center[0]+(zoom*0.1), center[1]-zoom*0.15]);
});

alert("Fly around the French Quarter in 1885. Click or tap on the map to change direction. Use the space bar to pause your flight.")
game.start();


function endFlight() {
  alert("Continue your journey?");
}
document.onkeydown = function(evt) {
    if (evt.code == "Space") {
      if (game.paused()) {
        game.start()
      } else {
        game.pause()
      }
    }
};

setTimeout(endFlight, 120000)
