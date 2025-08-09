     
import {
  DELETE_CLIENT,
  ADD_FIRST_REGS,
  ADD_FIRST_REGS_DELETE,
  GET_REPETICIONES, 
  FETCH_REGS_BEGIN,
    FETCH_REGS_SUCCESS ,
    FETCH_REGS_FAILURE,
    UPDATE_CLIENT,
    ADD_REGS,
    ADD_REGS_DELETE,
    ADD_COMPRAS,
    ADD_VENTAS,
    ADD_CAT,
    ADD_CLIENT,
    ADD_TIPE,
    ADD_CUENTA,
    ADD_VENTA ,
    ADD_ART ,
    ADD_COMPRA ,
    DELETE_CUENTA ,
    FETCH_CUENTAS_SUCCESS,
    GET_DISTRI,
    UPDATE_DISTRI,
    ADD_DISTRI,
    FETCH_ALL_CUENTAS_SUCCESS,
    FETCH_CUENTAS_BEGIN,
    FETCH_TIPOS_SUCCESS,
    FETCH_CATS_SUCCESS,
    UPDATE_COUNT,
    UPDATE_COUNTS,
    UPDATE_REG,
    UPDATE_REGS,
    UPDATE_CAT,
    DELETE_REG,
    DELETE_REP,
    UPDATE_REP,
    UPDATE_ART,
    UPDATE_ARTS,
    UPDATE_VENTA,
    UPDATE_CONT,
    CAT_DELETE,
    GET_COUNTER,
    UPDATE_COUNTER,
    CLEAN_DATA,
    UPDATE_REP_ADDREPS,
    GET_ARTS,
    GET_COMPRAS,
    GET_VENTAS,
    DELETE_COMPRA,
    DELETE_ART,
    DELETE_VENTA,

    GET_CLIENTS ,

  } from '../actions/regcont';

  import {ADD_PUBLICACION, EDIT_PUBLICACION,    DELETE_PUBLICACION,} from "../actions/blog"
  import  { LOG_OUT} from "../actions/myact"
  
  const initialState = {
    Regs: [],
    loading: false,
    error: null
  };
  
  export default function productReducer(state = initialState, action) {
    switch(action.type) {

   
      case LOG_OUT:
        return state ="";
      case  CLEAN_DATA:

        return state ="";
      case  FETCH_REGS_BEGIN:
        // Mark the state as "loading" so we can show a spinner or something
        // Also, reset any errors. We're starting fresh.
        return {
          ...state,
          loading: true,
          error: null
        };
        case   GET_REPETICIONES :
          return {
            ...state,
           
            Reps: action.payload.reps
          };
          case   GET_CLIENTS :
            let Clients = action.payload.client
            return {
              ...state,
              Clients
    
            };
      case  ADD_FIRST_REGS:
         
        // All done: set loading "false".
        // Also, replace the items with the ones from the server
        return {
          ...state,
      
          Regs: action.payload.regs
        };

        case    ADD_FIRST_REGS_DELETE:
          let RegsDelete = action.payload.regs

        // All done: set loading "false".
        // Also, replace the items with the ones from the server
        return {
          ...state,
         RegsDelete
        };
        
        case DELETE_CUENTA:
         
      Cuentas = state.Cuentas.filter(x => x._id !==  action.payload.cuenta._id )
          return {
            ...state, Cuentas
            
          };
          case     DELETE_PUBLICACION:
         
       let   pubWithout = state.Publicaciones.filter(x => x._id !==  action.payload.pub._id )
              return {
                ...state, Publicaciones:pubWithout
                
              };
          case CAT_DELETE:
       
            Categorias = state.Categorias.filter(x => x._id !==  action.payload.cat.cat._id )
                return {
                  ...state, Categorias
                  
                };
                case  GET_COUNTER:

        
                  let Contador = action.payload.counters

              
                  return {
                    ...state, Contador
                    
                  };
                  case  GET_ARTS:

                
                    let Articulos = action.payload.arts
  
                
                    return {
                      ...state, Articulos
                      
                    };
                    case  DELETE_ART:

                  
   
                    Articulos = state.Articulos.filter(x => x._id !==  action.payload.art._id )
                
                    return {
                      ...state, Articulos                      
                    };
                    
                    case  GET_COMPRAS:

          
                      let Compras = action.payload.compras
    
                  
                      return {
                        ...state, Compras
                        
                      };
                      
                      case DELETE_COMPRA:
         
                        Compras = state.Compras.filter(x => x._id !==  action.payload.compra._id )
                            return {
                              ...state, Compras
                              
                            };
                      case  GET_VENTAS:

                            let actualVent = state.Ventas?state.Ventas:[]

                      let allventas =actualVent.concat(action.payload.ventas)
                         
                      let sinRepetidosObjeto= allventas.filter((value, index, self) => {
                        return(            
                          index === self.findIndex((t) => (
                            t._id=== value._id&& t._id === value._id
                          ))
                      )
                      
                      });
                        let Ventas = sinRepetidosObjeto
      
                    
                        return {
                          ...state, Ventas
                          
                        };

                        case  DELETE_VENTA:
                        
                          Ventas = state.Ventas.filter(x => x._id !==  action.payload.venta._id )

                      
                          return {
                            ...state, Ventas
                            
                          };

                  case UPDATE_COUNTER:
                    Contador = action.payload.counters
                    return {
                      ...state, Contador
                      
                    }

            
          case UPDATE_COUNT:
           
           //let CuentaRemove = state.Cuentas.filter(x => x._id !==  action.payload.cuenta._id )
           let CuentaUpdate = state.Cuentas.findIndex(x => x._id == action.payload.cuenta._id)
           Cuentas = state.Cuentas
           Cuentas[CuentaUpdate] = action.payload.cuenta
       
           //  Cuentas = CuentaRemove.concat(action.payload.cuenta)
                return {
                  ...state, Cuentas
                  
                };
                case UPDATE_COUNTS:
              let actualCuentas = state.Cuentas

              for(let i = 0; i < action.payload.length; i++ ){
                let cuentaIndex = actualCuentas.findIndex(x => x._id == action.payload[i]._id)
             
                actualCuentas[cuentaIndex] = action.payload[i]
              }
        
                     return {
                       ...state, Cuentas:actualCuentas
                       
                     };
                     case UPDATE_ARTS:
                      let actualArts = state.Articulos
                    
                      for(let i = 0; i < action.payload.length; i++ ){
                        let artIndex = actualArts.findIndex(x => x._id == action.payload[i]._id)
                        actualArts[artIndex] = action.payload[i]
                      }

                      return  {
                        ...state, Articulos:actualArts
                        
                      };
                case UPDATE_ART:
           
                //let CuentaRemove = state.Cuentas.filter(x => x._id !==  action.payload.cuenta._id )
                let indexart = state.Articulos.findIndex(x => x._id == action.payload.art._id)
                let misArts = state.Articulos
                misArts[indexart] = action.payload.art
            
                //  Cuentas = CuentaRemove.concat(action.payload.cuenta)
                     return {
                       ...state, Articulos:misArts
                       
                     };
                case UPDATE_CLIENT:
           
                //let CuentaRemove = state.Cuentas.filter(x => x._id !==  action.payload.cuenta._id )
                let ClientUpdate = state.Clients.findIndex(x => x._id == action.payload.client._id)
                Clients = state.Clients
                Clients[ClientUpdate] = action.payload.client
                            
                     return {
                       ...state, Clients
                       
                     };

                case UPDATE_CAT:
                  let CatUpdate = state.Categorias.findIndex(x => x._id == action.payload.cat.cat._id)
                               
                  Categorias = state.Categorias
                  Categorias[CatUpdate] = action.payload.cat.cat
                  return {
                    ...state, Categorias
                    
                  };

                  case  UPDATE_CONT:

                    return {
                      ...state, Categorias
                      
                    };
                case    DELETE_REG:
         
             
               let RegRemove = state.Regs.filter(x => x._id != action.payload.reg._id)
               Regs = RegRemove
                             
                       return {
                         ...state,  Regs
                         
                       };
                case UPDATE_REG:
              
              //    let RegsRemove = state.Regs.filter(x => x._id != action.payload.reg._id)
              
                  let regupdate = state.Regs.findIndex(x => x._id == action.payload.reg._id)
             
           
               //   Regs = RegsRemove.concat(action.payload.reg)

               Regs = state.Regs
               Regs[regupdate] = action.payload.reg

                       return {
                         ...state, Regs
                                                };
                                                case UPDATE_REGS:
                                             
                                                let newRegs = state.Regs
                                              
                                                action.payload.forEach(element => {

                                                  let regupdate = state.Regs.findIndex(x => x._id == element._id)
                                                  if(regupdate == -1){
                                                    newRegs.push(element)
                                                  }else{
                                                    newRegs[regupdate] = element
                                                  }
                                                  
                                                });
                                                return {
                                                  ...state, Regs:newRegs
                                                                         };
                                                case  UPDATE_REP_ADDREPS:
                                              
                                            let repupdate = state.Reps.findIndex(x => x._id == action.payload.reps._id)                          
                                         
                                            let Reps = state.Reps
                                            Reps[repupdate] = action.payload.reps
                                      
                                            return {
                                              ...state, Reps
                                                                     };
                     case  UPDATE_VENTA:
                    
                      let ventaupdatex = state.Ventas.findIndex(x => x._id == action.payload.ventas._id)                          
                      Ventas = state.Ventas
                      Ventas[ventaupdatex] = action.payload.ventas
                        
                  return {
                    ...state, Ventas
                                           };                                                   
                case  UPDATE_REP:
                                          
                  let repupdatex = state.Reps.findIndex(x => x._id == action.payload.reps.repe._id)                          
                  Reps = state.Reps
                  Reps[repupdatex] = action.payload.reps.repe
                 
                  return {
                    ...state, Reps
                                           };
                                           case  EDIT_PUBLICACION:
                                         
                                           let idUpdate = state.Publicaciones.findIndex(x => x._id == action.payload.pub._id)                          
                                        let   Publicacionesupdate = state.Publicaciones
                                        Publicacionesupdate[idUpdate] = action.payload.pub
                                          
                                           return {
                                             ...state, Publicaciones:Publicacionesupdate
                                                                    };

                  case DELETE_REP:
                                         
                    let RepRemove = state.Reps.filter(x => x._id != action.payload.reps.repdata._id)
                    Reps = RepRemove                        
                                            
                    return {
                      ...state, Reps   };
                         case DELETE_CLIENT:
        let ClientsFiltered = state.Clients.filter(x => x._id !== action.payload.cliente._id)
        return {
          ...state,
          Clients: ClientsFiltered
        };

      case FETCH_REGS_FAILURE:
        // The request failed. It's done. So set loading to "false".
        // Save the error, so we can display it somewhere.
        // Since it failed, we don't have items to display anymore, so set `items` empty.
        //
        // This is all up to you and your app though:
        // maybe you want to keep the items around!
        // Do whatever seems right for your use case.
        return {
          ...state,
          loading: false,
          error: action.payload.error,
          Regs: []
        };
  
        case   ADD_VENTA:
  
      let secureVentas = state.Ventas?state.Ventas : []
         secureVentas.unshift(action.payload.venta)
         Ventas = secureVentas
                 return {
            ...state, Ventas
              
          };
        case   ADD_REGS:
  
let misregs = state.Regs?state.Regs:[]

        let Regs = misregs.concat(action.payload.registros)
       
  
          return {
            ...state, Regs
              
          };
          case   ADD_COMPRAS:
  
let misCompras = state.Compras?state.Compras:[]

        let ComprasGen = misCompras.concat(action.payload.compras)
       
  
          return {
            ...state, Compras:ComprasGen
              
          };
          case   ADD_VENTAS:
  
let misVentas = state.Ventas?state.Ventas:[]

        let VentasGen = misVentas.concat(action.payload.ventas)
       
  
          return {
            ...state, Ventas:VentasGen
              
          };
          case   ADD_PUBLICACION:
  
          let mispubs = state.Publicaciones?state.Publicaciones:[]
          
                  let Publicaciones = mispubs.concat(action.payload.pub)
                 
            
                    return {
                      ...state, Publicaciones
                        
                    };
          case   ADD_REGS_DELETE:
  
          let misregsDelete = state.RegsDelete?state.RegsDelete:[]
          
                   RegsDelete = misregsDelete.concat(action.payload.registros)
                 
                 
                    return {
                      ...state, RegsDelete
                        
                    };
          case   ADD_COMPRA:
  
          let secureCompras= state.Compras?state.Compras : []
            secureCompras.unshift(action.payload.compra)
          Compras = secureCompras
                     return {
                ...state, Compras
                  
              };
              case   ADD_ART:
    
              let secureArt = state.Articulos?state.Articulos : []  
              secureArt.unshift(action.payload.art)
             Articulos = secureArt

                         return {
                    ...state, Articulos
                      
                  };
        
            case   ADD_CUENTA:


let newcuentas = state.Cuentas
newcuentas.unshift(action.payload.cuenta)
     
          
              // All done: set loading "false".
              // Also, replace the items with the ones from the server
              return {
                ...state, Cuentas:newcuentas
                  
              };
              case   ADD_CLIENT:  

              Clients = state.Clients.concat(action.payload.client)
            
           
               return {
                 ...state, Clients
                   
               };
          case   ADD_TIPE:
  

            Tipos = action.payload.tipos
           
              // All done: set loading "false".
              // Also, replace the items with the ones from the server
              return {
                ...state, Tipos
                  
              };
          case   ADD_CAT:
  

            Categorias = state.Categorias.concat(action.payload.categoria.categoria)
           
              // All done: set loading "false".
              // Also, replace the items with the ones from the server
              return {
                ...state, Categorias
                  
              };


          case FETCH_CUENTAS_SUCCESS:
        let Cuentas =  action.payload.cuentas
          return{
            ...state, Cuentas
          }
          case GET_DISTRI:
            let Distribuidores =  action.payload.distri
              return{
                ...state, Distribuidores
              }
              case   ADD_DISTRI:
  
           
               Distribuidores = state.Distribuidores.concat(action.payload.distri)
             
                // All done: set loading "false".
                // Also, replace the items with the ones from the server
                return {
                  ...state, Distribuidores
                    
                };
            
          case FETCH_ALL_CUENTAS_SUCCESS:
            let AllCuentas =  action.payload.cuentas
              return{
                ...state, AllCuentas
              }
          case FETCH_CATS_SUCCESS:
            let Categorias =  action.payload.categorias
              return{
                ...state, Categorias
              }
          case FETCH_TIPOS_SUCCESS:
       
            let Tipos =  action.payload.tipos[0].Tipos
              return{
                ...state, Tipos
              }
          case  FETCH_CUENTAS_BEGIN:
            // Mark the state as "loading" so we can show a spinner or something
            // Also, reset any errors. We're starting fresh.
            return {
              ...state,
              loading: true,
              error: null
            };
      default:
        // ALWAYS have a default case in a reducer
        return state;
    }
  }