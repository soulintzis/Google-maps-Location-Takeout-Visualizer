const user = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirm_password = document.getElementById('confirm'); 

const form = document.getElementById('signup-form');

function isEmpty(value){
    if (value === ''){
        return true;
    }
    return false;
}


function validateUsername(){
    if(isEmpty(user.value)) {
        document.getElementById('username_mes').innerHTML = "*Empty username field";
        document.getElementById('username').style.border = "2px solid #ED6160";
        return false;
    }else if(!checkUsernameFormat(user)) {
        document.getElementById('username_mes').innerHTML = "*Invalid username format";
        document.getElementById('username').style.border = "2px solid #ED6160";
        return false;
    }else if(checkUsernameFormat(user)) {
        document.getElementById('username_mes').innerHTML = "";
        document.getElementById('username').style.border = "2px solid #4BB543";
        return true;
    }
    return false;
}

function checkUsernameFormat(field){
    usernameRegEx = /^(?=.{8,50}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    var usernameResult = usernameRegEx.test(field.value);
    if(usernameResult){
        return true;
    } else {
        return false;
    }
}

function validateEmail(){
    if(isEmpty(email.value)) {
        document.getElementById('email_mes').innerHTML = "*Empty email field";
        document.getElementById('email').style.border = "2px solid #ED6160";
        return false;
    }else if(!checkEmailFormat(email)) {
        document.getElementById('email_mes').innerHTML = "*Invalid email format";
        document.getElementById('email').style.border = "2px solid #ED6160";
        return false;
    }else if(checkEmailFormat(email)) {
        document.getElementById('email_mes').innerHTML = "";
        document.getElementById('email').style.border = "2px solid #4BB543";
        return true;
    }
    return false;
}

function checkEmailFormat(field){
    emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var emailResult = emailRegEx.test(field.value)
    if(emailResult){
        return true;
    } else {
        return false;
    }
}

function validatePassword(){
    if(isEmpty(password.value)) {
        document.getElementById('pass_mes').innerHTML = "*Empty password field";
        document.getElementById('password').style.border = "2px solid #ED6160";
        return false;
    }else if(!checkPasswordFormat(password)) {
        document.getElementById('pass_mes').innerHTML = "*Password must contain at least one uppercase letter, one number and one symbol";
        document.getElementById('password').style.border = "2px solid #ED6160";
        return false;
    }else if(checkPasswordFormat(password)) {
        document.getElementById('pass_mes').innerHTML = "";
        document.getElementById('password').style.border = "2px solid #4BB543";
        return true;
    }
    return false;
}

function checkPasswordFormat(field){
    var passRegEx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    var passwordResult = passRegEx.test(field.value)
    if(passwordResult){
        return true;
    } else {
        return false;
    }
}

function validateConfirmPassword(){
    if(isEmpty(confirm_password.value)){
        document.getElementById('conf_mes').innerHTML = "*Please confirm your password";
        document.getElementById('confirm').style.border = "2px solid #ED6160";
        return false;
    }else if(checkPasswordFormat(password)){     
        if(password.value !== confirm_password.value){
            document.getElementById('conf_mes').innerHTML = "*Passwords should match,please try again";
            document.getElementById('confirm').style.border = "2px solid #ED6160";   
            return false;
        }else{
            document.getElementById('conf_mes').innerHTML = "";
            document.getElementById('confirm').style.border = "2px solid #4BB543";
            return true;
        }
    }
    return false;
}

function validateForm(){
    if( validateUsername() && validateEmail() && validatePassword() && validateConfirmPassword() )
        return true;
    else 
        return false;
}