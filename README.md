## Edinburgh Event Planner

### Description
Web application that helps the user plan their day around Edinburgh by suggesting places to visit, creating an itinerary and planning the day’s route around the city.

### Installation
Can currently be hosted locally with the source files. To run the application both the flask backend app and the react web application must be run. 


### Usage
After starting the flask and the react applications, a browser tab will open up for the user with the react webpage. From there they can select what type of activities they would like to do, what time they would like their day to start and what type of transport they will be using to get around the city. After submitting these details the application will take the user’s choices and create three possible schedules: a ‘short’ day lasting up to 2 hours, a ‘medium’ date lasting up to 5 hours and a ‘long’ date lasting up to 8 hours. Extension: after selecting which of the three options they would like to do, the application should show a route map of the user’s planned day along with details and timings for each planned activity. 

### Technologies
- React front end to create ui for user - the frontend makes http requests to generate web components based on what the backend calculates
- Flask backend to query apis to generate recommendations, plan routes between locations and create the schedules
Libraries:
- Flask-cors, jsonify, request
- Google maps apis: places api, routing api

### AI Tools Used
- Claude for debugging issues
- Claude using github copilot for git issues
- IntermediatePage.tsx largely coded using AI due to issues formatting the schedules (intermediate-content div)
- Claude for React/typescript syntax, debugging and formatting due to lack of experience in these languages/libraries/frameworks
- ChatGPT for git/github issues

### Contributors
Arad Joliny, Amy Easson, Maria Trinidad Carnicero Fernandez, Elam Kebede, Catherine Currie
