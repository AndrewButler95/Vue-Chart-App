
const mockchart = require('./mockchart.json')
const mockall = require('./mockall.json')

export default {
  getChart: function() {
    return mockchart
  },
  getAll: function() {
    return mockall
  }
}

