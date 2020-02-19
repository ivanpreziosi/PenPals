import { EntityRepository, Repository} from "typeorm";
import { ContactResponse } from "../entity/ContactResponse";
import { User } from "../entity/User";

var AppConfig = require('../app_config');
var DateHelper = require('../helper/PenpalsDateUtils');

@EntityRepository(ContactResponse)
export class ContactResponseRepository extends Repository<ContactResponse> {

    //get user's undelivered responses
    getUndeliveredResponses(user: User) {
        return this.find({
            select: ["id"],
            where: {
                user: user,
                isActive: 1,
                isDelivered: 0,
                resposeCreateTime: DateHelper.getRequestExpirationDate().toString()
            }
        });
    }

    //get all unread responses for my requests
    getUnreadResponses(user: User) {
        return this.find({
            relations: ["contactRequest", "user"],
            where: { recipient: user, isActive: 1, isDelivered: 0 }
        });
    }    

}