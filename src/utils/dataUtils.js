
export default { test: { sortKeys(response, style) {
  response.sort(function(a, b) {
    const endpointInfoA = Object.keys(a)[0]
    const endpointInfoB = Object.keys(b)[0]
    const sortByStyle = function(style) {
      return (
        b[endpointInfoB][style].total_calls -
          a[endpointInfoA][style].total_calls
      )
    }
    if (style === 'totalCalls') {
      const totalCallsA =
          a[endpointInfoA]['IP'].total_calls +
          a[endpointInfoA]['ApiKey'].total_calls +
          a[endpointInfoA]['AuthKey'].total_calls

      const totalCallsB =
          b[endpointInfoB]['IP'].total_calls +
          b[endpointInfoB]['ApiKey'].total_calls +
          b[endpointInfoB]['AuthKey'].total_calls
      return totalCallsB - totalCallsA
    } else {
      return sortByStyle(style)
    }
  })
  return response
},
createRows(row, data, key, type, totals) {
  row[type + 'hoursort'] = data[key][type].hour
  row[type + 'hour'] = data[key][type].hour.toLocaleString()
  row[type + 'hourformat'] = this.convertFormat(data[key][type].hour) + ' (' + Math.round((data[key][type].hour / totals[type + 'hour']) * 100) + '%)'
  row[type + 'hourtoggle'] = false

  row[type + 'daysort'] = data[key][type].day
  row[type + 'day'] = data[key][type].day.toLocaleString()
  row[type + 'dayformat'] = this.convertFormat(data[key][type].day) + ' (' + Math.round((data[key][type].day / totals[type + 'day']) * 100) + '%)'
  row[type + 'daytoggle'] = false

  row[type + 'monthsort'] = data[key][type].month
  row[type + 'month'] = data[key][type].month.toLocaleString()
  row[type + 'monthformat'] = this.convertFormat(data[key][type].month) + ' (' + Math.round((data[key][type].month / totals[type + 'month']) * 100) + '%)'
  row[type + 'monthtoggle'] = false
},
convertFormat(num) {
  if (num > 999999) {
    return (num / 1000000).toFixed(1) + 'M'
  } else {
    return num > 999 ? (num / 1000).toFixed(1) + 'k' : num
  }
},
convertToTableFormat(data) {
  const totalfunct = function(headers, key, totals, type) {
    for (const head in headers) {
      if (!(head === 'last_used' || head === 'total_calls')) {
        totals[type + head] = totals[type + head] + headers[head]
      }
    }
  }
  const totals = {
    ApiKeyday: 0,
    ApiKeyhour: 0,
    ApiKeymonth: 0,
    AuthKeyday: 0,
    AuthKeyhour: 0,
    AuthKeymonth: 0,
    IPday: 0,
    IPhour: 0,
    IPmonth: 0 }
  const tableData = []
  for (const i in data) {
    const key = Object.keys(data[i])[0]
    totalfunct(data[i][key]['IP'], key, totals, 'IP')
    totalfunct(data[i][key]['ApiKey'], key, totals, 'ApiKey')
    totalfunct(data[i][key]['AuthKey'], key, totals, 'AuthKey')
  }

  for (const i in data) {
    const key = Object.keys(data[i])[0]
    const row = { endpoint: key }

    this.createRows(row, data[i], key, 'IP', totals)
    this.createRows(row, data[i], key, 'ApiKey', totals)
    this.createRows(row, data[i], key, 'AuthKey', totals)

    tableData.push(row)
  }
  return tableData
},
sumTotalCalls(data, index, endpointInfo, type) {
  if (type === 'totalCalls') {
    return (data[index][endpointInfo]['IP'].total_calls +
      data[index][endpointInfo]['ApiKey'].total_calls +
      data[index][endpointInfo]['AuthKey'].total_calls)
  } else {
    return data[index][endpointInfo][type].total_calls
  }
}

}}
