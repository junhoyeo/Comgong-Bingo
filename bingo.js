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
        square.classList.remove('selected');
      } else {
        square.classList.add('selected');
      }
    }
  }
});
