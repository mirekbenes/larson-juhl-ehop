// Footer Address
function footerAddress() {
    const footerNewsletter = document.querySelector("footer .newsletter");

    footerNewsletter.insertAdjacentHTML("afterbegin", '<div class="footer-address"><p>Larson-Juhl s.r.o.<br />Tovární 177, 381 01 Český Krumlov</p></div>');

    /*const phoneContainer = document.querySelector(".top-info"),
        phoneText = document.querySelector(".top-info").innerHTML,
        beforePhone = phoneText.split('+')[0],
        phoneNumber = phoneText.substring(phoneText.indexOf('+') - 1);

    phoneContainer.innerHTML = beforePhone + '<a href="tel:'+phoneNumber+'">'+phoneNumber+'</a>';*/
}
