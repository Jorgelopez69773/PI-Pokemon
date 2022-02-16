const axios= require('axios');
const {Op}= require('sequelize');
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
            
            let resultDb=await Pokemon.findAll({
                include:[{
                    model:Type,
                    attributes:["name"],
                }]
            });

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
            Promise.all(array).then( async pokemons=> res.json(await resultDb.concat(pokemons)));
        }; 

        if(!name){
            let limit=10;
            let offset=0;
            let resultApi=[];
            await pushPokemons(limit,offset,resultApi);

        } else{
            let resultDb=await Pokemon.findAll({
                include:[{
                    model:Type,
                    attributes:["name"],
                }],
                where:{
                    name:`${name}`,
                }
            });
            let url=`https://pokeapi.co/api/v2/pokemon?limit=1118`;
            let namesApi=(await axios.get(url)).data.results;
            namesApi=namesApi.filter(pokemon=>pokemon.name===name);
            if (namesApi.length<1){
                if(resultDb.length<1){
                    res.json({message:"No se encontro pokemon con ese nombre"});
                } else{
                    res.json(resultDb);
                }
            } else{
            let resultApi= await getPokemon(name);
            let result=resultDb.concat(resultApi);
            res.json(result);
            }
        }
    }catch(error){
        next(error)
    }
};

async function  getPokemon(req,res,next){
    let id=req.params.id;
    let result=[];
    let resultDb=[];
    if(id.includes('-') && id.length===36){
        resultDb=await  Pokemon.findOne({
            where:{
                id:id,
            },
            include:[{
                model:Type,
                attributes:['name']
            }],
           
        });
        res.json(resultDb);
    };

    let url=`https://pokeapi.co/api/v2/pokemon?limit=1118`;
    let urls=(await axios.get(url)).data.results;
    urls=urls.filter(pokemon=>pokemon.url===`https://pokeapi.co/api/v2/pokemon/${id}/`);


    if(urls.length>0){
    let url=`https://pokeapi.co/api/v2/pokemon/${id}`;
    result=(await axios.get(url)).data;

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
    res.json(result)
    }else {
    res.json({message:`El ID ${id} no corresponde a un Pokemon`});
    }
};

module.exports={getPokemons,getPokemon};