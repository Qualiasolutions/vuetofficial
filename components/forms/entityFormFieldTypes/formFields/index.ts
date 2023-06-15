import { useAnniversaryForm } from './anniversary';
import { useBirthdayForm } from './birthday';
import { carForm } from './car';
import { useBoatForm } from './boat';
import { usePublicTransportForm } from './public-transport';
import { useEventForm } from './event';
import { useHobbyForm } from './hobby';
import { useListForm } from './list';
import { useTripForm } from './trip';
import { useTripActivityForm } from './trip-activity';
import { usePetForm } from './pet';
import { useDaysOffForm } from './days-off';
import { useAcademicPlanForm } from './academic-plan';
import { useExtracurricularPlanForm } from './extracurricular-plan';
import { useCareerGoalForm } from './career-goals';
import { useHomeForm } from './home';
import { useSocialMediaForm } from './social-media';
import { useSocialPlanForm } from './social-plan';
import { useHolidayForm } from './holiday';
import { useSchoolForm } from './school';
import { useSchoolBreakForm } from './school-break';
import { useFlightForm } from './flight';
import { useTrainBusFerryForm } from './train-bus-ferry';
import { useDriveTimeForm } from './drive-time';
import { useRentalCarForm } from './rental-car';
import { useTaxiTransferForm } from './taxi-transfer';
import { useHotelForm } from './hotel';
import { useStayWithFriendForm } from './stay-with-friend';
import { useHealthBeautyForm } from './health-beauty';
import { useFinanceForm } from './finance';
import { useFoodForm } from './food';
import { useClothingForm } from './clothing';

export default (isEdit: boolean) => {
  return {
    Car: carForm(isEdit),
    Boat: useBoatForm(),
    PublicTransport: usePublicTransportForm(),
    Birthday: useBirthdayForm(),
    Anniversary: useAnniversaryForm(),
    Event: useEventForm(),
    Hobby: useHobbyForm(),
    List: useListForm(),
    Trip: useTripForm(),
    TripActivity: useTripActivityForm(),
    Pet: usePetForm(),
    DaysOff: useDaysOffForm(),
    AcademicPlan: useAcademicPlanForm(),
    ExtracurricularPlan: useExtracurricularPlanForm(),
    CareerGoal: useCareerGoalForm(),
    Home: useHomeForm(),
    Food: useFoodForm(),
    Clothing: useClothingForm(),
    SocialMedia: useSocialMediaForm(),
    SocialPlan: useSocialPlanForm(),
    Holiday: useHolidayForm(),
    School: useSchoolForm(),
    SchoolBreak: useSchoolBreakForm(),
    Flight: useFlightForm(),
    TrainBusFerry: useTrainBusFerryForm(),
    RentalCar: useRentalCarForm(),
    TaxiOrTransfer: useTaxiTransferForm(),
    DriveTime: useDriveTimeForm(),
    HotelOrRental: useHotelForm(),
    StayWithFriend: useStayWithFriendForm(),
    HealthBeauty: useHealthBeautyForm(),
    Finance: useFinanceForm()
  };
};
