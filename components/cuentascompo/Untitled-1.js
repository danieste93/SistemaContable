{cuentasHidden.map((cuenta, i)=>{
let tintura = ()=>{

if(cuenta.CheckedA){
if(parseFloat(cuenta.DineroActual.$numberDecimal)  == 0){
return ""
}else if(parseFloat(cuenta.DineroActual.$numberDecimal)  > 0){
return "setBlue"
}else if(parseFloat(cuenta.DineroActual.$numberDecimal) < 0){
return "setRed"
}
}
else{ return "" }
}

return(
<Animate show={this.state.visibility}>
<div key ={i}className={ `  cuentaContenedor jwPointer ${cuenEditMode} hiddenCustom`} onClick={()=>{

if(this.state.cuenEditMode){
this.editCustomCuenta(cuenta)
}else{
this.getcuentaRegs(cuenta)
}
}}>
<p >
{cuenta.NombreC}
</p>
<div className="conteliminal">
<p className={tintura()}>
{`$ ${parseFloat(cuenta.DineroActual.$numberDecimal).toFixed(2)}` }
</p>
<Animate show={this.state.cuenEditMode}>
<i className="material-icons" onClick={(e)=>{
e.stopPropagation()
this.setState({ModalDeleteC:true, CuentaPorDel:cuenta})}}>
delete
</i>
</Animate>
</div>

</div>
</Animate>
)
})}