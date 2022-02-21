## Reddit-Trends
Reddit-Trends is a simple application to visualizer the thread's trends on specified subreddit.<p />
Example (http://qstore.info/) 
- username: admin
- password: 123
 
 <img src="https://i.imgur.com/jkJVLOG.png" width="700">
 
## Built With
### Database
- Oracle autonomous database 
### Backend
- ExpressJS
- PassportJS
- Knex
### Frontend
- Bootstrap (https://github.com/startbootstrap/startbootstrap-sb-admin-2)
- Vue
- Vuex 
- vuetify
### Deployment
- Nginx
- Docker

## Development
### Pre-requisite
- Download the database wallet and place all files into backend/oracle/wallet
- Create an `.env` file in backend folder and include the below parameter or directly pass those parameter in docker-compose.yml.
```
SECRET_KEY=<a random string>
DATABASEUSER=<you database username>
DATABASEPASS=<you database password>
CONNNETSTRING=<you database connnectstring, could find in wallet/tnsnames.ora>
```
- Create an `.env` file in fontend folder and include the below parameter or directly pass those parameter in docker-compose.yml.
```
VUE_APP_WS_ADDRESS=ws://localhost:3001/api/ws
```
### Start
```
docker-compose -f docker-compose-dev.yml up --build
```

## Deployment
While deployment, the backend will no expose to network. Instead, It listen to localhost connect only. Nginx will be a reverse proxy and transfer request to the backend.
### Pre-requisite
- Almost same as the development above but the `VUE_APP_WS_ADDRESS` need to change to `ws://localhost/api/ws` since the backend server will listen local only, all traffic will handle by Nginx.
### Start
```
docker-compose -f docker-compose-prod.yml up --build
```

## Data scraping
Data scraping rely on the Worker in the `worker` folder. Initial the Worker with an array of subreddit name
### Start
```
cd worker
docker-compose up
```

## Contributing
Contributions, issues, and feature requests are welcome!
Give a ⭐️ if you like this project!
