import {defineStore} from "pinia";

export const useOAPermissionBlockStore = defineStore("OAPermissionBlock", {
  state: () => ({
    isShow: false
  }),
  actions: {
    changeStatus(target: boolean) {
      this.isShow = target;
    }
  }
})
