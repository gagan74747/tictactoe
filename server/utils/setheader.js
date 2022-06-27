function setheader(req,res,next){
    res.header('Access-Control-Allow-Headers', 'Content-Type, x-auth-token');
    res.header('Access-Control-Expose-Headers', 'x-auth-token');
    next();
}
module.exports = setheader;