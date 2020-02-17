import { UserController } from "../controller/UserController";
import { ContactRequestController } from "../controller/ContactRequestController";
import { ContactResponseController } from "../controller/ContactResponseController";

var express = require('express');
var router = express.Router();

var AppConfig = require('../app_config');
var Auth = require('../helper/PenpalsAuthentication');

/* GET logged user requests */
router.get('/mine', function (req, res, next) {
  let contactRequestController = new ContactRequestController;
  const result = contactRequestController.mine(req, res);
  result.then(result => result !== null && result !== undefined ? res.json(result) : next(new Error('Controller Error'))).catch(e => next(e));
});

/* POST save request */
router.post('/', function (req, res, next) {
  let contactRequestController = new ContactRequestController;
  const result = contactRequestController.save(req, res);
  result.then(result => result !== null && result !== undefined ? res.json(result) : next(new Error('Controller Error'))).catch(e => next(e));
});

/* GET  all open requests */
router.get('/all', function (req, res, next) {
  let contactRequestController = new ContactRequestController;
  const result = contactRequestController.all(req, res);
  result.then(result => result !== null && result !== undefined ? res.json(result) : next(new Error('Controller Error'))).catch(e => next(e));
});

/* GET all open request of user */
router.get('/all/:userId', function (req, res, next) {
  let contactRequestController = new ContactRequestController;
  const result = contactRequestController.user(req, res);
  result.then(result => result !== null && result !== undefined ? res.json(result) : next(new Error('Controller Error'))).catch(e => next(e));
});

/* GET  a single request */
router.get('/:reqId', function (req, res, next) {
  let contactRequestController = new ContactRequestController;
  const result = contactRequestController.single(req, res);
  result.then(result => result !== null && result !== undefined ? res.json(result) : next(new Error('Controller Error'))).catch(e => next(e));
});

module.exports = router;
