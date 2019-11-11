import React, {useEffect,useState} from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from './screens/Login/Login'
import PraktekStatus from './screens/PraktekStatus/PraktekStatus'
import {Provider} from 'react-redux'
import store from './redux/index'
import * as Font from 'expo-font';
import ListPasien from './screens/Buka/ListPasien'
import Pendaftaran from './screens/Pendaftaran/Pendaftaran'

const Praktek = createStackNavigator(
  {
    PraktekStatus,
    ListPasien,
  }
)
const Auth = createAppContainer(
  createSwitchNavigator({
    Pendaftaran,
    Login,
    Praktek,
  })
)


export default (props) => {
  const [font, setFont] = useState(false) 
  useEffect(() => {
    Font.loadAsync({
      'Source': require('./assets/Poppins-Medium.otf'),
    }).then(() => setFont(true)).catch(err => console.log(err))
  }, [])
  return (
    <Provider store={store}>
      
        {
          font ? <Auth /> : null 
        }       
      
    </Provider>
  )
}