new Vue({
  el: '#app',
  created: function () {
    // check parameters
  },
  data: function () {
    return {
      name: '',
      selected: [],
      data: data,
      bingo: 0
    }
  },
  methods: {
    click: function (idx) {
      console.log(idx)
      var square = document.getElementById(`square-${idx}`)
      if (square.classList.contains('selected')) {
        square.classList.remove('selected')
        this.selected.splice(this.selected.indexOf(idx), 1)
      } else {
        square.classList.add('selected')
        this.selected.push(idx)
        this.selected.sort((a, b) => a - b)
      }
      console.log(this.selected)
    },
    pack: function (array) {
      var packed = []
      for (let i = 0; i < array.length; i++) {
        let square = array[i].toString(16)
        if (square.length % 2) { square = '0' + square }
        packed.push(square)
      }
      return packed.join('')
    },
    load: function (packed) {
      return packed.match(/\d\d/gi).map(t => parseInt(t))
    }
  }
})
