import { anniversaryForm } from './anniversary';
import { birthdayForm } from './birthday';
import { carForm } from './car';
import { boatForm } from './boat';
import { publicTransportForm } from './public-transport';
import { eventForm } from './event';
import { hobbyForm } from './hobby';
import { listForm } from './list';
import { tripForm } from './trip';
import { tripTransportForm } from './trip-transport';
import { tripAccommodationForm } from './trip-accommodation';
import { tripActivityForm } from './trip-activity';
import { petForm } from './pet';
import { daysOffForm } from './days-off';
import { academicPlanForm } from './academic-plan';
import { extracurricularPlanForm } from './extracurricular-plan';
import { careerGoalForm } from './career-goals';
import { homeForm } from './home';

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
    TripTransport: tripTransportForm(),
    TripAccommodation: tripAccommodationForm(),
    TripActivity: tripActivityForm(),
    Pet: petForm(),
    DaysOff: daysOffForm(),
    AcademicPlan: academicPlanForm(),
    ExtracurricularPlan: extracurricularPlanForm(),
    CareerGoal: careerGoalForm(),
    Home: homeForm()
  };
};
