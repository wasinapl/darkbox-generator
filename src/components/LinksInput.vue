<template>
  <div class="modal-background" @click="emit('done', false)"></div>
  <div class="modal">
    <h2>Sprawdź linki</h2>
    <textarea v-model="links_string" style="flex-grow: 1;"></textarea>
    <div class="nav">
      <div class="ipsButton" @click="emit('done', false)">Anuluj</div>
      <div class="ipsButton" @click="checkLinks">Sprawdź</div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
//import { ref, onMounted, watch, computed } from "vue";
//import helper from "./../services/helper";

export default {
  name: "LinksInput",
  emits: ["done"],
  setup(props, { emit }) {
    const links_string = ref("");

    const checkLinks = () => {
    };

    return {
      links_string,
      checkLinks,
      emit
    };
  },
};
</script>
