export function taskAdded (state, task) {
  if (task.val().completed !== true) {
    let index = state.tasksList.findIndex(element => element.keyRef === task.key)
    if (index < 0) {
      state.tasksList.push(task.val())
    }
  } else {
    let cindex = state.tasksList.findIndex(element => element.keyRef === task.key)
    if (cindex < 0) {
      state.completedTasksList.push(task.val())
    }
  }
}

export function taskDeleted (state, task) {
  let index = state.tasksList.findIndex(element => element.keyRef === task.key)
  state.tasksList.splice(index, 1)
}

export function taskChanged (state, task) {
  let index = state.tasksList.findIndex(element => element.keyRef === task.key)
  if (task.val().completed !== true) {
    state.tasksList.splice(index, 1, task.val())
  } else {
    state.tasksList.splice(index, 1)
    state.completedTasksList.push(task.val())
    console.log('Task has become completed')
  }
}

export function firstAssign (state, taskList) {
  state.tasksList = taskList
}

export function flush (state) {
  state.tasksList = []
  state.completedTasksList = []
}
