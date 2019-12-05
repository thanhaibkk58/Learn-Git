function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
        console.error("Ban da dang nhap!!!!");
        next();
    } else{
        console.error("Ban chua dang nhap!!!!");
        res.redirect("/login");
    }
}

module.exports = checkAuthentication;
