<template>
  <div class="panel-body">
      <div class="blocks">
        عربي
      </div>
      <div class="blocks">
        <label class="switch">
        <input type="checkbox" @click="toggleCheckbox" :checked="LANG == 'en'">
        <div class="slider round"></div>
      </label>
      </div>
      <div class="blocks">
        English
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      LANG: localStorage.getItem('lang')
    }
  },
  methods: {
    toggleCheckbox () {
      if (this.LANG === 'en') {
        this.LANG = 'ar'
        localStorage.setItem('lang', 'ar')
      } else {
        this.LANG = 'en'
        localStorage.setItem('lang', 'en')
      }
      this.$router.go(0)
    }
  }
}
</script>

<style>
.blocks {
    display: inline-block;
    margin: 5px;
    vertical-align: middle;
  }
.panel-body{
  direction: ltr;
  margin: auto;
}
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #101010;
}

input:focus + .slider {
  box-shadow: 0 0 1px #101010;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
