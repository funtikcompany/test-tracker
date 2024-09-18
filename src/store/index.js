import { createStore } from 'vuex';

export default createStore({
  state: {
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
  },
  mutations: {
    ADD_TASK(state, task) {
      state.tasks.push(task);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    DELETE_TASK(state, id) {
      state.tasks = state.tasks.filter(el => el.id !== id);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    UPDATE_TASK(state, updatedTask) {
      const index = state.tasks.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        state.tasks[index] = updatedTask;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    UPDATE_TASK_STATUS(state, { taskId, newStatus }) {
      const task = state.tasks.find(task => task.id === taskId);
      if (task) {
        task.status = newStatus;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
  },
  actions: {
    addTask({ commit }, task) {
      commit('ADD_TASK', task);
    },
    deleteTask({ commit }, task) {
      commit('DELETE_TASK', task);
    },
    updateTask({ commit }, updatedTask) {
      commit('UPDATE_TASK', updatedTask);
    },
    updateTaskStatus({ commit }, { taskId, newStatus }) {
      commit('UPDATE_TASK_STATUS', { taskId, newStatus });
    },
  },
  getters: {
    getTasksByStatus: (state) => (status) => {
      return state.tasks.filter(task => task.status === status);
    },
  },
});
