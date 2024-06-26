/**
 * this handles product page
 */
import { getInventory, getBasketItems, getInventoryProduct, updateBasketItem, packBasketItems, addBasketItem } from '../js/inventory-module.js';


// add the components that will need on be page
const componentsToLoad = [
    {
        url: 'page-components/navigation-bar.html',
        placeholderId: 'navigation-bar-placeholder'
    },
    {
        url: 'page-components/product-page-product-information.html',
        placeholderId: 'product-page-product-information-placeholder'
    },
    {
        url: 'page-components/product-panel.html',
        placeholderId: 'product-panel-placeholder'
    },
    {
        url:'page-components/leave-a-review.html ',
        placeholderId: 'leave-a-review-placeholder'
    },
    {
        url: 'page-components/footer.html',
        placeholderId: 'footer-placeholder'
    }
]

//remove cart effect time handle
let cartEffectTimerHandle;
// delay on using add to cart effect
const delay = 2000;
// default qty
let quantity = 1;
let addToBasketButton;
let productInventory = null;
let basketItems = [];
let currProduct = null;

addEventListener('DOMContentLoaded', () => loadPage());

/**
 * load page
 */
function loadPage() {
    productInventory = getInventory();
    basketItems = getBasketItems(productInventory);
    componentsToLoad.forEach(component => fetchPage(component.url, component.placeholderId));
    currProduct = getSelectedProduct();
    loadSelectedProduct(currProduct);
    bindButtons();
    pageLayout();
}

/**
 * Adjust You may also like layout
 */
function pageLayout() {
    document.querySelector(".compensation").style.height = "100px";
}

/**
 * bind buttons for the page
 */
function bindButtons() {
    // bind decrease qty button
    document.getElementById('decrease-quantity-button').
    addEventListener('click', () => decreaseQuantity());
    // bind inc qty button
    document.getElementById('increase-quantity-button').
    addEventListener('click', () => increaseQuantity());
    //bind add to basket button
    addToBasketButton = document.getElementById('add-to-basket');
    addToBasketButton.addEventListener('click', () => addToBasket());
    //bind to overlay basket notification button
    document.getElementById('add-to-cart-cross-sign').
    addEventListener('click', () => hideAddToCartEffect());
    //bind continue shopping button
    document.getElementById('continue_shopping_button').
    addEventListener('click', () => hideAddToCartEffect());
    //bind view_cart_button
    document.getElementById('view_cart_button').
        addEventListener('click', ()=> loadBasketPage());
    
    //bind colour buttons
    document.getElementsByClassName('gold')[0].addEventListener('click', () => changeToGold());
    document.getElementsByClassName('black')[0].addEventListener('click', () => changeToBlack());
    document.getElementById('white-circle-button').addEventListener('click', () => changeToSilver());
}

function getSelectedProduct() {
    let selectedProductString = localStorage.getItem("selectedProduct");
    currProduct = selectedProductString ? JSON.parse(selectedProductString) : {};
    return currProduct;
}

function loadSelectedProduct(selectedProduct) {
    console.log("selected product " + selectedProduct.imagePath);
    document.getElementById("product__image").src = selectedProduct.imagePath;
    document.getElementById("product-name").innerText = selectedProduct.name;
    document.getElementById("product__price").innerText = (selectedProduct.price) + ".00";
    document.getElementById('effect_price').innerText = (selectedProduct.price) + ".00";
}

// load the components listed above

// fetch the page and insert it into the placeholder
function fetchPage(url, placeholderId) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(placeholderId).innerHTML = html;
        })
}

/**
 * inc qty button
 */
function increaseQuantity() {
    let quantityDisplay = document.getElementById('product-quantity');
    quantity += 1;
    quantityDisplay.innerHTML = quantity;
}

/**
 * dec qty button 
 */
function decreaseQuantity() {
    let quantityDisplay = document.getElementById('product-quantity');
    if (quantity > 1){
        quantity -= 1;
        quantityDisplay.innerHTML = quantity;
    } else
    {
        quantityDisplay.innerHTML = quantity;
    }
}
function changeToGold()
{
    changeColour("Gold", 'images/light-gold-image.jpg');

}
function changeToSilver()
{
    changeColour("Silver", 'images/light-silver-image.jpg');

}
function changeToBlack()
{
    changeColour("Black", 'images/light-black-image.jpg');
}

/**
 * change selected colour.
 * @param colour
 * @param imageUrl
 */
function changeColour(colour, imageUrl)
{
    let productImage = document.getElementById('product__image');
    productImage.src = imageUrl;
    let currColour = document.getElementById('current-colour-name');
    currColour.innerHTML = "Colour: "+ colour;
}


/**
 * add item to basket
 */
function addToBasket()
{
    addBasketItem(productInventory, basketItems, currProduct.name);
    console.log(basketItems);
    // if (basketItems.contains(currProduct.name)) {
    //     basketItems.push([currProduct],1);
    //     console.log(currProduct);
    // } else {
    //     basketItems[currProduct.name][1]+=1;
    // }
    updateBasketItem(basketItems);
    //update visual
    // updateBasketItem()
    document.getElementById('add-to-cart-effect').classList.add('visible');
    document.getElementById('add-to-cart-effect').classList.remove('hide');
    //hide the cart in 2s
    if (cartEffectTimerHandle)
    {
        cartEffectTimerHandle = setTimeout(()=>hideAddToCartEffect(), delay);
    }
    //show the navigation bar
}

/**
 * hide effect after n sec.
 */
function hideAddToCartEffect()
{
    document.getElementById('add-to-cart-effect').classList.add('hide');
    document.getElementById('add-to-cart-effect').classList.remove('visible');
    if(cartEffectTimerHandle)
    {
        clearTimeout(cartEffectTimerHandle);
    }
}
