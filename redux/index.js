import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer'
import io from 'socket.io-client';

export const baseUrl = "http://192.168.0.195:3000"
export const socket = io(baseUrl)
const store = createStore(
    reducer,
    applyMiddleware(thunk)
    
)

export default store

