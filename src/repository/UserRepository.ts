import { EntityRepository, Repository, getRepository, Not, In, MoreThanOrEqual } from "typeorm";
import { ContactRequest } from "../entity/ContactRequest";
import { User } from "../entity/User";
import { ContactResponse } from "../entity/ContactResponse";
import { request } from "https";
var PenpalsDateUtils = require('../helper/PenpalsDateUtils');
var AppConfig = require('../app_config');
var DateHelper = require('../helper/PenpalsDateUtils');

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

    getDeliveredRequests(user: User) {
        var contactRequestRepository = getRepository(ContactRequest);
        return contactRequestRepository.createQueryBuilder('request')
            .select("request.id")
            .innerJoin(
                'request.usersDelivered',
                'user',
                '(user.username = :username)',
                { username: user.username }
            ).where("(request.isActive = '1' AND request.requestCreateTime >= '" + DateHelper.getRequestExpirationDate().toString() + "')").getMany();
    }

    async getUndeliveredRequests(user: User){
        var contactRequestRepository = getRepository(ContactRequest);

        var deliveredRequests = await this.getDeliveredRequests(user);
        

        var deliveredRequestsIds = new Array();
        deliveredRequests.forEach(req => {
                deliveredRequestsIds.push(req.id);
            });

        var queryBuilderParams = null;
            if (deliveredRequestsIds.length > 0) {
                queryBuilderParams = {
                    id: Not(In(deliveredRequestsIds)),
                    isActive: 1,
                    requestCreateTime: MoreThanOrEqual(DateHelper.getRequestExpirationDate().toString())
                };
            } else {
                queryBuilderParams = {
                    isActive: 1,
                    requestCreateTime: MoreThanOrEqual(DateHelper.getRequestExpirationDate().toString())
                };
            }
        const undeliveredRequests = await contactRequestRepository.createQueryBuilder('request').where(queryBuilderParams).getMany();

        return undeliveredRequests;
    }

    getUndeliveredResponses(user: User) {
        var contactResponseRepository = getRepository(ContactResponse);

        return contactResponseRepository.find({
            select: ["id"],
            where: {
                user: user,
                isActive: 1,
                isDelivered: 0,
                resposeCreateTime: DateHelper.getRequestExpirationDate().toString()
            }
        });

        //return contactResponseRepository.createQueryBuilder('response')
        //.select("response.id")
        //.where("response.userId = '" + user.id + "' AND response.isActive = '1' AND response.isDelivered = '0' AND response.resposeCreateTime >= '" + DateHelper.getRequestExpirationDate().toString() + "'").getMany();
    }

    getUnreadResponses(user: User) {
        var contactResponseRepository = getRepository(ContactResponse);
        return contactResponseRepository.find({
            relations:["contactRequest","user"],
            where: { recipient: user, isActive: 1, isDelivered: 0 }
        });
    }

}