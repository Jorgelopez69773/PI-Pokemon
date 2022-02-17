const axios= require('axios');
const {Type}= require('../db');

async function LoadTypes(req,res,next){
    try{
    let url='https://pokeapi.co/api/v2/type';
    let types=(await  axios.get(url)).data.results;
    types=types.map(type=>{return {name:type.name}});
    types= await Promise.all(types.map(type=>{Type.findOrCreate({where:type})}));
    console.log('Tipo de Pokemons cargados con exito');
    } catch(error){
        console.log(error);
    }
}

async function getTypes(req,res,next){
    try{
        let result=await Type.findAll();
        res.json(result);
    }catch(error){
        next(error)
    }
}



module.exports={LoadTypes,getTypes};