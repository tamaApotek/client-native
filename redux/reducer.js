

const initState = {    
    praktek: false,
    isLogin: false,
    token: null,
    dokterName: "",
    pasienTotal: 0,
    pasienSekarang: 0,
}

const reducer = (state = initState, action ) => {
    switch (action.type) {
        case "setLoading": {
            return{
                ...state,
                loading: action.data
            }
        }
        case "login": {
            return {
                ...state,
                isLogin: true,
                token: action.token,
                dokterName: action.fullName,
                praktek: action.statusPraktek
            }
        }
        case "logout": {
            return {
                ...state,
                token: null,
                dokterName: "",
                isLogin: false,
            }
        }
        case "bukaTutupPraktek":
            if(action.data){
                return {
                    ...state,
                    praktek: action.data,
                }
            }
            else return {
                ...state,
                praktek: action.data,
                pasienTotal: 0,
                pasienSekarang: 0,
            }
            
        case "addPatient": {
            return {
                ...state,
                pasienTotal: action.data
            }
        }
        case "nextPatient": {
            return {
                ...state,
                pasienSekarang: action.data
            }
        }

        default:
            return state
    }
}

export default reducer