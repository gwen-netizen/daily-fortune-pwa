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
    "text": "Why don't scientists trust atoms? Complete the timer to reveal.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "They make up everything. Smirk once. Now get back to work.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "What has keys but cannot unlock doors? Complete the timer to find out.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "A piano. Picture it. Now drop the distraction and execute.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "I told my doctor I broke my arm in two places. Finish the timer for the punchline.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "He told me to stop going there. Joke over. Start working.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "What can you catch but never throw? Complete the timer to reveal.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "A cold. Take one deep breath. Break the freeze.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "What do you call fake noodles? Finish the timer for the punchline.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "An impasta. Drop your shoulders. Back to the mission.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "What has a thumb and four fingers, but isn't alive? Complete to reveal.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "A glove. Look at your hand. Move your fingers. Start typing.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Why did the scarecrow win an award? Complete the timer for the answer.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "He was outstanding in his field. Enough stalling. Execute.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "The more you take, the more you leave behind. What are they? Complete to reveal.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "Footsteps. Stand up and walk ten paces right now.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "I used to play piano by ear. Finish the timer for the punchline.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "Now I use my hands. Put your hands on the keyboard.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "What gets wetter the more it dries? Complete the timer for the answer.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "A towel. Blink three times hard. Refocus on the screen.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Why do we tell actors to 'break a leg'? Complete to reveal.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "Because every play has a cast. Now play your part.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "What has a head, a tail, is brown, and has no legs? Complete to reveal.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "A penny. Find a coin on your desk. Flip it once.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Parallel lines have so much in common. Finish the timer for the punchline.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "It’s a shame they never meet. Break the loop. Start.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "What has one eye, but cannot see? Complete the timer for the answer.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "A needle. Take one slow, sharp breath. Resume.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "My boss told me to have a good day. Finish the timer to reveal.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "So I went home. You aren't done yet. Keep pushing.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "What runs all day but never walks, has a bed but never sleeps? Complete to reveal.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "A river. Picture cold water hitting your face. Wake up.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "How do you organize a space party? Complete the timer to find out.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "You planet. Stop drifting. Ground yourself and plan your next move.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "What begins and ends with E, but has one letter? Complete to reveal.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "An envelope. Open your email. Send the draft you are avoiding.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Time flies like an arrow. Finish the timer for the punchline.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "Fruit flies like a banana. Time is ticking. Execute.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "What has hands, but cannot clap? Complete the timer for the answer.",
    "focusArea": "Focus Area: Humor & Wit",
    "affirmation": "A clock. The timer is running. Get back to work.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Remember your best vacation.",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Hold that feeling. Stress is temporary. Get back to work.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Picture warm tropical air and ocean wind.",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "The world is massive. Your current stress is tiny. Execute.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Recall the best meal you ever ate.",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Remember the taste. Bottle that dopamine. Use it to focus.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Open your camera roll and look at a photo from last year.",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Look at your past self. You survived that. You will survive this.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Imagine walking through a foreign city at night.",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Neon lights. Total silence in a crowd. Breathe it in.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Look at the oldest photo on your phone.",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "You have conquered every bad day since then. Keep going.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Remember boarding a plane with just a backpack.",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Pure freedom. Finish your tasks so you can do it again.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Search your childhood street on a map.",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Look how far you have come. Do not stop now.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Remember your very first bicycle or car.",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Remember that feeling of total freedom. Hold it. Execute.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Imagine swimming in freezing cold ocean water.",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Let the shock wipe out your brain fog. Wake up.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Recall the best live concert you ever attended.",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Feel the bass in your chest. Use that energy now.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Find a photo of a sunset on your phone.",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "The real world beats this screen. Finish work and go outside.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Recall the most remote place you have ever visited.",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Remember the total silence. Bring that quiet to your desk.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Check the weather in Iceland right now.",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "The world is vast and freezing. Your desk is safe. Work.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Remember your favorite childhood video game.",
    "focusArea": "Focus Area: Nostalgia & Travel",
    "affirmation": "Zero bills. Zero deadlines. Keep a fraction of that spirit today.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Look up the worst-rated restaurant near you.",
    "focusArea": "Focus Area: Cravings & Taste",
    "affirmation": "Do not order it. Close the app immediately. Start working.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Recall the best cup of coffee you ever drank.",
    "focusArea": "Focus Area: Cravings & Taste",
    "affirmation": "Go brew a fresh cup right now. You earned it.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Decide your exact lunch order right now. No hesitation.",
    "focusArea": "Focus Area: Cravings & Taste",
    "affirmation": "Decision made. Let the anticipation fuel your next work sprint.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Imagine biting into a fresh, sour lemon wedge.",
    "focusArea": "Focus Area: Cravings & Taste",
    "affirmation": "Your mouth watered. Your brain controls your body. Take command.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Pour a glass of cold water and drink it standing.",
    "focusArea": "Focus Area: Cravings & Taste",
    "affirmation": "Hydration complete. Brain fog destroyed. Sit down and execute.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Check the cinema listings for a movie tonight.",
    "focusArea": "Focus Area: Cravings & Taste",
    "affirmation": "Pick one. Now close the tab and earn your ticket.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Eat a mint or piece of chocolate right now.",
    "focusArea": "Focus Area: Cravings & Taste",
    "affirmation": "Focus entirely on the taste. Micro-break over. Resume.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Name your ultimate final dessert.",
    "focusArea": "Focus Area: Cravings & Taste",
    "affirmation": "Great choice. Now finish your work so you can buy it.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Grip a cold glass or warm mug with both hands.",
    "focusArea": "Focus Area: Cravings & Taste",
    "affirmation": "Feel the temperature. Ground yourself in reality. Begin.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Text a friend: What is the best thing you ate recently?",
    "focusArea": "Focus Area: Cravings & Taste",
    "affirmation": "Send it. Put the phone face down. Get to work.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Fold a paper airplane from a scrap piece of paper.",
    "focusArea": "Focus Area: Desk Play",
    "affirmation": "Give it one test flight. Mission complete. Back to work.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Spin a pen or coin on your desk.",
    "focusArea": "Focus Area: Desk Play",
    "affirmation": "Watch it stop. When it stops, your break is over.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Balance a pen perfectly upright on your desk.",
    "focusArea": "Focus Area: Desk Play",
    "affirmation": "Steady hands. Quiet mind. The mental freeze is broken.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Bend a paperclip into a square.",
    "focusArea": "Focus Area: Desk Play",
    "affirmation": "Your hands are awake. Now put them on the keyboard.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Stack three coins into a tiny tower on your desk.",
    "focusArea": "Focus Area: Desk Play",
    "affirmation": "Tower built. Micro-victory achieved. Channel this momentum.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Flip a coin three times.",
    "focusArea": "Focus Area: Desk Play",
    "affirmation": "Win or lose, you broke the freeze. Execute your task.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Crumple paper and shoot it into the trash bin.",
    "focusArea": "Focus Area: Desk Play",
    "affirmation": "Swish or miss, you broke the sedentary loop. Start typing.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Write your name using your non-dominant hand.",
    "focusArea": "Focus Area: Desk Play",
    "affirmation": "It looks terrible, but your brain is fully awake. Execute.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Spin your chair in one full circle.",
    "focusArea": "Focus Area: Desk Play",
    "affirmation": "Stop facing your screen. Hands on the keyboard. Go.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Draw a continuous spiral on a sticky note.",
    "focusArea": "Focus Area: Desk Play",
    "affirmation": "The loop is closed. Direct that focus into your work.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Stand up. Stretch both arms overhead for five seconds.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Chest open. Oxygen flowing. Sit down and crush the task.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Squeeze both fists as hard as possible for ten seconds.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Fling your fingers open. Tension released. Hands ready.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Tap your toes rapidly against the floor for fifteen seconds.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Blood is pumping. No more dead legs. Let's go.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Shake your hands and wrists vigorously for ten seconds.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Typing stiffness is gone. Your hands feel light. Execute.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Lock fingers behind your back and pull your shoulders open.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Reverse the screen hunch. Stand tall and take command.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Roll your shoulders backward in five slow, massive circles.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Knots dissolved. Tension gone. Breathe easy and start.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Push up hard against the underside of your desk.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Silent strength burst. Your nervous system is fully online.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Stretch your neck to the left, then to the right.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Neck stiffness drained. Brain fog cleared. Focus.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Lift your feet and circle your ankles five times.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Blood flow restored. The afternoon slump is officially dead.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Sit on the edge of your chair. Do not lean back.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Perfect posture signals executive readiness to your brain. Execute.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Take three large gulps of cold water.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Hydration hits the brain instantly. Kill the fog. Start working.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Rub your palms until hot. Press them over your eyes.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Total darkness melts screen fatigue. Open your eyes and focus.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Inhale for four seconds. Exhale slowly for eight seconds.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Heart rate down. Panic destroyed. You are in control.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Rub your temples in slow circles for fifteen seconds.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Pressure released. Glare headache neutralized. Get back to it.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Look out a window. Stare at the furthest object.",
    "focusArea": "Focus Area: Energy Surge",
    "affirmation": "Eye muscles unlocked. Depth perception restored. Look back and execute.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Slide your phone face-down, exactly one arm's length away.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Screen black. Brain free. Execute your work.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Turn your phone screen to grayscale mode right now.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Colors killed. The dopamine slot machine is disabled.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Close every single browser tab you are not actively using.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Visual clutter cleared. That noise is behind you.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Throw three pieces of trash or paper in the bin.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Physical trash eliminated. Momentum initiated. Go.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Align your keyboard and notebook parallel to your desk.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Geometric order restored. A calm workspace creates a sharp mind.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Move your empty mug away from your desk.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Pantry run complete. Desk territory reclaimed. Start working.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Tap all loose desk papers into one perfect square stack.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Clutter squared away. Handle one problem at a time.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Delete three useless files from your downloads folder.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Digital dead-weight purged. Your slate is clean.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Wipe your phone screen completely clean with your sleeve.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Crystal-clear glass. Clean tool, clean mind. Execute.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Draw one massive, bold checkmark on a scrap of paper.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Break over. You are back in command.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Put your phone inside a drawer and shut it.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Physical barrier established. Freedom restored. Start typing.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Turn on 'Do Not Disturb' on all your devices.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "The bunker is sealed. Do your work in absolute peace.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Swipe away every single notification on your lock screen.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Red badges destroyed. Zero unread alerts. Total focus.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Move your most distracting app off the home screen.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Friction added. Automatic thumb habits broken. You win.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Turn off your monitor for thirty seconds.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Rest in the dark. Eyes refreshed. Turn it on and go.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Take your headphones off and listen to the room.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Audio stream unplugged. Mental silence restored.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Force-close every background app running on your phone.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Active instances killed. Phone memory cleared. Brain memory cleared.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Delete one useless shopping or gaming app right now.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "App deleted. Your attention is defended. Execute.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Hide one messy charger wire from your desk surface.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Visual cable clutter eliminated. Nothing is tangled.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Put all loose pens into a cup or drawer.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Tools organized. Cockpit ready. Prepare for takeoff.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Wipe the desk surface directly in front of your keyboard.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Surface cleaned. Clean slate activated. Start typing.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Throw one dead pen or old post-it in the trash.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Dead weight tossed. You are moving forward.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Tear an old paper note in half and bin it.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Past task destroyed. Make room for the new.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Clean your monitor or glasses until they are perfectly clear.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Clear glass, clear head. Get back to work.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Stack your keys and wallet neatly in one spot.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Essentials secured. Zero frantic searching later. Focus.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Set your pen parallel to your notepad. Look ahead.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Reset finished. You are back in command.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Drag three loose desktop files into a single folder.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Desktop clutter swept away. Focus locked on the target.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Fold a scrap of paper. Crease it firmly.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Fresh crease, fresh start. Make your next move.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Push your chair all the way under your desk.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Lines squared. Workspace aligned. Stand up, sit down, execute.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Take two deep breaths and acknowledge your progress today.",
    "focusArea": "Focus Area: Quick Wins",
    "affirmation": "Intervention complete. You are fully reset. Execute.",
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
    "text": "Press both palms flat on your desk. Push down hard and exhale completely.",
    "affirmation": "Force the air out to kill the panic. Your heart rate is slowing down.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "step": 2,
    "focusArea": "Dread Triage",
    "text": "Open the exact file you are avoiding. Look only at the first line.",
    "affirmation": "It was only terrifying in your head. The first line is easy. You can do this.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "step": 3,
    "focusArea": "Visual Blinders",
    "text": "Make this window full-screen. Hide absolutely every other tab.",
    "affirmation": "Visual clutter creates mental panic. Hide everything else to lock your focus on this single target.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "step": 4,
    "focusArea": "Motor Ignition",
    "text": "Put your hands on the keyboard. Type one character, make one click, or write one word.",
    "affirmation": "Thinking keeps you paralyzed. Action breaks the freeze. You just made the first move. Keep going.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },

  // ==========================================
  // TRACK 2: MINDLESS SCROLLING (Escapism Loop)
  // ==========================================
  {
    "step": 1,
    "focusArea": "Put Away Phone",
    "text": "Slide your phone face-down, exactly one arm's length away. Count to 20.",
    "affirmation": "Distance kills the scrolling trance. The screen is black. You are free.",
    "frictionTags": ["mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "step": 2,
    "focusArea": "Look at Work",
    "text": "Look at your monitor. Identify the single most important task right in front of you.",
    "affirmation": "You scrolled to escape the work. Look at the task to drag your mind back to reality.",
    "frictionTags": ["mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "step": 3,
    "focusArea": "Hide Distractions",
    "text": "Full-screen that specific file. Bury all social media and chat tabs.",
    "affirmation": "Notification badges are traps. Hide them entirely to protect your attention.",
    "frictionTags": ["mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "step": 4,
    "focusArea": "First Touch",
    "text": "Rest your fingers on the keyboard. Press one key or execute one click.",
    "affirmation": "You stopped watching other people and touched your own work. The loop is broken. Execute.",
    "frictionTags": ["mindless_scrolling"],
    "environment": "anywhere"
  },

  // ==========================================
  // TRACK 3: LOW LETHARGY (Brain Fog & Slump)
  // ==========================================
  {
    "step": 1,
    "focusArea": "Quick Wake Up",
    "text": "Stand up. Roll your shoulders back. Take two sharp breaths through your nose.",
    "affirmation": "Slouching breeds exhaustion. Stand up and flood your brain with oxygen.",
    "frictionTags": ["low_lethargy"],
    "environment": "anywhere"
  },
  {
    "step": 2,
    "focusArea": "Small Target",
    "text": "Sit down and open your task. Stop planning. Look only at the first sentence.",
    "affirmation": "Big projects cause fatigue. It takes zero energy to read one line. Start there.",
    "frictionTags": ["low_lethargy"],
    "environment": "anywhere"
  },
  {
    "step": 3,
    "focusArea": "Clear Workspace",
    "text": "Full-screen the file. Do not let desktop clutter steal your remaining energy.",
    "affirmation": "Visual mess drains your brain. A clean screen reserves your energy for the actual work.",
    "frictionTags": ["low_lethargy"],
    "environment": "anywhere"
  },
  {
    "step": 4,
    "focusArea": "Easy Start",
    "text": "Click into the document. Type today's date or a single word right now.",
    "affirmation": "Motivation is a myth. Action creates energy. Move your hands and wake up.",
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
