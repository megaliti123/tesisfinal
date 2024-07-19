import React, { Component, useEffect, useRef, useState } from 'react'
import { View ,Text, Button, StyleSheet, Pressable,Linking,} from 'react-native'
import * as Location from 'expo-location'
import{ getFirestore, addDoc,doc ,getDoc, setDoc, collection, updateDoc} from'firebase/firestore'
import appFirebase from '../credenciales'
import MapView, { Marker, Polyline ,PROVIDER_GOOGLE} from 'react-native-maps';
import { get } from 'firebase/database'

export default function VistaTrabajador ({route})  {   
  const { pedido } = route.params;
  const [pedidoSnapshot, setPedidoSnapshot] = useState(null);
  const firestore = getFirestore(appFirebase);
  const[pedidoObject, setPedidoObject] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const carimg = require('../assets/car.png')

  const [actualLocation, setActualLocation] = useState(null);

const getPedido = async () => {
  console.log(pedido);
  setIsLoading(true);
  const pedidoRef = doc(firestore, 'pedido', pedido);

  try {
  const pedidoSnapshot = await getDoc(pedidoRef);
  const pedidoData = pedidoSnapshot.data();
  console.log(pedidoData);

  setPedidoSnapshot(pedidoData);
 
  } catch (error) {
  console.error('Error getting pedido:', error);
  } finally {
  setIsLoading(false);
  }

  const location = await getLocation();
  if (location) {
  await updateDoc(pedidoRef, { actual: location });
  }
};


const getLocation = async () => {
  let location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
};
};


const updateActualLocation = async (pedido) => {
  const location = await getLocation();

  console.log(location)
  if (location) {
    const pedidoRef = doc(firestore, 'pedido', pedido);
    await updateDoc(pedidoRef, { actual: location });

    
  }
  console.log('actualizado')
};


  useEffect(() => {
    getPedido();

    const interval = setInterval(() => {
    getPedido();
    updateActualLocation();
    }, 60000);
   
    return () => clearInterval(interval);
  }, [pedido]);






  
  

  const MyComponent = () => {
    if (isLoading) {
      return (
        <View>
          <Text>Cargando...</Text>
        </View>
      );
    } else {
      return (
        <View style={Style.container}>
          <View style={Style.tarjeta}>
            <MapView
              style={Style.map}
              initialRegion={{
                latitude: pedidoSnapshot?.origen.latitude ?? 0,
                longitude: pedidoSnapshot?.origen?.longitude ?? 0,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: pedidoSnapshot?.origen.latitude ?? 0,
                  longitude: pedidoSnapshot?.origen.longitude ?? 0,
                }}
                title="punto de origen"
                description="origen"
              />
              <Marker
                coordinate={{
                  latitude: pedidoSnapshot?.actual.latitude ?? 0,
                  longitude: pedidoSnapshot?.actual.longitude ?? 0,
                }}
                image={carimg}
              />
              <Marker
                coordinate={{
                  latitude: pedidoSnapshot?.destino.latitude ?? 0,
                  longitude: pedidoSnapshot?.destino.longitude ?? 0,
                }}
                title="punto de entrega"
                description="destino"
              />
              <Polyline
                coordinates={[pedidoSnapshot?.origen, pedidoSnapshot?.destino]}
              />
            </MapView>
            <View>
              <Text style={Style.text}>Nombre: {pedidoSnapshot?.nombre}</Text>
              <Text style={Style.text}>correo: {pedidoSnapshot?.correo}</Text>

              <View style={Style.buttonContainer}>
                <View style={Style.button}>
                  <Button
                    color={'green'}
                    title="usuario"
                    onPress={() => {
                      const phoneNumber = pedidoSnapshot?.telefono;
                      if (phoneNumber) {
                        Linking.openURL(`whatsapp://send?phone=+58 ${phoneNumber}`);
                      }
                    }}
                  />
                </View>

                <View style={Style.button2}>
                  <Button
                    color={'red'}
                    title="soporte"
                    onPress={() => {
                      const phoneNumber = '04122387876';
                      if (phoneNumber) {
                        Linking.openURL(`whatsapp://send?phone=${phoneNumber}`);
                      }
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    }
  };

  return (
    <MyComponent />
  );
}

const Style = {

    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    map: {
      width: '100%',
      height: '100%',
    },
    tarjeta: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      justifyContent: 'center',
      width: '90%',
      padding: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  }