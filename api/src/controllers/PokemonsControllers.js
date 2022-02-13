const axios= require('axios');
const {Pokemon,Type}= require ('../db');



async function getPokemons(req,res,next){
    try{
        let {name}=req.query;

        let getPokemon=async(name)=>{
            let url=`https://pokeapi.co/api/v2/pokemon/${name}`;
            let result=(await axios.get(url)).data;
            result={
                id:result.id,
                name:result.name
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
        }
        if(!name){
            let limit=10;
            let offset=0;
            let resultApi=[];
            await pushPokemons(limit,offset,resultApi);
            
           
            // results=results.map(async(pokemon)=>{
            //     console.log(' PASO 1:obtendra el nombre')
            //     console.log(pokemon.name);
            //     resultApi.push(await Promise.resolve(getPokemon(pokemon.name)));
            //     console.log('paso 2 deberia pushear cada nombre ya resuelto a result API')
            //     console.log(resultApi);
            //     });
            // offset=offset+1;
                 
            //     Promise.all(resultApi).then(async pokemones=>{
            //         console.log('Paso 3:deberian estar todos los pokemons resueltos y listo para enviar con  res.json:')
            //         console.log(resultApi);
            //         console.log('paso 4: estan todos los pokemons listo y resueltos para enviar')
            //         console.log(pokemones);
            //         await res.json(pokemones)});
        }
    }catch(error){
        next(error)
    }
};


module.exports={getPokemons};