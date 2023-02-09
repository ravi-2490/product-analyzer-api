//importing the required dependencies
const axios = require("axios");
const path = require("path");
const viewPath = path.join(__dirname,"..","views");
const productModel = require("../models/productModels");

//home controller
const homeController = (req,res)=>{
    res.send({
        description:"Follow the below listed endpoint to get the result",
        toSendData:"/getData",
        toGetStatistics:"/giveStatistics",
        toGetBarChart:"/giveBarChart",
        toGetPieChart:"/givePieChart",
        toGetCombinedResult:"/giveCombinedResult",
    });
};

//get data and save it to database controller
const getSaveController = async (req,res)=>{
    const response = await axios({
        method:"get",
        url:"https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    })
    const productData = response.data
    await productData.forEach(element => {
        const individualData = new productModel(element);
        try{
            individualData.save();
        }catch(error){
            console.log("An error occured ",error);
        }
    })
    res.send("Data has been saved successfully!!!")
};

//statistics controller
const statisticsGetController = async (req,res)=>{
    res.sendFile(path.join(viewPath,"/statistics.html"))
};

const statisticsPostController = async (req,res)=>{
    let requestedMonth = req.body.month

    const {data} = await axios({
        method:"get",
        url:"https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    })
    let totalSaleAmount = 0
    let totalNumberOfItemSold = 0
    let totalNumberOfItemNotSold = 0
    data.forEach(element => {
        let currMonth = element.dateOfSale.substring(5,7)
        if(currMonth===requestedMonth && element.sold===true){
            totalSaleAmount = totalSaleAmount + parseFloat(element.price)
            totalNumberOfItemSold = totalNumberOfItemSold + 1
        }else if(currMonth===requestedMonth && element.sold===false){
            totalNumberOfItemNotSold = totalNumberOfItemNotSold + 1
        }
    });
    console.log("required response ",req.body);
    res.send({
        selectedMonth:requestedMonth,
        totalSaleAmount:JSON.stringify(totalSaleAmount),
        totalNoOfItemSold:JSON.stringify(totalNumberOfItemSold),
        totalNoOfItemNotSold:JSON.stringify(totalNumberOfItemNotSold),
    })
};

// bar chartcontrooler
const barChartGetController = (req,res)=>{
    res.sendFile(path.join(viewPath,"/barChart.html"));
};

const barChartPostController = async (req,res)=>{
    let requestedMonth = req.body.month
    const {data} = await axios({
        method:"get",
        url:"https://s3.amazonaws.com/roxiler.com/product_transaction.json",
    })
    //setting the variable for the specified range.
    /*
        0-100 is called first
        101-200 is called second
        201-300 is called third
        301-400 is called fourth
        401-500 is called fifth
        501-600 is called sixth
        601-700 is called seventh
        701-800 is called eighth
        801-900 is called ninth
        900 and above is called tenth
    */
    let first = 0
    let second = 0
    let third = 0
    let fourth = 0
    let fifth = 0
    let sixth = 0
    let seventh = 0
    let eighth = 0
    let ninth = 0
    let tenth = 0
    await data.forEach(element => {
        let currMonth = element.dateOfSale.substring(5,7)
        const { price } = element
        if(currMonth===requestedMonth && price>=0 && price<=100){
            first = first + 1
        }
        else if(currMonth===requestedMonth && parseFloat(price)>=101 && parseFloat(price)<=200){
            second = second + 1
        }
        else if(currMonth===requestedMonth && parseFloat(price)>=201 && parseFloat(price)<=300){
            third = third + 1
        }
        else if(currMonth===requestedMonth && parseFloat(price)>=301 && parseFloat(price)<=400){
            fourth = fourth + 1
        }
        else if(currMonth===requestedMonth && parseFloat(price)>=401 && parseFloat(price)<=500){
            fifth = fifth + 1
        }
        else if(currMonth===requestedMonth && parseFloat(price)>=501 && parseFloat(price)<=600){
            sixth = sixth + 1
        }
        else if(currMonth===requestedMonth && parseFloat(price)>=601 && parseFloat(price)<=700){
            seventh = seventh + 1
        }
        else if(currMonth===requestedMonth && parseFloat(price)>=701 && parseFloat(price)<=800){
            eighth = eighth + 1
        }
        else if(currMonth===requestedMonth && parseFloat(price)>=801 && parseFloat(price)<=900){
            ninth = ninth + 1
        }
        else if(currMonth===requestedMonth && parseFloat(price)>=901){
            tenth = tenth + 1
        }
    });
    let returnData = {
            "selectedMonth":requestedMonth,
            "0-100":first,
            "101-200":second,
            "201-300":third,
            "301-400":fourth,
            "401-500":fifth,
            "501-600":sixth,
            "601-700":seventh,
            "701-800":eighth,
            "801-900":ninth,
            "901 and above":tenth,
        }
    res.send(returnData)
    // res.send(data)
};

// pie chart controller
const pieChartGetController = (req,res)=>{
    res.sendFile(path.join(viewPath,"/pieChart.html"));
};

const pieChartPostController = async (req,res)=>{
    const requestedMonth = req.body.month;
    const { data } = await axios({
        method:"get",
        url:"https://s3.amazonaws.com/roxiler.com/product_transaction.json",
    });
    let m = new Map();
    const returnData = {};
    returnData["selectedMonth"] = requestedMonth;
    data.forEach(element => {
        const { category } = element;
        const currMonth = element.dateOfSale.substring(5,7);
        if(currMonth===requestedMonth && m.has(category)){
            m.set(category,m.get(category)+1);
            returnData[category]++;
        }else if(currMonth===requestedMonth && !m.has(category)){
            returnData[category]=1;
            m.set(category,1);
        }
    });
    res.send(returnData);
};

// combined result controller
const combinedResultGetController = (req,res)=>{
    res.sendFile(path.join(viewPath,"/combinedResult.html"));
};

const combinedResultPostController = async (req,res)=>{
    
    let requestedMonth = req.body.month;

    const responseStatistics = await axios({
        method:"post",
        url:"http://localhost:3000/giveStatistics",
        data:{
            month:requestedMonth,
        }
    });

    const responseBarChart = await axios({
        method:"post",
        url:"http://localhost:3000/giveBarChart",
        data:{
            month:requestedMonth,
        }
    })

    const responsePieChart = await axios({
        method:"post",
        url:"http://localhost:3000/givePieChart",
        data:{
            month:requestedMonth,
        },
    });

    const returnData = {};
    returnData["selectedMonth"] = requestedMonth;
    returnData["statisticsForSelectedMonth"] = responseStatistics.data;
    returnData["barChartForSelectedMonth"] = responseBarChart.data;
    returnData["pieChartForSelectedMonth"] = responsePieChart.data;
    res.send(returnData);
};

module.exports = {
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
};