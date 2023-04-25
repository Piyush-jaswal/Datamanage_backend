var fs = require('fs');

// json file with the data
var data = fs.readFileSync('data.json');

var elements = JSON.parse(data);
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
// To solve the cors issue
const cors = require('cors');
app.use(cors());
const port = process.env.PORT || 5000;
app.listen(port,
    () => console.log("Server Start at the Port"));

app.get('/getalldata', async (req, res) => {
    console.log(elements)
    res.send(elements);
})
// income lower than $5 USD and have a car of brand “BMW” or “Mercedes”
app.get('/incmlsfv', async (req, res) => {
    // console.log(elements)
    const resp = {
        data : []
    };
    elements.forEach(element => {
        const inc = parseFloat(element.income.slice(1,));
        const carbrand = element.car;
        if (inc <= 5 && (carbrand == "BMW" || carbrand == "Mercedes-Benz"))
            resp.data.push(element)
    });
    // console.log("Hi server")
    res.json(resp);
})
//Male phone price greater than 10,000
app.get('/phoneprice', async (req, res) => {
    // console.log(elements)
    const resp = {
        data : []
    };
    elements.forEach(element => {
        if (Number(element.phone_price) > 10000 && element.gender == "Male")
            resp.data.push(element)
    });
    res.json(resp);
})
// whose last name starts with “M” and has a quote character length greater than 15 and email includes his/her last name.
app.get('/lstnamem', async (req, res) => {
    // console.log(elements)
    const resp = {
        data : []
    };
    elements.forEach(element => {
        // console.log;
        if (element.last_name[0] == "M" && element.quote.length > 15 && (element.email.indexOf((element.last_name).toLowerCase()) != -1) )
            resp.data.push(element)
    });
    res.json(resp);
})
// which have a car of brand “BMW”, “Mercedes” or “Audi” and whose email does not include any digit.
app.get('/mailnodigit', async (req, res) => {
    console.log(elements)
    const resp = {
        data : []
    };
    elements.forEach(element => {
        const carbrand = element.car;
        if (stringContainsNumber(element.email) && (carbrand == "BMW" || carbrand == "Mercedes-Benz" || carbrand == "Audi"))
            resp.data.push(element)
    });
    res.json(resp);
})
// data of top 10 cities which have the highest number of users and their average income.
app.get('/last', async (req, res) => {
    // console.log(elements)

    const storeinfo = [];
    elements.forEach(element => {
        var flg = 0;
        storeinfo.forEach(el => {
            if (el.city == element.city) {
                const floatValue = parseFloat(element.income.slice(1,))
                

                el.income =  parseFloat((el.income + floatValue).toFixed(2));
                
                el.ppl += 1;
                flg = 1;
                // if (element.city == "Baishan") {
                //     console.log(floatValue, el.income)
                // }
            }


        })
        if (flg == 0) {
            var newdata = {
                city: element.city,
                income: parseFloat(element.income.slice(1,)),
                ppl: 1
            }
            storeinfo.push(newdata)
        };
    });
    // Do sorting and get data
    var sortedCity = sortByPpl(storeinfo);
    sortedCity = sortedCity.slice(0, 10);
    const resp = {
        data : []
    };



    // console.log(sortedCity.length)
    sortedCity.forEach(element => {
        element.avg = parseFloat((element.income / element.ppl).toFixed(4));
    });
    sortedCity.forEach(ele =>{
        resp.data.push(ele)
    }
        )
    res.json(resp);

})
// Check if the string contains digits
function stringContainsNumber(_string) {
    return !/\d/.test(_string);
}
// Sort by no. of ppl
function sortByPpl(arr) {
    arr.sort((a, b) => {
        return b.ppl - a.ppl;
    });
    return arr;
}
app.use(express.static('public'));
app.use(cors());
