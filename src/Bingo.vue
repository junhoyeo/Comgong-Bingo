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
        <h2>공유하기</h2>
        <p id="result">{{ bingo }}개 빙고 달성!</p>
        <p class="help">여러분의 <strong>이름</strong>을 입력해 주세요</p>
        <input id="name" v-model.trim="name"/><br/>
        <div v-if="name">
          <p class="help">아래 링크를 친구들에게 공유하세요!</p>
          <input id="share" v-bind:value="share()" readonly/>
          <button class="btn" v-on:click="copy"><i class="far fa-copy"></i> 클립보드로 복사하기</button>
        </div>
      </div>
    </modal>

    <h3 class="bingo-num">빙고: {{bingo}}개</h3>
    <button class="btn" v-if="!view" v-on:click="show"><i class="far fa-share-square"></i> 공유하기</button>
    <button class="btn" v-else v-on:click="clear"><i class="far fa-play-circle"></i> 나도 해보기</button>
    <div id="footer">
      /* Created by <a href="https://github.com/junhoyeo"><u>2019@JunhoYeo</u></a> 
      / <a href="https://github.com/junhoyeo/Comgong-Bingo"><u>Project Github</u></a> */
    </div>
  </div>
</template>

<script>
import data from './assets/bingo.json' // bingo data
import rules from './assets/rule.json' // bingo rule 
require('./assets/style.css') // style

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
      window.console.log(this.selected)
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
      if (this.view) this.view = false
      if (this.selected.includes(idx)) {
        this.selected.splice(this.selected.indexOf(idx), 1)
      } else {
        this.selected.push(idx)
        this.selected.sort((a, b) => a - b)
      }
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
      var unpacked = []
      for (let i = 0; i < packed.length; i += 2) {
        unpacked.push(parseInt(packed.substr(i, 2), 16))
      }
      return unpacked
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
      return window.location.href.split('?')[0] + this.save()
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
