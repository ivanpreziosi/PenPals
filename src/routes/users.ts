import { UserController } from "../controller/UserController";
import { ContactRequestController } from "../controller/ContactRequestController";
import { ContactResponseController } from "../controller/ContactResponseController";

var express = require('express');
var router = express.Router();

var AppConfig = require('../app_config');
var Auth = require('../helper/PenpalsAuthentication');

/* GET user profile */
router.get('/', function (req, res, next) {
  let userController = new UserController;
  const result = userController.profile(req, res);
  result.then(result => result !== null && result !== undefined ? res.json(result) : next(new Error('Controller Error'))).catch(e => next(e));
});

/* POST save user */
router.post('/', function (req, res, next) {
  let userController = new UserController;
  const result = userController.save(req, res);
  result.then(result => result !== null && result !== undefined ? res.json(result) : next(new Error('Controller Error'))).catch(e => next(e));
});

/* POST login user */
router.post('/login', function (req, res, next) {
  let userController = new UserController;
  const result = userController.login(req, res);
  result.then(result => result !== null && result !== undefined ? res.json(result) : next(new Error('Controller Error'))).catch(e => next(e));
});

/* GET inbox user */
router.get('/inbox', function (req, res, next) {
  let userController = new UserController;
  const result = userController.inbox(req, res);
  result.then(result => result !== null && result !== undefined ? res.json(result) : next(new Error('Controller Error'))).catch(e => next(e));
});

module.exports = router;
