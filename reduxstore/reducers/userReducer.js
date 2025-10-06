import {UPLOAD_USER,UPLOAD_USER2, DELETE_USER, LOG_OUT } from "../actions/myact";

 const  userReducer = (state = '', action) => {
    switch (action.type) {
        case UPLOAD_USER:
        
          console.log(action.payload)

            return state = action.payload;
            case UPLOAD_USER2:
              console.log(action.payload)
              let modifiedstate = {...state}
             
              modifiedstate.update.usuario.user = action.payload.update.usuario
       
                return state = modifiedstate
            case DELETE_USER:
  
            return state ="";

            case LOG_OUT:
              return state ="";

        case 'UPDATE_GMAIL_TOKEN':
          // Guarda el token en el usuario actual
          if (state && state.update && state.update.usuario && state.update.usuario.user) {
            let newState = { ...state };
            newState.update = { ...state.update };
            newState.update.usuario = { ...state.update.usuario };
            newState.update.usuario.user = { ...state.update.usuario.user, gmailToken: action.payload };
            return newState;
          }
          return state;
        default:
            return state ;
    }
};

export default userReducer