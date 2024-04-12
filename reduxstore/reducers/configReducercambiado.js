import {
    LOADING_REPS, LOADING_ORDENES_COMPRA} from '../actions/configredu';
    import { LOG_OUT, UPDATE_ORDER } from "../actions/myact";
    const initialState = {
        
        loading: false,
        ordenesCompra:[]
        
      };

        
  export default function configRedux(state = initialState, action) {
    switch(action.type) {
        case LOADING_REPS:

            return {...state, loading:true};

        case LOG_OUT:

        return{...state, loading:false,ordenesCompra:[]};
        case LOADING_ORDENES_COMPRA:
console.log(action)
let ordenesCompra = action.payload.ordenesc
        return{...state, ordenesCompra};

        case UPDATE_ORDER:
            console.log(action.payload)
        
            return { ...state,
           
              ordenesCompra: action.payload.orders.ordenes
            }

            default:
                // ALWAYS have a default case in a reducer
                return state;

    }

}