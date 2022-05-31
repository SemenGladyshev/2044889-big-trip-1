import dayjs from 'dayjs';

const sortTaskByDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const sortTaskByDuration = (pointA, pointB) => {
  const durationA = dayjs(pointA.dateFrom).diff(dayjs(pointA.dateTo));
  const durationB = dayjs(pointB.dateFrom).diff(dayjs(pointB.dateTo));

  if (durationB - durationA !== 0) {
    return durationB - durationA;
  } else {
    return dayjs(pointA.dateTo).diff(dayjs(pointB.dateTo));
  }
};

const sortTaskByPrice = (pointA, pointB) => {
  if(pointB.basePrice - pointA.basePrice !== 0) {
    return pointB.basePrice - pointA.basePrice;
  } else {
    return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
  }
};

export {sortTaskByDay, sortTaskByDuration, sortTaskByPrice};
