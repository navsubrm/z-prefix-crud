import express from 'express';
import http from 'http';
import cors from 'cors';
import env from 'dotenv';
import cookieParser from 'cookie-parser';
import * as inventoryController from './controllers/inventoryController.js';
import * as userController from './controllers/userController.js';

env.config();
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL })); //This is very important for allowing credentials to the API from the front-end.
app.use(cookieParser());

//User routes
app.post('/user/create', userController.createUser);
app.post('/user/login', userController.login);
app.get('/user/authenticate', userController.authenticate);
app.post('/user/theme', userController.setTheme);
app.get('/user/theme', userController.getTheme);
app.get('/user/logout', userController.logout);

//Inventory routes
app.post('/inventory/add', inventoryController.createInventoryItem);
app.put('/inventory/edit', inventoryController.editInventoryItem);
app.delete('/inventory/delete', inventoryController.deleteInventoryItem);
app.get('/inventory/list/:userId', inventoryController.viewInventoryByUserId);
app.get('/inventory/list', inventoryController.viewInventoryList);

http.createServer({}, app).listen(3001, () => console.log(`Listening on port 3001.`));
