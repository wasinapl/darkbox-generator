<template>
  <div class="modal-background" v-if="modal" @click="modal = false"></div>
  <div class="modal" v-if="modal">
    <div class="requests">Dzisiejsze prośby: {{ requests }}</div>
    <h2>Lista linków:</h2>
    <div class="hosts" v-if="hosts.size > 1">
      <div class="host" v-for="(host, i) in hosts" :key="i">
        <input type="checkbox" :id="'host' + i" @input="updateHosts(host)" />
        <label :for="'host' + i">{{ host }}</label>
      </div>
    </div>
    <div class="link">
      <input type="checkbox" id="all" v-model="selectAll" />
      <label for="all">Zaznacz wszystkie</label>
    </div>
    <div class="links">
      <div class="link" v-for="(link, i) in filtered_links" :key="link.href">
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
  <LinksInput v-if="links_input" @done="onLinksInput" />
</template>

<script>
import { ref, onMounted, watch, computed } from "vue";
import helper from "./../services/helper";
import LinksInput from "./LinksInput.vue";

export default {
  name: "GenModal",
  components: { LinksInput },
  setup() {
    const modal = ref(false);
    const selectAll = ref(false);
    const link_list = ref([]);
    const filtered_hosts = ref(new Set());
    const hosts = ref(new Set());
    const requests = ref(null);
    const links_input = ref(false);

    const filtered_links = computed(() => {
      if (filtered_hosts.value.size < 1) return link_list.value;
      else {
        return link_list.value.filter((el) => {
          return filtered_hosts.value.has(el.site);
        });
      }
    });

    const onClick = (event) => {
      link_list.value = helper.getLinksInfo(event);
      getHosts();
      helper.getRequests((res) => {
        requests.value = res;
      });
      modal.value = true;
      checkAll();
    };

    const onClickLinkChecker = () => {
      links_input.value = true;
      console.log("test");
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
      for (let i = 0; i < filtered_links.value.length; i++) {
        const link = filtered_links.value[i];
        if (link.selected && !link.disabled) {
          helper.newWindow(link);
          link.disabled = true;
        }
      }
    };

    const getHosts = () => {
      link_list.value.forEach((link) => {
        hosts.value.add(link.site);
      });
    };

    const updateHosts = (host) => {
      if (filtered_hosts.value.has(host)) {
        filtered_hosts.value.delete(host);
      } else {
        filtered_hosts.value.add(host);
      }
    };

    const onLinksInput = (res) => {
      if (res) {
        console.log(res);
      } else {
        links_input.value = false;
      }
    };

    onMounted(() => {
      helper.addButtons(onClick, onClickLinkChecker);
      if (
        window.location.href ==
        "https://darkbox.vip/forum/13-generowanie-link%C3%B3w/?do=add"
      ) {
        const selector =
          "#ipsLayout_mainArea > form > div > div.ipsAreaBackground_reset.ipsPadding.ipsType_center.ipsBorder_top.ipsRadius\\:bl.ipsRadius\\:br > button";
        const button = document.querySelector(selector);
        button.addEventListener("click", () => {
          helper.updateRequests();
        });
      }
    });

    watch(selectAll, (newVal) => {
      for (let i = 0; i < link_list.value.length; i++) {
        const link = link_list.value[i];
        if (link.size && !link.disabled && link.size != 0)
          link.selected = newVal;
      }
    });

    return {
      modal,
      filtered_links,
      hosts,
      requests,
      getSize,
      selectAll,
      generate,
      updateHosts,
      links_input,
      onLinksInput,
    };
  },
};
</script>
