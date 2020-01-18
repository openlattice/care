// @flow
import React, { useEffect, useReducer } from 'react';

import ReactMapboxGl, { Layer } from 'react-mapbox-gl';
import { List } from 'immutable';

import RadiusLayer from './RadiusLayer';
import { getBoundsFromPointsOfInterest } from './MapUtils';
import { COORDS, MAP_STYLE } from './constants';

declare var __MAPBOX_TOKEN__;

// eslint-disable-next-line new-cap
const Mapbox = ReactMapboxGl({
  accessToken: __MAPBOX_TOKEN__
});

const INITIAL_STATE = {
  bounds: COORDS.BAY_AREA,
  center: undefined,
  zoom: [12],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'center':
      return { ...state, center: action.payload };
    case 'bounds':
      return { ...state, bounds: action.payload };
    default:
      return state;
  }
};

type Props = {
  currentPosition :Position;
  pointsOfInterest ?:List;
};

const StayAwayMap = (props :Props) => {
  const { currentPosition, pointsOfInterest } = props;

  const [state, stateDispatch] = useReducer(reducer, INITIAL_STATE);
  const { bounds, center, zoom } = state;

  useEffect(() => {
    if (!center && currentPosition.coords) {
      const { latitude, longitude } = currentPosition.coords;
      stateDispatch({ type: 'center', payload: [longitude, latitude] });
    }
  }, [currentPosition, center]);

  useEffect(() => {
    const newBounds = getBoundsFromPointsOfInterest(pointsOfInterest, bounds);
    stateDispatch({ type: 'bounds', payload: newBounds });
  }, [bounds, pointsOfInterest]);

  return (
    <Mapbox
        center={center}
        containerStyle={{ flex: 1 }}
        fitBounds={bounds}
        movingMethod="flyTo"
        style={MAP_STYLE.LIGHT}
        zoom={zoom}>
      <RadiusLayer position={currentPosition} radius={1} />
    </Mapbox>
  );
};

StayAwayMap.defaultProps = {
  pointsOfInterest: List()
};

export default StayAwayMap;
