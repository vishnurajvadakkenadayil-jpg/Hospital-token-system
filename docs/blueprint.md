# **App Name**: VSNN TokenFlow

## Core Features:

- Multi-language Interface: Provide a full-screen initial interface for selecting English or Malayalam, with all subsequent UI elements adapting to the chosen language.
- Patient Input (English): Collect patient name, place, and health issue via text typing. Utilize a large on-screen number pad for a 10-digit mobile number input.
- Patient Input (Malayalam with Voice Assist): Collect patient name, place, and health issue in Malayalam using voice input and speech-to-text conversion tool, with options to confirm or re-speak. Use a large on-screen number pad for mobile number.
- Doctor Selection: Display a list of available doctors with specialty, time, and current token status (X/10). Disable selection for fully booked doctors and allow patient choice for available slots.
- Token Generation and Data Storage: Automatically generate a sequential token number for the patient. Store all collected patient details (name, mobile, place, health issue), selected doctor, generated token, and timestamp in a Firebase database.
- Receipt Printing: Send generated token and patient information to a connected printer to produce a physical receipt with VSNN Clinic branding, patient name, doctor name, token number, and date, with the token number prominently displayed.
- Confirmation and Auto-Reset: Display a confirmation screen showing the generated token and instructions to wait. The app automatically resets to the language selection screen after 10 seconds, preparing for the next patient.

## Style Guidelines:

- Color Palette based on a clean and formal hospital aesthetic, predominantly cool tones. Primary color: a vibrant, professional medical blue (#239DCA). Background color: a very light, almost white, desaturated blue (#ECF4F8). Accent color: a deep, rich blue for strong contrast and key information (#154378).
- All text uses 'Inter' (sans-serif), chosen for its high readability, modern, and objective appearance, suitable for both headlines and body text across multiple languages.
- Simple, clean, and easily recognizable hospital-style symbols/icons (e.g., medical cross, microphone) should be used, scaled large enough for clear visibility on a touchscreen.
- A responsive, full-screen layout designed for touchscreens with large, easily tappable buttons. A consistent top banner across all screens displays 'VSNN Clinic' and a simple hospital symbol. Content areas are clean, uncluttered, and centrally aligned, enhancing usability for all patients, including the elderly.
- Subtle and smooth transition animations between screens to create a fluid user experience without being distracting. Introduce gentle loading indicators during voice processing or data submission to provide feedback.