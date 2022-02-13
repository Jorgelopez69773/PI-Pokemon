const Router=require('express');
const {getPokemons}= require('../controllers/PokemonsControllers.js');
const router=Router();

router.get('',getPokemons);



module.exports=router;