import { UserController } from "../controller/UserController";
import { ContactRequestController } from "../controller/ContactRequestController";
import { ContactResponseController } from "../controller/ContactResponseController";

var express = require('express');
var router = express.Router();

var AppConfig = require('../app_config');
var Auth = require('../helper/PenpalsAuthentication');

/* GET logged user requests */
router.get('/mine', function (req, res, next) {
    const authResult = Auth.checkAuth(req);
    authResult.then(function (authResult) {
      let contactRequestController = new ContactRequestController;
      const result = contactRequestController.mine(req, res);
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

/* POST save request */
router.post('/', function (req, res, next) {
    const authResult = Auth.checkAuth(req);
    authResult.then(function (authResult) {
      let contactRequestController = new ContactRequestController;
      const result = contactRequestController.save(req, res);
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

/* GET  all open requests */
router.get('/all', function (req, res, next) {
    const authResult = Auth.checkAuth(req);
    authResult.then(function (authResult) {
      let contactRequestController = new ContactRequestController;
      const result = contactRequestController.all(req, res);
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

/* GET all open request of user */
router.get('/all/:userId', function (req, res, next) {
    const authResult = Auth.checkAuth(req);
    authResult.then(function (authResult) {
      let contactRequestController = new ContactRequestController;
      const result = contactRequestController.user(req, res);
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

/* GET  a single request */
router.get('/:reqId', function (req, res, next) {
    const authResult = Auth.checkAuth(req);
    authResult.then(function (authResult) {
      let contactRequestController = new ContactRequestController;
      const result = contactRequestController.single(req, res);
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
