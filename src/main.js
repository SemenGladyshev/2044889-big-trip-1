import { generateTripEvent } from './mock/trip-event.js';
import { render, RenderPosition } from './render.js';
import AddEventItemView from './view/add-event-item-view.js';
import EventItemEditView from './view/edit-event-item-view.js';
import EventsListView from './view/event-list-view.js';
import TripEventItemView from './view/trip-events-item-view.js';
import TripFiltersView from './view/trip-filters-view.js';
import TripSortView from './view/trip-sort-view.js';
import TripTabsView from './view/trip-tabs-view.js';


const TRIP_EVENTS_COUNT = 20;

const tripEvents = Array.from({length: TRIP_EVENTS_COUNT}, generateTripEvent);

const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripControlsNavigationElement = document.querySelector('.trip-controls__navigation');
const tripEventsElement = document.querySelector('.trip-events');
const tripEventsListElement = new EventsListView();

render(tripEventsElement, tripEventsListElement.element, RenderPosition.BEFOREEND);
render(tripControlsFiltersElement, new TripFiltersView(), RenderPosition.BEFOREEND);
render(tripControlsNavigationElement, new TripTabsView(), RenderPosition.BEFOREEND);
render(tripEventsElement, new TripSortView(), RenderPosition.AFTERBEGIN);
render(tripEventsListElement.element, new AddEventItemView(tripEvents[1]), RenderPosition.BEFOREEND);
render(tripEventsListElement, new AddEventItemView(tripEvents[0]), RenderPosition.BEFOREEND);

const renderEvent = (eventListElement, event) => {
  const eventItemComponent = new TripEventItemView(event);
  const eventEditComponent = new EventItemEditView(event);

  const changeFormToItem = () => {
    eventListElement.replaceChild(eventItemComponent.element, eventEditComponent.element);
  };

  const changeItemToForm = () => {
    eventListElement.replaceChild(eventEditComponent.element, eventItemComponent.element);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      changeFormToItem();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  eventItemComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
    changeItemToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  eventEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    changeFormToItem();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(eventListElement, eventItemComponent.element, RenderPosition.BEFOREEND);
};


for (let i = 1; i < TRIP_EVENTS_COUNT; i++) {
  renderEvent(tripEventsListElement.element, tripEvents[i]);
}
