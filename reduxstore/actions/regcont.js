

  export const FETCH_CUENTAS_SUCCESS   = 'FETCH_CUENTAS_SUCCESS';

  export const FETCH_CATS_SUCCESS   = 'FETCH_CATS_SUCCESS';

  export const FETCH_TIPOS_SUCCESS   = 'FETCH_TIPOS_SUCCESS';
 
  export const FETCH_CUENTAS_BEGIN    = 'FETCH_CUENTAS_BEGIN';
  export const ADD_TIPE   = 'ADD_TIPE';
  export const ADD_CLIENT   = 'ADD_CLIENT';

  export const UPDATE_REG   = 'UPDATE_REG';
  export const UPDATE_REGS   = 'UPDATE_REGS';

  export const CLEAN_DATA   = 'CLEAN_DATA';
  export const GET_CLIENTS   = 'GET_CLIENTS';

  export const ADD_DISTRI  = 'ADD_DISTRI';
  export const UPDATE_DISTRI   = 'UPDATE_DISTRI';


  export const UPDATE_CONT   = 'UPDATE_CONT';
  export const UPDATE_COUNT   = 'UPDATE_COUNT';
  export const UPDATE_CAT   = 'UPDATE_CAT';
  export const DELETE_CUENTA  = 'DELETE_CUENTA';
  export const GET_REPETICIONES  = 'GET_REPETICIONES';
  export const UPDATE_REP  = 'UPDATE_REP';
  export const UPDATE_CLIENT  = 'UPDATE_CLIENT';

export const FETCH_REGS_SUCCESS   = 'FETCH_REGS_SUCCESS';
export const FETCH_REGS_BEGIN   = 'FETCH_REGS_BEGIN';
export const FETCH_REGS_FAILURE = 'FETCH_REGS_FAILURE';
export const ADD_FIRST_REGS = "ADD_FIRST_REGS"
export const    ADD_FIRST_REGS_DELETE = "  ADD_FIRST_REGS_DELETE"

export const UPDATE_REP_ADDREPS = 'UPDATE_REP_ADDREPS';

export const ADD_REGS = 'ADD_REGS';
export const ADD_REGS_DELETE = 'ADD_REGS_DELETE';
export const ADD_VENTAS = 'ADD_VENTAS';
export const ADD_COMPRAS = 'ADD_COMPRAS';
export const ADD_CAT = 'ADD_CAT';
export const ADD_VENTA = 'ADD_VENTA';
export const ADD_ART = 'ADD_ART';
export const ADD_COMPRA = 'ADD_COMPRA';
export const ADD_CUENTA = 'ADD_CUENTA';

export const CAT_DELETE = 'CAT_DELETE';
export const DELETE_REG = 'DELETE_REG';
export const DELETE_REP = 'DELETE_REP';
export const GET_COUNTER = 'GET_COUNTER';
export const UPDATE_COUNTER = 'UPDATE_COUNTER';
export const UPDATE_COUNTS = 'UPDATE_COUNTS';
export const GET_ARTS = 'GET_ARTS';
export const GET_COMPRAS = 'GET_COMPRAS';
export const DELETE_COMPRA = 'DELETE_COMPRA';
export const DELETE_VENTA = 'DELETE_VENTA';
export const GET_VENTAS = 'GET_VENTAS';

export const FETCH_ALL_CUENTAS_SUCCESS = 'FETCH_ALL_CUENTAS_SUCCESS';
export const DELETE_ART = 'DELETE_ART';
export const GET_DISTRI = 'GET_DISTRI';
export const UPDATE_VENTA = 'UPDATE_VENTA';
export const UPDATE_ART = 'UPDATE_ART';
export const UPDATE_ARTS= 'UPDATE_ARTS';
export const updateClient= client => ({
  type: UPDATE_CLIENT ,
  payload: {client}
});

export const addVenta= venta => ({
  type: ADD_VENTA ,
  payload: {venta}
});
export const addCompra= compra => ({
  type: ADD_COMPRA,
  payload: {compra}
});

export const addArt= art => ({
  type: ADD_ART,
  payload: {art}
});

export const addClient= client => ({
  type: ADD_CLIENT ,
  payload: {client}
});
export const addDistri = distri => ({
  type: ADD_DISTRI,
  payload: {distri}
});

export const updateDistri = distri => ({
  type: UPDATE_DISTRI,
  payload: {distri}
});

export const getDistribuidor = distri => ({
  type: GET_DISTRI,
  payload: {distri}
});
export const getClients = client => ({
  type: GET_CLIENTS,
  payload: {client}
});


export const deleteVenta = venta => ({
  type: DELETE_VENTA,
  payload: {venta}
});

export const deleteCompra = compra => ({
  type: DELETE_COMPRA,
  payload: {compra}
});
export const deleteArt= art => ({
  type: DELETE_ART,
  payload: {art}
});
export const getCompras = compras => ({
  type: GET_COMPRAS,
  payload: {compras}
});
export const getVentas = ventas => ({
  type: GET_VENTAS,
  payload: {ventas}
});

export const getArts = arts => ({
  type: GET_ARTS,
  payload: {arts}
});

export const cleanData = data => ({
  type: CLEAN_DATA,
  payload: "Data"
});


export const updateRepsAddreps = reps => ({
  type: UPDATE_REP_ADDREPS,
  payload: { reps }
});
export const updateCounter = counters => ({
  type: UPDATE_COUNTER,
  payload: { counters }
});
export const getCounter = counters => ({
  type: GET_COUNTER,
  payload: { counters }
});

export const addRegs = registros => ({
  type: ADD_REGS,
  payload: { registros }
});
export const addCompras = compras => ({
  type: ADD_COMPRAS,
  payload: { compras }
});
export const addVentas = ventas => ({
  type: ADD_VENTAS,
  payload: { ventas }
});

export const addFirstRegsDelete = regs => ({
  type: ADD_FIRST_REGS_DELETE,
  payload: { regs }
});
export const addRegsDelete = registros => ({
  type: ADD_REGS_DELETE,
  payload: { registros }
});
export const getcuentas = cuentas => ({
  type: FETCH_CUENTAS_SUCCESS,
  payload: { cuentas }
});

export const getAllcuentas = cuentas => ({
  type: FETCH_ALL_CUENTAS_SUCCESS,
  payload: { cuentas }
});


export const deleteCat = cat => ({
  type: CAT_DELETE,
  payload: { cat }
});

export const gettipos = tipos => ({
  type: FETCH_TIPOS_SUCCESS,
  payload: { tipos }
});
export const addCuenta = cuenta => ({
  type: ADD_CUENTA,
  payload: { cuenta }
});
export const deleteCuenta = cuenta => ({
  type: DELETE_CUENTA,
  payload: { cuenta }
});

export const getRepeticiones = reps => ({
  type: GET_REPETICIONES,
  payload: { reps }
});
export const updateRepEdit = reps => ({
  type: UPDATE_REP,
  payload: { reps }
});
export const updateCont = cont => ({
  type: UPDATE_CONT,
  payload: { cont }
});
export const updateArt = art => ({
  type: UPDATE_ART,
  payload:{art}
});

export const deleteRep = reps => ({
  type: DELETE_REP,
  payload: { reps }
});

export const getcats = categorias => ({
  type: FETCH_CATS_SUCCESS,
  payload: { categorias }
});
export const updateCuenta = cuenta => ({
  type: UPDATE_COUNT,
  payload: { cuenta }
});
export const updateCuentas = cuentas => ({
  type: UPDATE_COUNTS,
  payload:  cuentas
});
export const updateArts = arts => ({
  type: UPDATE_ARTS,
  payload:  arts
});
export const updateCat = cat => ({
  type: UPDATE_CAT,
  payload: { cat }
});
export const updateReg = reg => ({
  type: UPDATE_REG,
  payload: { reg }
});
export const updateRegs = regs => ({
  type: UPDATE_REGS,
  payload: regs
});
export const addcat = categoria => ({
  type: ADD_CAT,
  payload: { categoria }
});
export const addTipo = tipos => ({
  type: ADD_TIPE,
  payload: { tipos }
});

export const fetchRegsBegin = solicitudes => ({
  type: FETCH_REGS_BEGIN,

  payload: { solicitudes }
});


export const fetchCuentasBegin = solicitudes => ({
  type: FETCH_CUENTAS_BEGIN,

  payload: { solicitudes }
});



export const fetchRegsSuccess = regs => ({
  type: FETCH_REGS_SUCCESS ,
  payload: { regs }
});
export const addFirstRegs = regs => ({
  type: ADD_FIRST_REGS ,
  payload: { regs }
});


export const fetchRegsfail = error => ({
  type: FETCH_REGS_FAILURE,
  payload: { error }
});
export const deleteReg = reg => ({
  type: DELETE_REG,
  payload: { reg }
});
export const updateVenta = (ventas) => ({
 
  type: UPDATE_VENTA,
  payload:{ventas}
})