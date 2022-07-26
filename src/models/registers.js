const mongoose = require("mongoose");

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// const validator = require("validator")

const studentRegSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minlength: 3
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

    phone:{
        type: Number,
        required: true,
        unique: true
    },

    // age:{

    //     type: Number,
    //     required: true
    // },

    // class:{

    //     type: String,
    //     required: true


    // },

    password:{

        type: String,
        required: true

    
    },

    confirmpassword:{

        type: String,
        required: true

    },

    tokens:[{

        token:{
            type: String,
            required: true  
        }
    }

    ]
})

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

// tokens part
studentRegSchema.methods.generateAuthToken = async function(){

    try{

        console.log(this._id)

        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token: token})
        await this.save()
        return token;

    }catch(e){

        res.send("the error part" + e)
        console.log("the error part" + e)

    }
}

//hash part
studentRegSchema.pre("save", async function(next){  //middleware concept
    
    if(this.isModified("password")){
 
        // console.log(`the current password is ${this.password} `)
        this.password = await bcrypt.hash(this.password, 10)
        this.confirmpassword = await bcrypt.hash(this.password, 10)
        // console.log(`the current password is ${this.password} `)

        // this.confirmpassword = undefined;

 
    }
  
    next();
})

// we will create a new collection

const Register  = new mongoose.model('Register', studentRegSchema )

module.exports = Register;

const Contact  = new mongoose.model('Contact', ContactSchema )

module.exports = Contact;
