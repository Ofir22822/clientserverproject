
$(document).ready(function () {

    //remove invalid class when value in input change
    $('input').change(function () {
        if ($("#" + $(this).attr('id')).hasClass('is-invalid'))
            $("#" + $(this).attr('id')).removeClass('is-invalid');
    });

    $('input').keypress(function () {
        if (($("#" + $(this).attr('id')).hasClass('is-invalid')))
            $("#" + $(this).attr('id')).removeClass('is-invalid');
    });

    $(document).ready(function () {
        var username = localStorage.getItem("userName");
        if (username != null) {
            $("#username").text(username);
            $("#userMenu").removeClass("d-none");
            $("#guestMenu").addClass("d-none");
        }
        else {
            $("#username").text("Guest");
            $("#userMenu").addClass("d-none");
            $("#guestMenu").removeClass("d-none");
        }
    });

});

function logoutUser() {
    localStorage.clear();
    window.location.reload();
}

/**
 * check email element value is valid email address
 * @param string email
 */
function emailValid(email) {
    var errorEmail = "";

    if (email.value != "" && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.value))
        return true;

    errorEmail = "Invalid email address!\n";

    return errorEmail;
}

function checkEmailValid() {
    var email = document.getElementById("userEmail");
    var msgError = document.getElementById("msgError");
    var errorEmail = "";

    if (email.value != "" && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.value))
        return true;

    errorEmail = "Invalid email address!\n";
    email.classList.add("is-invalid");
    msgError.innerText += errorEmail;

    return false;
}

function checkPasswordValid() {
    var password = document.getElementById("userPassword");
    var passwordConfirm = document.getElementById("userConfirmPassword");
    var msgError = document.getElementById("msgError");

    if (password.value == passwordConfirm.value) {  //check passwords are matching, if matching valid password
        flagPassword = passwordValid(password);     //valid password, if not valid returns error massage string
        if (flagPassword != true) {                 //add error massage if password invalid, and change field border to red
            msgError.innerText = "\nInvalid password! password must contain:\n";
            msgError.innerText += flagPassword;
            password.classList.add("is-invalid");
        }
        else
            return true;
    }
    else {
        msgError.innerText = "Passwords do not match!"     //add error massage when passwords not matching
        password.classList.add("is-invalid");
        passwordConfirm.classList.add("is-invalid");
    }

    return false;
}

/**
 * check password element value is valid password, 6 letters, and has: upper case letter, lower case letter, number, and special character
 * @param string password
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

    if (msgError.innerText == "") {
        /*
        $.ajax({
            url: '/sign-in',
            type: 'POST',
            data: $('#formLogin').serialize(),
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response) {
                $("#msgError").append("<br>");
                $("#msgError").append(response);
            },
            error: function (xhr, status, errmsg) {
                alert(errmsg + "  " + status);
            }
        }).done(function (result) {
            console.log(result);
            if(result != undefined){
                console.log(result);
                localStorage.setItem("userEmail", result.userEmail);
                console.log(localStorage.getItem("userEmail"));
                window.replace("/dashboard");
            }
        });
        */
        return true;
    }

    return false;
}

/**
 * check sing up form fields, show alert if fields are valid
 * */
function createAccountCheck() {
    var msgError = document.getElementById("msgError");
    var firstname = document.getElementById("userFirstName");
    var lastname = document.getElementById("userLastName");
    var email = document.getElementById("userEmail");
    var password = document.getElementById("userPassword");
    var passwordConfirm = document.getElementById("userConfirmPassword");
    var promoCode = document.getElementById("userPromoCode");

    msgError.innerText = "";

    var flagEmail = emailValid(email);              //valid email, if not valid returns error massage string
    var flagPassword;

    if (firstname.value == "") {
        msgError.innerText += "Invalid first name!\n";
        firstname.classList.add("is-invalid");
    }

    if (lastname.value == "") {
        msgError.innerText += "Invalid last name!\n";
        lastname.classList.add("is-invalid");
    }

    if (flagEmail != true) {                        //add error massage if email invalid, and change field border to red
        msgError.innerText += flagEmail;
        email.classList.add("is-invalid");
    }

    if (password.value == passwordConfirm.value) {  //check passwords are matching, if matching valid password
        flagPassword = passwordValid(password);     //valid password, if not valid returns error massage string
        if (flagPassword != true) {                 //add error massage if password invalid, and change field border to red
            msgError.innerText += "\nInvalid password! password must contain:\n";
            msgError.innerText += flagPassword;
            password.classList.add("is-invalid");
        }
    }
    else {
        msgError.innerText += "Passwords do not match!"     //add error massage when passwords not matching
        password.classList.add("is-invalid");
        passwordConfirm.classList.add("is-invalid");
    }

    if (msgError.innerText == "")                   //no error massages, fields are valid, show alert
        return true;

    return false;
}

function updateDetailsCheck(oldData) {
    var msgError = document.getElementById("msgError");
    var firstname = document.getElementById("userUPFirstName");
    var lastname = document.getElementById("userUPLastName");
    var phone = document.getElementById("userUPPhone");
    var country = document.getElementById("userUPCountry");
    var email = document.getElementById("userUPEmail");
    var city = document.getElementById("userUPCity");
    var street = document.getElementById("userUPStreet");
    var zipcode = document.getElementById("userUPZipCode");

    msgError.innerText = "";

    var flagEmail = emailValid(email);              //valid email, if not valid returns error massage string
 
    if (oldData.Name != "" && firstname.value === "")
        msgError.innerText = "Empty first name!\n";
    if (oldData.FamilyName != "" && lastname.value === "")
        msgError.innerText += "Empty last name!\n";
    if (oldData.PhoneNumber != "" && phone.value === "")
        msgError.innerText += "Empty phone number!\n";
    if (oldData.Country != "" && country.value === "")
        msgError.innerText += "Empty country!\n";
    if (oldData.City != "" && city.value === "")
        msgError.innerText += "Empty city!\n";
    if (oldData.Street != "" && street.value === "")
        msgError.innerText += "Empty street!\n";
    if (oldData.ZipCode != "" && zipcode.value === "")
        msgError.innerText += "Empty zip code!\n";

    if (flagEmail != true) {                        //add error massage if email invalid, and change field border to red
        msgError.innerText += flagEmail;
        email.classList.add("is-invalid");
    }
    else
        email.classList.remove("is-invalid");        //if valid remove red border

    if (msgError.innerText == "")                   //no error massages, fields are valid, show alert
        return true;

    $("#msgError").addClass("text-danger");
    $("#msgError").removeClass("text-success");
    return false;
}

function changePasswordCheck() {
    var passwordOld = document.getElementById("userPassword");
    var passwordNew = document.getElementById("userNewPassword");
    var passwordNewConfirm = document.getElementById("userConfirmNewPassword");
    var msgError = document.getElementById("msgErrorPassword");

    if (passwordNew.value == passwordNewConfirm.value) {  //check passwords are matching, if matching valid password
        flagPassword = passwordValid(passwordNew);     //valid password, if not valid returns error massage string
        if (flagPassword != true) {                 //add error massage if password invalid, and change field border to red
            msgError.innerText = "\nInvalid password! password must contain:\n";
            msgError.innerText += flagPassword;
            passwordNew.classList.add("is-invalid");
        }
        else
            return true;
    }
    else {
        msgError.innerText = "Passwords do not match!"     //add error massage when passwords not matching
        passwordNew.classList.add("is-invalid");
        passwordNewConfirm.classList.add("is-invalid");
    }

    return false;
}

function updatePasswordCheck() {
    var msgError = document.getElementById("msgError");
    var firstname = document.getElementById("userUPFirstName");
    var lastname = document.getElementById("userUPLastName");
    var email = document.getElementById("userUPEmail");
    var phone = document.getElementById("userUPPhone");
    var country = document.getElementById("userUPCountry");
    var city = document.getElementById("userUPCity");
    var street = document.getElementById("userUPStreet");
    var zipcode = document.getElementById("userUPZipCode");

    msgError.innerText = "";

    var flagEmail = emailValid(email);              //valid email, if not valid returns error massage string

    if (firstname.value == "") {
        msgError.innerText += "Invalid first name!\n";
        firstname.classList.add("is-invalid");
    }

    if (lastname.value == "") {
        msgError.innerText += "Invalid last name!\n";
        lastname.classList.add("is-invalid");
    }

    if (flagEmail != true) {                        //add error massage if email invalid, and change field border to red
        msgError.innerText += flagEmail;
        email.classList.add("is-invalid");
    }

    if (msgError.innerText == "")                   //no error massages, fields are valid, show alert
        return true;

    return false;
}

function contactSubmitCheck() {
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
