import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import './drop-file-input.css';

import { ImageConfig } from '../../config/ImageConfig'; 
import uploadImg from '../../assets/cloud-upload-regular-240.png';

const DropFileInput = props => {

    const wrapperRef = useRef(null);

    const [fileList, setFileList] = useState([]);

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');

    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = (e) => {
        console.log(e)
      const newFile = e.target.files;
      console.log()
      let arr  = []
if(newFile[0].type ==  "application/x-pkcs12"){
    for(let i = 0; i < newFile.length;i++){
          
      arr.push(newFile[i])
     
  }
       
  const updatedList = [...fileList];
  let primes = arr.concat(updatedList);
  setFileList(primes);
  props.onFileChange(primes);
}else{
   
    props.onFileChange([{type:""}]);
}



    }

    const fileRemove = (file) => {
        const updatedList = [...fileList];
        updatedList.splice(fileList.indexOf(file), 1);
        setFileList(updatedList);
        props.onFileChange(updatedList);
    }

    return (
        <>
            <div
                ref={wrapperRef}
                className="drop-file-input"
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className="drop-file-input__label">
                    <img src={uploadImg} alt="" />
                    <p>Arrastra o Selecciona Archivos</p>
                </div>
                <input type="file" value="" multiple onChange={onFileDrop}/>
              
            </div>
            {
                fileList.length > 0 ? (
                    <div className="drop-file-preview">
                    
                        {
                            fileList.map((item, index) => (
                                <div key={index} className="drop-file-preview__item">
                                    <img src={ImageConfig[item.type.split('/')[1]] || ImageConfig['default']} alt="" />
                                    <div className="drop-file-preview__item__info">
                                        <p>{item.name}</p>
                                        <p>{item.size}B</p>
                                    </div>
                                    <span className="drop-file-preview__item__del" onClick={() => fileRemove(item)}>x</span>
                                </div>
                            ))
                        }
                    </div>
                ) : null
            }
        </>
    );
}

DropFileInput.propTypes = {
    onFileChange: PropTypes.func
}

export default DropFileInput;
