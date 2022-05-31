import dayjs from 'dayjs';
import { eventTypes } from './event-types';
import { locations } from './locations';
import { nanoid } from 'nanoid';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a,b));
  const upper = Math.floor(Math.max(a,b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};


const generatePrice = () => getRandomInteger(1, 100) * 10;

const generateDates = () => {
  const maxGap = 14;

  const startDate = dayjs()
    .add(getRandomInteger(-maxGap, maxGap), 'day')
    .add(getRandomInteger(-maxGap, maxGap), 'hour')
    .add(getRandomInteger(-maxGap, maxGap), 'minute');

  const endDay = startDate
    .clone()
    .add(getRandomInteger(0, maxGap), 'day')
    .add(getRandomInteger(0, 59), 'hour')
    .add(getRandomInteger(0, 59), 'minute');

  return {
    start: startDate.toISOString(),
    end: endDay.toISOString()
  };
};

const generateTripEvent = () => {
  const dates = generateDates();
  const locationsArray = locations();
  const eventsArray = eventTypes();

  return {
    id: nanoid(),
    basePrice: generatePrice(),
    dateFrom: dates.start,
    dateTo: dates.end,
    destination: locationsArray[getRandomInteger(0, locationsArray.length - 1)],
    isFavorite: Boolean(getRandomInteger(0, 1)),
    events: eventsArray,
    type: eventsArray[getRandomInteger(0, eventsArray.length - 1)].type
  };
};

export {generateTripEvent};
