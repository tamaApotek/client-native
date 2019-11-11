import React, {useState, useEffect} from 'react';
import { View, StatusBar, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, AsyncStorage } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Constants from 'expo-constants';
import {baseUrl} from '../../redux'
import { LinearGradient } from 'expo-linear-gradient';

export default (props) => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errMessage, setErrMessage] = useState("")
  const [loginLoading, setLoading] = useState(false)

  const checkLogin = async () => {
    try { 
      const fullName = await AsyncStorage.getItem('fullName');
      const token = await AsyncStorage.getItem('token');
      if (fullName && token) {
        setLoading(true)
        const { data } = await axios({
          url: `${baseUrl}/dokters/refresh`,
          method: 'post',
          headers: {
            token
          }
        })
        dispatch({ type: "login", fullName, token: data.token, statusPraktek: data.statusPraktek })
        setLoading(false)
        props.navigation.navigate("Praktek")
      } 
    } catch (error) {
      setLoading(false)
      dispatch({type: "logout"})
    }
  }
  useEffect(() => {
    checkLogin()
  }, [])


  let hour = new Date().getHours()

  let greeting = ""
  if(hour>= 5 && hour<=10) greeting = "Selamat Pagi"
  else if(hour <= 15) greeting = "Selamat Siang"
  else if(hour <= 18) greeting = "Selamat Sore"
  else greeting = "Selamat Malam"

  const doLogin = async () => {
      setLoading(true)
      axios({
        method: "post",
        url: `${baseUrl}/dokters/login`,
        data: {
            username,
            password
        }
      })
      .then( async ( {data} ) => {
        try {
          await AsyncStorage.setItem('fullName', data.fullName);
          await AsyncStorage.setItem('token', data.token);
        } catch (error) {
          console.log(error)
        }
          dispatch({ type: "login", fullName: data.fullName, token: data.token , statusPraktek: data.statusPraktek })
          setLoading(false)
          props.navigation.navigate('Praktek')
      })
      .catch(err => {
          setLoading(false)
          if(err.response){
              setErrMessage(err.response.data.message)
          }else if(err.request){
              setErrMessage(`Hmmm.. Sepertinya server sedang offline`)
          }else {
              console.log(err.message)
          }
      })
  }
  return (

      <LinearGradient colors={['#C6DABE', '#88D498']} style={{flex: 1}}>

      <StatusBar barStyle={"dark-content"} />
        <View style={{marginTop: Constants.statusBarHeight, padding: 20, flex: 1, alignItems: 'center', justifyContent: "center"}}>      
          {
            !loginLoading ?
            (
              <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={100}>
                <Text style={{fontFamily: 'Source', fontSize: 30, fontWeight: '700' }}>Halo dokter!</Text>
                <Text style={{fontFamily: 'Source', fontSize: 20, fontWeight: '700' }}>{greeting}</Text>
                <View style={{alignItems: 'center'}}>
                  <Text style={{fontFamily: 'Source', fontSize: 15, fontWeight: '700', marginTop: 40,marginBottom: 10, color: 'red' }}>{errMessage}</Text>
                  <TextInput
                    autoCapitalize={"none"}
                    style={[styles.input,{ marginBottom: 20 }]}
                    placeholder="Username"
                    onChangeText={text => setUsername(text)}
                    value={username}
                    />
                  <TextInput
                    autoCapitalize={"none"}
                    secureTextEntry={true}
                    style={[styles.input]}
                    placeholder="Password"
                    onChangeText={text => setPassword(text)}
                    value={password}
                    />
                  <TouchableOpacity onPress={doLogin}>
                    <View style={{paddingVertical: 10, paddingHorizontal: 15, backgroundColor: 'white', marginTop: 30,
                    borderColor: 'silver', 
                    borderWidth: 2, 
                    borderRadius: 10,  
                  }}>
                      <Text style={{fontSize: 18, fontFamily: 'Source', color: 'rgb(84, 84, 84)', textAlign: 'center' }}>Masuk</Text>
                    </View>
                  </TouchableOpacity>
                  <Text onPress={() => {
                    props.navigation.navigate("Pendaftaran")
                  }} style={{textAlign: 'center', textDecorationLine: 'underline', padding: 20, color: 'rgb(84, 84, 84)', fontFamily: 'Source'}}>Batalkan</Text>
                </View>
              </KeyboardAvoidingView>
            ) : <ActivityIndicator size="large" color="green" />
          }
            
      </View>
      </LinearGradient>
  
  )
}

const styles = {
  input: {
    height: 50, 
    width: 300, 
    backgroundColor: 'white', 
    borderColor: 'silver', 
    // borderWidth: 2, 
    borderRadius: 10, 
    paddingHorizontal: 20, 
    fontSize: 18,
  }
}
