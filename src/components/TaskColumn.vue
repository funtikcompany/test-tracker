<template>
    <v-col
      @dragover.prevent="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
      :class="{'drop-zone-active': isActiveDropZone}"
      class="drop-zone bg-blue-grey-lighten-5 mt-4 mb-4"
    >
      <h3>{{ status }}</h3>
      <!-- Відображення задач -->
      <v-card
        v-for="task in sortedTasks"
        :key="task.id"
        :class="{'task-card-dragging': draggingTaskId === task.id}"
        class="task-card cursor-move my-3 position-relative pa-1"
        @dragstart="onDragStart($event, task)"
        @dragend="onDragEnd"
        draggable="true"
      > 
       
            <v-icon v-if="task.fast" v-tooltip="'Терміново'" class="position-absolute top-0 right-0 text-error blink">mdi-alert-circle</v-icon>
            <div class="d-flex align-start justify-space-between mt-2">
                <div>
                    <p class="text-caption pa-1">Виконавець: {{ task.executors || 'Не призначено :(' }}</p>
                    <p class="text-caption pa-1">Відповідальна особа: {{ task.executors || 'Не призначено :(' }}</p>
                </div>
                <div>
                    <p class="text-caption m-0 pa-1">Пріоритет: <strong v-if="!task.fast"  :class="getPriorityClass(task.priority)">{{ task.priority }}</strong><strong class="text-error" v-else>Терміново</strong></p>
                    <p class="text-caption m-0 pa-1">Статус: <strong >{{ task.status }}</strong></p>
                </div>
            </div>
            <v-card-title  class="text-wrap text-truncate">{{ task.title }}</v-card-title>
            <v-card-text  class="text-wrap text-truncate">{{ task.description }}</v-card-text>
            <div class="d-flex align-center justify-space-between">
                <v-btn icon @click="editTask(task)" v-tooltip="'Редагувати'" class="text-blue" variant="text">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="deleteTask(task)"  v-tooltip="'Видалити'" class="text-red" variant="text">
                  <v-icon>mdi-close-circle</v-icon>
                </v-btn>
            </div>
      </v-card>
      <v-card-title class="text-center" v-if="sortedTasks.length==0">Задач поки ще немає :( </v-card-title>
  
      <!-- Кнопка для створення нової задачі -->
      <v-btn color="success" @click="openTaskForm">Додати задачу</v-btn>
  
      <!-- Відображення компонента TaskForm -->
      <TaskForm
        v-model:dialog="dialog"
        :task="selectedTask"
      />
    </v-col>
  </template>
  
  <script>
  import TaskForm from './TaskForm.vue';
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  
  export default {
    props: ['status'],
    components: {
      TaskForm,
    },
    setup(props) {
      const store = useStore();
      const tasks = computed(() => store.getters.getTasksByStatus(props.status));
  
      // Сортування задач за пріоритетом
        const sortedTasks = computed(() => {
            return [...tasks.value].sort((a, b) => {
                const priorityOrder = { Low: 3, Medium: 2, High: 1 };
                if (a.fast && !b.fast) return -1;
                if (!a.fast && b.fast) return 1; 
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
        });

  
      // Стан для перетягування
      const draggingTaskId = ref(null);
  
      const dialog = ref(false);
      const selectedTask = ref({
        title: '',
        description: '',
        assignee: '',
        executors: [],
        status: props.status,
        priority: 'Medium',
        fast: false,
      });
  
      const isActiveDropZone = ref(false);
  
      const getPriorityClass = (priority) => {
        switch (priority) {
          case 'Low':
            return 'text-blue'; // Синій для низького пріоритету
          case 'Medium':
            return 'text-yellow'; // Жовтий для середнього пріоритету
          case 'High':
            return 'text-orange'; // Червоний для високого пріоритету
          default:
            return 'text-black'; // Чорний для дефолтного пріоритету
        }
      };
  
      const openTaskForm = () => {
        dialog.value = true;
      };
  
      const editTask = (task) => {
        selectedTask.value = { ...task };
        dialog.value = true;
      };
      
      const deleteTask = (task) => {
        if(confirm('Бажаєте видалити задачу ?')){
            store.dispatch('deleteTask', task.id);
        }
      };
  

      const onDragStart = (event, task) => {
        event.dataTransfer.setData("taskId", task.id);
        draggingTaskId.value = task.id; // Додаємо ID задачі, яку перетягуємо
      };
  
      const onDragEnd = () => {
        draggingTaskId.value = null; // Скидаємо ID після завершення перетягування
      };
  
      const onDragOver = (event) => {
        event.preventDefault();
        isActiveDropZone.value = true;
      };
  
      const onDragLeave = (event) => {
        event.preventDefault();
        isActiveDropZone.value = false;
      };
  
      const onDrop = (event) => {
        event.preventDefault();
        isActiveDropZone.value = false;
        const taskId = parseInt(event.dataTransfer.getData("taskId"));
        store.dispatch("updateTaskStatus", { taskId, newStatus: props.status });
      };
  
      return { sortedTasks, dialog,deleteTask, selectedTask, openTaskForm, editTask, onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop, isActiveDropZone, getPriorityClass, draggingTaskId };
    },
  };
  </script>
  
  <style lang="scss" scoped>
  *{
    line-height: 1;
  }
  .task-card {
    min-width: 250px;
    margin: 0  auto;
    transition: all 0.3s ease;
    &:hover {
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);;
    }
  }
  
  .task-card-dragging {
    background-color: rgba(0, 0, 0, 0.2); /* Темніший фон для перетягування */
  }
  
  .drop-zone {
    min-height: 100px;
    border: 2px dashed #ddd;
    padding: 10px;
    transition: background-color 0.3s ease;
  }
  
  .drop-zone-active {
    background-color: rgba(0, 0, 0, 0.1); /* Змінюємо фон при перетягуванні */
  }

    @keyframes blink-animation {
        50% {
            opacity: 0;
        }
    }

    .blink {
      animation: blink-animation 1s infinite;
    }   
  </style>
  