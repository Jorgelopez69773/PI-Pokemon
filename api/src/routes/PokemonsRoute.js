const Router=require('express');
const {getPokemons,getPokemon,postPokemon}= require('../controllers/PokemonsControllers.js');
const router=Router();

router.get('',getPokemons);
router.post('',postPokemon);
router.get('/:id',getPokemon);




module.exports=router;