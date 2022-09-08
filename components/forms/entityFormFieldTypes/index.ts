import { anniversaryForm } from './anniversary';
import { birthdayForm } from './birthday';
import { carForm } from './car';
import { boatForm } from './boat';
import { publicTransportForm } from './public-transport';
import { eventForm } from './event';
import { hobbyForm } from './hobby';
import { listForm } from './list';
import { tripForm } from './trip';
import { tripActivityForm } from './trip-activity';
import { petForm } from './pet';
import { daysOffForm } from './days-off';
import { academicPlanForm } from './academic-plan';
import { extracurricularPlanForm } from './extracurricular-plan';
import { careerGoalForm } from './career-goals';
import { homeForm } from './home';
import { socialMediaForm } from './social-media';
import { socialPlanForm } from './social-plan';
import { holidayForm } from './holiday';
import { schoolForm } from './school';
import { schoolBreakForm } from './school-break';
import { flightForm } from './flight';
import { trainBusFerryForm } from './train-bus-ferry';
import { driveTimeForm } from './drive-time';
import { rentalCarForm } from './rental-car';
import { taxiTransferForm } from './taxi-transfer';
import { hotelForm } from './hotel';
import { stayWithFriendForm } from './stay-with-friend';
import { healthBeautyForm } from './health-beauty';
import { financeForm } from './finance';

export default () => {
  return {
    Car: carForm(),
    Boat: boatForm(),
    PublicTransport: publicTransportForm(),
    Birthday: birthdayForm(),
    Anniversary: anniversaryForm(),
    Event: eventForm(),
    Hobby: hobbyForm(),
    List: listForm(),
    Trip: tripForm(),
    TripActivity: tripActivityForm(),
    Pet: petForm(),
    DaysOff: daysOffForm(),
    AcademicPlan: academicPlanForm(),
    ExtracurricularPlan: extracurricularPlanForm(),
    CareerGoal: careerGoalForm(),
    Home: homeForm(),
    SocialMedia: socialMediaForm(),
    SocialPlan: socialPlanForm(),
    Holiday: holidayForm(),
    School: schoolForm(),
    SchoolBreak: schoolBreakForm(),
    Flight: flightForm(),
    TrainBusFerry: trainBusFerryForm(),
    RentalCar: rentalCarForm(),
    TaxiOrTransfer: taxiTransferForm(),
    DriveTime: driveTimeForm(),
    HotelOrRental: hotelForm(),
    StayWithFriend: stayWithFriendForm(),
    HealthBeauty: healthBeautyForm(),
    Finance: financeForm()
  };
};
