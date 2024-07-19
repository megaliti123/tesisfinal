import { Text, StyleSheet, View, Button } from 'react-native'
import React, { Component, useEffect, useRef, useState } from 'react'
import MapView, { Marker, Polyline ,PROVIDER_GOOGLE} from 'react-native-maps';
import { Alert,ActivityIndicator } from 'react-native'
import * as Location from 'expo-location'
import{ getFirestore, addDoc,doc ,getDoc, setDoc, collection} from'firebase/firestore'
import appFirebase from '../credenciales'
import { Picker } from "@react-native-picker/picker"




export default function Home ({route,navigation}) {
    const {user} = route.params

    const [ubis, setUbis] = React.useState([
      {
          id: 1,
          latitude: 10.708048782517325,
          longitude: -71.62462776931397,
          name: 'Centro Comercial North Center'
      },
  
      {
          id: 2,
          latitude: 10.71203314466975, 
          longitude: -71.62266407086163,
          name: 'Hospital Militar Maracaibo'
      },
      
      {
          id: 3,
          latitude: 10.698611490933029, 
          longitude: -71.62530673536733,
          name: 'Doral Center Mall'
      },
  
      {
          id: 4,
          latitude: 10.693162575320185, 
          longitude: -71.62576369615107,
          name: "McDonald's (Delicias)"
      },
      
      {
          id: 5,
          latitude: 10.694261855019533,  
          longitude: -71.63379313352085,
          name: 'Universidad Privada Dr. Rafael Belloso Chacín'
      },
      
      {
          id: 6,
          latitude: 10.686229929250011,  
          longitude: -71.62630500663921,
          name: 'Hospital Clínico'
      },
  
      {
          id: 7,
          latitude: 10.685501141014617,  
          longitude: -71.62558749501264,
          name: 'Mall Delicias Plaza'
      },
  
      {
          id: 8,
          latitude: 10.698611490933029, 
          longitude: -71.62530673536733,
          name: 'Doral Center Mall'
      },
  
      {
          id: 9,
          latitude: 10.683814289023761, 
          longitude: -71.62404254265255,
          name: 'SNÖ Delicias'
      },
      {
          id: 10,
          latitude: 10.680841189727163,  
          longitude: -71.62316277813063,
          name: 'Alkosto | Av. Universidad'
      },
  
      {
          id: 11,
          latitude: 10.677277649276594,  
          longitude: -71.62228301355475,
          name: 'El Tacón'
      },
  
      {
          id: 12,
          latitude: 10.66430938335031,  
          longitude: -71.6133351643375,
          name: 'Centro Electronico de Idiomas'
      },
  
      {
          id: 13,
          latitude: 10.672006063198896,   
          longitude: -71.61043837859893,
          name: 'Policlinica Maracaibo'
      },
  
      {
          id: 14,
          latitude: 10.671563245813312,   
          longitude: -71.61376431769955,
          name: 'Diez Active Club'
      },
  
      {
          id: 15,
          latitude: 10.678289783356801,   
          longitude: -71.60679057440858,
          name: 'Centro Comercial Costa Verde'
      },
  
      {
          id: 16,
          latitude: 10.675358802605228,   
          longitude: -71.61035254784429,
          name: 'Hotel Kristoff Maracaibo'
      },
  
      {
          id: 17,
          latitude: 10.683244974407176, 
          longitude: -71.62151053730638,
          name: 'Circulo Militar de Maracaibo'
      },
  
      {
          id: 18,
          latitude: 10.684320345571914,    
          longitude: -71.61593154270004,
          name: 'Centro Médico Paraíso'
      },
  
      {
          id: 19,
          latitude: 10.681452680622648, 
          longitude: -71.60350755058482,
          name: 'Cevaz Las Mercedes'
      },
  
      {
          id: 20,
          latitude: 10.67114151434759,    
          longitude: -71.61121085490129,
          name: 'Hamdella'
      },
  
      {
          id: 21,
          latitude: 10.662411542020006,    
          longitude: -71.62944987601495,
          name: 'Plaza de Las Madres'
      },
  
      {
          id: 22,
          latitude: 10.665827647988754,   
          longitude: -71.63655236549252,
          name: 'Estadio Alejandro Borges'
      },
  
      {
          id: 23,
          latitude: 10.669538929537106,   
          longitude: -71.64378360102906,
          name: 'Parque Monumental Ana María Campos'
      },
  
      {
          id: 24,
          latitude: 10.66764112071739,    
          longitude: -71.64665892907453,
          name: 'Cementerio Sagrado Corazón de Jesús'
      },
      
      {
          id: 25,
          latitude: 10.669757879532694,     
          longitude: -71.64805280911435,
          name: 'Centro Educativo LOGROS'
      },
  
      {
          id: 26,
          latitude: 10.665308556884101,   
          longitude: -71.63826811065923,
          name: 'Licorería El Ventarrón'
      },
  
      {
          id: 27,
          latitude: 10.705877220186242, 
          longitude: -71.64032804717772,
          name: "Casa D' Italia Maracaibo"
      },
  
      {
          id: 28,
          latitude: 10.722956037721636,  
          longitude: -71.63270381033779,
          name: 'Centro Sambil Maracaibo'
      },
  
      {
          id: 29,
          latitude: 10.69430290526433, 
          longitude: -71.63690951401489,
          name: 'Plaza para Todos de Maracaibo'
      },
  
      {
          id: 30,
          latitude: 10.689052699996411,   
          longitude: -71.63442042405578,
          name: 'Colegio de Médicos del Zulia'
      },
  
      {
          id: 31,
          latitude: 10.6918148675173,     
          longitude: -71.63506415422302,
          name: 'Colegio de Abogados'
      },
  
      {
          id: 32,
          latitude: 10.694668652947362, 
          longitude: -71.62569612274194,
          name: 'Mi Ternerita Norte Bar & Grill'
      },
  
      {
          id: 33,
          latitude: 10.666285286104,     
          longitude: -71.60607530921328,
          name: 'Plaza de la República'
      },
  
      {
          id: 34,
          latitude: 10.663112634257933, 
          longitude: -71.59192061852585,
          name: 'Inter Maracaibo Hotel'
      },
  
      {
          id: 35,
          latitude: 10.668110201699307,    
          longitude: -71.59144853544754,
          name: 'Vereda Del Lago Segunda Etapa'
      },
  
      {
          id: 36,
          latitude: 10.683461002562808,   
          longitude: -71.59526800111232,
          name: 'C.C. Lago Mall'
      },
  
      {
          id: 37,
          latitude: 10.64983686869471, 
          longitude: -71.59656716452014,
          name: 'Universidad Rafael Urdaneta'
      },
  
      {
          id: 38,
          latitude: 10.642455957158086,  
          longitude: -71.60581542128126,
          name: 'Hospital Central de Maracaibo'
      },
  
      {
          id: 39,
          latitude: 10.642687931387147,  
          longitude: -71.60804701913261,
          name: 'Teatro Baralt'
      },
  
      {
          id: 40,
          latitude: 10.64477569141732,  
          longitude: -71.61806775198038,
          name: 'C.C. Ciudad Chinita'
      },
  
      {
          id: 41,
          latitude: 10.63851236838438,     
          longitude: -71.62040663833088,
          name: 'Mercado Las Playitas'
      },
  
      {
          id: 42,
          latitude: 10.642434868583702,  
          longitude: -71.6365857231498,
          name: 'Hotel Aladdin'
      },
  
      {
          id: 43,
          latitude: 10.664305674138511,   
          longitude: -71.65817208856423,
          name: 'Clinica La Sagrada Familia'
      },
  
      {
          id: 44,
          latitude: 10.685160062408903,   
          longitude: -71.66971631607973,
          name: 'Mango Bajito'
      },
      
      {
          id: 45,
          latitude: 10.681275056441425,    
          longitude: -71.66548955066192,
          name: 'Traki La Limpia'
      },
  
      {
          id: 46,
          latitude: 10.67375700058061,     
          longitude: -71.65437464426653,
          name: 'Centro Comercial Galerías Mall'
      },
  
      {
          id: 47,
          latitude: 10.668295654866132, 
          longitude:  -71.66599477361962,
          name: 'Centro Comercial Punta de Mata'
      },
      
      {
          id: 48,
          latitude: 10.610457869507522,  
          longitude:  -71.65778597065193,
          name: 'Policlinica del Zuliano'
      },
  
      {
          id: 49,
          latitude: 10.606408412203777,  
          longitude:  -71.6557260341224,
          name: 'Maruma Hotel Maracaibo'
      },
  
      {
          id: 50,
          latitude: 10.599827930034117,  
          longitude:  -71.65203531459025,
          name: 'Metrosol Maracaibo'
      },
  
  
  ])

const [isLoading, setIsLoading] = React.useState(false);
const [pedidoHora, setPedidoHora] = React.useState(''); 
const [pedidoDia, setPedidoDia] = React.useState('');
const [namethis, setNamethis] = React.useState('')

const firestore = getFirestore(appFirebase)

const sendform = async() => {
    
    
    const docRef = await addDoc(collection(firestore,"pedido"), {
        origen:{latitude:origin.latitude, longitude:origin.longitude},
        destino:{latitude:destination.latitude, longitude:destination.longitude},
        estado:'pendiente',
        nombre:user.nombre,
        telefono:user.tlf,
        correo:user.correo,
        actual:{
            longitude:0,
            latitude:0
        },
        correo_recibe:'',
        nombre_recibe:'',
        telefono_recibe:'',
    });

    Alert.alert('Envaido','su pedido fue enviado correctamente')
    navigation.navigate('vistaUsuario', { pedido: docRef.id });
    setIsLoading(false);
}

const renderUbisPicker = () => {
    const handleValueChange = (itemValue) => {
        console.log(itemValue);
        setOrigin(itemValue);
    };

    return (
        <>
            <Text>lugar de recogida</Text>
            <Picker
                selectedValue={origin}
                onValueChange={handleValueChange}
            >
                {ubis.map((ubi) => (
                    <Picker.Item
                        key={ubi.id}
                        label={ubi.name}
                        value={ubi} 
                    />
                ))}
            </Picker>
        </>
    );
};

const renderDestinationPicker = () => {
    const handleValueChange = (itemValue) => {
        console.log(itemValue);
        setDestination(itemValue);
    };
    
    return (
        <View>
            <Text>Lugar de destino</Text>
            <Picker
                selectedValue={destination}
                onValueChange={handleValueChange}
            >
                {ubis.map((ubi) => (
                    <Picker.Item
                        key={ubi.id}
                        label={ubi.name}
                        value={ubi}  // Directamente el objeto 'ubi'
                    />
                ))}
            </Picker>
        </View>
    );
};

const [origin, setOrigin] =  React.useState({
    latitude:0, 
    longitude:0,
})

const [destination, setDestination]= React.useState({
    latitude:0,
    longitude:0,
})

const handleHistory = () => {
    navigation.navigate('Historial' , {user:user})
}

const userLocation = async() => {
    setIsLoading(true);
    try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permiso denegado');
            setIsLoading(false);
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setOrigin({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        });
        console.log(location);
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
    }
}

useEffect(() => {
    userLocation()
    
},[])



    


return (
   
    <View style={styles.padre}>
        
        {isLoading ? (
            <ActivityIndicator style={styles.loading} size="large" color="blue" />
        ) : (
            <><Button title='Historial' onPress={handleHistory} /><View style={styles.tarjeta}>
                    {renderUbisPicker()}
                    {renderDestinationPicker()}
                    <MapView style={styles.map}
                        initialRegion={{
                            latitude: 10.700363,
                            longitude: -71.631440,
                            latitudeDelta: 0.09,
                            longitudeDelta: 0.04
                        }}
                    >
                        <Marker
                            draggable
                            coordinate={origin}
                            onDragEnd={(direction) => setOrigin(direction.nativeEvent.coordinate)} />
                        <Marker
                            draggable
                            coordinate={destination}
                            onDragEnd={(direction) => setDestination(direction.nativeEvent.coordinate)} />
                        <Polyline
                            coordinates={[origin, destination]}
                            strokeWidth={4}
                            strokeColor='pink' />
                    </MapView>
                    <Button title='Enviar' onPress={sendform} />
                </View></>
        )}
    </View>
)
}
const styles = StyleSheet.create({
  map: {
    alignContent:'center',
    width: '100%',
    height: '70%',
  },
  padre:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white',
},
tarjeta:{
  margin:20,
  backgroundColor:"white",
  borderRadius:20,
  width: '90%',
  padding:20,
  shadowColor:'#000',
  shadowOffset:{
      width:0,
      height:2
  },
  shadowOpacity: 0.25,
  shadowRadius:4,
  elevation:5,

  },
  cajaTexto:{
    paddingVertical:10,
    backgroundColor:'#cccccc90',
    borderRadius:30,
    marginVertical:10,
    alignContent:"flex-start"
},

})