require('dotenv').config();
const fs = require('fs');
const csvParser = require('csv-parser');
const request = require("request");
let rowCount = 0;
let statusCount = 0;
let statusReport = '';

let import_client_data = () => {
  fs.createReadStream('customer_data.csv')
    .pipe(csvParser())
    .on('data', (row) => {
      rowCount += 1;
      let customer = {
        firstName,
        lastName,
        email,
        birthday,
        homePhone,
        workPhone,
        customerType,
      } = row;

      let formattedCustomer = { 'emails': [], 'phones': [] };

      formattedCustomer['name'] = `${firstName} ${lastName}`;
      if(email){
        let scrubbedEmail = email.replace(/(%3C|&lt;|%3E|&gt;|\\)/g, '');
        formattedCustomer['emails'].push( { type: "home", email: scrubbedEmail } );
      };
      if(birthday){ formattedCustomer['birthdayAt'] = new Date(birthday) };
      if(homePhone){ formattedCustomer['phones'].push( { type: "home", phone: homePhone } ) };
      if(workPhone){ formattedCustomer['phones'].push( { type: "work", phone: workPhone } ) };
      if(customerType){ formattedCustomer['custom'] = { customerTypeStr : customerType } };

      let options = {
        method: 'post',
        url: 'https://api.kustomerapp.com/v1/customers',
        headers:
         { 'content-type': 'application/json',
           authorization: `Bearer ${process.env.KUSTOMER_API_KEY}`
         },
        body: formattedCustomer,
        json: true
      };

      request(options, (error, response, body) => {
        if (error) { throw new Error(error) };
        statusCount += 1;
        statusReport += `${statusCount}: ${JSON.stringify(body)} \n`;
      });

    })
    .on('end', () => {
      console.log(`CSV CUSTOMER FILE CONSUMED. PROCESSING ${rowCount} POST REQUESTS TO KUSTOMER API`);
    })
    .on('error', (error) => {
      console.log(`READ STREAM ERROR: ${error}`);
    })
    process.on('exit', () => {
      return console.log(`SENT POST REQUESTS FOR ${statusCount} CUSTOMERS: ${statusReport}`);
    });
};

module.exports = import_client_data();
