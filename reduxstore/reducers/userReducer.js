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

        default:
            return state ;
    }
};

export default userReducer