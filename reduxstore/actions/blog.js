export const ADD_PUBLICACION= 'ADD_PUBLICACION';
export const EDIT_PUBLICACION= 'EDIT_PUBLICACION';
export const DELETE_PUBLICACION= 'DELETE_PUBLICACION';



export const addPublicacion = (pub) => ({
    type: ADD_PUBLICACION,
    payload: { pub}
  });

  export const editPublicacion = (pub) => ({
    type: EDIT_PUBLICACION,
    payload: { pub}
  });
  export const deletePubliHtml = (pub) => ({
    type: DELETE_PUBLICACION,
    payload: { pub}
  });

