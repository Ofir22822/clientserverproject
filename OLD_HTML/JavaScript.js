
/**
 * check email element value is valid email address
 * @param {any} email
 */
function emailValid(email) {
    var errorEmail = "";

    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.value))
        return true;

    errorEmail = "Invalid email address!\n";

    return errorEmail;
}

/**
 * check password element value is valid password, 6 letters, and has: upper case letter, lower case letter, number, and special character
 * @param {any} password
 */
function passwordValid(password) {
    var errorPassword = "";

    errorPassword += !(password.value.length >= 6) ? "Minimum 6 letters.\n" : "";

    errorPassword += !(/[a-z]/.test(password.value)) ? "Lowercase letters.\n" : "";

    errorPassword += !(/[A-Z]/.test(password.value)) ? "Uppercase letters.\n" : "";

    errorPassword += !(/[0-9]/.test(password.value)) ? "Include Number.\n" : "";

    errorPassword += !(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password.value)) ? "Special Character letters." : "";

    if (errorPassword == "")
        return true;

    return errorPassword;
}

/**
 * check login form fields, show alert if fields are valid
 * */
function loginCheck() {
    var msgError = document.getElementById("msgError");
    var email = document.getElementById("userEmail");
    var password = document.getElementById("userPassword");
    var mdlEmail = document.getElementById("mdlEmail");
    var mdlPassword = document.getElementById("mdlPassword");

    var flagEmail = emailValid(email);              //valid email, if not valid returns error massage string
    var flagPassword = passwordValid(password);     //valid password, if not valid returns error massage string

    msgError.innerText = "";

    if (flagEmail != true) {                        //add error massage if email invalid, and change field border to red
        msgError.innerText += flagEmail;
        email.classList.add("is-invalid");        
    }
    else
        email.classList.remove("is-invalid");        //if valid remove red border

    if (flagPassword != true) {                     //add error massage if password invalid, and change field border to red
        msgError.innerText += "\nInvalid password! password must contain:\n";
        msgError.innerText += flagPassword;
        password.classList.add("is-invalid"); 
    }
    else
        password.classList.remove("is-invalid");     //if valid remove red border



    if (msgError.innerText == "")                   //no error massages, fields are valid, show alert
    {
        mdlEmail.innerText = email.value;
        mdlPassword.innerText = password.value;
        $("#myModal").modal();
    }
}

/**
 * check sing up form fields, show alert if fields are valid
 * */
function createAccount() {
    var msgError = document.getElementById("msgError");
    var email = document.getElementById("userEmail");
    var password = document.getElementById("userPassword");
    var passwordConfirm = document.getElementById("userPasswordConfirm");
    var mdlEmail = document.getElementById("mdlEmail");
    var mdlPassword = document.getElementById("mdlPassword");

    msgError.innerText = "";

    var flagEmail = emailValid(email);              //valid email, if not valid returns error massage string
    var flagPassword;

    if (flagEmail != true) {                        //add error massage if email invalid, and change field border to red
        msgError.innerText += flagEmail;
        email.classList.add("is-invalid"); 
    }
    else
        email.classList.remove("is-invalid");         //if valid remove red border

    if (password.value == passwordConfirm.value) {  //check passwords are matching, if matching valid password
        flagPassword = passwordValid(password);     //valid password, if not valid returns error massage string
        if (flagPassword != true) {                 //add error massage if password invalid, and change field border to red
            msgError.innerText += "\nInvalid password! password must contain:\n";
            msgError.innerText += flagPassword;
            password.classList.add("is-invalid");
        }
        else
            password.classList.remove("is-invalid");        //if valid remove red border
        passwordConfirm.classList.remove("is-invalid"); 
    }
    else {
        msgError.innerText += "Passwords do not match!"     //add error massage when passwords not matching
        password.classList.add("is-invalid"); 
        passwordConfirm.classList.add("is-invalid"); 
    }

    if (msgError.innerText == "")                   //no error massages, fields are valid, show alert
    {
        mdlEmail.innerText = email.value;
        mdlPassword.innerText = password.value;
        $("#myModal").modal();
    }

}

function contactSubmitCheck(){
    var msgError = document.getElementById("msgError");
    var email = document.getElementById("userEmail");
    var name = document.getElementById("userName");
    var title = document.getElementById("userTitle");
    var subject = document.getElementById("userSubject");
    var mdlEmail = document.getElementById("mdlEmail");
    var mdlName = document.getElementById("mdlName");
    var mdlTitle = document.getElementById("mdlTitle");
    var mdlSubject = document.getElementById("mdlSubject");

    var flagEmail = emailValid(email);              //valid email, if not valid returns error massage string

    msgError.innerText = "";

    if (flagEmail != true) {                        //add error massage if email invalid, and change field border to red
        msgError.innerText += flagEmail;
        email.classList.add("is-invalid");
    }
    else
        email.classList.remove("is-invalid");        //if valid remove red border

    if (name.value == "") {                        //add error massage if email invalid, and change field border to red
        msgError.innerText += "Name field empty!\n";
        name.classList.add("is-invalid");
    }
    else
        name.classList.remove("is-invalid");        //if valid remove red border

    if (title.selectedIndex == 0) {                        //add error massage if email invalid, and change field border to red
        msgError.innerText += "subject type field empty!\n";
        title.classList.add("is-invalid");
    }
    else
        title.classList.remove("is-invalid");        //if valid remove red border

    if (subject.value == "") {                        //add error massage if email invalid, and change field border to red
        msgError.innerText += "subject field empty!\n";
        subject.classList.add("is-invalid");
    }
    else
        subject.classList.remove("is-invalid");        //if valid remove red border

    if (msgError.innerText == "")                   //no error massages, fields are valid, show alert
    {
        mdlName.innerText = name.value;
        mdlEmail.innerText = email.value;
        mdlTitle.innerText = title[title.selectedIndex].text;
        mdlSubject.innerText = subject.value;
        $("#myModal").modal();
    }

}
