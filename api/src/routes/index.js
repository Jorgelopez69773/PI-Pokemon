const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const PokemonsRoute = require('./PokemonsRoute.js');
const TypesRoute=require('./TypesRoute.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/pokemons',PokemonsRoute);
router.use('/types',TypesRoute);

module.exports = router;
