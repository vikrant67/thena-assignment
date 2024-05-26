# Thena Assignment:

This README provides step-by-step instructions for installing a NestJS project from GitHub, running it locally, executing Jest tests and test apis.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project Locally](#running-the-project-locally)
- [Running Jest Tests](#running-jest-tests)
- [API curls for testing](#api-curls-testing)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later) installed on your machine.
- npm (Node package manager) or yarn installed. npm comes with Node.js;
- Git installed on your machine.
- mongodb is already installed and running at: mongodb://localhost:27017/


## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/vikrant67/thena-assignment.git
   cd thena-assignment
   git checkout develop
2. **Setting up .env:**
- Create a new .env file at root path of project and add mongodb url as shown below

   ```bash
   MONGO_URL="mongodb://localhost:27017/thena"
3. **Install dependencies:**

   ```bash
   npm install 

4. **Start the development server:**

   ```bash
   npm run start
The application should now be running at http://localhost:3000/

## Running Jest Tests
1. **Running all test cases:**
   ```bash
   npm run test

## API curls for testing:

1. Get all team members
    ``` bash
    curl --location 'http://localhost:3000/team?page=1&limit=10'
2. Create new member
    ``` bash
    curl --location 'http://localhost:3000/team' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "firstName": "Vikrant",
        "lastName": "Rana",
        "phoneNumber": "8894388477",
        "email": "vikrant.juit1@gmail.com",
        "role": "user"
    }'
3. Update member details
    ``` bash
    curl --location --request PUT 'http://localhost:3000/team/6651e43e5920da26384fd6d8' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "firstName": "Vikrant1",
        "lastName": "Rana",
        "phoneNumber": "8894388479",
        "email": "vikrant.juit@gmail.com",
        "role": "admin"
    }'
4. Delete a member
    ``` bash
    curl --location --request DELETE 'http://localhost:3000/team/6651e43e5920da26384fd6d8'
