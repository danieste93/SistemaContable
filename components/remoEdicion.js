import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { EditorState, ContentState  } from 'draft-js';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import dynamic from 'next/dynamic'
import htmlToDraft from 'html-to-draftjs';
import { Animate } from "react-animate-mount";

/**
* @author
* @class remoedit
**/
export const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
)
class remoedit extends Component {
 state = {
  editorState: EditorState.createEmpty(),
  mostrarimagenes:true,
  file:[],

 }
 componentDidMount(){

this.setState(this.props.data)
  const html = this.props.data.Descripcion;
  const contentBlock = htmlToDraft(html);

  if (contentBlock) {
 
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
 
      this.setState({editorState})
    } 
}
onEditorStateChange = (editorState) => {
  this.setState({
    editorState,
  });
};
uploadCallback=(file)=> {
    // long story short, every time we upload an image, we
  // need to save it to the state so we can get it's data
  // later when we decide what to do with it.
  
 // Make sure you have a uploadImages: [] as your default state
 const formData = new FormData();
 formData.append("files", file);
 
 // We need to return a promise with the image src
 // the img src we will use here will be what's needed
 // to preview it in the browser. This will be different than what
 // we will see in the index.md file we generate.
 return new Promise(
   (resolve, reject) => {

    const options = {
      method: 'POST',
      body: formData,
   
      };
      fetch('/admin/uploadeditor', options).then(response => response.json())
  .then(success => {
   console.log(success)
   let rutaedit = `/${success.ruta}`
   resolve({ data: { link: rutaedit } });
  })
  .catch(error => {
  
    console.log(error)}
  );



  
   }
 );

}


  botonsubmit=()=>{
  
    const {Grupo,editorState, Calidad, Color, Repuesto, Modelo, Marca, Precio,  Tiempo, Garantia} = this.state;
    
    
    const formData = new FormData();
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    var ins = document.getElementById('rimagen').files.length;
    let html = draftToHtml(rawContentState,{},false,({ type, data }) => {
      //entity.data.alignment is for float using the LCR options on the image 'none' means the user clicked center
      if (type === 'IMAGE') {
          const alignment = data.alignment || 'none';
          const textAlign = alignment === 'none' ? 'center' : alignment;
  
          return `
              <p style="text-align:${textAlign};">
                  <img src="${data.src}" alt="${data.alt}" style="height: ${data.height};width: ${data.width}"/>
              </p>
          `;
      }
  });
    if(ins > 0){
      console.log(ins)
    for (var x = 0; x < ins; x++) {
      formData.append("files", document.getElementById('rimagen').files[x]);
    }

  

    formData.append("identifier", this.state._id );
    formData.append("Grupo", Grupo );
    formData.append("Marca", Marca );
    formData.append("Modelo", Modelo);
    formData.append("Repuesto", Repuesto);
    formData.append("Calidad", Calidad);
    formData.append("Color", Color);
    formData.append("Precio", Precio);
    formData.append("Descripcion", html);
    formData.append("Garantia", Garantia);
    formData.append("Tiempo", Tiempo);
    
    const options = {
    method: 'POST',
    body: formData,
    // If you add this, upload won't work
    // headers: {
    //   'Content-Type': 'multipart/form-data',
    // }
    };

    fetch('/admin/uploadtest-update', options).then(response => response.json())
    .then(success => {
     console.log(success)
    
     this.props.customFun()
    })
    .catch(error => {
      alert("Error al subir ");
      console.log(error)}
    );
    
    let imagenesnombre = JSON.stringify(this.props.data.Imagen)
console.log(imagenesnombre)
    const optionsdel = {
      method: 'POST',
      body: imagenesnombre,
      headers:{
        'Content-Type': 'application/json'
      }
      };
    fetch(`/admin/upload/delete-old-images`, optionsdel).then(response => response.json())


  } else{
    console.log("en subidor sin imagenes")
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    var ins = document.getElementById('rimagen').files.length;
    let html = draftToHtml(rawContentState,{},false,({ type, data }) => {
      //entity.data.alignment is for float using the LCR options on the image 'none' means the user clicked center
      if (type === 'IMAGE') {
          const alignment = data.alignment || 'none';
          const textAlign = alignment === 'none' ? 'center' : alignment;
  
          return `
              <p style="text-align:${textAlign};">
                  <img src="${data.src}" alt="${data.alt}" style="height: ${data.height};width: ${data.width}"/>
              </p>
          `;
      }
  });
    const datosupload = this.state
    datosupload.Descripcion = html
    const options = {
      method: 'PUT',
      body: JSON.stringify(datosupload),
      headers:{
        'Content-Type': 'application/json'
      }
      };
    fetch(`/admin/upload/${this.state._id}`, options).then(response => response.json())
    .then(success => {
     console.log(success)

     this.props.customFun()
    })
    .catch(error => {
      alert("Error al subir ");
      console.log(error)}
    );

  }


    }



  handleInput=(e)=>{

   this.setState({[e.target.name]:e.target.value})

}


  handleChangeFiles=(event)=> {
  
    let arr= [];
    
    for (var i = 0; i < event.target.files.length; i++) {
      let img = URL.createObjectURL(event.target.files[i])
      arr.push( img)
     }
   
      this.setState({file:arr, nuevasImg: true, mostrarimagenes:false })
    }
    imgFileRender=()=>{

      let img = this.state.file.map((imagen,i)=>{
      
      
        return(<img key={i} src={imagen} className="imgFile"/>)
      
      })
      
      return(<div className="imgContenedor">
      {img}
      </div>)
      }

 render() {
 

   const itemPoreditar = this.props.data
 
   const imgpreview = itemPoreditar.Imagen.map((imagen, i)=>{
    return(
      <img key={i} src={imagen} style={{width:"40%", maxWidth:"125px", margin:"10px"}}/>
         
      )
  })
  
  const { editorState } = this.state;
  return(
    <div className="remoeditionCont" >
      <div className="maincontDetalles">
      <p className="tituloArt">Edita el repuesto</p>
<Animate show={this.state.mostrarimagenes}>
<div className="contimgPreview">
{imgpreview}
</div>
</Animate>
<Animate show={this.state.nuevasImg}>
<div className="contimgPreview">
{this.imgFileRender()}
</div>
</Animate>

<div className="contInput">
<input type="file" onChange={this.handleChangeFiles}
                            id="rimagen" name="rimagen"
                            accept="image/png, image/jpeg" multiple ></input>
           </div>
           <hr style={{width:"100%"}}/>
            <div className="contdetalle">
            <div className="tituloD"> <p className="parrafoD">Grupo:  </p> </div>
            <div className="valorD"> <input name="Grupo"  onChange={this.handleInput}  type="text" defaultValue={itemPoreditar.Grupo} /> </div>
            </div>

            <div className="contdetalle">
            <div className="tituloD"> <p className="parrafoD">Marca:  </p> </div>
            <div className="valorD"> <input name="Marca"  onChange={this.handleInput} type="text" defaultValue={itemPoreditar.Marca} /> </div>
            </div>
            <div className="contdetalle">
            <div className="tituloD"> <p className="parrafoD">Repuesto:  </p> </div>
            <div className="valorD"> <input name="Repuesto"  onChange={this.handleInput} type="text" defaultValue={itemPoreditar.Repuesto} /> </div>
            </div>
            <div className="contdetalle">
            <div className="tituloD"> <p className="parrafoD">Modelo:  </p> </div>
            <div className="valorD"> <input name="Modelo" onChange={this.handleInput} type="text" defaultValue={itemPoreditar.Modelo} /> </div>
            </div>
            <div className="contdetalle">
            <div className="tituloD"> <p className="parrafoD">Calidad:  </p> </div>
            <div className="valorD"> <input name="Calidad" onChange={this.handleInput} type="text" defaultValue={itemPoreditar.Calidad} /> </div>
            </div>
            <div className="contdetalle">
            <div className="tituloD"> <p className="parrafoD">Color:  </p> </div>
            <div className="valorD"> <input name="Color" onChange={this.handleInput}  type="text" defaultValue={itemPoreditar.Color} /> </div>
            </div>
            <div className="contdetalle">
            <div className="tituloD"> <p className="parrafoD">Precio:  </p> </div>
            <div className="valorD"> <input name="Precio" onChange={this.handleInput} type="text" defaultValue={itemPoreditar.Precio} /> </div>
            </div>
            <div className="contdetalle">
            <div className="tituloD"> <p className="parrafoD">Tiempo:  </p> </div>
            <div className="valorD"> <input name="Tiempo"  onChange={this.handleInput} type="text" defaultValue={itemPoreditar.Tiempo} /> </div>
            </div>
            <div className="contdetalle">
            <div className="tituloD"> <p className="parrafoD">Garantia:  </p> </div>
            <div className="valorD"> <input name="Garantia"  onChange={this.handleInput} type="text" defaultValue={itemPoreditar.Garantia} /> </div>
            </div>
           
            </div>              

         <div className="jwEditorContainer">
      <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        
        onEditorStateChange={this.onEditorStateChange}
        uploadCallback={this.uploadCallback}
        toolbar={{
          image: {
            previewImage: true,
            uploadEnabled: true,
            alt: { present: true, mandatory: true },
          }
        }}
      />
      </div>
      <button className="btn btn-success" onClick={this.botonsubmit}>Actualizar</button>
      <button className="btn btn-danger" onClick={()=>{this.props.customFun()}}>Cancelar</button>
<style >{`
  .contInput{
    text-align: center;
    margin: 15px;
  }
.imgFile{
           width:150px
         }
         .imgContenedor{
           display:flex;
           width:100%;
           flex-wrap: wrap;
    justify-content: space-around;
         }
         .imgContenedor img{
           margin:5px;
         }
      
  .remoeditionCont{
    display: flex;
    flex-flow: column;
    align-items: center;
    /* border: 1px solid #00d5ff; */
    padding: 10px;
    border-radius: 28px;
    box-shadow: -5px -5px 20px 5px #9fc1ff, 5px 5px 20px 5px #05e6c9;
    width: 80%;
    margin-left: 10%;
}
  .contimgPreview{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: 80%;
    margin-left: 10%;
    border: 3px double cornflowerblue;
    border-radius: 15px;
    padding: 10px;
  }

        .jwEditorContainer{
          padding:15px;
        }
        .demo-wrapper{

        }
        .demo-editor{
          background: white;
          padding:10px;
          border-radius:10px
        }
        .maincontDetalles{
    display: flex;
    color: black;
    flex-flow: column;
    font-size: 20px;
    width: 100%;
    

}
.contdetalle {
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    flex-wrap: wrap;
    margin-top:10px
}
.tituloD{

  width: 30%;
}
.valorD{
 

}
        `}

      </style>
   </div>
    )
   }
 }


remoedit.propTypes = {}
export default remoedit