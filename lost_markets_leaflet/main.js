import '../style.css';
import {Map, View, Overlay} from 'ol';
import GroupLayer from "ol/layer/Group";
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { TileJSON, OSM, } from 'ol/source';
import { fromLonLat, transformExtent } from 'ol/proj'

import LayerSwitcher from "ol-ext/control/LayerSwitcher";
import VectorSource from 'ol/source/Vector';

const streets = new TileLayer({
  source: new OSM({
    maxZoom: 20
  })
});

const marketLyr = new VectorLayer({
  source: new VectorSource({
    url: "../market-points.geojson",
    format: new GeoJSON()
  })
})

// go to the "tilejson" url below and copy out the "bounds" property into this variable.
const no1885vol1lyrBounds = [-90.11672973632814, 29.913876438317633, -90.06128311157227, 29.950918742988996]
const no1885vol1lyr = new TileLayer({
  title: "New Orleans 1885-1893 vol. 1",
  extent: transformExtent(no1885vol1lyrBounds, "EPSG:4326", "EPSG:3857"),
  source: new TileJSON({
    url: "https://oldinsurancemaps.net/map/sanborn03376_001/main-content/tilejson",
    attributions: ["OldInsuranceMaps contributors; Library of Congress"]
  })
})

// go to the "tilejson" url below and copy out the "bounds" property into this variable.
const no1885vol2lyrBounds = [-90.09063720703124, 29.943779130679083, -90.03089904785155, 29.987947253623624]
const no1885vol2lyr = new TileLayer({
  title: "New Orleans 1885-1893 vol. 2",
  extent: transformExtent(no1885vol2lyrBounds, "EPSG:4326", "EPSG:3857"),
  source: new TileJSON({
    url: "https://oldinsurancemaps.net/map/sanborn03376_002/main-content/tilejson",
    attributions: ["OldInsuranceMaps contributors; Library of Congress"]
  })
})

// go to the "tilejson" url below and copy out the "bounds" property into this variable.
const no1885vol3lyrBounds = [-90.13870239257812, 29.917893740223892, -90.00480651855467, 29.96995520292274]
const no1885vol3lyr = new TileLayer({
  title: "New Orleans 1885-1893 vol. 3",
  extent: transformExtent(no1885vol3lyrBounds, "EPSG:4326", "EPSG:3857"),
  source: new TileJSON({
    url: "https://oldinsurancemaps.net/map/sanborn03376_003/main-content/tilejson",
    attributions: ["OldInsuranceMaps contributors; Library of Congress"]
  })
})

// go to the "tilejson" url below and copy out the "bounds" property into this variable.
const no1885vol4lyrBounds = [-90.13080596923828, 29.915810715022406, -90.01433372497559, 29.97501114970206]
const no1885vol4lyr = new TileLayer({
  title: "New Orleans 1885-1893 vol. 4",
  extent: transformExtent(no1885vol4lyrBounds, "EPSG:4326", "EPSG:3857"),
  source: new TileJSON({
    url: "https://oldinsurancemaps.net/map/sanborn03376_004/main-content/tilejson",
    attributions: ["OldInsuranceMaps contributors; Library of Congress"]
  })
})


const noLyrGrp = new GroupLayer({
  title: "New Orleans 1885-1893",
  layers: [no1885vol1lyr, no1885vol2lyr, no1885vol3lyr, no1885vol4lyr]
})

// BASIC POPUP - this depends on CSS in the html head element as well.

const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');
const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

closer.onclick = function() {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};


const map = new Map({
  target: 'map',
  layers: [
    streets,
    noLyrGrp,
    marketLyr,
  ],
  overlays: [overlay],
  view: new View({
    center: fromLonLat([-90.063637, 29.958022]),
    zoom: 16,
  })
});

// Drive popup click event and set content from the feature in the popup.

map.on('click', function (evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });
  if (feature) {
    const coordinates = feature.getGeometry().getCoordinates();
    content.innerHTML =
      '<strong>Name:</strong> ' + feature.get('name')
    overlay.setPosition(coordinates);
  }
});


const switcher = new LayerSwitcher;
map.addControl(switcher)
