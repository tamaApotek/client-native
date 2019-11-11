import React, {useState} from 'react'
import { View, Text, StatusBar, TouchableOpacity, Modal, ActivityIndicator } from 'react-native'
import Constants from 'expo-constants';
import {  useDispatch, useSelector } from 'react-redux'
import { MaterialIcons } from '@expo/vector-icons'
import axios from 'axios'
import {baseUrl} from '../../redux'
import { LinearGradient } from 'expo-linear-gradient';

import Setting from './Setting'
export default (props) => {
    const dispatch = useDispatch()
    const [setting, setSetting] = useState(false)
    const [loading, setLoading] = useState(false)
    const token = useSelector(state => state.token)
    const bukaPraktek = () => {
        setLoading(true)
        axios({
            url: `${baseUrl}/dokters/praktek`,
            method: "patch",
            data: {
                status: true,
            },
            headers: {
                token
            }
        })
        .then(({data}) => {
            setLoading(false)
            dispatch({type: 'bukaTutupPraktek', data: true, session: "5dc27902fe3be52b49803026"})
        })
        .catch(err => {
            setLoading(false)
            console.log(err)
        })
    }
     return (
        <>
            <StatusBar barStyle={"dark-content"} />
            <View style={{marginTop: Constants.statusBarHeight, flex: 1, alignItems: 'center', justifyContent: "center"}}>
                {
                    !loading ? (
                        <>
                            <TouchableOpacity onPress={() => setSetting(true)} style={{position: 'absolute', top: 20, right: 20}}>
                                <MaterialIcons name="settings" size={40} color="grey"  />
                            </TouchableOpacity>

                            <Text style={{fontFamily: 'Source', fontSize: 25}}>Mulai prakteknya dok ?</Text>
                            
                            <TouchableOpacity onPress={bukaPraktek}>
                                <LinearGradient colors={['#C6DABE', '#88D498']} style={[styles.box]}>
                                        <Text style={styles.iconText}>
                                            Mulai
                                        </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </>
                    ): <ActivityIndicator size="large" color="green" />
                }
                
            </View>
            <Modal
                animationType="fade"
                transparent={false}
                visible={setting}
            >
                <Setting close={setSetting} />
            </Modal>
        </>
    )
}

const styles = {
    iconText : {
        fontFamily: 'Source', 
        fontSize: 20,
        color: 'white'
    },
    box : {
        marginTop: 30,
        borderRadius: 20,
        paddingVertical: 30,
        paddingHorizontal: 40,
        backgroundColor: '#557466',
        justifyContent: 'center',
        borderColor: 'black',
        alignItems: 'center',
    }
}