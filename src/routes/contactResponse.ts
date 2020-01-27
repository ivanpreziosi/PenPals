import { UserController } from "../controller/UserController";
import { ContactRequestController } from "../controller/ContactRequestController";
import { ContactResponseController } from "../controller/ContactResponseController";

var express = require('express');
var router = express.Router();

var AppConfig = require('../app_config');
var Auth = require('../helper/PenpalsAuthentication');

/* GET A REQUEST responses */
router.get('/:reqId', function (req, res, next) {
    const authResult = Auth.checkAuth(req);
    authResult.then(function (authResult) {
      let contactResponseController = new ContactResponseController;
      const result = contactResponseController.request(req, res);
      if (result instanceof Promise) {
        result.then(result => result !== null && result !== undefined ? res.json(result) : res.json(require('./tpl/UnauthorizedResponse'))).catch(e => res.json(require('./tpl/UnauthorizedResponse')));
      } else if (result !== null && result !== undefined) {
        res.json(result);
      }
    }, function (err) {
      //authresult ritorna picche!
      console.log("Authorization denied");
      res.json(require('./tpl/UnauthorizedResponse'));
    });
});

/* POST save response */
router.post('/', function (req, res, next) {
    const authResult = Auth.checkAuth(req);
    authResult.then(function (authResult) {
      let contactResponseController = new ContactResponseController;
      const result = contactResponseController.save(req, res);
      if (result instanceof Promise) {
        result.then(result => result !== null && result !== undefined ? res.json(result) : res.json(require('./tpl/UnauthorizedResponse'))).catch(e => res.json(require('./tpl/UnauthorizedResponse')));
      } else if (result !== null && result !== undefined) {
        res.json(result);
      }
    }, function (err) {
      //authresult ritorna picche!
      console.log("Authorization denied");
      res.json(require('./tpl/UnauthorizedResponse'));
    });
});

/* POST deliver response */
router.post('/deliver', function (req, res, next) {
    const authResult = Auth.checkAuth(req);
    authResult.then(function (authResult) {
      let contactResponseController = new ContactResponseController;
      const result = contactResponseController.deliver(req, res);
      if (result instanceof Promise) {
        result.then(result => result !== null && result !== undefined ? res.json(result) : res.json(require('./tpl/UnauthorizedResponse'))).catch(e => res.json(require('./tpl/UnauthorizedResponse')));
      } else if (result !== null && result !== undefined) {
        res.json(result);
      }
    }, function (err) {
      //authresult ritorna picche!
      console.log("Authorization denied");
      res.json(require('./tpl/UnauthorizedResponse'));
    });
});

module.exports = router;
