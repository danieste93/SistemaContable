import React from 'react';

const Layout =({children}) =>{
    return(
   
        <div>
        
       
        <main className="mainlayout">{children}</main>
        <style>
        {`
        .mainlayout{
                margin-top:15vh;
                margin-left:20px
        }`
        }
        </style>
        </div>
    )
}

export default Layout;