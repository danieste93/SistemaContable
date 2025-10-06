
const Art = require("../models/articulo")
const Rep = require("../models/repuesto")
const Reptest = require("../models/repuestotest")
const excel = require('exceljs');
 const excelToJson = require('convert-excel-to-json');
function importExcelData2MongoDB(filePath){
  
   
    // -> Read Excel File to Json Data
 const excelData = excelToJson({
        sourceFile: filePath,
        header:{
            // Is the number of rows that will be skipped and will not be present at our result object. Counting from top to bottom
            rows: 1 // 2, 3, 4, etc.
        },
        columnToKey: {
            A: 'Eqid',
            B: 'Departamento',
            C:'Grupo',
            D:"Categoria",
            E:"Titulo",
            F:"Proveedor",
            G:"Marca",
            H:"Calidad",
            I:"Color",
            J:"Descripcion",
            K:"Garantia",
            L:"Imagen",
            M:"Modelos",
            N:"Existencia",
            O:"Precio_Compra",
            P:"Precio_Venta",
            Q:"Precio_Alt",
            R:"Valor_Total",
            S:"MiniDescrip",
            T:"CantidadCompra",
        }
      
    });
    return excelData
   
}

function ExcellRep2MongoDB(filePath){
  
   
    // -> Read Excel File to Json Data
 const excelData = excelToJson({
        sourceFile: filePath,
        header:{
            // Is the number of rows that will be skipped and will not be present at our result object. Counting from top to bottom
            rows: 1 // 2, 3, 4, etc.
        },
        columnToKey: {
            A: 'jwID',
            B: 'Grupo',
            C: 'Marca',
            D:'Modelo',
            E:"Repuesto",
            F:"Color",
            G:"Calidad",
            H:"Garantia",
            I:"Descripcion",
            J:"Precio",
            K:"Imagen",
            L:"Tiempo"
          
        }
      
    });
    return excelData
   
}


const uploadExcell =(req, res, next) => {



const datos = importExcelData2MongoDB(req.file.path);

Art.insertMany(datos.Hoja1, (err, docs)=> {
    if(err){
        console.log(err)
         return res.status(500).send({message:"error al subir"})
    } 
    console.log("Numero de registros insertados: " + docs.length);
    res.status(200).send({registros: docs})
});
}

const uploadExcellRep =(req, res, next) => {



    const datos = ExcellRep2MongoDB(req.file.path);
    
    Rep.insertMany(datos.Customers, (err, docs)=> {
        if(err){
            console.log(err)
             return res.status(500).send({message:"error al subir"})
        } 
        console.log("Numero de registros insertados: " + docs.length);
        res.status(200).send({registros: docs})
    });
 
    }

const getRepExcell =(req, res) =>{

    console.log("lol")


    Rep.find({}, (err, rep)=>{
        if(err) return res.status(500).send({message:"error en la peticion"})
        if(!rep) return res.status(404).send({message:"elemento no encontrado"})
       
        let workbook = new excel.Workbook(); //creating workbook
	let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
     
    let repuesta = rep

       
        //  WorkSheet Header
        worksheet.columns = [
            { header: 'Id', key: 'jwID', width: 10 },
            { header: 'Grupo', key: 'Grupo', width: 30 },
            { header: 'Marca', key: 'Marca', width: 30 },
            { header: 'Modelo', key: 'Modelo', width: 30 },
            { header: 'Repuesto', key: 'Repuesto', width: 30 },
            { header: 'Color', key: 'Color', width: 30 },
            { header: 'Calidad', key: 'Calidad', width: 30 },
            { header: 'Garantia', key: 'Garantia', width: 30 },
            { header: 'Descripcion', key: 'Descripcion', width: 30 },
            { header: 'Precio', key: 'Precio', width: 30},
            { header: 'Imagen', key: 'Imagen', width: 30},
            { header: 'Tiempo', key: 'Tiempo', width: 30}
        ];

        // Add Array Rows
	worksheet.addRows(repuesta);
    // Write to File
	workbook.xlsx.writeFile("RepDB.xlsx")
    .then(function() {
        console.log("file saved!");
    });
    res.status(200).send({repuesta})

      })

      


}
const setArrays =(req, res) =>{

    

    Rep.find({}, function (err, items) {
        items.forEach(function (item) {
           
            if(item.Imagen.length > 0){
           let cadena = item.Imagen[0]
            let edit = cadena.replace(/['"]+/g, '')
            let editcchetes = edit.replace(/[\[\]]/g,'')
            let arrayexport = editcchetes.split(",")

Rep.update(
    {
        _id: item._id
    },
    {
        $set: {
            "Imagen": arrayexport
        }
    }
)

.then(function (data) {
    console.log('It works');
    res.status(200).send({"repuesta":"funciona"})
})
.catch(function (err) {
    console.log(err);
});
}


        })

    
    });

  }

module.exports ={
    uploadExcell, getRepExcell, uploadExcellRep, setArrays
}