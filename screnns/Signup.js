import { Text, StyleSheet, View ,Image, TextInput,TouchableOpacity, Alert} from 'react-native'
import React, { Component, useState } from 'react'
import appFirebase from '../credenciales'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { Picker } from "@react-native-picker/picker"
import{ getFirestore, doc ,getDoc, setDoc} from'firebase/firestore'
const auth = getAuth(appFirebase)


export default function Signup (props) {
    const firestore = getFirestore(appFirebase)
    
    
    const [email, setEmail]= useState()
    const [password, setPassword] =useState()
    const [roles, setRol] =useState()
    const [telefono, setTelefono]= useState()
    const [nombre, setNombre]= useState()

    const registro = async() => {
        if (!email || !password || !roles || !telefono || !nombre) {
            Alert.alert('Error', 'Por favor complete todos los campos')
            return
        }   

        if (!email.includes('@gmail.com') && !email.includes('@hotmail.com')) {
            Alert.alert('Error', 'Por favor ingrese un correo válido de Gmail o Hotmail');
            return;
        }

        if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres y contener números y letras');
            return;
        }

        const telefonoRegex = /^(0412|0416|0414|0424|0261)\d{7}$/;
        if (!telefonoRegex.test(telefono)) {
            Alert.alert('Error', 'Por favor ingrese un número de teléfono válido');
            return;
        }

        try {
            const infoUsuario = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            )

            const docuRef = doc(firestore, `usuario/${infoUsuario.user.uid}`)
            await setDoc(docuRef, { correo: email, rol: roles ,tlf:telefono, nombre:nombre})
            Alert.alert('Registrado', 'Fue registrado correctamente')
            props.navigation.navigate("Login")
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al registrar el usuario')
            console.error(error)
        }
    }
    

    return (
      <View style={styles.padre}>
            <View style={styles.tarjeta}>

            <View style={styles.cajaTexto}>
            <TextInput placeholder='Correo electrónico' style={{paddingHorizontal:15}}
                    onChangeText={(text) => setEmail(text)}/>
            </View>

            <View style ={styles.cajaTexto}>
            <TextInput placeholder='Contraseña' style={{paddingHorizontal:15}} secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}/>
              </View>
            <View style ={styles.cajaTexto}>
            <TextInput placeholder='Número de teléfono' style={{paddingHorizontal:15}}
                    onChangeText={(text) => setTelefono(text)}/>
              </View>
              <View style ={styles.cajaTexto}>
            <TextInput placeholder='Nombre' style={{paddingHorizontal:15}}
                    onChangeText={(text) => setNombre(text)}/>
              </View>
              <Picker style={styles.picker}
              selectedValue={roles}
              onValueChange={(value,index) => setRol(value)}
              mode="dropdown"
              >
              <Picker.Item label="Seleccione una" value="Unknown" />
                <Picker.Item label="Trabajador" value="empresa-trabajador" />
                <Picker.Item label="Cliente" value="usuario" />

              </Picker>
              <View style={styles.PadreBoton}>
                        <TouchableOpacity style={styles.cajaBoton} onPress={registro}>
                            <Text style={styles.textoBoton}> Registrar</Text>
                        </TouchableOpacity>

                     
                    </View>

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
        picker: {
            marginVertical: 10,
            width: 300,
            padding: 10,
            borderWidth: 1,
            borderColor: "#666",
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
            color:'white',
            alignItems:'center'
        },
})