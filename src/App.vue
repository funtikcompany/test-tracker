<template>
  <v-app>
    <!-- Хедер та навігація відображатимуться на всіх сторінках -->
    <v-app-bar
      color="primary"
      prominent
    >
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
    </v-app-bar>

    <!-- Бокова навігація -->
    <v-navigation-drawer
      v-model="drawer"
      :location="$vuetify.display.mobile ? 'bottom' : 'left'"
      temporary
    >
      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.link"
          router
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Контент сторінок -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { ref,computed } from 'vue';
import { useRoute } from 'vue-router';
export default {
  name:'App',
  setup() {
    const drawer = ref(false);
    
    // Моделі для посилань
    const items = [
      { title: 'Дошка задач', link: '/' },
      { title: 'Команда', link: '/team' },
      { title: 'FAQ', link: '/faq' }
    ];
    const route = useRoute();

    const pageTitle = computed(() => route.meta.title || 'Default Title');

    return { drawer, items,pageTitle };
  },
};
</script>
