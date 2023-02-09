const mongoose = require('mongoose');

// connection to the mongodb
mongoose.connect(process.env.URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

//making the schema.
const productSchema = {
    title:String,
    price:Number,
    description:String,
    category:String,
    image:String,
    sold:Boolean,
    dateOfSale:String
}

//making the model
const productModel = mongoose.model("productModel",productSchema);

module.exports = productModel;