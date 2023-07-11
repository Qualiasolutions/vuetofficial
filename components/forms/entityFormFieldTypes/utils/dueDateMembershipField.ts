import { Field } from 'components/forms/formFieldTypes';
import { UserFullResponse } from 'types/users';

export default function dueDateMembershipField(
  dueDateFieldName: string,
  userDetails: UserFullResponse,
  hidden: boolean,
  displayName: string,
  changeMembersText: string
) {
  return {
    type: 'addMembers',
    required: true,
    permittedValues: {
      family: userDetails?.family?.users || [],
      friends: userDetails?.friends || []
    },
    valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
    displayName,
    hidden,
    changeMembersText,
    initialValue: [],
    shownFields: [
      {
        [dueDateFieldName]: true
      }
    ]
  } as Field;
}
