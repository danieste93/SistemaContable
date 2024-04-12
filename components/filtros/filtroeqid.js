export const Filtervalue = (arr, valor) => {
    if(!valor) return arr;
    if(valor === "") return arr;
const interger = parseInt(valor)
const lowerCase= valor.toLowerCase() 
let generated = arr.filter(arti => arti.Eqid.toLowerCase().includes(lowerCase));
console.log(generated)
    return  generated
  
};
export const Searcher = (arr, payload) => {
    
    if(!payload) return arr;
const lowerCase= payload.toLowerCase() 



let miarrsplited =lowerCase.split(" ")



let resulttag = arr

for(let i = 0;i<miarrsplited.length;i++){
  resulttag=   resulttag.filter(product => product.Titulo.toLowerCase().includes(miarrsplited[i]));
}

//let result = arr.filter(product => product.Titulo.replace("  "," ").trim().toLowerCase().includes(lowerCase));

    return  resulttag
  
};


