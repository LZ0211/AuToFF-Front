import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import {
  Button,
  Select,
  Switch,
  Option,
  OptionGroup,
  Form,
  FormItem,
  InputNumber,
  Tree,
  Radio,
  RadioGroup,
  RadioButton,
  Input,
  Empty
} from "element-ui";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

Vue.config.productionTip = false;

Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
Vue.component(Switch.name, Switch);

Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(InputNumber);
Vue.use(Tree);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Input);
Vue.use(Empty);

Vue.use(Antd);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
