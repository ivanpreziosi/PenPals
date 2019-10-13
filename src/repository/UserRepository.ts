import { EntityRepository, Repository } from "typeorm";
import { ContactRequest } from "../entity/ContactRequest";
import { User } from "../entity/User";
var PenpalsDateUtils = require('../helper/PenpalsDateUtils');
var AppConfig = require('../app_config');

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    findByUsername(usernameToSearch: string) {
        return this.findOne({ username: usernameToSearch });
    }

    deleteAuthToken(user: User) {
        user.sessionToken = null;
        user.sessionCreateTime = null;
        return this.save(user);
    }

    findByHeaderAuth(usernameToSearch: string, tokenToSearch: string) {
        return this.findOne({ username: usernameToSearch, sessionToken: tokenToSearch });
    }

    checkTokenExpiration(user: User) {
        var moment = require('moment');
        var tokenDate = moment(user.sessionCreateTime).format(AppConfig.dbDateFormat);
        var expirationdate = PenpalsDateUtils.getTokenExpirationDate();

        if (tokenDate < expirationdate) {
            console.log("token expired!");
            return false;
        } else {
            console.log("token still valid!");
            user.sessionCreateTime = PenpalsDateUtils.getMysqlDateNow();
            this.save(user);
            return true;
        }
    }

}