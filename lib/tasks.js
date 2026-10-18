/**
 * 120Reset Master Task Matrix (task.js)
 * 
 * Configured Decks (2-Stage Micro-Interventions):
 * - The Charisma Deck: (Presence, Warmth, Vocal Authority, Biomechanics)
 * - The Financial Reset Deck: (Clarity, Impulsive Spending, Rewire, Micro-Wins, Manifestation)
 * - The Dopamine Swap Deck: (Humor & Wit, Nostalgia & Travel, Cravings & Taste, Desk Play, Energy Surge, Quick Wins)
 * - The Overwhelm Deck: Linear 4-Step Pipeline per Friction Line
 */

const charismaDeck = [
  {
    "text": "Pull your shoulder blades gently together and open your chest for 10 seconds.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Primates hunch to protect organs; charismatic leaders expose their torso because they fear nothing.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Plant both feet flat on the floor, shoulder-width apart, and eliminate all swaying or shuffling.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Anchoring your lower base eliminates nervous kinetic leakage and signals unshakeable physical stability to observers.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Unclench your jaw, drop your tongue from the roof of your mouth, and soften your facial muscles.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Facial tension signals threat. A relaxed, neutral jaw reflects high-status ease and effortless emotional composure.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Imagine an invisible thread lifting the crown of your head toward the ceiling, lengthening your neck.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Aligning your cervical spine counteracts slouching and restores natural biological height without rigid military stiffness.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Drop your shoulders down and away from your ears, holding the release for three deep exhales.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Raised trapezius muscles are an involuntary reflex. Lowering them visibly signals absolute safety and control.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Open your hands, relax your wrists completely, and rest your palms flat on your lap.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Clenched fists trigger ancestral distrust. Visible, relaxed palms instantly project openness and non-defensiveness.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Sit up straight, rest your forearms flat on the desk, and keep elbows slightly wide.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Claiming tabletop territory establishes non-verbal executive presence, replacing defensive arm-tucking with calm spatial authority.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Widen your standing stance by two inches and balance your weight equally across both heels.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "A wider footprint directly feeds neurological security back to your brain, making your physical platform immovable.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Lift your chin by a fraction of an inch to align your gaze parallel with the horizon.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Downward head tilts signal submissiveness. A level eye line projects intentional direction and unbothered vigilance.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Place both hands completely flat on your thighs without fidgeting, tapping, or moving for 60 seconds.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Total physical stillness commands the room. Suppressing micro-fidgets projects supreme self-control and situational dominance.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Uncross your arms and legs, letting your body rest in a completely open, receptive posture.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Crossed limbs act as a physical barricade. An unblocked torso signals you welcome interaction and remain unthreatened.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Stand tall and walk ten paces at an unhurried, measured tempo with arms swinging naturally.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Rushing non-verbally screams you are subject to someone else's timeline. Measured pacing shows you control your tempo.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Grip your left forearm firmly with your right hand, feeling complete web-to-web thumb contact for two seconds.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Memorable handshakes depend on deep web-to-web palm contact, not aggressive bone-crushing pressure.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Rest your back fully against the backrest of your seat without hunching or slouching forward.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Leaning forward eagerly reads as approval-seeking. Sitting back comfortably projects the conversation revolves around you.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Roll your shoulders backward once, letting them drop heavily into their natural, grounded resting slots.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Resetting the shoulder girdle shifts your posture from internal defensive hunching into expansive, relaxed confidence.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Place your hand lightly on your sternum and gently lift your chest away from your waistband.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Elevating the sternum decompresses the diaphragm, projecting visual dignity while allowing full, unrestricted oxygen flow.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Square your shoulders directly toward the wall or doorway in front of you.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Angling your body away signals avoidance. Facing forward squarely shows readiness to engage challenges directly.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Release all tension from your calf and thigh muscles, letting your legs feel heavy and anchored.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Leg tension fuels the fight-or-flight motor loop. Relaxing them eliminates the unconscious urge to pace or flee.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Stand balanced with your feet under your hips, arms hanging loosely at your sides without touching pockets.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Hiding hands in pockets diminishes status. Open, free-hanging arms demonstrate physical ease and total transparency.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Interlock your fingers behind your back and gently pull downward to open your front deltoids.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Opening the anterior shoulder muscles reverses hours of screen hunching, expanding your chest into an open silhouette.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Place one hand flat over your belly and inhale deeply so only your hand moves forward.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "True diaphragmatic breathing lowers heart rate immediately, keeping your chest still and preventing nervous gasping.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Consciously unclench your glutes and pelvic floor while sitting completely upright.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Deep pelvic tension is an unconscious somatic response to chronic stress. Releasing it grounds your posture effortlessly.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Stretch your arms wide horizontally for five seconds, then lower them smoothly to your sides.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Expansive posturing alters neuroendocrine feedback, telling your brain that you occupy safe, abundant space.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Stand with your weight evenly distributed across the balls and heels of both feet.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Rocking onto heels signals retreat; leaning on toes signals eagerness. Centered weight communicates neutral balance.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Rest your dominant hand flat over your center chest and take three slow, steady breaths.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Tactile chest contact stimulates the vagus nerve, calming heart rate spikes and giving you internal physical composure.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'This is the strategy moving forward.' Drop your vocal pitch lower on the final word.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Downward vocal inflection turns a hesitant question into an authoritative command, instantly building leadership trust.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "State your primary goal aloud, cutting out 'I think', 'maybe', 'hopefully', and 'just'.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Eliminating apologetic hedge words demonstrates absolute ownership and conviction in your executive judgment.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Speak your full name aloud slowly with clear diction and zero trailing justification.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Owning your identity without rushing signals that you believe your presence carries weight and value.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Ask an imaginary question, wait two full silent seconds, then speak your answer aloud.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Pausing before speaking proves emotional self-regulation. Rushing to answer betrays insecurity and eagerness to please.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Speak a complete sentence in one steady, continuous breath without gasping or rushing the cadence.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Controlled air output prevents vocal trembling, lending weight and elegance to every statement.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "State your immediate next objective aloud at half your normal conversational speed.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Speaking slowly signals that you expect people to wait for your words, commanding attention without shouting.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Take a deep breath and project your voice toward the furthest corner of the room without yelling.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Projecting to the boundary of a room trains thoracic resonance, ensuring your voice fills spaces naturally.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Deliver a clear introduction of yourself aloud in under ten seconds, omitting all filler words.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Crisp, unpadded introductions highlight sharp professional competence and respect for the listener's attention.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Say 'No, that will not work for me' aloud with a calm, neutral facial expression.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Stating boundaries without anger or over-explanation demonstrates emotional maturity and unshakeable self-respect.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'Good morning, let's get started' with your deepest natural vocal resonance.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Deeper chest tones stimulate human auditory trust, signaling calm competence from the opening second.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Rehearse delivering a clean exit line aloud: 'Great speaking with you. Let’s reconnect Thursday.'",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Charismatic figures never linger awkwardly. Closing conversations with clean finality preserves high social value.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say 'Understood' aloud with a single crisp downward nod and zero second-guessing.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Concise acknowledgment shows high-bandwidth communication, removing frantic double-nodding tells entirely.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Deliver a three-word declarative statement aloud as if it were an unalterable operational fact.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Declarative vocal projection trains your brain to match internal conviction with external decisive speech.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Say 'I do not have that data right now; I will confirm by 3 PM' aloud calmly.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Admitting knowledge gaps with calm precision shows deep self-assurance. Stammering or faking destroys credibility.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "State a clear business objective aloud without using 'um', 'uh', or nervous throat-clearing.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Replacing vocal fillers with comfortable silence demonstrates that you are comfortable holding the room's attention.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say 'Thank you' aloud firmly, without tacking on apologetic or minimizing phrases afterward.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Accepting acknowledgment cleanly projects internal status, whereas deflecting compliments telegraphs imposter anxiety.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Practice vocalizing an entire sentence while maintaining absolute physical stillness in your neck and head.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Decoupling head motion from speech prevents bobbing gestures, projecting still, deliberate gravitas.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Say 'Let's pause and consider our options' with an unhurried, grounded cadence.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Leaders de-escalate collective panic by introducing deliberate temporal pauses into high-stress discussions.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Speak your next thought aloud while maintaining a steady, relaxed volume from first word to last.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Trailing off at the end of sentences implies lost confidence. Consistent volume ensures your point lands solidly.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Say 'Yes' aloud with absolute closure, breathing out smoothly as the sound ends.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Definite, clean agreements remove ambiguity and signal reliable, decisive partnership.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Soften your eye muscles and allow a subtle, unforced smile to settle for 30 seconds.",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Genuine warmth activates the orbicularis oculi muscles, signaling authenticity and psychological safety.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Speak a sincere phrase of gratitude aloud toward a collaborator with total clarity.",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "High-status charisma is generous. Freely expressing appreciation elevates others without diminishing your own standing.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'I noticed how thoroughly you handled that challenge. Strong work.'",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Specific behavioral validation makes others feel genuinely seen, creating powerful interpersonal loyalty and rapport.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Look in a mirror, soften your forehead, and nod with warm, quiet self-respect.",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "You cannot project warmth outward while harboring internal self-criticism. Compassion starts with self-regard.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Rehearse greeting an imaginary colleague aloud: 'Great to see you today' with genuine vocal warmth.",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "People forget meeting details, but permanently remember the emotional frequency of your initial greeting.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Practice asking out loud with sincere curiosity: 'What led you to that conclusion?'",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Inquiring without defensiveness lowers conversational shields and invites honest, collaborative dialogue.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Relax your eyebrows and imagine someone you respect walking into your view right now.",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Anticipating positive social interactions naturally floods your face with open, inviting micro-cues.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'Tell me more about how you see this unfolding.'",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Giving the spotlight to others signals supreme inner confidence that requires no desperate personal promotion.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Soften your mouth, open your palms upward on your desk, and breathe gently.",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Open palms paired with a softened expression dissolve perceived hierarchy, establishing mutual trust instantly.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I appreciate your perspective on this' with a calm, validating tone.",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Validating another person's viewpoint before offering your own prevents cognitive resistance and defensiveness.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Practice saying 'That must have been difficult to manage' with genuine vocal empathy.",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Empathetic resonance validates emotional reality, turning professional associates into deeply bonded allies.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Hold a gentle, unhurried smile while maintaining an open, non-defensive posture for 45 seconds.",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Sustained warmth without nervousness projects approachable strength, signaling you are completely comfortable in your skin.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Rehearse saying aloud: 'Take your time, I am listening' with zero conversational impatience.",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Giving someone the gift of unhurried time is the ultimate hallmark of high-status active listening.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Smile warmly, nod slowly once, and practice keeping your eyes relaxed and friendly.",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Warm micro-affirmations reassure speakers that their ideas are landing safely and respectfully.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I trust your judgment on this step' with complete, clean sincerity.",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Empowering others through explicit trust demonstrates high-tier leadership free from micromanaging anxiety.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Sit in absolute, unmoving stillness for 60 seconds without checking devices or fidgeting.",
    "focusArea": "Absolute Presence",
    "affirmation": "Resisting reactive physical impulses trains the deep neurological circuitry required for unbroken conversational focus.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Close your eyes and identify the absolute furthest physical sound occurring in your environment.",
    "focusArea": "Absolute Presence",
    "affirmation": "Reaching outward for subtle sensory signals pulls you out of cognitive rumination and sharpens acute listening.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Lock your focus on a single object across the room at eye level for 45 seconds.",
    "focusArea": "Absolute Presence",
    "affirmation": "Disciplining ocular fixations anchors your cognitive bandwidth, preventing flighty gaze patterns in high-stakes interactions.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Scan your room and identify three distinct design details you have never consciously noticed before.",
    "focusArea": "Absolute Presence",
    "affirmation": "Active environmental mapping snaps you into the present reality, eliminating dissociative internal anxiety loops.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Close your eyes and track five consecutive breaths purely through the temperature of your nostrils.",
    "focusArea": "Absolute Presence",
    "affirmation": "Somatosensory tracking immediately quiets the default mode network, grounding you deeply in the current moment.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Maintain relaxed, level eye contact with an object across the room while taking three slow breaths.",
    "focusArea": "Absolute Presence",
    "affirmation": "Pairing visual stillness with autonomic breathing desensitizes your nervous system to intense interpersonal scrutiny.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Feel the exact physical weight of your feet pressing into the floor for 30 seconds.",
    "focusArea": "Absolute Presence",
    "affirmation": "Directing awareness to your physical coordinates halts spinning thoughts and grounds your physical presence.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Look around your space and observe the lighting and shadows without internally labeling anything.",
    "focusArea": "Absolute Presence",
    "affirmation": "Pure observation without narrative judgment clears cognitive static, creating a clean slate for situational awareness.",
    "frictionTags": ["mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Imagine an executive speaking to you. Maintain unbroken attention on an object, nodding once at 30 seconds.",
    "focusArea": "Absolute Presence",
    "affirmation": "Rehearsing focused listening paired with measured acknowledgment ensures the speaker feels like the only person.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Sit completely still and notice the ambient room temperature against your skin for 30 seconds.",
    "focusArea": "Absolute Presence",
    "affirmation": "Cultivating acute tactile awareness silences internal dialogue, anchoring you solidly in physical reality.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Walk slowly across your room, focusing entirely on the sensation of each footstep connecting with the ground.",
    "focusArea": "Absolute Presence",
    "affirmation": "Kinetic grounding anchors your physical presence, replacing nervous agitation with grounded deliberation.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Keep your eyes perfectly steady on a single point while slowly exhaling for six seconds.",
    "focusArea": "Absolute Presence",
    "affirmation": "Stabilizing your focal point down-regulates amygdala activity, maintaining absolute emotional poise under pressure.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Listen intently to the immediate silence or white noise in your space for 45 seconds.",
    "focusArea": "Absolute Presence",
    "affirmation": "Comfortable immersion in ambient silence builds tolerance for conversational pauses, eliminating awkward chatter.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Trace your hands with your eyes without moving them, observing their resting stillness.",
    "focusArea": "Absolute Presence",
    "affirmation": "Observing physical stillness from a detached perspective reinforces your cognitive identity as a calm presence.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Take two deep breaths, close your eyes, and notice how still your body can become.",
    "focusArea": "Absolute Presence",
    "affirmation": "Quiet physical composure signals supreme internal security, naturally drawing people toward your grounded gravity.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Open your hands on the table and track your breathing until the timer completes.",
    "focusArea": "Absolute Presence",
    "affirmation": "Anchoring physical stillness with breath creates an unshakeable social baseline that resists conversational manipulation.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Observe three objects around you and deliberately appreciate their craftsmanship or structure.",
    "focusArea": "Absolute Presence",
    "affirmation": "Shifting into active appreciation pulls focus away from self-conscious worry and into genuine outward engagement.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Stand still, soften your gaze, and expand your peripheral vision to take in the entire room.",
    "focusArea": "Absolute Presence",
    "affirmation": "Broadening peripheral vision physically triggers parasympathetic activation, instantly calming social fight-or-flight reflexes.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Focus solely on the sensation of your ribcage expanding and contracting for five full cycles.",
    "focusArea": "Absolute Presence",
    "affirmation": "Internal physical monitoring centers your mental axis, preventing external chaos from disrupting your composure.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Sit up straight, close your eyes, and listen for the rhythm of your own natural breathing.",
    "focusArea": "Absolute Presence",
    "affirmation": "Returning to your physiological baseline ensures you enter every conversation from a state of inner sovereignty.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Stand tall, nod once with clean finality, and exhale smoothly through your nose.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Combining physical stillness with decisive acknowledgment signals absolute situational control without speaking a word.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Rest your palms open on your knees and practice breathing without moving your shoulders.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Keeping the shoulder girdle static while breathing projects unshakeable rock-solid stillness to observers.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'Here is what we know so far' with a calm, analytical tone.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Framing discussions around shared baseline facts establishes intellectual leadership and reduces emotional conflict.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Unclench your toes inside your shoes and let your feet expand into the floor.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Clenching toes is an unconscious survival reflex. Releasing them completes full bottom-up nervous relaxation.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I appreciate your patience while we align on this' instead of 'Sorry for the delay'.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Swapping submissive apologies for dignified appreciation elevates your status while validating the other person's time.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Keep your hands loose and execute a slow, open-palm gesture outward toward an imaginary listener.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Open-palm gestures are evolutionary signals of harmlessness and transparency, establishing immediate unconscious safety.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Rehearse saying aloud: 'Let's review the core problem before jumping to conclusions.'",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Guiding others to step back from frantic reaction demonstrates executive maturity and tactical poise.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Soften the corners of your mouth into a neutral, tranquil expression and hold for 30 seconds.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Neutral tranquility prevents nervous micro-grimacing, projecting supreme comfort in high-pressure environments.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I will take responsibility for resolving this point' with firm, quiet conviction.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Stepping forward with accountability without drama is the purest indicator of natural leadership authority.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Align your spine, rest your hands completely motionless, and hold your frame steady for 60 seconds.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Physical economy of motion is magnetic; those who move with intention always outshine those who fidget.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Practice asking aloud: 'How can I best support you on this project?'",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Servant-leadership framing demonstrates high status backed by genuine benevolence, winning lasting respect.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Straighten your posture, look ahead, and take one full breath as if taking the stage.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Rehearsing entrance posture prepares your neuromuscular system to command visual attention effortlessly.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'Let's establish our priority before moving to details' with deliberate clarity.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Establishing strategic focus cuts through conversational clutter, positioning you as the guiding anchor.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Soften your gaze and scan the room slowly, acknowledging the space with unhurried authority.",
    "focusArea": "Absolute Presence",
    "affirmation": "Surveying space slowly communicates that you belong in the room and feel completely secure.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'We have handled tougher situations than this' with steady, reassuring confidence.",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Projecting calm optimism during uncertainty acts as an emotional anchor, naturally rallying people to your side.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Rest both feet firmly on the ground and feel the steady contact between your back and chair.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Grounding physical support structures eliminates postural strain, allowing you to project relaxed authority.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Deliver a slow, crisp sentence aloud, deliberately pausing for a full beat before the final phrase.",
    "focusArea": "Quiet Confidence & Vocal Authority",
    "affirmation": "Strategic rhetorical pauses build anticipation and signal that you do not fear interruptions.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Open your hands, lift your chin slightly, and let your body radiate quiet readiness.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Harmonizing open hands with an elevated gaze projects an approachable yet unshakeable social presence.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I appreciate your input, let's incorporate that idea' with genuine enthusiasm.",
    "focusArea": "High Warmth & Empathy",
    "affirmation": "Welcoming contributions from others validates their worth and marks you as an expansive, ego-free collaborator.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Take a deep breath, let your shoulders drop completely, and settle into still, unshakeable composure.",
    "focusArea": "Physical Posture & Biomechanics",
    "affirmation": "Total physical relaxation paired with upright alignment is the universal biological baseline of high-status charisma.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  }
];

const financialResetDeck = [
  {
    "text": "Open your banking app, count to three, and close it immediately.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Micro-exposure to your bank app without interacting proves it is not a predator, neutralizing the freeze reflex.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Hold your physical wallet in both hands for ten seconds without opening it.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Tactile grounding bridges the gap between abstract panic and physical reality, instantly lowering your heart rate.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Take out one debit or credit card and read the expiration date aloud.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Reading neutral data forces your brain to switch from the emotional fear center to logical processing.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'Numbers on a screen cannot physically harm me.'",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Vocalizing this boundary separates survival instincts from commerce, curing the irrational dread of account balances.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Place your wallet on a table and take three deep breaths while looking at it.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Pairing slow breathing with a financial trigger rewires your nervous system to associate money with calm.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Open a banking app, look only at the bank's logo on the login screen, and close the app.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Executing the physical motion of opening the app without seeing numbers builds muscle memory for courage.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Touch a physical coin or paper bill and trace its edges with your thumb.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Sensory stimulation disrupts cognitive paralysis. Feeling physical currency grounds spiraling thoughts into the safe present.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'Money is simply a tool of exchange, not my identity.'",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Auditory disruption of your internal monologue prevents financial shame from masquerading as a personal character flaw.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Look at your most recent bank notification, swipe it away, and exhale sharply.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "The physical act of swiping dismisses the digital threat, granting an immediate hit of executive control.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Put your credit card in a different pocket or slot inside your wallet.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Forcing a new physical sequence on an everyday object disrupts automatic, anxiety-driven behavioral loops.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Hold your credit card flat in your palm and notice its physical weight.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "A credit card weighs 5 grams. Acknowledging its physical reality shrinks its psychological dominance.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Open your bank app, take one deep breath, and lock your phone screen.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "You commanded your financial portal on your own terms. Walking away builds impenetrable financial boundaries.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I am completely safe in this exact physical moment.'",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Financial panic tricks the brain into feeling hunted. Stating your safety aloud arrests the false adrenaline dump.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Place your hand flat on your desk and say: 'I control my financial tools.'",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Combining physical grounding with a declarative statement shifts your posture from passive victim to active operator.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Look at a physical bill or invoice, fold it exactly in half, and set it down.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Manipulating the physical object asserts dominance over it. You dictate when the bill gets processed.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Tap your bank app icon, immediately press the home button, and smile.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Smiling forcefully while triggering an anxiety source creates cognitive dissonance, destroying the conditioned fear response.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Place a coin on the back of your hand and balance it for ten seconds.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Intense micro-focus on balancing an object overrides background financial anxiety by consuming your working memory.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I do not have to solve everything today.'",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "The freeze response happens because the brain tries solving years of finances at once. Permission to pause unfreezes you.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Open your wallet, organize the cash so all bills face the same way, and close it.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Imposing microscopic order on financial chaos delivers a fast dopamine hit, restoring a sense of mastery.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Hold your credit card, close your eyes, and take two slow, deep breaths.",
    "focusArea": "Focus Area: Financial Clarity",
    "affirmation": "Removing visual input forces your nervous system to rely on steady breathing, divorcing objects from visual panic.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Close your active shopping browser tab right now.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Closing the tab physically severs the digital environment engineered to spike your dopamine and hijack your wallet.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Turn your phone screen to grayscale mode in your settings.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Apps use vibrant color psychology to trigger buying urges. Grayscale kills the visual dopamine trigger instantly.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Place your phone face-down on the table and stand up for 60 seconds.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Physical distance between you and the payment screen breaks the hypnotic motor-loop of instant digital consumption.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Drink a full glass of cold water as fast as comfortably possible.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Cold water triggers the mammalian dive reflex, forcing a physiological reset that kills impulsive urgency.",
    "frictionTags": ["mindless_scrolling", "low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Move the item in your digital cart to a wishlist and exit the app.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Transferring the item tricks your brain into feeling like it secured the reward, bypassing the urge to spend.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I am stepping away from this transaction for 24 hours.'",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Vocalizing a delay is not deprivation. Postponing removes the artificial scarcity and panic created by checkout timers.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Splash cold water on your face and dry it with a towel.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Temperature shocks abruptly pull blood flow away from emotional brain centers, instantly sobering impulsive compulsions.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "private"
  },
  {
    "text": "Delete a shopping app from your home screen. You can reinstall it tomorrow if needed.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Deleting an icon adds friction to your next purchase. That friction derails 80% of impulsive buys.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Stand up, stretch your arms high above your head, and take a deep breath.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Impulse shopping induces a shallow posture. Expanding your body breaks the physiological trance of doom-scrolling.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Turn off your phone entirely for the next two minutes.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "A hard power-down forces a mandatory waiting period. The artificial urgency vanishes with the black screen.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Clench both fists tightly for 10 seconds, then release them completely.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "The urge to buy is trapped kinetic energy. Flexing and releasing purges the physical tension driving the impulse.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Move away from your screen and look out a window for 60 seconds.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Shifting your focal depth from a screen to the horizon recalibrates your nervous system back to reality.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I choose to keep my cash right now.'",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Reframing a non-purchase as an active acquisition of cash flips the dopamine switch from spending to saving.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Remove your finger from the mouse or screen and rest your hands on your lap.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Breaking physical contact with the device prevents muscle-memory from completing a purchase you do not actually want.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Empty your digital shopping cart completely and close the application.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Clicking delete delivers a burst of destructive dopamine, satisfying the brain's craving for action without spending cash.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Walk into a different room and touch a physical wall for ten seconds.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Changing your environmental context snaps you out of the localized trance where the spending impulse originated.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Turn off Wi-Fi on your device for exactly two minutes.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Cutting data access acts as an emergency brake, physically preventing digital retail environments from rendering.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'This purchase is a want, not an emergency.'",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Marketing triggers the fight-or-flight system to create false urgency. Vocalizing the truth defuses the physiological trap.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Place your credit card in a drawer in another room.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Spatial friction is the enemy of impulse. Forcing yourself to stand up and walk kills mindless consumption.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Close your eyes and massage your temples for 30 seconds.",
    "focusArea": "Focus Area: Stop Impulsive Spending",
    "affirmation": "Impulsive shopping is often a coping mechanism. Soothing tension directly removes the need to buy relief.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'My past financial choices are in the past. My baseline is reset.'",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Cognitive absolution prevents the 'What the Hell' effect, stopping a past mistake from justifying a future binge.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Drop your shoulders down two inches and exhale all the air from your lungs.",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Releasing postural defense mechanisms signals to your brain that you are not under attack, ending scarcity panic.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I am an intentional owner of my money.'",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Declarative identity statements override submissive scripts, repositioning you as a commander of capital rather than a victim.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Unclench your jaw and let your tongue drop from the roof of your mouth.",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Craniofacial tension feeds anxiety back into the brain. Relaxing the jaw instantly down-regulates financial stress.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'A single spending slip does not ruin my future.'",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Catastrophic thinking paralyzes action. Vocalizing proportion halts the spiral and restores rational perspective.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Shake your hands out vigorously for ten seconds to release physical tension.",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Mammals shake off excess adrenaline after a threat. This clears the biochemical residue of financial panic.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I forgive myself for any money I have wasted.'",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Holding onto financial shame ensures poor decisions to cope with pain. Forgiveness is a strategic asset.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Cross your arms, give your shoulders a firm squeeze, and take a deep breath.",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Deep pressure stimulation mimics a physical embrace, releasing oxytocin and immediately quelling financial despair.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I am allowed to start fresh right this second.'",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "The brain assumes financial trajectories are locked. Verbally claiming a reset creates a blank slate for executive control.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Roll your neck in a slow circle twice to the left, and twice to the right.",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Clearing cervical spine tension increases blood flow to the brain, optimizing your physiological state before making money choices.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I refuse to panic over money today.'",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Establishing a definitive vocal boundary prevents background economic anxiety from hijacking your daily emotional baseline.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Sit up straight and push your feet firmly into the floor.",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Physical grounding overrides the psychological sensation of free-falling that accompanies debt or scarcity fears.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'Cash sitting in my account brings me peace.'",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Rewiring your dopamine to trigger from retained liquidity rather than spent cash fundamentally alters your spending trajectory.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Open your hands flat on your desk and stare at your palms for ten seconds.",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Open palms are a universal biological signal of non-threat, calming your nervous system into receptive peace.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I control my impulses; my impulses do not control me.'",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Vocalizing authority over your autonomic responses bridges the gap between chaotic urges and conscious behavior.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "private"
  },
  {
    "text": "Gently rub the back of your neck with one hand for 15 seconds.",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Tactile stimulation of the vagus nerve acts as an emergency brake on the fight-or-flight system causing your freeze.",
    "frictionTags": ["task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'Every small dollar saved is a victory.'",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Re-framing microscopic retention as a win prevents the toxic belief that only massive windfalls can save you.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Widen your stance, stand tall, and take one massive breath in.",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Assuming an expansive posture floods your system with confident neuro-markers, overriding the urge to hide from finances.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Say aloud: 'I do not need to buy things to feel worthy.'",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Detaching your self-esteem from material consumption permanently cripples the effectiveness of advertising triggers.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "private"
  },
  {
    "text": "Rest your hand on your chest and feel your heartbeat for 20 seconds.",
    "focusArea": "Focus Area: Rewire Money Habits",
    "affirmation": "Focusing on your biological rhythm proves that regardless of bank balance, your core operating system functions perfectly.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Move one shopping or food delivery app icon off your main home screen.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Creating visual distance stops unconscious muscle-memory taps, instantly plugging a silent leak in your cash flow.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Turn off push notifications for a single retail app on your phone.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Silencing corporate alerts reclaims your attention capital and blocks engineered triggers from invading your day.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Throw away one old, unnecessary physical receipt from your wallet or desk.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Purging financial clutter provides a concrete dopamine win, proving you can execute administrative control effortlessly.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Put any loose coins on your desk into a cup or piggy bank.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Consolidating stray currency signals psychological respect for your capital, no matter how small the denomination.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Search the word 'unsubscribe' in your email and click it on one promotional email.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Closing a digital marketing loop guarantees one less temptation will hit your inbox tomorrow, securing future capital.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Put your credit card back into its exact slot in your wallet.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Restoring physical order to your payment methods creates a micro-win of organizational competence.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Swipe away all active notifications on your phone screen to clear the visual clutter.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "A blank notification shade lowers baseline cognitive stress, making impulsive, anxiety-driven spending less likely.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Unplug a device or charger you are not actively using.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Executing a tiny act of energy conservation reinforces your identity as an efficient, mindful steward of resources.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Close all background apps running on your phone.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Clearing digital cache mimics clearing mental cache. A clean slate generates the momentum needed to face larger tasks.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Place an empty physical folder or envelope on your desk for future receipts.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Pre-emptively building a physical system for your finances eliminates the friction of future organization.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Stack any loose bills or financial papers on your desk into one neat pile.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Squaring the edges of a stack of paper exerts physical dominance over the documents causing you stress.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Turn off the 'Autofill credit card' setting in your mobile browser.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Destroying frictionless checkout forces you to type 16 digits for every purchase, killing late-night convenience spending.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Delete one promotional text message from a brand.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Erasing a marketing hook proves you have the agency to deny access to your attention and your wallet.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Gather all your physical payment cards and stack them neatly in one place.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Physical consolidation of your purchasing power centers your mind and prepares you for intentional allocation.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Switch your phone to 'Do Not Disturb' mode for the next hour.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Creating a sensory fortress shields your working memory from commercial interruptions and social anxiety.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Wipe down your phone screen with a cloth to physically clean your digital workspace.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Physical cleanliness translates directly to mental clarity, wiping away the sluggishness that leads to financial avoidance.",
    "frictionTags": ["low_lethargy", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Find a pen and place it directly next to your physical notepad.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Preparing your environment for action breaks the preliminary freeze state without demanding heavy mental lifting.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "anywhere"
  },
  {
    "text": "Empty your computer's digital trash bin or recycle bin.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Executing a digital purge delivers a clean completion metric, tricking your brain into a state of high productivity.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Unfollow one brand or influencer on social media that triggers you to buy things.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Curating your feed aggressively protects your future net worth by eliminating engineered social envy.",
    "frictionTags": ["mindless_scrolling", "task_paralysis"],
    "environment": "anywhere"
  },
  {
    "text": "Search 'receipt' in your email, select one old digital receipt, and archive it.",
    "focusArea": "Focus Area: Quick Financial Wins",
    "affirmation": "Archiving a single file provides a perfect micro-dose of closure, proving financial administration is not inherently painful.",
    "frictionTags": ["task_paralysis", "mindless_scrolling"],
    "environment": "anywhere"
  },
  {
    "text": "Stand up, plant your feet firmly, and say aloud: 'I have solved difficult problems before, and I will solve this.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Reminding your nervous system of your past resilience instantly overwrites the paralyzing illusion of present helplessness.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Look at your hands and say aloud: 'These hands and this mind possess the capacity to create new value.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Grounding yourself physically reminds your brain that your earning potential is built-in, not dependent on external luck.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Look around the room and say aloud: 'I have shelter, I have air, and my baseline survival is secure.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Financial panic tricks the brain into feeling hunted. Confirming your physical safety aloud turns off primal alarms.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Press your palms together firmly and say: 'My earning capacity is not fixed. I can always pivot.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "The freeze response is driven by the fear of being trapped. Vocalizing your ability to pivot restores flexibility.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Exhale heavily and say aloud: 'I drop the need to fix my entire life today. I only need to handle the next hour.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Overwhelm happens when processing years of finances at once. Shrinking your timeline to 60 minutes makes action possible.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'This current financial stress is temporary data, not a permanent life sentence.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Decoupling your current economic snapshot from your permanent identity stops the spiral of existential doom.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Place a hand on your chest and say: 'My heart is beating, my mind is sharp, and I am ready to adapt.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Acknowledging your biological vitality proves that regardless of your bank balance, your core operating system is strong.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'No amount of debt or stress erases my professional skills or my human worth.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Toxic shame causes financial avoidance. Declaring that your worth is untouchable removes the emotional pain of the numbers.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Squeeze your own shoulder and say: 'I am allowed to make money mistakes without being a failure.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Self-compassion is a strategic asset. Punishing yourself drains the cognitive energy you need to build better solutions.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'I possess the intelligence to learn whatever financial skill I currently lack.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Shifting to 'I am currently learning about money' re-opens the brain's neuroplasticity for growth.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Stand tall and say aloud: 'I refuse to let a piece of plastic or a digital screen dictate my self-respect.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Reclaiming your psychological sovereignty from banks and credit cards puts you back in the ultimate position of authority.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'Wealth is built one tiny decision at a time, and my next decision belongs entirely to me.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "You cannot control the economy, but claiming absolute ownership over your next micro-action eliminates the freeze response.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Look out a window and say: 'The world is full of capital, and I have the tools to capture my share.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Scarcity panic makes the world feel small. Looking at the horizon while declaring abundance physically widens your perspective.",
    "frictionTags": ["mindless_scrolling", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Flex your arms for three seconds and say: 'I am resilient enough to handle whatever the market does next.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Pairing physical tension with a statement of endurance floods your bloodstream with confidence-building neurochemicals.",
    "frictionTags": ["low_lethargy", "task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'I forgive myself for not knowing then what I know now about money.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "You cannot build a prosperous future while holding contempt for your past self. Verbal forgiveness clears the slate.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Place your feet flat on the floor and state: 'Panic is a chemical reaction. It will pass, and my logic will return.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Labeling fear as a mere biological chemical spike strips it of its terrifying narrative power over your decisions.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'I am stepping out of panic and stepping back into executive control right now.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "The brain believes what the voice commands. Authoritative speech overrides the amygdala's chaotic survival signals.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'I have the discipline to start over, rebuild, and secure my own future.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Hope is not passive wishing; hope is the active belief in your own capacity to execute.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  },
  {
    "text": "Touch your forehead and say: 'My mind is my primary asset, and it cannot be depleted.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Cash can be drained, but human capital remains intact. Grounding your security in your intellect guarantees wealth-building power.",
    "frictionTags": ["task_paralysis"],
    "environment": "private"
  },
  {
    "text": "Say aloud: 'Every action I take from this moment forward builds my financial fortress.'",
    "focusArea": "Focus Area: Financial Manifestation",
    "affirmation": "Transforming mundane tasks into the active construction of a fortress injects purpose and dopamine into your routine.",
    "frictionTags": ["task_paralysis", "low_lethargy"],
    "environment": "private"
  }
];

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

/**
 * Universal Task Extractor
 * 
 * @param {('charisma'|'financial_reset'|'financial_freeze_impulse'|'dopamine'|'overwhelm')} deckKey
 * @param {('mindless_scrolling'|'task_paralysis'|'low_lethargy')} friction
 * @param {Object} [filterOptions] - { environment: 'anywhere' | 'private' }
 * @returns {Array<Object>} List of matched micro-tasks
 */
function getTasksByFriction(deckKey, friction, filterOptions = {}) {
  const deck = taskMatrix[deckKey];
  if (!deck || deck.length === 0) return [];

  return deck.filter(task => {
    if (Array.isArray(task.frictionTags)) {
      const matchesFriction = task.frictionTags.includes(friction);
      const matchesEnv = filterOptions.environment
        ? task.environment === filterOptions.environment
        : true;
      return matchesFriction && matchesEnv;
    }
    return true;
  });
}

module.exports = {
  taskMatrix,
  charismaDeck,
  financialResetDeck,
  dopamineDeck,
  overwhelmDeck,
  getTasksByFriction
};
