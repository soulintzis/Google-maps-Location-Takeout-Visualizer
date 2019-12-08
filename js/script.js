
const username = document.getElementById('username_id');
const email = document.getElementById('email_id');
const password = document.getElementById('password_id');
const confirm_password = document.getElementById('confirm_password_id'); 

const form = document.getElementById('signup-form');


function validateUsername(){
    if(checkIfEmpty(username)) return;

    if(!checkUsernameFormat(username)) return; 
    return true;
}

function validateEmail(){
    if(checkIfEmpty(email)) return;
    if(!checkEmailFormat(email)) return;
    return true;
}

function validatePassword(){

    if(checkIfEmpty(password)) return;
    if(!checkPasswordFormat(password)) return;

    return true;
}

function validateConfirmPassword(){
    if(password.className !== 'valid'){
        setInvalid(confirm_password, 'Fill out password correctly first');
        return;
    }
    if(password.value !== confirm_password.value){
        setInvalid(confirm_password, 'Passwords should match,please try again!');
        return;
    } else{
        setValid(confirm_password);   
    } 
    return true;
}

/*----------------------------------------------------------------------------------------------------*/


function checkIfEmpty(field){
    if(isEmpty(field.value.trim())){
        setInvalid(field, `This field is required!`);
        return true;
    } else {
        setValid(field);
        return false;
    }
}

function isEmpty(value){
    if (value === ''){
        return true;
    }
    return false;
}

function setInvalid(field, message){
    field.className='invalid';
    $('.error').text(message);
    $('.error').fadeIn("slow");
    //field.nextElementSibling.innerHTML = message; 
    //change message color and style it later
    field.nextElementSibling.style.color = 'red';
}

function setValid(field){
    field.className='valid';
    //check later 
    
}

function checkUsernameFormat(field){
    if(/^(?=.{8,50}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(field.value)){
        setValid(field);
        return true;
    } else {
        setInvalid(field, `Username must contain only letters,numbers and underscores`);
        return false;
    }
}

function checkPasswordFormat(field){
    if(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(field.value)){
        setValid(field);
        return true;
    } else {
        setInvalid(field, `Password must contain at least one uppercase letter, one number and one symbol`);
        return false;
    }
}

function checkEmailFormat(field){
    if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(field.value)){
        setValid(field);
        return true;
    } else {
        setInvalid(field, `Not valid email address, please try again!`);
        return false;
    }
}

