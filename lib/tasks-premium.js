/**
 * 120Reset Premium Upgrade Tasks (lib/tasks-premium.js)
 * 
 * Contains:
 *  - The Dopamine Swap Deck ("Break the freeze instantly.")
 *  - The Anti-Overwhelm Deck ("Shatter task paralysis.")
 */

const PREMIUM_DECK_METADATA = {
  dopamine: {
    name: "⚡ The Dopamine Swap Deck",
    subheading: "Break the freeze instantly.",
    rounds: 1,
    multiplier: 1
  },
  overwhelm: {
    name: "🧠 The Anti-Overwhelm Deck",
    subheading: "Shatter task paralysis.",
    rounds: 4,
    multiplier: 4 // 4x Multiplier: 480 seconds (8.0m)
  }
};

const dopamineDeck = [
  {
    "text": "Why don't scientists trust atoms?",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "Because they make up everything. Smirk and carry on.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "What has keys but cannot unlock a single door?",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "A piano. Picture one in your head and carry on.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "I told my doctor that I broke my arm in two places.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "He told me to stop going to those places.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "What can you catch but never throw?",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "A cold. Take a breath and smile.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "What do you call fake noodles?",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "An impasta. Drop your shoulders and get back to it.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "What has a thumb and four fingers, but is not alive?",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "A glove. Now look at your own hand and get moving.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Why did the scarecrow win an award?",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "Because he was outstanding in his field.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "The more you take, the more you leave behind. What are they?",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "Footsteps. Walk 10 paces right now.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "I used to play piano by ear.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "Now I use my hands.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "What gets wetter the more it dries?",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "A towel. Blink three times and refocus.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Why do we tell actors to 'break a leg'?",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "Because every play has a cast.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "What has a head, a tail, is brown, and has no legs?",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "A penny. Check your pocket or bag for loose change.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Parallel lines have so much in common.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "It’s a shame they’ll never meet.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "What has one eye, but cannot see?",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "A needle. Take a slow, clear breath.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "My boss told me to have a good day.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "So I packed up and went home.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "What runs all day but never walks, has a bed but never sleeps?",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "A river. Imagine cold mountain water right now.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "How do you organize a space party?",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "You planet.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "What begins with an E, ends with an E, but only contains one letter?",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "An envelope. Now close that overdue email draft.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Time flies like an arrow.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "Fruit flies like a banana.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "What has hands, but cannot clap?",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "A clock. Your 120 seconds are up.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "When was your last trip to Florence, Italy?",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "If you've been, remember the espresso. If you haven't, open a flight tab tonight.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Have you ever stepped foot in Indonesia?",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Picture warm tropical air, volcanic hills, and ocean wind. Start planning the escape.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "What was the single best meal you ever had while on holiday?",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Recall who was sitting across the table and the first taste. Bottle that feeling.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Open your photo backup and jump directly to February 18, 2023.",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Look at where you were and who you were with. Current stress is temporary.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Have you ever walked through Tokyo at night?",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Neon signage, ramen steam, and total silence in a crowd. Take yourself there for five seconds.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Scroll to the oldest saved photo currently in your camera roll.",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "A quick look at your past self. You've conquered everything since that photo was taken.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "When was the last time you boarded an airplane with only a weekend bag?",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Nothing beats terminal boarding calls and unscripted weekends. Book one soon.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Open your maps app and drop a pin on your childhood street.",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Zoom in on the rooftop. Your life is vastly bigger than the work problem on your desk.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "What was the very first car or bicycle you owned?",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Remember the first time you drove or rode it solo. Pure unvarnished freedom.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Have you ever swum in the Mediterranean Sea?",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Cold, salty water and rocky shores. Let the mental picture wipe out your meeting exhaustion.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Think of the absolute best concert or live gig you ever attended.",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Recall the bass thumping against your ribcage. That energy still belongs to you.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Search your photos for the keyword 'sunset' and tap the first one that appears.",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Real sky beats office lighting every day of the week. Lock your screen now.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "What is the most remote place you have ever physically stood?",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Complete silence and cold wind. Remember how quiet the world can actually be.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Open your weather app and check the current temperature in Reykjavik, Iceland.",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Somewhere in the world it is freezing and vast. Put your phone down and carry on.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Remember your favorite video game or Saturday morning cartoon from when you were ten.",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Zero bills, zero deadlines, pure absorption. Keep a fraction of that spirit today.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Search your food delivery app for the lowest-rated burger joint near you.",
    "focusArea": "Focus Area: Cravings & Taste",
    "affirmation": "Do not try it. Close the app immediately.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "What is the absolute best cup of coffee or tea you've ever had?",
    "focusArea": "Focus Area: Cravings & Taste",
    "affirmation": "Go order or brew one right now if you can. You've earned it.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Decide on your exact lunch order right this second. No second-guessing.",
    "focusArea": "Focus Area: Cravings & Taste",
    "affirmation": "Decision made. The dopamine anticipation is now working in your favor.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Imagine biting directly into a wedge of fresh, sour lemon.",
    "focusArea": "Focus Area: Cravings & Taste",
    "affirmation": "Your mouth just watered. Your mind controls your physiology; use it to focus.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Walk to the office pantry, pour fresh cold water, and drink it standing tall.",
    "focusArea": "Focus Area: Cravings & Taste",
    "affirmation": "Cold hydration finished. Blood volume up, brain fog down.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Look through cinema listings for a current movie. Spot the most infamous cast member.",
    "focusArea": "Focus Area: Cravings & Taste",
    "affirmation": "Unpredictable casting works wonders for novelty. Now close the tab.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Find a piece of chocolate, mint, or biscuit and eat it with full attention.",
    "focusArea": "Focus Area: Cravings & Taste",
    "affirmation": "Sensory treat completed. That was your micro-reward for surviving the morning.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "What dessert would you demand for your final meal on Earth?",
    "focusArea": "Focus Area: Cravings & Taste",
    "affirmation": "Good choice. Keep working so you can afford the real thing this weekend.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Wrap both hands around a warm cup or cold water bottle and hold it for 10 seconds.",
    "focusArea": "Focus Area: Cravings & Taste",
    "affirmation": "Physical temperature grounding complete. System recalibrated.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Text a close friend: 'What's the best thing you ate this week?'",
    "focusArea": "Focus Area: Cravings & Taste",
    "affirmation": "No work talk, no obligations. Just pure food conversation.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Grab a blank piece of paper and fold a sharp paper airplane right now.",
    "focusArea": "Focus Area: Desk Play",
    "affirmation": "Give it one gentle test flight under your desk. Mission complete.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Spin a coin or pen on your desk and watch it spin until it dies completely.",
    "focusArea": "Focus Area: Desk Play",
    "affirmation": "When it stops, your break stops. Back to the board.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Balance a pen upright on its flat end on your desk for 10 seconds.",
    "focusArea": "Focus Area: Desk Play",
    "affirmation": "Steady hands, quiet mind. The freeze is broken.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Bend an unused paperclip into an entirely new shape or mini sculpture.",
    "focusArea": "Focus Area: Desk Play",
    "affirmation": "Desk art created. Your fingers are warmed up; now write that paragraph.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Stack three coins or small objects on your desk into a vertical tower.",
    "focusArea": "Focus Area: Desk Play",
    "affirmation": "Tower standing. Micro-victory logged.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Flip a coin three times on your desk. Try to land heads twice.",
    "focusArea": "Focus Area: Desk Play",
    "affirmation": "Win or lose, the micro-game delivered an instant dopamine flicker.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Crumple a tiny scrap of paper and flick it into your wastebasket like a shot.",
    "focusArea": "Focus Area: Desk Play",
    "affirmation": "Swish or miss, you broke the sedentary desk freeze.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Write your first name on a scrap paper using only your non-dominant hand.",
    "focusArea": "Focus Area: Desk Play",
    "affirmation": "Terrible handwriting, but both brain hemispheres are now awake.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Spin your office chair in one smooth full circle, then stop facing your screen.",
    "focusArea": "Focus Area: Desk Play",
    "affirmation": "Vestibular system reset. Eyes forward, hands on the keyboard.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Draw one clean continuous spiral on a sticky note without lifting the pen.",
    "focusArea": "Focus Area: Desk Play",
    "affirmation": "The loop is closed. Now channel that focus into your primary task.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Stand up from your desk chair, stretch arms overhead for 5 seconds, and sit back down.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Ribcage open, spine extended. That's fresh oxygen in your bloodstream.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Squeeze both fists as hard as you can for 10 seconds, then fling your fingers wide.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Isometric motor tension released. Your hands are steady and ready.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Lift your heels and tap your toes rapidly against the floor for 15 seconds.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Leg circulation fired up. No more dead-weight afternoon limbs.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Shake both hands and wrists loosely under your desk for 10 seconds.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Typing stiffness gone. Hands feel light again.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Interlock your fingers behind your back and pull your shoulders back for 5 seconds.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Reversing the laptop hunch in five seconds flat.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Roll your shoulders backward in 5 big, slow, smooth circles.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Trapezius knots dissolved. Breathe into the space.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Press both hands flat against the underside of your desk and push up firmly for 6 seconds.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Silent, invisible strength burst. Alertness restored.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Tilt your head toward your right shoulder for 5 seconds, then left for 5 seconds.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Neck stiffness drained away. Optical fatigue reduced.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Lift your feet slightly off the floor and circle your ankles 5 times each way.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Venous blood pumped back up the legs. System online.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Sit tall on the edge of your chair without touching the backrest for 20 seconds.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Self-supported posture instantly signals executive readiness to your brain.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Walk to your water bottle or office pantry and take three deliberate, cold sips of water.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Cold hydration finished. Blood volume up, brain fog down.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Rub your palms together quickly until warm, then cup them over your closed eyes for 15 seconds.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Darkness and warmth melt away video meeting eye strain.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Breathe in through your nose for 4 seconds, then exhale slowly through pursed lips for 8 seconds.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Vagus brake activated. Heart rate down, focus up.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Press two fingertips into your temples and rub in slow, gentle circles for 15 seconds.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Temporal pressure released. Glare headache neutralized.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Look out the nearest window and stare at the furthest building or cloud for 20 seconds.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Ciliary muscle spasm unlocked. Depth perception restored.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Flip your phone face-down on your desk right now and slide it one arm's length away.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Screen black. Brain free. Execute your work.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Turn your phone display to black-and-white (grayscale) mode in settings.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Colors killed. Dopamine slot machine disabled.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Close all finished browser tabs from this morning's meetings immediately.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Visual cache cleared. That noise is officially behind you.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Pick up three pieces of paper trash or used post-its and dump them in the bin.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Physical trash eliminated. Momentum initiated.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Straighten your keyboard, mousepad, and notebook so their edges align with your desk.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Geometric order restored. Calm work cockpit established.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Take your empty mug or bottle to the office pantry or sink right now.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Pantry run complete. Desk territory reclaimed.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Gather loose desk papers and tap them into one single square stack.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Paper clutter squared away. One problem at a time.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Open your computer's downloads folder and delete the top three useless files.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Digital dead-weight purged in under 10 seconds.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Wipe your phone screen clean with your sleeve until smudges are gone.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Crystal-clear glass. Clean tool, clean mind.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Draw one bold, clean checkmark on a scrap paper with your pen right now.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Break completed. You are back in command.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Put your phone inside your bag or desk drawer, close it, and take a deep breath.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Physical barrier established. Freedom restored.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Turn on 'Do Not Disturb' mode across your devices right now.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "The bunker is sealed. Work in peace.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Clear all the notifications off your phone lock screen with one single clean swipe.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Red badges gone. Zero unfinished alerts.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Move your most distracting app icon off your home screen into a folder on your last page.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Friction added. Automatic thumb habits broken.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Turn off your computer monitor for 30 seconds and just rest in the dark stillness.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Screen blackout complete. Eyes refreshed, ready to resume.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Take your headphones off, place them on the table, and listen to the room for 30 seconds.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Audio stream unplugged. Mental silence restored.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Swipe up and force-close every background app running on your phone.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Active instances closed. Memory cleared.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Delete one useless shopping, game, or delivery app that you don't really need.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Deletion executed. Attention defended.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Tuck away a loose charger wire so it isn't tangled across your work surface.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Visual cable clutter eliminated.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Collect any loose pens or highlighters and put them together in a cup or drawer.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Tools organized. Cockpit ready.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Take a tissue or wipe and clean the empty surface right in front of your keyboard for 15 seconds.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Surface wiped. Clean slate activated.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Find one dried-up pen or crumpled post-it note and throw it in the trash can.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Dead-weight tossed. Moving forward.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Tear an old, completed paper note or used envelope in half and drop it in the bin.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Past task destroyed. Room made for the new.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Clean your eyeglasses or monitor screen with a microfiber cloth until clear.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Clear glass, clear head. Now get back to work.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Put your office badge, keys, and wallet in one tidy spot on your desk or in your bag.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Essentials secured. Zero frantic searching later.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Set your pen down parallel to your notepad, take one calm breath, and look straight ahead.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Reset finished. You are back in command.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Highlight three loose, messy files on your computer desktop and drag them into a single folder.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Desktop clutter swept away. Focus locked.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Fold a clean piece of scrap paper in half, crease it firmly with your thumb, and set it down.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Fresh crease, fresh start.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Push your desk chair all the way in until it sits flush against your desk.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Lines squared. Workspace aligned.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Take two deep breaths, smile, and acknowledge your progress today. Focus reclaimed.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Mission complete. 120-second intervention finished.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  }
];

const overwhelmDeck = [
  // ==========================================
  // TRACK 1: TASK PARALYSIS (Acute Dread & Freeze)
  // ==========================================
  {
    "step": 1,
    "focusArea": "Physical Reset",
    "text": "Press both palms flat on your desk, push down hard, and blow out all air until completely empty.",
    "affirmation": "Pushing hard while emptying your lungs forces your body to drop its panic. Your racing pulse slows down immediately.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "step": 2,
    "focusArea": "Dread Triage",
    "text": "Open the single work file causing you the most dread right now. Look only at line one.",
    "affirmation": "The task felt terrifying in your head. Looking at just the first line makes it manageable right away.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "step": 3,
    "focusArea": "Visual Blinders",
    "text": "Maximize this window to full-screen. Your other tabs stay safe behind it, completely out of sight.",
    "affirmation": "Seeing other open tabs distracts you. Hiding them lets your mind focus on just this one job.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "step": 4,
    "focusArea": "Motor Ignition",
    "text": "Put your hands on your workspace. Make one physical move: type one character, click once, or write one mark.",
    "affirmation": "Thinking keeps you stuck, but moving your hands breaks the freeze. You officially made the first move.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },

  // ==========================================
  // TRACK 2: MINDLESS SCROLLING (Escapism Loop)
  // ==========================================
  {
    "step": 1,
    "focusArea": "Put Away Phone",
    "text": "Flip your phone face-down on your desk right now and slide it one arm's length away.",
    "affirmation": "Putting the phone out of reach breaks the scrolling spell. A dark screen stops pulling at your attention.",
    "frictionTags": ["mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "step": 2,
    "focusArea": "Look at Work",
    "text": "Look up at your main computer monitor or desk. Identify the single work deliverable in front of you.",
    "affirmation": "You scrolled to avoid hard work. Looking back at your desk brings your mind back to the job.",
    "frictionTags": ["mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "step": 3,
    "focusArea": "Hide Distractions",
    "text": "Full-screen that single work file. Let all social media and messaging tabs sit buried behind it.",
    "affirmation": "Every notification icon tempts you to click away. Hiding them keeps you locked on this single file.",
    "frictionTags": ["mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "step": 4,
    "focusArea": "First Touch",
    "text": "Rest your fingertips on your keyboard or work tool. Press one key or execute one single click.",
    "affirmation": "You stopped looking at other people's posts and touched your own work. The spell is broken.",
    "frictionTags": ["mindless_scrolling"],
    "environment": "anywhere"
  },

  // ==========================================
  // TRACK 3: LOW LETHARGY (Brain Fog & Slump)
  // ==========================================
  {
    "step": 1,
    "focusArea": "Quick Wake Up",
    "text": "Stand up tall, roll your shoulders back, and take two fast, deep breaths in through your nose.",
    "affirmation": "Slouching keeps you sleepy. Standing up and breathing deeply sends fresh air straight to your head.",
    "frictionTags": ["low_lethargy"],
    "environment": "anywhere"
  },
  {
    "step": 2,
    "focusArea": "Small Target",
    "text": "Sit back down and open your immediate task. Do not plan; just look at the top section.",
    "affirmation": "Big projects make you feel tired. You do not need lots of energy to read one short line.",
    "frictionTags": ["low_lethargy"],
    "environment": "anywhere"
  },
  {
    "step": 3,
    "focusArea": "Clear Workspace",
    "text": "Maximize this file to full-screen so zero background desktop clutter competes for your low energy.",
    "affirmation": "A messy screen tires your eyes. Making this window full-screen saves your energy for the real work.",
    "frictionTags": ["low_lethargy"],
    "environment": "anywhere"
  },
  {
    "step": 4,
    "focusArea": "Easy Start",
    "text": "Click your cursor into the workspace and type today's date or one single word right now.",
    "affirmation": "Waiting for motivation never works. Doing one tiny move gets your hands moving and wakes you up.",
    "frictionTags": ["low_lethargy"],
    "environment": "anywhere"
  }
];

module.exports = {
  PREMIUM_DECK_METADATA,
  dopamineDeck,
  overwhelmDeck,
  dopamine: dopamineDeck,
  overwhelm: overwhelmDeck
};
