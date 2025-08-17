
const express = require('express');
const router = express.Router();
const AdminControl = require("../controler/admincontrol");
const TiendaControl = require("../controler/tiendacontrol");
const MailerControl = require("../controler/mailer");
const Authentication = require("../controler/middleware/auth")

router.post('/ordencompra', TiendaControl.ordenDeCompra);
router.post('/getpubbyname', TiendaControl.getPubliByname);
router.post('/tienda/getconfigblog', TiendaControl.configBlog);


router.post('/tienda/deletepublihtml',Authentication, TiendaControl.deletePubliHtml);
router.post('/tienda/editpublihtml',Authentication, TiendaControl.editPubliHtml);
router.post('/tienda/addpublihtml',Authentication, TiendaControl.addPubliHtml);
router.post('/tienda/getpublihtml',Authentication, TiendaControl.getPubliHtml);
router.post('/tienda/updateconfigpubli',Authentication, TiendaControl.updateConfigPubli);

router.post('/tienda/getUptadeOrder', TiendaControl.getUptadeOrder);
router.post('/tienda/clienteOrdenes', TiendaControl.getClienteOrders);
router.post('/tienda/enviocomprobante', TiendaControl.sendTransfer)
router.post('/tienda/updateorderpago',Authentication, TiendaControl.updateOrdenCompraPago)
router.post('/tienda/updateorder',Authentication, TiendaControl.updateOrdenCompra)
router.post('/getallordenescompra',Authentication, TiendaControl.getAllOrdenesCompra)




router.post('/addnewicons', AdminControl.addNewIcons);
router.post('/geticons', AdminControl.getIcons);
router.post('/deleteicon', AdminControl.deleteIcon);

router.post('/getDatabaseSize',Authentication, AdminControl.getDatabaseSize);

router.post('/getDbuserData',Authentication, AdminControl.getDbuserData);

router.post('/correoconfigverify',Authentication, AdminControl.correoConfigVerify);
router.post('/getCorreoConfig',Authentication, AdminControl.getCorreoConfig);

router.post('/getAllClients',Authentication, AdminControl.getAllClients);


router.post('/getVentaID',Authentication, AdminControl.getVentaID);


router.get('/masiveApplyTemplate', AdminControl.masiveApplyTemplate);
router.get('/updatedtcarts', AdminControl.updateDTCarts);

router.get('/updatesistemcats', AdminControl.updateVersionSistemCats);
router.get('/updatesistemcuentas', AdminControl.updateVersionSistemCuentas);
router.get('/updatesistemarts', AdminControl.updateVersionSistemArts);
router.get('/createSystemCats', AdminControl.createSystemCats);

router.post('/solicitudllamada', MailerControl.newsolicitudllamada);

router.post('/findYearRegs',Authentication, AdminControl.findYearRegs);
router.post('/findDataYearRegs',Authentication, AdminControl.findDataYearRegs);
router.post('/deleteDataYearRegs',Authentication, AdminControl.deleteDataYearRegs);



router.post('/edithtmlart',Authentication, AdminControl.editHtmlArt);
router.post('/venddata',Authentication, AdminControl.vendData);
router.post('/gethtmlart', AdminControl.getHtmlArt);
router.post('/deleteplantillas',Authentication, AdminControl.deleteTemplate )
router.post('/savetemplate',Authentication, AdminControl.saveTemplate);
router.post('/gettemplates',Authentication, AdminControl.getTemplates);
router.post('/enviarcoti',Authentication, AdminControl.enviarCoti);
router.post('/generate-only-art',Authentication, AdminControl.genOnlyArt);
router.post('/getclientData',Authentication, AdminControl.getClientData);
router.post('/deleteNotaCredito',Authentication, AdminControl.deleteNotaCredito);
router.post('/deleteNotaDebito',Authentication, AdminControl.deleteNotaDebito);

router.post('/deleteCorreoConfigurado',Authentication, AdminControl.deleteCorreoConfigurado);
router.get('/testingsend', AdminControl.testingsend);
router.get('/datainv', AdminControl.dataInv);

router.get('/secreturl-adddefaultdatainv', AdminControl.addDefaultDataInv);
router.get('/accountf4', AdminControl.accountF4);
router.post('/researchart',Authentication, AdminControl.researchArt);
router.post('/generatecompra', Authentication, AdminControl.generateCompra);
router.post('/deleteventa',Authentication, AdminControl.deleteVenta);
router.post('/deletecompra',Authentication, AdminControl.deleteCompra);


router.post('/downloadPDFbyHTML',Authentication, AdminControl.downloadPDFbyHTML);


router.post('/upload-firmdata',Authentication, AdminControl.uploadFirmdata);
router.post('/validate-compra-fact',Authentication, AdminControl.validateCompraFact);
router.post('/upload-factdata',Authentication, AdminControl.uploadFactData);
router.post('/delete-art',Authentication, AdminControl.deleteArt);
router.post('/delete-serv-comb',Authentication, AdminControl.deleteServComb);


router.post('/upload-masive-clientes', Authentication, AdminControl.uploadMasiveClients);
router.post('/generate-compra-masiva', Authentication, AdminControl.generateCompraMasiva);
router.post('/generate-compra-individual',Authentication, AdminControl.addArtIndividual);

router.post('/generate-factcompra',Authentication, AdminControl.generateFactCompra);

router.post('/generate-service',Authentication, AdminControl.generateService);
router.post('/edit-service',Authentication, AdminControl.editService);

router.post('/generate-combo',Authentication, AdminControl.generateCombo);
router.post('/edit-combo',Authentication, AdminControl.editCombo);

router.post('/uploadSignedXml', Authentication, AdminControl.uploadSignedXml);

router.post('/updateUser', Authentication, AdminControl.updateUser);
router.post('/resendauthfact', Authentication, AdminControl.resendAuthFact);

router.post('/downloadfact', Authentication, AdminControl.downLoadFact);

router.post('/sendSearch', Authentication, AdminControl.sendSearch);
router.post('/editart', Authentication, AdminControl.editArt);

router.post('/editart-salida-inventario', Authentication, AdminControl.editArtSalidaInv);

router.post('/editartcompra', AdminControl.editArtCompra);

router.post('/uploadnewseller',Authentication, AdminControl.uploadNewSeller);

router.post('/editarPrecioCompra',Authentication, AdminControl.editarPrecioCompra);


router.post('/deleteseller',Authentication, AdminControl.deleteSeller);
router.post('/editseller',Authentication, AdminControl.editSeller);
router.get('/secreturl235/inventarioDelete', AdminControl.inventarioDelete);


router.get('/ventaslist', AdminControl.ventasList);
router.post('/generatesignaturecloudi', AdminControl.signatureCloudi);
router.get('/compraslist', AdminControl.comprasList);
router.post('/engine/art',Authentication, AdminControl.getArt);
router.post('/engine/artbytitle', AdminControl.getArtByTitle);
router.post('/engine/artreview', AdminControl.getArt);

router.post('/engine/getua',Authentication, AdminControl.getUA);


router.post('/engine/getallcounts',Authentication, AdminControl.getAllCounts);
router.get('/get-article-by-id/:article', AdminControl.getArt_by_id);
router.get('/trytohelp', AdminControl.tryToHelp);


module.exports = router;

