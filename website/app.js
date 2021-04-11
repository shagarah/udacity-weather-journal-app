/**
 * Udacity Weather Journal Project - by Ahmad Adel Eldardiry - 12/04/2021
*/
// Global function / class that returns an object to use to do the required functionality
const WJ = (()=> {
    // private properties
    // UI elements
    // inputs
    const zipCode = document.getElementById('zip');
    const userFeeling = document.getElementById('feelings');
    // outputs
    const dateEntry = document.getElementById('date');
    const tempEntry = document.getElementById('temp');
    const contentEntry = document.getElementById('content');
    // error
    const errorIcon = document.getElementById('erroricon');
    
    // Weather API
    const baseURL = 'https://api.openweathermap.org/data/2.5/weather';
    const APIKey = 'f225326a1eaf5e0ba1811f4c7cb83ac5';
    
    // Private methods
    //
    // Weather API
    /**
     * retreives weather data from openweathermap.org api by ZIP code
     * @param { String } url: openweathermap.org api url with query parameters
     * @returns { Object } json object
     */
    const getWeatherData = async (url) => {
        return await sendAndReceive(url, null, apiError);
    }

    // Post data
    /**
     * calls node server's post route to create a new entry based on api data and user input
     * @param { String } uri: node server api's post uri
     * @param { Object } req: post request object
     * @returns { Object } json object
     */
    const postData = async (uri, req) => {
        return await sendAndReceive(uri, req);
    }

    // Get data
    /**
     * calls node server's get route to retreive the most recent entry
     * @param { String } uri: node server api's get uri 
     * @returns { Object } json object
     */
    const getData = async (uri) => {
        const json = await sendAndReceive(uri);
        dateEntry.innerHTML = `Date: <span>${json.date}</span>`;
        tempEntry.innerHTML = `Temperature: <span>${json.temperature}</span>`;
        contentEntry.innerHTML = `Feeling: <span>${json.feeling}</span>`;
    }
    

    // UI Actions
    /**
     * Generate button's listener
     * 1- Check if the input fields are empty and displays an error
     * 2- sends get request to weather api
     * 3- then passes the retreived data to the request object of the post request to create a new entry on node server
     * 4- then retreives the latest entry from node server using get request and updates the UI
     */
    const generateOnClick = async () => {
        reset();
        if(!validate()) {
            return false;
        }
        return await getWeatherData(buildURL(baseURL, { zip: zipCode.value, appid: APIKey }))
        .then( async (data) => {
            return await postData ('/postUserData', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    date: getDate(),
                    temperature: data.main.temp,
                    feeling: userFeeling.value
                })
            }); 
        })
        .then( async (data) => {
            return await getData('/getUserData');
        });
    }
    

    // Helpers
    /**
     * send and receive data from server
     * @param { String } url: server route
     * @param { Object } req: optional route request
     * @param { Function } erf: optional error callback function 
     * @returns { Object } (in case of error, throws an error)
     */
    const sendAndReceive = async (url, req, erf) => {
        try {
            const response = await fetch(url, req);
            const json = await response.json();
            // check if server returned any errors and display it if callback is provided
            if(json.hasOwnProperty('cod') && !(json.cod === 200 || json.cod === 201)) {
                if(erf) {
                    erf(json.message);
                    return false;
                }
            }
            // return json data for the next promise
            return json;
        } catch (err) {
            // on error through an error on console
            throw new Error(err);
        }
    }

    /**
     * callback function if weather API returned an error
     * @param { String } msg: error message
     */
    const apiError = (msg) => {
        error(zipCode, msg);
    }
    
    /**
     * validates form to check if input fields are empty and displays an error message
     * @returns { Boolean } true if validation succeeds, false otherwise
     */
    const validate = () => {
        if(!zipCode.value) {
            error(zipCode, 'Required!');
            return false;
        }
        if(!userFeeling.value) {
            error(userFeeling, 'Required!');
            return false;
        }
        return true;
    }

    /**
     * handles error display for a specific element
     * @param { HTMLElement } elm: input or textarea fields 
     * @param { String } err: error message 
     */
    const error = (elm, err='') => {
        elm.classList.remove('border');
        elm.classList.add('error');
        errorIcon.classList.remove('hide');
        errorIcon.classList.add('show');
        errorIcon.querySelector('.errtxt').innerHTML = err;
        elm.parentElement.appendChild(errorIcon);
        elm.focus();
    } 

    /**
     * resets all elements state to default
     */
    const reset = () => {
        zipCode.classList.remove('error');
        zipCode.classList.add('border');
        userFeeling.classList.remove('error');
        userFeeling.classList.add('border');
        errorIcon.classList.remove('show');
        errorIcon.classList.add('hide');
        errorIcon.querySelector('.errtxt').innerHTML = '';
        document.body.appendChild(errorIcon);
    }

    /**
     * builds a URL with query parmeters
     * @param { String } u: URL or URI 
     * @param { Object } q: query parameters object
     * @returns { String } URL with query string appended
     */
    const buildURL = (u, q) => {
        let url = u + '?';
        for(const i of Object.keys(q)) {
            url += `${i}=${q[i]}&`;
        }
        return url.substring(0, url.length - 1);
    }

    /**
     * Create a new date string dynamically with JS
     * @returns { String } current date string
     */
    const getDate = () => {
        let d = new Date();
        return `${d.getMonth()+1}.${d.getDate()}.${d.getFullYear()}`;
    }

    // the public object returned from the global function
    return {
        // public methods
        // init
        init: () => {
            // generate button's click event listener
            document.getElementById('generate').addEventListener('click', generateOnClick);
            // focus zip field on page load
            zipCode.focus();
        }
    }
})();
//
// initialize the global Weather Journal object
WJ.init();