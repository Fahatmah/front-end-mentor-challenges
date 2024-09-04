const productListContainer = document.querySelector('.products-list')
const cartContainerEl = document.querySelector('.cart')

document.addEventListener('DOMContentLoaded', () => {
  updateCartDisplay()
  fetchProducts()

  document
    .getElementById('cartConfirmBtn')
    ?.addEventListener('click', confirmOrder)
})

function fetchProducts() {
  fetch('./data.json')
    .then((res) => {
      if (!res.ok) throw new Error('No data fetched')
      return res.json()
    })
    .then((data) => {
      displayProducts(data)
    })
    .catch((error) => {
      console.log(error)
    })
}

function updateCartDisplay() {
  let cart = getItemsLocalStorage()
  const emptyCart = cartContainerEl.querySelector('.cart-empty')
  if (cart.length > 0) {
    emptyCart.style.display = 'none'
    displayCartItems()
  } else emptyCart.style.display = 'flex'
}

function displayProducts(products) {
  const cart = getItemsLocalStorage()

  products.map((product, i) => {
    let article = document.createElement('article')
    article.classList.add('product-item', 'fl-c')

    // checking if item already exist in the cart
    const cartItem = cart.find((item) => item.itemId === String(i + 1))

    article.innerHTML = createProductsHTML(product, i, cartItem)
    productListContainer.append(article)

    if (cartItem) {
      const pictureContainer = article.querySelector('.product-image')
      pictureContainer.classList.add('active')
    }
  })
}

function createProductsHTML(product, i, cartItem) {
  const productID = i + 1
  return `
    <div class="product-image">
      <picture class="fl-c">
        <source srcset=${product.image.desktop} media="(min-width: 1024px)" />
        <source srcset=${product.image.tablet} media="(min-width: 768px)" />
        <source srcset=${product.image.mobile} media="(min-width: 375px)" />
        <img src=${product.image.thumbnail} alt="waffle with berries" />
      </picture>

      <div class="product-buttons fl-c">
        <button id="addToCart" class="fl-c" onclick="addToCart(event)" data-price="${
          product.price
        }" 
                data-name="${
                  product.name
                }" data-item-id="${productID}" style="${
    cartItem ? 'visibility: hidden' : ''
  }">
          <img src="./assets/images/icon-add-to-cart.svg" alt="icon-add-to-cart" /> Add to Cart
        </button>

        ${
          cartItem
            ? `<div class="quantity-control-buttons fl-c">
                <button id="decrementQuantity" class="fl-c" onclick="decrementItem(event)" 
                    data-name="${cartItem.item}" data-item-id="${cartItem.itemId}" 
                    data-price="${cartItem.price}" data-image-thumbnail="${cartItem.imgSrc}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2">
                    <path fill="#fff" d="M0 .375h10v1.25H0V.375Z" />
                  </svg>
                </button>

                <p class="product-quantity" data-quantity="${cartItem.count}">${cartItem.count}</p>

                <button id="incrementQuantity" class="fl-c" onclick="incrementItem(event)" 
                        data-name="${cartItem.item}" data-item-id="${cartItem.itemId}" 
                        data-price="${cartItem.price}" data-image-thumbnail="${cartItem.imgSrc}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                    <path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z" />
                  </svg>
                </button>
              </div>`
            : ''
        }
      </div>
    </div>

    <div class="product-details fl-c">
      <p class="product-category">${product.category}</p>
      <p class="product-name">${product.name}</p>
      <p class="product-price">$${product.price.toFixed(2)}</p>
    </div>
  `
}

function addToCart(e) {
  let button = e.currentTarget

  const parent = button.parentElement
  let pictureContainer = parent.parentElement
  pictureContainer.classList.add('active')

  let productDetails = {
    itemId: button.getAttribute('data-item-id'),
    item: button.getAttribute('data-name'),
    price: parseFloat(button.getAttribute('data-price')).toFixed(2),
    totalPrice: parseFloat(button.getAttribute('data-price')).toFixed(2),
    count: 1,
    imgSrc: e.currentTarget.parentElement.previousElementSibling
      .querySelector('picture img')
      .getAttribute('src'),
  }

  const qtyBtnsContainer = createQtyBtnsContainer(productDetails)

  let quantityBtnsEl = parent.querySelector('.quantity-control-buttons')
  if (!quantityBtnsEl) {
    parent.insertBefore(qtyBtnsContainer, parent.lastChild)
    e.currentTarget.style.visibility = 'hidden'
  }

  addItemLocalStorage(productDetails)
  if (!cartContainerEl.querySelector('.cart-container')) updateCartDisplay()
  updateCartList()
  updateCart()

  document
    .getElementById('cartConfirmBtn')
    .addEventListener('click', confirmOrder)
}

function createQtyBtnsContainer(productDetails) {
  const quantityBtnsContainer = document.createElement('div')
  quantityBtnsContainer.classList.add('quantity-control-buttons', 'fl-c')
  quantityBtnsContainer.innerHTML = quantityBtnsContainerHTML(productDetails)
  console.log(quantityBtnsContainer)

  return quantityBtnsContainer
}

function quantityBtnsContainerHTML(cartItem) {
  return `
    <button id="decrementQuantity" class="fl-c" onclick="decrementItem(event)" 
        data-name="${cartItem.item}" data-item-id="${cartItem.itemId}" 
        data-price="${cartItem.price}" data-image-thumbnail="${cartItem.imgSrc}">
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2">
        <path fill="#fff" d="M0 .375h10v1.25H0V.375Z" />
      </svg>
    </button>

    <p class="product-quantity" data-quantity="${cartItem.count}">${cartItem.count}</p>

    <button id="incrementQuantity" class="fl-c" onclick="incrementItem(event)" 
            data-name="${cartItem.item}" data-item-id="${cartItem.itemId}" 
            data-price="${cartItem.price}" data-image-thumbnail="${cartItem.imgSrc}">
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
        <path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z" />
      </svg>
    </button>
  `
}

function incrementItem(e) {
  let button = e.currentTarget
  const productPrice = parseFloat(button.getAttribute('data-price')).toFixed(2)

  const itemCount = button.previousElementSibling
  let currentQuantity = parseInt(itemCount.getAttribute('data-quantity'))
  currentQuantity++
  itemCount.textContent = currentQuantity
  itemCount.setAttribute('data-quantity', currentQuantity)

  updateItemLocalStorage({
    itemId: button.getAttribute('data-item-id'),
    item: button.getAttribute('data-name'),
    price: parseFloat(button.getAttribute('data-price')).toFixed(2),
    totalPrice: (productPrice * currentQuantity).toFixed(2),
    count: currentQuantity,
    imgSrc: button.getAttribute('data-image-thumbnail'),
  })

  updateCartList()
  updateCart()
}

function decrementItem(e) {
  let button = e.currentTarget
  const productID = button.getAttribute('data-item-id')
  const productPrice = parseFloat(button.getAttribute('data-price')).toFixed(2)

  const itemCount = button.nextElementSibling
  let currentQuantity = parseInt(itemCount.getAttribute('data-quantity'))
  currentQuantity--
  itemCount.setAttribute('data-quantity', currentQuantity)
  itemCount.textContent = currentQuantity

  if (currentQuantity < 1) {
    const addToCartBtn = button.parentElement.previousElementSibling
    let parent = addToCartBtn.parentElement.parentElement
    parent.classList.remove('active')
    addToCartBtn.style.visibility = 'visible'
    button.parentElement.remove()
    currentQuantity = 0

    removeItemLocalStorage(productID)
  } else
    updateItemLocalStorage({
      itemId: button.getAttribute('data-item-id'),
      item: button.getAttribute('data-name'),
      price: productPrice,
      totalPrice: (productPrice * currentQuantity).toFixed(2),
      count: currentQuantity,
      imgSrc: button.getAttribute('data-image-thumbnail'),
    })

  let cart = getItemsLocalStorage()
  let emptyCart = cartContainerEl.querySelector('.cart-empty')
  if (cart.length === 0) {
    cartContainerEl.querySelector('.cart-container').remove()
    emptyCart.style.display = 'flex'
  }

  updateCartList()
  updateCart()
}

function displayCartItems() {
  let existingCartContainer = cartContainerEl.querySelector('.cart-container')
  if (existingCartContainer) existingCartContainer.innerHTML = ''

  let cart = getItemsLocalStorage()
  let cartContainer = document.createElement('div')
  cartContainer.classList.add('cart-container', 'fl-c')
  let cartItems = document.createElement('div')
  cartItems.classList.add('cart-items', 'fl-c')

  let cartItemsContent = cart
    .map((item) => createCartItemContent(item))
    .join('')
  cartItems.innerHTML = cartItemsContent
  cartContainer.appendChild(cartItems)

  const cartContents = `
    <div class="cart-order-total fl-c">
      <h4>Order Total</h4>
      <p id="cartTotalPrice" class="cart-total-price">$${cart
        .reduce((a, b) => a + +b.totalPrice, 0)
        .toFixed(2)}</p>
    </div>
    <div class="carbon-neutral-info fl-c">
      <img src="./assets/images/icon-carbon-neutral.svg" alt="icon-carbon-neutral" />
      This is a <strong>carbon-neutral</strong> delivery
    </div>
    <button type="button" id="cartConfirmBtn" class="cart-confirm-btn">confirm order</button>`

  cartContainer.insertAdjacentHTML('beforeend', cartContents)
  cartContainerEl.appendChild(cartContainer)

  setItemRemoveButton()
  updateCart()
}

function updateCartList() {
  let cart = getItemsLocalStorage()
  let cartItems = cartContainerEl.querySelector('.cart-container .cart-items')
  if (cartItems)
    cartItems.innerHTML = cart
      .map((item) => createCartItemContent(item))
      .join('')

  setItemRemoveButton()
}

function createCartItemContent(cartItem) {
  return `<div class="cart-item fl-c">
            <div class="item-info fl-c">
              <p class="item-name">${cartItem.item}</p>
              <div class="item-details fl-c">
                <p class="item-quantity">${cartItem.count}x</p>
                <p class="item-price">@ ${cartItem.price}</p>
                <p class="item-total">$${cartItem.totalPrice}</p>
              </div>
            </div>
            <button type="button" aria-label="Remove cart item" id="removeCartItem" class="fl-c" data-item-id="${cartItem.itemId}">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                <path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z" />
              </svg>
            </button>
          </div>`
}

function setItemRemoveButton() {
  const removeButtons = document.querySelectorAll('#removeCartItem')
  removeButtons.forEach((btn) =>
    btn.addEventListener('click', (e) => {
      let id = e.currentTarget.getAttribute('data-item-id')
      removeCartItem(id)
    })
  )
}

function updateCart() {
  const cart = getItemsLocalStorage()
  const cartItemCountEl = cartContainerEl.querySelector('#cartItemCount')
  const cartTotalPriceEl = cartContainerEl.querySelector('#cartTotalPrice')

  if (cartItemCountEl) cartItemCountEl.textContent = `(${cart.length})`

  if (cartTotalPriceEl) {
    const totalPrice = cart
      .reduce((total, item) => total + parseFloat(item.totalPrice), 0)
      .toFixed(2)
    cartTotalPriceEl.textContent = `$${totalPrice}`
  }
}

function removeCartItem(itemId) {
  removeItemLocalStorage(itemId)

  updateCartList()
  updateCart()

  const addToCartButton = document.querySelector(
    `.product-item .product-buttons button[data-item-id="${itemId}"]`
  )

  removeItemStyles(addToCartButton)

  let cart = getItemsLocalStorage()
  let emptyCart = cartContainerEl.querySelector('.cart-empty')
  if (cart.length === 0) {
    cartContainerEl.querySelector('.cart-container').remove()
    emptyCart.style.display = 'flex'
  }
}

function removeItemStyles(btn) {
  if (btn) {
    btn.style.visibility = 'visible'

    const productContainer = btn.closest('.product-image')
    if (productContainer) productContainer.classList.remove('active')

    const quantityControl = btn.nextElementSibling
    if (
      quantityControl &&
      quantityControl.classList.contains('quantity-control-buttons')
    )
      quantityControl.remove()
  }
}

function confirmOrder() {
  let cart = getItemsLocalStorage()
  const orderModal = document.querySelector('.order-confirm-container')
  const orderList = orderModal.querySelector('.order-list')
  orderModal.style.display = 'flex'
  document.body.style.overflow = 'hidden'

  orderList.innerHTML = cart
    .map((item) => {
      return `<div class="order-item fl-c">
                <div class="order-info fl-c">
                  <div class="order-image fl-c">
                    <img
                      src="${item.imgSrc}"
                      alt="${item.item}"
                    />
                </div>

                <div class="order-details fl-c">
                  <p class="order-name">${item.item}</p>

                  <div class="order-price fl-c">
                    <p class="quantity">${item.count}x</p>
                    <p class="price">@ $${item.price}</p>
                  </div>
                </div>
              </div>

              <p class="order-item-total-price">$${(
                parseFloat(item.price) * item.count
              ).toFixed(2)}</p>
            </div>`
    })
    .join('')

  const orderTotal = `<div class="order-total fl-c">
                        <h6>order total</h6>
                        <p class="order-total-price">$${cart
                          .reduce((a, b) => a + +b.totalPrice, 0)
                          .toFixed(2)}</p>
                      </div>`
  orderList.insertAdjacentHTML('beforeend', orderTotal)
}

function startNewOrder() {
  let emptyCart = cartContainerEl.querySelector('.cart-empty')
  let orderConfirmModal = document.querySelector('.order-confirm-container')
  clearCartLocalStorage()
  updateCart()

  document.querySelectorAll('.quantity-control-buttons').forEach((btn) => {
    removeItemStyles(btn.previousElementSibling)
  })

  orderConfirmModal.style.display = 'none'
  document.getElementById('cartConfirmBtn').parentElement.remove()
  emptyCart.style.display = 'flex'
  document.body.style.overflow = 'unset'
}

function setItemLocalStorage(cart) {
  localStorage.setItem('cart', JSON.stringify(cart))
}

function getItemsLocalStorage() {
  return JSON.parse(localStorage.getItem('cart')) || []
}

function addItemLocalStorage(item) {
  let cart = getItemsLocalStorage()
  cart.push(item)
  setItemLocalStorage(cart)
}

function updateItemLocalStorage(updateItem) {
  let cart = getItemsLocalStorage()
  let index = cart.findIndex((item) => item.itemId === updateItem.itemId)

  if (index !== -1) {
    cart[index] = updateItem
    setItemLocalStorage(cart)
  }
}

function removeItemLocalStorage(productId) {
  let cart = getItemsLocalStorage()
  cart = cart.filter((item) => item.itemId !== productId)
  setItemLocalStorage(cart)
}

function clearCartLocalStorage() {
  localStorage.removeItem('cart')
}
