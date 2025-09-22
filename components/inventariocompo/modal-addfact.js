// --- ZOOM LOCAL Y OCR EN DÍGITOS DUDOSOS ---
// Helpers fuera de la clase para sintaxis válida
var gruposConf = [
  ['5', '6'],
  ['1', '2', '7']
];
function posicionesDudosas(str1, str2) {
  var dudas = [];
  for (var i = 0; i < Math.min(str1.length, str2.length); i++) {
    if (str1[i] !== str2[i]) {
      for (var g = 0; g < gruposConf.length; g++) {
        if (gruposConf[g].includes(str1[i]) && gruposConf[g].includes(str2[i])) {
          dudas.push({ pos: i, grupo: gruposConf[g] });
        }
      }
    }
  }
  return dudas;
}
function ocrZoomDigito(canvas, x, y, w, h, grupo) {
  return new Promise(function(resolve) {
    var zoom = 3;
    var blockCanvas = document.createElement('canvas');
    blockCanvas.width = w * zoom;
    blockCanvas.height = h * zoom;
    var blockCtx = blockCanvas.getContext('2d');
    blockCtx.imageSmoothingEnabled = false;
    blockCtx.drawImage(canvas, x, y, w, h, 0, 0, w * zoom, h * zoom);
    var imageData = blockCtx.getImageData(0, 0, blockCanvas.width, blockCanvas.height);
    var th = 128;
    for (var i = 0; i < imageData.data.length; i += 4) {
      var v = imageData.data[i];
      var bin = v > th ? 255 : 0;
      imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = bin;
    }
    blockCtx.putImageData(imageData, 0, 0);
    var whitelist = grupo.join('');
    window.Tesseract.recognize(blockCanvas.toDataURL('image/png'), 'eng', {
      logger: function(m) {},
      tessedit_char_whitelist: whitelist,
      preserve_interword_spaces: 1,
      psm: 10
    }).then(function(result) {
      resolve((result.data.text || '').replace(/\D/g, ''));
    });
  });
}
// Helper: Extraer y validar clave de acceso SRI (49 dígitos)
function extraerYValidarClaveSRI(textoOCR) {
  // 1. Buscar candidatos: secuencias de 44-49 dígitos (limpia todo menos números)
  let raw = (textoOCR || '').replace(/[^0-9]/g, ' ');
  let matches = raw.match(/\d{44,49}/g) || [];
  let candidatos = matches.filter(x => x.length === 49);
  if (candidatos.length === 0) return { is_valid: false, errors: ['No se encontró clave de 49 dígitos'] };
  let clave = candidatos[0];
  // 2. Desglose de campos
  let fields = {
    fecha: clave.slice(0,8),
    tipo_comprobante: clave.slice(8,10),
    ruc: clave.slice(10,23),
    ambiente: clave.slice(23,24),
    serie: clave.slice(24,30),
    secuencial: clave.slice(30,39),
    codigo_numerico: clave.slice(39,47),
    tipo_emision: clave.slice(47,48),
    digito_verificador: clave.slice(48,49)
  };
  let errors = [];
  // 3. Validaciones básicas
  if (!/^\d{8}$/.test(fields.fecha)) errors.push('Fecha inválida');
  if (!/^\d{2}$/.test(fields.tipo_comprobante)) errors.push('Tipo comprobante inválido');
  if (!/^\d{13}$/.test(fields.ruc)) errors.push('RUC inválido');
  if (!/^[12]$/.test(fields.ambiente)) errors.push('Ambiente inválido');
  if (!/^\d{6}$/.test(fields.serie)) errors.push('Serie inválida');
  if (!/^\d{9}$/.test(fields.secuencial)) errors.push('Secuencial inválido');
  if (!/^\d{8}$/.test(fields.codigo_numerico)) errors.push('Código numérico inválido');
  if (!/^[12]$/.test(fields.tipo_emision)) errors.push('Tipo emisión inválido');
  // 4. Validar fecha real
  let d = fields.fecha;
  let dia = parseInt(d.slice(0,2)), mes = parseInt(d.slice(2,4)), anio = parseInt(d.slice(4,8));
  let fechaValida = mes >= 1 && mes <= 12 && dia >= 1 && dia <= 31 && anio >= 2000 && anio <= 2100;
  if (!fechaValida) errors.push('Fecha fuera de rango');
  // 5. Validar tipo comprobante permitido
  let tiposPermitidos = ['01','04','05','06','07'];
  if (!tiposPermitidos.includes(fields.tipo_comprobante)) errors.push('Tipo comprobante no permitido');
  // 6. Checksum módulo 11
  function calcularDV(cadena48) {
    let factores = [2,3,4,5,6,7];
    let suma = 0, j = 0;
    for (let i = cadena48.length-1; i >= 0; i--) {
      suma += parseInt(cadena48[i]) * factores[j % 6];
      j++;
    }
    let resto = suma % 11;
    let res = 11 - resto;
    if (res === 11) return '0';
    if (res === 10) return '1';
    return String(res);
  }
  let dvCalc = calcularDV(clave.slice(0,48));
  if (dvCalc !== fields.digito_verificador) errors.push('Dígito verificador incorrecto');
  // 7. Resultado final
  return {
    raw_candidate: clave,
    clave_clean: clave,
    is_valid: errors.length === 0,
    confidence: 1.0, // No hay confidencias OCR aquí, solo lógica
    errors,
    fields,
    suggested_corrections: []
  };
}

// Helper: Generar XML básico de factura electrónica desde campos de clave SRI
function generarXMLFacturaDesdeClave(fields) {
  // Estructura mínima de ejemplo, puede ser extendida según requerimientos
  return `<?xml version="1.0" encoding="UTF-8"?>\n<factura>\n    <infoTributaria>\n      <fechaEmision>${fields.fecha}</fechaEmision>\n      <tipoComprobante>${fields.tipo_comprobante}</tipoComprobante>\n      <ruc>${fields.ruc}</ruc>\n      <ambiente>${fields.ambiente}</ambiente>\n      <serie>${fields.serie}</serie>\n      <secuencial>${fields.secuencial}</secuencial>\n      <codigoNumerico>${fields.codigo_numerico}</codigoNumerico>\n      <tipoEmision>${fields.tipo_emision}</tipoEmision>\n    </infoTributaria>\n  </factura>`;
}
import DescriptionIcon from '@material-ui/icons/Description';
import BarcodeCameraDirectReader from '../../components/BarcodeCameraDirectReader';
import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import CropFreeIcon from '@material-ui/icons/CropFree';
import Autosuggestjw from '../suggesters/jwsuggest-autorender';
import DropFileInput from "../drop-file-input/DropFileInputp12"
import Xml2js from 'xml2js';
import moment from "moment";
import "moment/locale/es";
import ListCompraFact from "./listCompra2RenderFact";
import Animate from 'react-animate-mount/lib/Animate';
import {connect} from 'react-redux';
import {addArt, addCompra,addRegs, updateCuentas, updateArts } from "../../reduxstore/actions/regcont"
import AddCero from "../../components/funciones/addcero"
import HelperFormapagoPredit from '../reusableComplex/helperFormapagoPredit';
import Prevent from "../cuentascompo/modal-prevent" 
import CircularProgress from '@material-ui/core/CircularProgress';
import DoubleScrollbar from "react-double-scrollbar";
class Contacto extends Component {
  state = {
    ...this.state,
    showBarcodeCamera: false,
    showBarcodeDirect: false,
    isCompact: false
  };
  componentDidUpdate(prevProps, prevState) {
    // Compacto sin animación: solo cambia el flag para el render
    const xmlOk = this.state.xmlData && this.state.xmlData.fechaAutorizacion && this.state.xmlData.fechaAutorizacion[0] !== '';
    if (xmlOk && !this.state.isCompact) {
      this.setState({ isCompact: true });
    }
    if (!xmlOk && this.state.isCompact) {
      this.setState({ isCompact: false });
    }
  }
  // OCR: Tomar foto y extraer clave de acceso
  handleFotoFactura = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    this.setState({ consultandoSRI: true, Alert: { Estado: false }, ocrDebugText: '', ocrDebugText120: '', ocrDebugText220: '', ocrDebugTextOriginal: '' });
    try {
      const { default: Tesseract } = await import('./tesseractLoader');
      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = new window.Image();
        img.onload = async () => {
          // Reducción de imagen si es muy grande (máx 1500px ancho/alto)
          let scale = 1;
          const maxDim = 1500;
          if (img.width > maxDim || img.height > maxDim) {
            scale = Math.min(maxDim / img.width, maxDim / img.height);
          }
          const scaledCanvas = document.createElement('canvas');
          scaledCanvas.width = Math.round(img.width * scale);
          scaledCanvas.height = Math.round(img.height * scale);
          const scaledCtx = scaledCanvas.getContext('2d');
          scaledCtx.drawImage(img, 0, 0, scaledCanvas.width, scaledCanvas.height);

          // Conversión a escala de grises
          const grayImageData = scaledCtx.getImageData(0, 0, scaledCanvas.width, scaledCanvas.height);
          const grayData = grayImageData.data;
          for (let i = 0; i < grayData.length; i += 4) {
            const avg = (grayData[i] + grayData[i + 1] + grayData[i + 2]) / 3;
            grayData[i] = grayData[i + 1] = grayData[i + 2] = avg;
          }

          // (Sin filtro de mediana ni deskew para máxima velocidad y simplicidad)
          // Aumento de contraste rápido
          function contrastStretch(imageData, factor = 1.3) {
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
              let v = data[i];
              v = (v - 128) * factor + 128;
              v = Math.max(0, Math.min(255, v));
              data[i] = data[i + 1] = data[i + 2] = v;
            }
            return imageData;
          }

          // Filtro de nitidez (sharpen) rápido
          function sharpen(imageData, width, height) {
            const weights = [0, -1, 0, -1, 5, -1, 0, -1, 0];
            const side = 3;
            const halfSide = Math.floor(side / 2);
            const src = imageData.data;
            const sw = width;
            const sh = height;
            const output = new Uint8ClampedArray(src.length);
            for (let y = 0; y < sh; y++) {
              for (let x = 0; x < sw; x++) {
                let r = 0;
                for (let ky = 0; ky < side; ky++) {
                  for (let kx = 0; kx < side; kx++) {
                    let px = x + kx - halfSide;
                    let py = y + ky - halfSide;
                    if (px >= 0 && px < sw && py >= 0 && py < sh) {
                      let idx = (py * sw + px) * 4;
                      r += src[idx] * weights[ky * side + kx];
                    }
                  }
                }
                let idx = (y * sw + x) * 4;
                r = Math.max(0, Math.min(255, r));
                output[idx] = output[idx + 1] = output[idx + 2] = r;
                output[idx + 3] = 255;
              }
            }
            for (let i = 0; i < src.length; i++) src[i] = output[i];
            return imageData;
          }

          // Aplicar contraste y nitidez antes del binarizado
          contrastStretch(grayImageData, 1.3);
          sharpen(grayImageData, scaledCanvas.width, scaledCanvas.height);
          scaledCtx.putImageData(grayImageData, 0, 0);

          // (Sin CLAHE para máxima velocidad y simplicidad)

          // Helper para binarizar con Otsu sobre la imagen en grises
          const otsuThreshold = (grayData) => {
            let hist = new Array(256).fill(0);
            for (let i = 0; i < grayData.length; i += 4) {
              hist[grayData[i]]++;
            }
            let total = grayData.length / 4;
            let sum = 0;
            for (let t = 0; t < 256; t++) sum += t * hist[t];
            let sumB = 0, wB = 0, wF = 0, varMax = 0, threshold = 0;
            for (let t = 0; t < 256; t++) {
              wB += hist[t];
              if (wB === 0) continue;
              wF = total - wB;
              if (wF === 0) break;
              sumB += t * hist[t];
              let mB = sumB / wB;
              let mF = (sum - sumB) / wF;
              let varBetween = wB * wF * (mB - mF) * (mB - mF);
              if (varBetween > varMax) {
                varMax = varBetween;
                threshold = t;
              }
            }
            return threshold;
          };

          // Binarizar normal y negativo
          const binarize = (invert = false) => {
            const canvas = document.createElement('canvas');
            canvas.width = scaledCanvas.width;
            canvas.height = scaledCanvas.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(scaledCanvas, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            let th = otsuThreshold(data);
            for (let i = 0; i < data.length; i += 4) {
              let bin = data[i] > th ? 255 : 0;
              if (invert) bin = 255 - bin;
              data[i] = data[i + 1] = data[i + 2] = bin;
            }
            ctx.putImageData(imageData, 0, 0);
            return canvas.toDataURL('image/png');
          };

          // OCR normal y negativo
          const otsuDataUrl = binarize(false);
          const otsuNegDataUrl = binarize(true);
          const [resultOtsu, resultNeg] = await Promise.all([
            Tesseract.recognize(otsuDataUrl, 'eng', {
              logger: m => {},
              tessedit_char_whitelist: '0123456789',
              preserve_interword_spaces: 1,
              psm: 7
            }),
            Tesseract.recognize(otsuNegDataUrl, 'eng', {
              logger: m => {},
              tessedit_char_whitelist: '0123456789',
              preserve_interword_spaces: 1,
              psm: 7
            })
          ]);
          // Comparar resultados OCR normal y negativo para resolver conflictos 5/6, 2/7, 1/7
          function resolverConflictosPorGrupos(str1, str2) {
            if (!str1 || !str2) return str1 || str2 || '';
            const grupos = [
              ['5', '6'],
              ['2', '7'],
              ['1', '7']
            ];
            let resultado = '';
            for (let i = 0; i < Math.max(str1.length, str2.length); i++) {
              const c1 = str1[i] || '';
              const c2 = str2[i] || '';
              if (c1 === c2) {
                resultado += c1;
              } else {
                // ¿Están ambos en algún grupo?
                let grupo = grupos.find(g => g.includes(c1) && g.includes(c2));
                if (grupo) {
                  // Si uno de los dos aparece más veces en ambos resultados, elige ese
                  const count1 = (str1 + str2).split('').filter(x => x === c1).length;
                  const count2 = (str1 + str2).split('').filter(x => x === c2).length;
                  resultado += count1 >= count2 ? c1 : c2;
                } else {
                  // Si no es un grupo de confusión, prioriza el normal
                  resultado += c1;
                }
              }
            }
            return resultado;
          }

          const claveOCRNormal = (resultOtsu.data.text || '').replace(/\D/g, '');
          const claveOCRNeg = (resultNeg.data.text || '').replace(/\D/g, '');
          const claveFusionada = resolverConflictosPorGrupos(claveOCRNormal, claveOCRNeg);

          this.setState({
            ocrDebugTextOtsu: resultOtsu.data.text,
            ocrDebugTextOriginal: resultNeg.data.text,
            ocrDebugTextBlocks: '',
            claveFusionadaOCR: claveFusionada
          });
// Post-procesamiento: probar variantes de dígitos conflictivos y validar con dígito de control
function generarVariantesClave(clave) {
  // Grupos de confusión
  const grupos = [
    ['5', '6'],
    ['2', '7'],
    ['1', '7']
  ];
  let variantes = new Set([clave]);
  // Para cada grupo, generar variantes cambiando cada dígito por los otros del grupo
  grupos.forEach(grupo => {
    let nuevas = new Set();
    variantes.forEach(v => {
      for (let i = 0; i < v.length; i++) {
        if (grupo.includes(v[i])) {
          grupo.forEach(g => {
            if (g !== v[i]) {
              let arr = v.split('');
              arr[i] = g;
              nuevas.add(arr.join(''));
            }
          });
        }
      }
    });
    nuevas.forEach(n => variantes.add(n));
  });
  return Array.from(variantes);
}

          // Lógica inteligente para extraer clave de acceso
          function extractClaveInteligente(text) {
            // 1. Limpiar texto: quitar espacios, guiones, puntos y caracteres no numéricos
            let clean = (text || '').replace(/[\s\-\.]/g, '');
            let claves = [];
            // 2. Buscar todas las secuencias de 44 a 49 dígitos (priorizar 49)
            let matches = clean.match(/[0-9]{44,49}/g) || [];
            claves.push(...matches);

            // 3. Buscar patrones con palabras clave oficiales y unir fragmentos numéricos cercanos
            const titulos = [
              /clave\s*de\s*acceso/i,
              /n[uú]mero\s*de\s*autorizaci[oó]n/i,
              /c[oó]digo\s*de\s*autorizaci[oó]n/i,
              /c[oó]digo\s*[uú]nico\s*del?\s*comprobante\s*electr[oó]nico/i
            ];
            let lineas = (text || '').split(/\n|\r/);
            for (let i = 0; i < lineas.length; i++) {
              let l = lineas[i];
              for (let pat of titulos) {
                if (pat.test(l)) {
                  // Unir hasta 8 líneas siguientes para buscar y concatenar todos los números
                  let claveConcat = '';
                  for (let j = 1; j <= 8 && (i + j) < lineas.length; j++) {
                    let nums = (lineas[i + j] || '').match(/[0-9]+/g);
                    if (nums) claveConcat += nums.join('');
                    if (claveConcat.length >= 49) break;
                  }
                  // Si se logró una clave de 44-49 dígitos, agregarla
                  if (claveConcat.length >= 44 && claveConcat.length <= 49) {
                    claves.push(claveConcat);
                  }
                }
              }
            }

            // 4. Buscar secuencias "sucias" de 44-49 dígitos (con separadores)
            let sucias = (text || '').match(/[0-9\-\.\s]{25,}/g) || [];
            sucias.forEach(seq => {
              let soloDigitos = seq.replace(/[^0-9]/g, '');
              if (soloDigitos.length >= 44 && soloDigitos.length <= 49) {
                claves.push(soloDigitos);
              }
            });

            // 5. Buscar si hay código de barras (opcional: aquí solo log, pues requiere OCR especial)
            if (/c[oó]digo\s*de\s*barras/i.test(text)) {
              console.log('Posible código de barras detectado en el texto.');
            }

            // Quitar duplicados y solo 44-49 dígitos
            claves = [...new Set(claves)].filter(x => x.length >= 44 && x.length <= 49);
            // Priorizar las de 49 dígitos
            claves.sort((a, b) => b.length - a.length);
            return claves;
          }

          // Buscar primero por títulos oficiales y 49 dígitos después en los resultados actuales
          const titulos = [
            /clave\s*de\s*acceso[\s:;\-_/]*([0-9]{49})/i,
            /n[uú]mero\s*de\s*autorizaci[oó]n[\s:;\-_/]*([0-9]{49})/i,
            /c[oó]digo\s*de\s*autorizaci[oó]n[\s:;\-_/]*([0-9]{49})/i,
            /c[oó]digo\s*[uú]nico\s*del?\s*comprobante\s*electr[oó]nico[\s:;\-_/]*([0-9]{49})/i,
            /clave\s*de\s*acceso\s*\/\s*autorizaci[oó]n[\s:;\-_/]*([0-9]{49})/i
          ];
          let claveTitulo = null;
          let fuenteTitulo = null;
          const textosOCR = [this.state.ocrDebugTextOriginal, this.state.ocrDebugTextOtsu, this.state.ocrDebugTextBlocks];
          for (let txt of textosOCR) {
            for (let pat of titulos) {
              let m = (txt || '').match(pat);
              if (m && m[1]) {
                claveTitulo = m[1];
                fuenteTitulo = txt;
                break;
              }
            }
            if (claveTitulo) break;
          }

          // Si se encontró clave con título, intentar consulta SRI automática
          if (claveTitulo) {
            // Probar variantes de dígitos conflictivos si el dígito de control falla
            let variantes = generarVariantesClave(claveTitulo);
            let claveValida = null;
            for (let v of variantes) {
              let valid = extraerYValidarClaveSRI(v);
              if (valid.is_valid) {
                claveValida = v;
                break;
              }
            }
            if (claveValida) {
              this.setState({ claveAccesoInput: claveValida, mostrarClavesAlternas: false, clavesDetectadas: [claveValida], Alert: { Estado: false }, consultandoSRI: false }, () => {
                if (typeof this.consultarSRI === 'function') {
                  this.consultarSRI(true);
                }
              });
            } else {
              this.setState({ claveAccesoInput: claveTitulo, mostrarClavesAlternas: false, clavesDetectadas: [claveTitulo], Alert: { Estado: true, Tipo: 'error', Mensaje: 'Clave detectada, pero no válida. Revisa los dígitos.' }, consultandoSRI: false });
            }
            return;
          }

          // Si no se encontró clave con título, buscar todas las claves posibles
          let posiblesClaves = [];
          textosOCR.forEach(txt => {
            posiblesClaves = posiblesClaves.concat(extractClaveInteligente(txt));
          });
          posiblesClaves = [...new Set(posiblesClaves)].filter(x => x.length >= 44 && x.length <= 49);
          posiblesClaves.sort((a, b) => b.length !== a.length ? b.length - a.length : b.localeCompare(a));
          // Probar variantes de dígitos conflictivos para cada clave
          let claveValida = null;
          let clavesProbadas = [];
          for (let c of posiblesClaves) {
            let variantes = generarVariantesClave(c);
            for (let v of variantes) {
              let valid = extraerYValidarClaveSRI(v);
              if (valid.is_valid) {
                claveValida = v;
                break;
              }
              clavesProbadas.push(v);
            }
            if (claveValida) break;
          }
          if (claveValida) {
            this.setState({ claveAccesoInput: claveValida, consultandoSRI: false, clavesDetectadas: [claveValida], mostrarClavesAlternas: false, Alert: { Estado: false } }, () => {
              if (typeof this.consultarSRI === 'function') {
                this.consultarSRI(true);
              }
            });
          } else if (posiblesClaves.length > 0) {
            this.setState({ claveAccesoInput: posiblesClaves[0], consultandoSRI: false, clavesDetectadas: posiblesClaves, mostrarClavesAlternas: true, Alert: { Estado: true, Tipo: 'error', Mensaje: 'No se encontró clave válida. Selecciona o corrige la clave detectada.' } });
          } else {
            this.setState({ consultandoSRI: false, Alert: { Estado: true, Tipo: 'error', Mensaje: 'No se encontró número de autorización en la imagen.' }, clavesDetectadas: [], mostrarClavesAlternas: false });
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      this.setState({ consultandoSRI: false, Alert: { Estado: true, Tipo: 'error', Mensaje: 'Error al procesar imagen.' } });
    }
  }
   state={
    masterInsumo:false,
    Alert:{Estado:false},
    xmlData:{fechaAutorizacion:[""]},
    Errorlist:[],
    Fpago:[],
    Comprobante:"",
    loading:false,
    Vendedor:{  Nombre:this.props.state.userReducer.update.usuario.user.Usuario,
      Id:this.props.state.userReducer.update.usuario.user._id,
      Tipo:this.props.state.userReducer.update.usuario.user.Tipo, 
     },
     prevent1:false,
     validfact:false,
     waitingdata:false,
     claveAccesoInput: '',
     consultandoSRI: false,
     mostrarClavesAlternas: false
   }
  handleClaveAccesoChange = (e) => {
    this.setState({ claveAccesoInput: e.target.value });
  }

  consultarSRI = async (autoOCR = false) => {
    const claveAcceso = this.state.claveAccesoInput.trim();
    if (!claveAcceso || claveAcceso.length < 40) {
      this.setState({ Alert: { Estado: true, Tipo: 'error', Mensaje: 'Clave de acceso inválida.' } });
      return;
    }
    this.setState({ consultandoSRI: true, Alert: { Estado: false } });
    try {
      const res = await fetch('/api/sri-consulta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claveAcceso })
      });
      const data = await res.json();
      console.log('Respuesta SRI:', data);
      if (data.status === 'ok' && data.sri && data.sri.RespuestaAutorizacionComprobante) {
        // Extraer el XML del comprobante
        const autorizaciones = data.sri.RespuestaAutorizacionComprobante.autorizaciones;
        let comprobanteXML = '';
        let fechaAutorizacion = '';
        let numeroAutorizacion = '';
        if (autorizaciones && autorizaciones.autorizacion) {
          const aut = autorizaciones.autorizacion;
          comprobanteXML = aut.comprobante;
          fechaAutorizacion = aut.fechaAutorizacion;
          numeroAutorizacion = aut.numeroAutorizacion;
        }
        if (comprobanteXML) {
          // Parsear el XML igual que handleXml
          const parser = new window.DOMParser();
          const doc = parser.parseFromString(comprobanteXML, 'application/xml');
          // Usar Xml2js para convertir a objeto JS
          const parserX = new Xml2js.Parser();
          parserX.parseString(comprobanteXML, (err, result) => {
            if (err) {
              this.setState({ Alert: { Estado: true, Tipo: 'error', Mensaje: 'Error al parsear XML.' }, consultandoSRI: false });
              return;
            }
            // Buscar cualquier objeto que tenga .comprobante[0] y desglosar como en el flujo de archivo/foto
            const findComprobanteYFecha = (obj) => {
              let resultado = { comprobante: null, fechaAutorizacion: null, numeroAutorizacion: null };
              for (let key in obj) {
                if (!obj.hasOwnProperty(key)) continue;
                if (key === "comprobante" && Array.isArray(obj[key]) && obj[key].length > 0) {
                  resultado.comprobante = obj[key][0];
                }
                if (key === "fechaAutorizacion" && Array.isArray(obj[key]) && obj[key].length > 0) {
                  resultado.fechaAutorizacion = obj[key][0];
                }
                if (key === "numeroAutorizacion" && Array.isArray(obj[key]) && obj[key].length > 0) {
                  resultado.numeroAutorizacion = obj[key][0];
                }
                if (typeof obj[key] === "object") {
                  const nestedResult = findComprobanteYFecha(obj[key]);
                  if (nestedResult.comprobante) resultado.comprobante = nestedResult.comprobante;
                  if (nestedResult.fechaAutorizacion) resultado.fechaAutorizacion = nestedResult.fechaAutorizacion;
                  if (nestedResult.numeroAutorizacion) resultado.numeroAutorizacion = nestedResult.numeroAutorizacion;
                  if (resultado.comprobante && resultado.fechaAutorizacion && resultado.numeroAutorizacion) break;
                }
              }
              return resultado.comprobante || resultado.fechaAutorizacion || resultado.numeroAutorizacion ? resultado : false;
            };
            const getData = findComprobanteYFecha(result);
            if (getData && getData.comprobante && getData.fechaAutorizacion) {
              parserX.parseString(getData.comprobante, (err2, xml) => {
                if (err2) {
                  this.setState({ Alert: { Estado: true, Tipo: 'error', Mensaje: 'Error al parsear comprobante.' }, consultandoSRI: false });
                  return;
                }
                // Agrupar items y validar RUC como en flujo de archivo/foto
                if(xml.factura && xml.factura.detalles && xml.factura.detalles[0].detalle) {
                  xml.factura.detalles[0].detalle = this.agruparItemsPorCodigo(xml.factura.detalles[0].detalle);
                }
                let estructuraXml = {fechaAutorizacion:[getData.fechaAutorizacion],numeroAutorizacion:[getData.numeroAutorizacion]};
                if(xml.factura){
                  if (xml.factura.infoFactura[0].identificacionComprador[0] != this.props.state.userReducer.update.usuario.user.Factura.ruc) {
                    this.setState({ prevent1: true, preventData1: xml, preventxmlData:estructuraXml, consultandoSRI: false, clavesDetectadas: [], mostrarClavesAlternas: false, Alert: { Estado: false } });
                  } else {
                    this.setState({ xmlData: estructuraXml, Comprobante: xml, consultandoSRI: false, clavesDetectadas: [], mostrarClavesAlternas: false, Alert: { Estado: false } });
                  }
                } else if(xml.comprobanteRetencion){
                  // Si es comprobante de retención, lógica similar
                  this.setState({ xmlData: estructuraXml, Comprobante: xml, consultandoSRI: false, clavesDetectadas: [], mostrarClavesAlternas: false, Alert: { Estado: false } });
                } else {
                  // Si no es factura ni retención, solo guardar el objeto
                  this.setState({ Comprobante: xml, consultandoSRI: false, clavesDetectadas: [], mostrarClavesAlternas: false, Alert: { Estado: false } });
                }
              });
            } else {
              // Si no se encuentra comprobante anidado, verificar estructura antes de guardar
              console.log('DEBUG: No se encontró comprobante anidado, verificando estructura...');
              console.log('DEBUG: result structure:', result);
              
              // Solo asignar si result tiene la estructura esperada de factura
              if (result && result.factura && result.factura.detalles && result.factura.detalles[0] && result.factura.detalles[0].detalle) {
                // Aplicar el mismo procesamiento que se hace con XML: agrupar items por código
                result.factura.detalles[0].detalle = this.agruparItemsPorCodigo(result.factura.detalles[0].detalle);
                
                this.setState({
                  Comprobante: result,
                  xmlData: { 
                    fechaAutorizacion: [fechaAutorizacion],
                    numeroAutorizacion: [claveAcceso]  // Agregar número de autorización desde la clave
                  },
                  validfact: false,
                  waitingdata: false,
                  consultandoSRI: false,
                  clavesDetectadas: [],
                  mostrarClavesAlternas: false,
                  Alert: { Estado: false }
                });
              } else {
                console.log('DEBUG: Estructura de result no válida para renderizar');
                this.setState({
                  Alert: { Estado: true, Tipo: 'error', Mensaje: 'La estructura del comprobante no es válida.' },
                  consultandoSRI: false,
                  clavesDetectadas: [],
                  mostrarClavesAlternas: false
                });
              }
            }
          });
        } else {
          if (autoOCR) {
            // Si la consulta fue automática por OCR y no se encontró comprobante autorizado, mostrar opciones al usuario
            const claveInfo = extraerYValidarClaveSRI(claveAcceso);
            if (claveInfo && claveInfo.is_valid) {
              // Mostrar alerta personalizada con dos opciones
              const clave = claveInfo.clave_clean;
              // Usar confirm para la opción principal, y si cancela, abrir SRI
              // Mostrar modal/alerta profesional con botones personalizados y opción de copiar clave
              this.setState({
                consultandoSRI: false,
                mostrarClavesAlternas: false,
                claveDetectadaParaSRI: clave,
                Alert: {
                  Estado: true,
                  Tipo: 'info',
                  Mensaje: 'Comprobante autorizado — XML no disponible.\n\nLa clave está autorizada por el SRI, pero ya pasó el plazo de 1 mes para descargar el XML desde la app. Puede obtenerlo en su correo o directamente en el portal del SRI.'
                }
              });
  // Handler para botón SRI en el modal personalizado

  handleSRIButton = () => {
    const clave = this.state.claveDetectadaParaSRI;
    if (clave && navigator.clipboard) {
      navigator.clipboard.writeText(clave);
    }
    window.open('https://srienlinea.sri.gob.ec/comprobantes-electronicos-internet/pages/consultas/recibidos/comprobantesRecibidos.jsf?&contextoMPT=https://srienlinea.sri.gob.ec/tuportal-internet&pathMPT=Facturaci%F3n%20Electr%F3nica&actualMPT=Comprobantes%20electr%F3nicos%20recibidos%20&linkMPT=%2Fcomprobantes-electronicos-internet%2Fpages%2Fconsultas%2Frecibidos%2FcomprobantesRecibidos.jsf%3F&esFavorito=S', '_blank');
    this.setState({ Alert: { Estado: false } });
  }

  handleRegresarButton = () => {
    this.setState({ Alert: { Estado: false } });
  }

  handleCopiarClave = () => {
    const clave = this.state.claveDetectadaParaSRI;
    if (clave && navigator.clipboard) {
      navigator.clipboard.writeText(clave);
      this.setState({ Alert: { ...this.state.Alert, Mensaje: 'Clave copiada al portapapeles.' } });
    }
  }
            } else {
              this.setState({ Alert: { Estado: true, Tipo: 'error', Mensaje: 'No se encontró comprobante autorizado y la clave extraída no es válida.' }, consultandoSRI: false, mostrarClavesAlternas: true });
            }
          } else {
            this.setState({ Alert: { Estado: true, Tipo: 'error', Mensaje: 'No se encontró comprobante autorizado.' }, consultandoSRI: false });
          }
        }
      } else {
        this.setState({ Alert: { Estado: true, Tipo: 'error', Mensaje: 'No autorizado o error SRI.' }, consultandoSRI: false });
      }
    } catch (err) {
      console.error('Error consultando SRI:', err);
      this.setState({
        consultandoSRI: false,
        mostrarClavesAlternas: false,
        Alert: {
          Estado: true,
          Tipo: 'info',
          Mensaje: 'La clave está autorizada por el SRI, pero ya pasó el plazo de 1 mes para descargar el XML desde la app. Puede obtenerlo en su correo o directamente en el portal del SRI.'
        }
      });
    }
  }
   componentRef = React.createRef(); 
    componentDidMount(){
      setTimeout(function(){ 
        
        document.getElementById('mainAddFact').classList.add("entradaaddc")

       }, 500);
        
     

      
      }
      comprobadorGenCompra=( TotalValorCompra, TotalPago)=>{
        if(this.state.loading == false){
          this.setState({loading:true})
        let arrErrCant=[]
        let auth = false
      if(this.state.addFact){
      
        if(this.state.codpunto != "" && 
        this.state.codemision != "" &&
        this.state.numeroFact != "" &&
        this.state.UserSelect     
        
        
        ){
          auth = true
        }else{
          let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:"Revice los datos del distribuidor y/o factura "
        }
        this.setState({Alert: add, loading:false,})
        }
      }else{
        auth = true
      }
      
      if(auth){
        if(parseFloat(TotalValorCompra).toFixed(2) > parseFloat(TotalPago).toFixed(2)){
          let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:"Revice el pago total "
        }
        this.setState({Alert: add, loading:false,})
        }
       else if(parseFloat(TotalValorCompra).toFixed(2) < parseFloat(TotalPago).toFixed(2)){
          let add = {
            Estado:true,
            Tipo:"warning",
            Mensaje:"El pago es mayor, al valor de compra "
        }
        this.setState({Alert: add, loading:false,})
        }
        else  if(parseFloat(TotalValorCompra).toFixed(2) == parseFloat(TotalPago).toFixed(2) && parseFloat(TotalValorCompra).toFixed(2) > 0 ){
         
        
              var url = '/public/generate-factcompra';
              
              // Construir solo los datos necesarios para el servidor (no enviar todo el estado)
              let newstate = {
                Comprobante: this.state.Comprobante,
                xmlData: this.state.xmlData,
                Fpago: this.state.Fpago,
                Vendedor: this.state.Vendedor,
                Ruc: this.state.Ruc,
                numeroFact: this.state.numeroFact,
                codemision: this.state.codemision,
                codpunto: this.state.codpunto,
                usuario: this.state.usuario,
                direccion: this.state.direccion,
                proveedor: this.state.proveedor
              };
              
            let Deta = newstate.Comprobante.factura.detalles[0].detalle
              
const totalSumaItems = Deta.reduce((sum, item) => sum + item.precioFinal, 0);

let diferencia = parseFloat((totalSumaItems - parseFloat(TotalValorCompra)).toFixed(2))

if(diferencia>0){
  Deta[0].precioFinal =  Deta[0].precioFinal - diferencia
}else if(diferencia<0)
  {
  Deta[0].precioFinal =  Deta[0].precioFinal + Math.abs(diferencia)
}

              newstate.TotalValorCompra = parseFloat(TotalValorCompra).toFixed(2)
              newstate.TotalPago = parseFloat(TotalPago).toFixed(2)
              newstate.Userdata ={DBname:this.props.state.userReducer.update.usuario.user.DBname}
              newstate.fecha = this.state.xmlData.fechaAutorizacion[0]
          
             console.log('DEBUG: Datos enviados al servidor:', {
               TotalValorCompra: newstate.TotalValorCompra,
               TotalPago: newstate.TotalPago,
               fecha: newstate.fecha,
               Comprobante: newstate.Comprobante,
               xmlData: newstate.xmlData,
               xmlDataDetalle: newstate.xmlData.fechaAutorizacion,
               ComprobanteFull: newstate
             });
             
             var lol = JSON.stringify(newstate)
             fetch(url, {
              method: 'POST', // or 'PUT'
              body: lol, // data can be `string` or {object}!
              headers:{
                'Content-Type': 'application/json',
                "x-access-token": this.props.state.userReducer.update.usuario.token
              }
            }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
              console.log('Response addfact:', response)
              if(response.status=="Error"){
                // Convertir response.message a string si es un objeto
                let mensaje = "";
                if (typeof response.message === 'object' && response.message !== null) {
                  // Si es un objeto, intentar extraer información útil o usar JSON.stringify
                  if (response.message.error) {
                    mensaje = response.message.error;
                  } else if (Object.keys(response.message).length === 0) {
                    mensaje = "Error al procesar la factura";
                  } else {
                    mensaje = JSON.stringify(response.message);
                  }
                } else {
                  mensaje = response.message || "Error desconocido";
                }
                
                let add = {
                  Estado:true,
                  Tipo:"error",
                  Mensaje: mensaje
              }
              this.setState({Alert: add, loading:false}) 
            } else if(response.message=="Factura ya ingresada"){
              let add = {
                Estado:true,
                Tipo:"error",
                Mensaje:"Factura ya ingresada"
            }
            this.setState({Alert: add, loading:false}) 
          }
          else if(response.message=="Diid Repetido"){
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje: `Codigo del Distribuidor Repetido. Item encontrado:${response.art.Eqid}  `
          }
          this.setState({Alert: add, loading:false}) 
        }
            
            else {
                let add = {
                 Estado:true,
                 Tipo:"success",
                 Mensaje:"Factura Ingresada"
             }

             this.setState({Alert: add})


this.props.dispatch(addRegs(response.Registros))
this.props.dispatch(addCompra(response.Compra[0]))
this.props.dispatch(updateCuentas(response.Cuentas))

if(response.articulosCreados.length > 0)
  {
  response.articulosCreados.forEach(x=>{
       this.props.dispatch(addArt(x)) })
 }
       

 if(response.articulosActualizados.length > 0)
  {
    this.props.dispatch(updateArts(response.articulosActualizados))
 }
             this.Onsalida()
      
         }
            })
           
        }
        else{
          let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:"Revise el valor de Compra y el valor de Pago "
        }
        this.setState({Alert: add, loading:false})
        }
      }
      
      }else{
       
      }
      }
      Onsalida=()=>{
        document.getElementById('mainAddFact').classList.remove("entradaaddc")
        setTimeout(()=>{ 
          this.props.Flecharetro()
        }, 500);
      }
      
      handleXml=(e)=>{
        
        let reader = new FileReader();
        reader.onload = function(e) {
          readXml=e.target.result;
        
          var parser = new DOMParser();
          var doc = parser.parseFromString(readXml, "application/xml");
         
      }
      }
      valFact=(e)=>{
       
             
        this.setState({waitingdata:true})
        fetch("/public/validate-compra-fact", {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(this.state.Comprobante), // data can be `string` or {object}!
          headers:{
            'Content-Type': 'application/json',
            "x-access-token": this.props.state.userReducer.update.usuario.token
          }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
          console.log(response)
          if(response.status=="error"){
            let add = {
              Estado:true,
              Tipo:"error",
              Mensaje:"Error en validar la factura"
          }
          this.setState({Alert: add, waitingdata:false,validfact:false}) 
          }
          else if(response.status=="ok"){
            let add = {
              Estado:true,
              Tipo:"success",
              Mensaje:"Factura validada"
          }
          this.setState({validfact: true,  Alert: add,}) 
          }
        })

      }
       agruparItemsPorCodigo(data) {
        console.log(data)
  const agrupados = {};

  data.forEach(item => {
    const codigo = item.codigoPrincipal[0];
    const cantidad = parseFloat(item.cantidad[0]);
    const PrecioTotal = parseFloat(item.precioTotalSinImpuesto[0]);

    if (agrupados[codigo]) {
      // Sumar cantidades si ya existe el código
      agrupados[codigo].cantidad += cantidad;
      agrupados[codigo].precioTotalSinImpuesto += PrecioTotal;
    } else {
      // Crear nueva entrada, manteniendo la estructura original
      agrupados[codigo] = {
        ...item,
        cantidad: cantidad,
        precioTotalSinImpuesto:PrecioTotal  // convertimos a número
      };
    }
  });

  // Convertir las cantidades nuevamente a string con 6 decimales, si quieres mantener ese formato
  return Object.values(agrupados).map(item => ({
    ...item,
    cantidad: [item.cantidad.toFixed(6)],
    precioTotalSinImpuesto: [item.precioTotalSinImpuesto.toFixed(6)],
  }));
}

      
      setChangeinput=(e)=>{
        this.setState({xmlData:{fechaAutorizacion:[""]},  Comprobante:"",})
        let selectedFile = this.componentRef.current.files[0];
        console.log(selectedFile)
        if(selectedFile.type=="text/xml")  {
        let readXml=null;

        let reader = new FileReader();
        reader.onload =  (e) => {
            readXml=e.target.result;
                  
            let parserX = new Xml2js.Parser();
            function validarFecha(fecha) {
              const date = new Date(fecha);
              return !isNaN(date.getTime()); // Verifica si la fecha es válida
          }
            const findComprobanteYFecha = (obj) => {
              if (typeof obj !== 'object' || obj === null) return false;
          
              let resultado = {
                  comprobante: null,
                  fechaAutorizacion: null,
                  numeroAutorizacion: null
              };
          
              for (const key in obj) {
             
                  if (key === "comprobante" && Array.isArray(obj[key]) && obj[key].length > 0) {
                      resultado.comprobante = obj[key][0]; // Toma el primer comprobante
                  }
                  if (key === "numeroAutorizacion" && Array.isArray(obj[key]) && obj[key].length > 0) {

                    resultado.numeroAutorizacion = obj[key][0]; // Toma el primer comprobante
                }
          
                  if (key === "fechaAutorizacion" && Array.isArray(obj[key]) && obj[key].length > 0) {
                    let fecha = obj[key][0]; // Tomar el primer elemento del array
                    
                    if (typeof fecha === "string" && validarFecha(fecha)) {
                      resultado.fechaAutorizacion = fecha;
                  }
                  
                 
                  }
          
                  // Si encontró ambos valores, detiene la búsqueda
                  if (resultado.comprobante && resultado.fechaAutorizacion && resultado.numeroAutorizacion) {
                    
                    return resultado;
                  }
          
                  // Si el valor es un objeto o array, busca recursivamente dentro
                  if (typeof obj[key] === 'object' && obj[key] !== null) {
                      const nestedResult = findComprobanteYFecha(obj[key]);
                      if (nestedResult.comprobante) resultado.comprobante = nestedResult.comprobante;
                      if (nestedResult.fechaAutorizacion) resultado.fechaAutorizacion = nestedResult.fechaAutorizacion;
                      if (nestedResult.numeroAutorizacion) resultado.numeroAutorizacion = nestedResult.numeroAutorizacion;
                      // Si encontró ambos valores en la recursión, retorna inmediatamente
                      if (resultado.comprobante && resultado.fechaAutorizacion&& resultado.numeroAutorizacion) {
                          return resultado;
                      }
                  }
              }
          
              // Retorna el resultado, ya sea con valores encontrados o con `null`
              return resultado.comprobante || resultado.fechaAutorizacion|| resultado.numeroAutorizacion ? resultado : false;
          };
            
            // Parseando el XML
            parserX.parseString(readXml, (err, result) => {
              if (err) {
                console.error('Error al parsear XML:', err);
                return;
              }
            
              // Buscar cualquier objeto que tenga .comprobante[0]
              const getData = findComprobanteYFecha(result);
          
            if (getData && getData.comprobante && getData.fechaAutorizacion) {
                parserX.parseString(getData.comprobante, (err, xml) => {
                  if (err) {
                    console.error('Error al parsear comprobante:', err);
                    return;
                  }
                  console.log(xml)

                  xml.factura.detalles[0].detalle = this.agruparItemsPorCodigo(xml.factura.detalles[0].detalle)
     // Verificación del RUC del comprador
     let estructuraXml = {fechaAutorizacion:[getData.fechaAutorizacion],numeroAutorizacion:[getData.numeroAutorizacion]}
if(xml.factura){
     if (xml.factura.infoFactura[0].identificacionComprador[0] != this.props.state.userReducer.update.usuario.user.Factura.ruc) {
       this.setState({ prevent1: true, preventData1: xml, preventxmlData:estructuraXml  });
     } else {
       this.setState({ xmlData: estructuraXml, Comprobante: xml });
     }
     }else if(xml.comprobanteRetencion){
         let add = {
                  Estado: true,
                  Tipo: "warning",
                  Mensaje: "Archivo .XML incompatible, es un COMPROBANTE DE RETENCION"
                };
                this.setState({ Alert: add });
     }else{
         let add = {
                  Estado: true,
                  Tipo: "error",
                  Mensaje: "Archivo .XML incompatible"
                };
                this.setState({ Alert: add });
     }
                });
              } 
              else if(result.factura){
const fechaStr  = result.factura.infoFactura[0].fechaEmision[0]; // 

const momentFecha = moment(fechaStr, "DD/MM/YYYY", true);

// ✔️ Obtener un objeto `Date`
const fechaDate = momentFecha.toDate();



let estructuraXml = {fechaAutorizacion:[fechaDate],numeroAutorizacion:["Revisar"]}
if(result.factura){
     if (result.factura.infoFactura[0].identificacionComprador[0] != this.props.state.userReducer.update.usuario.user.Factura.ruc) {
       this.setState({ prevent1: true, preventData1: result, preventxmlData:estructuraXml  });
     } else {
       this.setState({ xmlData: estructuraXml, Comprobante: result });
     }
     }

              }
              
              else {
                // Si no encuentra comprobante, muestra un mensaje de error
                let add = {
                  Estado: true,
                  Tipo: "error",
                  Mensaje: "Archivo .XML incompatible, enviar el archivo al soporte tecnico para agregar compatibilidad"
                };
                this.setState({ Alert: add });
              }
            });
            
        }
        reader.readAsText(selectedFile);
      }else{
          let add = {
            Estado:true,
            Tipo:"error",
            Mensaje:"Solo son validos los archivos .xml"
        }
        this.setState({Alert: add}) 
        }
      }

      sendErrace=(data)=>{
        let itemfind =  this.state.Comprobante.factura.detalles[0].detalle.filter(x=>x.codigoPrincipal[0] === data.item.codigoPrincipal[0])  
        let indexset = this.state.Comprobante.factura.detalles[0].detalle.indexOf(itemfind[0])
        let deepClone = JSON.parse(JSON.stringify(this.state.Comprobante));
     
        deepClone.factura.detalles[0].detalle[indexset].itemSelected = null 
        this.setState({Comprobante:deepClone})
      }

    sendSwich2=(data)=>{
     

      let valinsumo = data.insumo? true:null
      let valiva = data.iva? true:null

      let itemfind =  this.state.Comprobante.factura.detalles[0].detalle.filter(x=>x.codigoPrincipal[0] === data.item.codigoPrincipal[0])  
      console.log(itemfind)
      
      let indexset = this.state.Comprobante.factura.detalles[0].detalle.indexOf(itemfind[0])
      console.log(indexset)
      let deepClone = JSON.parse(JSON.stringify(this.state.Comprobante));
   
      deepClone.factura.detalles[0].detalle[indexset].insumo = valinsumo 
      deepClone.factura.detalles[0].detalle[indexset].iva = valiva 
      deepClone.factura.detalles[0].detalle[indexset].categoria = data.catSelect
      deepClone.factura.detalles[0].detalle[indexset].subcategoria = data.subCatSelect
      deepClone.factura.detalles[0].detalle[indexset].precioFinal = parseFloat(data.precioFinal)
      deepClone.factura.detalles[0].detalle[indexset].itemSelected = data.itemSelected
      this.setState({Comprobante:deepClone})
    
    }

    sendSwich = (data) => {
    
    
      this.setState((prevState) => {
        let deepClone = JSON.parse(JSON.stringify(prevState.Comprobante));
    
        // Buscar el item en la lista
        deepClone.factura.detalles[0].detalle = deepClone.factura.detalles[0].detalle.map((item) => {
          if (item.codigoPrincipal[0] === data.item.codigoPrincipal[0]) {
            return {
              ...item,
              insumo: data.insumo ? true : null,
              iva: data.iva ? true : null,
              categoria: data.catSelect,
              subcategoria: data.subCatSelect,
              precioFinal: parseFloat(data.precioFinal),
              itemSelected: data.itemSelected,
              Barcode:data.Barcode,
              descripcion:[data.tituloArts],
              precioVenta:parseFloat(data.precioVenta)
            };
          }
          return item;
        });
    
        return { Comprobante: deepClone };
      });
    };


    sendItem=(data)=>{
     
    console.log(data)
      setTimeout(()=>{
        let itemfind =  this.state.Comprobante.factura.detalles[0].detalle.filter(x=>x.codigoPrincipal[0] == data.item.codigoPrincipal[0])  
        let indexset = this.state.Comprobante.factura.detalles[0].detalle.indexOf(itemfind[0])
        let deepClone = JSON.parse(JSON.stringify(this.state.Comprobante));
        deepClone.factura.detalles[0].detalle[indexset].itemSelected = data.itemselect
      
          this.setState({Comprobante:deepClone})
      },300)
 

    }

    setName=(data)=>{

      console.log(data)
      let itemfind =  this.state.Comprobante.factura.detalles[0].detalle.filter(x=>x.codigoPrincipal[0] == data.item.codigoPrincipal[0])  
      let indexset = this.state.Comprobante.factura.detalles[0].detalle.indexOf(itemfind[0])
      let deepClone = JSON.parse(JSON.stringify(this.state.Comprobante));
  
      deepClone.factura.detalles[0].detalle[indexset].descripcion[0] = data.tituloArts
      this.setState({Comprobante:deepClone})
    }

    SetExp=(data)=>{
     
      let itemfind =  this.state.Comprobante.factura.detalles[0].detalle.filter(x=>x.codigoPrincipal[0] == data.item.codigoPrincipal[0])  
      let indexset = this.state.Comprobante.factura.detalles[0].detalle.indexOf(itemfind[0])
      let deepClone = JSON.parse(JSON.stringify(this.state.Comprobante));
      deepClone.factura.detalles[0].detalle[indexset].Caduca = {}
      deepClone.factura.detalles[0].detalle[indexset].Caduca.Estado = true  
      deepClone.factura.detalles[0].detalle[indexset].Caduca.FechaCaducidad = data.value 
        this.setState({Comprobante:deepClone})
      
    }
    setHeperdata=(e)=>{
     
      this.setState(e)
    }

    render () {
    console.log(this.state)
      let now  = new Date()
      if(this.state.xmlData !== ""){
       now = new Date(this.state.xmlData.fechaAutorizacion[0])
       
      }
 
     

      let año = now.getFullYear()
      let dia = now.getDate()
      let mes = now.getMonth() + 1
      
      let fecha =  `${AddCero(dia)} / ${AddCero(mes)} / ${año} ` 
      
      let TotalPago = 0
      if(this.state.Fpago.length > 0){


        for(let i = 0; i<this.state.Fpago.length;i++){
        
          TotalPago += parseFloat(this.state.Fpago[i].Cantidad)
        }
        
        
    }
      
let TotalValorCompra = 0
      const handleClose = (event, reason) => {
        let AleEstado = this.state.Alert
        AleEstado.Estado = false
        this.setState({Alert:AleEstado})
       
      }
      const Alert=(props)=> {
        // Modal profesional para el caso de clave detectada pero sin XML o patrón diferente
        if (this.state.Alert && this.state.Alert.Estado && this.state.Alert.Tipo === 'info') {
          return ReactDOM.createPortal(
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.25)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              overflowY: 'auto',
            }}>
              <div style={{
                background: '#fff',
                borderRadius: 16,
                padding: '32px 24px',
                maxWidth: 480,
                width: '100%',
                minWidth: 260,
                boxShadow: '0 4px 32px #0003',
                textAlign: 'center',
                margin: '0 auto',
                position: 'relative',
                top: 0,
                left: 0,
                transform: 'none',
              }}>
                <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 14 }}>Comprobante autorizado — XML no disponible</div>
                <div style={{ marginBottom: 18 }}>
                  La clave está autorizada por el SRI, pero ya pasó el plazo de 1 mes para descargar el XML desde la app. Puede obtenerlo en su correo o directamente en el portal del SRI.
                </div>
                {this.state.claveDetectadaParaSRI && (
                  <div style={{ fontFamily: 'monospace', fontSize: 17, background: '#f5f5f5', padding: '10px 14px', borderRadius: 7, marginBottom: 18, wordBreak: 'break-all' }}>{this.state.claveDetectadaParaSRI}</div>
                )}
                <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {this.state.claveDetectadaParaSRI && (
                    <button onClick={() => {
                      if (this.state.claveDetectadaParaSRI && navigator.clipboard) {
                        navigator.clipboard.writeText(this.state.claveDetectadaParaSRI);
                        this.setState({ Alert: { ...this.state.Alert, Mensaje: 'Clave copiada al portapapeles.' } });
                      }
                    }} style={{ padding: '8px 20px', borderRadius: 7, border: '1.5px solid #1976d2', background: '#1976d2', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: 15 }}>Copiar clave</button>
                  )}
                  <button onClick={() => {
                    if (this.state.claveDetectadaParaSRI && navigator.clipboard) {
                      navigator.clipboard.writeText(this.state.claveDetectadaParaSRI);
                    }
                    window.open('https://srienlinea.sri.gob.ec/comprobantes-electronicos-internet/pages/consultas/recibidos/comprobantesRecibidos.jsf?&contextoMPT=https://srienlinea.sri.gob.ec/tuportal-internet&pathMPT=Facturaci%F3n%20Electr%F3nica&actualMPT=Comprobantes%20electr%F3nicos%20recibidos%20&linkMPT=%2Fcomprobantes-electronicos-internet%2Fpages%2Fconsultas%2Frecibidos%2FcomprobantesRecibidos.jsf%3F&esFavorito=S', '_blank');
                  }} style={{ padding: '8px 20px', borderRadius: 7, border: '1.5px solid #388e3c', background: '#388e3c', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: 15 }}>Ir al SRI</button>
                  <button onClick={() => {
                    // Volver: cerrar modal y restaurar estado anterior
                    this.setState({ Alert: { Estado: false } });
                  }} style={{ padding: '8px 20px', borderRadius: 7, border: '1.5px solid #888', background: '#fff', color: '#333', fontWeight: 'bold', cursor: 'pointer', fontSize: 15 }}>Volver</button>
                </div>
              </div>
            </div>,
            document.body
          );
        }
        // ...modal normal para otros casos...
        return <MuiAlert elevation={6} variant="filled" {...props} />;
      }
      let listaCompra =""
      let dataFact =""
      if(this.state.Comprobante !=""){
       
          listaCompra = this.state.Comprobante.factura.detalles[0].detalle.map((item, i)=>{
            return(<ListCompraFact 
              index={i} 
              key={item.codigoPrincipal[0]} 
              Errorlist={this.state.Errorlist} 
              datos={item}
              sendSwich={this.sendSwich}

              sendErrace={this.sendErrace}
              sendExp={(e)=>{this.SetExp(e)}} 
              sendItem={this.sendItem}
              sendNombre={this.setName}
              sendMasterInsumo={this.state.masterInsumo}
              />
           )
          })

        TotalValorCompra = this.state.Comprobante.factura.infoFactura[0].importeTotal[0]
        dataFact= this.state.Comprobante.factura
      }
        return ( 
<>
<div className="maincontactoFact" id="mainAddFact" >
<div className="contcontactoFact"  >
<div className="headercontact">
    <img src="/static/flecharetro.png" alt="" className="flecharetro" 
    onClick={  this.Onsalida       }
           />
  <div className="tituloventa">
    
Agregar Factura

</div>



</div> 

{/* Mostrar secciones de carga solo cuando NO hay datos */}
{this.state.xmlData.fechaAutorizacion[0] === "" && (
<>
<div className="Contxml">

{/* Sección 1: Método XML directo */}
<div style={{background:'#f8f9fa', padding:'16px', borderRadius:'8px', marginBottom:'16px', border:'1px solid #e9ecef'}}>
  <h4 style={{margin:'0 0 12px 0', fontSize:'14px', color:'#495057', fontWeight:'600'}}>📄 Subir archivo XML</h4>
  <div style={{display:'flex', justifyContent:'center'}}>
    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
      <input
        ref={this.componentRef}
        type="file"
        id="myXMLfile"
        name="myXMLfile"
        accept=".xml,text/xml,application/xml"
        style={{ display: 'none' }}
        onChange={this.setChangeinput}
      />
      <IconButton
        color="primary"
        aria-label="Seleccionar archivo XML"
        component="span"
        onClick={() => document.getElementById('myXMLfile').click()}
        style={{ background:'#fff', border:'2px solid #1976d2', borderRadius:8, boxShadow:'0 1px 4px #0001', width:48, height:48, marginBottom:2 }}
        title="Seleccionar archivo XML"
      >
        <DescriptionIcon style={{ fontSize:32, color:'#ff9800' }} />
      </IconButton>
      <span style={{fontSize:13, color:'#ff9800', fontWeight:700, marginTop:2, letterSpacing:1}}>xml</span>
    </div>
  </div>
</div>

{/* Sección 2: Métodos SRI (foto + código + campo + botón) */}
<div style={{background:'#f0f8ff', padding:'16px', borderRadius:'8px', marginBottom:'16px', border:'1px solid #cce7ff'}}>
  <h4 style={{margin:'0 0 12px 0', fontSize:'14px', color:'#1976d2', fontWeight:'600'}}>🔍 Consulta SRI por clave de acceso</h4>
  
  {/* Métodos para obtener clave */}
  <div style={{marginBottom:'12px'}}>
    <p style={{fontSize:'12px', color:'#666', margin:'0 0 8px 0', textAlign:'center'}}>Métodos para obtener clave automáticamente:</p>
    <div style={{display:'flex', justifyContent:'center', gap:'24px'}}>
      {/* Foto de factura */}
      <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        <input
          type="file"
          id="fotoFacturaInput"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={this.handleFotoFactura}
        />
        <IconButton
          color="primary"
          aria-label="Tomar foto de factura"
          component="span"
          onClick={() => document.getElementById('fotoFacturaInput').click()}
          style={{ background:'#fff', border:'2px solid #1976d2', borderRadius:8, boxShadow:'0 1px 4px #0001', width:48, height:48, marginBottom:2, position:'relative' }}
          title="Tomar foto de factura para detectar clave de acceso automáticamente"
        >
          <CameraAltIcon style={{ fontSize:32 }} />
          <span style={{
            position: 'absolute',
            top: -6,
            right: -6,
            background: '#ff5722',
            color: 'white',
            fontSize: 8,
            fontWeight: 'bold',
            padding: '1px 4px',
            borderRadius: 3,
            lineHeight: 1
          }}>
            BETA
          </span>
        </IconButton>
        <span style={{fontSize:11, color:'#1976d2', fontWeight:500, marginTop:2, textAlign:'center', lineHeight:1.2, maxWidth:80, wordWrap:'break-word'}}>Foto factura</span>
      </div>
      
      {/* Código de barras */}
      <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        <IconButton
          color="primary"
          aria-label="Escanear código de barras"
          component="span"
          onClick={()=>this.setState({showBarcodeDirect:true})}
          style={{ background:'#fff', border:'2px solid #1976d2', borderRadius:8, boxShadow:'0 1px 4px #0001', width:48, height:48, marginBottom:2 }}
          title="Escanear código de barras"
        >
          <CropFreeIcon style={{ fontSize:32 }} />
        </IconButton>
        <span style={{fontSize:11, color:'#1976d2', fontWeight:500, marginTop:2, textAlign:'center'}}>Código barras</span>
        {this.state.showBarcodeDirect && (
          <BarcodeCameraDirectReader
            onDetected={clave => {
              if (clave && clave.length >= 44 && clave.length <= 49) {
                this.setState({ claveAccesoInput: clave, showBarcodeDirect: false });
                alert('Código de barras leído correctamente.');
              } else {
                this.setState({ showBarcodeDirect: false });
                alert('No se detectó un código de barras válido (44-49 dígitos).');
              }
            }}
            onClose={()=>this.setState({showBarcodeDirect:false})}
          />
        )}
      </div>
    </div>
  </div>

  {/* Campo de clave de acceso y botón consultar */}
  <div>
    <label htmlFor="claveAccesoInput" style={{marginTop:8,display:'block', fontSize:'13px', fontWeight:'500'}}>O ingresa la clave manualmente:</label>
    <div style={{display:'flex',alignItems:'center',gap:8,marginTop:8}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:8, flex:1}}>
        <textarea
          id="claveAccesoInput"
          name="claveAccesoInput"
          value={(() => {
            // Divide la clave en bloques de 8
            const clave = this.state.claveAccesoInput;
            let bloques = [];
            for (let i = 0; i < clave.length; i += 16) {
              let bloque1 = clave.substr(i, 8);
              let bloque2 = clave.substr(i + 8, 8);
              // Rellenar con espacios para alinear si es necesario
              if (bloque1.length < 8) bloque1 = bloque1.padEnd(8, ' ');
              if (bloque2.length < 8) bloque2 = bloque2.padEnd(8, ' ');
              bloques.push(`${bloque1}  ${bloque2}`);
            }
            return bloques.join('\n').trim();
          })()}
          onChange={e => {
            // Eliminar todo lo que no sea dígito y actualizar el estado sin saltos de línea
            const val = e.target.value.replace(/\D/g, '').slice(0,49);
            this.setState({ claveAccesoInput: val });
          }}
          placeholder="Clave de acceso (49 dígitos)"
          style={{ width: '100%', minHeight: 44, maxHeight: 90, padding: 8, fontSize:16, letterSpacing:2, fontFamily:'monospace', border:'2px solid #1976d2', borderRadius:4, resize:'vertical', lineHeight: '1.8', overflowY:'auto' }}
          maxLength={61}
          autoComplete="off"
          rows={2}
        />
      </div>
      <button
        type="button"
        className="botoncontact botoupload"
        onClick={this.consultarSRI}
        disabled={this.state.consultandoSRI}
        style={{ minWidth:120 }}
      >
        {this.state.consultandoSRI ? 'Consultando...' : 'Consultar SRI'}
      </button>
    </div>
  </div>
</div>

</div>
</>
)}

                    <div style={{width:"100%"}}> 
         <Animate  show={this.state.xmlData.fechaAutorizacion[0] != ""}>        
<div className="Scrolled">

<div className="fecha">
  Fecha: {fecha}
  </div>
  {/*  <div className="contValfact">
             
             
      <Animate show={!this.state.validfact}>
        <div className="ContFlex">
        <Animate show={!this.state.waitingdata}>
      <button className="botoncontact botoupload" onClick={this.valFact}>
                        Validar Factura
        </button>  
        </Animate>
                       
                       <Animate show={this.state.waitingdata}>
                       <CircularProgress />
                       </Animate>
     <div className='contVerified'>

      <span className="material-icons">
      error
      </span>
     
      <span>  Factura no validada</span>
     </div>
     </div>
      </Animate>
               
      <Animate show={this.state.validfact}>
      <div className="ContFlex">
     <div className='contVerified'>
     <span className="material-icons">
done
</span>
      <span> Factura Verificada</span>
     </div>
     </div>
      </Animate>       
                       </div>  */}



                    <Animate show={this.state.Comprobante != ""}>
                          
                    <div className="contAgregadorCompras">
                       <DoubleScrollbar>
      <div className="contTitulosaddFact ">
                  
                        <div className="Articid">
                          ID
                        </div>  <div className="Articid">
                          DISTRI-ID
                        </div>
                        <div className="Artic100FpagoName">
                           Nombre
                        </div>
                        <div className="Artic100Fpago ">
                            Medida
                        </div>
                        <div className="Artic100Fpago ">
                            Cantidad
                        </div>
                        <div className="Artic100Fpago ">
                            P.Individual
                        </div>
                         <div className="Artic100Fpago ">
                            Descuento
                        </div>
                        <div className="Artic100Fpago ">
                            P.Total
                        </div>
                        <div className="Artic100Fpago ">
                            P.Venta
                        </div>
                        <div className="Artic100Fpago masterInsumo" onClick={()=>{this.setState({masterInsumo:!this.state.masterInsumo})}}>
                  
                            Insumo
                        </div>
                        <div className="Artic100Fpago ">
                            IVA
                        </div>
                        {/*<div className="Artic100Fpago ">
                            Caduca
                        </div>*/}
                        <div className="Artic100Fpago ">
                            Categoria
                        </div>
                         <div className="Artic100Fpago ">
                            Codigo Barras
                        </div>
                        <div className="accClass ">
                            Item
                        </div>
                        <div className="Artic100Fpago ">
                            Selec
                        </div>
                      
                        </div>
                        <div className="maincontDetallesFact">
                        
                         { listaCompra}
                         
                        </div>
                      
            </DoubleScrollbar>             
      </div>
      <div className="contAddCompra">
                        <div className="grupoDatos totalcont">
                    <div className="">
              <p style={{fontWeight:"bolder"}} className='subtituloArt marginb'>  Total: </p>
                     </div>
              <div className={` inputDes `}>
                <p className="totalp">${parseFloat(TotalValorCompra).toFixed(2)}</p>
            
              </div>
                    </div></div>
      <HelperFormapagoPredit 
      setuserData={(e)=>{this.setState(e)}}
        preData={dataFact}
        valorSugerido={parseFloat(TotalValorCompra).toFixed(2)}
        
        onChange={this.setHeperdata}/>
     
      
      <Animate show={this.state.loading}>
      <CircularProgress />
      </Animate>
      <Animate show={!this.state.loading}>
      <div className="contBotonPago">
                    <button style={{width:"50%",maxWidth:"200px"}} className={` btn btn-success botonedit2 `} onClick={()=>{this.comprobadorGenCompra( TotalValorCompra, TotalPago)}}>
<p>Comprar</p>
<i className="material-icons">
add
</i>

</button>
</div>
</Animate>
                    
     
      </Animate>
    
</div>
</Animate>   

                    </div>   




        <Animate show={this.state.prevent1}>
<Prevent 
Mensaje={"Su RUC no coincide con el RUC del comprador de la factura. ¿Desea continuar?"}
Flecharetro={()=>{this.setState({prevent1:false})}}
SendAceptar={()=>{   this.setState({xmlData:this.state.preventxmlData, Comprobante:this.state.preventData1})}}
/>
        </Animate> 
        <Snackbar open={this.state.Alert.Estado} autoHideDuration={20000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={this.state.Alert.Tipo}>
        <p style={{textAlign:"center"}}> 
          {typeof this.state.Alert.Mensaje === 'string' 
            ? this.state.Alert.Mensaje 
            : typeof this.state.Alert.Mensaje === 'object' 
              ? JSON.stringify(this.state.Alert.Mensaje) 
              : String(this.state.Alert.Mensaje)
          } 
        </p>
    
    </Alert>
  </Snackbar>
</div>
</div>
        <style jsx >{`
        botonedit2{
          width: 50%;  
          min-width:200px;
          max-width:225px;
        }
        .contVerified{
          display: flex;
          align-items: center;
      
          margin-left: 20px;
          text-align: center;
        }
           .contBotonPago{
            margin-top:20px;
            display: flex;
    justify-content: center;
    flex-flow:column;
    align-items: center;
        }
        .maincontDetallesFact{
          
            margin-top: 10px;
          
            padding-top: 10px;   
            opacity:1;
            transition:1s;
            width: fit-content;
          
        }
        p{
          margin: 0px;
        }
         .totalcont{
          display: flex;
          background: #ffc903;
          align-items: center;
          border-radius: 12px;
          padding: 5px;
          border-bottom: 5px solid black;
          margin: 10px;
          max-width: 600px;
          width: 100%;
          height: 35px;
        }
       .Contxml{
        display: flex;
    justify-content: space-around;
    align-items: center;
    border: 1px solid black;
    padding: 10px;
    border-radius: 15px;
    margin-bottom: 16px;
    flex-wrap: wrap;
    width: 90%;
       }
      .botoncontact {
        margin-top:10px;
        height: 100%;
        margin-left: 15px;
        font-size: 15px;
        padding: 0 16px;
        border-radius: 10px;
        background-color: #0267ffeb;
        box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
        color: white;
        transition: background-color 15ms linear, box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
        line-height: 2.25rem;
        font-family: Roboto, sans-serif;
        font-weight: 500;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        border: none;
        transition: 0.5s;
    }
    .botoupload {
      text-transform: none;
      /* padding: 15px; */
      border-radius: 50px;
      box-shadow: 6px 1px 9px black;
      border: 1px solid black;
      /* width: 101px; */
      height: 37px;
  }
           .maincontactoFact{
            z-index: 1298;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.7);
            left: -100%;
            position: fixed;
            top: 0px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition:0.5s;
            
            }
.contValfact{
  display:flex;
  margin-bottom: 34px;
  justify-content: space-around;
  width: 100%;

  max-width: 360px;
  justify-content: center;
  align-items: center;
}
.ContFlex{
  display:flex;
}
            .contcontactoFact{
              border-radius: 30px;
              
              width: 90%;
              background-color: white;
              display: flex;
              flex-flow: column;
              justify-content: space-around;
              align-items: center;
              
              }
              .flecharetro{
                height: 40px;
                width: 40px;
                padding: 5px;
              }
              .entradaaddc{
                left: 0%;
                }

                .headercontact {

                  display:flex;
                  justify-content: space-around;
                  width: 80%;
                  }
                  .tituloventa{
                    display: flex;
                    align-items: center;
                    font-size: 30px;
                    font-weight: bolder;
                    text-align: center;
                    justify-content: center;
                    }
                    .tituloventa p{
                    margin-top:5px;
                    margin-bottom:5px
                    }
                    .Scrolled{
 
                      overflow-y: scroll;
                      width: 98%;
                      display: flex;
                      flex-flow: column;
                     
                      height: 67vh;
                      padding: 5px;
                     
                     }
                     
   .contTitulosaddFact{
    display:flex;
   margin-top: 10px;
    font-size: 15px;
    font-weight: bolder;  
  
  
}
.contAgregadorCompras{
  display:flex;
  flex-flow: column;
  overflow-x: scroll;
}
}
.accClass{
  width: 10%;  
  min-width:50px;
  max-width:60px;
  align-items: center;
  text-align:center;
}
.Articid{
  width: 10%;  
  min-width:100px;
  max-width:120px;
  align-items: center;
  text-align:center;
  word-break: break-all;

}
   .Artic100Fpago{
    width: 18%;  
    min-width:100px;
    max-width:125px;
    align-items: center;
    text-align:center;
}
.Artic100FpagoName{
  width: 25%;  
  min-width:200px;
  max-width:225px;
  align-items: center;
  text-align:center;

}
  .masterInsumo{
  border-radius: 12px;
    padding: 1px;
    background: #c5def8;
    cursor: pointer;
    border-bottom: 2px solid black;}

.totalp{
  text-align: center;
  font-size: 25px;
  font-weight: bolder;
  margin-bottom: 0px;
  margin-left: 21px;
}  

            .fecha{
              font-size: 20px;
 
            }      

            @media only screen and (min-width: 1440px) {  

             
              .maincontDetallesFact{
                width: 100%;  
              }
            }

           `}</style>
</>
        )
    }
}

const mapStateToProps = state=>  {
   
  return {
      state
  }
};

export default connect(mapStateToProps, null)(Contacto);