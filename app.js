require('dotenv').config();
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const userRoutes = require("./routes/user");
const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require("./swagger.json");

// Connecting to MongoDB
mongoose.connect(`mongodb+srv://admin:${process.env.MONGOOSE_PASSWORD}@cluster0.3qw8w.mongodb.net/${process.env.MONGOOSE_DB_NAME}?retryWrites=true&w=majority`)
         .then(() => {
             console.log("Database Connected!");
         }).catch((error) => console.log(error))


//initialize express app
const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());

const port = process.env.PORT || 4000;


app.use('/api', userRoutes)

app.use(
  '/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);

//start server and listen on port 4000
app.listen(port, () => {
    console.log(`App is running an ${port}`)
})