import flatpickr from 'flatpickr';
import SmartView from './smart-view';
import { eventTypes } from '../mock/event-types';
import { locations } from '../mock/locations';
import { createEventTypes, createOffersSection } from '../utils/route';
import he from 'he';

const createAddEventItemTemplate = (point) => {
  const {basePrice: price, destination, type} = point;
  const eventTypeLabel = type ? type.charAt(0).toUpperCase() + type.slice(1) : '';

  const eventTypesMarkup = createEventTypes(eventTypes(), type);
  const locationOptions = locations().map((x) => (`<option value="${x.name}"></option>`)).join('');

  const createPhotosMarkup = (dest) => {
    if (dest.pictures.length > 0) {
      return dest.pictures
        .map((x) => (`<img class="event__photo" src="${x.src}" alt="${x.description}">`))
        .join('');
    }

    return '';
  };

  const photosMarkup = createPhotosMarkup(destination);

  const editedOffersMarkup = createOffersSection(eventTypes(), type);

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${eventTypesMarkup}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${eventTypeLabel}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destination.name ? destination.name : '')}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${locationOptions}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input event__input--time event__input-start-time" id="event-start-time-1" type="text" name="event-start-time" value="">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input event__input--time event__input-end-time" id="event-end-time-1" type="text" name="event-end-time" value="">
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${he.encode(price ? price.toString() : '')}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">${editedOffersMarkup}<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description ? destination.description : ''}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${photosMarkup}
          </div>
        </div>
      </section>
    </section>
  </form>
</li>`;
};

export default class AddEventItemView extends SmartView {
  #datePickerFrom = null;
  #datePickerTo = null;

  constructor(point) {
    super();
    this._data = AddEventItemView.createEmptyPoint(point);

    this.#setInnerHandlers();
    this.#setDatePicker();
  }

  get template() {
    return createAddEventItemTemplate(this._data);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datePickerFrom) {
      this.#datePickerFrom.destroy();
      this.#datePickerFrom = null;
    }

    if (this.#datePickerTo) {
      this.#datePickerTo.destroy();
      this.#datePickerTo = null;
    }
  }

  reset = (point) => {
    this.updateData(
      AddEventItemView.parsePointToData(point),
    );
  }

  #setDatePicker = () => {
    this.#datePickerFrom = flatpickr(
      this.element.querySelector('.event__input-start-time'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateFrom,
        onChange: this.#dateFromChangeHandler
      },
    );
    this.#datePickerTo = flatpickr(
      this.element.querySelector('.event__input-end-time'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateTo,
        onChange: this.#dateToChangeHandler
      },
    );
  }

  #dateFromChangeHandler = ([userDate]) => {
    this.updateData({
      dateFrom: userDate.toISOString(),
    });
  }

  #dateToChangeHandler = ([userDate]) => {
    this.updateData({
      dateTo: userDate.toISOString(),
    });
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDatePicker();

    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeGroupClickHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#basePriceChangeHandler);
  }

  #typeGroupClickHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value
    }, false);
  }

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      destination: this.#getChangedDestination(evt.target.value)
    }, false);
  }

  #basePriceChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      basePrice: evt.target.value
    }, true);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(AddEventItemView.parseDataToPoint(this._data));
  }

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  }

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(AddEventItemView.parseDataToPoint(this._data));
  }

  static createEmptyPoint = () => {
    const offerArray = eventTypes();
    const date = new Date();
    return {
      basePrice: null,
      dateFrom: date.toISOString(),
      dateTo: date.toISOString(),
      destination: {
        'description': null,
        'name': '',
        'pictures': []
      },
      id: null,
      isFavorite: false,
      offers: offerArray,
      type: 'taxi'
    };
  }

  static parsePointToData = (point) => ({...point,
  });

  static parseDataToPoint = (data) => {
    const point = {...data};

    return point;
  }

  #getChangedDestination = (locationName) => {
    const allLocations = locations();

    for (let i = 0; i < allLocations.length; i++) {
      if (allLocations[i].name === locationName) {
        return allLocations[i];
      }
    }
    return {
      'name': '',
      'description': null,
      'pictures': []
    };
  };
}
