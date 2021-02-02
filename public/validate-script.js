var recaptchaBox;
var isLocal = false;
var onloadCallback = function () {
    recaptchaBox = grecaptcha.render('recaptchaBox', {
        'sitekey': '6Le8GRQaAAAAAFKVNVNNWic08gW1AhA5XI49B6SC',
        'theme': 'light'
    });
};

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
        var username = null;       
        var remember = localStorage.getItem("userRemember");
        if (remember == "true") { //remember save in localStorage
            username = localStorage.getItem("userName");
        }
        else {  //no //remember save for one session
            username = sessionStorage.getItem("userName");
        }

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

    // for recapcha, Initialize scaling
    scaleCaptcha();

    // Update scaling on window resize
    // Uses jQuery throttle plugin to limit strain on the browser
    $(window).resize(scaleCaptcha);

});

function logoutUser() {
    localStorage.clear();
    sessionStorage.clear();  
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

    errorEmail = "Invalid email address!<br>";

    return errorEmail;
}

function checkEmailValid() {
    var email = document.getElementById("userEmail");
    var msgError = document.getElementById("msgError");
    var errorEmail = "";

    if (email.value != "" && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.value)) {
        if (!checkRecaptcha()) {
            msgShow($("#msgError"), "error", "Fill Recapche.");
            return false;
        }
        return true;
    }

    email.classList.add("is-invalid");
    msgShow($("#msgError"), "error", "Invalid email address!");

    return false;
}

function checkPasswordValid() {
    var password = document.getElementById("userPassword");
    var passwordConfirm = document.getElementById("userConfirmPassword");
    var msgError = "";

    if (password.value == passwordConfirm.value) {  //check passwords are matching, if matching valid password
        flagPassword = passwordValid(password);     //valid password, if not valid returns error massage string
        if (flagPassword != true) {                 //add error massage if password invalid, and change field border to red
            msgError = "<br>Invalid password! password must contain:<br>";
            msgError += flagPassword;
            password.classList.add("is-invalid");
        }
        else
            return true;
    }
    else {
        msgError = "Passwords do not match!"     //add error massage when passwords not matching
        password.classList.add("is-invalid");
        passwordConfirm.classList.add("is-invalid");
    }

    msgShow($("#msgError"), "error", msgError);

    return false;
}

/**
 * check password element value is valid password, 6 letters, and has: upper case letter, lower case letter, number, and special character
 * @param string password
 */
function passwordValid(password) {
    var errorPassword = "";

    errorPassword += !(password.value.length >= 6) ? "Minimum 6 letters.<br>" : "";

    errorPassword += !(/[a-z]/.test(password.value)) ? "Lowercase letters.<br>" : "";

    errorPassword += !(/[A-Z]/.test(password.value)) ? "Uppercase letters.<br>" : "";

    errorPassword += !(/[0-9]/.test(password.value)) ? "Include Number.<br>" : "";

    errorPassword += !(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password.value)) ? "Special Character letters." : "";

    if (errorPassword == "")
        return true;

    return errorPassword;
}

/**
 * check login form fields, show alert if fields are valid
 * */
function loginCheck() {
    var msgError = "";
    var email = document.getElementById("userEmail");
    var password = document.getElementById("userPassword");

    var flagEmail = emailValid(email);              //valid email, if not valid returns error massage string
    var flagPassword = passwordValid(password);     //valid password, if not valid returns error massage string

    if (flagEmail != true) {                        //add error massage if email invalid, and change field border to red
        msgError += flagEmail;
        email.classList.add("is-invalid");
    }
    else
        email.classList.remove("is-invalid");        //if valid remove red border

    if (flagPassword != true) {                     //add error massage if password invalid, and change field border to red
        msgError += "<br>Invalid password! password must contain:<br>";
        msgError += flagPassword;
        password.classList.add("is-invalid");
    }
    else
        password.classList.remove("is-invalid");     //if valid remove red border

    if (msgError == "") {
        return true;
    }

    msgShow($("#msgError"), "error", msgError);
    return false;
}

/**
 * check sing up form fields, show alert if fields are valid
 * */
function createAccountCheck() {
    var msgError = "";
    var firstname = document.getElementById("userFirstName");
    var lastname = document.getElementById("userLastName");
    var email = document.getElementById("userEmail");
    var password = document.getElementById("userPassword");
    var passwordConfirm = document.getElementById("userConfirmPassword");
    var promoCode = document.getElementById("userPromoCode");

    var flagEmail = emailValid(email);              //valid email, if not valid returns error massage string
    var flagPassword;

    if (firstname.value == "") {
        msgError += "Invalid first name!<br>";
        firstname.classList.add("is-invalid");
    }

    if (lastname.value == "") {
        msgError += "Invalid last name!<br>";
        lastname.classList.add("is-invalid");
    }

    if (flagEmail != true) {                        //add error massage if email invalid, and change field border to red
        msgError += flagEmail;
        email.classList.add("is-invalid");
    }

    if (password.value == passwordConfirm.value) {  //check passwords are matching, if matching valid password
        flagPassword = passwordValid(password);     //valid password, if not valid returns error massage string
        if (flagPassword != true) {                 //add error massage if password invalid, and change field border to red
            msgError += "<br>Invalid password! password must contain:<br>";
            msgError += flagPassword;
            password.classList.add("is-invalid");
        }
    }
    else {
        msgError += "Passwords do not match!"     //add error massage when passwords not matching
        password.classList.add("is-invalid");
        passwordConfirm.classList.add("is-invalid");
    }

    if (!checkRecaptcha()) {
        msgError += "Fill Recapche.";
    }

    if (msgError == "")                   //no error massages, fields are valid, show alert
        return true;

    msgShow($("#msgError"), "error", msgError);

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

    if (oldData.Name != '' && firstname.value === "")
    {
        $(firstname).addClass("is-invalid");
        msgError.innerText = "Empty first name!\n";
    }
    if (oldData.FamilyName != '' && lastname.value === "")
    {
        $(lastname).addClass("is-invalid");
        msgError.innerText += "Empty last name!\n";
    }
    if (oldData.PhoneNumber != '' && phone.value === "")
    {
        $(phone).addClass("is-invalid");
        msgError.innerText += "Empty phone number!\n";
    }
    if (oldData.Country != '' && country.value === "")
    {
        $(country).addClass("is-invalid");
        msgError.innerText += "Empty country!\n";
    }
    if (oldData.City != '' && city.value === "")
    {
        $(city).addClass("is-invalid");
        msgError.innerText += "Empty city!\n";
    }
    if (oldData.Street != '' && street.value === "")
    {
        $(street).addClass("is-invalid");
        msgError.innerText += "Empty street!\n";
    }
    if (oldData.ZipCode != '' && zipcode.value === "")
    {
        $(zipcode).addClass("is-invalid");
        msgError.innerText += "Empty zip code!\n";
    }

    if (flagEmail != true) {                        //add error massage if email invalid, and change field border to red
        msgError.innerText += flagEmail;
        email.classList.add("is-invalid");
    }
    else
        email.classList.remove("is-invalid");        //if valid remove red border

    if (msgError.innerText == "")                   //no error massages, fields are valid, show alert
        return true;

    msgShow($("#msgError"), "error", msgError.innerText.replace("\n", "<br>"));
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

    msgShow($("#msgErrorPassword"), "error", msgError.innerText.replace("\n", "<br>"));
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

function checkRecaptcha() {
    var response = grecaptcha.getResponse(recaptchaBox);
    if (response.length == 0)
        return false || isLocal;
    else
        return true;
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

function msgShow(msgElem, msgType, msgText) {

    switch (msgType) {
        case "error":
            msgElem.removeClass("alert alert-dismissible alert-success p-3");
            msgElem.addClass("text-danger alert alert-dismissible alert-danger p-3");
            break;
        case "success":
            msgElem.removeClass("text-danger alert alert-dismissible alert-danger p-3");
            msgElem.addClass("alert alert-dismissible alert-success p-3");
            break;
    }

    msgElem.html(msgText);
}

//reCAPTCHA resize to page
function scaleCaptcha(elementWidth) {
    // Width of the reCAPTCHA element, in pixels
    var reCaptchaWidth = 304;
    // Get the containing element's width
    var containerWidth = $('#msgError').width();

    // Only scale the reCAPTCHA if it won't fit
    // inside the container
    if (reCaptchaWidth >= containerWidth) {
        // Calculate the scale
        var captchaScale = containerWidth / reCaptchaWidth;
        // Apply the transformation
        $('.g-recaptcha').css({
            'transform': 'scale(' + captchaScale + ')'
        });
    }
}

$(window).on('load', function () {
    console.log($($("#recaptchaBox").children()[0]).css({ 'margin': '0 auto', 'margin-bottom': '5px' }));
});