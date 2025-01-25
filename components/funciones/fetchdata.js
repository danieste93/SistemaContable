const fetchData = async (usuario, url, datos) => {
    try {
      // Construimos los datos a enviar
      const fetchInternalData = {
        User: {
          DBname: usuario.update.usuario.user.DBname,
          Tipo: usuario.update.usuario.user.Tipo,
        },
        datos,
      };
      
      // Convertimos los datos a JSON
      const datosString = JSON.stringify(fetchInternalData);
  
      // Realizamos el fetch
      const response = await fetch(url, {
        method: 'POST', // o 'PUT'
        body: datosString,
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': usuario.update.usuario.token,
        },
      });
  console.log(responseData)
      // Procesamos la respuesta
      const responseData = await response.json();
      return responseData; // Devolvemos la respuesta procesada
    } catch (error) {
      console.error('Error en fetchData:', error);
      throw error; // Propagamos el error para manejarlo en la llamada
    }
  };
  
  export default fetchData;
  