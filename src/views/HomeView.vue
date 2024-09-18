<template>
  <TaskBoard></TaskBoard>
</template>

<script>
import { defineComponent } from 'vue';

// Components
import TaskBoard from '../components/TaskBoard.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    TaskBoard,
  },
});
</script>
