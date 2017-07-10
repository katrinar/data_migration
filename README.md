# Kustomer Data Migration Script

Node.js script to parse CSV file for customer data and post customers to Kustomer API.

## Dependencies

* csv-parser
* dotenv
* request

## Getting Started

Run locally:

```
https://github.com/katrinar/data_migration.git
cd data_migration
npm install --save
touch .env

```
Open .env file, and add API key:

```
KUSTOMER_API_KEY=your_key_here

```

Save CSV file to data_migration folder as 'customer_data.csv' for script to process. Start the script:

```
npm start

```

Watch terminal for status report of data migration. Note: if report prints duplicate customer errors, update customer in Kustomer platform, or send PUT request to Kustomer API to update duplicate customer with data from CSV.
