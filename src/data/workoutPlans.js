export const workoutPlans = [
  {
    id: 'beginner-full-body',
    name: 'Beginner Full Body',
    emoji: '💪',
    level: 'Beginner',
    duration: '4 weeks',
    daysPerWeek: 3,
    goal: 'Build foundation',
    description: 'Perfect starting point. Full body workouts 3x/week with bodyweight exercises that build real strength.',
    weeks: [
      {
        week: 1,
        workouts: [
          {
            day: 'Day 1',
            name: 'Full Body A',
            exercises: [
              { name: 'Bodyweight Squats', sets: 3, reps: '12', rest: '60s', emoji: '🦵', tip: 'Keep chest up, knees tracking over toes' },
              { name: 'Push-Ups', sets: 3, reps: '8-10', rest: '60s', emoji: '💪', tip: 'Keep body in a straight line' },
              { name: 'Glute Bridges', sets: 3, reps: '15', rest: '45s', emoji: '🍑', tip: 'Squeeze glutes at the top' },
              { name: 'Plank Hold', sets: 3, reps: '20s', rest: '45s', emoji: '🧱', tip: 'Engage core and breathe normally' },
              { name: 'Jumping Jacks', sets: 2, reps: '30', rest: '30s', emoji: '⭐', tip: 'Warm-up movement, keep it light' },
            ],
          },
          {
            day: 'Day 3',
            name: 'Full Body B',
            exercises: [
              { name: 'Reverse Lunges', sets: 3, reps: '10 each leg', rest: '60s', emoji: '🦵', tip: 'Step back and lower knee toward floor' },
              { name: 'Incline Push-Ups', sets: 3, reps: '12', rest: '60s', emoji: '💪', tip: 'Use a wall or chair for easier variation' },
              { name: 'Superman Hold', sets: 3, reps: '10', rest: '45s', emoji: '🦸', tip: 'Lift arms and legs simultaneously' },
              { name: 'Dead Bug', sets: 3, reps: '8 each side', rest: '45s', emoji: '🐛', tip: 'Press lower back into floor' },
              { name: 'March in Place', sets: 2, reps: '60s', rest: '30s', emoji: '🚶', tip: 'High knees, stay light on feet' },
            ],
          },
          {
            day: 'Day 5',
            name: 'Full Body C',
            exercises: [
              { name: 'Sumo Squats', sets: 3, reps: '15', rest: '60s', emoji: '🦵', tip: 'Wide stance, toes angled out' },
              { name: 'Pike Push-Ups', sets: 3, reps: '8', rest: '60s', emoji: '💪', tip: 'Target shoulders with a V-shaped body' },
              { name: 'Hip Thrusts', sets: 3, reps: '15', rest: '45s', emoji: '🍑', tip: 'Drive hips up using glutes' },
              { name: 'Side Plank', sets: 2, reps: '15s each side', rest: '45s', emoji: '🧱', tip: 'Keep hips lifted off ground' },
              { name: 'Mountain Climbers', sets: 2, reps: '20', rest: '45s', emoji: '🏔️', tip: 'Drive knees toward chest alternately' },
            ],
          },
        ],
      },
      {
        week: 2,
        workouts: [
          {
            day: 'Day 1',
            name: 'Full Body A+',
            exercises: [
              { name: 'Bodyweight Squats', sets: 3, reps: '15', rest: '60s', emoji: '🦵', tip: 'Add a pause at the bottom' },
              { name: 'Push-Ups', sets: 3, reps: '10-12', rest: '60s', emoji: '💪', tip: 'Try to increase reps from last week' },
              { name: 'Glute Bridges', sets: 3, reps: '20', rest: '45s', emoji: '🍑', tip: 'Hold at top for 2 seconds' },
              { name: 'Plank Hold', sets: 3, reps: '30s', rest: '45s', emoji: '🧱', tip: 'Work up to 30 seconds' },
              { name: 'Squat Jumps', sets: 2, reps: '10', rest: '60s', emoji: '⚡', tip: 'Land softly with bent knees' },
            ],
          },
          {
            day: 'Day 3',
            name: 'Full Body B+',
            exercises: [
              { name: 'Walking Lunges', sets: 3, reps: '12 each leg', rest: '60s', emoji: '🦵', tip: 'Take long strides, keep torso upright' },
              { name: 'Diamond Push-Ups', sets: 3, reps: '8', rest: '60s', emoji: '💪', tip: 'Hands form a diamond shape' },
              { name: 'Superman Hold', sets: 3, reps: '12', rest: '45s', emoji: '🦸', tip: 'Hold for 2 seconds at top' },
              { name: 'Bicycle Crunches', sets: 3, reps: '16', rest: '45s', emoji: '🚲', tip: 'Slow and controlled' },
              { name: 'High Knees', sets: 2, reps: '30s', rest: '30s', emoji: '🏃', tip: 'Drive knees up to hip height' },
            ],
          },
          {
            day: 'Day 5',
            name: 'Full Body C+',
            exercises: [
              { name: 'Jump Squats', sets: 3, reps: '10', rest: '60s', emoji: '⚡', tip: 'Explode upward, land softly' },
              { name: 'Wide Push-Ups', sets: 3, reps: '10', rest: '60s', emoji: '💪', tip: 'Hands wider than shoulder-width' },
              { name: 'Single-Leg Glute Bridge', sets: 3, reps: '10 each', rest: '45s', emoji: '🍑', tip: 'Keep hips level throughout' },
              { name: 'Plank Shoulder Taps', sets: 3, reps: '12 each side', rest: '45s', emoji: '🧱', tip: 'Minimize hip rotation' },
              { name: 'Burpees (modified)', sets: 2, reps: '8', rest: '60s', emoji: '🔥', tip: 'Step back instead of jumping' },
            ],
          },
        ],
      },
      {
        week: 3,
        workouts: [
          {
            day: 'Day 1',
            name: 'Strength Focus',
            exercises: [
              { name: 'Pistol Squat Assist', sets: 3, reps: '6 each leg', rest: '90s', emoji: '🦵', tip: 'Hold a surface for balance' },
              { name: 'Decline Push-Ups', sets: 3, reps: '10', rest: '60s', emoji: '💪', tip: 'Feet elevated on chair' },
              { name: 'Hip Thrust Hold', sets: 3, reps: '12 + 10s hold', rest: '60s', emoji: '🍑', tip: 'Hold the last rep at top' },
              { name: 'Hollow Body Hold', sets: 3, reps: '25s', rest: '60s', emoji: '🧱', tip: 'Arms extended overhead' },
              { name: 'Box Jumps (use step)', sets: 3, reps: '8', rest: '60s', emoji: '📦', tip: 'Land with both feet quietly' },
            ],
          },
          {
            day: 'Day 3',
            name: 'Power Focus',
            exercises: [
              { name: 'Jump Lunges', sets: 3, reps: '10 each leg', rest: '90s', emoji: '⚡', tip: 'Alternate legs in the air' },
              { name: 'Archer Push-Ups', sets: 3, reps: '6 each side', rest: '60s', emoji: '🏹', tip: 'Shift weight to one arm' },
              { name: 'Nordic Curl Assist', sets: 3, reps: '5', rest: '90s', emoji: '🦵', tip: 'Slow descent, use hands to help up' },
              { name: 'L-Sit Hold', sets: 3, reps: '10s', rest: '60s', emoji: '💺', tip: 'Use chairs to support' },
              { name: 'Broad Jump', sets: 3, reps: '6', rest: '60s', emoji: '🦘', tip: 'Jump as far forward as possible' },
            ],
          },
          {
            day: 'Day 5',
            name: 'Endurance Focus',
            exercises: [
              { name: 'Squat to Lunge', sets: 3, reps: '10 each side', rest: '60s', emoji: '🦵', tip: 'Flow from squat to lunge' },
              { name: 'Push-Up + Rotation', sets: 3, reps: '8 each side', rest: '60s', emoji: '🔄', tip: 'Rotate into side plank at top' },
              { name: 'Bulgarian Split Squat', sets: 3, reps: '10 each leg', rest: '60s', emoji: '🦵', tip: 'Rear foot elevated on chair' },
              { name: 'Plank to Downdog', sets: 3, reps: '10', rest: '45s', emoji: '🧘', tip: 'Flow smoothly between positions' },
              { name: 'Tabata Squats', sets: 4, reps: '20s on/10s off', rest: '0s', emoji: '⏱️', tip: 'Max reps each interval' },
            ],
          },
        ],
      },
      {
        week: 4,
        workouts: [
          {
            day: 'Day 1',
            name: 'Peak Week A',
            exercises: [
              { name: 'Pistol Squats', sets: 3, reps: '5 each leg', rest: '90s', emoji: '🦵', tip: 'Minimal assist if needed' },
              { name: 'Clap Push-Ups', sets: 3, reps: '8', rest: '90s', emoji: '👏', tip: 'Explosive push, clap mid-air' },
              { name: 'Single-Leg Hip Thrust', sets: 3, reps: '12 each', rest: '60s', emoji: '🍑', tip: 'Full hip extension at top' },
              { name: 'Dragon Flag Tuck', sets: 3, reps: '6', rest: '90s', emoji: '🐉', tip: 'Keep body rigid, lower slowly' },
              { name: 'Burpees', sets: 3, reps: '12', rest: '60s', emoji: '🔥', tip: 'Full movement with jump at top' },
            ],
          },
          {
            day: 'Day 3',
            name: 'Peak Week B',
            exercises: [
              { name: 'Jump Squat Holds', sets: 4, reps: '8', rest: '60s', emoji: '⚡', tip: 'Land and hold squat for 2s' },
              { name: 'Push-Up Pyramid', sets: 1, reps: '1-2-3-4-5-4-3-2-1', rest: '20s between each', emoji: '🔺', tip: 'Rest briefly between each set in pyramid' },
              { name: 'Jump Lunges', sets: 4, reps: '12 each leg', rest: '60s', emoji: '🦵', tip: 'Powerful and controlled' },
              { name: 'Ab Wheel (or plank walk-out)', sets: 3, reps: '8', rest: '60s', emoji: '⚙️', tip: 'Keep lower back protected' },
              { name: 'Sprint in Place', sets: 5, reps: '15s all-out', rest: '30s', emoji: '🏃', tip: 'Maximum effort each sprint' },
            ],
          },
          {
            day: 'Day 5',
            name: 'Peak Week C',
            exercises: [
              { name: 'Circuit: Squat + Push-Up + Lunge', sets: 4, reps: '10 each', rest: '90s', emoji: '🔄', tip: 'No rest between exercises in circuit' },
              { name: 'Pike Push-Ups', sets: 4, reps: '12', rest: '60s', emoji: '🔱', tip: 'Aim for smooth reps' },
              { name: 'Box Step-Ups', sets: 3, reps: '15 each leg', rest: '60s', emoji: '📦', tip: 'Drive through heel of working leg' },
              { name: 'Plank Circuit', sets: 3, reps: '30s each (front, left, right)', rest: '45s', emoji: '🧱', tip: 'Seamlessly transition between' },
              { name: 'Finisher: 100 Squats', sets: 1, reps: '100', rest: 'as needed', emoji: '🏆', tip: 'Break into sets you can manage' },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'fat-burn-hiit',
    name: 'Fat Burn HIIT',
    emoji: '🔥',
    level: 'Intermediate',
    duration: '6 weeks',
    daysPerWeek: 4,
    goal: 'Burn fat fast',
    description: 'High-intensity intervals designed to maximize calorie burn and boost metabolism for 24+ hours after each session.',
    weeks: [
      {
        week: 1,
        workouts: [
          {
            day: 'Day 1',
            name: 'HIIT Cardio Blast',
            exercises: [
              { name: 'Jump Rope (or simulate)', sets: 3, reps: '60s', rest: '30s', emoji: '🪢', tip: 'Stay on balls of feet' },
              { name: 'Burpees', sets: 4, reps: '10', rest: '30s', emoji: '🔥', tip: 'Full jump and clap overhead' },
              { name: 'High Knees', sets: 4, reps: '30s', rest: '20s', emoji: '🏃', tip: 'Pump arms aggressively' },
              { name: 'Box Jumps', sets: 3, reps: '10', rest: '30s', emoji: '📦', tip: 'Land softly, step down' },
              { name: 'Mountain Climbers', sets: 4, reps: '30s', rest: '20s', emoji: '🏔️', tip: 'Drive knees fast alternately' },
            ],
          },
          {
            day: 'Day 2',
            name: 'Tabata Lower Body',
            exercises: [
              { name: 'Squat Jumps Tabata', sets: 8, reps: '20s on/10s off', rest: '0s', emoji: '⚡', tip: 'Explode every rep' },
              { name: 'Lunge Jumps Tabata', sets: 8, reps: '20s on/10s off', rest: '0s', emoji: '⚡', tip: 'Alternate legs in air' },
              { name: 'Sumo Squat Pulse', sets: 3, reps: '30', rest: '30s', emoji: '🦵', tip: 'Stay low the entire time' },
              { name: 'Wall Sit', sets: 3, reps: '45s', rest: '30s', emoji: '🧱', tip: 'Thighs parallel to floor' },
            ],
          },
          {
            day: 'Day 4',
            name: 'Upper Body HIIT',
            exercises: [
              { name: 'Push-Up Tabata', sets: 8, reps: '20s on/10s off', rest: '0s', emoji: '💪', tip: 'Every rep counts' },
              { name: 'Tricep Dips', sets: 4, reps: '15', rest: '30s', emoji: '💺', tip: 'Use chair or low surface' },
              { name: 'Pike Push-Ups', sets: 4, reps: '12', rest: '30s', emoji: '🔱', tip: 'Targets shoulders' },
              { name: 'Plank Shoulder Taps', sets: 4, reps: '20', rest: '30s', emoji: '🧱', tip: 'Minimal hip rotation' },
              { name: 'Inchworms', sets: 3, reps: '8', rest: '30s', emoji: '🐛', tip: 'Walk hands out and in' },
            ],
          },
          {
            day: 'Day 6',
            name: 'Full Body HIIT',
            exercises: [
              { name: 'Burpee to Tuck Jump', sets: 4, reps: '8', rest: '45s', emoji: '🔥', tip: 'Explosive tuck at top' },
              { name: 'Push-Up to Side Plank', sets: 3, reps: '10 each side', rest: '30s', emoji: '🔄', tip: 'Rotate fully to side plank' },
              { name: 'Jump Squat + Reverse Lunge', sets: 3, reps: '10', rest: '45s', emoji: '⚡', tip: 'Flow between movements' },
              { name: 'Hollow Body Rocks', sets: 3, reps: '20', rest: '30s', emoji: '🧘', tip: 'Arms and legs stay extended' },
              { name: 'Sprint Intervals', sets: 6, reps: '20s sprint/40s walk', rest: '0s', emoji: '🏃', tip: 'Max effort each sprint' },
            ],
          },
        ],
      },
      {
        week: 2,
        workouts: [
          {
            day: 'Day 1',
            name: 'AMRAP Cardio',
            exercises: [
              { name: 'AMRAP 15min: 10 Burpees + 15 Squats + 20 Mountain Climbers', sets: 1, reps: 'Max rounds', rest: 'As needed', emoji: '⏱️', tip: 'Record your round count' },
              { name: 'Cooldown Walk', sets: 1, reps: '5 min', rest: '0s', emoji: '🚶', tip: 'Bring heart rate down gradually' },
            ],
          },
          {
            day: 'Day 3',
            name: 'Power Intervals',
            exercises: [
              { name: 'Box Jump Broad Jump Combo', sets: 4, reps: '8', rest: '45s', emoji: '📦', tip: 'Jump up then forward' },
              { name: 'Speed Skaters', sets: 4, reps: '30s', rest: '20s', emoji: '⛸️', tip: 'Lateral hops, reach toward floor' },
              { name: 'Explosive Lunge Jumps', sets: 4, reps: '10 each leg', rest: '45s', emoji: '⚡', tip: 'Max height each rep' },
              { name: 'Plank Jacks', sets: 3, reps: '30s', rest: '20s', emoji: '🧱', tip: 'Keep hips level' },
              { name: 'Tuck Jumps', sets: 4, reps: '10', rest: '45s', emoji: '🦘', tip: 'Tuck knees to chest' },
            ],
          },
          {
            day: 'Day 5',
            name: 'Metabolic Circuit',
            exercises: [
              { name: '5-Round Circuit', sets: 5, reps: '8 Burpees + 12 Push-Ups + 16 Squats', rest: '90s between rounds', emoji: '🔄', tip: 'Minimize rest within the circuit' },
              { name: 'Core Finisher', sets: 3, reps: '45s plank + 20 bicycle crunches', rest: '30s', emoji: '🔥', tip: 'Straight into each movement' },
            ],
          },
          {
            day: 'Day 7',
            name: 'Active Recovery HIIT',
            exercises: [
              { name: 'Low-Impact Jacks', sets: 3, reps: '45s', rest: '15s', emoji: '⭐', tip: 'Step instead of jump' },
              { name: 'Slow Squats', sets: 3, reps: '15 (4s down, 4s up)', rest: '30s', emoji: '🦵', tip: 'Controlled tempo' },
              { name: 'Cat-Cow Stretch', sets: 3, reps: '10', rest: '0s', emoji: '🐱', tip: 'Breathe with movement' },
              { name: 'Hip Flexor Stretch', sets: 1, reps: '60s each side', rest: '0s', emoji: '🧘', tip: 'Deep stretch for recovery' },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'strength-builder',
    name: 'Strength Builder',
    emoji: '🏋️',
    level: 'Intermediate',
    duration: '8 weeks',
    daysPerWeek: 4,
    goal: 'Build strength',
    description: 'Progressive overload compound lifts to build real, functional strength. Focuses on the big lifts with accessory work.',
    weeks: [
      {
        week: 1,
        workouts: [
          {
            day: 'Day 1',
            name: 'Lower Body — Squat Focus',
            exercises: [
              { name: 'Barbell Back Squat', sets: 4, reps: '6', rest: '180s', emoji: '🏋️', tip: 'Brace core, drive knees out' },
              { name: 'Romanian Deadlift', sets: 3, reps: '10', rest: '120s', emoji: '🏋️', tip: 'Push hips back, slight knee bend' },
              { name: 'Leg Press', sets: 3, reps: '12', rest: '90s', emoji: '🦵', tip: 'Full range of motion' },
              { name: 'Walking Lunges', sets: 3, reps: '12 each leg', rest: '90s', emoji: '🦵', tip: 'Long stride, knee barely touches floor' },
              { name: 'Calf Raises', sets: 4, reps: '15', rest: '60s', emoji: '🦶', tip: 'Full stretch at bottom' },
            ],
          },
          {
            day: 'Day 2',
            name: 'Upper Body — Push',
            exercises: [
              { name: 'Barbell Bench Press', sets: 4, reps: '6', rest: '180s', emoji: '🏋️', tip: 'Tuck elbows, arch upper back slightly' },
              { name: 'Overhead Press', sets: 3, reps: '8', rest: '120s', emoji: '🏋️', tip: 'Lock out at top, core braced' },
              { name: 'Incline Dumbbell Press', sets: 3, reps: '10', rest: '90s', emoji: '🏋️', tip: '30-45 degree incline' },
              { name: 'Lateral Raises', sets: 3, reps: '15', rest: '60s', emoji: '💪', tip: 'Slight forward lean, thumbs down' },
              { name: 'Tricep Pushdowns', sets: 3, reps: '12', rest: '60s', emoji: '💪', tip: 'Full extension at bottom' },
            ],
          },
          {
            day: 'Day 4',
            name: 'Lower Body — Deadlift Focus',
            exercises: [
              { name: 'Conventional Deadlift', sets: 4, reps: '5', rest: '180s', emoji: '🏋️', tip: 'Lat spread, push floor away' },
              { name: 'Front Squat', sets: 3, reps: '8', rest: '120s', emoji: '🏋️', tip: 'Elbows high, upright torso' },
              { name: 'Leg Curl', sets: 3, reps: '12', rest: '90s', emoji: '🦵', tip: 'Squeeze hamstrings at top' },
              { name: 'Bulgarian Split Squat', sets: 3, reps: '10 each', rest: '90s', emoji: '🦵', tip: 'Front leg does the work' },
              { name: 'Plank', sets: 3, reps: '45s', rest: '45s', emoji: '🧱', tip: 'Full body tension' },
            ],
          },
          {
            day: 'Day 5',
            name: 'Upper Body — Pull',
            exercises: [
              { name: 'Pull-Ups / Lat Pulldown', sets: 4, reps: '6-8', rest: '120s', emoji: '💪', tip: 'Full hang to chin over bar' },
              { name: 'Barbell Row', sets: 4, reps: '8', rest: '120s', emoji: '🏋️', tip: 'Chest to bar, squeeze at top' },
              { name: 'Cable Row', sets: 3, reps: '12', rest: '90s', emoji: '🏋️', tip: 'Elbows tight to body' },
              { name: 'Face Pulls', sets: 3, reps: '15', rest: '60s', emoji: '💪', tip: 'External rotation at end' },
              { name: 'Barbell Curl', sets: 3, reps: '12', rest: '60s', emoji: '💪', tip: 'No swinging, strict form' },
            ],
          },
        ],
      },
      {
        week: 2,
        workouts: [
          {
            day: 'Day 1',
            name: 'Lower — Squat (Progressive)',
            exercises: [
              { name: 'Barbell Back Squat', sets: 4, reps: '5', rest: '180s', emoji: '🏋️', tip: 'Add 2.5kg from last week' },
              { name: 'Romanian Deadlift', sets: 3, reps: '10', rest: '120s', emoji: '🏋️', tip: 'Increase weight if form is solid' },
              { name: 'Hack Squat', sets: 3, reps: '10', rest: '90s', emoji: '🦵', tip: 'Full depth with control' },
              { name: 'Reverse Lunges', sets: 3, reps: '12 each', rest: '90s', emoji: '🦵', tip: 'More challenging than forward lunges' },
              { name: 'Standing Calf Raise', sets: 4, reps: '15', rest: '60s', emoji: '🦶', tip: 'Use weight if possible' },
            ],
          },
          {
            day: 'Day 3',
            name: 'Upper — Push (Progressive)',
            exercises: [
              { name: 'Bench Press', sets: 4, reps: '5', rest: '180s', emoji: '🏋️', tip: 'Add 2.5kg from last week' },
              { name: 'Seated OHP', sets: 3, reps: '8', rest: '120s', emoji: '🏋️', tip: 'Seated for more isolation' },
              { name: 'Dumbbell Fly', sets: 3, reps: '12', rest: '90s', emoji: '🏋️', tip: 'Slight elbow bend, deep stretch' },
              { name: 'Arnold Press', sets: 3, reps: '12', rest: '90s', emoji: '💪', tip: 'Rotate through full range' },
              { name: 'Overhead Tricep Extension', sets: 3, reps: '12', rest: '60s', emoji: '💪', tip: 'Keep elbows close' },
            ],
          },
          {
            day: 'Day 5',
            name: 'Lower — Deadlift (Progressive)',
            exercises: [
              { name: 'Deadlift', sets: 4, reps: '4', rest: '180s', emoji: '🏋️', tip: 'Heavier than week 1' },
              { name: 'Pause Squat', sets: 3, reps: '6', rest: '120s', emoji: '🦵', tip: '2-second pause at bottom' },
              { name: 'Good Mornings', sets: 3, reps: '10', rest: '90s', emoji: '🏋️', tip: 'Slight knee bend, hinge at hips' },
              { name: 'Glute Ham Raise', sets: 3, reps: '8', rest: '90s', emoji: '🍑', tip: 'Slow eccentric' },
              { name: 'Hanging Knee Raise', sets: 3, reps: '15', rest: '45s', emoji: '🏋️', tip: 'Controlled, no swinging' },
            ],
          },
          {
            day: 'Day 6',
            name: 'Upper — Pull (Progressive)',
            exercises: [
              { name: 'Weighted Pull-Ups', sets: 4, reps: '5', rest: '120s', emoji: '💪', tip: 'Add small plate if bodyweight is easy' },
              { name: 'Pendlay Row', sets: 4, reps: '6', rest: '120s', emoji: '🏋️', tip: 'Reset on floor each rep' },
              { name: 'Single-Arm DB Row', sets: 3, reps: '12 each', rest: '90s', emoji: '🏋️', tip: 'Full stretch at bottom' },
              { name: 'Rear Delt Fly', sets: 3, reps: '15', rest: '60s', emoji: '💪', tip: 'Focus on rear delts' },
              { name: 'Hammer Curls', sets: 3, reps: '12', rest: '60s', emoji: '💪', tip: 'Both heads of bicep' },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'home-warrior',
    name: 'Home Warrior',
    emoji: '🏠',
    level: 'Intermediate',
    duration: '4 weeks',
    daysPerWeek: 5,
    goal: 'Get fit at home',
    description: 'No equipment needed. 5 days of structured home workouts that build muscle, burn fat, and improve fitness without a gym.',
    weeks: [
      {
        week: 1,
        workouts: [
          {
            day: 'Day 1',
            name: 'Push Day',
            exercises: [
              { name: 'Push-Ups', sets: 4, reps: '15', rest: '60s', emoji: '💪', tip: 'Full range of motion' },
              { name: 'Pike Push-Ups', sets: 3, reps: '12', rest: '60s', emoji: '🔱', tip: 'Head toward floor' },
              { name: 'Tricep Dips on Chair', sets: 3, reps: '15', rest: '60s', emoji: '💺', tip: 'Elbows close to body' },
              { name: 'Diamond Push-Ups', sets: 3, reps: '10', rest: '60s', emoji: '💎', tip: 'Hands form diamond shape' },
              { name: 'Shoulder Circles & Stretch', sets: 2, reps: '30s each direction', rest: '30s', emoji: '🔄', tip: 'Cooldown for shoulders' },
            ],
          },
          {
            day: 'Day 2',
            name: 'Pull & Back Day',
            exercises: [
              { name: 'Table Rows (under sturdy table)', sets: 4, reps: '12', rest: '60s', emoji: '🪑', tip: 'Pull chest to table edge' },
              { name: 'Doorframe Pulls', sets: 3, reps: '15', rest: '60s', emoji: '🚪', tip: 'Use a doorframe for resistance' },
              { name: 'Superman', sets: 3, reps: '15', rest: '45s', emoji: '🦸', tip: 'Hold 2 seconds at top' },
              { name: 'Reverse Snow Angels (prone)', sets: 3, reps: '12', rest: '45s', emoji: '❄️', tip: 'Arms along floor, raise and sweep' },
              { name: 'Cat-Cow Thoracic Extension', sets: 3, reps: '10', rest: '30s', emoji: '🐱', tip: 'Mobilize the upper back' },
            ],
          },
          {
            day: 'Day 3',
            name: 'Leg Day',
            exercises: [
              { name: 'Bodyweight Squats', sets: 4, reps: '20', rest: '60s', emoji: '🦵', tip: 'Full depth' },
              { name: 'Reverse Lunges', sets: 3, reps: '15 each leg', rest: '60s', emoji: '🦵', tip: 'Control the descent' },
              { name: 'Single-Leg Deadlift', sets: 3, reps: '12 each leg', rest: '60s', emoji: '🦾', tip: 'Hinge at hip, keep back flat' },
              { name: 'Wall Sit', sets: 3, reps: '60s', rest: '60s', emoji: '🧱', tip: 'Thighs parallel to floor' },
              { name: 'Calf Raises on Step', sets: 3, reps: '20', rest: '45s', emoji: '🦶', tip: 'Use a stair step' },
            ],
          },
          {
            day: 'Day 4',
            name: 'Core & Stability',
            exercises: [
              { name: 'Plank', sets: 3, reps: '60s', rest: '45s', emoji: '🧱', tip: 'Squeeze glutes and core' },
              { name: 'Bicycle Crunches', sets: 3, reps: '24', rest: '45s', emoji: '🚲', tip: 'Slow and controlled' },
              { name: 'Leg Raises', sets: 3, reps: '15', rest: '45s', emoji: '🦵', tip: 'Lower back stays down' },
              { name: 'Russian Twists', sets: 3, reps: '20 each side', rest: '45s', emoji: '🔄', tip: 'Feet elevated for harder version' },
              { name: 'Dead Bug', sets: 3, reps: '10 each side', rest: '45s', emoji: '🐛', tip: 'Opposite arm and leg extend' },
            ],
          },
          {
            day: 'Day 5',
            name: 'Full Body Circuit',
            exercises: [
              { name: 'Burpees', sets: 4, reps: '10', rest: '45s', emoji: '🔥', tip: 'Full movement' },
              { name: 'Push-Up to T', sets: 3, reps: '8 each side', rest: '45s', emoji: '🅃', tip: 'Full rotation at top' },
              { name: 'Jump Squats', sets: 4, reps: '15', rest: '45s', emoji: '⚡', tip: 'Explosive and land soft' },
              { name: 'Mountain Climbers', sets: 3, reps: '30s', rest: '30s', emoji: '🏔️', tip: 'Drive knees fast' },
              { name: 'Plank Holds', sets: 3, reps: '45s', rest: '30s', emoji: '🧱', tip: 'Finish strong' },
            ],
          },
        ],
      },
      {
        week: 2,
        workouts: [
          {
            day: 'Day 1',
            name: 'Push Day +',
            exercises: [
              { name: 'Push-Ups (wide grip)', sets: 4, reps: '15', rest: '60s', emoji: '💪', tip: 'Wider targets chest more' },
              { name: 'Decline Push-Ups', sets: 3, reps: '12', rest: '60s', emoji: '📐', tip: 'Feet on chair' },
              { name: 'Slow Tricep Dips', sets: 3, reps: '12 (3s down)', rest: '60s', emoji: '💺', tip: 'Slow tempo is harder' },
              { name: 'Handstand Hold (wall)', sets: 3, reps: '20s', rest: '60s', emoji: '🤸', tip: 'Build shoulder strength' },
              { name: 'Plank to Push-Up', sets: 3, reps: '10', rest: '45s', emoji: '🔄', tip: 'Up-up, down-down' },
            ],
          },
          {
            day: 'Day 3',
            name: 'Leg Day +',
            exercises: [
              { name: 'Bulgarian Split Squat', sets: 4, reps: '12 each leg', rest: '90s', emoji: '🦵', tip: 'Rear foot on chair' },
              { name: 'Jump Squat', sets: 4, reps: '12', rest: '60s', emoji: '⚡', tip: 'Max height' },
              { name: 'Stiff-Leg Deadlift', sets: 3, reps: '15', rest: '60s', emoji: '🦾', tip: 'Feel hamstring stretch' },
              { name: 'Lateral Squat', sets: 3, reps: '10 each side', rest: '60s', emoji: '↔️', tip: 'Shift weight side to side' },
              { name: 'Glute Bridge Marching', sets: 3, reps: '20 total', rest: '45s', emoji: '🍑', tip: 'Alternate legs while bridged' },
            ],
          },
          {
            day: 'Day 5',
            name: 'Full Body Strength',
            exercises: [
              { name: '100 Push-Up Challenge', sets: 1, reps: '100 (any sets)', rest: 'As needed', emoji: '💪', tip: 'Complete 100 reps however you need' },
              { name: '100 Squat Challenge', sets: 1, reps: '100 (any sets)', rest: 'As needed', emoji: '🦵', tip: 'Complete 100 reps' },
              { name: 'Core Superset', sets: 3, reps: '60s plank + 20 crunches', rest: '45s', emoji: '🔥', tip: 'No rest between plank and crunches' },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'cardio-shred',
    name: 'Cardio Shred',
    emoji: '🏃',
    level: 'Intermediate',
    duration: '6 weeks',
    daysPerWeek: 5,
    goal: 'Shred & endurance',
    description: 'Running-focused program mixed with HIIT. Builds cardiovascular endurance while stripping fat. Requires outdoor or treadmill access.',
    weeks: [
      {
        week: 1,
        workouts: [
          {
            day: 'Day 1',
            name: 'Easy Run + Core',
            exercises: [
              { name: 'Easy Jog', sets: 1, reps: '20 min', rest: '0s', emoji: '🏃', tip: 'Conversational pace — you should be able to talk' },
              { name: 'Walking Cooldown', sets: 1, reps: '5 min', rest: '0s', emoji: '🚶', tip: 'Gradually lower heart rate' },
              { name: 'Plank', sets: 3, reps: '45s', rest: '45s', emoji: '🧱', tip: 'Core after cardio' },
              { name: 'Leg Raises', sets: 3, reps: '15', rest: '45s', emoji: '🦵', tip: 'Controlled lower' },
            ],
          },
          {
            day: 'Day 2',
            name: 'Interval Run',
            exercises: [
              { name: 'Warm-Up Walk', sets: 1, reps: '5 min', rest: '0s', emoji: '🚶', tip: 'Get blood moving' },
              { name: 'Run Intervals: 1 min fast/2 min easy', sets: 8, reps: '3 min per interval', rest: '0s', emoji: '⚡', tip: 'Hard effort during fast portions' },
              { name: 'Cooldown Walk', sets: 1, reps: '5 min', rest: '0s', emoji: '🚶', tip: 'Stretch after' },
            ],
          },
          {
            day: 'Day 4',
            name: 'Tempo Run',
            exercises: [
              { name: 'Easy Warm-Up', sets: 1, reps: '10 min', rest: '0s', emoji: '🏃', tip: 'Very easy pace' },
              { name: 'Tempo Run (comfortably hard)', sets: 1, reps: '15 min', rest: '0s', emoji: '🔥', tip: '7/10 effort — hard to talk in full sentences' },
              { name: 'Easy Cool-Down', sets: 1, reps: '5 min', rest: '0s', emoji: '🚶', tip: 'Let heart rate come down' },
              { name: 'Stretching', sets: 1, reps: '10 min', rest: '0s', emoji: '🧘', tip: 'Hamstrings, calves, quads, hips' },
            ],
          },
          {
            day: 'Day 5',
            name: 'HIIT Cardio',
            exercises: [
              { name: 'Burpees', sets: 5, reps: '10', rest: '30s', emoji: '🔥', tip: 'Full extension at top' },
              { name: 'Jump Rope / Simulate', sets: 5, reps: '60s', rest: '30s', emoji: '🪢', tip: 'Double unders if possible' },
              { name: 'Box Jumps', sets: 4, reps: '10', rest: '30s', emoji: '📦', tip: 'Land softly' },
              { name: 'Sprint 20m x 10', sets: 10, reps: '20m sprint', rest: '30s', emoji: '⚡', tip: 'Max speed, full recovery' },
            ],
          },
          {
            day: 'Day 6',
            name: 'Long Slow Run',
            exercises: [
              { name: 'Long Run (easy pace)', sets: 1, reps: '35-40 min', rest: '0s', emoji: '🏃', tip: 'Easy conversational pace — this is about time on feet' },
              { name: 'Post-Run Stretch', sets: 1, reps: '10 min full body', rest: '0s', emoji: '🧘', tip: 'Priority after long runs' },
            ],
          },
        ],
      },
      {
        week: 2,
        workouts: [
          {
            day: 'Day 1',
            name: 'Easy Run + Strength',
            exercises: [
              { name: 'Easy Jog', sets: 1, reps: '25 min', rest: '0s', emoji: '🏃', tip: 'Add 5 min from last week' },
              { name: 'Push-Ups', sets: 3, reps: '15', rest: '60s', emoji: '💪', tip: 'Upper body after run' },
              { name: 'Squats', sets: 3, reps: '20', rest: '60s', emoji: '🦵', tip: 'Running muscle reinforcement' },
              { name: 'Core Circuit', sets: 3, reps: '30s plank + 15 crunches', rest: '45s', emoji: '🔥', tip: 'Finish strong' },
            ],
          },
          {
            day: 'Day 3',
            name: 'Pyramid Intervals',
            exercises: [
              { name: 'Warm-Up', sets: 1, reps: '5 min easy', rest: '0s', emoji: '🚶', tip: 'Get warm first' },
              { name: 'Pyramid: 1-2-3-2-1 min hard', sets: 1, reps: 'With equal rest', rest: '0s', emoji: '🔺', tip: 'Hard means 8/10 effort' },
              { name: 'Cooldown', sets: 1, reps: '5 min', rest: '0s', emoji: '🧘', tip: 'Easy walk' },
            ],
          },
          {
            day: 'Day 5',
            name: 'Speed Work',
            exercises: [
              { name: '400m Repeats', sets: 6, reps: '400m (1 lap) at hard pace', rest: '90s walk', emoji: '🏟️', tip: 'Consistent effort each repeat' },
              { name: 'Strides', sets: 4, reps: '100m', rest: '60s', emoji: '⚡', tip: 'Build to fast, not sprint' },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'flexibility-core',
    name: 'Flexibility & Core',
    emoji: '🧘',
    level: 'Beginner',
    duration: '4 weeks',
    daysPerWeek: 6,
    goal: 'Flexibility & core strength',
    description: 'Daily yoga-inspired flows combined with targeted core work. Build mobility, posture, and a strong stable center.',
    weeks: [
      {
        week: 1,
        workouts: [
          {
            day: 'Day 1',
            name: 'Morning Flow',
            exercises: [
              { name: 'Sun Salutation A', sets: 3, reps: '5 rounds', rest: '30s', emoji: '☀️', tip: 'Breathe with each movement' },
              { name: 'Cat-Cow', sets: 3, reps: '10 each direction', rest: '0s', emoji: '🐱', tip: 'Spine mobilization' },
              { name: 'Downward Dog Hold', sets: 3, reps: '30s', rest: '15s', emoji: '🐕', tip: 'Pedal heels alternately' },
              { name: 'Pigeon Pose', sets: 1, reps: '90s each side', rest: '0s', emoji: '🕊️', tip: 'Deep hip flexor and glute stretch' },
              { name: 'Child\'s Pose', sets: 1, reps: '2 min', rest: '0s', emoji: '🧸', tip: 'Arms extended overhead' },
            ],
          },
          {
            day: 'Day 2',
            name: 'Core Foundation',
            exercises: [
              { name: 'Dead Bug', sets: 4, reps: '10 each side', rest: '30s', emoji: '🐛', tip: 'Lower back pressed to floor' },
              { name: 'Plank', sets: 3, reps: '45s', rest: '30s', emoji: '🧱', tip: 'Build from 30s' },
              { name: 'Bird Dog', sets: 3, reps: '10 each side', rest: '30s', emoji: '🦅', tip: 'Keep hips level' },
              { name: 'Hollow Body Hold', sets: 3, reps: '20s', rest: '30s', emoji: '🍌', tip: 'Lower back glued to floor' },
              { name: 'Supine Twist', sets: 1, reps: '60s each side', rest: '0s', emoji: '🔄', tip: 'Let shoulder drop to floor' },
            ],
          },
          {
            day: 'Day 3',
            name: 'Hip Openers',
            exercises: [
              { name: 'Lizard Pose', sets: 1, reps: '90s each side', rest: '0s', emoji: '🦎', tip: 'Deep hip flexor stretch' },
              { name: 'Frog Pose Hold', sets: 1, reps: '2 min', rest: '0s', emoji: '🐸', tip: 'Gentle inner thigh release' },
              { name: 'Butterfly Stretch', sets: 3, reps: '60s', rest: '0s', emoji: '🦋', tip: 'Press knees toward floor gently' },
              { name: 'Sumo Squat Hold', sets: 3, reps: '45s', rest: '30s', emoji: '🦵', tip: 'Elbows push knees open' },
              { name: 'Happy Baby Pose', sets: 1, reps: '90s', rest: '0s', emoji: '👶', tip: 'Rock side to side' },
            ],
          },
          {
            day: 'Day 4',
            name: 'Strength Flow',
            exercises: [
              { name: 'Warrior I', sets: 3, reps: '45s each side', rest: '15s', emoji: '⚔️', tip: 'Stack hips square to front' },
              { name: 'Warrior II', sets: 3, reps: '45s each side', rest: '15s', emoji: '⚔️', tip: 'Gaze over front fingertips' },
              { name: 'Chair Pose (Utkatasana)', sets: 3, reps: '45s', rest: '30s', emoji: '💺', tip: 'Weight in heels, knees behind toes' },
              { name: 'Boat Pose (Navasana)', sets: 3, reps: '30s', rest: '30s', emoji: '⛵', tip: 'Core keeps you balanced' },
              { name: 'Crow Pose Attempt', sets: 3, reps: '10s or practice', rest: '30s', emoji: '🐦', tip: 'Lean forward slowly, triceps shelf for knees' },
            ],
          },
          {
            day: 'Day 5',
            name: 'Spinal Health',
            exercises: [
              { name: 'Cobra Pose', sets: 4, reps: '30s hold', rest: '15s', emoji: '🐍', tip: 'Elbows slightly bent' },
              { name: 'Sphinx Pose', sets: 3, reps: '60s', rest: '15s', emoji: '🏛️', tip: 'Forearms on floor, gentle back extension' },
              { name: 'Bridge Pose', sets: 4, reps: '45s', rest: '30s', emoji: '🌉', tip: 'Shoulder blades together' },
              { name: 'Thread the Needle', sets: 2, reps: '60s each side', rest: '15s', emoji: '🧵', tip: 'Shoulder and upper back opener' },
              { name: 'Legs Up the Wall', sets: 1, reps: '5 min', rest: '0s', emoji: '🦵', tip: 'Restorative inversion' },
            ],
          },
          {
            day: 'Day 6',
            name: 'Full Body Flexibility',
            exercises: [
              { name: 'Sun Salutation B', sets: 3, reps: '5 rounds', rest: '30s', emoji: '🌅', tip: 'Includes Warrior poses' },
              { name: 'Half Pigeon', sets: 1, reps: '2 min each side', rest: '0s', emoji: '🕊️', tip: 'Deepest hip opener' },
              { name: 'Seated Forward Fold', sets: 3, reps: '60s', rest: '15s', emoji: '📐', tip: 'Hinge at hips, not spine' },
              { name: 'Shoulder & Chest Opener', sets: 3, reps: '45s each direction', rest: '15s', emoji: '💪', tip: 'Clasped hands behind back' },
              { name: 'Full Body Relaxation (Savasana)', sets: 1, reps: '5 min', rest: '0s', emoji: '🌙', tip: 'Completely still, let body absorb practice' },
            ],
          },
        ],
      },
      {
        week: 2,
        workouts: [
          {
            day: 'Day 1',
            name: 'Advanced Flow',
            exercises: [
              { name: 'Sun Salutation A + B', sets: 4, reps: '5 rounds each', rest: '30s', emoji: '☀️', tip: 'Increase volume from week 1' },
              { name: 'Side Plank', sets: 3, reps: '45s each side', rest: '30s', emoji: '🧱', tip: 'Add to core repertoire' },
              { name: 'Camel Pose', sets: 3, reps: '30s', rest: '30s', emoji: '🐪', tip: 'Deep back bend, open chest' },
              { name: 'Seated Twist', sets: 2, reps: '60s each side', rest: '15s', emoji: '🔄', tip: 'Lengthen spine before twisting' },
            ],
          },
          {
            day: 'Day 3',
            name: 'Core Intensity',
            exercises: [
              { name: 'Hollow Body Rocks', sets: 4, reps: '30 rocks', rest: '30s', emoji: '🍌', tip: 'Advance from static hold' },
              { name: 'V-Ups', sets: 3, reps: '12', rest: '45s', emoji: '📐', tip: 'Touch toes at top' },
              { name: 'Dragon Flags (modified)', sets: 3, reps: '6', rest: '60s', emoji: '🐉', tip: 'Keep body straight as a board' },
              { name: 'L-Sit Hold', sets: 3, reps: '15s', rest: '45s', emoji: '💺', tip: 'Use yoga blocks or chairs' },
              { name: 'Yin Yoga Cool-Down', sets: 1, reps: '5-7 min', rest: '0s', emoji: '🧘', tip: 'Hold each pose 1-2 min' },
            ],
          },
        ],
      },
    ],
  },
]
