import React, { useState } from 'react';
import LoginGoogle from '../loginGoogle';

const LoginGoogleLanding = () => {
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',margin:'32px 0'}}>
      <LoginGoogle
        onResult={setResult}
        onClick={() => setError(null)}
        getError={setError}
      />
      {error && <div style={{color:'red',marginTop:8,fontSize:14}}>Error: {error.message || error.toString()}</div>}
      {result && result.status === 'Ok' && (
        <div style={{color:'green',marginTop:8,fontSize:14}}>¡Bienvenido, {result.data.user.Usuario || 'usuario'}!</div>
      )}
    </div>
  );
};

export default LoginGoogleLanding;
