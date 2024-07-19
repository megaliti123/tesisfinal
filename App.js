import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './screnns/Login';
import Home from './screnns/Home';
import Signup from './screnns/Signup';
import Trabajador from './screnns/trabajador';
import VistaTrabajador from './screnns/vistaTrabajador';
import VistaUsuario from './screnns/vistaUsuario';
import Admin from './screnns/admin';
import Historial from './screnns/historial';


export default function App() {

  //navegacion de las pantallas

  const Stack = createStackNavigator();
  //se crea el sistema de navegacion entre pantallas
  function MyStack(){
  return(

  <Stack.Navigator>
  <Stack.Screen name="Login" component={Login} options = {{
    title:"LOGIN",
    headerTintColor:"white",
    headerTitleAlign:"center",
    headerStyle: {backgroundColor: '#018FA6'}
  }}/>
  
  <Stack.Screen name="Home" component={Home} 
  options = {{
    title:"HOME",
    headerTintColor:"white",
    headerTitleAlign:"center",
    headerStyle: {backgroundColor: '#018FA6'} }}/>
  
  <Stack.Screen name="Signup" component={Signup} />
  <Stack.Screen name="Trabajador" component={Trabajador} />
  <Stack.Screen name="admin" component={Admin} />
 <Stack.Screen name="vistaTrabajador" component={VistaTrabajador} />
 <Stack.Screen name="vistaUsuario" component={VistaUsuario} />
 <Stack.Screen name="Historial" component={Historial} />
  </Stack.Navigator>


  )
  }

  return (
      <NavigationContainer>
        <MyStack/>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
