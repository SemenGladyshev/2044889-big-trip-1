import dayjs from 'dayjs';
import {locations} from '../mock/locations';
import {eventTypes} from '../mock/event-types';
import { createEventTypes , createOffersSection } from '../utils/route';
import flatpickr from 'flatpickr';
//import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import SmartView from './smart-view';

const createEventEditTemplate = (point) => {
  const {basePrice: price, dateStart: ISOFrom, dateEnd: ISOTo, location, type} = point;
  const DatetimeFrom = dayjs(ISOFrom).format('DD/MM/YY HH:mm');
  const DatetimeTo = dayjs(ISOTo).format('DD/MM/YY HH:mm');

  const pointTypeLabel = type.charAt(0).toUpperCase() + type.slice(1);

  const pointTypesMarkup = createEventTypes(eventTypes(), type);
  const locationOptions = locations().map((x) => (`<option value="${x.name}"></option>`)).join('');

  const photosMarkup = location.pictures.map((x) => (`<img className="event__photo" src="${x.src}" alt="${x.description}">`)).join('');

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
                        ${pointTypesMarkup}
                      </fieldset>
                    </div>
                  </div>
                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${pointTypeLabel}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${location.name}" list="destination-list-1">
                    <datalist id="destination-list-1">
                      ${locationOptions}
                    </datalist>
                  </div>
                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time event__input-start-time" id="event-start-time-1" type="text" name="event-start-time" value="${DatetimeFrom}">
                    —
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time event__input-end-time" id="event-end-time-1" type="text" name="event-end-time" value="${DatetimeTo}">
                  </div>
                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      €
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
                  </div>
                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  ${editedOffersMarkup}
                  <section class="event__section  event__section--destination">
                    ${location.description ? '<h3 class="event__section-title  event__section-title--destination">Destination</h3>': ''}
                    <p class="event__destination-description">${location.description ? location.description : ''}</p>
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

export default class EventEditView extends SmartView {
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor(event) {
    super();
    this._data = EventEditView.parseEventToData(event);

    this.#setInnerHandlers();
    this.#setDatepicker();
  }

  get template() {
    return createEventEditTemplate(this._data);
  }

  removeElement = () => {
    super.removeElement();

    if(this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if(this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset = (event) => {
    this.updateData(EventEditView.parseEventToData(event));
  }

  #setDatepicker = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('.event__input-start-time'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateEnd,
        onChange: this.#dateToChangeHandler
      },
    );
  }

  #dateFromChangeHandler = ([userDate]) => {
    this.updateData({
      dateEnd: userDate.toISOString(),
    });
  }

  #dateToChangeHandler = ([userDate]) => {
    this.updateData({
      dateStart: userDate.toISOString(),
    });
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDatepicker();
    this.setRollupClickHandler(this._callback.rollupClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeGroupClickHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input-start-time')
      .addEventListener('change', this.#startTimeChangeHandler);
    this.element.querySelector('.event__input-end-time')
      .addEventListener('change', this.#endTimeChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#basePriceChangeHandler);
  }

  #typeGroupClickHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      destination: this.#getChangedLocation(evt.target.value)
    }, false);
  }

  #startTimeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      dateStart: evt.target.value
    }, true);
  }

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      location: this.#getChangedLocation(evt.target.value)
    }, false);
  }

  #endTimeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      dateEnd: evt.target.value
    }, true);
  }

  #basePriceChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      basePrice: evt.target.value
    }, true);
  }

  setRollupClickHandler = (callback) => {
    this._callback.rollupClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.rollupClick();
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit();
    this._callback.formSubmit(this._data);
    this._callback.formSubmit(EventEditView.parseDataToPoint(this._data));
  }

  static parseEventToData = (event) => ({...event,
  });

  static parseDataToPoint = (data) => {
    const point = {...data};

    return point;
  }

  #getChangedLocation = (locationName) => {
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
