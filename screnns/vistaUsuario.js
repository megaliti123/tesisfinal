import React, { Component, useEffect, useRef, useState } from 'react'
import { View ,Text, Button} from 'react-native'
import * as Location from 'expo-location'
import{ getFirestore, addDoc,doc ,getDoc, setDoc, collection} from'firebase/firestore'
import appFirebase from '../credenciales'
import MapView, { Marker, Polyline ,PROVIDER_GOOGLE} from 'react-native-maps';

export default function VistaUsuario({ route }) {

  const { pedido } = route.params;
  const [pedidoSnapshot, setPedidoSnapshot] = useState(null);
  const firestore = getFirestore(appFirebase);
  const[pedidoObject, setPedidoObject] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [actualLocation, setActualLocation] = useState(null);

  const getPedido = () => {
    setIsLoading(true)
    const pedidoRef = doc(firestore, 'pedido', pedido);
    const pedidoSnapshot =  getDoc(pedidoRef).then(
      (data)=>{
        console.log(data.data())
        
        setPedidoSnapshot(data.data());
        setPedidoObject(JSON.parse(pedidoSnapshot.data()))
        
      }
    ).finally(
      ()=>{setIsLoading(false)}
    );
    

  }; 




  const getactualLocation = async () => {
    
    if(pedidoSnapshot?.estado === 'en camino'){
      <Marker coordinate={pedidoSnapshot.actual} title="Ubicacion actual" description="Ubicacion actual"/>
    }

  }

  
  const redirectToWhatsApp = () => {
    const phoneNumber = '+58 4246281612'; // Replace with your phone number
    const message = 'tengo un problema con mi pedido'; // Replace with your message
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };
  

  useEffect(() => {
    getPedido();  

    console.log(pedido)

    console.log(pedidoObject)
    console.log(pedidoSnapshot)
    
    const interval = setInterval(() => {
      getPedido();
    }, 60000);

    return () => clearInterval(interval);
  }, [pedido]);

  
  const cancelarPedido = () => {
    if (pedidoSnapshot?.estado === 'pendiente') {
      // Perform cancellation logic here
      

      const pedidoRef = doc(firestore, 'pedido', pedido);
      setDoc(pedidoRef, { estado: 'cancelado' }, { merge: true });
      console.log('Pedido cancelado');
      


    } else {
      console.log('No se puede cancelar el pedido en este estado');
    }
  };

 

  
  

  if(isLoading){
    return (
      <View>
        <Text>Cargando...</Text>
      </View>
    );
  }else{
    return (
      <View style={Style.container}>
        <View style={Style.tarjeta}>

          <MapView style={Style.map} initialRegion={{
            latitude: pedidoSnapshot?.origen.latitude ?? 0,
            longitude: pedidoSnapshot?.origen?.longitude ?? 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}>
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
                latitude: pedidoSnapshot?.destino.latitude ?? 0,
                longitude: pedidoSnapshot?.destino.longitude ?? 0,
              }}
              title="punto de entrega"
              description="destino" />
            <Polyline coordinates={[pedidoSnapshot?.origen, pedidoSnapshot?.destino]} />

            {pedidoSnapshot?.estado === 'en proceso' && (
              <><Marker coordinate={pedidoSnapshot.actual} title="Ubicacion actual" description="Ubicacion actual" /><Polyline coordinates={[pedidoSnapshot?.origen, pedidoSnapshot?.actual]} /></>
            )}
          </MapView>

          <View style={Style.informacion}>
            <Text>Nombre: {pedidoSnapshot?.nombre_recibe}</Text>
            <Text>correo: {pedidoSnapshot?.correo_recibe}</Text>
            <Text>telefono: {pedidoSnapshot?.telefono_recibe}</Text>
          </View>

          <View style={Style.butonconta}>

            <View style={Style.button1}>
          <Button
                      color={'red'}
                      title="soporte"
                      onPress={() => {
                        const phoneNumber = '04146142340';
                        if (phoneNumber) {
                          Linking.openURL(`whatsapp://send?phone=${phoneNumber}`);
                        }
                      }}
                    />
            
            </View>

            <View style={Style.button2}>
              <Button
                color={'green'}
                title="repartidor"
                onPress={() => {
                  const phoneNumber = pedidoSnapshot?.telefono_recibe;
                  if (phoneNumber) {
                    Linking.openURL(`whatsapp://send?phone=${phoneNumber}`);
                  }
                }}
              />
              </View>

              <View>
                {pedidoSnapshot?.estado === 'pendiente' && (
                  <Button title="Cancelar Pedido" onPress={cancelarPedido} />
                )}
              </View>

          </View>
        </View>
      </View>
    );
   
  }

  

  
  

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
    height: '80%',
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