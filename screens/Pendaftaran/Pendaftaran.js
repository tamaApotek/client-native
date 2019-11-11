import React, {useEffect, useState} from 'react'
import { View, Text, Image, StatusBar, TouchableOpacity, Modal, Dimensions } from 'react-native'
import axios from 'axios'
import Constants from 'expo-constants';
import Daftar from './DaftarPasien'
import {baseUrl} from '../../redux/'
import { SimpleLineIcons } from '@expo/vector-icons';

const screenWidth = Math.round(Dimensions.get('window').width);

export default (props) => {
    const [dokters, setDokters] = useState([])
    const [modal, setModal] = useState(false)
    const [dokter, setDokter] = useState(null)
    const fetchDocters = () => {
        axios({
            url: `${baseUrl}/dokters/all`,
            method: 'get'
        })
        .then(({data}) => {
            setDokters(data)
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        fetchDocters()
    }, [])
    return (
        <>
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <StatusBar barStyle={"dark-content"} />
                <View style={{marginTop: Constants.statusBarHeight, alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => props.navigation.navigate("Login")} style={{position: "absolute", top: 15, right: 20, alignItems: 'center', flexDirection: 'row', padding: 5}}>
                        <Text style={{fontWeight: '600', paddingRight: 5}}>Masuk</Text>
                        <SimpleLineIcons name="login" size={18} color="black" />
                    </TouchableOpacity>
                    <Text style={{fontFamily: 'Source', padding: 20, paddingTop: 80, fontSize: 25, fontWeight: '900'}}>Pilih dokter kamu!</Text>
                    {
                        dokters.map(dokter => {
                            return (
                                <View key={dokter._id}>
                                    {
                                        dokter.statusPraktek ?
                                        (
                                            <TouchableOpacity onPress={() => {
                                                setDokter(dokter._id)
                                                setModal(true)}}>
                                                <View style={[styles.box]}>
                                                        <Text style={styles.name}>{dokter.fullName}</Text>
                                                        <Text style={styles.text}>Spesialis {dokter.spesialis}</Text>
                                                        <Text style={styles.text}>Sedang: Buka</Text>        

                                                        <Image
                                                            style={{width: 120, height: 120, borderRadius: 120/2, 
                                                            bottom: -20,
                                                            right: -10,
                                                            position: 'absolute'}}
                                                            source={{uri: dokter.image}}
                                                        />
                                                </View>
                                            </TouchableOpacity>
                                        ): 
                                        (
                                            <View style={styles.box}>
                                                <Text style={styles.name}>{dokter.fullName}</Text>
                                                <Text style={styles.text}>Spesialis {dokter.spesialis}</Text>
                                                <Text style={styles.text}>Sedang: Tutup</Text>        

                                                <Image
                                                    style={{width: 120, height: 120, borderRadius: 120/2, 
                                                    bottom: -20,
                                                    right: -10,
                                                    position: 'absolute'}}
                                                    source={{uri: dokter.image}}
                                                />
                                            </View>
                                        )
                                    }
                                </View>
                            )
                        })
                    }
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modal}>
                <Daftar dokterId={dokter} setModal={setModal}/>
            </Modal>
        </>
    )
}

const styles = {
    box: {
        backgroundColor: 'rgb(127, 216, 193)',
        padding: 20,
        borderRadius: 10,
        borderBottomRightRadius: 40,
        width: screenWidth*0.8,
        height: 150,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    name: {
        fontSize: 16,
        fontFamily: 'Source',
        paddingBottom: 10,
        color: 'white'
    },
    text: {
        fontFamily: 'Source',
        paddingBottom: 10,
        color: 'white'
    }
}