# OldInsuranceMaps.net - Front End Party

For this Front End Party we will incorporate historical map layers from OldInsuranceMaps.net into new web map applications. OIM makes it easy for people to "georeference" scans of old maps, and once they have been georeferenced they be used in web applications or geospatial analysis.

## Getting started

You will need nodejs installed before getting started.

1. Clone this repo and enter the directory

    git clone https://github.com/mradamcox/oldmaps
    cd oldmaps

2. Install dependencies

    npm install

3. Run the dev server

    npm start

You should now be able to open the app in a browser at https://localhost:5173 and checkout the [examples described below](#openlayers-examples).

## Create a new map

Make a new branch

    git checkout -b my_map

Then create a new directory with an `index.html` and `main.js` file inside:

```
my_map/
    index.html
    main.js
```

Feel free to copy one of the examples if you want, or start something from scratch.

Finally, update `vite.config.js` with a new line to get your new map included in the build.

```diff
    ...
    input: {
        main:'index.html',
        low_level_flights: 'low_level_flights/index.html',
        lost_markets: 'lost_markets/index.html'
+       my_map: 'my_map/index.html'
      }
```

You should be able to view your app at https://localhost:5173/oldmaps/my_map

Once all of your work is committed, make a PR to this repo and we'll merge it in!

## OpenLayers examples

Two examples show how layers from OldInsuranceMaps can be brought into a web map environment using <a href="https://openlayers.org">OpenLayers</a>, a JavaScript web mapping library. Each example does little more than adapt example code and then add some old map layers.

### Lost Markets (points example)

Highlights the locations of a few open air markets that existed in the 1880s. Click a point to get the market's name in a popup.

- point data created in https://geojson.io and then stored in a .geojson file in the public directory.
- uses [GeoJSON source](https://openlayers.org/en/latest/examples/geojson.html) and a [basic popup](https://openlayers.org/en/latest/examples/popup.html)

### Low-level Flights (game example)

Flies a lil plane around the French Quarter in 1885. Click/tap the map to change the plane's direction. This uses two great OpenLayers extension libraries, [ol-ext](https://viglino.github.io/ol-ext/examples/control/map.control.swipe.html) and [ol-games](https://viglino.github.io/ol-games).

- adapted from [game loop](https://viglino.github.io/ol-games/examples/map.gameloop.html) example in [ol-games](https://viglino.github.io/ol-games)
- also uses [swipe control](https://viglino.github.io/ol-ext/examples/control/map.control.swipe.html) from [ol-ext](https://viglino.github.io/ol-ext/examples/control/map.control.swipe.html)