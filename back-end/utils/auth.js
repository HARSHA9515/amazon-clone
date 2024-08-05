exports.isAdminLoggedIn = async(req,res, next) =>{
    if(req.session?.user?.role === 'admin'){
        next();
    }else{
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

exports.isAuthenticated = async(req,res, next) =>{
    if(req.session?.user){
        next();
    }else{
        return res.status(401).json({ message: 'Unauthorized' });
    }
}