import createInitialObject from 'components/forms/utils/createInitialObject';

it('createInitialObject ::: addMembers', () => {
  const initialObj = createInitialObject(
    {
      members: {
        type: 'addMembers',
        required: true,
        permittedValues: {
          family: [],
          friends: []
        },
        valueToDisplay: (val) => `${val.first_name} ${val.last_name}`,
        displayName: 'MEMBERS'
      }
    },
    {
      id: 1
    },
    {
      members: [1, 2, 3]
    }
  );

  expect(initialObj.members).toEqual([1, 2, 3]);
});

it('createInitialObject ::: addMembers', () => {
  const initialObj = createInitialObject(
    {
      duration_minutes: {
        displayName: 'Duration of task',
        listMode: 'MODAL',
        permittedValues: [
          {
            label: '5 Minutes',
            value: 5
          },
          {
            label: '15 Minutes',
            value: 15
          },
          {
            label: '30 Minutes',
            value: 30
          },
          {
            label: '1 Hour',
            value: 60
          }
        ],
        required: true,
        type: 'dropDown'
      }
    },
    {
      id: 1
    },
    {
      duration_minutes: 30
    }
  );

  expect(initialObj.duration_minutes).toEqual(30);
});
