// Header Phone
function headerPhone() {
    const phoneContainer = document.querySelector(".top-info"),
        phoneText = document.querySelector(".top-info").innerHTML,
        beforePhone = phoneText.split('+')[0],
        phoneNumber = phoneText.substring(phoneText.indexOf('+') - 1);

    phoneContainer.innerHTML = beforePhone + '<a href="tel:'+phoneNumber+'">'+phoneNumber+'</a>';
}
