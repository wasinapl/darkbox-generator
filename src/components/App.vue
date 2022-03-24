<template>
  <div class="modal" v-if="modal">
    <h2>Lista linków:</h2>
    <div class="links">
      <div class="link" v-for="(link, i) in link_list" :key="link.href">
        <input
          type="checkbox"
          :id="'link' + i"
          v-model="link.selected"
          :disabled="!link.size || link.disabled || link.size == 0"
        />
        <label :for="'link' + i" :class="{ disabled: link.disabled }"
          >{{ link.site }}/{{ link.filename }}</label
        >
        <div class="size" v-if="link.size">{{ link.size }} GB</div>
        <div class="size" v-if="!link.size && link.size !== 0">
          <div class="loader"></div>
        </div>
        <div class="size error" v-if="link.size == 0">niedostępny</div>
      </div>
    </div>
    <div class="nav">
      <div class="ipsButton" @click="modal = false">Anuluj</div>
      <div class="ipsButton" @click="generate">Dodaj</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import helper from "./../services/helper";

export default {
  name: "GenModal",
  setup() {
    const modal = ref(false);
    const link_list = ref([]);

    const onClick = (event) => {
      link_list.value = helper.getLinksInfo(event);
      modal.value = true;
      checkAll();
    };
    const getSize = async (index) => {
      const link = link_list.value[index];
      helper.getSize(link.href, (response) => {
        link.size = response;
      });
    };

    const checkAll = () => {
      for (let i = 0; i < link_list.value.length; i++) {
        getSize(i);
      }
    };

    const generate = () => {
      for (let i = 0; i < link_list.value.length; i++) {
        const link = link_list.value[i];
        if (link.selected) {
          helper.newWindow(link);
          link.disabled = true;
        }
      }
    };

    onMounted(() => {
      helper.addButtons(onClick);
    });

    return { modal, link_list, getSize, checkAll, generate };
  },
};
</script>
