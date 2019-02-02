<template>
  <div class="bingo">
    <h1><span v-if="view"><strong>{{name}}</strong>의 </span>컴공과 빙고</h1>
    <table>
        <tbody>
            <tr v-for="row in Math.ceil(data.length / 5)" v-bind:key="row">
                <td v-for="(square, index) in data.slice((row - 1) * 5, row * 5)" 
                    v-bind:key="index"
                    v-bind:id="`square-${(row-1)*5+index}`" v-on:click="click((row-1)*5+index)"
                    v-bind:style="getSelectedStyle((row-1)*5+index)">
                    {{square}}
                </td>
            </tr>
        </tbody>
    </table>

    <modal name="share" class="share" height="auto" :scrollable="true">
      <div class="share-wrap">
        <h1>공유하기</h1>
        이름을 입력해 주세요: <input v-model.trim="name"/><br/>
        <input id="share" v-bind:value="share()" readonly/><br/>
        위 링크를 친구들에게 공유하세요!<br/>
        <button v-on:click="copy">클립보드로 복사하기</button>
      </div>
    </modal>

    <h3>빙고: {{bingo}}개</h3>
    <button v-if="!view" v-on:click="show">공유하기</button>
    <button v-else v-on:click="clear">나도 해보기</button>
    <div id="footer">
        <a href="https://github.com/junhoyeo">2019@JunhoYeo 
            <span v-bind:style="{color:'white'}">GitHub</span>
        </a>
    </div>
  </div>
</template>

<script>
import data from './bingo.json' // bingo data
import rules from './rule.json' // bingo rule 

export default {
  name: 'Bingo',
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
        var unselected = this.unpack(f)
        for (let i = 0; i < 25; i++) {
          if (!unselected.includes(i))
            this.selected.push(i)
        }
      }
      // window.console.log(this.selected)
      this.check()
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
    clear: function () {
      this.view = false
      this.name = ''
      this.selected = []
    },
    click: function (idx) {
      window.console.log(idx)
      if (this.selected.includes(idx)) {
        this.selected.splice(this.selected.indexOf(idx), 1)
      } else {
        this.selected.push(idx)
        this.selected.sort((a, b) => a - b)
      }
      window.console.log(this.selected)
      this.save()
      this.check()
    },
    check: function () {
      this.bingo = 0
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i]
        if (rule.every(elem => this.selected.indexOf(elem) > -1))
          this.bingo++
      }
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
        var unselected = []
        for (let i = 0; i < 25; i++) {
          if (!this.selected.includes(i))
            unselected.push(i)
        }
        return '?f=' + this.pack(unselected) + '&name=' + this.name
      } else {
        return '?t=' + this.pack(this.selected) + '&name=' + this.name
      }
    },
    share: function () {
      return window.location + this.save()
    },
    copy: function () {
      document.getElementById('share').select();
      document.execCommand('copy');
      window.alert('클립보드에 공유 링크를 복사했습니다!')
    },
    show () {
      this.$modal.show('share')
    },
    hide () {
      this.$modal.hide('share')
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
}
</script>

<style>
@import url('https://fonts.googleapis.com/earlyaccess/nanumgothiccoding.css'); 
@import url('https://fonts.googleapis.com/css?family=Noto+Sans:700');
body {
    font-family: 'Nanum Gothic Coding', monospace;
    background-color: #272822;
    text-align: center;
}
h1 {
    font-family: 'Noto Sans', sans-serif;
    color: #3E3D32;
    background-color: #FFE792;
    padding: 5px;
    width: 50%;
    margin-left: auto; 
    margin-right: auto;
}
h3 {
  color: #F8F8F2;
}
table {
    margin-left: auto; 
    margin-right: auto;
    border-collapse: collapse;
}
table, th, td {
    border: 3px solid #F8F8F2;
}
td {
    color: #75715E;
    background-color: none;
    padding: 25px;
}
div.v--modal {
  text-align: center;
}
div.v--modal div.share-wrap {
  margin-top: 25px;
  margin-bottom: 25px;
}
div.v--modal input#share {
  width: 80%;
  color: black;
  background-color: white;
  border: 5px solid skyblue;
  border-radius: 15px;
}
div.v--modal button {
  width: 50%;
  color: black;
  border-radius: 15px;
}
#footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 10px;
    text-align: center;
}
#footer a {
    color: #F92672;
    text-decoration: none;
}
</style>
