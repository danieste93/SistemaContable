const express = require('express');
const router = express.Router()
const cuentasController = require('../controler/cuentas');
const Counter = require("../controler/counter")
const Authentication = require("../controler/middleware/auth")

router.post('/genCierreCaja',Authentication, cuentasController.genCierreCaja);
router.post('/getmaindata',Authentication, cuentasController.getMainData);
router.post('/getcuentasregs',Authentication, cuentasController.getCuentasRegs);
router.post('/getregstime',Authentication, cuentasController.getRegsTime);
router.post('/getInvs',Authentication, cuentasController.getInvs);
router.post('/getarts',Authentication, cuentasController.getArts);
router.post('/exeregs',Authentication, cuentasController.exeRegs);
router.post('/addabono',Authentication, cuentasController.addAbono);
router.post('/getallreps',Authentication, cuentasController.getAllReps)
router.post('/getCuentasyCats',Authentication, cuentasController.getCuentasyCats)
router.post('/getarmoextradata',Authentication, cuentasController.getArmoextraData);
router.post('/getpartdata2',Authentication, cuentasController.getPartData2);
router.post('/getpartdata3',Authentication, cuentasController.getPartData3);
router.post('/getregsbycuentas',Authentication, cuentasController.getRegsbyCuentas);
router.post('/getVentasHtml',Authentication, cuentasController.getVentasHtml);
router.post('/getventas',Authentication, cuentasController.getVentas);
router.post('/getventasbytime',Authentication, cuentasController.getVentasByTime);
router.post('/getcompras',Authentication, cuentasController.getCompras);
router.post('/getallcompras',Authentication, cuentasController.getAllCompras);
router.post('/getcuentasdata',Authentication, cuentasController.getCuentaslim);

router.post('/getrcr',Authentication, cuentasController.getRCR);

router.post('/getrcr2',Authentication, cuentasController.getRCR2);

router.put('/addcount',Authentication, cuentasController.addCount);
router.post('/deletecount', Authentication, cuentasController.deleteCount);
router.put('/editcount',Authentication, cuentasController.editCount);


router.post('/addcierrecaja',Authentication, cuentasController.addCierreCaja);

router.put('/addreg',Authentication, cuentasController.addReg);
router.put('/edittreg', Authentication, cuentasController.editReg);
router.post('/deletereg', Authentication, cuentasController.deleteReg);

router.put('/addcat', Authentication, cuentasController.addCat);
router.put('/editcat', Authentication, cuentasController.editCat);
router.put('/deletecat', Authentication, cuentasController.deleteCat);

router.put('/addnewtipe',Authentication, cuentasController.addNewTipe);
router.post('/deletetipe',Authentication, cuentasController.deleteTipe);

router.put('/edittrep',Authentication, cuentasController.editRep);
router.post("/deleterepeticion",Authentication, cuentasController.deleteRepeticion)


router.put('/addrepeticiones',Authentication, cuentasController.addRepeticiones);

router.post('/getregs', Authentication, cuentasController.getRegs);
router.post('/getregsdeletetime', Authentication, cuentasController.getRegsDeleteTime);
router.post('/getmontregs', Authentication, cuentasController.getMontRegs);
router.post('/gettipos', Authentication, cuentasController.getTipos);
router.get('/getdataaaa', cuentasController.profesorAdd);
router.post('/agregarNotaCredito',Authentication, cuentasController.agregarNotaCredito);

router.post('/agregarNotaDebito',Authentication, cuentasController.agregarNotaDebito);

router.post('/generarfact', cuentasController.generarFact);

router.post('/uploadfact',Authentication, cuentasController.uploadFact);


router.post('/generarventa', cuentasController.generarVenta);
router.post('/generarcredito', cuentasController.generarCredito);
router.post('/findcuenta', cuentasController.findCuenta);

router.post('/rtyhgf456/getcounterAddcuentas', Counter.getCounterAddCuentas);
router.post('/rtyhgf456/getallcounters', Counter.getAllCounters);
router.get('/rtyhgf456/getcounter', Counter.getCounter);
router.post('/rtyhgf456/updatecounter/rep', Counter.updateCounterRep);
router.post('/rtyhgf456/updatecounter/cuentas', Counter.updateCounterCuen);
router.post('/rtyhgf456/updatecounter/regs', Counter.updateCounterRegs);
router.post('/rtyhgf456/updatecounter/regsyventa', Counter.updateCounterRegsyVenta);
router.post('/rtyhgf456/updatecounter/venta', Counter.updateCounterVenta);
router.post('/rtyhgf456/updatecounter/compra', Counter.updateCounterCompra);
router.post('/rtyhgf456/updatecounter/compraindividual', Counter.updateCounterCompraIndividual);

router.post('/getcuentas', cuentasController.getCuentas);

router.get('/gettipocuentas', cuentasController.getTipoCuentas);

router.get('/getcat', cuentasController.getCat);
router.get('/getrepeticiones', cuentasController.getRepeticiones);
module.exports = router;