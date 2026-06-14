/* ==========================================================================
   RAILSHIELD AI - INTERACTION ENGINE & PIPELINE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. INITIALIZE LUCIDE ICONS
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    // 2. STICKY TRAIN SCROLL TRACKER (5 STATIONS)
    const journeyTrain = document.getElementById("journey-train");
    const stationMarkers = {
        a: document.getElementById("marker-a"),
        b: document.getElementById("marker-b"),
        c: document.getElementById("marker-c"),
        d: document.getElementById("marker-d"),
        e: document.getElementById("marker-e")
    };
    const navLinks = document.querySelectorAll(".nav-link");

    function updateTrainTracker() {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        
        let scrollPercent = 0;
        if (maxScroll > 0) {
            scrollPercent = scrollY / maxScroll;
        }

        const minPct = 5;
        const maxPct = 95;
        const trainPos = minPct + (scrollPercent * (maxPct - minPct));
        
        if (journeyTrain) {
            journeyTrain.style.left = `${trainPos}%`;
        }

        Object.values(stationMarkers).forEach(m => m.classList.remove("active"));
        
        if (trainPos < 20) {
            stationMarkers.a.classList.add("active");
            updateActiveNavLink("home");
        } else if (trainPos >= 20 && trainPos < 42.5) {
            stationMarkers.b.classList.add("active");
            updateActiveNavLink("iot-pipeline");
        } else if (trainPos >= 42.5 && trainPos < 65) {
            stationMarkers.c.classList.add("active");
            updateActiveNavLink("sensor-verify");
        } else if (trainPos >= 65 && trainPos < 87.5) {
            stationMarkers.d.classList.add("active");
            updateActiveNavLink("women-safety");
        } else {
            stationMarkers.e.classList.add("active");
            updateActiveNavLink("conclusion");
        }
    }

    function updateActiveNavLink(id) {
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${id}`) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", updateTrainTracker);
    window.addEventListener("resize", updateTrainTracker);
    updateTrainTracker();


    // 3. STATION B: IoT PIPELINE ALARM & CANVAS MONITOR SIMULATOR
    const canvas = document.getElementById("simCanvas");
    const ctx = canvas.getContext("2d");
    
    let simState = "safe"; // safe, obstacle
    let audioContext = null;
    let sirenOscillator = null;
    let sirenGainNode = null;
    let alarmInterval = null;
    let audioMuted = true;
    let trainX = -120;
    let trainActive = true;
    let pipelineActive = false;
    let pipelineTimeout = null;

    const webDashboard = document.getElementById("web-dashboard-ui");
    const webStatusBadge = document.getElementById("web-status-badge");
    const webLogs = document.getElementById("web-logs");

    const mobileShowcase = document.getElementById("mobile-app-ui");
    const mobilePushToast = document.getElementById("mobile-push-toast");
    const mobilePushText = document.getElementById("mobile-push-text");
    const mobileAlertCard = document.getElementById("mobile-alert-card");
    const mobileStatusIcon = document.getElementById("mobile-status-icon");
    const mobileStatusTitle = document.getElementById("mobile-status-title");
    const mobileStatusDesc = document.getElementById("mobile-status-desc");
    const mobileMapMarker = document.getElementById("mobile-map-marker");
    const mobileMuteBtn = document.getElementById("mobile-mute-btn");
    const mobileSosBtn = document.getElementById("mobile-sos-btn");

    const pipeSteps = document.querySelectorAll(".pipe-step");
    const btnTriggerPipeline = document.getElementById("btn-trigger-pipeline");
    const btnResetPipeline = document.getElementById("btn-reset-pipeline");

    // Audio Alert Synth
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function startBuzzer() {
        if (audioMuted) return;
        initAudio();
        if (sirenOscillator) return;

        sirenGainNode = audioContext.createGain();
        sirenGainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
        sirenGainNode.connect(audioContext.destination);

        sirenOscillator = audioContext.createOscillator();
        sirenOscillator.type = "sawtooth";
        sirenOscillator.frequency.value = 850;
        sirenOscillator.connect(sirenGainNode);
        sirenOscillator.start();

        let shift = true;
        alarmInterval = setInterval(() => {
            if (sirenOscillator) {
                sirenOscillator.frequency.setValueAtTime(shift ? 980 : 750, audioContext.currentTime);
                shift = !shift;
            }
        }, 300);
    }

    function stopBuzzer() {
        if (alarmInterval) {
            clearInterval(alarmInterval);
            alarmInterval = null;
        }
        if (sirenOscillator) {
            try { sirenOscillator.stop(); } catch(e){}
            sirenOscillator.disconnect();
            sirenOscillator = null;
        }
        if (sirenGainNode) {
            sirenGainNode.disconnect();
            sirenGainNode = null;
        }
    }

    function addLogLine(message, type = "info") {
        const time = new Date().toLocaleTimeString();
        const line = document.createElement("div");
        line.className = `log-line ${type}`;
        line.innerHTML = `<span>[${time}]</span> ${message}`;
        webLogs.appendChild(line);
        webLogs.scrollTop = webLogs.scrollHeight;
    }

    // Canvas background render loop
    function drawTrackSim() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dark background
        ctx.fillStyle = "#030408";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Sky lines
        ctx.fillStyle = "#111625";
        ctx.fillRect(0, 140, canvas.width, canvas.height - 140);

        // Sleepers
        ctx.fillStyle = "#1b1f2b";
        for (let i = 15; i < canvas.width; i += 30) {
            ctx.fillRect(i, 175, 12, 4);
        }

        // Rails
        ctx.strokeStyle = "#323c52";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 170); ctx.lineTo(canvas.width, 170);
        ctx.moveTo(0, 178); ctx.lineTo(canvas.width, 178);
        ctx.stroke();

        // Anomaly / Obstacle Drawing
        if (simState === "obstacle") {
            const obsX = 240;
            const obsY = 160;

            // Draw YOLO bounding box
            ctx.strokeStyle = "hsl(0, 95%, 55%)";
            ctx.lineWidth = 2;
            ctx.strokeRect(obsX - 22, obsY - 8, 44, 26);

            ctx.fillStyle = "hsl(0, 95%, 55%)";
            ctx.font = "bold 8px monospace";
            ctx.fillText("Obstacle: 98%", obsX - 22, obsY - 12);

            // Car silhouette
            ctx.fillStyle = "#c0392b";
            ctx.fillRect(obsX - 18, obsY + 4, 36, 10);
            ctx.fillRect(obsX - 10, obsY - 4, 20, 9);
            ctx.fillStyle = "#111";
            ctx.beginPath();
            ctx.arc(obsX - 10, obsY + 14, 4, 0, Math.PI*2);
            ctx.arc(obsX + 10, obsY + 14, 4, 0, Math.PI*2);
            ctx.fill();
        } else {
            // Draw a train passing when safe
            if (trainActive) {
                ctx.fillStyle = "hsl(182, 100%, 46%)";
                ctx.fillRect(trainX, 150, 100, 18);
                ctx.fillStyle = "#f39c12";
                ctx.beginPath();
                ctx.arc(trainX + 100, 158, 4, 0, Math.PI*2);
                ctx.fill();

                trainX += 3;
                if (trainX > canvas.width + 100) {
                    trainActive = false;
                }
            }
        }

        // Scan reticle overlay
        ctx.strokeStyle = "rgba(182, 100, 46, 0.1)";
        if (simState === "obstacle") ctx.strokeStyle = "rgba(231, 76, 60, 0.25)";
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

        requestAnimationFrame(drawTrackSim);
    }

    drawTrackSim();

    // Reset Pipeline function
    function resetPipeline() {
        pipelineActive = false;
        if (pipelineTimeout) clearTimeout(pipelineTimeout);
        stopBuzzer();

        simState = "safe";
        trainX = -120;
        trainActive = true;

        // Reset step classes
        pipeSteps.forEach(s => s.className = "pipe-step");
        pipeSteps[0].classList.add("active");

        // Web Dashboard Reset
        webDashboard.classList.remove("alert-mode");
        webStatusBadge.textContent = "SECURE";
        webStatusBadge.className = "window-status";
        
        webLogs.innerHTML = '<div class="log-line text-muted">[System Standby] Monitoring vibration nodes...</div>';
        
        // Mobile UI Reset
        mobileShowcase.classList.remove("alert-mode");
        mobilePushToast.classList.remove("show");
        
        mobileAlertCard.className = "mobile-card alert-status-card safe";
        mobileStatusIcon.className = "lucide lucide-check-circle";
        if (typeof lucide !== "undefined") {
            mobileStatusIcon.setAttribute("data-lucide", "check-circle");
        }
        mobileStatusTitle.textContent = "Sector 104 nominal";
        mobileStatusDesc.textContent = "All sensors recording nominal frequencies.";
        mobileMapMarker.style.backgroundColor = "var(--signal-green)";
        mobileMapMarker.style.boxShadow = "0 0 10px var(--signal-green-glow)";
        
        if (typeof lucide !== "undefined") lucide.createIcons();
    }

    // Step-by-Step Alert Sequence Trigger (BUG FIX: Sensor senses first, then camera snapshot verification, then RPF/SM alert)
    function triggerAlertSequence() {
        if (pipelineActive) return;
        pipelineActive = true;
        resetPipeline();
        pipelineActive = true;

        // STEP 1: Sensor Senses (0s)
        pipeSteps.forEach(s => s.classList.remove("active"));
        pipeSteps[0].classList.add("active", "triggered-alert");
        
        simState = "obstacle";
        webLogs.innerHTML = '';
        addLogLine("SENSOR: Micro-radar & vibration nodes trigger alert in Sector 104.", "warn");
        
        mobileAlertCard.className = "mobile-card alert-status-card warning";
        mobileStatusTitle.textContent = "Vibration Alert";
        mobileStatusDesc.textContent = "Sensing track displacement...";
        mobileMapMarker.style.backgroundColor = "var(--signal-amber)";
        mobileMapMarker.style.boxShadow = "0 0 10px var(--signal-amber-glow)";

        // STEP 2: Camera Live Image (1.5s)
        pipelineTimeout = setTimeout(() => {
            pipeSteps.forEach(s => s.classList.remove("active"));
            pipeSteps[1].classList.add("active", "triggered-alert");
            
            addLogLine("CAMERA: Capturing live picture snapshot. YOLO vision analysis...", "warn");
            addLogLine("EDGE AI: Object verified -> Vehicle blockage (Confidence 98.7%)", "warn");
            
            webDashboard.classList.add("alert-mode");
            webStatusBadge.textContent = "CRITICAL";
            webStatusBadge.className = "window-status red-glow";
            
            // STEP 3: Sirens & Local Buzzer (3s)
            pipelineTimeout = setTimeout(() => {
                pipeSteps.forEach(s => s.classList.remove("active"));
                pipeSteps[2].classList.add("active", "triggered-alert");
                
                addLogLine("SIRENS: Trackside warning speaker blaring. Signal lights warning flashing.", "danger");
                if (!audioMuted) startBuzzer();
                
                // STEP 4: Station Master Notification (4.5s)
                pipelineTimeout = setTimeout(() => {
                    pipeSteps.forEach(s => s.classList.remove("active"));
                    pipeSteps[3].classList.add("active", "triggered-alert");
                    
                    addLogLine("STATION MASTER: Firing telemetry and visual snapshot to Station Master desk.", "danger");
                    addLogLine("LOCO SIGNAL: Direct radio alert transmitted to Loco Pilot cab speaker.", "danger");
                    
                    // STEP 5: RPF Dispatch Alert (6s)
                    pipelineTimeout = setTimeout(() => {
                        pipeSteps.forEach(s => s.classList.remove("active"));
                        pipeSteps[4].classList.add("active", "triggered-alert");
                        
                        addLogLine("RPF DISPATCH: Intrusion details routed to RPF Mobile terminals.", "danger");
                        mobilePushToast.classList.add("show");
                        mobilePushText.textContent = "RPF CRITICAL: Obstacle confirmed in Sector 104. Loco Pilot alerted.";
                        
                        mobileShowcase.classList.add("alert-mode");
                        mobileAlertCard.className = "mobile-card alert-status-card critical";
                        mobileStatusIcon.className = "lucide lucide-alert-triangle";
                        if (typeof lucide !== "undefined") {
                            mobileStatusIcon.setAttribute("data-lucide", "alert-triangle");
                        }
                        mobileStatusTitle.textContent = "CRITICAL: RPF DISPATCHED";
                        mobileStatusDesc.textContent = "Sirens active. Loco Pilot warning broadcast in progress.";
                        
                        if (typeof lucide !== "undefined") lucide.createIcons();
                    }, 1500);
                }, 1500);
            }, 1500);
        }, 1500);
    }

    mobileMuteBtn.addEventListener("click", () => {
        audioMuted = !audioMuted;
        if (audioMuted) {
            mobileMuteBtn.innerHTML = '<i data-lucide="volume-x"></i> Mute Siren';
            stopBuzzer();
        } else {
            mobileMuteBtn.innerHTML = '<i data-lucide="volume-2"></i> Unmute Siren';
            if (simState !== "safe" && pipelineActive) {
                startBuzzer();
            }
        }
        if (typeof lucide !== "undefined") lucide.createIcons();
    });

    mobileSosBtn.addEventListener("click", () => {
        addLogLine("RPF: Immediate security dispatch response confirmed.", "info");
        alert("RPF squad coordinates updated. dispatch response sent.");
    });

    btnTriggerPipeline.addEventListener("click", triggerAlertSequence);
    btnResetPipeline.addEventListener("click", () => resetPipeline());


    // ==========================================================================
    // 4. STATION C: SENSOR DETECTION & VERIFICATION LOOP ENGINE
    // ==========================================================================
    const graphCanvas = document.getElementById("sensorGraphCanvas");
    const graphCtx = graphCanvas.getContext("2d");
    
    const verifThreatBox = document.getElementById("verif-threat-box");
    const verifCrosshair = document.getElementById("verif-cctv-crosshair");
    
    const verifDispatchBanner = document.getElementById("verif-dispatch-banner");
    const verifTerminalTxt = document.getElementById("verif-terminal-txt");
    const btnExecuteBrake = document.getElementById("btn-execute-brake");
    const btnRunVerify = document.getElementById("btn-run-verify");
    const btnResetVerify = document.getElementById("btn-reset-verify");
    
    const vCard1 = document.getElementById("v-step-card-1");
    const vCard2 = document.getElementById("v-step-card-2");
    const vCard3 = document.getElementById("v-step-card-3");

    let graphX = 0;
    let waveAmplitude = 10;
    let waveFrequency = 0.05;
    let waveSpeed = 2;
    let graphColor = "var(--signal-green)";
    let verifyLoopActive = false;
    let verifTimeout = null;

    // Draw Acoustic Vibration Graph
    function drawAcousticWave() {
        graphCtx.fillStyle = "rgba(2, 2, 4, 0.25)";
        graphCtx.fillRect(0, 0, graphCanvas.width, graphCanvas.height);
        
        graphCtx.strokeStyle = graphColor;
        graphCtx.lineWidth = 1.5;
        graphCtx.beginPath();
        
        for (let x = 0; x < graphCanvas.width; x++) {
            const y = (graphCanvas.height / 2) + Math.sin((x + graphX) * waveFrequency) * waveAmplitude;
            if (x === 0) {
                graphCtx.moveTo(x, y);
            } else {
                graphCtx.lineTo(x, y);
            }
        }
        graphCtx.stroke();
        
        graphX += waveSpeed;
        requestAnimationFrame(drawAcousticWave);
    }
    drawAcousticWave();

    function resetVerificationLoop() {
        verifyLoopActive = false;
        if (verifTimeout) clearTimeout(verifTimeout);
        stopBuzzer();

        // Reset Graph parameters
        waveAmplitude = 10;
        waveSpeed = 2;
        graphColor = "var(--signal-green)";
        document.getElementById("sensor-readout-val").textContent = "Vibrations: Nominal (12 Hz)";
        
        // Reset card statuses
        vCard1.className = "verif-step-card";
        vCard2.className = "verif-step-card";
        vCard3.className = "verif-step-card";
        
        // Reset CCTV Visual elements
        verifThreatBox.classList.remove("active");
        verifCrosshair.classList.remove("pivoted");
        
        // Reset console terminal
        document.getElementById("verification-display-container").classList.remove("alert-active");
        verifDispatchBanner.textContent = "SYSTEM MONITOR SECURE";
        verifDispatchBanner.className = "terminal-banner";
        verifTerminalTxt.textContent = "Awaiting sensor trigger...";
        
        // Reset button states
        btnExecuteBrake.disabled = true;
        btnResetVerify.disabled = true;
        btnRunVerify.disabled = false;
    }

    function triggerVerificationLoop() {
        if (verifyLoopActive) return;
        verifyLoopActive = true;
        resetVerificationLoop();
        verifyLoopActive = true;

        btnRunVerify.disabled = true;

        // STEP 1: Sensor Senses (0s)
        vCard1.classList.add("active");
        waveAmplitude = 45; // Spike vibration graph
        waveSpeed = 6;
        graphColor = "var(--signal-red)";
        document.getElementById("sensor-readout-val").textContent = "Vibrations: CRITICAL ANOMALY (148 Hz)";
        
        verifTerminalTxt.textContent = "Acoustic anomaly detected. Transmitting coordinates to PTZ camera...";
        document.getElementById("verification-display-container").classList.add("alert-active");
        
        verifDispatchBanner.textContent = "WARNING: UNVERIFIED ANOMALY";
        verifDispatchBanner.className = "terminal-banner red-glow";

        // STEP 2: Camera Verification (2s)
        verifTimeout = setTimeout(() => {
            vCard1.classList.remove("active");
            vCard2.classList.add("active");
            
            verifCrosshair.classList.add("pivoted"); // Rotates PTZ camera view
            verifTerminalTxt.textContent = "Camera locking... Snapping live picture snapshot...";

            verifTimeout = setTimeout(() => {
                verifThreatBox.classList.add("active"); // Debris bounding box fades in
                verifTerminalTxt.textContent = "YOLO vision processed. confirmed debris blockage on tracks.";
                
                // STEP 3: Dispatcher override (4s)
                verifTimeout = setTimeout(() => {
                    vCard2.classList.remove("active");
                    vCard3.classList.add("active");
                    
                    if (!audioMuted) startBuzzer();
                    verifDispatchBanner.textContent = "CRITICAL: OVERRIDE REQUIRED";
                    verifTerminalTxt.textContent = "Debris verified. Alert Loco Pilot & RPF immediately.";
                    btnExecuteBrake.disabled = false;
                    btnResetVerify.disabled = false;
                }, 2000);
            }, 1000);
        }, 2000);
    }

    // dispatcher sirens & pilot alert action
    btnExecuteBrake.addEventListener("click", () => {
        stopBuzzer();
        btnExecuteBrake.disabled = true;
        vCard3.classList.remove("active");
        
        // Update Terminal State to success
        verifDispatchBanner.textContent = "ALERTS SENT - LOCO PILOT & RPF NOTIFIED";
        verifDispatchBanner.className = "terminal-banner";
        verifTerminalTxt.textContent = "Loco Pilot warned via direct cab radio. Sirens activated. RPF squad deployed.";
        
        // Play success chime
        initAudio();
        if (audioContext && !audioMuted) {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            gain.gain.setValueAtTime(0.15, audioContext.currentTime);
            osc.frequency.setValueAtTime(440, audioContext.currentTime); // A4
            osc.frequency.setValueAtTime(554.37, audioContext.currentTime + 0.15); // C#5
            osc.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.3); // E5
            osc.start();
            osc.stop(audioContext.currentTime + 0.5);
        }
    });

    btnRunVerify.addEventListener("click", triggerVerificationLoop);
    btnResetVerify.addEventListener("click", resetVerificationLoop);


    // ==========================================================================
    // 5. STATION D: WOMEN PLATFORM SAFETY
    // ==========================================================================
    const btnSimHandwave = document.getElementById("btn-sim-handwave");
    const handwaveVisualPanel = document.getElementById("handwave-visual-panel");
    const skeletonArms = [
        document.querySelector(".sk-left-arm"),
        document.querySelector(".sk-right-arm")
    ];

    btnSimHandwave.addEventListener("click", () => {
        handwaveVisualPanel.classList.add("alert-active");
        skeletonArms.forEach(arm => arm.classList.add("active"));
        
        initAudio();
        if (audioContext && !audioMuted) {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            gain.gain.setValueAtTime(0.2, audioContext.currentTime);
            osc.frequency.setValueAtTime(523.25, audioContext.currentTime);
            osc.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.15);
            osc.start();
            osc.stop(audioContext.currentTime + 0.35);
        }

        setTimeout(() => {
            alert("Visual SOS Gesture Confirmed. Station sirens fired. RPF dispatch triggered. Platform announcer warning broadcasting.");
            
            setTimeout(() => {
                handwaveVisualPanel.classList.remove("alert-active");
                skeletonArms.forEach(arm => arm.classList.remove("active"));
            }, 6000);
        }, 1500);
    });

    const btnSimThermal = document.getElementById("btn-sim-thermal");
    const thermalGlowFig = document.getElementById("thermal-glow-fig");
    const thermalTempBadge = document.getElementById("thermal-temp-badge");
    const cctvPivotTarget = document.getElementById("cctv-pivot-target");
    const cctvStatusTag = document.getElementById("cctv-status-tag");

    btnSimThermal.addEventListener("click", () => {
        thermalTempBadge.textContent = "39.8°C (Elevated)";
        thermalTempBadge.classList.add("alert-active");
        thermalGlowFig.classList.add("alert-active");

        cctvPivotTarget.classList.add("pivoted");
        cctvStatusTag.textContent = "CCTV VIEW [LOCKED - HEAT SOURCE DETECTED]";
        cctvStatusTag.style.color = "var(--signal-red)";

        setTimeout(() => {
            alert("Thermal anomaly triggered optical camera pivot. Face detection skeleton activated. Live picture routed to Station Master desk.");
            
            setTimeout(() => {
                thermalTempBadge.textContent = "36.5°C";
                thermalTempBadge.classList.remove("alert-active");
                thermalGlowFig.classList.remove("alert-active");
                cctvPivotTarget.classList.remove("pivoted");
                cctvStatusTag.textContent = "CCTV NORMAL VIEW [OFF-TARGET]";
                cctvStatusTag.style.color = "";
            }, 6000);
        }, 2000);
    });


    // ==========================================================================
    // 6. INTERACTIVE GUIDED TOUR (CONDUCTOR ASSISTANT)
    // ==========================================================================
    const tourGuide = document.getElementById("tour-guide");
    const closeTour = document.getElementById("close-tour");
    const prevTourBtn = document.getElementById("prev-tour-btn");
    const nextTourBtn = document.getElementById("next-tour-btn");
    const tourText = document.getElementById("tour-text");
    const tourStep = document.getElementById("tour-step");
    const tourOverlay = document.getElementById("tour-overlay");

    const navTourBtn = document.getElementById("nav-tour-btn");
    const heroTourBtn = document.getElementById("hero-tour-btn");

    let tourCurrentStep = 0;

    const tourSteps = [
        {
            target: null,
            text: "Welcome aboard the RailShield Journey Conductor! I am ShieldGuard. We will travel from Station A to Station E to explore our trackside safety systems. Click Next to depart!",
            action: null
        },
        {
            target: "#home",
            text: "This is Station A: Departure Hub. The green signal mast indicates our line is clear to travel. Scroll down to advance our train tracker at the bottom of the viewport!",
            action: null
        },
        {
            target: "#iot-pipeline",
            text: "We have reached Station B: Transit Monitor! Let's examine how track alerts transmit from sensor to desktop dashboard and dispatcher mobile devices.",
            action: null
        },
        {
            target: "#pipeline-steps-container",
            text: "Let's trigger the IoT alert sequence. Watch how the vibration sensor detects an anomaly first, the camera captures a live picture to verify, trackside sirens blare, and alerts dispatch directly to the Station Master and RPF!",
            action: () => {
                triggerAlertSequence();
            }
        },
        {
            target: "#web-dashboard-ui",
            text: "In the Web Admin Dashboard, you can see live CCTV overlays, sirens warning banner, and running terminal logs. Notice the logs completely wipe clean when reset is clicked!",
            action: null
        },
        {
            target: "#mobile-app-ui",
            text: "Simultaneously, the RPF Mobile app triggers a push notification toast, flashes critical status, and centers coordinates on the tracking map.",
            action: null
        },
        {
            target: "#sensor-verify",
            text: "Welcome to Station C: Verification Hub! This is our sensor-to-action confirmation loop. Let's run a simulation.",
            action: () => {
                resetPipeline();
            }
        },
        {
            target: "#verification-display-container",
            text: "I will now trigger a track debris simulation. Watch the acoustic vibration graph spike violently, and see the camera pivot to capture a live picture of the rockslide!",
            action: () => {
                triggerVerificationLoop();
            }
        },
        {
            target: "#btn-execute-brake",
            text: "With the blockage confirmed visually, the dispatcher console lights up. Let's trigger the 'ALERT LOCO PILOT & RPF' button from the web dashboard!",
            action: () => {
                setTimeout(() => btnExecuteBrake.click(), 1500);
            }
        },
        {
            target: "#women-safety",
            text: "Next is Station D: Platform Security. We protect female commuters at night using specialized AI models. Let's check them out.",
            action: () => {
                resetVerificationLoop();
            }
        },
        {
            target: "#handwave-visual-panel",
            text: "If a woman passenger waves her hands overhead, visual skeleton models recognize the pattern, lock a dashed bounding box over her skeleton, and fire station alarms!",
            action: () => {
                btnSimHandwave.click();
            }
        },
        {
            target: "#thermal-screen",
            text: "In Module 02, FLIR thermal cameras check stress heat spikes. An anomaly automatically commands the optical PTZ camera to rotate, pivot, and lock onto the target, sending live pictures to the Station Master desk.",
            action: () => {
                btnSimThermal.click();
            }
        },
        {
            target: "#conclusion",
            text: "We have arrived at Station E: Safe Arrival! That concludes our journey. You can repeat this walkthrough or trigger the panels manually. Have a safe trip!",
            action: null
        }
    ];

    function startTour() {
        tourActive = true;
        tourCurrentStep = 0;
        tourGuide.classList.add("tour-active");
        tourOverlay.classList.add("tour-overlay-active");
        updateTourStep();
    }

    function endTour() {
        tourActive = false;
        tourGuide.classList.remove("tour-active");
        tourOverlay.classList.remove("tour-overlay-active");
        stopBuzzer();
        resetPipeline();
        resetVerificationLoop();
        
        document.querySelectorAll(".spotlight-element").forEach(el => {
            el.classList.remove("spotlight-element");
        });
    }

    function updateTourStep() {
        const step = tourSteps[tourCurrentStep];
        tourText.textContent = step.text;
        tourStep.textContent = `Step ${tourCurrentStep + 1}/${tourSteps.length}`;
        tourGuide.classList.add("tour-highlighted");
        setTimeout(() => tourGuide.classList.remove("tour-highlighted"), 300);

        prevTourBtn.disabled = tourCurrentStep === 0;
        if (tourCurrentStep === tourSteps.length - 1) {
            nextTourBtn.textContent = "Finish";
        } else {
            nextTourBtn.textContent = tourCurrentStep === 0 ? "Start" : "Next";
        }

        document.querySelectorAll(".spotlight-element").forEach(el => {
            el.classList.remove("spotlight-element");
        });

        if (step.target) {
            const element = document.querySelector(step.target);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
                element.classList.add("spotlight-element");
            }
        }

        if (step.action) {
            step.action();
        }
    }

    nextTourBtn.addEventListener("click", () => {
        if (tourCurrentStep < tourSteps.length - 1) {
            tourCurrentStep++;
            updateTourStep();
        } else {
            endTour();
        }
    });

    prevTourBtn.addEventListener("click", () => {
        if (tourCurrentStep > 0) {
            tourCurrentStep--;
            updateTourStep();
        }
    });

    closeTour.addEventListener("click", endTour);
    navTourBtn.addEventListener("click", startTour);
    heroTourBtn.addEventListener("click", startTour);
});
