var express = require('express');
var Router = express.Router();
var chatController = require('../Controller/chatController');
var uploadProfile = require('../Middleware/upload_pic').Profile_pic();
var uploadPortFolio = require('../Middleware/upload_pic').Portfolio_pic();
var UploadDesignPic = require('../Middleware/upload_pic').Design_pic();
var FinalFiles = require('../Middleware/upload_pic').FinalFiles();
var picture = require('../Middleware/pic_resize');
var authController = require('../Controller/authController');
var userController = require('../Controller/userController');
var homeController = require('../Controller/HomeController');
var portfolioController = require('../Controller/portfolioController');
var bidController = require('../Controller/bidController');
var searchController = require('../Controller/searchController');
var contestController = require('../Controller/contestController');
var designController = require('../Controller/designController');
var notificationController = require('../Controller/NotificationController');
var DashboardController = require('../Controller/DashboardController');
var PaymentController = require('../Controller/PaymentController');
var IsLogin=require('../Middleware/Authentication').IsLogin;
var CommentController=require('../Controller/CommentController');
var StrickLoginSignup=require('../Middleware/Authentication').StrickLoginsignup;
var allowCustomer=require('../Middleware/Authentication').allowCustomer;
var allowDeveloper=require('../Middleware/Authentication').allowDeveloper;

module.exports = Router;



//homecontoller
Router.get('/', homeController.home);

//user controller
Router.get('/login',StrickLoginSignup, userController.Loginform);
Router.get('/signup', StrickLoginSignup,userController.RegisterForm);
Router.post('/signup', userController.Rejister);
Router.get('/user/editprofile',IsLogin, userController.editprofile);
Router.post('/user/updateprofile',IsLogin, userController.updateprofile);
Router.post('/user/updatepic',IsLogin ,uploadProfile.single('PROFILE-PIC'), userController.updatepic);
Router.get('/user/changepassword',IsLogin,userController.changePasswordget);
Router.post('/user/changepassword',IsLogin,userController.changePasswordPost);
Router.get('/userid/:id', userController.profile);
Router.get('/user',userController.search);
Router.get('/balance',IsLogin,allowDeveloper,userController.balance);


//authcontroller

Router.post('/login',authController.login);
Router.get('/logout',IsLogin,authController.logout);


//portfolio Controller
Router.get('/user/addportfolio',IsLogin ,portfolioController.addportfolioGet);
Router.post('/user/addportfolio',IsLogin,uploadPortFolio.single('PORTFOLIO'), portfolioController.addportfolioPost);
Router.get('/portfolio/recent', portfolioController.porfolioRecent);
Router.get('/portfolio/popular', portfolioController.portfolioPopular);
Router.post('/portfolio/1/getlike', portfolioController.portLike);
Router.post('/portfolio/1/dislike', portfolioController.portdisLIke);
Router.get('/portfolio/search',portfolioController.search)

//comment
Router.post('/comment/post',IsLogin,CommentController.postComment);






//Bid Routes
Router.get('/addproject',IsLogin ,allowCustomer,bidController.addproject);
Router.post('/addproject', IsLogin,bidController.addprojectPost);
Router.get('/project/:id', bidController.getproject);
Router.post("/project/postbid",IsLogin ,allowDeveloper,bidController.postBid);
Router.post('/project/deletebid',IsLogin,allowDeveloper,bidController.deletebid);
Router.post('/project/assigned/user', IsLogin,bidController.AssignedProject);
Router.get('/uploadproject/:id',IsLogin,allowDeveloper,bidController.uploadSubmitproject);
Router.post('/winprojectfinalfiles/',IsLogin,allowDeveloper,FinalFiles.single('FINALFILE'), bidController.ReciveWinProject);
Router.get('/winproject/finalfiles/:id', IsLogin,allowCustomer,bidController.CheckFinalfiles);
Router.post('/projectsubmit/report',IsLogin ,bidController.projectsubmitreport);



//search routes
Router.get('/projects/page', searchController.getProject);
Router.get('/contests/page', searchController.getContest);
Router.get('/contests/page/search',searchController.searchContest);
Router.get('/projects/page/search', searchController.searchProject);




//contest Routes 

Router.get('/addcontest', IsLogin,allowCustomer,contestController.addContest);
Router.post('/addcontest', IsLogin,contestController.postContest);
Router.get('/contest/:id', contestController.contestBrief);

//contest Design Routes

Router.get('/contestdesign/:id', contestController.contestDesign);
Router.post('/design/submit',IsLogin,allowDeveloper, UploadDesignPic.single('DESIGN'), designController.postDesign);
Router.post('/design/rating',IsLogin, designController.postrating);
Router.post('/design/winner',IsLogin, designController.winnerDesign);
Router.get('/windesign/:id',IsLogin, allowDeveloper,designController.windesign)
Router.post('/windesignfinalfiles',IsLogin,FinalFiles.single('FINALFILE'), designController.receiveFinalfiles)
Router.get('/windesign/finalfiles/:id', IsLogin,allowCustomer,designController.OwnerReceiveFinalfiles);
Router.post('/submit/design/report',IsLogin ,designController.Submitdesignreport)

//contest Seleted Design Routes

Router.get('/selectdesign/:id',IsLogin,designController.designselect);



//chat Route

Router.get('/privatechat/:id',IsLogin ,chatController.chat);
Router.post('/chat/newmessage', IsLogin,chatController.postMessage);
Router.post('/chat/newmessage/markread',IsLogin,chatController.markread);


//get notification

Router.get('/notification', IsLogin,notificationController.GetNotification);
Router.post('/notification/true', IsLogin,notificationController.changeNotification);

//Dashboard
Router.get('/dashboard', IsLogin,DashboardController.GetDashboard);


//Payment

Router.post('/payment',IsLogin,allowCustomer,PaymentController.getPaymentPage);
Router.post('/pay/90/21/32/ok', IsLogin,PaymentController.getpaypageReal);
Router.post('/payment/1994/12/31', IsLogin,PaymentController.paid);