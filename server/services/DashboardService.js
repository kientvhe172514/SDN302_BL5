const User = require("../model/User");
const Class = require('../model/Class');
const Application  = require('../model/Application')
class DashBoardService {
    async dashboardStatistical(){
        const users = await User.find({$or:[{role:'student'},{role:'teacher'}]}).countDocuments();
        const classes = await Class.find({}).countDocuments();
        const application = await Application.find({}).countDocuments();

        return{
            users, classes, application
        }
    }
}

module.exports = new DashBoardService();