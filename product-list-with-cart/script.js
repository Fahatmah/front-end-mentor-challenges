const productListContainer = document.querySelector('.products-list')
let count = 1

fetch('./data.json')
  .then((res) => {
    if (!res.ok) throw new Error('No data fetched')
    return res.json()
  })
  .then((data) => {
    console.log(data)
    displayProducts(data)
  })
  .catch((error) => {
    console.log(error)
  })

function displayProducts(products) {
  products.map((product) => {
    let article = document.createElement('article')
    article.classList.add('product-item', 'fl-c')
    articleContent = `
      <div class="product-image">
        <picture class="fl-c">
          <source
            srcset=${product.image.desktop}
            media="(min-width: 1024px)"
          />
          <source
            srcset=${product.image.talet}
            media="(min-width: 768px)"
          />
          <source
            srcset=${product.image.mobile}
            media="(min-width: 375px)"
          />
          <img
            src=${product.image.thumbnail}
            alt="waffle with berries"
          />
        </picture>

        <div class="product-buttons">
          <button id="addToCart" class="fl-c" onclick="addToCart(event)" data-name="${
            product.name
          }">
          <img
            src="./assets/images/icon-add-to-cart.svg"
            alt="icon-add-to-cart"
          />
          Add to Cart
            </button>
          </div>
        </div>

        <div class="product-details fl-c">
          <p class="product-category">${product.category}</p>
          <p class="product-name">${product.name}</p>
          <p class="product-price">$${product.price.toFixed(2)}</p>
        </div>
      `
    article.innerHTML = articleContent

    productListContainer.append(article)
  })
}

function addToCart(e) {
  const parent = e.currentTarget.parentElement
  let pictureContainer = parent.parentElement
  pictureContainer.classList.add('active')

  const productName = e.currentTarget.getAttribute('data-name')
  console.log(productName)

  const quantityBtnsContainer = document.createElement('div')
  quantityBtnsContainer.classList.add('quantity-control-buttons', 'fl-c')
  quantityBtnsContainer.innerHTML = `
                <button id="decrementQuantity" class="fl-c" onclick="decrementItem(event)" data-name="${productName}">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="2"
                      fill="none"
                      viewBox="0 0 10 2"
                    >
                      <path fill="#fff" d="M0 .375h10v1.25H0V.375Z" />
                    </svg>
                  </button>

                  <p class="product-quantity" data-quantity="1">1</p>

                  <button id="incrementQuantity" class="fl-c" onclick="incrementItem(event)" data-name="${productName}">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      fill="none"
                      viewBox="0 0 10 10"
                    >
                      <path
                        fill="#fff"
                        d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"
                      />
                    </svg>
                  </button>
                </div>`

  let quantityBtnsEl = parent.querySelector('.quantity-control-buttons')
  if (!quantityBtnsEl) {
    parent.insertBefore(quantityBtnsContainer, parent.lastChild)
    e.currentTarget.style.visibility = 'hidden'
  }
}

function incrementItem(e) {
  const productName = e.currentTarget.getAttribute('data-name')
  const itemCount = e.currentTarget.previousElementSibling
  let currentQuantity = parseInt(itemCount.getAttribute('data-quantity'))

  currentQuantity++
  itemCount.textContent = currentQuantity
  itemCount.setAttribute('data-quantity', currentQuantity)
}

function decrementItem(e) {
  const productName = e.currentTarget.getAttribute('data-name')
  const itemCount = e.currentTarget.nextElementSibling
  let currentQuantity = parseInt(itemCount.getAttribute('data-quantity'))
  currentQuantity--

  itemCount.setAttribute('data-quantity', currentQuantity)
  itemCount.textContent = currentQuantity

  if (currentQuantity < 1) {
    const addToCartBtn = e.currentTarget.parentElement.previousElementSibling
    let parent = addToCartBtn.parentElement.parentElement
    parent.classList.remove('active')
    addToCartBtn.style.visibility = 'visible'
    e.currentTarget.parentElement.remove()
    currentQuantity = 0
  }
}
