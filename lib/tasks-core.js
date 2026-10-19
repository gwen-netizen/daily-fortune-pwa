/**
 * 120Reset Core Engine Tasks (lib/tasks-core.js)
 * 
 * Contains:
 *  - The Charisma Deck ("Command the room.")
 *  - The Financial Reset Deck ("Unlock financial clarity.")
 */

const CORE_DECK_METADATA = {
  charisma: {
    name: "The Charisma Deck",
    subheading: "Command the room.",
    rounds: 1,
    multiplier: 1
  },
  wealth: {
    name: "The Financial Reset Deck",
    subheading: "Unlock financial clarity.",
    rounds: 1,
    multiplier: 1
  },
  financial_reset: {
    name: "The Financial Reset Deck",
    subheading: "Unlock financial clarity.",
    rounds: 1,
    multiplier: 1
  }
};

const charismaDeck = [
  {
    "text": "Pull your shoulders back and open your chest for 10 seconds.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Hiding is a prey response. Open your posture and command the room.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Plant both feet flat on the floor. Stop swaying and shuffling.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "A solid base kills nervous energy. Stand like a wall.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Unclench your jaw and drop your tongue from the roof of your mouth.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Facial tension signals panic. A relaxed jaw projects absolute control.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Imagine a thread lifting the top of your head toward the ceiling.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Stop slouching. Stand tall and own your natural height.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Drop your shoulders away from your ears. Take three deep exhales.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Raised shoulders signal fear. Drop them to show you are in charge.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Open your hands, relax your wrists, and rest your palms flat.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Clenched fists mean you are bracing for impact. Relaxed hands project power.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Sit up straight. Rest your forearms flat on the desk with elbows wide.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Claim the space in front of you. Stop shrinking.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Widen your stance by two inches. Balance your weight on both heels.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "A wider footprint makes you physically and mentally immovable.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Lift your chin slightly to look straight ahead.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Looking down is submission. Level your gaze and face the room.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Place both hands flat on your thighs. Do not move for 60 seconds.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Stillness is power. Stop fidgeting and command the silence.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Uncross your arms and legs. Leave your torso completely open.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Crossed arms are a shield. Drop the shield to show true confidence.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Stand tall and walk ten paces at a slow, measured tempo.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Rushing means you are on their time. Move slowly to control the tempo.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Grip your left forearm firmly with your right hand for two seconds.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Deep, firm contact builds memorable presence without needing aggressive pressure.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Rest your back fully against your chair. Stop leaning forward.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Leaning in looks desperate. Sit back and make them come to you.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Roll your shoulders backward once. Let them drop heavily.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Reset your frame. Expand your chest and breathe easy.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Put a hand on your chest and lift it away from your waist.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Stand with dignity. Give your lungs room to breathe fully.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Square your shoulders directly toward the wall in front of you.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Turning away shows fear. Face challenges head-on.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Release all tension in your legs. Let them feel heavy and anchored.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Tense legs want to run. Relax them to stand your ground.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Take your hands out of your pockets. Let your arms hang loose.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Hidden hands look nervous. Keep them visible and relaxed.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Interlock your fingers behind your back and pull gently downward.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Reverse the screen hunch. Open up and reclaim your posture.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Put one hand on your belly. Breathe in so only your hand moves.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Deep breathing kills panic. Control your breath, control the room.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Unclench your glutes and pelvic muscles. Sit completely upright.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Release hidden physical stress to instantly ground your mind.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Stretch your arms wide for five seconds, then lower them.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Taking up physical space tells your brain you are safe.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Balance your weight evenly on your feet. Do not lean.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Rocking back is retreat. Stay perfectly centered and hold your ground.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Rest your hand flat on your chest. Take three slow breaths.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Physical touch slows your heart rate. Anchor yourself immediately.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'This is the strategy moving forward.' Drop your pitch at the end.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Downward inflection turns a question into a command. Own your words.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "State your goal aloud. Do not use 'I think', 'maybe', or 'just'.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Apologetic words kill authority. Speak with absolute conviction.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Speak your full name aloud slowly with clear diction.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Own your identity. Do not rush your own name.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Ask an imaginary question, wait two seconds, then answer aloud.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Pausing proves self-control. Rushing to answer shows insecurity.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Speak a complete sentence in one steady breath without rushing.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Controlled breathing prevents vocal shaking. Speak with steady weight.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "State your next objective aloud at half your normal speed.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Speaking slowly forces people to listen. Command attention without shouting.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Take a breath and project your voice to the far wall without yelling.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Fill the room with your voice. Claim the acoustic space.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Introduce yourself aloud in under ten seconds. Use zero filler words.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Crisp introductions show sharp competence. Cut the fluff.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Say aloud with a neutral face: 'No, that will not work for me.'",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Set boundaries without anger. Calm rejection shows unshakeable self-respect.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say aloud in your deepest voice: 'Good morning, let's get started.'",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Deeper tones build immediate trust and project calm competence.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'Great speaking with you. Let’s reconnect Thursday.'",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Never linger awkwardly. Close conversations cleanly to preserve your status.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say 'Understood' aloud with a single crisp nod.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "One nod shows understanding. Frantic nodding shows anxiety.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Deliver a three-word statement aloud as if it were absolute fact.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Match your external voice to your internal conviction. Be decisive.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Say calmly: 'I don't have that data. I will confirm by 3 PM.'",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Admitting gaps calmly shows deep confidence. Faking it destroys credibility.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "State a business goal aloud without saying 'um' or clearing your throat.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Comfortable silence is powerful. Stop filling the gaps with noise.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say 'Thank you' firmly, without minimizing the compliment.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Accept praise cleanly. Deflecting it shows imposter syndrome.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Speak a sentence aloud while keeping your head and neck perfectly still.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Stop bobbing your head. Stillness projects deliberate gravitas.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Say aloud slowly: 'Let's pause and consider our options.'",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Leaders kill panic by forcing a pause. Control the room's tempo.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Speak a thought aloud with steady volume from start to finish.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Trailing off implies lost confidence. Finish your sentences strong.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Say 'Yes' aloud with absolute finality.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Clean agreements remove doubt and signal decisive partnership.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Soften your eyes and hold a subtle, unforced smile for 30 seconds.",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Genuine warmth signals authenticity and makes people feel safe.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Speak a sincere phrase of gratitude aloud to a colleague.",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "High status is generous. Elevate others to elevate yourself.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'I noticed how well you handled that. Strong work.'",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Specific praise makes people feel seen. Build genuine loyalty.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Look in a mirror, soften your face, and nod with self-respect.",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "You cannot project warmth if you hate yourself. Start here.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'Great to see you today' with genuine warmth.",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "People remember the energy of your greeting forever. Make it count.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say aloud with curiosity: 'What led you to that conclusion?'",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Asking without attacking lowers shields and builds honest dialogue.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Relax your eyebrows and imagine someone you respect entering the room.",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Positive anticipation naturally opens your face and invites connection.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'Tell me more about how you see this unfolding.'",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Giving the spotlight to others shows supreme, quiet confidence.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Soften your mouth, open your palms on the desk, and breathe.",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Open palms dissolve hierarchy and establish instant mutual trust.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Say calmly: 'I appreciate your perspective on this.'",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Validating their view prevents defensiveness before you make your point.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say with empathy: 'That must have been difficult to manage.'",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Empathy validates reality. It turns associates into loyal allies.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Hold a relaxed smile and an open posture for 45 seconds.",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Sustained warmth shows you are completely comfortable in your own skin.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud without rushing: 'Take your time, I am listening.'",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Giving someone unhurried time is the ultimate high-status move.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Smile warmly, nod slowly once, and keep your eyes relaxed.",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Small affirmations prove you are listening and respect their voice.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud with sincerity: 'I trust your judgment on this.'",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Empowering others proves you lead without micromanaging anxiety.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Sit in absolute stillness for 60 seconds. Do not touch your phone.",
    "focusArea": "Absolute Presence",
    "affirmation": "Resisting the urge to move builds unbroken conversational focus.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Close your eyes and listen for the furthest sound in the room.",
    "focusArea": "Absolute Presence",
    "affirmation": "Reach outward with your senses to stop spinning inward with anxiety.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Lock your eyes on a single object across the room for 45 seconds.",
    "focusArea": "Absolute Presence",
    "affirmation": "Steady eyes equal a steady mind. Stop darting around.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Scan the room and find three details you have never noticed before.",
    "focusArea": "Absolute Presence",
    "affirmation": "Look at reality. Snap out of your internal anxiety loop.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Close your eyes and track five breaths by feeling the air in your nose.",
    "focusArea": "Absolute Presence",
    "affirmation": "Physical focus instantly quiets the noise in your head.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Hold level eye contact with an object while taking three slow breaths.",
    "focusArea": "Absolute Presence",
    "affirmation": "Breathe through the tension to stay poised under pressure.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Feel the exact weight of your feet pressing into the floor for 30 seconds.",
    "focusArea": "Absolute Presence",
    "affirmation": "Ground your body to stop your thoughts from spinning.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Look at the lighting in your room without judging or analyzing it.",
    "focusArea": "Absolute Presence",
    "affirmation": "Pure observation clears your mental slate for total awareness.",
    "frictionTags": ["mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Maintain unbroken focus on an object and nod once after 30 seconds.",
    "focusArea": "Absolute Presence",
    "affirmation": "Practice focused listening so the speaker feels entirely respected.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Sit still and notice the temperature of the air on your skin.",
    "focusArea": "Absolute Presence",
    "affirmation": "Physical awareness silences the chaotic dialogue in your brain.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Walk slowly across the room. Focus only on your feet hitting the floor.",
    "focusArea": "Absolute Presence",
    "affirmation": "Replace nervous pacing with grounded, deliberate movement.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Keep your eyes perfectly still while exhaling slowly for six seconds.",
    "focusArea": "Absolute Presence",
    "affirmation": "A locked gaze kills panic and maintains emotional control.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Listen intently to the ambient silence in your room for 45 seconds.",
    "focusArea": "Absolute Presence",
    "affirmation": "Get comfortable with silence. Stop filling the void with chatter.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Look at your hands without moving them. Observe their stillness.",
    "focusArea": "Absolute Presence",
    "affirmation": "Prove to yourself that you can remain perfectly calm.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Take two deep breaths, close your eyes, and let your body go completely still.",
    "focusArea": "Absolute Presence",
    "affirmation": "Quiet composure draws people to your grounded energy.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Open your hands on the table and watch your breath until the timer ends.",
    "focusArea": "Absolute Presence",
    "affirmation": "A still body creates a mind that cannot be shaken.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Look at three objects and appreciate how they were made.",
    "focusArea": "Absolute Presence",
    "affirmation": "Shift your focus outward to kill self-conscious worry.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Stand still, relax your eyes, and take in the whole room at once.",
    "focusArea": "Absolute Presence",
    "affirmation": "Wide vision physically calms your nervous system's threat response.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Focus entirely on your ribcage expanding and contracting for five breaths.",
    "focusArea": "Absolute Presence",
    "affirmation": "Monitor your body to block out external chaos.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Sit up straight, close your eyes, and listen to your own breathing.",
    "focusArea": "Absolute Presence",
    "affirmation": "Find your baseline so you enter conversations with total control.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Stand tall, nod once with finality, and exhale through your nose.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Stillness and a single nod signal absolute situational command.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Rest your palms on your knees. Breathe without moving your shoulders.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "A motionless upper body projects rock-solid stillness to the room.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say calmly: 'Here is what we know so far.'",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Base discussions on facts to establish immediate intellectual leadership.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Unclench your toes and let your feet sit flat on the floor.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Clenched toes mean you are bracing. Release them to relax completely.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I appreciate your patience' instead of 'Sorry for the delay.'",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Ditch the apology. Elevate your status while respecting their time.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Keep your hands loose and make a slow, open-palm gesture outward.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Open palms prove you have nothing to hide. Build instant trust.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'Let's review the core problem before jumping to conclusions.'",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Guide others away from panic to prove your tactical poise.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Relax your mouth into a neutral, calm expression for 30 seconds.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Stop grimacing. A neutral face projects supreme comfort under pressure.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say firmly: 'I will take responsibility for resolving this.'",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Taking ownership without drama is the ultimate mark of a leader.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Align your spine, rest your hands, and do not move for 60 seconds.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Movement is cheap. Stillness is magnetic and commands attention.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'How can I best support you on this project?'",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Servant leadership shows power backed by genuine benevolence.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Straighten up, look ahead, and take one breath as if taking a stage.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Prime your body to command the room before you even speak.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'Let's establish our priority before moving to details.'",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Cut the clutter. Set the agenda and anchor the room.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Soften your gaze and scan the room slowly and deliberately.",
    "focusArea": "Absolute Presence",
    "affirmation": "Unhurried scanning shows you belong here and fear nothing.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Say calmly: 'We have handled tougher situations than this.'",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Calm optimism is an anchor. Rally the room to your side.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Put both feet on the floor and lean your back into your chair.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Ground your body to eliminate strain and project relaxed power.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Speak a sentence slowly, pausing for a full second before the last word.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Pausing builds anticipation. Prove you do not fear being interrupted.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Open your hands, lift your chin, and radiate quiet readiness.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Open hands and a high chin create an unshakeable presence.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Say with enthusiasm: 'I appreciate your input, let's use that idea.'",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Welcoming ideas proves you are an ego-free, expansive leader.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Take a deep breath, drop your shoulders, and embrace total stillness.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Physical relaxation with a straight spine is the ultimate power posture.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  }
];

const financialResetDeck = [
  {
    "text": "Open your banking app, count to three, and close it immediately.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Your bank app is not a predator. Look, then leave. You are safe.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Hold your wallet in both hands for ten seconds without opening it.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Ground yourself in the physical object to stop abstract financial panic.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Take out a credit card and read the expiration date aloud.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Reading neutral facts shifts your brain from fear to logic.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'Numbers on a screen cannot physically harm me.'",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Separate survival fear from money. A low balance is not a lion.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Put your wallet on a table and take three deep breaths.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Breathe through the trigger. Teach your brain that money is safe.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Open your bank app, look only at the logo, and close it.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Practice facing the app without looking at the numbers. Build courage.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Trace the edges of a physical coin or bill with your thumb.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Physical currency grounds spiraling thoughts back into the present moment.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'Money is a tool of exchange, not my identity.'",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Do not let a bank balance masquerade as your self-worth.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Look at a bank notification, swipe it away, and exhale sharply.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Dismiss the threat physically. Take back your executive control.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Move your credit card to a different slot in your wallet.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Force a new physical habit to break your automatic financial anxiety loop.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Hold your credit card flat in your palm. Notice its weight.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "It weighs 5 grams. Stop letting a piece of plastic dominate you.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Open your bank app, take one deep breath, and lock your phone.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "You opened it on your terms. You hold the power, not the app.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I am completely safe in this exact physical moment.'",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Stop the false adrenaline dump. You are not being hunted.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Put your hand flat on the desk and say: 'I control my finances.'",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Shift from passive victim to active operator. Command your tools.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Fold a physical bill or invoice exactly in half and set it down.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Assert physical dominance over the paper. You process it on your time.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Tap your bank app icon, press the home button immediately, and smile.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Smiling while hitting a trigger destroys the conditioned fear response.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Balance a coin on the back of your hand for ten seconds.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Focus on the coin to override background financial anxiety.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I do not have to solve everything today.'",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "You freeze because you try to fix years of debt at once. Just pause.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Open your wallet, face all the bills the same way, and close it.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Micro-organization gives you a fast hit of control over your money.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Hold your credit card, close your eyes, and take two slow breaths.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Shut out the visual panic. Breathe and regain your composure.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Close your active shopping browser tab right now.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Sever the digital trap designed to hijack your dopamine and wallet.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Turn your phone screen to grayscale mode in your settings.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Grayscale kills the vibrant colors engineered to trigger your buying urges.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Put your phone face-down and stand up for 60 seconds.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Physical distance breaks the hypnotic trance of instant digital checkout.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Drink a full glass of cold water as fast as you can.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Cold water shocks the system and kills impulsive shopping urgency.",
    "frictionTags": ["mindless_scrolling", "low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Move the item from your cart to a wishlist and exit the app.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Trick your brain into feeling like it secured the item without spending cash.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I am stepping away from this transaction for 24 hours.'",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Delaying is not depriving. Kill the artificial urgency of the checkout timer.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Splash cold water on your face and dry it with a towel.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Shock the system to pull blood away from the emotional, impulsive brain.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "private"
  },
  {
    "text": "Delete a shopping app from your home screen right now.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Adding physical friction derails 80% of impulsive late-night purchases.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Stand up, stretch your arms above your head, and take a deep breath.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Break the hunched doom-scrolling posture to break the spending trance.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Turn off your phone entirely for the next two minutes.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "A dead screen forces a pause. The buying urge will vanish.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Clench both fists tightly for 10 seconds, then release them.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Purge the trapped physical tension that is driving your impulse to buy.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Step away from the screen and look out a window for 60 seconds.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Look at the real world to snap out of the digital retail matrix.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I choose to keep my cash right now.'",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Reframe skipping a purchase as an active decision to hoard cash.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Take your hands off the mouse and rest them in your lap.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Break physical contact to stop muscle memory from buying things you do not need.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Empty your digital shopping cart completely and close the app.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Clicking delete gives you the dopamine of action without losing your money.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Walk into another room and touch a wall for ten seconds.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Change your environment to break the spell of the spending impulse.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Turn off Wi-Fi on your device for exactly two minutes.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Pull the emergency brake. Stop the store from rendering.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'This purchase is a want, not an emergency.'",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Marketers fake urgency to trigger your survival instincts. Call their bluff.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Put your credit card in a drawer in another room.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Distance kills impulse. Make yourself walk to spend money.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Close your eyes and massage your temples for 30 seconds.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Shopping is often a coping mechanism. Soothe the stress directly instead.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'My past financial choices are in the past. My baseline is reset.'",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Stop letting yesterday's mistake justify today's binge. Start fresh.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Drop your shoulders down two inches and exhale completely.",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Drop the defensive posture. You are not under attack.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I am an intentional owner of my money.'",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "You are a commander of capital, not a victim of the economy.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Unclench your jaw and let your tongue drop from the roof of your mouth.",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Jaw tension feeds brain anxiety. Relax it to lower financial stress.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'A single spending slip does not ruin my future.'",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Catastrophic thinking causes paralysis. Keep your mistakes in proportion.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Shake your hands out vigorously for ten seconds to release tension.",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Shake off the adrenaline of financial panic like a mammal escaping a predator.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I forgive myself for any money I have wasted.'",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Shame guarantees future financial failure. Forgive yourself and move on.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Cross your arms, squeeze your shoulders firmly, and take a deep breath.",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Deep pressure releases oxytocin and kills the sensation of financial despair.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I am allowed to start fresh right this second.'",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Claim your reset. Take back executive control of your wallet.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Roll your neck in a slow circle twice each way.",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Clear the physical tension before you make a financial decision.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I refuse to panic over money today.'",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Set a vocal boundary to stop anxiety from hijacking your day.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Sit up straight and push your feet firmly into the floor.",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Ground yourself to stop the psychological sensation of free-falling into debt.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'Cash sitting in my account brings me peace.'",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Rewire your brain to get dopamine from saving instead of spending.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Open your hands flat on your desk and stare at your palms.",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Open hands signal safety to your brain. Calm your nervous system.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I control my impulses; my impulses do not control me.'",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Vocalize your authority over your own automatic habits.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "private"
  },
  {
    "text": "Gently rub the back of your neck for 15 seconds.",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Stimulate the vagus nerve to pull the emergency brake on financial panic.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'Every small dollar saved is a victory.'",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Stop waiting for a massive windfall. Respect the microscopic wins.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Widen your stance, stand tall, and take one massive breath in.",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Expand your posture to override the urge to hide from your bills.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I do not need to buy things to feel worthy.'",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Separate your self-esteem from your consumption to destroy advertising triggers.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "private"
  },
  {
    "text": "Rest your hand on your chest and feel your heartbeat for 20 seconds.",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Your bank account is empty, but your body is working perfectly. You are fine.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Move one food delivery or shopping app off your main home screen.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Create visual distance to stop unconscious, muscle-memory spending.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Turn off push notifications for a single retail app right now.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Silence the corporate alerts. Protect your attention and your cash.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Throw away one old, useless receipt from your wallet or desk.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Purge the clutter to prove you can easily manage your administration.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Put any loose coins on your desk into a cup.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Consolidate your cash to show psychological respect for your capital.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Search 'unsubscribe' in your email and click it on one promotional message.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Close the marketing loop. Protect tomorrow's inbox and wallet.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Put your credit card back into its exact slot in your wallet.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Restore physical order to your money for a fast hit of competence.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Swipe away all active notifications on your phone screen.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Clear the visual noise to lower the stress that causes impulsive buying.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Unplug a device or charger you are not actively using.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Conserve energy to reinforce your identity as a ruthless steward of resources.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Close all background apps running on your phone.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Clear your digital cache to clear your mental cache. Build momentum.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Place an empty folder on your desk for future receipts.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Build the physical system now to eliminate friction later.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Stack any loose financial papers on your desk into one neat pile.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Square the edges to exert physical dominance over the stress.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Turn off 'Autofill credit card' in your mobile browser.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Add friction. Force yourself to type 16 digits to kill lazy spending.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Delete one promotional text message from a brand.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Erase the hook. Deny them access to your attention.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Gather all your payment cards and stack them neatly in one place.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Consolidate your purchasing power to prepare for intentional use.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Switch your phone to 'Do Not Disturb' for the next hour.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Build a sensory fortress. Shield your brain from commercial interruption.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Wipe down your phone screen with a cloth.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Clean the glass to wipe away the sluggishness of financial avoidance.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Find a pen and place it directly next to your notepad.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Prep the environment to break your paralysis without heavy mental lifting.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Empty your computer's digital trash bin.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Execute a digital purge for a fast hit of productive dopamine.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Unfollow one influencer whose lifestyle triggers you to spend.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Curate your feed aggressively. Protect your net worth from engineered envy.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Search 'receipt' in your email and archive one old digital receipt.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Archive the file to prove financial admin is quick and painless.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Stand up and say: 'I have solved difficult problems. I will solve this.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Remind your brain of your resilience to kill the illusion of helplessness.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Look at your hands and say: 'I have the capacity to create value.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Your earning potential is built into your body, not the economy.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Look around and say: 'I have shelter. My baseline survival is secure.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Confirm your physical safety aloud to shut down the primal panic alarm.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Press your palms together and say: 'My income is not fixed. I can pivot.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "You freeze when you feel trapped. Vocalize your flexibility to escape.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Exhale and say: 'I do not need to fix my whole life today. Just the next hour.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Shrink your timeline. Stop processing years of stress all at once.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'This stress is temporary data, not a life sentence.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Detach your identity from your current economic snapshot.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Touch your chest and say: 'My mind is sharp and I am ready to adapt.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Your bank balance is low, but your biological operating system is strong.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'Debt does not erase my professional skills or human worth.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Remove the shame. Your worth is completely untouchable by numbers.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Squeeze your shoulder and say: 'I am allowed to make money mistakes.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Punishing yourself drains the energy you need to build a solution.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'I have the intelligence to learn what I don't know about money.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Shift to learning mode to open your brain back up for growth.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'I refuse to let a piece of plastic dictate my self-respect.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Reclaim your psychological sovereignty from the credit card companies.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'Wealth is built one tiny decision at a time. The next one is mine.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Claim absolute ownership over your next micro-action to kill the freeze response.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Look out a window and say: 'The world is full of capital. I will capture mine.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Look at the horizon to shatter the suffocating illusion of scarcity.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Flex your arms and say: 'I am resilient enough to handle the market.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Flex your muscles to flood your body with confident, aggressive action-chemicals.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'I forgive myself for not knowing better about money in the past.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Contempt for your past self blocks your future wealth. Let it go.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Put feet flat and say: 'Panic is a chemical. It will pass. Logic will return.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Label the fear as biology. Strip it of its narrative power.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'I am stepping out of panic and back into control right now.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "The brain obeys the voice. Command yourself to override the survival signals.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'I have the discipline to rebuild and secure my future.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Hope is not wishing. Hope is the active belief in your execution.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Touch your head and say: 'My mind is my primary asset. It cannot be depleted.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Cash drains. Human capital remains. Anchor your security in your intellect.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'Every action I take builds my financial fortress.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Turn boring admin tasks into the active construction of your empire.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  }
];

module.exports = {
  CORE_DECK_METADATA,
  charismaDeck,
  financialResetDeck,
  charisma: charismaDeck,
  wealth: financialResetDeck,
  financial_reset: financialResetDeck
};
