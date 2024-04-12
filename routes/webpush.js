const {Router} = require("express");
const router = Router();

const webpush = require('./../web-push/web-push')
let pushSub
router.post("/subcripcion", async (req,res)=>{
console.log(req.body);
pushSub = req.body
    res.status(200).json({"si":"si"});

})

router.post("/notificacion", async(req,res)=>{
    const payload = JSON.stringify({
        title:"my custom",
        message:"hello"
    })
     
    
    try{
      await  webpush.sendNotification(pushSub,payload)
      res.status(200).json({"notificacion":"si"});
    }
    catch(e){
        console.log(e)
    }
    })



module.exports = router