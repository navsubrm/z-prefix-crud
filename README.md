# SPACE FORCE Z PREFIX CRUD APPLICATION

    This application is submitted for the FY25 January Z-Prefix CRUD assessment.

## Creating a project

    To create the application, clone the repository.

    Run "npm i" to install required dependencies.

    Update environment variables per list below with username and password provided separately.

    Run "npm run dev-server"

### Application structure

    -  API files are located in the api folder
    -  The Page files are located under src/routes/
       -  The route includes a +page.js (client-side sveltekit page load) & +page.svelte file.
    -  Component files are located in the src/lib folder.
    -  When npm run dev-server is started, concurrently starts both the app and api.  The API runs on localhost port 3001, while the SvelteKit defaults to port 5173.
    -  The database is Mongo DB.  I will provide the CONNECTION_STRING via separate correspondence.

    Environment Variables:

        CONNECTION_STRING=mongodb+srv://[Username and password]@cluster0.tvozn.mongodb.net/z-prefix-crud?retryWrites=true
        PUBLIC_API_URL=http://localhost:3001
        FRONTEND_URL=http://localhost:5173
