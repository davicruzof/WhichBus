import React, { memo, useEffect, useRef, useState } from 'react';
import { Container, ContainerInfo, ContainerSearch, TextInfo } from './styles';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import config from '../Config';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';

function Home() {
  const mapEl = useRef(null);
  const [origin, setOrigin] = useState(null);
  const [distance, setDitance] = useState(null);
  const [res, setResult] = useState(null);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    (async function () {
      const { status, permissions } = await Permissions.askAsync(
        Permissions.LOCATION,
      );
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true,
        });
        setOrigin({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
        });
      } else {
        throw new Error('Permissão de localizacão não permitida');
      }
    })();
  }, []);

  useEffect(() => {
    console.log(res);
  }, [res]);

  return (
    <Container>
      <MapView
        initialRegion={origin}
        showsUserLocation={true}
        loadingEnabled={true}
        zoomEnabled={true}
        ref={mapEl}
        style={{ height: '60%' }}
      >
        {destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={config.googleApi}
            strokeWidth={3}
            onReady={(result) => {
              setDitance(result.distance);
              setResult(result.distance);
              mapEl.current.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  top: 50,
                  bottom: 50,
                  left: 50,
                  rigth: 50,
                },
              });
            }}
          />
        )}
      </MapView>
      <ContainerSearch>
        <GooglePlacesAutocomplete
          placeholder="Para onde vamos?"
          onPress={(data, details = null) => {
            setDestination({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.00922,
              longitudeDelta: 0.00421,
            });
          }}
          query={{
            key: config.googleApi,
            language: 'pt-br',
          }}
          fetchDetails={true}
          styles={{ listView: { height: 100 } }}
        />
        <ContainerInfo>
          {distance && <TextInfo>distância:{distance}m</TextInfo>}
        </ContainerInfo>
      </ContainerSearch>
    </Container>
  );
}

export default memo(Home);
