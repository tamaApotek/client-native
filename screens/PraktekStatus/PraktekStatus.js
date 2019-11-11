import React, {useEffect} from 'react'
import { useSelector } from 'react-redux'
import {ImageBackground} from 'react-native'
import Buka from '../Buka/Buka'
import Tutup from '../Tutup/Tutup'

const Praktek =  (props) => {
    
    const praktek = useSelector(state => state.praktek)
    const isLogin = useSelector(state => state.isLogin)
    useEffect(() => {
        if(!isLogin) props.navigation.navigate("Login")
    }, [isLogin])
    return (
        <ImageBackground source={require('../../assets/background3.jpeg')} style={{flex: 1, width: '100%', height: '100%'}}>
            { praktek ? <Buka navigation={props.navigation} /> : <Tutup />}
        </ImageBackground>
    )
}

Praktek.navigationOptions = {
    header: null,
    headerBackTitle: null
}

export default Praktek

