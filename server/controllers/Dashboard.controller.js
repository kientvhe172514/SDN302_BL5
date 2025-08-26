const dashboardService = require("../services/DashboardService");

class DashboardController {
  getStatistical = async (req, res, next) => {
    try {
        const result = await dashboardService.dashboardStatistical();
        if(!result){
            res.status(400).json({
                message:'get statistical failed',
                success:false
            })
            return;
        }

        res.status(200).json({
            data:{
                userStatistic: result.users,
                classStatistic: result.classes,
                applicationStatistic: result.application
            },
            success:true,
            message:'get data successfully'
        })
    } catch (error) {
      res.status(500).json({
        message: error,
        status: 400,
      });
    }
  };
}

module.exports = new DashboardController();
