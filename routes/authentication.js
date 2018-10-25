const User = require('../models/user');

module.exports = (router) => {
    router.post('/register', (req, res) => {
        if(!req.body.email){
            res.json({ success: false, message: 'Debes completar el mail.'})
        } else {
            if(!req.body.username){
                res.json({ success: false, message: 'Debes completar el usuario.'})
            } else {
                if(!req.body.password){
                    res.json({ success: false, message: 'Debes completar la contraseña.'})
                } else {
                    let user = new User({
                        email: req.body.email.toLowerCase(),
                        username: req.body.username.toLowerCase(),
                        password: req.body.password
                    });
                    console.log(req.body);

                    user.save((err) => {
                        if(err){
                            if(err.code === 11000){
                                res.json({ success: false, message: 'usuario o mail ya existentes.'})
                            } else {
                                if(err.errors){
                                    if(err.errors.email){
                                        res.json({ success: false, message: err.errors.email.message});
                                    } else {
                                        if(err.errors.username){
                                            res.json({ success: false, message: err.errors.username.message});
                                        } else {
                                            if(err.errors.password){
                                                res.json({ success: false, message: err.errors.password.message});
                                            } else {
                                                res.json({ success:false, message: err });
                                            }
                                        }
                                    }
                                }else{
                                    res.json({ success: false, message: 'No se pudo guardar el usuario: ' + err});
                                }
                            }
                        } else {
                            res.json({ success: true, message:'Usuario guardado'})
                        }
                    })
                }
            }
        }
    });

    return router;
}