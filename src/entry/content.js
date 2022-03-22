import App from "@/components/App.vue";
import { createApp, h } from 'vue';
import './../assets/style.less';


let element = document.querySelector('body')
const div = document.createElement('div');
div.id = 'gen-app';
element.appendChild(div);

const AppVue = {
  render() {
    return h(App)
  }
}
  
createApp(AppVue).mount('#gen-app')
