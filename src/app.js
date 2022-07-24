require('dotenv').config()
const express = require("express");
const path = require("path")
require("./db/conn");
const Register  = require("./models/registers")
const app = express();
const hbs  = require("hbs")
const bcrypt = require("bcryptjs")
// const cookieParser = require("cookie-parser")
const port = process.env.PORT || 3000

const static_path = path.join(__dirname, "../public")

const template_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")

app.use(express.json());

// app.use(cookieParser());

app.use(express.urlencoded({extended: false}));

app.use(express.static(static_path))  // use to connect index.html

app.set("view engine", "hbs")  // use to connect index.hbs

app.set("views", template_path)
hbs.registerPartials(partials_path)

// console.log(process.env.SECRET_KEY)

app.get("/" , (req,res) =>{
    res.render("index")
})

app.get("/register", (req,res) =>{

    res.render("register")
})

app.post("/register", async (req,res) =>{    //async - await method

    try{

        // console.log(req.body.name)
        // res.send(req.body.name)

        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

    
        
        if(password === cpassword){

            const registerStudent = new Register({

                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword,

            })

            console.log("the success part" + registerStudent)
            const token = await registerStudent.generateAuthToken();
            console.log("the token part" + token)

            // res.cookie(name, value, [options])
             
            // res.cookie("jwt", token, {
            //     expires: new Date(Date.now() + 30000),
            //     httpOnly: true
            // })
            // console.log(cookie)


            const registered = await registerStudent.save();
            console.log("the page part" + registered)
            res.status(201).render("index")

            
        }else{

            res.send("password is not matching")
        }

    

    }catch(e){

        res.status(400).send(e);
        console.log("the error part page")

    }

})


app.get("/login", (req,res) => {

    res.render("login")


})

app.post("/login", async(req,res) =>{

    try{

        const email = req.body.email
        const password = req.body.password

        // console.log(`${email} and password is ${password}`)

       const useremail = await Register.findOne({email: email})

       const isMatch = await bcrypt.compare(password, useremail.password)

       const token = await useremail.generateAuthToken();
       console.log("the token part" + token)

    //    res.cookie("jwt", token, {
    //     expires: new Date(Date.now() + 50000),
    //     httpOnly: true
        // secure: true
    // })

    // console.log(`this is cookie ${req.cookies.jwt}`)

    //    res.send(useremail.password)
    //    console.log(useremail)

    if(isMatch){

        res.status(201).render("index")
    }else{
        res.send("Invalid Login Details")
    }


    }catch(e){
        
        res.status(400).send("Invalid Email")
    }   
})


// const bcrypt = require("bcryptjs")

// const securePassword = async (password) =>{

//    const passwordHash = await bcrypt.hash(password, 10)

//    console.log(passwordHash)

//    const passwordmatch = await bcrypt.compare(password, passwordHash)

//    console.log(passwordmatch)
// }

// securePassword("shoa@123")



app.listen(port, () =>{

    console.log(`server is running at port no ${port}`)
})