export const Adminfunitem = ({icono, titulo, url})=>{
 
    return(
  
     <div onClick={()=>{this.handleMember(url)}} ><a>
     <div className="adminitem">
     <div>
       <div className="button__content ">
  <span className="material-icons icontarget">
  {icono}
  </span>
      
        </div>
        <p>{titulo}</p>
        </div>
        <style jsx>{`
        .button__content {
         position: relative;
       
    
         width: 100%;
         height: 100%;
        
      
         border-radius: 40px;
         transition: 0.13s ease-in-out;
         z-index: 1;
         display: flex;
         flex-flow: column;
         justify-content: space-around;
  
        }
       
  .adminitem{
    color: white;
  
  
  margin: 5px;
  align-items: center;
  display: flex;
  flex-flow: column;
  justify-content: space-around;
  text-align: center;
  height: 50px;
  
  background:snow;
  
  width: 60px;
  border:2px solid #888888;
  outline:none;
  
  border-radius: 10px;
  
  transition: .13s ease-in-out;
  cursor:pointer;
  }
  .balanceCont{
  background: #3c8ae0;
  padding: 20px 15px;
  color: white;
  }
  .icontarget{
  
  
  font-size: 20px;
  
  color: grey;
  text-align: center;
  
  transition:1s
  }
  .adminitem a{
    width:30%;
  }
  .adminitem:active{
  box-shadow:none;
  
  
  }
  .button__content:active{
  box-shadow:none;
  
  }
  
  `}
  
  </style>
     </div>
     </a></div> 
   
    )
  }