const Router= require('express');
const {getTypes} = require('../controllers/TypeControllers.js');
const router=Router();


router.get('',getTypes);




module.exports=router;