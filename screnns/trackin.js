import React from 'react'
import { View } from 'react-native'
import  MapView   from '@rnmapbox/maps'
import { Marker } from 'react-native-maps';
import { getFirestore,collection, query, where, getDocs } from "firebase/firestore";
import appFirebase from '../credenciales'
import { StyleSheet, Text, View, Button ,TouchableOpacity} from 'react-native';
import React, { useEffect, useState ,useRef, useCallback} from 'react';

export default function trackin() {

    const firestore = getFirestore(appFirebase)





  return (
    <View>
        <MapView
            style={{flex: 1}}
            initialcoordinate={{}}
            initialZoomLevel={10}
        />





    </View>
  )
}

// Path: StickerSmash/screnns/trackin.js

const styles = {


}