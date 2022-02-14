const axios= require('axios');
const {Pokemon,Type}= require ('../db');



async function getPokemons(req,res,next){
    try{
        let {name}=req.query;

        let getPokemon=async(name)=>{
            let url=`https://pokeapi.co/api/v2/pokemon/${name}`;
            let result=(await axios.get(url)).data;

            let types=result.types.map(type=>type.type.name);


            result={
                id:result.id,
                name:result.name,
                type:types,
                image:result.sprites.other.dream_world.front_default,
                hp:result.stats[0].base_stat,
                attack:result.stats[1].base_stat,
                defense:result.stats[2].base_stat,
                speed:result.stats[5].base_stat,
                height:result.height,
                weight:result.weight,
            }
            return result;
        };


        let pushPokemons= async (limit,offset,array)=>{
            while(offset<40){
                let url=`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
                let results=(await axios.get(url)).data.results;
                results=results.map(result=>{
                    return  getPokemon(result.name);
                });
                await Promise.all(results).then(pokemons=>{
                    array=array.concat(pokemons)
                    console.log(array);
                    offset=offset+limit
                    return array;
                });
            }
            Promise.all(array).then(pokemons=>res.json(pokemons));
        }; 

        if(!name){
            let limit=10;
            let offset=0;
            let resultApi=[];
            await pushPokemons(limit,offset,resultApi);

        } else{
            console.log(name)
            let resultApi= await getPokemon(name);
            res.json(resultApi);
        }
    }catch(error){
        next(error)
    }
};


module.exports={getPokemons};