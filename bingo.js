new Vue({
  el: '#app',
  created: function () {
    // check parameters
    var get = [] 
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(a,name,value){get[name]=value;})
    var t = get['t']
    var f = get['f']
    var name = get['name']
    if (name !== undefined && (t !== undefined || f !== undefined)) {
      this.view = true
      this.name = decodeURIComponent(name)
      if (t) {
        this.selected = this.unpack(t)
      } else {
        unselected = this.unpack(f)
        for (let i = 0; i < 25; i++) {
          if (!unselected.includes(i))
            this.selected.push(i)
        }
      }
      console.log(this.selected)
    }
  },
  data: function () {
    return {
      view: false,
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
      if (this.selected.includes(idx)) {
        this.selected.splice(this.selected.indexOf(idx), 1)
      } else {
        this.selected.push(idx)
        this.selected.sort((a, b) => a - b)
      }
      console.log(this.selected)
      this.save()
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
    unpack: function (packed) {
      return packed.match(/\d\d/gi).map(t => parseInt(t, 16))
    },
    save: function () {
      if (this.selected.length > 12) {
        unselected = []
        for (let i = 0; i < 25; i++) {
          if (!this.selected.includes(i))
            unselected.push(i)
        }
        console.log('?f=' + this.pack(unselected) + '&name=' + this.name) 
      } else {
        console.log('?t=' + this.pack(this.selected) + '&name=' + this.name)
      }
    },
    getSelectedStyle: function (idx) {
      if (this.selected.includes(idx)) {
        return {
          color: '#FFE792',
          backgroundColor: '#75715E'
        }
      }
    }
  }
})
