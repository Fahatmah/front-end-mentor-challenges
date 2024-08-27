const form = document.getElementById('mortgageForm')
let mortgageAmount = document.getElementById('mortgage-amount')
const mortgageTerm = document.getElementById('mortgage-term')
const interestRate = document.getElementById('interest-rate')
const repaymentButton = document.getElementById('repayment')
const interestOnlyButton = document.getElementById('interest-only')
const clearAllButton = document.getElementById('clearAll')
const mortgageResultsContainer = document.getElementById('mortgageResults')
const emptyMessageEl = document.querySelector('.empty-message')

mortgageAmount.addEventListener('input', (e) => addCommas(e.target))

clearAllButton.addEventListener('click', () => {
  clearFormFields()
  clearErrorFieldsStyles()

  // removing results styles
  emptyMessageEl.classList.remove('hide')
  let mortgageResultsEl = document.querySelector('.results-container')
  if (mortgageResultsContainer.contains(mortgageResultsEl))
    mortgageResultsContainer.removeChild(mortgageResultsEl)
})

form.addEventListener('submit', (e) => {
  e.preventDefault()
  let mortgageAmountVal = mortgageAmount.value
  let mortgageTermVal = mortgageTerm.value
  let interestRateVal = interestRate.value
  mortgageAmountVal = Number(mortgageAmountVal.split(',').join(''))

  validateForm()

  if (repaymentButton.checked) {
    console.log('repayment')
    calculateMortgageRepayment(
      mortgageAmountVal,
      mortgageTermVal,
      interestRateVal
    )
  }
  if (interestOnlyButton.checked) {
    console.log('interest only')
    calculateMortgageInterestOnly(
      mortgageAmountVal,
      interestRateVal,
      mortgageTermVal
    )
  }
})

// let mortgageAmount = 300000,
//   mortgageTerm = 25,
//   interestRate = 5.25
// CALCULATE MORTGAGE REPAYMENT
function calculateMortgageRepayment(
  principal,
  numberOfPayments,
  monthlyInterestRate
) {
  // if (numberOfPayments > 0 && monthlyInterestRate > 0) {
  let r = monthlyInterestRate / 100 / 12
  let n = numberOfPayments * 12
  let m = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  const totalRepayment = +(m * n).toFixed(2)
  displayResults(+m.toFixed(2), totalRepayment)
  // }
  // return [m.toFixed(2), totalRepayment.toFixed(2)].map(Number)
  // console.log([m.toFixed(2), totalRepayment.toFixed(2)].map(Number))
}
// console.log(
//   calculateMortgageRepayment(mortgageAmount, mortgageTerm, interestRate)
// )
// monthly repayments => 1,797.74
// total repayment over the term => 539,322.94

// CALCULATE MORTGAGE (INTEREST ONLY)
function calculateMortgageInterestOnly(
  mortgageAmount,
  annualInterestRate,
  interestOnlyYears
) {
  let annualRateDecimal = annualInterestRate / 100
  let interestOnlyMonthlyPayment = (mortgageAmount * annualRateDecimal) / 12
  let totalInterestOnlyPayment =
    interestOnlyMonthlyPayment * (interestOnlyYears * 12)
  displayResults(
    +interestOnlyMonthlyPayment.toFixed(2),
    +totalInterestOnlyPayment.toFixed(2)
  )
  // return [interestOnlyMonthlyPayment, totalInterestOnlyPayment]
  // console.log([interestOnlyMonthlyPayment, totalInterestOnlyPayment])
}
// console.log(calculateMortgageInterestOnly(400000, 3.75, 5))
// monthly payment (interest only) => 1250.00
// total repayment (interest only) => 75000

function clearFormFields() {
  // form input fields
  Array.from(form.getElementsByClassName('input-container')).forEach(
    (field) => (field.querySelector('input').value = '')
  )

  // form radio fields
  Array.from(form.getElementsByClassName('radio-container')).forEach(
    (radio) => (radio.querySelector('input').checked = false)
  )
}

function clearErrorFieldsStyles() {
  // clear error input styles
  form.querySelectorAll('.field').forEach((field) => {
    let errorMessage = field.querySelector('.error-message')
    field.classList.remove('error')
    if (errorMessage) field.removeChild(errorMessage)
  })
  // clear error radio styles
  let radioFieldContainer = form.querySelector('#mortgageRadio')
  let errorRadioField = radioFieldContainer.querySelector('.error-message')
  radioFieldContainer.classList.remove('radio-error')
  if (errorRadioField) radioFieldContainer.removeChild(errorRadioField)
}

function validateForm() {
  // form input fields
  validateInputFields()
  validateRadioFields()
}

function validateInputFields() {
  let inputFields = form.querySelectorAll('.field')
  inputFields.forEach((field) => {
    let input = field.querySelector('.input-container input')
    let errorMessageEl = field.querySelector('.error-message')
    errorMessageEl = createErrorMessageEl(errorMessageEl)

    if (input.value === '' || input.value === '0') {
      if (!field.querySelector('.error-message'))
        field.insertBefore(errorMessageEl, field.firstChild)
      field.classList.add('error')
      if (input.value === '0') errorMessageEl.textContent = 'Invalid input'
    } else {
      field.classList.remove('error')
      if (field.contains(errorMessageEl)) field.removeChild(errorMessageEl)
    }
  })
}

function validateRadioFields() {
  // form radio fields
  let radioField = form.querySelector('#mortgageRadio')
  let radios = radioField.querySelectorAll('.radio-container input')

  let errorMessageEl = radioField.querySelector('.error-message')
  errorMessageEl = createErrorMessageEl(errorMessageEl)

  let isAnyRadioChecked = Array.from(radios).some((radio) => radio.checked)
  if (!isAnyRadioChecked) {
    if (!radioField.querySelector('.error-message'))
      radioField.append(errorMessageEl)
    radioField.classList.add('radio-error')
  } else {
    radioField.classList.remove('radio-error')
    if (radioField.contains(errorMessageEl))
      radioField.removeChild(errorMessageEl)
  }
}

function createErrorMessageEl(el) {
  if (!el) {
    el = document.createElement('div')
    el.classList.add('error-message')
    el.textContent = 'This field is required'
  }

  return el
}

function displayResults(monthlyRepayment, totalRepayment) {
  const resultsContainer = document.querySelector('.results-container')
  let resultsContainerEl = document.createElement('div')
  resultsContainerEl.classList.add('results-container', 'fl-c')
  resultsContainerEl.innerHTML = `
                  <div class="body-text">
                    <h3>Your results</h3>
                    <p>
                      Your results are show below based on the information you
                      provided. To adjust the results, edit the form and click
                      "calculate repayments" again.
                    </p>
                  </div>

                  <div class="results fl-c">
                    <!-- monthly repayments -->
                    <div class="monthly-repayments">
                      <p>Your monthly repayments</p>
                      <h4 id="monthlyRepayment">£${addCommas(
                        monthlyRepayment
                      )}</h4>
                    </div>
                    <hr class="line" />
                    <!-- total repay over the term -->
                    <div class="total-repayments">
                      <p>Total you'll repay over the term</p>
                      <h5 id="totalRepayment">£${addCommas(totalRepayment)}</h5>
                    </div>
                  </div>
                `
  if (resultsContainer) {
    mortgageResultsContainer.removeChild(resultsContainer)
    mortgageResultsContainer.append(resultsContainerEl)
  } else {
    mortgageResultsContainer.append(resultsContainerEl)
  }
  emptyMessageEl.classList.add('hide')
}

function addCommas(el) {
  let regex = /\B(?=(\d{3})+(?!\d))/g
  if (typeof el === 'number') return el.toString().replace(regex, ',')

  // check if el is an HTML element (e.g., e.target)
  if (el instanceof HTMLElement) {
    let val = el.value.replace(/[^0-9]/g, '')

    const parts = el.value.replace(/[^0-9]/g, '').split('.')
    parts[0] = parts[0].replace(regex, ',')

    el.value = parts.join('.')
  }
}

document.addEventListener('DOMContentLoaded', () => {
  calculateMortgageRepayment(300000, 25, 5.25)
})
