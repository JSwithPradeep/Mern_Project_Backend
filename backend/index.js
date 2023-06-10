const express = require('express');
const cors = require("cors");
require('./db/config');
const User = require('./db/user');
const Product = require('./db/Product');
const Jwt = require('jsonwebtoken');
const jwtkey = 'E-product';
const app = express();


app.use(express.json());
app.use(cors());

app.post("/register", async (req, resp) => {
    let user = new User(req.body);
    let result = await user.save();
   result = result.toObject();
   delete result.password
   resp.send(result)
})

app.post("/login", (req, resp) => {
    const { email, password } = req.body
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            if (password == user.password) {
                Jwt.sign({ user }, jwtkey, { expiresIn: "2h" }, (err, token) => {
                    if (err) {
                        resp.send({ result: "No user Found" })
                    }
                    resp.send({ message: "Login suceesful", user: user, auth: token })
                })
            } else {
                resp.send({ message: "password didn't match", })
            }

        } else {
            resp.send({ message: "user not registered" })
        }
    })
})
app.post("/add-product", verifyToken,async (req, resp) => {
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result);
})
app.get("/gproduct", async (req, resp) => {
    let products = await Product.find();
    if (products.length > 0) {
        resp.send(products);
    } else {
        resp.send({ result: "no product found" });
    }
});


app.delete("/mulproducts/:name",verifyToken, async (req, resp) => {

    const result = await Product.deleteOne({ name: req.params.name })
    resp.send(result);
});

app.get("/mulproducts/:name", verifyToken, async (req, resp) => {
    let result = await Product.findOne({ name: req.params.name })
    if (result) {
        resp.send(result)
    } else {
        resp.send({ result: "No Record Found" })
    }

})

app.put("/mulproduct/:name",verifyToken, async (req, resp) => {
    let result = await Product.updateOne(
        { name: req.params.name },

        {
            $set: req.body
        }

    )
    resp.send(result)
})

app.get("/search/:key", verifyToken, async (req, resp) => {
    let result = await Product.find({
        "$or": [
            { name: { $regex: req.params.key } },
            { company: { $regex: req.params.key } },
            { category: { $regex: req.params.key } }
        ]
    });
    resp.send(result);
});

function verifyToken(req, resp, next) {
    let token = req.headers[`authorization`];
    if (token) {
        token = token.split('')[1];
        console.log("midleware called", token);
        Jwt.verify(token, jwtkey, (err, valid) => {
            if (err) {
                resp.status(401).send({ result: "please provide valid token" })
            } else {
                next();
            }

        })
    } else {
        resp.status(403).send({ result: "please add token with header" })

    }
}
app.listen(11000);

