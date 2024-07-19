import { Text, StyleSheet, View,Image, TextInput, TouchableOpacity, Alert, ViewBase} from 'react-native'
import React, { Component, useState } from 'react'
import appFirebase from '../credenciales'
import {getAuth, signInWithEmailAndPassword} from'firebase/auth'
import Home from './Home'
import Signup from './Signup'
import { getFirestore,collection, query, where, getDocs } from "firebase/firestore";



const auth = getAuth(appFirebase)

export default function Login(props){
    //variables de estado
    const [email, setEmail]= useState()
    const [password, setPassword] = useState()
    const firestore = getFirestore(appFirebase)

    const logueo = async() => {
        try {
            await signInWithEmailAndPassword(auth,email,password)
            Alert.alert('iniciando sesion','accediendo... ')
            
            var userRef = collection(firestore, 'usuario')
            
            var q = query(userRef, where("correo", "==", email));

            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {

            // doc.data() is never undefined for query doc snapshots
                if(doc.data().rol === 'empresa-trabajador'){
                    props.navigation.navigate("Trabajador", { user: doc.data() })
                }
                else if(doc.data().rol === 'usuario'){
                    props.navigation.navigate("Home", { user: doc.data() })
                   
                }else if(doc.data().rol === 'admin'){
                    props.navigation.navigate("admin", { user: doc.data() })
                }
                
            });

            

        } catch (error) {
            console.log(error)
        if (error.code === 'auth/invalid-email') {
            Alert.alert('Error', 'Correo electrónico inválido');
        }else if (email === '') {
            Alert.alert('Error', 'campo vacio');
        } else if (error.code === 'auth/missing-password') {
            Alert.alert('Error', 'dejo el campo de contraseña vacio');
        }  else {
            Alert.alert('Error', 'Usuario o contraseña incorrecta');
        }

           
        }
    }

    

    const signUp = () =>{
        props.navigation.navigate("Signup")
    }


        return (
            <View style={styles.padre}>
                  <View>
                      <Image source={require('../assets/img1.jpg')} style={styles.profile}/>
                  </View>
                
                <View style= {styles.tarjeta}>

                    <View style={styles.cajaTexto}>
                    <TextInput placeholder='@gmail.com' style={{paddingHorizontal:15}}
                    onChangeText={(text) => setEmail(text)}/>
                    </View>

                    <View style ={styles.cajaTexto}>
                    <TextInput placeholder='password' secureTextEntry={true} style={{paddingHorizontal:15}}
                    onChangeText={(text) => setPassword(text)}
                    />

                    </View>

                    <View style={styles.PadreBoton}>
                        <TouchableOpacity style={styles.cajaBoton} onPress={logueo}>
                            <Text style={styles.textoBoton}> Sign In</Text>
                        </TouchableOpacity>

                     
                    </View>

                    
                
                </View>

                <View style={styles.foot}>
                    <Text style={styles.footText} >
                    ¿No tienes cuenta?
                        </Text>
                        <TouchableOpacity onPress={signUp}>
                            <Text style={styles.footTextsign}> {"  "} Regístrate
                            </Text>
                        </TouchableOpacity>
                    </View>


            </View>
          )
   
  
}

const styles = StyleSheet.create({

    padre:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
    },
    profile:{
        width:100,
        height:100,
        borderRadius:50,
        borderColor:'white'
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
            paddingVertical:20,
            backgroundColor:'#E3FFFF',
            borderRadius:30,
            marginVertical:10
        },

        PadreBoton:{
            alignItems:'center'
        },
        cajaBoton:{
            backgroundColor:'#D08AD2',
            borderRadius:30,
            paddingVertical:20,
            width:150,
            marginTop:20

        },

        textoBoton:{
            textAlign:'center',
            color:'white'
        },
    
    foot:{
        textAlign:'center',
        color:'black',
        marginTop:20,
        alignItems:'center'
    },
    footTextsign:{
       color:'#37C0FF',

    }
})