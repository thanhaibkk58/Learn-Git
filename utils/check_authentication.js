function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
        console.error("Ban da dang nhap!");
        next();
    } else{
        console.error("Ban chua dang nhap thi dang xuat kieu deo gi???");
        res.redirect("/signup");
    }
}

module.exports = checkAuthentication;
