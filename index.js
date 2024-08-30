import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

// Create an instance of the express app
const app = express()

// Define the port number
const port = 3000;

// Define the API key for OpenWeatherMap API
const API_KEY = "5ee7459c0aaf67e2f9d7b324d2d7d1f3"


// Serve static files from the "public" folder
app.use(express.static("public"));

// Parse URL-encoded bodies (e.g. from HTML forms)
app.use(bodyParser.urlencoded({extended: true}));


// Define a route for the root URL ("/")
app.get('/', (req,res) => {
   res.render("index.ejs");
})


// Define a route for the "/weather" URL (POST request)
app.post('/weather',async(req,res) => {
   // Get the city name from the request body
    const city = req.body.city.trim();
    

    // Check if the city name is empty
    if (!city) {

        // Render an error message if the city name is empty
        // define the imageUrl variable
        const imageUrl = "images/404.jpg"; 
        return res.render("index.ejs", {
          error: "Please enter a city name",
          imageUrl: imageUrl 
        });
      }
    try {
       // Make a GET request to the OpenWeatherMap API
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
      const result = response.data;
    //   console.log(result);
        res.render("index.ejs", {
            weather: result
            
        })
    } catch (error) {
      // console.log(error)
      if (error.response) {
        // Handle API error responses
        const statusCode = error.response.status;
        const errorMessage = error.response.data.message;
        // define the imageUrl variable
        const imageUrl = "images/404.jpg"; 
        res.status(statusCode).render("index.ejs", {
          error: errorMessage,
          imageUrl: imageUrl // use the defined imageUrl variable
        });
      } else {
        // Handle other types of errors
        res.status(500).render("index.ejs", {
          error: "Internal Server Error"
        });
      }
    }
  });


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});


// API Example:- https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=5ee7459c0aaf67e2f9d7b324d2d7d1f3&units=metric
