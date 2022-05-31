const eventTypes = () => ([
  {
    'type':'taxi',
    'offers': []
  },

  {
    'type': 'bus',
    'offers': []
  },

  {
    'type': 'train',
    'offers': [
      {
        'id': 1,
        'title': 'Choose seats',
        'price': 150
      }, {
        'id': 2,
        'title': 'Lunch',
        'price': 65
      }, {
        'id': 3,
        'title': 'Extra luggage',
        'price': 175
      }
    ]
  },

  {
    'type': 'ship',
    'offers': [
      {
        'id': 4,
        'title': 'Lunch in restaraunt',
        'price': 200
      }, {
        'id': 5,
        'title': 'Spa',
        'price': 250
      }, {
        'id': 6,
        'title': 'Choose cabin',
        'price': 500
      }, {
        'id': 7,
        'title': 'All-inclusive',
        'price': '999'
      }
    ]
  },

  {
    'type': 'drive',
    'offers': [
      {
        'id': 8,
        'title': 'Rent a car',
        'price': 250
      }, {
        'id': 9,
        'title': 'Petrol',
        'price': 100
      }, {
        'id': 10,
        'title': 'Private driver',
        'price': 300
      }
    ]
  },

  {
    'type': 'flight',
    'offers': [
      {
        'id': 11,
        'title': 'Choose seat',
        'price': 250
      }, {
        'id': 12,
        'title': 'Business Class',
        'price': 500
      }, {
        'id': 13,
        'title': 'Extra luggage',
        'price': 300
      }
    ]
  },

  {
    'type': 'check-in',
    'offers': [
      {
        'id': 14,
        'title': 'Breakfast',
        'price': 100
      }, {
        'id': 15,
        'title': 'Lunch',
        'price': 150
      }, {
        'id': 16,
        'title': 'Excursion',
        'price': 200
      }
    ]
  },

  {
    'type': 'sightseeing',
    'offers': [
      {
        'id': 17,
        'title': 'Guide',
        'price': 100
      }, {
        'id': 18,
        'title': 'Souvenirs',
        'price': 200
      }
    ]
  },

  {
    'type': 'restaurant',
    'offers': [
      {
        'id': 19,
        'title': 'Tips',
        'price': 5
      }
    ]
  }
]);

export { eventTypes };
