/**
 * Adds magic 360 library into the page. Can be called multiple times, but library is added only the first time.
 */
var lib360added = false;
let add360Requirements = () => {
    if (lib360added) {
        return;
    }
    lib360added = true;

    // adding 360 css
    let link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = '/content/files/js/magic360lib/magic360.css';
    document.getElementsByTagName('head')[0].appendChild(link);


    // adding 360 script
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '/content/files/js/magic360lib/magic360.js';
    document.getElementsByTagName('head')[0].appendChild(script);

}

/**
 * Adds scripts and html for 360 magic view.
 *
 * @param productID Item No. - id of product
 * @param imageUrl - url of initial image
 */
let add360View = (productID, imageUrl) => {
    // modal window - has to be before button
    document.querySelector('body').insertAdjacentHTML('beforeend', `
                <div id="product360Modal" class="white-popup mfp-hide">
                    <a class="Magic360" data-options="filename: ${productID}_{col}.jpg;column-digits: 4;columns:24;autospin:once;hint:true;">
                        <img src="${imageUrl}" />
                    </a>
                </div>`);
    //#productPage .carousel-image-s-wrapper .slick-list .slick-track
    document.querySelector('#productPage .details-info .description').insertAdjacentHTML('beforeend',
        `<div id="btn360" data-mfp-src="#product360Modal" class="hyp-thumbnail">
                <img src="/content/files/img/360/360icon.jpg">
              </div>
    `);
    // library used by third party on page - requriement
    // https://dimsemenov.com/plugins/magnific-popup/documentation.html
    $('#btn360').magnificPopup({
            type: 'inline',
            closeBtnInside: true,
        callbacks: {
            open: function () {
                add360Requirements();
            },
            close: () => {
            }
        }
    });

    // extra styles
    document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', `
        <style>
           #product360Modal {position: relative;background: #c0bdc8;padding: 0;height: 100vh;width: 100vw;margin: 0;display: flex;align-items: center;justify-content: center;}
           #product360Modal > .Magic360-container { position: fixed !important; }
           #product360Modal .Magic360 > img { max-height: 100vh; max-width: 100vw; }
           .ui-touch-device #product360Modal { position: fixed !important; top: 0 !important; left: 0 !important;}
            #btn360 {cursor: pointer;}
            
        </style>
    `);

}


/**
 * Lazy initialization (page is modified and library loaded ONLY if there are everything needed (like ID of product, image to show...))
 */
document.addEventListener('DOMContentLoaded', () => {
    let isProductPage = document.body.classList.contains('product-details-page') && document.getElementById('productPage') !== null;
    let productID = document.querySelector('*[itemprop="productID"]').innerHTML;

    if (isProductPage && productID.length) { //correct page and findable id, lets do it

        let imageUrl = `/content/files/images/magic360/${productID}/${productID}_0001.jpg`;

        // check if image is available
        fetch(imageUrl, {method: 'HEAD'})
            .then(res => {
                if (res.ok) {
                    setTimeout(() => {
                        add360View(productID, imageUrl);
                    }, 2000);
                }
            }).catch(err => console.log('Error:', err));

    }


})