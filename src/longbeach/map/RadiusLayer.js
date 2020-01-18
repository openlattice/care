// @flow
import React from 'react';

import { Colors } from 'lattice-ui-kit';
import { Feature, Layer } from 'react-mapbox-gl';

import { milesToPixelsAtMaxZoom } from './MapUtils';
import { LAYERS, MAP_STYLE } from './constants';

const { PURPLES } = Colors;

type Props = {
  position :Position;
  radius :number;
  mapMode ?:string;
};

const RadiusLayer = (props :Props) => {

  const { position, mapMode, radius } = props;

  const color = mapMode === MAP_STYLE.LIGHT ? PURPLES[4] : PURPLES[6];
  if (position.coords) {
    const { latitude, longitude } = position.coords;

    if (radius && latitude && longitude) {
      return (
        <Layer
            type="circle"
            id={LAYERS.SEARCH_RADIUS}
            paint={{
              'circle-opacity': 0.1,
              'circle-color': color,
              'circle-stroke-color': color,
              'circle-stroke-width': 1,
              'circle-radius': {
                stops: [
                  [0, 0],
                  [20, milesToPixelsAtMaxZoom(radius, latitude)]
                ],
                base: 2
              },
            }}>
          <Feature coordinates={[longitude, latitude]} />
        </Layer>
      );
    }
  }

  return null;
};

RadiusLayer.defaultProps = {
  mapMode: MAP_STYLE.LIGHT
};

export default RadiusLayer;
