
// Import the required modules from Firebase and React Native

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Animated ,TouchableOpacity, Alert} from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import appFirebase from '../credenciales';
import MapView, { Marker ,Polyline} from 'react-native-maps';
import Accordion from 'react-native-collapsible/Accordion';

export default function Historial({ route, navigation,navigate}) {
    const firestore = getFirestore(appFirebase);
    const [pedidosEntregados, setPedidosEntregados] = useState([]);
    const [pedidosCancelados, setPedidosCancelados] = useState([]);
    const [pedidosEnProceso, setPedidosEnProceso] = useState([]);
    const [pedidosPendientes, setPedidosPendientes] = useState([]);
    const { user } = route.params;
    const [isLoading, setIsLoading] = useState(false);

    const [animation] = useState(new Animated.Value(0));
    const [isCollapsed, setIsCollapsed] = useState(true);
    
    const callCollection = async () => {
        const pedidosRef = collection(firestore, 'pedido');
        const q = query(pedidosRef, where('estado', '==', 'pendiente'), where('correo', '==', user.correo));
        const querySnapshot = await getDocs(q);
        const pedidosData = [];
        
        querySnapshot.forEach((doc) => {
            pedidosPendientes.push({ ...doc.data(), id: doc.id });
        });

        const q2 = query(pedidosRef, where('estado', '==', 'cancelado'), where('correo', '==', user.correo));
        const querySnapshot2 = await getDocs(q2);
        
        querySnapshot2.forEach((doc) => {
            pedidosCancelados.push({ ...doc.data(), id: doc.id });
        })

        const q3 = query(pedidosRef, where('estado', '==', 'en proceso'), where('correo', '==', user.correo));
        const querySnapshot3 = await getDocs(q3);

        querySnapshot3.forEach((doc) => {
            pedidosEnProceso.push({ ...doc.data(), id: doc.id });
        });

        const q4 = query(pedidosRef, where('estado', '==', 'entregado'), where('correo', '==', user.correo));
        const querySnapshot4 = await getDocs(q4);

        querySnapshot4.forEach((doc) => {
            pedidosEntregados.push({ ...doc.data(), id: doc.id });
        })

        
        setIsLoading(false); // Set isLoading to false after data is fetched
        console.log(pedidosPendientes)
        console.log(pedidosCancelados)
        console.log(pedidosEnProceso)
        console.log(pedidosEntregados)
    }

    useEffect(() => {
        setIsLoading(true); // Set isLoading to true before fetching data
      
    
        callCollection();
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

const handlePress = async (pedido) => {
    navigation.navigate('vistaUsuario', { pedido: pedido.id });
}

const PendingOrders = () => {
    const [activeSection, setActiveSection] = useState(null);

    return (
        <View>
            <Text>Pedidos Pendientes</Text>
            {pedidosPendientes.map((pedido, index) => (
                <View key={index} style={styles.container}>
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
                                                <Marker
                                                    coordinate={pedido.origen}
                                                    title="Origen"
                                                    description="Origen"
                                                />
                                                <Marker
                                                    coordinate={pedido.destino}
                                                    title="Destino"
                                                    description="Destino"
                                                />
                                                <Polyline
                                                    coordinates={[pedido.origen, pedido.destino]}
                                                />
                                            </MapView>
                                            <Button
                                                title="Ver Pedido"
                                                onPress={() => {
                                                    handlePress(pedido);
                                                }}
                                            />
                                        </>
                                    ),
                                },
                            ]}
                            renderHeader={(_section, _index, isActive) => (
                                <TouchableOpacity
                                    style={styles.header}
                                    onPress={() => setActiveSection(isActive ? null : index)}
                                >
                                    <Text style={styles.headerText}>Pedido {pedido.id}</Text>
                                </TouchableOpacity>
                            )}
                            renderContent={(section) => (
                                <View style={styles.content}>{section.content}</View>
                            )}
                            activeSections={activeSection === index ? [0] : []}
                            onChange={() => setActiveSection(index)}
                        />
                    </View>
                </View>
            ))}
        </View>
    );
};

const InProcessOrders = () => {
    const [activeSection, setActiveSection] = useState(null);

    return (
        <View>
            <Text>Pedidos en Proceso</Text>
            {pedidosEnProceso.map((pedido, index) => (
                <View key={index} style={styles.container}>
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
                                                <Marker
                                                    coordinate={pedido.origen}
                                                    title="Origen"
                                                    description="Origen"
                                                />
                                                <Marker
                                                    coordinate={pedido.destino}
                                                    title="Destino"
                                                    description="Destino"
                                                />

                                                <Marker 
                                                coordinate={pedido.actual} 
                                                title="actual" 
                                                description="actual" 
                                                
                                                />

                                                <Polyline
                                                    coordinates={[pedido.origen, pedido.destino]}
                                                />
                                                <Polyline coordinates={[pedido.actual, pedido.origen]} />
                                            </MapView>
                                            <Button
                                                title="Ver Pedido"
                                                onPress={() => {
                                                    handlePress(pedido);
                                                }}
                                            />
                                        </>
                                    ),
                                },
                            ]}
                            renderHeader={(_section, _index, isActive) => (
                                <TouchableOpacity
                                    style={styles.header}
                                    onPress={() => setActiveSection(isActive ? null : index)}
                                >
                                    <Text style={styles.headerText}>Pedido {pedido.id}</Text>
                                </TouchableOpacity>
                            )}
                            renderContent={(section) => (
                                <View style={styles.content}>{section.content}</View>
                            )}
                            activeSections={activeSection === index ? [0] : []}
                            onChange={() => setActiveSection(index)}
                        />
                    </View>
                </View>
            ))}
        </View>
    );
};

const CanceledOrders = () => {
    const [activeSection, setActiveSection] = useState(null);

    return (
        <View>
            <Text>Pedidos Cancelados</Text>
            {pedidosCancelados.map((pedido, index) => (
                <View key={index} style={styles.container}>
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
                                                <Marker
                                                    coordinate={pedido.origen}
                                                    title="Origen"
                                                    description="Origen"
                                                />
                                                <Marker
                                                    coordinate={pedido.destino}
                                                    title="Destino"
                                                    description="Destino"
                                                />
                                                <Polyline
                                                    coordinates={[pedido.origen, pedido.destino]}
                                                />
                                            </MapView>
                                           
                                        </>
                                    ),
                                },
                            ]}
                            renderHeader={(_section, _index, isActive) => (
                                <TouchableOpacity
                                    style={styles.header}
                                    onPress={() => setActiveSection(isActive ? null : index)}
                                >
                                    <Text style={styles.headerText}>Pedido {pedido.id}</Text>
                                </TouchableOpacity>
                            )}
                            renderContent={(section) => (
                                <View style={styles.content}>{section.content}</View>
                            )}
                            activeSections={activeSection === index ? [0] : []}
                            onChange={() => setActiveSection(index)}
                        />
                    </View>
                </View>
            ))}
        </View>
    );
};

const DeliveredOrders = () => {
    const [activeSection, setActiveSection] = useState(null);

    return (
        <View>
            <Text>Pedidos Entregados</Text>
            {pedidosEntregados.map((pedido, index) => (
                <View key={index} style={styles.container}>
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
                                                <Marker
                                                    coordinate={pedido.origen}
                                                    title="Origen"
                                                    description="Origen"
                                                />
                                                <Marker
                                                    coordinate={pedido.destino}
                                                    title="Destino"
                                                    description="Destino"
                                                />
                                                <Marker coordinate={pedido.actual} title="final" description="final" />
                                                <Polyline
                                                    coordinates={[pedido.origen, pedido.destino]}
                                                />
                                            </MapView>
                                        
                                        </>
                                    ),
                                },
                            ]}
                            renderHeader={(_section, _index, isActive) => (
                                <TouchableOpacity
                                    style={styles.header}
                                    onPress={() => setActiveSection(isActive ? null : index)}
                                >
                                    <Text style={styles.headerText}>Pedido {pedido.id}</Text>
                                </TouchableOpacity>
                            )}
                            renderContent={(section) => (
                                <View style={styles.content}>{section.content}</View>
                            )}
                            activeSections={activeSection === index ? [0] : []}
                            onChange={() => setActiveSection(index)}
                        />
                    </View>
                </View>
            ))}
        </View>
    );
};

// Replace $PLACEHOLDER$ with <DeliveredOrders /> in the return statement of the historial component

return (
    <View>
        {isLoading ? (
            <Text>Loading...</Text>
        ) : (
            <>
                <PendingOrders />
                <InProcessOrders />
                <CanceledOrders />
                <DeliveredOrders />
            </>
        )}
    </View>
);


}

const styles = StyleSheet.create({
    acordion: {
      marginTop: 10,
      backgroundColor: 'white',
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
      backgroundColor: 'blue',
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
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

    


