const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


//validacion de email
let emailLengthChecker = (email) => {
    if(!email){
        return false;
    } else {
        if(email.length < 5 || email.length >30){
            return false;
        } else {
            return true;
        }
    }
};

let validEmailCHecker = (email) => {
    if(!email){
        return false;
    } else {
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
};

const emailValidators = [
    {
        validator: emailLengthChecker, message: 'El email debe tener entre 5 y 30 caracteres.'
    },
    {
        validator: validEmailCHecker, message: 'Ingrese un email valido.'
    }
];

//validacion de username
let usernameLengthChecker = (username) => {
    if(!username){
        return false;
    } else {
        if(username.length < 3 || username.length >15){
            return false;
        } else {
            return true;
        }
    }
};

let validUsername = (username) => {
    if(!username){
        return false;
    } else {
       const regExp = RegExp(/^[a-zA-Z0-9]+$/);
       return regExp.test(username);
    }
};

const usernameValidators = [
    {
        validator: usernameLengthChecker, message: 'El nombre de usuario debe tener entre 3 y 15 caracteres.'
    },
    {
        validator: validUsername, message: 'El nombre de usuario no puede tener caracteres especiales.'
    }
];

let passwordLengthChecker = (password) => {
    if(!password){
        return false;
    } else {
        if(password.length < 8 || password.length > 35){
            return false;
        } else {
            return true;
        }
    }
};

let validPassword = (password) => {
    if(!password){
        return false;
    } else {
       const regExp = RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
       return regExp.test(password);
    }
};

const passwordValidators = [
    {
        validator: passwordLengthChecker, message: 'La contraseña debe tener entre 8 y 35 caracteres.'
    },
    {
        validator: validPassword, message: 'La contraseña debe poseer por lo menos un caracter especial, una mayuscula, una minuscula y un numero.'
    }
];


//schema de usuario
const userSchema = new Schema({
    email: {type: String, required: true, unique: true, lowercase: true, validate: emailValidators},
    username: {type: String, required: true, unique: true, lowercase: true, validate: usernameValidators},
    password: {type: String, required: true, validate: passwordValidators}
});

userSchema.pre('save', function(next) {
    if(!this.isModified('password')) 
    return next();
    
    bcrypt.hash(this.password, null, null, (err, hash) => {
        if(err) return next(err);
        this.password = hash;
        next();
    });
});

userSchema.methods.comparePassword = (password) => {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);