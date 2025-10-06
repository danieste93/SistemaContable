

  export function fetchRep() {
    return dispatch => {
      dispatch(fetchRepBegin());
      return fetch("https://iglass.herokuapp.com/admin/orderdata/solicitud-repuestos")
        .then(handleErrors)
        .then(res => res.json())
        .then(json => {
      
             dispatch(fetchRepSuccess(json.compras));
          
          return json.compras;
        })
        .catch(error => dispatch(fetchRepFailure(error)) );
    };
  }
  // Handle HTTP errors since fetch won't.
  function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }
  export const FETCH_ORDER_BEGIN   = 'FETCH_ORDER_BEGIN';
  export const FETCH_ORDER_SUCCESS = 'FETCH_ORDER_SUCCESS';
  export const FETCH_ORDER_FAILURE = 'FETCH_ORDER_FAILURE';

  export const FETCH_REP_BEGIN   = 'FETCH_REP_BEGIN';
  export const FETCH_REP_SUCCESS = 'FETCH_REP_SUCCESS';
  export const FETCH_REP_FAILURE = 'FETCH_REP_FAILURE';

  export const FETCH_PRODUCTS_BEGIN   = 'FETCH_PRODUCTS_BEGIN';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';


export const UPLOAD_FILTER_SEARCHER = 'FUPLOAD_FILTER_SEARCHER';
export const REMOVE_FILTER_SEARCHER = 'REMOVE_FILTER_SEARCHER';
export const UPDATE_ORDER = 'UPDATE_ORDER';

export const UPLOAD_USER = 'UPLOAD_USER';
export const UPLOAD_USER2 = 'UPLOAD_USER2';

export const DELETE_USER = 'DELETE_USER';
export const LOG_OUT = 'LOG_OUT';

export const UPDATE_REP = 'UPDATE_REP';


export const RESET_CARD = 'RESET_CARD';

export const updateUser = (update) => ({
  type: UPLOAD_USER,
  payload: { update}
});

export const updateUser2 = (update) => ({
  type: UPLOAD_USER2,
  payload: { update}
});

export const deleteUser = () => ({
  type: DELETE_USER,
  payload: { }
});

export const logOut = () => ({
  type: LOG_OUT,
  payload: { }
});


export const fetchProductsBegin = () => ({
  type: FETCH_PRODUCTS_BEGIN
});

export const fetchProductsSuccess = products => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: { products }
});

export const fetchProductsFailure = error => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: { error }
});


export const fetchOrderBegin = () => ({
  type: FETCH_ORDER_BEGIN
});

export const fetchOrderSuccess = orders => ({
  type: FETCH_ORDER_SUCCESS,
  payload: { orders }
});

export const fetchOrderFailure = error => ({
  type: FETCH_ORDER_FAILURE,
  payload: { error }
});


export const fetchRepBegin = () => ({
  type: FETCH_REP_BEGIN
});

export const fetchRepSuccess = solicitudes => ({
  type: FETCH_REP_SUCCESS,
  payload: { solicitudes }
});

export const fetchRepFailure = error => ({
  type: FETCH_REP_FAILURE,
  payload: { error }
});

export const uploadeFilterSeacher = (filter) => ({
  type: UPLOAD_FILTER_SEARCHER,
  payload: filter
});
export const removeFilterSearcher = () => ({
  type: REMOVE_FILTER_SEARCHER,
 });

 export const resetCard = () => ({
  type: RESET_CARD,
 });

 export const updateOrder = (orders) => ({
 
  type: UPDATE_ORDER,
  payload:{orders}
});

export const updateRep = (solicitudes) => ({
 
  type: UPDATE_REP,
  payload:{solicitudes}
});
