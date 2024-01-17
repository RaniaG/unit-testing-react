type Status = "new" | "doing" | "done";

interface Task {
  id: number;
  title?: string;
  status: Status;
}

const time = 200;
const tasks: Task[] = [];
export const editTask = (id: number, title: string, status?: Status) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = tasks.findIndex((e) => e.id === id);
      tasks[index] = {
        ...tasks[index],
        id,
        title,
        status: status ?? tasks[index].status,
      };
      resolve({
        id,
        title,
        status,
      });
    }, time);
  });
};

export const deleteTask = (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = tasks.findIndex((e) => e.id === id);
      tasks.splice(index, 1);
      resolve({});
    }, time);
  });
};

export const createTask = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      tasks.push({
        id: tasks.length,
        status: "new",
      });
      resolve({});
    }, time);
  });
};

export const getAllTasks = (): Promise<Task[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(tasks);
    }, time);
  });
};
