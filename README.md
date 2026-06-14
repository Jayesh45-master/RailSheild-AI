# 🛡️ RailShield AI

> **A smart, sensor-driven real-time railway safety platform powered by IoT, Edge AI, and Computer Vision.**

![RailShield AI Banner](https://img.shields.io/badge/Status-Live%20Demo-brightgreen?style=for-the-badge)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![EasyEDA](https://img.shields.io/badge/Hardware-EasyEDA-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 🚆 What is RailShield AI?

RailShield AI is an interactive web demonstration of a next-generation railway safety system designed for the **Indian Railway Network**. It showcases how IoT sensors, Edge AI processing, PTZ surveillance cameras, thermal imaging, and real-time alerting can work together to:

- **Detect obstacles and intrusions** on railway tracks before a train arrives
- **Verify threats visually** using live camera snapshots processed by YOLO vision models
- **Alert the right people instantly** — Loco Pilot (cab radio), Station Master (web console), and RPF (mobile dispatch terminals)
- **Protect women passengers** on isolated platforms using handwave gesture recognition and thermal body heat fusion

The website itself is a **scroll-driven interactive journey** from Station A to Station E, where each section demonstrates one core module of the system with live simulations, animated graphics, and real-time socket log terminals.

---

## 🌐 Live Demo

🔗 **[https://railsheild-ai.vercel.app/](https://railsheild-ai.vercel.app/)**

---

## 🎬 Live Walkthrough Video

> Watch the complete project walkthrough — every feature explained with a live demo of the interactive website.

▶️ **[Click here to watch the full walkthrough](https://drive.google.com/file/d/1y4-xKwvLss2DlbTXXQqVnDPw8jI89wK9/view?usp=sharing)**

---

## 📁 Project Structure

```
RailSheild-AI/
│
├── index.html                              ← Main website (all 5 stations)
├── style.css                               ← All styling, animations, layouts
├── app.js                                  ← All interactive logic & simulations
│
├── PCB_RailShield AI.png                   ← PCB layout flat view (2D)
├── 3D_PCB1_RailSheild AI .png              ← 3D rendered view of PCB (isometric)
├── 3D_PCB1_TOP VIEW_RailSheild AI.png      ← 3D top-down view of PCB
├── SCH_Schematic1_1-P1_2026-06-10.png      ← Full circuit schematic diagram
│
├── PCB_RailSheild AI_Graph.zip             ← Gerber files for PCB manufacturing
├── 3D_PCB1_2026-06-10.zip                  ← 3D PCB model export archive
│
└── README.md                               ← This file
```

---

## 📄 File Descriptions

### 🌐 Web Application Files

---

#### `index.html`
The core structure of the entire website. Divided into **5 journey sections** (Stations), each representing a different module of the RailShield AI system:

| Section ID | Station | What it Contains |
|------------|---------|-----------------|
| `#home` | **Station A: Departure Hub** | Hero landing section with a railway signal mast animation, pulse-dot status badge, and scroll-down hint to start the train journey |
| `#iot-pipeline` | **Station B: Transit Monitor** | 5-step IoT alert pipeline — Sensor senses → Camera captures live snapshot → Sirens blare → Station Master notified → RPF dispatch. Includes the Web Admin Dashboard mockup (left) and the RPF Mobile Dispatch phone frame (right) |
| `#sensor-verify` | **Station C: Verification Hub** | Three-stage sensor verification loop — Acoustic graph spike → PTZ camera pivot to capture a live picture → Dispatcher console enables the "ALERT LOCO PILOT & RPF" action button |
| `#women-safety` | **Station D: Platform Security** | Women safety core with Module 01 (Handwave Visual SOS using CSS skeleton vector detection) and Module 02 (FLIR Thermal Camera + CCTV PTZ Sensor Fusion) |
| `#conclusion` | **Station E: Safe Arrival** | Journey conclusion section with an animated shield icon and a call-to-action to restart the demo |

Also contains:
- **Sticky Train Tracker** at the bottom — a fixed railway track bar with a moving train icon that travels left to right as the user scrolls
- **ShieldGuard AI Tour Guide** — a floating chatbot card that walks through all 5 stations automatically with 13 guided steps

---

#### `style.css`
All visual design rules for the entire website. Organized into labelled sections:

| Section | What it Styles |
|---------|---------------|
| `:root` variables | Color palette (signal cyan, amber, red, green), layout constants, transition timing functions |
| Navigation | Fixed glass-blur navigation bar with active link highlighting |
| Hero | Full-viewport hero with gradient text headings and animated railway signal lamp mast |
| Pipeline Steps Bar | Horizontal 5-step selector with active and alert-triggered states |
| Web Admin Dashboard | Desktop window mockup with sidebar, CCTV canvas feed, and socket log terminal panel |
| Mobile Phone Frame | iPhone-style vertical frame with push notification toast, status card, GPS map mockup, and action buttons |
| Station C Verification | Acoustic wave graph monitor, PTZ camera feed with crosshair pivot animation, dispatcher terminal |
| Skeleton Vector | CSS-drawn human skeleton with `handwaveSOSLeft` and `handwaveSOSRight` keyframe swing animations |
| Bounding Box | Nested dashed detection bounding box that aligns accurately over the skeleton figure on trigger |
| FLIR Thermal Panel | Radial gradient heat body simulation with blur and color shift effects on anomaly trigger |
| PTZ Pivot Animation | CSS `transform: translate + scale` transitions for the camera crosshair rotating and locking onto target |
| Sticky Train Tracker | Fixed bottom track bar with dashed rail lines, 5 station marker dots, and moving train icon |
| Tour Guide Card | Floating glass-blur chatbot card with slide-in/out transitions and spotlight highlight overlay |
| Keyframe Animations | `blinkPulse`, `flashAlert`, `bounceUpDown`, `trainVibrate`, `handwaveSOSLeft/Right` |

---

#### `app.js`
All interactive JavaScript logic. Organized into labelled sections:

| Section | What it Does |
|---------|-------------|
| **Train Tracker** | Listens to `window.scroll` and maps scroll percentage (0–100%) to the train's horizontal position (5%–95%) across the bottom tracker. Updates the active station marker and nav link on each event |
| **Web Audio Synthesizer** | Uses the browser `Web Audio API` to generate a real-time dual-tone sawtooth wave siren. Oscillator frequency alternates between 750 Hz and 980 Hz to simulate a live emergency buzzer |
| **IoT Pipeline Simulator** | A 5-step timed cascade (each step fires 1.5 seconds after the previous): Sensor → Camera Snapshot → Sirens → Station Master log → RPF mobile push notification. Updates the Web Admin canvas, socket logs, and phone UI simultaneously |
| **Canvas Track Renderer** | Draws a looping railway track scene on `#simCanvas` using `requestAnimationFrame`. Renders sleepers, rails, a moving train (safe mode), and a red YOLO bounding box vehicle (alert mode) |
| **Socket Log Terminal** | Appends timestamped `log-line` entries to the Web Admin terminal. The `resetPipeline()` function completely clears the terminal HTML to wipe previous logs on reset |
| **Acoustic Graph Plotter** | Draws a running sine wave on `#sensorGraphCanvas`. Wave amplitude and speed spike on anomaly trigger, shifting color from green to red |
| **Verification Loop Engine** | A 3-stage timed simulation: Acoustic spike → PTZ camera pivot (CSS class toggle) → Debris bounding box appears → Dispatcher console enables the Loco Pilot & RPF alert button |
| **Handwave SOS Module** | Toggles `alert-active` class on the CCTV panel to trigger the skeleton arm swing animations and shows the nested bounding box aligned over the skeleton figure |
| **Thermal Fusion Module** | Activates the FLIR thermal glow body color shift and the PTZ camera `pivoted` class to animate the crosshair rotating and locking on coordinates |
| **ShieldGuard Tour Conductor** | A 13-step automated guided tour that scrolls the page, highlights elements with a spotlight class, and triggers simulations programmatically as the user clicks Next |

---

### 🔧 Hardware Design Files

The RailShield AI hardware is a custom PCB called the **Edge Safety Node v1.0**, designed using **EasyEDA**. It is the physical embedded board that would be installed alongside tracks to run all sensor inputs and trigger alerts in the real-world deployment.

---

#### `PCB_RailShield AI.png`
**2D PCB Layout — Flat Copper Layer View**

The standard flat 2D view of the PCB showing all copper traces, component footprints, and board outline. Key components visible:

| Component | Role |
|-----------|------|
| **ESP32-WROVER** | Central microcontroller with built-in Wi-Fi and Bluetooth. Processes all sensor inputs and transmits alert data to the web dashboard |
| **USB Power Input** | Powers the board via USB connector for field deployment |
| **Power Regulator (U5)** | Regulates USB voltage to stable 3.3V supply for ESP32 and all peripherals |
| **Radar Sensor Header (U2)** | 4-pin JST header for connecting the micro-radar / vibration detection module |
| **Thermal Sensor Header (U3)** | 4-pin JST header for connecting the AMG8833 or MLX90614 thermal sensor module |
| **Expansion Port (U4)** | Additional 4-pin header for future sensor or module expansion |
| **Buzzer (BUZZER1)** | Piezoelectric trackside buzzer that fires on threat confirmation |
| **Red Alert LED (LED1)** | Indicates a critical threat or active alert state |
| **Green Alert LED (LED2)** | Indicates system operational / all-clear status |
| **Decoupling Capacitors (C1, C2, C3)** | Filters power supply noise for stable ESP32 operation |
| **Pull-down Resistor (R3)** | Ensures correct boot mode for ESP32 on power-up |

---

#### `3D_PCB1_RailSheild AI .png`
**3D PCB Render — Isometric Perspective View**

A photorealistic isometric 3D render of the Edge Safety Node PCB showing the board from an angled perspective. Clearly shows the physical height and placement of:
- The **ESP32-WROVER** module sitting at the centre of the board
- Three **sensor header connectors** (Radar, Thermal, Expansion) aligned on the left column
- The **USB-C power connector** at the top left
- The **cylindrical buzzer** component at the right side
- **Red and Green LED indicators** in the lower-right quadrant
- The blue PCB substrate with gold copper trace routing visible across the board

---

#### `3D_PCB1_TOP VIEW_RailSheild AI.png`
**3D PCB Render — Top-Down Orthographic View**

A straight top-down orthographic view of the same 3D PCB render. Used for verifying component placement accuracy, spacing between connectors, and overall board footprint dimensions. Gives a clean view of:
- Exact positions of all connector headers relative to the ESP32
- Buzzer clearance from adjacent traces
- LED placement alignment
- USB port positioning at the board edge

---

#### `SCH_Schematic1_1-P1_2026-06-10.png`
**Full Circuit Schematic Diagram — EasyEDA V1.0**

The complete electrical schematic for the RailShield AI Edge Safety Node, drawn in **EasyEDA** on 2026-06-10. Shows all electrical connections between components:

| Net / Connection | Description |
|-----------------|-------------|
| **USB1 → U5 (LDO Regulator)** | USB VBUS input regulated down to 3.3V via LDO IC. Decoupling caps C1 (10µF) and C2 (10µF) on input/output, with C3 (100nF) for high-frequency noise filtering |
| **U5 → U1 (ESP32-WROVER)** | Clean 3.3V rail fed into VDD33 pin of ESP32-WROVER |
| **U2 (HDR1X4) → ESP32 IO pins** | Radar sensor module connected to ESP32 GPIO header for I2C/UART communication |
| **U3 (HDR1X4) → ESP32 IO pins** | Thermal sensor module connected to ESP32 GPIO header for I2C data output |
| **U4 (HDR1X4) → ESP32 IO pins** | Expansion port for additional sensor or actuator modules |
| **R1 (330Ω) → LED1 (Red)** | Current-limiting resistor for Red Alert LED on ESP32 GPIO output |
| **R2 (330Ω) → LED2 (Green)** | Current-limiting resistor for Green Status LED on ESP32 GPIO output |
| **BUZZER1 → ESP32 GPIO** | Piezoelectric buzzer driven directly from ESP32 digital output pin |
| **R3 (10KΩ) → GND** | Pull-down resistor on ESP32 IO0 boot pin to ensure correct programming mode |

---

#### `PCB_RailSheild AI_Graph.zip`
**Gerber Files Archive — PCB Manufacturing Export**

A ZIP archive containing the complete set of **Gerber files** exported from EasyEDA. Gerber files are the industry-standard format used to send a PCB design to a manufacturer (such as JLCPCB or PCBWay) for physical fabrication. Contains layer files for:
- Copper layers (top and bottom)
- Solder mask layers
- Silkscreen (component labels)
- Board outline / edge cuts
- Drill files

---

#### `3D_PCB1_2026-06-10.zip`
**3D PCB Model Export Archive**

A ZIP archive containing the 3D model export of the PCB (typically in `.step` or `.wrl` format). Can be imported into mechanical CAD software (such as Fusion 360 or SolidWorks) for:
- Designing an enclosure or housing around the PCB
- Checking physical clearances inside a junction box
- Creating assembly documentation

---

## 🔑 Key Features

- 🚂 **Scroll-Driven Train Journey** — Train moves in real time as you scroll through 5 stations
- 📡 **IoT Alert Pipeline** — Live 5-step Sensor → Camera → Siren → Station Master → RPF cascade
- 🎵 **Web Audio Synthesizer** — Real synthesized emergency siren using the browser Audio API
- 🖥️ **Dual Interface Mockups** — Side-by-side Web Admin dashboard and RPF Mobile dispatch app
- 📷 **PTZ Camera Pivot Animation** — Camera crosshair rotates and locks onto threats automatically
- 📈 **Live Acoustic Graph** — Real-time sine wave that spikes on sensor trigger
- 🤚 **Handwave Gesture SOS** — CSS skeleton model detects waving arm posture for women's safety
- 🌡️ **Thermal Sensor Fusion** — FLIR camera + CCTV auto-pivot on body heat anomaly
- 🤖 **ShieldGuard AI Tour** — 13-step interactive guided tour through all modules
- 🔇 **Mutable Sirens** — All alarms and chimes can be muted from within the UI
- 🔧 **Custom PCB Hardware** — Edge Safety Node v1.0 PCB designed in EasyEDA with ESP32-WROVER

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **HTML5** | Page structure and semantic layout |
| **CSS3** | Animations, glassmorphism, keyframes, transitions |
| **Vanilla JavaScript** | Simulations, DOM manipulation, scroll tracking |
| **Canvas API** | CCTV feed rendering and acoustic graph plotting |
| **Web Audio API** | Synthesized emergency siren generation |
| **Lucide Icons** | Icon library for UI elements |
| **Google Fonts (Outfit)** | Primary typeface |
| **EasyEDA** | PCB schematic and layout design tool |
| **ESP32-WROVER** | Edge microcontroller for sensor data processing |

---

## 🚀 How to Run Locally

No build tools or dependencies required. Just open the file in your browser:

```bash
# Clone the repository
git clone https://github.com/Jayesh45-master/RailSheild-AI.git

# Navigate into the project
cd RailSheild-AI

# Open in browser
start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux
```

---

## 👤 Author

**Jayesh Chaudhary**
Project Lead — Hardware Design, Frontend Development, AI System Architecture

---

## 📜 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

> *"Not just a concept — a live, interactive demonstration of how Indian Railways can move from reactive incident reporting to proactive real-time threat response."*
