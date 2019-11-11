import React, {useState, useEffect} from 'react'
import { View, Text, StatusBar, TouchableOpacity, Alert, Dimensions, ActivityIndicator, Modal, YellowBox } from 'react-native'
import Constants from 'expo-constants';
import { useDispatch, useSelector } from 'react-redux'
import { MaterialIcons } from '@expo/vector-icons'
import axios from 'axios'
import Setting from '../Tutup/Setting'
import { LinearGradient } from 'expo-linear-gradient';
import {baseUrl, socket} from '../../redux'
const screenWidth = Math.round(Dimensions.get('window').width);
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
])

export default (props) => {
    const [setting, setSetting] = useState(false)
    const dispatch = useDispatch()
    const totalPasien = useSelector(state => state.pasienTotal)
    const nomorPasien = useSelector(state => state.pasienSekarang)
    const [loading, setLoading] = useState(false)
    const token = useSelector(state => state.token)
    const [alamatPasien, setAlamatPasien] = useState("-")
    const [namaPasien, setNamaPasien] = useState("-")
    const [message, setMessage] = useState(null)
    const [patients, setPatients] = useState([])
    useEffect(() => {
        queueToday()
    }, [])

    useEffect(() => {
        if(socket){
            socket.on('addPatient', function (data) {
                dispatch({type: "addPatient", data: data.total})
            });
        }
        return () => {
            if(socket){
                socket.removeListener("addPatient", function(data){
                    console.log("listener off")
                })
            }
    };
    },[socket])

    const queueToday = () => {
        axios( {
            url: `${baseUrl}/queue/totaltoday`,
            method: "get",
            headers: {
                token
            }
        })
        .then(({data}) => {
            dispatch({type: "addPatient", data: data.total})
            if(data.current > 1){
                dispatch({type: "nextPatient", data: data.current})
                setAlamatPasien(data.patients[data.current - 1].patientId.address)
                setNamaPasien(data.patients[data.current - 1].patientId.fullName)
            }
            setPatients(data.patients)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const fetchAntrian = () => {
        axios({
            url: `${baseUrl}/queue/next/`,
            method: 'get',
            headers: {
                token
            }
        })
        .then(({data}) => {
            setMessage(null)
            setAlamatPasien(data.address)
            setNamaPasien(data.fullName)
            dispatch({type: "nextPatient", data: data.current})
        })
        .catch(err => {
            if(err.response){
                setMessage(err.response.data.message)
            }else if(err.request){
                setMessage(`Hmm.. sepertinya server kami sedang bermasalah`)
            }else {
                console.log(err.message)
            }
        })
    }

    const tutupPraktek = () => {
        Alert.alert(
            'Tutup praktek',
            'Pastikan semua pasien sudah dilayani ?',
            [
                {
                    text: 'Batalkan',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Tutup', onPress: () => {
                        setLoading(true)
                        axios({
                            url: `${baseUrl}/dokters/praktek`,
                            method: "patch",
                            data: {
                                status: false,
                            },
                            headers: {
                                token
                            }
                        })
                        .then(response => {
                            setLoading(false)
                        dispatch({type: 'bukaTutupPraktek', data: false})
                        })
                        .catch(err => {
                            setLoading(false)
                            console.log(err)
                        })
                    }
                },
            ],
            { cancelable: false },
          );
    }
    return (
        <>
            <StatusBar barStyle={"light-content"} />
            <View style={{ flex: 1, alignItems: 'center'}}>
                {
                    !loading ? (
                        <>
                            <View style={{backgroundColor: 'rgba(2, 167, 149, 0.7)', width: "100%", alignItems: 'center',
                            borderBottomLeftRadius: 20,
                            borderBottomRightRadius: 20,}}>
                                
                                {/* <Text style={{fontFamily: 'Source', fontSize: 25, paddingTop: 40,  
                                marginTop: Constants.statusBarHeight, color: "white"}}>Selamat melayani pasien!</Text> */}
                                <View style={{height: 35, padding: 5}}>
                                    {
                                        message ? <Text style={{fontWeight: '600', color: "white"}}>{message}</Text> : null
                                    }
                                </View>
                                <View style={{ width: "100%", paddingVertical: 30,paddingHorizontal: 25}}>
                                    <View>
                                        <Text style={styles.pasienTitel}>Nomor antrian: {nomorPasien}</Text>
                                        <Text style={{paddingVertical: 5, color: 'white', fontFamily: 'Source'}}>Nama: {namaPasien}</Text>
                                        <Text style={{paddingVertical: 5, color: 'white', fontFamily: 'Source'}}>Alamat: {alamatPasien}</Text>
                                    </View>
                                    <Text style={[styles.pasienTitel]}>Total pasien: {totalPasien}</Text>
                                </View>
                                <TouchableOpacity onPress={() => setSetting(true)} style={{ position: 'absolute', bottom: 20, right: 20}}>
                                    <MaterialIcons name="settings" size={40} color="white"  />
                                </TouchableOpacity>
                            </View>
                            {/* <View style={{width: '100%', height: screenHeight*0.4, flexDirection: 'row', flexWrap: 'wrap'}}> */}
                                <View style={[styles.section,{paddingTop: 30}]}>
                                    <TouchableOpacity onPress={() => props.navigation.navigate('ListPasien', {patients})}>
                                        <LinearGradient colors={['#C6DABE', '#88D498']} style={[styles.box]}>
                                            <MaterialIcons name="people" size={40} color="white" />
                                            <Text style={styles.iconText}>
                                                List pasien
                                            </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        props.navigation.navigate('Pendaftaran')
                                        
                                    }}>
                                        <LinearGradient colors={['#C6DABE', '#88D498']} style={[styles.box, styles.boxRight]}>
                                            <MaterialIcons name="person-add" size={40} color="white" />
                                            <Text style={styles.iconText}>
                                                Pasien baru
                                            </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.section,{}]}>
                                    <TouchableOpacity onPress={fetchAntrian}>
                                        <LinearGradient colors={['#C6DABE', '#88D498']} style={[styles.box]}>
                                            <MaterialIcons name="navigate-next" size={40} color="white" />
                                            <Text style={styles.iconText}>
                                                Next
                                            </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={tutupPraktek}>
                                        <LinearGradient colors={['#C6DABE', '#88D498']} style={[styles.box, styles.boxRight]}>
                                            <MaterialIcons name="exit-to-app" size={40} color="white" />
                                            <Text style={styles.iconText}>
                                                Tutup
                                            </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            {/* </View> */}
                        </>
                    ) : 
                        <View style={{height: '100%', width: '100%', position: "absolute", 
                            top: 0, left: 0, justifyContent: 'center', alignItems: 'center',
                            backgroundColor: "rgba(0, 0, 0, 0.2)"}}>
                                <ActivityIndicator size="large" color="green" />
                        </View> 
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
    section: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        marginTop: screenWidth*0.08
    },
    pasienTitel: {
        fontSize: 25,
        color: 'white',
        fontFamily: 'Source'
    },

    iconText : {
        fontFamily: 'Source', 
        fontSize: 14,
        color: 'white'
        
    },
    boxRight: {
        marginLeft: screenWidth*0.08
    },
    box : {
        borderRadius: 20,
        height: 130, 
        width: 130,
        backgroundColor: '#557466',
        justifyContent: 'center',
        borderColor: 'black',
        alignItems: 'center',
        // borderWidth: 1,
    }
}