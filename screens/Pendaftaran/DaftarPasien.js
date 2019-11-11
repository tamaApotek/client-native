import React, {useState, useEffect} from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import {View, StatusBar, Text, TextInput, TouchableOpacity, ActivityIndicator, Dimensions} from 'react-native'
import axios from 'axios'
import {baseUrl, socket} from '../../redux'

const screenWidth = Math.round(Dimensions.get('window').width);

const DaftarPasien = (props) => {
    
    const [fullName, setFullName] = useState("")
    const [address, setAddress] = useState("")
    const [noTelefon, setNoTelefon] = useState("")
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState(null)
    const [total, setTotal] = useState(null)
    const [current, setCurrent] = useState(null)
    const [registered, setRegistered] = useState(false)
    const setModal = props.setModal
    const dokterId = props.dokterId
    const cancel = () => {
        setFullName("")
        setAddress("")
        setNoTelefon("")
        setRegistered(false)
        setErr(null)
        setTotal(null)
        setCurrent(null)
    }
    const daftarPasien = () => {
        setLoading(true)
        axios({
            url: `${baseUrl}/patients`,
            method: 'post',
            data: {
                fullName,
                address,
                noTelefon,
                dokterId
            }
        })
        .then(({data}) => {
            // socket.emit("addPatient")
            setTotal(data.total)
            setCurrent(data.current)
            setRegistered(true)
            setLoading(false)
        })
        .catch(err => {
            setLoading(false)
            if(err.response){
                setErr(err.response.data.message)
            }else if(err.request){
                setErr("Hmm.. sepertinya server kami sedang bermasalah")
            }else {
                console.log(err.message)
            }
        })
    }
    useEffect(()=>{
        if(registered){
            console.log(screenWidth/100)
            setTimeout(() => {
                cancel()
                setModal(false)
            }, 180000);
        }
    }, [registered])
    return (
        <>
            {
                !registered ?
                (

                    <View style={{flex: 1, backgroundColor: 'rgb(219, 219, 219)'}}>
                        <StatusBar barStyle={"dark-content"} />
                        <View style={{marginTop: 100}}>
                            {
                                err ? <Text style={{color: "red", padding: 10}}>{err}</Text> : null
                            }
                        </View>
                        <View style={{width: '100%', backgroundColor: 'white'}}>
                            <View style={[styles.box, {borderColor: 'rgb(237, 237, 237)', borderBottomWidth: 1}]}>
                                <Text style={styles.title}>Nama Lengkap</Text>
                                <TextInput placeholderTextColor="grey" value={fullName} onChangeText={text => setFullName(text)} style={styles.input} placeholder="Soekarno" />
                            </View>
                            <View style={[styles.box, {borderColor: 'rgb(237, 237, 237)', borderBottomWidth: 1}]}>
                                <Text style={styles.title}>Alamat</Text>
                                <TextInput placeholderTextColor="grey" value={address} style={styles.input} onChangeText={text => setAddress(text)} placeholder="Jl. jalan sendirian" />
                            </View>
                            <View style={styles.box}>
                                <Text style={styles.title}>No.Telefon</Text>
                                <TextInput placeholderTextColor="grey" keyboardType={"phone-pad"} value={noTelefon} style={styles.input} onChangeText={text => setNoTelefon(text)} placeholder="08123456789" />
                            </View>
                        </View>
                        <TouchableOpacity onPress={daftarPasien}>
                            <LinearGradient colors={['#C6DABE', '#88D498']} style={{padding: 15, marginTop: 50}}>
                                <Text style={{textAlign: 'center', color: 'white', fontSize: 18, fontFamily: 'Source'}}>
                                    Daftar
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <Text onPress={() => {
                            cancel() 
                            setModal(false)
                        }} style={{textAlign: 'center', textDecorationLine: 'underline', 
                        paddingHorizontal: 20, marginTop: 40, color: 'rgb(84, 84, 84)',
                        fontFamily: 'Source'
                        }}>Kembali</Text>
                        {
                            loading ? 
                            (
                                <View style={{height: '100%', width: '100%', position: "absolute", 
                                    top: 0, left: 0, justifyContent: 'center', alignItems: 'center',
                                    backgroundColor: "rgba(0, 0, 0, 0.2)"}}>
                                        <ActivityIndicator size="large" color="green" />
                                </View> 
                            ): null
                        }
                    </View>
                ): 
                (
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 20, padding: 20}}>Nomor antrian kamu adalah:</Text>
                        <Text style={{fontSize: screenWidth/3.75}}>
                            {total}
                        </Text>
                        <Text style={{fontSize: 20, padding: 20}}>Sekarang pasien no:</Text>
                        <Text style={{fontSize: screenWidth/5}}>
                            {current}
                        </Text>
                        <Text style={{fontWeight: '600', color: 'silver'}}>Tunggu ya. Nanti nama kamu akan dipanggil!</Text>
                        <TouchableOpacity onPress={() => {
                            cancel()
                            setModal(false)
                        }}>
                            <LinearGradient colors={['#C6DABE', '#88D498']} style={{padding: 15, marginTop: 30}}>
                                <Text style={{fontWeight: '800', textAlign: 'center', color: 'white', fontSize: 18}}>
                                    Selesai
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )
            }
        </>
    )
}

const styles = {
    title: {
        fontFamily: 'Source',
        width: 150,
    },
    input: {
        width: "100%",
        height: 45
    },
    box: {
        width: "100%", 
        flexDirection: 'row', 
        justifyContent: "space-between", 
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5
    }
}

DaftarPasien.navigationOptions = {
   title: "PENDAFTARAN PASIEN",
   headerTitleStyle: {
    fontWeight: '700',
    color: 'rgb(73, 73, 73)',
    fontFamily: "Source"
  },
}

export default DaftarPasien