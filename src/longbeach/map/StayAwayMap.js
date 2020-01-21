// @flow
import React, { useEffect, useMemo, useReducer } from 'react';

import ReactMapboxGl, { Popup, ScaleControl } from 'react-mapbox-gl';
import { List } from 'immutable';
import { useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import CurrentPositionLayer from './CurrentPositionLayer';
import RadiusLayer from './RadiusLayer';
import StayAwayLocationLayer from './StayAwayLocationLayer';
import { getBoundsFromPointsOfInterest, getCoordinates } from './MapUtils';
import { COORDS, MAP_STYLE } from './constants';

declare var __MAPBOX_TOKEN__;

// eslint-disable-next-line new-cap
const Mapbox = ReactMapboxGl({
  accessToken: __MAPBOX_TOKEN__
});

const flyToOptions = {
  speed: 0.8
};

const INITIAL_STATE = {
  bounds: COORDS.BAY_AREA,
  center: undefined,
  zoom: [16],
  selectedLocation: undefined
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'center': {
      const { center, selectedLocation } = action.payload;
      return {
        ...state,
        bounds: undefined,
        center,
        selectedLocation,
        zoom: [16],
      };
    }
    case 'bounds':
      return {
        ...state,
        bounds: action.payload,
        center: undefined,
        selectedLocation: undefined,
      };
    default:
      return state;
  }
};

type Props = {
  useCurrentPosition :boolean;
  currentPosition :Position;
  searchResults ?:List;
};

const StayAwayMap = (props :Props) => {
  const {
    currentPosition,
    searchResults,
    useCurrentPosition,
  } = props;
  const stayAwayLocations = useSelector((store) => store.getIn(['longBeach', 'locations', 'stayAwayLocations']));
  const isLoading = useSelector((store) => store
    .getIn(['longBeach', 'locations', 'fetchState']) === RequestStates.PENDING);
  const [state, stateDispatch] = useReducer(reducer, INITIAL_STATE);
  const {
    bounds,
    center,
    selectedLocation,
    zoom,
  } = state;

  const locationData = useMemo(() => searchResults
    .map((resultEKID) => stayAwayLocations.get(resultEKID)),
  [searchResults, stayAwayLocations]);

  useEffect(() => {
    if (!isLoading) {
      // first, use bounds whenever possible
      const newBounds = getBoundsFromPointsOfInterest(locationData);
      if (newBounds) {
        stateDispatch({ type: 'bounds', payload: newBounds });
      }
      // then, try to center to current position without bounds
      else if (currentPosition.coords && useCurrentPosition) {
        const { latitude, longitude } = currentPosition.coords;
        stateDispatch({
          type: 'center',
          payload: {
            center: [longitude, latitude],
            selectedLocation: undefined
          }
        });
      }
      // TODO: fall back to app.settings default bounds
      // fall back to bay area bounds
      else {
        stateDispatch({
          type: 'bounds',
          payload: COORDS.BAY_AREA
        });
      }
    }
  }, [
    isLoading,
    locationData,
    currentPosition,
    useCurrentPosition
  ]);

  const handleFeatureClick = (location, feature) => {
    const { lng, lat } = feature.lngLat;
    stateDispatch({
      type: 'center',
      payload: {
        center: [lng, lat],
        selectedLocation: location
      }
    });
  };

  return (
    <Mapbox
        center={center}
        containerStyle={{ flex: 1 }}
        fitBounds={bounds}
        movingMethod="flyTo"
        flyToOptions={flyToOptions}
        style={MAP_STYLE.LIGHT}
        zoom={zoom}>
      <ScaleControl
          position="bottom-right"
          measurement="mi" />
      <CurrentPositionLayer position={currentPosition} />
      {
        selectedLocation && (
          <>
            <RadiusLayer location={selectedLocation} radius={100} unit="yd" />
            <Popup coordinates={getCoordinates(selectedLocation)}>
              <div>popup</div>
            </Popup>
          </>
        )
      }
      <StayAwayLocationLayer
          stayAwayLocations={locationData}
          onFeatureClick={handleFeatureClick} />
    </Mapbox>
  );
};

StayAwayMap.defaultProps = {
  searchResults: List()
};

export default React.memo((props :Props) => {
  const { currentPosition, searchResults, useCurrentPosition } = props;
  return (
    <StayAwayMap
        currentPosition={currentPosition}
        searchResults={searchResults}
        useCurrentPosition={useCurrentPosition} />
  );
});
