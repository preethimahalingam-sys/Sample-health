export const WEIGHT_KEY = 'health_weight_goal_v1';

export function loadWeightGoal() {
  try {
    return JSON.parse(localStorage.getItem(WEIGHT_KEY) || 'null');
  } catch {
    return null;
  }
}

export function saveWeightGoal(data) {
  localStorage.setItem(WEIGHT_KEY, JSON.stringify(data));
}

export function generateWorkoutPlan(currentWeight, goalWeight, unit) {
  const diff = currentWeight - goalWeight;
  const diffKg = unit === 'lbs' ? diff * 0.453592 : diff;

  // Determine goal type
  let goalType;
  if (Math.abs(diffKg) < 2) goalType = 'maintain';
  else if (diffKg > 0) goalType = 'lose';
  else goalType = 'gain';

  const intensity = Math.abs(diffKg) > 10 ? 'high' : Math.abs(diffKg) > 5 ? 'medium' : 'low';

  const plans = {
    lose: {
      high: [
        { week: 1, focus: 'Foundation', days: [
          { day: 'Mon', workout: 'HIIT Cardio', duration: 30, type: 'hiit', note: 'Intervals: 30s on, 15s rest' },
          { day: 'Tue', workout: 'Full Body Strength', duration: 40, type: 'weights', note: 'Focus on compound lifts' },
          { day: 'Wed', workout: 'Brisk Walk / Light Jog', duration: 45, type: 'walking', note: 'Zone 2 cardio, conversational pace' },
          { day: 'Thu', workout: 'Circuit Training', duration: 35, type: 'hiit', note: 'Bodyweight circuits' },
          { day: 'Fri', workout: 'Upper Body Strength', duration: 40, type: 'weights', note: 'Push + pull movements' },
          { day: 'Sat', workout: 'Long Run or Cycling', duration: 50, type: 'running', note: 'Steady state cardio' },
          { day: 'Sun', workout: 'Active Recovery / Yoga', duration: 30, type: 'yoga', note: 'Stretching and mobility' },
        ]},
        { week: 2, focus: 'Intensity Up', days: [
          { day: 'Mon', workout: 'HIIT Sprints', duration: 35, type: 'hiit', note: '40s on, 20s rest, 8 rounds' },
          { day: 'Tue', workout: 'Lower Body Strength', duration: 45, type: 'weights', note: 'Squats, lunges, deadlifts' },
          { day: 'Wed', workout: 'Swimming or Cycling', duration: 40, type: 'swimming', note: 'Low impact cardio' },
          { day: 'Thu', workout: 'Tabata', duration: 30, type: 'hiit', note: '20s on, 10s rest, 8 exercises' },
          { day: 'Fri', workout: 'Full Body Strength', duration: 45, type: 'weights', note: 'Heavier weights this week' },
          { day: 'Sat', workout: 'Run 5K', duration: 35, type: 'running', note: 'Push pace slightly' },
          { day: 'Sun', workout: 'Rest or Yoga', duration: 25, type: 'yoga', note: 'Recovery is key' },
        ]},
        { week: 3, focus: 'Peak Effort', days: [
          { day: 'Mon', workout: 'HIIT + Core', duration: 40, type: 'hiit', note: 'Cardio intervals + planks' },
          { day: 'Tue', workout: 'Heavy Strength', duration: 50, type: 'weights', note: '5×5 compound movements' },
          { day: 'Wed', workout: 'Long Walk', duration: 60, type: 'walking', note: 'Zone 2, burn fat' },
          { day: 'Thu', workout: 'Circuit + Jump Rope', duration: 40, type: 'hiit', note: 'High intensity' },
          { day: 'Fri', workout: 'Lower Body + Core', duration: 45, type: 'weights', note: 'Glutes and abs focus' },
          { day: 'Sat', workout: 'Run 7K', duration: 50, type: 'running', note: 'Longest run of the month' },
          { day: 'Sun', workout: 'Yoga + Stretch', duration: 30, type: 'yoga', note: 'Full body recovery' },
        ]},
        { week: 4, focus: 'Consolidate & Measure', days: [
          { day: 'Mon', workout: 'HIIT Cardio', duration: 30, type: 'hiit', note: 'Maintain intensity' },
          { day: 'Tue', workout: 'Full Body Strength', duration: 40, type: 'weights', note: 'Same weights as week 3' },
          { day: 'Wed', workout: 'Rest or Walk', duration: 30, type: 'walking', note: 'Active deload' },
          { day: 'Thu', workout: 'Light Circuit', duration: 30, type: 'hiit', note: 'Lower intensity' },
          { day: 'Fri', workout: 'Strength Test', duration: 40, type: 'weights', note: 'Max reps baseline' },
          { day: 'Sat', workout: 'Fun Activity', duration: 45, type: 'other', note: 'Hike, sport, swim — enjoy it!' },
          { day: 'Sun', workout: 'Rest & Reflect', duration: 0, type: 'yoga', note: 'Weigh in and set new goals' },
        ]},
      ],
      medium: [
        { week: 1, focus: 'Getting Started', days: [
          { day: 'Mon', workout: 'Brisk Walk + Bodyweight', duration: 35, type: 'walking', note: 'Walk 20min + squats/push-ups' },
          { day: 'Tue', workout: 'Strength Circuit', duration: 35, type: 'weights', note: 'Full body, light weights' },
          { day: 'Wed', workout: 'Rest or Yoga', duration: 20, type: 'yoga', note: 'Gentle stretching' },
          { day: 'Thu', workout: 'Cardio Intervals', duration: 30, type: 'hiit', note: '1min jog, 2min walk' },
          { day: 'Fri', workout: 'Strength Training', duration: 35, type: 'weights', note: 'Focus on form' },
          { day: 'Sat', workout: 'Long Walk or Easy Jog', duration: 40, type: 'walking', note: 'Enjoy the movement' },
          { day: 'Sun', workout: 'Rest', duration: 0, type: 'other', note: 'Full rest day' },
        ]},
        { week: 2, focus: 'Build Consistency', days: [
          { day: 'Mon', workout: 'HIIT Light', duration: 25, type: 'hiit', note: '30s work, 30s rest' },
          { day: 'Tue', workout: 'Lower Body', duration: 35, type: 'weights', note: 'Squats, bridges, lunges' },
          { day: 'Wed', workout: 'Walk 5K', duration: 40, type: 'walking', note: 'Steady pace' },
          { day: 'Thu', workout: 'Upper Body', duration: 35, type: 'weights', note: 'Push-ups, rows, shoulder press' },
          { day: 'Fri', workout: 'Cardio + Core', duration: 30, type: 'hiit', note: 'Jog + plank variations' },
          { day: 'Sat', workout: 'Cycling or Swimming', duration: 40, type: 'cycling', note: 'Fun cardio' },
          { day: 'Sun', workout: 'Yoga', duration: 25, type: 'yoga', note: 'Mobility and recovery' },
        ]},
        { week: 3, focus: 'Push Further', days: [
          { day: 'Mon', workout: 'HIIT Cardio', duration: 30, type: 'hiit', note: 'Increase intensity' },
          { day: 'Tue', workout: 'Full Body Strength', duration: 40, type: 'weights', note: 'Add weight if ready' },
          { day: 'Wed', workout: 'Active Rest', duration: 25, type: 'walking', note: 'Gentle walk' },
          { day: 'Thu', workout: 'Cardio Intervals', duration: 35, type: 'running', note: 'Run/walk intervals' },
          { day: 'Fri', workout: 'Strength + Core', duration: 40, type: 'weights', note: 'Add ab work' },
          { day: 'Sat', workout: 'Long Walk / Run', duration: 45, type: 'walking', note: 'Endurance effort' },
          { day: 'Sun', workout: 'Rest', duration: 0, type: 'other', note: 'Recover well' },
        ]},
        { week: 4, focus: 'Finish Strong', days: [
          { day: 'Mon', workout: 'HIIT', duration: 30, type: 'hiit', note: 'Best effort' },
          { day: 'Tue', workout: 'Strength', duration: 35, type: 'weights', note: 'Maintain gains' },
          { day: 'Wed', workout: 'Walk', duration: 30, type: 'walking', note: 'Easy day' },
          { day: 'Thu', workout: 'Cardio', duration: 30, type: 'running', note: 'Moderate jog' },
          { day: 'Fri', workout: 'Full Body', duration: 35, type: 'weights', note: 'Celebrate progress' },
          { day: 'Sat', workout: 'Fun Activity', duration: 40, type: 'other', note: 'Something you enjoy' },
          { day: 'Sun', workout: 'Weigh In & Rest', duration: 0, type: 'yoga', note: 'Measure your progress!' },
        ]},
      ],
      low: [
        { week: 1, focus: 'Light Movement', days: [
          { day: 'Mon', workout: 'Evening Walk', duration: 30, type: 'walking', note: 'Casual pace is fine' },
          { day: 'Tue', workout: 'Yoga Flow', duration: 25, type: 'yoga', note: 'Gentle full body' },
          { day: 'Wed', workout: 'Rest', duration: 0, type: 'other', note: '' },
          { day: 'Thu', workout: 'Bodyweight Circuit', duration: 20, type: 'hiit', note: 'Squats, push-ups, sit-ups' },
          { day: 'Fri', workout: 'Walk', duration: 30, type: 'walking', note: '' },
          { day: 'Sat', workout: 'Light Activity', duration: 30, type: 'other', note: 'Anything active' },
          { day: 'Sun', workout: 'Rest', duration: 0, type: 'other', note: '' },
        ]},
        { week: 2, focus: 'Add Strength', days: [
          { day: 'Mon', workout: 'Walk + Stretch', duration: 30, type: 'walking', note: '' },
          { day: 'Tue', workout: 'Bodyweight Strength', duration: 25, type: 'weights', note: 'No equipment needed' },
          { day: 'Wed', workout: 'Yoga', duration: 25, type: 'yoga', note: '' },
          { day: 'Thu', workout: 'Walk', duration: 35, type: 'walking', note: 'Slightly longer' },
          { day: 'Fri', workout: 'Strength Circuit', duration: 25, type: 'weights', note: '' },
          { day: 'Sat', workout: 'Fun Activity', duration: 30, type: 'other', note: '' },
          { day: 'Sun', workout: 'Rest', duration: 0, type: 'other', note: '' },
        ]},
        { week: 3, focus: 'Build Habit', days: [
          { day: 'Mon', workout: 'Brisk Walk', duration: 35, type: 'walking', note: 'Faster pace' },
          { day: 'Tue', workout: 'Strength', duration: 30, type: 'weights', note: '' },
          { day: 'Wed', workout: 'Yoga or Rest', duration: 20, type: 'yoga', note: '' },
          { day: 'Thu', workout: 'Light Jog / Walk', duration: 30, type: 'running', note: '' },
          { day: 'Fri', workout: 'Strength', duration: 30, type: 'weights', note: '' },
          { day: 'Sat', workout: 'Outdoor Activity', duration: 40, type: 'other', note: '' },
          { day: 'Sun', workout: 'Rest', duration: 0, type: 'other', note: '' },
        ]},
        { week: 4, focus: 'Measure Progress', days: [
          { day: 'Mon', workout: 'Walk', duration: 30, type: 'walking', note: '' },
          { day: 'Tue', workout: 'Strength', duration: 30, type: 'weights', note: '' },
          { day: 'Wed', workout: 'Rest', duration: 0, type: 'other', note: '' },
          { day: 'Thu', workout: 'Light Cardio', duration: 25, type: 'walking', note: '' },
          { day: 'Fri', workout: 'Full Body', duration: 30, type: 'weights', note: '' },
          { day: 'Sat', workout: 'Fun Activity', duration: 30, type: 'other', note: '' },
          { day: 'Sun', workout: 'Weigh In & Rest', duration: 0, type: 'yoga', note: 'Check your progress!' },
        ]},
      ],
    },
    gain: {
      high: [
        { week: 1, focus: 'Foundation Strength', days: [
          { day: 'Mon', workout: 'Heavy Squats & Deadlifts', duration: 50, type: 'weights', note: '5×5 progressive overload' },
          { day: 'Tue', workout: 'Upper Body Push', duration: 45, type: 'weights', note: 'Bench press, shoulder press' },
          { day: 'Wed', workout: 'Active Recovery', duration: 30, type: 'walking', note: 'Light walk + stretching' },
          { day: 'Thu', workout: 'Upper Body Pull', duration: 45, type: 'weights', note: 'Rows, pull-ups, curls' },
          { day: 'Fri', workout: 'Leg Day', duration: 50, type: 'weights', note: 'Squats, leg press, lunges' },
          { day: 'Sat', workout: 'Full Body Power', duration: 45, type: 'weights', note: 'Compound movements' },
          { day: 'Sun', workout: 'Rest', duration: 0, type: 'other', note: 'Eat well and sleep' },
        ]},
        { week: 2, focus: 'Volume Increase', days: [
          { day: 'Mon', workout: 'Chest & Triceps', duration: 50, type: 'weights', note: '4×8-10 reps' },
          { day: 'Tue', workout: 'Back & Biceps', duration: 50, type: 'weights', note: 'Deadlifts + rows' },
          { day: 'Wed', workout: 'Legs & Glutes', duration: 55, type: 'weights', note: 'Squat variation + hip hinge' },
          { day: 'Thu', workout: 'Rest or Yoga', duration: 25, type: 'yoga', note: 'Mobility work' },
          { day: 'Fri', workout: 'Shoulders & Arms', duration: 45, type: 'weights', note: 'Isolation work' },
          { day: 'Sat', workout: 'Full Body Circuit', duration: 45, type: 'weights', note: 'Moderate weight, higher reps' },
          { day: 'Sun', workout: 'Rest', duration: 0, type: 'other', note: 'Recovery and calories matter' },
        ]},
        { week: 3, focus: 'Overload', days: [
          { day: 'Mon', workout: 'Heavy Compound Day', duration: 55, type: 'weights', note: 'Increase weights by 5%' },
          { day: 'Tue', workout: 'Upper Push', duration: 50, type: 'weights', note: 'Push to near failure' },
          { day: 'Wed', workout: 'Active Rest', duration: 30, type: 'walking', note: '' },
          { day: 'Thu', workout: 'Upper Pull', duration: 50, type: 'weights', note: 'Focus on lat engagement' },
          { day: 'Fri', workout: 'Leg Power', duration: 55, type: 'weights', note: 'Heavy squats + plyos' },
          { day: 'Sat', workout: 'Full Body Strength', duration: 50, type: 'weights', note: 'Compound focus' },
          { day: 'Sun', workout: 'Rest', duration: 0, type: 'other', note: '' },
        ]},
        { week: 4, focus: 'Deload & Measure', days: [
          { day: 'Mon', workout: 'Light Strength', duration: 40, type: 'weights', note: '60% of usual weight' },
          { day: 'Tue', workout: 'Upper Body Light', duration: 35, type: 'weights', note: 'Focus on form' },
          { day: 'Wed', workout: 'Yoga / Mobility', duration: 30, type: 'yoga', note: '' },
          { day: 'Thu', workout: 'Lower Body Light', duration: 35, type: 'weights', note: '' },
          { day: 'Fri', workout: 'Full Body Light', duration: 35, type: 'weights', note: '' },
          { day: 'Sat', workout: 'Fun Activity', duration: 30, type: 'other', note: '' },
          { day: 'Sun', workout: 'Weigh In & Plan', duration: 0, type: 'other', note: 'Reassess and set new targets' },
        ]},
      ],
      medium: [
        { week: 1, focus: 'Build Strength Base', days: [
          { day: 'Mon', workout: 'Full Body Strength', duration: 45, type: 'weights', note: '3×10 compound lifts' },
          { day: 'Tue', workout: 'Rest or Walk', duration: 20, type: 'walking', note: '' },
          { day: 'Wed', workout: 'Upper Body', duration: 40, type: 'weights', note: 'Push & pull' },
          { day: 'Thu', workout: 'Rest', duration: 0, type: 'other', note: '' },
          { day: 'Fri', workout: 'Lower Body', duration: 40, type: 'weights', note: 'Squats & deadlifts' },
          { day: 'Sat', workout: 'Light Activity', duration: 30, type: 'walking', note: '' },
          { day: 'Sun', workout: 'Rest', duration: 0, type: 'other', note: '' },
        ]},
        { week: 2, focus: 'Add Volume', days: [
          { day: 'Mon', workout: 'Full Body A', duration: 45, type: 'weights', note: 'Add one extra set' },
          { day: 'Tue', workout: 'Active Recovery', duration: 25, type: 'yoga', note: '' },
          { day: 'Wed', workout: 'Full Body B', duration: 45, type: 'weights', note: 'Different exercises' },
          { day: 'Thu', workout: 'Rest', duration: 0, type: 'other', note: '' },
          { day: 'Fri', workout: 'Full Body C', duration: 45, type: 'weights', note: 'Focus on weak points' },
          { day: 'Sat', workout: 'Walk or Bike', duration: 30, type: 'walking', note: '' },
          { day: 'Sun', workout: 'Rest', duration: 0, type: 'other', note: '' },
        ]},
        { week: 3, focus: 'Progressive Overload', days: [
          { day: 'Mon', workout: 'Heavy Lower', duration: 50, type: 'weights', note: 'Increase weight' },
          { day: 'Tue', workout: 'Upper Push', duration: 40, type: 'weights', note: '' },
          { day: 'Wed', workout: 'Rest / Stretch', duration: 20, type: 'yoga', note: '' },
          { day: 'Thu', workout: 'Upper Pull', duration: 40, type: 'weights', note: '' },
          { day: 'Fri', workout: 'Full Body', duration: 45, type: 'weights', note: '' },
          { day: 'Sat', workout: 'Activity', duration: 30, type: 'other', note: '' },
          { day: 'Sun', workout: 'Rest', duration: 0, type: 'other', note: '' },
        ]},
        { week: 4, focus: 'Consolidate', days: [
          { day: 'Mon', workout: 'Strength', duration: 40, type: 'weights', note: '' },
          { day: 'Tue', workout: 'Rest', duration: 0, type: 'other', note: '' },
          { day: 'Wed', workout: 'Strength', duration: 40, type: 'weights', note: '' },
          { day: 'Thu', workout: 'Walk', duration: 25, type: 'walking', note: '' },
          { day: 'Fri', workout: 'Strength', duration: 40, type: 'weights', note: '' },
          { day: 'Sat', workout: 'Fun Activity', duration: 30, type: 'other', note: '' },
          { day: 'Sun', workout: 'Weigh In', duration: 0, type: 'other', note: 'Check muscle gain progress' },
        ]},
      ],
      low: [
        { week: 1, focus: 'Start Moving', days: [
          { day: 'Mon', workout: 'Bodyweight Strength', duration: 25, type: 'weights', note: 'Squats, push-ups, pull-ups' },
          { day: 'Tue', workout: 'Rest', duration: 0, type: 'other', note: '' },
          { day: 'Wed', workout: 'Bodyweight Strength', duration: 25, type: 'weights', note: '' },
          { day: 'Thu', workout: 'Walk', duration: 25, type: 'walking', note: '' },
          { day: 'Fri', workout: 'Strength', duration: 25, type: 'weights', note: '' },
          { day: 'Sat', workout: 'Activity', duration: 25, type: 'other', note: '' },
          { day: 'Sun', workout: 'Rest', duration: 0, type: 'other', note: '' },
        ]},
        { week: 2, focus: 'Add Resistance', days: [
          { day: 'Mon', workout: 'Strength + Weights', duration: 30, type: 'weights', note: 'Add light dumbbells' },
          { day: 'Tue', workout: 'Rest', duration: 0, type: 'other', note: '' },
          { day: 'Wed', workout: 'Strength', duration: 30, type: 'weights', note: '' },
          { day: 'Thu', workout: 'Yoga', duration: 20, type: 'yoga', note: '' },
          { day: 'Fri', workout: 'Strength', duration: 30, type: 'weights', note: '' },
          { day: 'Sat', workout: 'Activity', duration: 25, type: 'other', note: '' },
          { day: 'Sun', workout: 'Rest', duration: 0, type: 'other', note: '' },
        ]},
        { week: 3, focus: 'Build More', days: [
          { day: 'Mon', workout: 'Strength', duration: 35, type: 'weights', note: '' },
          { day: 'Tue', workout: 'Rest', duration: 0, type: 'other', note: '' },
          { day: 'Wed', workout: 'Strength', duration: 35, type: 'weights', note: '' },
          { day: 'Thu', workout: 'Walk', duration: 25, type: 'walking', note: '' },
          { day: 'Fri', workout: 'Strength', duration: 35, type: 'weights', note: '' },
          { day: 'Sat', workout: 'Activity', duration: 30, type: 'other', note: '' },
          { day: 'Sun', workout: 'Rest', duration: 0, type: 'other', note: '' },
        ]},
        { week: 4, focus: 'Measure', days: [
          { day: 'Mon', workout: 'Strength', duration: 30, type: 'weights', note: '' },
          { day: 'Tue', workout: 'Rest', duration: 0, type: 'other', note: '' },
          { day: 'Wed', workout: 'Strength', duration: 30, type: 'weights', note: '' },
          { day: 'Thu', workout: 'Rest', duration: 0, type: 'other', note: '' },
          { day: 'Fri', workout: 'Strength', duration: 30, type: 'weights', note: '' },
          { day: 'Sat', workout: 'Fun Activity', duration: 25, type: 'other', note: '' },
          { day: 'Sun', workout: 'Weigh In', duration: 0, type: 'other', note: 'Track your gain!' },
        ]},
      ],
    },
    maintain: {
      low: [
        { week: 1, focus: 'Active Lifestyle', days: [
          { day: 'Mon', workout: 'Strength Training', duration: 35, type: 'weights', note: 'Full body, 3×12' },
          { day: 'Tue', workout: 'Cardio', duration: 30, type: 'running', note: 'Easy jog or bike' },
          { day: 'Wed', workout: 'Yoga', duration: 25, type: 'yoga', note: 'Flexibility focus' },
          { day: 'Thu', workout: 'Strength', duration: 35, type: 'weights', note: '' },
          { day: 'Fri', workout: 'Cardio', duration: 30, type: 'running', note: '' },
          { day: 'Sat', workout: 'Fun Activity', duration: 40, type: 'other', note: 'Sport, hike, swim' },
          { day: 'Sun', workout: 'Rest', duration: 0, type: 'other', note: '' },
        ]},
        { week: 2, focus: 'Balanced Fitness', days: [
          { day: 'Mon', workout: 'Strength', duration: 35, type: 'weights', note: '' },
          { day: 'Tue', workout: 'HIIT', duration: 25, type: 'hiit', note: 'Short and effective' },
          { day: 'Wed', workout: 'Walk or Yoga', duration: 30, type: 'yoga', note: '' },
          { day: 'Thu', workout: 'Strength', duration: 35, type: 'weights', note: '' },
          { day: 'Fri', workout: 'Cardio', duration: 30, type: 'running', note: '' },
          { day: 'Sat', workout: 'Activity', duration: 40, type: 'other', note: '' },
          { day: 'Sun', workout: 'Rest', duration: 0, type: 'other', note: '' },
        ]},
        { week: 3, focus: 'Stay Consistent', days: [
          { day: 'Mon', workout: 'Strength', duration: 40, type: 'weights', note: 'Slight weight increase' },
          { day: 'Tue', workout: 'Cardio', duration: 30, type: 'running', note: '' },
          { day: 'Wed', workout: 'Yoga', duration: 25, type: 'yoga', note: '' },
          { day: 'Thu', workout: 'HIIT', duration: 25, type: 'hiit', note: '' },
          { day: 'Fri', workout: 'Strength', duration: 40, type: 'weights', note: '' },
          { day: 'Sat', workout: 'Fun Activity', duration: 45, type: 'other', note: '' },
          { day: 'Sun', workout: 'Rest', duration: 0, type: 'other', note: '' },
        ]},
        { week: 4, focus: 'Reflect & Maintain', days: [
          { day: 'Mon', workout: 'Strength', duration: 35, type: 'weights', note: '' },
          { day: 'Tue', workout: 'Cardio', duration: 30, type: 'running', note: '' },
          { day: 'Wed', workout: 'Rest or Yoga', duration: 20, type: 'yoga', note: '' },
          { day: 'Thu', workout: 'Strength', duration: 35, type: 'weights', note: '' },
          { day: 'Fri', workout: 'Cardio or HIIT', duration: 30, type: 'hiit', note: '' },
          { day: 'Sat', workout: 'Activity', duration: 40, type: 'other', note: '' },
          { day: 'Sun', workout: 'Weigh In & Rest', duration: 0, type: 'other', note: 'Great work this month!' },
        ]},
      ],
    },
  };

  const plan = plans[goalType]?.[intensity] || plans[goalType]?.low || plans.maintain.low;

  return { goalType, intensity, diffKg: Math.abs(diffKg).toFixed(1), plan };
}
