export const calculateTotalWorkoutWeight = (data) => {
  let totalWeight = 0;
  data.forEach((item) => {
    if (item.data) {
      item.data.forEach((workout) => {
        if (Array.isArray(workout.weights)) {
          workout.weights.forEach((weight, idx) => {
            totalWeight +=
              (parseFloat(weight) || 0) * (parseFloat(workout?.reps[idx]) || 1) ||
              0;
          });
        }
      });
    }
    if (item?.template?.list) {
      item.template.list.forEach((workout) => {
        if (Array.isArray(workout.weights)) {
          workout.weights.forEach((weight, idx) => {
            totalWeight +=
              (parseFloat(weight) || 0) * (parseFloat(workout?.reps[idx]) || 1) ||
              0;
          });
        }
      });
    }
  });
  return totalWeight;
};

// Function to calculate total recovery time
export const calculateTotalRecoveryTime = (data) => {
  let totalTime = 0;
  data.forEach((item) => {
    if (item.data) {
      item.data.forEach((recovery) => {
        totalTime +=
          parseFloat(recovery.time || 0) * (parseFloat(recovery.rounds) || 1) || 0;
      });
    }
    if (item?.template?.list) {
      item.template.list.forEach((recovery) => {
        totalTime +=
          parseFloat(recovery.time || 0) * (parseFloat(recovery.rounds) || 1) || 0;
      });
    }
  });
  return totalTime;
};

// Function to calculate total cardio time
export const calculateTotalCardioTime = (data) => {
  let totalTime = 0;
  data.forEach((item) => {
    if (item.data) {
      item.data.forEach((cardio) => {
        totalTime += parseFloat(cardio.time) || 0;
      });
    }
    if (item?.template?.list) {
      item.template.list.forEach((cardio) => {
        totalTime += parseFloat(cardio.time) || 0;
      });
    }
  });
  return totalTime;
};

export const getStartAndEndDate = (range) => {
  const now = new Date();
  let startDate, endDate;

  switch (range) {
    case "Today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59
      );
      break;
    case "Week":
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 5
      );
      endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59
      );
      break;
    case "Month":
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 27
      );
      endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59
      );
      break;
    default:
      return {};
  }

  return { startDate, endDate };
};
