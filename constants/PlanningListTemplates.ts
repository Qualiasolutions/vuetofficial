import { CategoryName } from 'types/categories';

type Template = {
  [templateName: string]: {
    [sublistName: string]: string[];
  };
};
const PLANNING_LIST_TEMPLATES: { [key in CategoryName]?: Template[] } = {
  EDUCATION: [
    {
      name: 'Before and after Term Time',
      content: {
        'Before school starts': ['Clothes/uniforms/shoes', 'Buy Stationary'],
        'Before holiday school break': [
          'Buy teacher gifts, wrap or write cards time with the kids '
        ],
        'Before each school break': [
          'List trips, camps , childcare or activities'
        ],
        'Before school ends': [
          'List trips, camps , childcare, activities and/or summer work'
        ],
        'When school ends': [
          'Buy teacher gifts',
          'Clean out book bags and school work',
          'Take uniform to the dry cleaners',
          'File school reports'
        ]
      }
    }
  ]
};

export default PLANNING_LIST_TEMPLATES;
