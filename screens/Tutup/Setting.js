import React from 'react'
import { View, TouchableOpacity, Text, AsyncStorage } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'
import Constants from 'expo-constants';
export default (props) => {
    const setSetting = props.close
    const dispatch = useDispatch()
    const logout = async () => {
        dispatch({type: "logout"})
        try {
            await AsyncStorage.removeItem('fullName');
            await AsyncStorage.removeItem('token');
        } catch (err){
            console.log(err)
        }
    }
    return (
        <View style={{flex: 1, marginTop: Constants.statusBarHeight}}>
            <TouchableOpacity onPress={() => setSetting(false)} style={{position: 'absolute', top: 20, right: 20}}>
                <Feather name="x" size={40} color="grey"  />
            </TouchableOpacity>
            <View style={{paddingHorizontal: 20, paddingVertical: 20, marginTop: 60}}>
                <TouchableOpacity onPress={logout}>
                    <Text style={{fontFamily: 'Source', fontSize: 18}}>Sign out</Text>    
                </TouchableOpacity>
            </View>
        </View>
    )
}