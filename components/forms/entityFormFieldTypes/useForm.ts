import { useTranslation } from 'react-i18next';
import { EntityTypeName } from 'types/entities';
import useGetUserDetails from 'hooks/useGetUserDetails';
import { FormFieldTypes } from '../formFieldTypes';
import { carForm } from './formFields/car';
import { anniversaryForm } from './formFields/anniversary';
import { academicPlanForm } from './formFields/academic-plan';
import { birthdayForm } from './formFields/birthday';
import { boatForm } from './formFields/boat';
import { careerGoalForm } from './formFields/career-goals';
import { laundryPlanForm } from './formFields/laundry-plan';
import { daysOffForm } from './formFields/days-off';
import { driveTimeForm } from './formFields/drive-time';
import { eventForm } from './formFields/event';
import { extracurricularPlanForm } from './formFields/extracurricular-plan';
import { financeForm } from './formFields/finance';
import { flightForm } from './formFields/flight';
import { foodPlanForm } from './formFields/foodPlan';
import { healthBeautyForm } from './formFields/health-beauty';
import { hobbyForm } from './formFields/hobby';
import { holidayForm } from './formFields/holiday';
import { homeForm } from './formFields/home';
import { hotelForm } from './formFields/hotel';
import { listForm } from './formFields/list';
import { petForm } from './formFields/pet';
import { publicTransportForm } from './formFields/public-transport';
import { rentalCarForm } from './formFields/rental-car';
import { schoolBreakForm } from './formFields/school-break';
import { schoolForm } from './formFields/school';
import { socialMediaForm } from './formFields/social-media';
import { socialPlanForm } from './formFields/social-plan';
import { stayWithFriendForm } from './formFields/stay-with-friend';
import { taxiTransferForm } from './formFields/taxi-transfer';
import { trainBusFerryForm } from './formFields/train-bus-ferry';
import { tripActivityForm } from './formFields/trip-activity';
import { tripForm } from './formFields/trip';
import { useMemo } from 'react';
import { patientForm } from './formFields/patient';
import { appointmentForm } from './formFields/appointment';
import { studentForm } from './formFields/student';
import { employeeForm } from './formFields/employee';
import { gardenForm } from './formFields/garden';
import { travelPlanForm } from './formFields/travel-plan';
import { anniversaryPlanForm } from './formFields/anniversary-plan';
import { holidayPlanForm } from './formFields/holiday-plan';
import { healthGoal } from './formFields/health-goal';
import { useSelector } from 'react-redux';
import { selectEntitiesByEntityTypes } from 'reduxStore/slices/entities/selectors';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';

export default function useForm(
  entityType: EntityTypeName,
  isEdit: boolean
): FormFieldTypes {
  const { t } = useTranslation('modelFields');
  const { data: userFullDetails, isLoading: isLoadingFullDetails } =
    useGetUserDetails();

  const allSchoolIds = useSelector(selectEntitiesByEntityTypes(['School']));
  const { data: allEntities } = useGetAllEntitiesQuery();

  const form = useMemo(() => {
    if (isLoadingFullDetails || !userFullDetails) {
      return {};
    }

    if (entityType === 'Car') {
      return carForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'Boat') {
      return boatForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'Anniversary') {
      return anniversaryForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'Birthday') {
      return birthdayForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'AcademicPlan') {
      return academicPlanForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'CareerGoal') {
      return careerGoalForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'LaundryPlan') {
      return laundryPlanForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'DaysOff') {
      return daysOffForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'DriveTime') {
      return driveTimeForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'Event') {
      return eventForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'ExtracurricularPlan') {
      return extracurricularPlanForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'Finance') {
      return financeForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'Flight') {
      return flightForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'FoodPlan') {
      return foodPlanForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'HealthBeauty') {
      return healthBeautyForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'Hobby') {
      return hobbyForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'Holiday') {
      return holidayForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'Home') {
      return homeForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'Garden') {
      return gardenForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'HotelOrRental') {
      return hotelForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'List') {
      return listForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'Pet') {
      return petForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'PublicTransport') {
      return publicTransportForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'RentalCar') {
      return rentalCarForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'SchoolBreak') {
      return schoolBreakForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'School') {
      return schoolForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'SocialMedia') {
      return socialMediaForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'SocialPlan') {
      return socialPlanForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'StayWithFriend') {
      return stayWithFriendForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'TaxiOrTransfer') {
      return taxiTransferForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'TrainBusFerry') {
      return trainBusFerryForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'TripActivity') {
      return tripActivityForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'Trip') {
      return tripForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'Patient') {
      return patientForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'Appointment') {
      return appointmentForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'Student') {
      if (!allEntities) {
        return {};
      }
      const allSchools = allSchoolIds.map((id) => allEntities.byId[id]);

      return studentForm(isEdit, userFullDetails, allSchools, t);
    }

    if (entityType === 'Employee') {
      return employeeForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'TravelPlan') {
      return travelPlanForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'AnniversaryPlan') {
      return anniversaryPlanForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'HolidayPlan') {
      return holidayPlanForm(isEdit, userFullDetails, t);
    }

    if (entityType === 'HealthGoal') {
      return healthGoal(isEdit, userFullDetails, t);
    }

    return {};
  }, [
    entityType,
    isEdit,
    isLoadingFullDetails,
    t,
    userFullDetails,
    allEntities,
    allSchoolIds
  ]);

  return form;
}
