const mongoose = require("mongoose");

const dbConnect = async ()=>{
    try{
        const Connect = await mongoose.connect(process.env.CONNECTION_STRING)
    console.log(
        `Database connected : ${Connect.connection.host},${Connect.connection.name}`
    )
    }catch(err){
        console.log(err);
        process.exit(1)
    }
};

module.exports = dbConnect;