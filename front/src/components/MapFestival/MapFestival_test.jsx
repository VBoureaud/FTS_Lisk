import React from "react";
import { Map, Marker } from "pigeon-maps"

import styles from "./mapfestival.module.css";

type Props = {};

//https://api.maptiler.com/maps/streets-v2-dark/?key=sH6SdQZTzbHpw4Rzu07p#4.3/47.34215/5.00931

const MAPTILER_ACCESS_TOKEN = ''
const MAP_ID = ''

function mapTiler (x, y, z, dpr) {
//  return `https://api.maptiler.com/maps/${MAP_ID}/256/${z}/${x}/${y}${dpr >= 2 ? '@2x' : ''}.png?key=${MAPTILER_ACCESS_TOKEN}`
  return `https://api.maptiler.com/maps/streets-v2-dark/?key=sH6SdQZTzbHpw4Rzu07p#4.3/47.34215/5.00931`;
}

const Mapfestival = (props: Props) => {
  return (
    <div className={styles.mapContainer}>
      <iframe src="https://api.maptiler.com/maps/streets-v2-dark/?key=sH6SdQZTzbHpw4Rzu07p#4.3/47.34215/5.00931"></iframe>
    </div>
  );
};
 
export default Mapfestival;
