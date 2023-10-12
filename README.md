# Cinema Ticket Purchase Platform Web API - Nodejs and MongoDB

This is a RESTful web API for cinema ticket purchase platform to manage booking of cinema tickets using Nodejs, Expressjs and MongoDB. This API allows to perform following operations:

- Create a cinema with N seats. Returns the cinema ID.

- View details of cinema and available seats in cinema.

- Registration and login of user with jwt token to purchase ticket.

- Purchase a specific seat number in cinema C. If the seat is already purchased, return an error, otherwise return the seat and booking details.

- Purchase the first two free consecutive seats in cinema C. If there are no two consecutive seats available, return an error, otherwise return the list of seats and booking details.

- Additionally, API provide the features of sorting, searching by cinema name and pagination.

## Steps to Run Application

Follow these steps to set up and run the API on your local machine:

1. **Requirements**:
   
    Nodejs and MongoDB should be installed on your computer. Install nodemon globally using below command in terminal if not installed previously:
    ```bash
    npm install -g nodemon
    ```

2. **Clone the Repository**:
   
    Clone repository using below command
    ```bash
    git clone https://github.com/smit199/Cinema_Ticket_Purchase_API.git
    ```

3. **Install Dependencies**
    
    Install required npm packages using below command in root directory 
    ```bash
    npm install
    ```

4. **Setting Enviroment Variables**

    Create config.env file in your root directory and add following environment variables:
    - PORT: Port in which to run application
    - DATABASE: MongoDB database connection url
    - JWT_SECRET: jwt secret key string
    - JWT_EXPIRE_TIME: expiration time of jwt token (ex. 7d, 2h, 5m)
    
5. **Run Application**

    Run application using below command:
    ```bash
    npm start
    ```
    The application will start running on configured PORT.

6. **API Documentation & Testing**

    Open postman in your machine and import 'Cinema_Ticket_Booking_API.postman_collection.json' file. Change the port in environment varaibles url according to your configuration. Register demo user and login directly through signup and login endpoints to book tickets in cinema.