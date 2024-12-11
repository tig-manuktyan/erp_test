import User from "../../../lib/service/src/model/user/user.js";
import CommonService from '../../../lib/shared/src/sequelize/common.service.js';

class UserService extends CommonService {
  constructor() {
    super({ model: User });
  }
}

export default new UserService();