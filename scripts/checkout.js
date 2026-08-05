import { cart, removeFromCart } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatPrice } from "./utils/money.js";

import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js"; // ecmascript module import syntax for dayjs library

import { deliveryOptions } from "../data/devilveryOptions.js"; // import delivery options data

//use dayja() external library function to get the current date and add 7 days to it, then format it as "dddd, MMMM D" (e.g., "Tuesday, June 21"). This will be used to display the estimated delivery date for the items in the cart. and
const today = dayjs();
const deliveryDate = today.add(7, "day").format("dddd, MMMM D");

let cartSummaryHTML = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;
  let matchingProduct;
  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  cartSummaryHTML += `
     <div class="cart-item-container js-cart-item-container-${matchingProduct.id} ">
    <div class="delivery-date">Delivery date: Tuesday, June 21</div>

    <div class="cart-item-details-grid">
      <img
        class="product-image"
        src="${matchingProduct.image}"
      />

      <div class="cart-item-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-price">${formatPrice(matchingProduct.priceCents)}</div>
        <div class="product-quantity">
          <span>
        
            Quantity: <span class="quantity-label">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary">Update</span>
          <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">Delete</span>
        </div>
      </div>

      <div class="delivery-options">
        <div class="delivery-options-title">Choose a delivery option:</div>
       
        ${deliveryOptionsHTML(matchingProduct, cartItem)}
      </div>
    </div>
  </div>`;
});

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let cartSummaryHTML = "";
  deliveryOptions.forEach((option) => {
    const today = dayjs();
    const deliveryDate = today.add(option.deliveryDays, "day");
    const dateString = deliveryDate.format("dddd, MMMM D");

    const priceString =
      option.priceCents === 0 ? "FREE" : `$${formatPrice(option.priceCents)}-`;

    const isChecked = cartItem.deliveryOptionId === option.id ? "checked" : "";
    console.log("isChecked:", isChecked); // Log the value of isChecked to the console

    cartSummaryHTML += `
      <div class="delivery-option">
        <input
          type="radio"
         ${isChecked}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}"
        
        />
        <div>
          <div class="delivery-option-date">${dateString}</div>
          <div class="delivery-option-price">${priceString} shipping</div>
        </div>
      </div>`;
  });
  return cartSummaryHTML;
}

document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

document.querySelectorAll(".js-delete-link").forEach((deleteLink) => {
  deleteLink.addEventListener("click", () => {
    // Handle delete functionality
    const productId = deleteLink.dataset.productId;
    removeFromCart(productId);
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`,
    );
    container.remove();
  });
});
