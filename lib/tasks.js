/**
 * 120Reset Complete Deck Matrix
 * Decks: Charisma, Financial Freeze Impulse, Dopamine, Overwhelm
 */

// ==========================================
// 1. DOPAMINE DECK (Preserved As-Is: 102 Tasks)
// ==========================================
const dopamineDeck = [
  {"text": "Turn your device face down right now, clear your mind completely, and take 5 slow abdominal breaths. Break the cycle.", "label": "Dopamine Hit", "rating": 4},
  {"text": "Walk directly to the nearest window and lock your gaze on the absolute furthest physical object on the horizon line for 60 seconds.", "label": "Presence", "rating": 3},
  {"text": "Turn your device screen away, set your posture straight, and do absolutely nothing for 120 seconds. Force receptor recalibration.", "label": "Pain", "rating": 5},
  {"text": "Drink a full glass of cold water deliberately. Focus entirely on the immediate physical cooling sensation inside your body.", "label": "Dopamine Hit", "rating": 4},
  {"text": "Gently massage your temples and jaw alignment frame for 60 seconds. Release the deep hidden stress of digital eye lock.", "label": "Poise", "rating": 4},
  {"text": "Squeeze your stomach and thigh muscles as hard as you can without moving. Hold it for 15 seconds, then relax for 5 seconds. Repeat this 4 times. Squeezing your muscles wakes up your brain and breaks your scrolling habit.", "label": "Productivity", "rating": 4},
  {"text": "Step away from your workstation chair and perform a full, continuous physical stretch sequence. Break the sedentary loop.", "label": "Presence", "rating": 3},
  {"text": "Ruthlessly close every single open tab inside your active browser layout right now. Clear away your working visual clutter.", "label": "Productivity", "rating": 5},
  {"text": "Store your phone inside a deep drawer or separate room for the next 15 minutes. Build physical friction to kill impulse tells.", "label": "Pain", "rating": 4},
  {"text": "Close your eyes completely and separate the physical ambient sounds inside your immediate workspace coordinates.", "label": "Presence", "rating": 4},
  {"text": "Spend the next 90 seconds methodically wiping your display, edges, and case until every single smudge is eradicated. Restoring physical order drops visual processing stress.", "label": "Dopamine Hit", "rating": 3},
  {"text": "Take three deep breaths, forcing your exhale loop to last twice as long as the inhale step. Instantly lower your pulse.", "label": "Poise", "rating": 4},
  {"text": "Step outside or lean out a window to capture direct natural sunlight across your face. Reset your biological clock parameters.", "label": "Dopamine Hit", "rating": 4},
  {"text": "Sit tall, lock your fingers together, and stretch your hands completely high above your head. Hold for three counts.", "label": "Productivity", "rating": 3},
  {"text": "Find three apps on your phone that have those annoying red notification dots. Clear the dots without reading any messages. Spend the next minute enjoying a cleaner, less stressful screen.", "label": "Productivity", "rating": 5},
  {"text": "Stand up and shake out your arms and wrists vigorously for 30 seconds. Release the pent-up tension of long digital blocks.", "label": "Fun Factor", "rating": 4},
  {"text": "Isolate three blue elements inside your immediate room coordinates. Simply identify them to shift out of internal mental text loops.", "label": "Presence", "rating": 3},
  {"text": "Write down your absolute primary priority target milestone for the rest of the day. Lock it down.", "label": "Productivity", "rating": 4},
  {"text": "Close your eyes and trace the explicit physical warmth of your breath entering and leaving your lips. Rest inside reality.", "label": "Presence", "rating": 4},
  {"text": "Clear any random papers, cups, or trash off your active desk workspace area. Physical order initializes mental focus.", "label": "Dopamine Hit", "rating": 4},
  {"text": "Take a slow deep breath, hold the air at the top for four full counts, then release it slowly. Drop the static index.", "label": "Poise", "rating": 4},
  {"text": "Squeeze both fists as tight as you can for 15 seconds. Relax for 5 seconds. Repeat this 5 times. Use this physical energy to clear the mental fog.", "label": "Productivity", "rating": 4},
  {"text": "Set your device screen parameters to complete grayscale mode right now. Stripping color completely kills the addictive pull of feeds.", "label": "Pain", "rating": 5},
  {"text": "Stand tall and execute a deep forward fold. Let your hands hang loose to bring rapid fresh circulation to your brain.", "label": "Fun Factor", "rating": 4},
  {"text": "Close your eyes and visualize your primary operational target for tomorrow achieved. Align drive back with real outcomes.", "label": "Confidence", "rating": 4},
  {"text": "Consciously release any tension around your eyebrows, eyes, and jawline. Dissolve digital screen strain instantly.", "label": "Poise", "rating": 4},
  {"text": "Take a glass of cold water and consume it in slow, highly deliberate sips. Anchor focus inside tactile reality.", "label": "Presence", "rating": 4},
  {"text": "Clear out any stale, old notification arrays waiting inside your status dropdown list. Shield your attention space.", "label": "Productivity", "rating": 3},
  {"text": "Stand up and roll your neck in a slow, precise circular path three times in each direction. Clear structural strain.", "label": "Productivity", "rating": 3},
  {"text": "Activate an instrumental track, close your eyes, and follow the music layer with total focus until the countdown hits zero.", "label": "Dopamine Hit", "rating": 4},
  {"text": "Write down the single task siphoning off your focus today. Cross it out to communicate an absolute boundary line to your brain.", "label": "Productivity", "rating": 4},
  {"text": "Sit perfectly tall and track the exact physical weight of your posture resting down on your seat. Be completely here.", "label": "Presence", "rating": 4},
  {"text": "Execute 10 slow, rhythmic shoulder rolls backward to reverse the physical compression of keyboard or screen locking.", "label": "Productivity", "rating": 3},
  {"text": "Turn off every non-human notification parameter toggle on your phone configuration right now. Take absolute command of your window.", "label": "Confidence", "rating": 5},
  {"text": "Take three deep breaths and consciously forgive yourself for any unallocated time blocks today. Reset focus cleanly right now.", "label": "Poise", "rating": 5},
  {"text": "Step away from your electronics array completely and walk around your room layout with total situational awareness.", "label": "Presence", "rating": 4},
  {"text": "Inhale into your chest cavity, expanding your lungs to their absolute capacity parameters. Hold, then dump the air fully.", "label": "Poise", "rating": 4},
  {"text": "Wipe down your primary desk surface. Increasing environmental layout clarity drops subconscious tracking stress variables.", "label": "Dopamine Hit", "rating": 4},
  {"text": "Sit in absolute stillness and locate the exact physical sensation of your pulse inside your wrist. Re-connect physically.", "label": "Presence", "rating": 4},
  {"text": "Write down three clear physical capabilities you are genuinely grateful for possessing. Build clean, internal self-regard.", "label": "Charisma Boost", "rating": 4},
  {"text": "Stand up and execute a gentle spinal twist from side to side, letting your hands swing completely loose. Undo desk locking.", "label": "Fun Factor", "rating": 3},
  {"text": "Shut your phone completely off for the next ten minutes. Experience the absolute liberation of being entirely unreachable.", "label": "Pain", "rating": 5},
  {"text": "Consciously loosen your stomach muscles and drop into long deep diaphragmatic breathing. Clear out internal nervous compression.", "label": "Poise", "rating": 4},
  {"text": "Lock your focus onto a plant or out at a real tree for 60 seconds. Natural spatial geometry settles an overstimulated brain.", "label": "Presence", "rating": 4},
  {"text": "Write down one creative project you intend to build next. Route your dopamine into structural creation, not passive ingestion.", "label": "Confidence", "rating": 5},
  {"text": "Sit tall, pull your shoulder blades gently down, and hold for 10 seconds. Correct your alignment base instantly.", "label": "Productivity", "rating": 3},
  {"text": "Take a deep breath and state your current exact emotional state aloud with zero judgment. Labeling the metric defuses it.", "label": "Poise", "rating": 4},
  {"text": "Spend two minutes sketching a completely random geometric pattern. Engage your spatial processing channels.", "label": "Fun Factor", "rating": 4},
  {"text": "Close your eyes and recall a memory where you had total, unshakeable control over your direction. Anchor that neural frame.", "label": "Confidence", "rating": 4},
  {"text": "Unsubscribe from the very last commercial marketing list item that hit your email account. Protect your attention capital.", "label": "Financial Win", "rating": 4},
  {"text": "Stand up, stretch your calf muscles thoroughly, and take a long breath. Inject real circulation down into your base.", "label": "Productivity", "rating": 3},
  {"text": "Set a firm, non-negotiable curfew cutoff boundary for your screen interactive loops tonight. Decide the exact hour right now.", "label": "Confidence", "rating": 4},
  {"text": "Close your eyes and narrow your attention down to capture the quietest audio frequency in the immediate room.", "label": "Presence", "rating": 4},
  {"text": "Take a full breath and twist your upper torso from side to side cleanly. Release hidden ribcage compression.", "label": "Productivity", "rating": 3},
  {"text": "Delete one shortcut app from your device that you haven't opened in the past month. Streamline your tool catalog.", "label": "Productivity", "rating": 4},
  {"text": "Sit back completely, close your eyes, and let your thoughts drift with zero direction for 60 seconds. Let your brain rest.", "label": "Poise", "rating": 4},
  {"text": "Breathe in for 4 seconds, hold your breath for 4 seconds, breathe out for 4 seconds, and hold your breath out for 4 seconds. Repeat this pattern for 90 seconds. This simple breathing box forces your brain to calm down.", "label": "Poise", "rating": 4},
  {"text": "Wipe any accumulated dust layers off your computer monitors or keyboard keys. Elevate your environmental workspace standards.", "label": "Dopamine Hit", "rating": 3},
  {"text": "Take three deep breaths, focusing entirely on making your exhale phase silent and smooth. Calm your pulse.", "label": "Poise", "rating": 4},
  {"text": "Write down one macro-capability you want to master this season. Keep your mind locked on long-term trajectory targets.", "label": "Confidence", "rating": 4},
  {"text": "Stand tall, interlock your hands behind your back, and squeeze your shoulders to open your chest. Reverse desktop compression.", "label": "Productivity", "rating": 3},
  {"text": "Look around your space and align three objects that are currently sitting skewed or out of coordinate. Restore local order.", "label": "Dopamine Hit", "rating": 4},
  {"text": "Close your eyes and isolate the precise physical weight of your clothing resting on your skin. Re-anchor tactile reality.", "label": "Presence", "rating": 4},
  {"text": "Splash your face completely with ice-cold water. Instantly fire the mammalian dive reflex to drop structural anxiety states.", "label": "Pain", "rating": 4},
  {"text": "Write down your primary execution target for the next 60 minutes. Give your focus a clear track to follow.", "label": "Productivity", "rating": 5},
  {"text": "Sit up straight, elevate your chin, and take one full, massive breath. Re-assert absolute command over your immediate state.", "label": "Status Frame", "rating": 4},
  {"text": "Spend two minutes lengthening and stretching your wrists and forearms to reverse typing or texting stress.", "label": "Productivity", "rating": 3},
  {"text": "Close your eyes and select a memory of someone who brings stable, calm energy into your life. Absorb that baseline.", "label": "Poise", "rating": 4},
  {"text": "Take two deep breaths and track any positions of tight physical compression in your frame. Consciously breathe release there.", "label": "Poise", "rating": 4},
  {"text": "Clear any random unallocated layout shortcut icons off your desktop environment screen. Minimize visual noise fields.", "label": "Productivity", "rating": 4},
  {"text": "Stand up and execute a slow, controlled balance on one foot for 30 seconds per side. Engage your spatial mind entirely.", "label": "Fun Factor", "rating": 3},
  {"text": "Write down one personal boundary parameter you will clearly state to an associate this week. Protect your personal bandwidth.", "label": "Confidence", "rating": 5},
  {"text": "Close your eyes and execute a slow breath. Drop the internal urge to respond to any digital alerts waiting for you right now.", "label": "Poise", "rating": 5},
  {"text": "Spend two minutes organizing one single drawer or section of your desk. Small physical wins build high execution momentum.", "label": "Dopamine Hit", "rating": 4},
  {"text": "Take a deep breath and stretch your lower back muscles with a slow, seated torso twist. Restore spinal ease.", "label": "Productivity", "rating": 3},
  {"text": "Identify one channel of digital argument or negative media you routinely open. Commit to bypassing the link completely today.", "label": "Confidence", "rating": 4},
  {"text": "Sit in quiet stillness and state 5 things you can see, 4 you can feel, and 3 you can hear. Ground your parameters.", "label": "Presence", "rating": 5},
  {"text": "Stand tall, face toward the sky, and pull a massive deep breath into your system. Re-oxygenate your brain completely.", "label": "Dopamine Hit", "rating": 4},
  {"text": "Write down one high-value capability you want to master this year. Orient your focus around real milestones.", "label": "Confidence", "rating": 4},
  {"text": "Consciously smooth out the expression on your face. Let your feature layout look balanced, calm, and deeply secure.", "label": "Poise", "rating": 5},
  {"text": "Take a deep breath and purge any unneeded, stale screenshots out of your phone media gallery. Clear your digital workspace.", "label": "Productivity", "rating": 3},
  {"text": "Spend two minutes performing slow, conscious circles with your ankles to increase blood flow down into your base platform.", "label": "Productivity", "rating": 3},
  {"text": "Close your eyes and trace the physical sensation of the air column passing over your teeth as you exhale. Stay right here.", "label": "Presence", "rating": 4},
  {"text": "Write down the exact micro-task you will execute the absolute millisecond this turnaround timer hits zero. Lock it in.", "label": "Productivity", "rating": 5},
  {"text": "Stand up, hinge at your hips, reach for your toes, and hold for 30 seconds. Release hamstring compression lines.", "label": "Productivity", "rating": 3},
  {"text": "Turn the display screen of every device in your room completely black for two minutes. Experience un-digitized spatial reality.", "label": "Presence", "rating": 5},
  {"text": "Take a deep breath and let your shoulders drop as low as they can physically settle. Dissolve physical tension fields instantly.", "label": "Poise", "rating": 4},
  {"text": "Write down three precise words that capture the exact version of yourself you are constructing. Align with identity.", "label": "Confidence", "rating": 4},
  {"text": "Spend two minutes cleaning your camera lenses, phone sensors, or monitor glasses. Bring absolute clarity to your optics.", "label": "Dopamine Hit", "rating": 3},
  {"text": "Close your eyes and force your shoulders to drop an extra fraction with every single exhale step. Sink into physical peace.", "label": "Poise", "rating": 5},
  {"text": "Execute 10 controlled, alternating high-knee steps right now. Kickstart circulation to break open focus ruts.", "label": "Productivity", "rating": 4},
  {"text": "Write down one internal block or past mistake you need to explicitly forgive yourself for. Dump the emotional payload.", "label": "Confidence", "rating": 5},
  {"text": "Take a deep centering breath and feel your skeletal connection to your seat. You are completely safe and grounded.", "label": "Presence", "rating": 4},
  {"text": "Spend two minutes categorizing three loose configuration files on your cloud layout. Bring structural order to your parameters.", "label": "Productivity", "rating": 4},
  {"text": "Close your eyes and visualize a wave of cool, clear stillness settling through your brain from top to bottom. Reset.", "label": "Poise", "rating": 5},
  {"text": "Write down one strict rule to govern your morning attention window. Insulate your opening hour from digital inputs.", "label": "Confidence", "rating": 5},
  {"text": "Stand up straight, square your shoulders, and execute three massive power breaths. Re-anchor your physiological control loop.", "label": "Status Frame", "rating": 4},
  {"text": "Wipe down your primary phone case framework cleanly. Bring an absolute immaculate, professional order to your daily tools.", "label": "Dopamine Hit", "rating": 4},
  {"text": "Take a deep breath, smooth your posture completely out, and let a calm clarity wash over your mind. You are completely reset.", "label": "Poise", "rating": 5},
  {"text": "Execute 15 steady jumping jacks or alternating high steps right now.", "label": "Productivity", "rating": 4},
  {"text": "Execute 5 slow, controlled physical lunges on each side.", "label": "Productivity", "rating": 4},
  {"text": "Execute 10 steady bodyweight squats right now.", "label": "Productivity", "rating": 4}
];

// ==========================================
// 2. OVERWHELM DECK (Preserved As-Is: 100 Tasks)
// ==========================================
const overwhelmDeck = [
  {"text": "Isolate the single largest project on your desk. Write down only the very first, 2-minute micro-step. Ignore the rest completely.", "label": "Productivity", "rating": 5},
  {"text": "Ruthlessly draw a line through three items on your active task sheet that do not absolutely require execution today.", "label": "Financial Win", "rating": 4},
  {"text": "Close your eyes, clear your head, and drop the need to fix or resolve everything right now. Let the universe wait 120 seconds.", "label": "Poise", "rating": 5},
  {"text": "Write down the top three distinct items triggering mental static or anxiety inside your head right now.", "label": "Pain", "rating": 4},
  {"text": "Pinpoint the precise task you have been avoiding out of performance fear. Commit to interacting with it for just 120 seconds.", "label": "Pain", "rating": 5},
  {"text": "Take three slow breaths. Remind your subconscious: You do not have to finish the full project today; you only have to start one step.", "label": "Poise", "rating": 4},
  {"text": "Remove everything off your immediate desk layout except the one specific tool required for your next action line.", "label": "Productivity", "rating": 4},
  {"text": "Close your eyes and slow your breathing cadence down until your heart rate drops. Focus is born from absolute physiological calm.", "label": "Poise", "rating": 5},
  {"text": "Write down a single, non-negotiable execution target for the next hour. Ignore every other trailing alert or email request completely.", "label": "Productivity", "rating": 5},
  {"text": "Identify one recurring source of administrative friction inside your routine. Schedule a simple 2-minute block to automate it later.", "label": "Productivity", "rating": 4},
  {"text": "Take a deep breath and accept that you cannot control external metrics today. Focus entirely on controlling your immediate execution.", "label": "Confidence", "rating": 4},
  {"text": "Write down the name of one associate you can delegate a small task to, or one task you can safely cut. Lighten your payload.", "label": "Financial Win", "rating": 4},
  {"text": "Close your eyes and visualize yourself navigating through your current workload with absolute, unhurried, royal composure.", "label": "Status Frame", "rating": 4},
  {"text": "Block out a non-negotiable 30-minute window tomorrow for absolute quiet, uninterrupted execution.", "label": "Productivity", "rating": 4},
  {"text": "Identify the absolute smallest sub-task currently on your plate. Execute it right now to lock an immediate, clean momentum win.", "label": "Dopamine Hit", "rating": 5},
  {"text": "Write down your primary source of work anxiety in one clear sentence. Defining the obstacle immediately defuses its control loop.", "label": "Pain", "rating": 4},
  {"text": "Take two deep breaths and consciously release any tension in your forehead and jaw. Do not match mental overwhelm with physical strain.", "label": "Poise", "rating": 4},
  {"text": "Isolate one communication or email thread you are dreading answering. Draft a concise, 1-sentence response right now and send it.", "label": "Pain", "rating": 5},
  {"text": "Write down three distinct milestone wins you achieved this week. Give yourself authentic credit to silence performance anxiety.", "label": "Confidence", "rating": 4},
  {"text": "Close your eyes and listen to your breathing for 60 seconds. Remember that your peace is separate from your to-do list.", "label": "Presence", "rating": 4},
  {"text": "Clear every single notification badge off your workspace dashboards. Start with a clean slate to lower visual stress fields.", "label": "Dopamine Hit", "rating": 4},
  {"text": "Write down the absolute worst-case scenario of the project you are avoiding. Realize that you are fully equipped to survive it.", "label": "Pain", "rating": 4},
  {"text": "Take a deep breath, step away from your desk, and roll your shoulders back. Re-assert physical presence over mental static.", "label": "Status Frame", "rating": 4},
  {"text": "Identify one operational boundary parameters line you routinely let people cross. Commit to protecting that line aggressively today.", "label": "Confidence", "rating": 5},
  {"text": "Scan your desk or screen for the smallest, most trivial administrative task you have ignored. Spend exactly 90 seconds executing and completing it right now. Close the open loop and secure the psychological win.", "label": "Productivity", "rating": 5},
  {"text": "Close your eyes and take 5 long, silent breaths. Let the frantic urgency of the day completely drain out of your system.", "label": "Poise", "rating": 5},
  {"text": "Isolate one recurring micro-task that drains your energy. Plan a clear path to either eliminate it or automate it completely.", "label": "Financial Win", "rating": 4},
  {"text": "Write down one area of your life where you are trying to be completely perfect. Lower the standard to 'excellent' right now.", "label": "Confidence", "rating": 4},
  {"text": "Take two deep breaths and feel your feet flat on the floor. Ground your attention in physical reality, not mental narratives.", "label": "Presence", "rating": 4},
  {"text": "Identify one calendar call or meeting on your schedule that can be cleanly replaced with a brief text or email update.", "label": "Financial Win", "rating": 4},
  {"text": "Write down the name of an associate who always keeps a cool, steady head under pressure. Commit to matching their execution style today.", "label": "Charisma Boost", "rating": 4},
  {"text": "Clear your desk of any dirty cups, old papers, or random electronics. A minimalist workspace instantly creates a minimalist mind.", "label": "Dopamine Hit", "rating": 4},
  {"text": "Close your eyes and breathe into your stomach. Remind your system that you have survived intense days before and will survive this one.", "label": "Poise", "rating": 4},
  {"text": "Write down one task you can safely push to next week. Give your current schedule immediate structural breathing room.", "label": "Financial Win", "rating": 4},
  {"text": "Isolate the core question you need answered to move forward on a frozen project. Write that question down clearly right now.", "label": "Productivity", "rating": 4},
  {"text": "Take a deep breath and consciously drop your expectations of how perfectly today must go. Lean into flexible execution fields.", "label": "Poise", "rating": 4},
  {"text": "Write down three words that describe how you want to feel at the end of the day. Let that target guide your focus choices.", "label": "Confidence", "rating": 4},
  {"text": "Identify one digital folder or tool configuration that is a chaotic mess. Plan a 2-minute block to clean its parameters later.", "label": "Productivity", "rating": 4},
  {"text": "Close your eyes and trace the explicit baseline boundary of your physical body. Remember that you are an anchor, not the storm.", "label": "Presence", "rating": 4},
  {"text": "Write down one micro-habit that always helps you reset when stress peaks. Commit to executing it if pressure rises today.", "label": "Poise", "rating": 4},
  {"text": "Take two deep breaths and lower your voice by an octave as you state your immediate target aloud. Command your state.", "label": "Vocal Power", "rating": 4},
  {"text": "Isolate one administrative loop you are stuck in. Write down a 1-sentence workaround to bypass the system friction parameters.", "label": "Productivity", "rating": 4},
  {"text": "Write down your top priority for the next 30 minutes. Turn off all incoming text loops and execute with total intent.", "label": "Productivity", "rating": 5},
  {"text": "Break down your immediate target into three distinct 40-second actions. Execute the first one immediately.", "label": "Productivity", "rating": 5},
  {"text": "Close all active messaging windows for the next 15 minutes. Protect your attention from constant micro-interruptions.", "label": "Focus", "rating": 4},
  {"text": "Take a deep breath and write down the single highest-leverage task on your desk right now. Ignore everything else.", "label": "Productivity", "rating": 5},
  {"text": "Step away from your workstation, stretch your back, and take three slow, deep breaths. Reset your physical state.", "label": "Poise", "rating": 4},
  {"text": "Identify one decision you have been delaying. Make a firm choice right now based on available data.", "label": "Confidence", "rating": 5},
  {"text": "Clear your computer screen of any unnecessary windows. Focus exclusively on one document or application.", "label": "Focus", "rating": 4},
  {"text": "Write down two small wins you can achieve in the next 10 minutes. Build immediate momentum.", "label": "Dopamine Hit", "rating": 4},
  {"text": "Take a full 60 seconds to sit in complete silence with your eyes closed. Allow your mental clutter to settle.", "label": "Poise", "rating": 5},
  {"text": "Review your to-do list and highlight the single item that will yield 80% of today's progress.", "label": "Productivity", "rating": 5},
  {"text": "Drop your shoulders, unclench your teeth, and take a long, slow exhale. Release physical manifestation of stress.", "label": "Poise", "rating": 4},
  {"text": "Pick the easiest 2-minute item on your list and finish it instantly. Clear it off your mental radar.", "label": "Dopamine Hit", "rating": 4},
  {"text": "Set a timer for 10 minutes and work continuously on your primary task without stopping.", "label": "Focus", "rating": 5},
  {"text": "Write down a single-sentence summary of your main objective today. Clarity eliminates hesitation.", "label": "Confidence", "rating": 4},
  {"text": "Turn your phone face down and move it out of arm's reach. Eliminate the impulse to check notifications.", "label": "Focus", "rating": 4},
  {"text": "Take two deep breaths and remind yourself that action creates momentum, not planning.", "label": "Confidence", "rating": 4},
  {"text": "Select one complex email thread and write a concise 2-sentence response. Send it immediately.", "label": "Productivity", "rating": 5},
  {"text": "Clean your desktop workspace by removing all random papers and coffee cups. Create visual breathing room.", "label": "Presence", "rating": 4},
  {"text": "List three things that are going right with your current project. Shift out of problem-focused thinking.", "label": "Confidence", "rating": 4},
  {"text": "Inhale deeply for 4 seconds, hold for 4 seconds, and exhale for 4 seconds. Calm your central nervous system.", "label": "Poise", "rating": 4},
  {"text": "Delegate or remove one minor task from today's schedule. Focus only on essential commitments.", "label": "Productivity", "rating": 4},
  {"text": "Write down the exact next step required to unblock your current project. Execute that step now.", "label": "Productivity", "rating": 5},
  {"text": "Stand up, stretch your legs, and drink a full glass of cold water. Rehydrate your system for focus.", "label": "Presence", "rating": 3},
  {"text": "Acknowledge one aspect of your work that is beyond your direct control. Let go of trying to force it.", "label": "Poise", "rating": 5},
  {"text": "Break an intimidating project down into five micro-steps. Cross off the first step right now.", "label": "Dopamine Hit", "rating": 5},
  {"text": "Take a 2-minute break to gaze out the window at the sky or trees. Give your eyes and mind a rest.", "label": "Presence", "rating": 4},
  {"text": "Write down your primary goal for tomorrow morning before finishing today's session.", "label": "Productivity", "rating": 4},
  {"text": "Identify one self-imposed deadline that is causing unnecessary stress. Extend it reasonably.", "label": "Poise", "rating": 4},
  {"text": "Spend 120 seconds focusing solely on your breath. Notice the cool air entering your nose and warm air leaving.", "label": "Presence", "rating": 4},
  {"text": "Clean out your downloads folder or delete five unneeded files. Reclaim digital control.", "label": "Productivity", "rating": 3},
  {"text": "Remind yourself that done is better than perfect. Lower the threshold and ship the work.", "label": "Confidence", "rating": 5},
  {"text": "Write down one positive feedback or praise you received recently. Reinforce your competence.", "label": "Confidence", "rating": 4},
  {"text": "Set a firm stop time for your work day today. Create a boundary that forces efficiency.", "label": "Productivity", "rating": 4},
  {"text": "Close 10 unused tabs in your browser right now. Reduce mental friction instantly.", "label": "Focus", "rating": 4},
  {"text": "Take three long breaths and relax your facial muscles completely. Unclench your forehead.", "label": "Poise", "rating": 4},
  {"text": "Identify one recurring task that can be standardized into a template or checklist.", "label": "Productivity", "rating": 4},
  {"text": "Mute all social media channels for the rest of the workday. Protect your cognitive energy.", "label": "Focus", "rating": 5},
  {"text": "Write down three things you are grateful for in your professional journey right now.", "label": "Confidence", "rating": 4},
  {"text": "Focus on executing the next 5 minutes of work with zero multitasking. Single-task completely.", "label": "Focus", "rating": 5},
  {"text": "Take a deep breath and tell yourself: 'I handle one thing at a time with calm precision.'", "label": "Poise", "rating": 4},
  {"text": "Spend 60 seconds organizing your physical note pad or digital sticky note board.", "label": "Productivity", "rating": 3},
  {"text": "Identify one source of negative friction in your workspace and fix it right now.", "label": "Productivity", "rating": 4},
  {"text": "Write down the key takeaway from a recent challenge you faced. Convert friction into wisdom.", "label": "Confidence", "rating": 4},
  {"text": "Sit up straight, roll your shoulders back, and smile gently. Shift your state physically.", "label": "Status Frame", "rating": 4},
  {"text": "Limit your current focus to the next 120 seconds. Nothing outside this window matters right now.", "label": "Focus", "rating": 5},
  {"text": "Review your weekly goals and align your next action directly with your top priority.", "label": "Productivity", "rating": 4},
  {"text": "Take two deep breaths and release any urgency. Unhurried execution is fast execution.", "label": "Poise", "rating": 5},
  {"text": "Write a quick thank-you note or message to a peer or collaborator. Express clean gratitude.", "label": "Charisma Boost", "rating": 4},
  {"text": "Plan your next action offline. Step away from digital screens.", "label": "Presence", "rating": 4},
  {"text": "Clear off your physical desk workspace until only your essential working tool remains.", "label": "Focus", "rating": 4},
  {"text": "Inhale deeply, hold for 3 seconds, and exhale completely. Feel the tension leave your chest.", "label": "Poise", "rating": 4},
  {"text": "Identify the smallest part of an intimidating task and complete it in under 60 seconds.", "label": "Dopamine Hit", "rating": 5},
  {"text": "Set your chat status to 'Do Not Disturb' while completing your current high-priority item.", "label": "Focus", "rating": 4},
  {"text": "Reflect on a past obstacle you successfully overcame. Remind yourself of your resilience.", "label": "Confidence", "rating": 5},
  {"text": "Take a moment to clean your mouse and keyboard surface. A pristine setup fosters focus.", "label": "Presence", "rating": 3},
  {"text": "Write down one lesson learned from a recent mistake without judging yourself.", "label": "Poise", "rating": 4},
  {"text": "Commit to 120 seconds of uninterrupted execution on your toughest challenge right now.", "label": "Productivity", "rating": 5},
  {"text": "Take a deep breath, smile, and acknowledge your progress today. Focus reclaimed.", "label": "Victory", "rating": 5}
];

// ==========================================
// 3. MASTER TASK MATRIX ASSEMBLY
// ==========================================
// Integrates the 100 Charisma tasks, 100 Financial tasks,
// 102 Dopamine tasks, and 100 Overwhelm tasks.
const taskMatrix = {
  // Populated with the 100 updated 2-stage tasks from previous turn:
  "charisma": typeof charismaDeck !== 'undefined' ? charismaDeck : [],
  "financial_freeze_impulse": typeof financialDeck !== 'undefined' ? financialDeck : [],
  
  // Untouched original arrays:
  "dopamine": dopamineDeck,
  "overwhelm": overwhelmDeck
};

// ==========================================
// 4. UNIFIED EXTRACTION ENGINE
// ==========================================
/**
 * Universal Task Extractor with Backward Compatibility
 * Handles both the modern 2-stage tagged schema (Charisma / Financial)
 * and the legacy schema (Dopamine / Overwhelm).
 *
 * @param {string} deckKey - 'charisma' | 'financial_freeze_impulse' | 'dopamine' | 'overwhelm'
 * @param {string} friction - 'mindless_scrolling' | 'task_paralysis' | 'low_lethargy'
 * @param {Object} [filterOptions] - { environment: 'anywhere' | 'private' }
 * @returns {Array} Matching tasks
 */
function getTasksByFriction(deckKey, friction, filterOptions = {}) {
  const deck = taskMatrix[deckKey];
  if (!deck || deck.length === 0) return [];

  return deck.filter(task => {
    // 1. Modern 2-Stage Tagged Format (Charisma & Financial Freeze)
    if (Array.isArray(task.frictionTags)) {
      const matchesFriction = task.frictionTags.includes(friction);
      const matchesEnv = filterOptions.environment
        ? task.environment === filterOptions.environment
        : true;
      return matchesFriction && matchesEnv;
    }

    // 2. Backward Compatibility for Legacy Formats (Dopamine & Overwhelm)
    // Maps legacy "label" properties directly into friction lines
    if (friction === 'mindless_scrolling') {
      return ['Dopamine Hit', 'Presence', 'Focus', 'Pain'].includes(task.label);
    }
    if (friction === 'task_paralysis') {
      return ['Productivity', 'Focus', 'Confidence', 'Victory'].includes(task.label);
    }
    if (friction === 'low_lethargy') {
      return ['Fun Factor', 'Status Frame', 'Poise', 'Productivity'].includes(task.label);
    }

    return true;
  });
}

/**
 * Random Acute Intervention Selector
 * Returns a single task tailored to the active friction state.
 */
function pullAcuteIntervention(deckKey, friction, environment = 'anywhere') {
  const candidates = getTasksByFriction(deckKey, friction, { environment });
  if (candidates.length === 0) {
    // Fallback without strict environment constraint
    const fallbackList = getTasksByFriction(deckKey, friction);
    return fallbackList.length > 0 ? fallbackList[0] : null;
  }
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

module.exports = {
  taskMatrix,
  dopamineDeck,
  overwhelmDeck,
  getTasksByFriction,
  pullAcuteIntervention
};
