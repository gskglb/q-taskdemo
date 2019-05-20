// export function firstAssignment ({ commit }, listOfTasks) {
//   commit('firstAssign', listOfTasks)
// }

export function taskAdded ({ commit }, newTask) {
  if (newTask.completed !== true) {
    commit('taskAdded', newTask)
  }
}

export function taskDeleted ({ commit }, task) {
  commit('taskDeleted', task)
}

export function taskChanged ({ commit }, task) {
  commit('taskChanged', task)
}

export function flush ({ commit }) {
  return new Promise((resolve, reject) => {
    commit('flush')
    resolve()
  })
}
