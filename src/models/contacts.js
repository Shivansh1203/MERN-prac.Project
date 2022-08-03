const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minlength: 2
    },

        email:{

            type: String,
            required: true,
            unique:true,

            // validate(value){

            //     if(!validator.isEmail(value)){

            //         throw new Error("Invalid Error")
            //     } 
            // } 
        
    },

    subject:{
        type: String
        
    },

    message:{

        type: String

    }

   
    
})

const Contact  = new mongoose.model('Contact', ContactSchema )

module.exports = Contact;
