const priceRangeSlider = document.getElementById('pricingSlider')
const progressBar = document.querySelector('.progress')
let viewsEl = document.querySelector('.page-views')
let priceEl = document.getElementById('price')
let dateEl = document.querySelector('.date')
let toggleButton = document.getElementById('toggleBill')

const values = [8, 12, 16, 24, 36]
const pageViews = [10, 50, 100, 500, 1]

const updatePageViewsAndPrice = () => {
  // set a dynamic width for the progress bar
  const maxValue = priceRangeSlider.getAttribute('max')
  const value = (priceRangeSlider.value / maxValue) * 100 + '%'
  progressBar.style.width = value

  // set page views and price
  let selectedPrice = values[priceRangeSlider.value]
  let selectedViews = pageViews[priceRangeSlider.value]

  viewsEl.textContent = `${selectedViews}${
    selectedViews === 1 ? 'm' : 'k'
  } pageviews`

  priceEl.textContent = `$${
    toggleButton.classList.contains('toggle-yearly')
      ? discount(selectedPrice)
      : selectedPrice
  }.00`
}

const setBillingMode = () => {
  let price = Number(priceEl.textContent.replace(/^\$/, '').slice(0, 2))

  toggleButton.classList.toggle('toggle-yearly')

  if (toggleButton.classList.contains('toggle-yearly')) {
    priceEl.textContent = `$${discount(price)}.00`
    dateEl.textContent = '/ year'
  } else {
    priceEl.textContent = `$${values[priceRangeSlider.value]}.00`
    dateEl.textContent = '/ month'
  }
}

const discount = (price) => {
  const annualPrice = price * 12
  const discountedPrice = annualPrice * 0.75
  return discountedPrice
}
