# Booking System integrated Google Calendar

# My Developing Enviroment
node12.10.0
express4.17.1

# The instruction for setting up this project
1. clone the repository
    1. git clone https://github.com/LeonDong199509/booking-system.git
2. go to booking-system dir, install dependencies
    1. cd booking-system
    2. npm install
3. set up credential files for your Google Cloud Project
    1. open the "credentials.json" which is in the root directory
    2. copy your google cloud project id to "project_id" field
    3. copy your google cloud project's OAuth 2.0 Client id to "client_id" field(Please make sure your OAuth2 Client's Application type is "Other" other than "Web Application".If it's not "Other" type, please create a new OAuth2 Client Credential )
    4. copy your google cloud project's OAuth 2.0 Client Secret to "client_secret" field
4. run the server, but for the firsttime, you need to get the token file for your Google Calendar account. 
    1. node server.js
    2. go to your brower, visit the link:http://127.0.0.1:3000/days?year=2020&month=2
    3. in your terminal, you should see a url for authorization, visit it in your browser
    4. use your google account to authorize it, you will get a code from that page, the google acccount you use will be the calendar account the appointments connect with
    5. copy the code to your terminal(you can see "Enter the code from that page here:" in your terminal )
    6. if its succeed, you should see "Token stored to token.json",and there will be a token.json file in your directory.
5. now you can get access to all apis, you can see all api docs at :http://127.0.0.1:3000/apidoc/

    
