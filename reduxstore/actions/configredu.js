export const LOADING_REPS= 'LOADING_REPS';
export const LOADING_ORDENES_COMPRA= 'LOADING_ORDENESCOMPRA';


export const loadingOrdenesCompra = (ordenesc) => ({
    type: LOADING_ORDENES_COMPRA,
    payload: { ordenesc}
  });
export const loadingReps = (update) => ({
    type: LOADING_REPS,
    payload: { update}
  });