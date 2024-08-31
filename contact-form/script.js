const contactForm = document.getElementById('contactForm')
const messageEl = contactForm.querySelector('textarea#message')

const createErrorMessageEl = (errorMessage) => {
  let p = document.createElement('p')
  p.className = 'error-message'
  p.textContent = `${errorMessage}`

  return p
}

const validateFullName = () => {
  let fullName = document.querySelectorAll('input[type="text"]')

  Array.from(fullName).forEach((item) => {
    const parent = item.parentElement
    let errorMessageEl = parent.querySelector('.error-message')

    if (item.value === '' || item.value === undefined) {
      item.classList.add('error')
      let p = createErrorMessageEl('This field is required')

      if (!errorMessageEl) parent.insertBefore(p, parent.lastChild)
    } else {
      item.classList.remove('error')
      if (parent.contains(errorMessageEl)) parent.removeChild(errorMessageEl)
    }
  })
}

const validateEmail = () => {
  const emailEl = contactForm.querySelector('input[type="email"]')
  let emailElVal = emailEl.value
  const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/

  const parent = emailEl.parentElement
  const errorMessageEl = parent.querySelector('.error-message')

  if (emailElVal === '' || emailRegex.test(emailElVal) === false) {
    emailEl.classList.add('error')
    const p = createErrorMessageEl('Please enter a valid email address')
    if (!errorMessageEl) parent.insertBefore(p, parent.lastChild)
  } else {
    emailEl.classList.remove('error')
    if (parent.contains(errorMessageEl)) parent.removeChild(errorMessageEl)
  }
}

const getQueryType = () => {
  const parent = contactForm.querySelector('.query-container')
  const radios = parent.querySelectorAll('input[type="radio"]')

  const errorMessageEl = parent.querySelector('.error-message')

  let isQueryTypeChecked = Array.from(radios).some((radio) => radio.checked)

  if (!isQueryTypeChecked) {
    const p = createErrorMessageEl('Please select a query type')
    p.style.marginTop = '1rem'

    if (!errorMessageEl) parent.insertBefore(p, parent.lastChild)
  } else {
    if (parent.contains(errorMessageEl)) parent.removeChild(errorMessageEl)
  }
}

const validateMessage = () => {
  let parent = messageEl.parentElement
  let errorMessageEl = parent.querySelector('.error-message')

  if (messageEl.value === '') {
    let p = createErrorMessageEl('This field is required')

    messageEl.classList.add('error')
    if (!errorMessageEl) parent.insertBefore(p, parent.lastChild)
  } else {
    messageEl.classList.remove('error')
    if (parent.contains(errorMessageEl)) parent.removeChild(errorMessageEl)
  }
}

const updateTextareaHeight = () => {
  messageEl.style.height = 'auto'
  messageEl.style.height = `${messageEl.scrollHeight}px`
}

const validateConsent = () => {
  let consentCheckBoxEl = contactForm.querySelector('input[type="checkbox"]')
  let checkboxParent = consentCheckBoxEl.parentElement
  let parent = checkboxParent.parentElement
  let errorMessageEl = parent.querySelector('.error-message')

  if (!consentCheckBoxEl.checked) {
    const p = createErrorMessageEl(
      'To submit this form, please consent to being contacted'
    )

    if (!errorMessageEl) parent.insertBefore(p, parent.lastChild)
  } else {
    if (parent.contains(errorMessageEl)) parent.removeChild(errorMessageEl)
  }
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault()

  let isFormValid = true

  // validateFullName()
  // validateEmail()
  // getQueryType()
  // validateMessage()
  // validateConsent()

  if (!validateFullName()) isFormValid = false
  if (!validateEmail()) isFormValid = false
  if (!getQueryType()) isFormValid = false
  if (!validateMessage()) isFormValid = false
  if (!validateConsent()) isFormValid = false

  if (isFormValid) contactForm.submit()
})
