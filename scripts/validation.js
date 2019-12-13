const user = document.getElementById('username_id');
const email = document.getElementById('email_id');
const password = document.getElementById('password_id');
const confirm_password = document.getElementById('confirm_password_id'); 

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
        document.getElementById('username_id').style.border = "1px solid #ED6160";
    }else if(!checkUsernameFormat(user)) {
        document.getElementById('username_mes').innerHTML = "*Invalid username format";
        document.getElementById('username_id').style.border = "1px solid #ED6160";
    }else if(checkUsernameFormat(user)) {
        document.getElementById('username_mes').innerHTML = "";
        document.getElementById('username_id').style.border = "1px solid #4BB543";
    }
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
        document.getElementById('email_id').style.border = "1px solid #ED6160";
    }else if(!checkEmailFormat(email)) {
        document.getElementById('email_mes').innerHTML = "*Invalid email format";
        document.getElementById('email_id').style.border = "1px solid #ED6160";
    }else if(checkEmailFormat(email)) {
        document.getElementById('email_mes').innerHTML = "";
        document.getElementById('email_id').style.border = "1px solid #4BB543";
    }
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
        document.getElementById('password_id').style.border = "1px solid #ED6160";
    }else if(!checkPasswordFormat(password)) {
        document.getElementById('pass_mes').innerHTML = "*Password must contain at least one uppercase letter, one number and one symbol";
        document.getElementById('password_id').style.border = "1px solid #ED6160";
    }else if(checkPasswordFormat(password)) {
        document.getElementById('pass_mes').innerHTML = "";
        document.getElementById('password_id').style.border = "1px solid #4BB543";
    }
    return true;
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
        document.getElementById('confirm_password_id').style.border = "1px solid #ED6160";
    }else if(checkPasswordFormat(password)){     
            if(password.value !== confirm_password.value){
                document.getElementById('conf_mes').innerHTML = "*Passwords should match,please try again";
                document.getElementById('confirm_password_id').style.border = "1px solid #ED6160";   
            }else{
                document.getElementById('conf_mes').innerHTML = "";
                document.getElementById('confirm_password_id').style.border = "1px solid #4BB543";
            }
        }
}

function validation(){
    if( validateUsername() & validateEmail() & validatePassword() & validateConfirmPassword() )
        return true;
    else 
        return false;
}