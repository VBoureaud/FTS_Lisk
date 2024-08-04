import React, { useRef, useEffect, useState } from 'react';
import { config, Map, MapOptions, MapStyle, Popup } from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";

import styles from "./mapfestival.module.css";
import geojson from "@/databases/festivals_geojson.json";

export default function Mapfestival2() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const center = { lng: 1.693057, lat: 46.813744 };
  const [zoom] = useState(4.7);
  config.apiKey = 'sH6SdQZTzbHpw4Rzu07p';

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new Map({
      container: mapContainer.current,
      style: MapStyle.DATAVIZ.DARK,
      center: [center.lng, center.lat],
      zoom: zoom
    });

    map.current.on('load', function() {
      console.log('loaded');

      if (!map.current)
        return false;

      map.current.loadImage('http://localhost:3000/movie_icon.png', async function(error, image){
        if (error) throw error;
        map.current.addImage('festival', image);
      });

      map.current.addSource('placesMap', geojson);

      map.current.addLayer({
          'id': 'placesLayer',
          'type': 'symbol',
          'source': 'placesMap',
          'layout': {
            'icon-image': 'festival',
            'icon-size': ['*', ['get', 'scalerank'] ,0.01]
          },
          'paint': {}
      });

      // When a click event occurs on a feature in the places layer, open a popup at the
      // location of the feature, with description HTML from its properties.
      map.current.on('click', 'placesLayer', function (e) {
          if (!map.current)
            return false;

          var coordinates = e.features[0].geometry.coordinates.slice();
          var description = e.features[0].properties.description;

          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          new Popup()
              .setLngLat(coordinates)
              .setHTML(description)
              .addTo(map.current);
      });
      // Change the cursor to a pointer when the mouse is over the places layer.
      map.current.on('mouseenter', 'places', function () {
          if (!map || !map.current) return false;
          map.current.getCanvas().style.cursor = 'pointer';
      });

      // Change it back to a pointer when it leaves.
      map.current.on('mouseleave', 'places', function () {
          if (!map || !map.current) return false;
          map.current.getCanvas().style.cursor = '';
      });
    });

  }, [center.lng, center.lat, zoom]);

  return (
    <div className={styles.map_wrap}>
      <div ref={mapContainer} className={styles.map} />
    </div>
  );
}