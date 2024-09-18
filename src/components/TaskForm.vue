<template>
    <v-dialog v-model="internalDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEdit ? 'Редагувати задачу' : 'Нова задача' }}</span>
        </v-card-title>
  
        <v-card-text>
          <v-form ref="form" v-model="isFormValid" lazy-validation>
            <v-text-field 
              label="Назва" 
              v-model="localTask.title" 
              :rules="[rules.required]" 
              outlined
              :error-messages="errorMessages.title"
              @input="clearError('title')"
            ></v-text-field>
            <v-textarea label="Опис" 
              v-model="localTask.description" 
              :rules="[rules.required]" 
              outlined
              :error-messages="errorMessages.description"
              auto-grow
              rows="1"
              @input="clearError('description')"
            ></v-textarea>
            <v-select 
              label="Відповідальна особа" 
              :items="people" 
              v-model="localTask.assignee" 
              outlined
            ></v-select>
            <v-select 
              label="Виконавці" 
              :items="people" 
              v-model="localTask.executors" 
              outlined
            ></v-select>
            <v-select 
              label="Пріоритет" 
              :items="priorities" 
              v-model="localTask.priority"
              outlined
            ></v-select>
            <v-checkbox  
                v-model="localTask.fast" 
                label="Терміново">
            </v-checkbox>
          </v-form>
        </v-card-text>
  
        <v-card-actions>
          <v-btn color="primary" @click="validateAndSave">Зберегти</v-btn>
          <v-btn @click="closeDialog">Закрити</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { ref, reactive, watch, computed } from 'vue';
  import { useStore } from 'vuex';
  
  export default {
    props: {
      dialog: {
        type: Boolean,
        required: true,
      },
      task: {
        type: Object,
        required: true,
      },
    },
    emits: ['update:dialog'],
    setup(props, { emit }) {
      const store = useStore();
      const internalDialog = ref(props.dialog);
      const localTask = reactive({ ...props.task });
      const isFormValid = ref(false);
      const form = ref(null);
      const errorMessages = reactive({
        title: '',
        description: '',
      });
  
      const rules = {
        required: (v) => !!v || 'Це поле є обов’язковим.',
        requiredArray: (v) => (v && v.length > 0) || 'Оберіть хоча б одного виконавця.',
      };
  
      const people = ['Олексій', 'Андрій', 'Марія','Іван','Володимир'];
      const priorities = ['Low', 'Medium', 'High'];
  
      const isEdit = computed(() => !!props.task.id);
  
      const clearError = (field) => {
        errorMessages[field] = '';
      };
  
      const validateAndSave = () => {
        form.value.validate();

        if (!isFormValid.value) {
          validateForm();
          return;
        }

        const taskToSave = { ...localTask, id: isEdit.value ? props.task.id : Date.now() };
        if (isEdit.value) {
          store.dispatch('updateTask', taskToSave);
        } else {
          store.dispatch('addTask', taskToSave);
        }
  
        closeDialog();
      };
  
      const validateForm = () => {
        if (!localTask.title) {
          errorMessages.title = 'Назва задачі обов’язкова.';
        }
        if (!localTask.description) {
          errorMessages.description = 'Опис задачі обов’язковий.';
        }
      };
  
      const closeDialog = () => {
        internalDialog.value = false;
        emit('update:dialog', false);
        // Очищаємо форму при закритті
        localTask.title = '';
        localTask.description = '';
        localTask.assignee = '';
        localTask.executors = '';
        localTask.priority = 'Medium';
        localTask.fast = false;
      };
  
      watch(() => props.dialog, (newVal) => {
        internalDialog.value = newVal;
      });
  
      watch(() => props.task, (newTask) => {
        localTask.title = newTask.title || '';
        localTask.description = newTask.description || '';
        localTask.assignee = newTask.assignee || '';
        localTask.executors = newTask.executors || '';
        localTask.priority = newTask.priority || 'Medium';
        localTask.fast = newTask.fast || false;
      }, { deep: true });
  
      return {
        internalDialog,
        localTask,
        people,
        priorities,
        validateAndSave,
        closeDialog,
        rules,
        errorMessages,
        clearError,
        isFormValid,
        isEdit,
        form,
      };
    },
  };
  </script>
  