<!-- components/TaskBoard.vue -->
<template>
        <v-container>
            <v-row>
            <TaskColumn 
                v-for="status in statuses" 
                :key="status" 
                :status="status"
                class="mx-3"
            />
            </v-row>
    </v-container>
  </template>
  
  <script>
  import TaskColumn from "./TaskColumn.vue";
  
  export default {
    components: {
      TaskColumn,
    },
    setup() {
      const statuses = ["TODO", "In progress", "Done"];
      return { statuses };
    },
  };
  </script>

    <style lang="scss" scoped>
        .main {
            
        }
    </style>
