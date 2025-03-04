const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const Cloudant = require('@cloudant/cloudant');

// Initialize Cloudant connection with IAM authentication
async function dbCloudantConnect() {
    try {
        const cloudant = Cloudant({
            plugins: { iamauth: { iamApiKey: 'MYOYP9pRR3RaIXRbITWlNo1oGLFE_JOvIt_HiMGNz88i' } }, // Replace with your IAM API key
            url: 'https://677aeeab-6b5a-496f-af72-ea60db8951e9-bluemix.cloudantnosqldb.appdomain.cloud', // Replace with your Cloudant URL
        });

        const db = cloudant.use('dealerships');
        console.info('Connect success! Connected to DB');
        return db;
    } catch (err) {
        console.error('Connect failure: ' + err.message + ' for Cloudant DB');
        throw err;
    }
}

let db;

(async () => {
    db = await dbCloudantConnect();
})();

app.use(express.json());

// Define a route to get all dealerships with optional state and ID filters
app.get('/dealerships/get', (req, res) => {
    const { state, id } = req.query;

    // Create a selector object based on query parameters
    const selector = {};
    if (state) {
        selector.state = state;
    }
    
    if (id) {
        selector.id = parseInt(id); // Filter by "id" with a value of 1
    }

    const queryOptions = {
        selector,
        limit: 10, // Limit the number of documents returned to 10
    };

    db.find(queryOptions, (err, body) => {
        if (err) {
            console.error('Error fetching dealerships:', err);
            res.status(500).json({ error: 'An error occurred while fetching dealerships.' });
        } else {
            const dealerships = body.docs;
            res.json(dealerships);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

/**
  * This is the code for the IBM Cloud Function "get_dealerships". 
  * The function is part of a cloud-hosted API, so this code is not really part of
  * the codebase for the Django website. I am mainly leaving it here for my own reference 
  * and documentation's sake, as well as for any fellow learners who are curious about the 
  * API and IBM Cloud Functions. 
  * 
  * main() will be run automatically when this action is invoked in IBM Cloud
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *       In this case, the param can be an empty JSON object, a JSON object with the key "dealerID" and the 
  *        id of a dealership as the value, or a JSON object with the key "state" and the name of a state as value. 
  *        I.e: {} or {"state": "California"} or {"dealerID": "14"}
  * @return The action returns a JSON object consisting of the HTTP response, i.e:
  *         {
  *             "body": {
  *                 "bookmark": "g1AAAABweJzLYWBgYMpgSmHgKy5JLCrJTq2MT8lPzkzJBYormCamJJuZmxkYplpampumGCWlGBoapZkkJiWmGaYkpxmD9HHA9BGlIwsAxe0fhw",
                    "docs": [
                        {
                            "_id": "5adc67601e9975d2bd112f4abaf0ba06",
                            "_rev": "1-34e7ebd07643af43db578a46ee1d6365",
                            "address": "3 Nova Court",
                            "city": "El Paso",
                            "full_name": "Holdlamis Car Dealership",
                            "id": 1,
                            "lat": 31.6948,
                            "long": -106.3,
                            "short_name": "Holdlamis",
                            "st": "TX",
                            "state": "Texas",
                            "zip": "88563"
                        },
                        ..., 
                    ],
                    ...
                }
            }
**/


/* Gets all dealerships in the database that match the specified state. */
/*function main(params) {
    secret = {
   "COUCH_URL": "https://677aeeab-6b5a-496f-af72-ea60db8951e9-bluemix.cloudantnosqldb.appdomain.cloud",
   "IAM_API_KEY": "MYOYP9pRR3RaIXRbITWlNo1oGLFE_JOvIt_HiMGNz88i",
   "COUCH_USERNAME": "677aeeab-6b5a-496f-af72-ea60db8951e9-bluemix"
   };

   return new Promise(function (resolve, reject) {
    const cloudant = Cloudant({
        url: secret.COUCH_URL,
        plugins: {iamauth: {iamApiKey:secret.IAM_API_KEY}} 
    });

       const dealershipDb = cloudant.use('dealerships'); 

       if (params.dealerId) { 
        // return dealership of specified dealership ID (if specified)
        dealershipDb.find({"selector": {"id": parseInt(params.dealerId)}}, 
            function (err, result) { 
                    if (err) { 
                        console.log(err) 
                        reject(err); 
                    } 
                    let code=200; 
                        if (result.docs.length==0) { 
                            code= 404; 
                        }
                    resolve({ 
                        statusCode: code, 
                        headers: { 'Content-Type': 'application/json' }, 
                        body: result 
                    }); 
                }); 
    } else if (params.state) { 
        // return dealerships for the specified state (if specified)
        dealershipDb.find({"selector": {"state": {"$eq": params.state}}}, 
            function (err, result) { 
                    if (err) { 
                        console.log(err) 
                        reject(err); 
                    } 
                    let code=200; 
                        if (result.docs.length==0) { 
                            code= 404; 
                        }
                    resolve({ 
                        statusCode: code, 
                        headers: {'Content-Type': 'application/json'}, 
                        body: result 
                    }); 
                }); }
                 else { 
           // return all documents if no parameters are specified
           dealershipDb.list(
            { include_docs: true }, 
            function (err, result) { 
                if (err) { 
                    console.log(err) 
                    reject(err); 
                } 
                resolve({ 
                    statusCode: 200, 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: result 
                }); 
            }
        ); 
       } 
   });
} */