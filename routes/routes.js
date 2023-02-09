const express = require('express')
const router = express.Router()
const axios = require('axios')
const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({extended:true}))
router.use(express.json());

//importing the controllers
const {
    homeController,
    getSaveController,
    statisticsGetController,
    statisticsPostController,
    barChartGetController,
    barChartPostController,
    pieChartGetController,
    pieChartPostController,
    combinedResultGetController,
    combinedResultPostController,
} = require("../controller/productController");


//home route to display the functionality of the application
router.get('/',homeController);


//get the data from the external api and save it to the data base.
router.get("/getData",getSaveController);


//api for statistics
router.get('/giveStatistics',statisticsGetController);
router.post('/giveStatistics',statisticsPostController);


//API for barchart
router.get("/giveBarChart",barChartGetController);
router.post("/giveBarChart",barChartPostController);


//API for piechart
router.get("/givePieChart",pieChartGetController);
router.post("/givePieChart",pieChartPostController);


//API that give's the combined result
router.get("/giveCombinedResult",combinedResultGetController);
router.post("/giveCombinedResult",combinedResultPostController);

module.exports = router;