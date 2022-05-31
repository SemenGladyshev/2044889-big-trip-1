import dayjs from 'dayjs';
import AbstractView from './abstract-view';
import { eventTypes } from '../mock/event-types';

const createTripEventTemplate = (event) => {
  const {basePrice: price, dateFrom: ISOFrom, dateTo: ISOTo, destination, isFavorite: isFavorite, type} = event;

  const destinationName = destination.name;

  const dayStart = dayjs(ISOFrom).format('MMM D');
  const dateFrom = dayjs(ISOFrom).format('YYYY-MM-DD');

  const timeFrom = dayjs(ISOFrom).format('HH:mm');
  const datetimeFrom = dayjs(ISOFrom).format('YYYY-MM-DDTHH:mm');

  const timeTo = dayjs(ISOTo).format('HH:mm');
  const datetimeTo = dayjs(ISOTo).format('YYYY-MM-DDTHH:mm');

  const getDuration = (beginISO, endISO) => {
    const getTimeDiff = () => {
      const startDate = dayjs(beginISO).toDate();
      const endDate = dayjs(endISO).toDate();
      const resultDict = new Date(endDate - startDate);

      return {
        days: resultDict.getUTCDate() - 1,
        hours: resultDict.getUTCHours(),
        minutes: resultDict.getUTCMinutes(),
      };
    };

    const timeDifference = getTimeDiff();
    const resultArray = [];

    if (timeDifference.days !== 0) {
      resultArray[0] = `${String(timeDifference.days).padStart(2,'0')}D`;
    }
    if (timeDifference.hours !== 0) {
      resultArray[1] = `${String(timeDifference.hours).padStart(2,'0')}H`;
    }
    if (timeDifference.minutes !== 0) {
      resultArray[2] = `${String(timeDifference.minutes).padStart(2,'0')}M`;
    }

    return resultArray.join(' ');
  };

  const duration = getDuration(ISOFrom, ISOTo);

  const isFavoriteClass = isFavorite ? ' event__favorite-btn--active' : '';

  const CreateOffers = (eventType, offersByTypes) => {
    const createOfferMarkup = (offer) => `<li class="event__offer">
                    <span class="event__offer-title">${offer.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${offer.price}</span>
                  </li>`;

    let offersByCurrentType = [];

    for (let i = 0; i < offersByTypes.length; i++) {
      if (offersByTypes[i].type === eventType) {
        offersByCurrentType = offersByTypes[i].offers;
      }
    }

    return offersByCurrentType.map(createOfferMarkup).join('');
  };

  const OffersMarkup = CreateOffers(type, eventTypes());

  return `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${dateFrom}">${dayStart}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${destinationName}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${datetimeFrom}">${timeFrom}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${datetimeTo}">${timeTo}</time>
                  </p>
                  <p class="event__duration">${duration}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${price}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">${OffersMarkup}</ul>
                <button class="event__favorite-btn${isFavoriteClass}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`;
};

export default class EventEditView extends AbstractView {
  #event = null;

  constructor(event) {
    super();
    this.#event = event;
  }

  get template() {
    return createTripEventTemplate(this.#event);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
