const chartContainer = document.querySelector('.chart-container')

fetch('./data.json')
  .then((res) => {
    if (!res.ok) throw new Error('No data fetched')
    return res.json()
  })
  .then((data) => {
    displayWeeklySpending(data)
  })
  .catch((error) => {
    console.error('There was a problem with the fetch operation: ', error)
  })

function displayWeeklySpending(data) {
  let maxBarHeight = 150
  let maxSpending = data.reduce(
    (max, curr) =>
      // get the max amount of spending within the week
      curr.amount > max ? curr.amount : max,
    0
  )

  let barChart = document.createElement('div')
  barChart.classList.add('bar-chart', 'fl-c')

  let bars = document.createElement('div')
  bars.classList.add('bars', 'fl-sb')

  let barLabelsContainer = document.createElement('div')
  barLabelsContainer.classList.add('bar-labels', 'fl-sb')

  for (let i = 0; i < data.length; i++) {
    let bar = document.createElement('div')
    let label = document.createElement('p')
    bar.classList.add('bar')
    bar.style.setProperty(
      '--height',
      `${Math.floor((data[i].amount / maxSpending) * maxBarHeight)}px`
    )
    bar.setAttribute('data-amount-spend', `$${data[i].amount}`)
    label.textContent = `${data[i].day}`

    bars.append(bar)
    barLabelsContainer.append(label)
  }

  barChart.append(bars)
  barChart.append(barLabelsContainer)
  chartContainer.append(barChart)
}
