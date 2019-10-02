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
        user.session_token = null;
        user.session_create_time = null;
        return this.save(user);
    }

    findByHeaderAuth(usernameToSearch: string, tokenToSearch: string) {
        return this.findOne({ username: usernameToSearch, session_token: tokenToSearch });
    }

    checkTokenExpiration(user: User) {
        var moment = require('moment');
        console.log("checkTokenExpirationz");
        console.log(user.session_create_time);
        var tokenDate = moment(user.session_create_time).format('YYYY-MM-DD HH:mm:ss');
        console.log("tokenDate:" + tokenDate);
        var expirationdate = PenpalsDateUtils.getTokenExpirationDate();
        console.log("expirationdate:" + expirationdate);
        if (tokenDate < expirationdate) {
            console.log("token expired!");
            return false;
        } else {
            console.log("token still valid!");
            return true;
        }
    }

}