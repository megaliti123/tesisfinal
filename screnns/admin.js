import { StyleSheet, Text, View, Button, Animated ,TouchableOpacity, Alert} from 'react-native';
import React, { useEffect, useState ,useRef, useCallback} from 'react';
import MapView, { Polyline } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Accordion from 'react-native-collapsible/Accordion';
import { getFirestore,collection, query, where, getDocs, doc , updateDoc} from "firebase/firestore";
import appFirebase from '../credenciales'
import { ScrollView } from 'react-native-gesture-handler';
import * as Location from 'expo-location'





export default function Admin (){


    const firestore = getFirestore(appFirebase);

    const [isCollapsed, setIsCollapsed] = useState(true);
    const [animation] = useState(new Animated.Value(0));
    const [pedidos, setPedidos] = useState([]);
  
    const callcollection = async () => {
  
      const pedidosRef = collection(firestore, 'pedido');
        const q = query(pedidosRef, where('estado', 'in', ['pendiente', 'en proceso']));
      const querySnapshot = await getDocs(q);
  
      const pedidosData = [];
  
      querySnapshot.forEach((doc) => {
  
        pedidosData.push({ ...doc.data(), id: doc.id });
  
      });
  
      setPedidos(pedidosData);
  
    }; 
  
   
  
    
    const handlePress = async (pedido) => {
            try {
                const pedidoRef = doc(firestore, 'pedido', pedido.id);
                
                await updateDoc(pedidoRef, { estado: 'cancelado'});
                
                Alert.alert('Pedido cancelado', 'El pedido ha sido cancelado');
                // Refresh the page here
                // Refresh the page here
                callcollection();
            } catch (error) {
                console.error('Error updating pedido:', error);
            }
        };


  
    
     
  
  
  
    useEffect(() => {
    callcollection();
    }, []);
  
  
    const toggleCollapse = () => {
      setIsCollapsed(!isCollapsed);
    };
  
  
    const startAnimation = () => {
      Animated.timing(animation, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    };
  
  
  
    const headerStyle = {
      transform: [
        {
          translateY: animation.interpolate({
            inputRange: [0, 0],
            outputRange: [0, 0],
          }),
        },
      ],
    };
  
  
  
    const mostrarpedidos = () => {
      if (pedidos.length === 0) {
        return null;
      }
  
  
      return pedidos.map((pedido, index) => {
        return (
  
          <View style={styles.container} key={index}>
  
            <View style={styles.acordion}>
  
              <Accordion
                sections={[
                  {
                    content: (
                      <>
                        <MapView
                          style={styles.map}
                          initialRegion={{
                            latitude: pedido.origen.latitude,
                            longitude: pedido.origen.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                          }}
                        >
                          <Polyline
                          coordinates={[pedido.origen, pedido.destino]}
                          />
                          <Marker
                            coordinate={{
                              latitude: pedido.origen.latitude,
                              longitude: pedido.origen.longitude,
                            }}
                            title="punto de origen"
                            description="origen"
                          />
  
                          <Marker
                            coordinate={{
                              latitude: pedido.destino.latitude,
                              longitude: pedido.destino.longitude,
                            }}
                            title="punto de entrega"
                            description="destino"
                          />
                        </MapView>
  
                        <View>
                          <Text>Nombre: {pedido.nombre}</Text>
                          <Text>Email: {pedido.correo}</Text>
                          <Text>Teléfono: {pedido.telefono} </Text>
  
                          <Button
                            title="cancelar pedido"
                            style={styles.button}
                            onPress={() => {
                              // Add your button functionality here
                              handlePress(pedido);
                            }}
                          />
                        </View>
                      </>
                    ),
                  },
                ]}
                renderHeader={(_section, _index, isActive) => (
                  <TouchableOpacity
                    style={styles.header}
                    onPress={() => setIsCollapsed(isActive ? true : index)}
                  >
                    <Text style={styles.headerText}>Pedido {pedido.id}</Text>
                  </TouchableOpacity>
                )}
                renderContent={(section) => (
                  <View style={styles.content}>{section.content}</View>
                )}
                activeSections={isCollapsed === index ? [0] : []}
                onChange={() => setIsCollapsed(index)}
              />
            </View>
          </View>
        );
      });
    };
  
    return <ScrollView>{mostrarpedidos()}</ScrollView>;

}
const styles = StyleSheet.create({
    acordion: {
      marginTop: 10,
      backgroundColor: '#EBF7FF',
      borderRadius: 20,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 2,
      width: '90%',
    },
    map: {
      width: '100%',
      height: 200,
      marginTop: 20,
      borderRadius: 10,
    },
    button: {
      marginTop: 0,
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: 'red',
      borderRadius: 20,
      color: 'red',
    },
    buttonText: {
      color: 'white',
      fontSize: 10,
      fontWeight: 'bold',
    },
    header: {
      alignItems: 'center',
    },
    headerText: {
      alignItems: 'center',
      textAlign: 'center',
      marginTop: 0,
      fontSize: 20,
      fontWeight: 'bold',
    },
    container: {
      alignItems: 'center',
    
    },
    content: {
      padding: 20,
    },
  });


