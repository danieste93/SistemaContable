import React, { Component } from 'react'
class LoginCompo extends Component {
    state = {}
    render() {
let cadena =  "[\"static/imgdb/bezkoder-iPhone-5-5-1595218343874.jpg\",\"static/imgdb/bezkoder-iPhone-5-6-1595218343881.jpg\",\"static/imgdb/bezkoder-iPhone-5-7-1595218343882.jpg\",\"static/imgdb/bezkoder-iPhone-5-8-1595218343882.jpg\"]"
      
let edit = cadena.replace(/['"]+/g, '')
let editcchetes = edit.replace(/[\[\]]/g,'')
let arrayexport = editcchetes.split(",")
console.log(arrayexport)

return(
            <div className="jwMainContainer">

<div className="jwSubContainer">
        <div className="jwCard extend">
dentro de card
        </div>
        </div>
        <style> {`
         
                `}
               
            </style>

        </div>

            )
    }

}

export default LoginCompo