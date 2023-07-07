import Vue from "vue";
import { Spin } from "ant-design-vue";

let instance = null;

function getInstance() {
  if (!instance) {
    instance = new Vue({
      data: {
        show: false,
      },
      methods: {
        loading() {
          this.show = true;
        },
        close() {
          this.show = false;
        },
      },
      render(h, data) {
        const fullscreenLoading = {
          position: "fixed",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#eeeeee",
          opacity: ".7"
        };
        return this.show ? (
          <div style={fullscreenLoading}>
            <Spin />
          </div>
        ) : (
          ""
        );
      },
    });
    const component = instance.$mount();
    document.body.appendChild(component.$el);
  }

  return instance;
}

Spin.show = function () {
  getInstance().loading();
};

Spin.hide = function () {
  getInstance().close();
};

export default Spin;