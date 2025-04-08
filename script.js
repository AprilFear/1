// script.js for $CGPTS - Glitchy Edition

// ======================== //
// Helper Functions         //
// ======================== //
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

// ======================== //
// Countdown Timer Function //
// ======================== //
function startCountdown() {
    console.log("Initializing countdown..."); 
    const countdownElement = document.getElementById('countdown-timer');
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');
    const countdownMessageEl = document.getElementById('countdown-message');

    let fireworksLaunched = false; // Flag to prevent multiple launches

    // Ensure all elements exist before proceeding
    if (!countdownElement || !daysEl || !hoursEl || !minutesEl || !secondsEl || !countdownMessageEl) {
        console.error("One or more countdown elements not found!");
        if(countdownMessageEl) { 
             countdownMessageEl.innerHTML = "Countdown Error: Elements missing.";
             countdownMessageEl.style.display = 'block';
        }
        return; 
    }

    // --- SET YOUR TARGET DATE AND TIME HERE ---
    // Target: April 8, 2025 18:00:00 Israel Daylight Time (UTC+3)
    const targetDateString = "2025-04-08T18:00:00+03:00"; // ISO 8601 format
    // ------------------------------------

    const targetTime = new Date(targetDateString).getTime();

    if (isNaN(targetTime)) {
         console.error("Invalid target date string for countdown:", targetDateString);
         countdownMessageEl.innerHTML = "Countdown target date is invalid!";
         countdownMessageEl.style.display = 'block';
         countdownElement.style.display = 'none'; 
         return;
    }
     console.log(`Countdown target set to: ${new Date(targetTime).toLocaleString('en-IL', { timeZone: 'Asia/Jerusalem' })}`); 

    const updateTimer = () => {
        const now = new Date().getTime();
        const distance = targetTime - now;

        // If the countdown is finished
        if (distance < 0) {
            clearInterval(intervalId); 
            daysEl.innerHTML = '00';
            hoursEl.innerHTML = '00';
            minutesEl.innerHTML = '00';
            secondsEl.innerHTML = '00';
            countdownElement.classList.add('finished');
            countdownElement.classList.remove('hide-days'); 
            countdownMessageEl.style.display = 'block'; 
            countdownMessageEl.classList.add('visible'); 
            console.log("Countdown finished!"); 

            // Launch fireworks ONLY ONCE
            if (!fireworksLaunched) { 
                if (typeof confetti === 'function') {
                    launchFireworks(); // Call fireworks function (defined below)
                } else {
                     console.warn("Confetti library not loaded, cannot launch fireworks.");
                }
                fireworksLaunched = true; 
            }
            return; 
        }

        // Calculate time
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const format = (num) => (num < 10 ? '0' + num : num);

        // Update HTML
        daysEl.innerHTML = format(days);
        hoursEl.innerHTML = format(hours);
        minutesEl.innerHTML = format(minutes);
        secondsEl.innerHTML = format(seconds);

         // Hide days if less than 1 day left and timer not finished
         if (days <= 0 && distance > 0) {
             countdownElement.classList.add('hide-days');
         } else if (days > 0) { // Ensure days are shown if they exist
             countdownElement.classList.remove('hide-days');
         }
    };

    const intervalId = setInterval(updateTimer, 1000);
    updateTimer(); // Initial call
}

// ======================== //
// Fireworks Function     //
// ======================== //
function launchFireworks() {
    console.log("Launching fireworks!"); // Debug log

    if (typeof confetti !== 'function') {
        console.warn("Confetti function not found. Cannot launch fireworks.");
        return;
    }

    const duration = 5 * 1000; // Fireworks duration (5 seconds)
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 70, zIndex: 2001 }; // Ensure zIndex is high

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval); // Stop after duration
        }

        const particleCount = 50 * (timeLeft / duration); // Decreasing particles

        // Launch bursts from random points near the bottom
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
        }));
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
        }));
    }, 250); // Launch every 250ms
}


// ======================== //
// Shepherd Tour Function   //
// ======================== //
function startWebsiteTour() {
    console.log("Attempting to start website tour..."); // Debug log 1
    if (typeof Shepherd === 'undefined') {
        console.error('Shepherd.js library not loaded.');
        alert('Could not start the tour. Please try refreshing the page.');
        return;
    }
    console.log("Shepherd object found:", Shepherd); // Debug log 2

    if (Shepherd.activeTour) {
        console.log("Tour is already active, exiting.");
        return; // Don't start if already active
    }

    try {
        const tour = new Shepherd.Tour({
            useModalOverlay: true,
            defaultStepOptions: {
                classes: 'shepherd-theme-arrows shepherd-custom-theme',
                scrollTo: { behavior: 'smooth', block: 'center' }
            }
        });
        console.log("Shepherd tour initialized"); // Debug log 3

        // Define Tour Steps
        tour.addStep({
            id: 'step-logo',
            text: 'This is our logo and name! Click it anytime to return to the top.',
            attachTo: { element: '.logo-link', on: 'bottom' },
            buttons: [ { text: 'Next', action: tour.next } ]
        });
        console.log("Added step: step-logo");

         // Conditionally add nav step for desktop
         const navLinksElement = document.querySelector('header nav ul.nav-links'); // Re-check element here
         if (navLinksElement && window.getComputedStyle(navLinksElement).display !== 'none') {
             tour.addStep({
                 id: 'step-nav',
                 text: 'Use the navigation bar to jump to different sections like About, Tokenomics, How to Buy, and our Roadmap.',
                 attachTo: { element: 'header nav ul.nav-links', on: 'bottom' },
                 buttons: [
                      { text: 'Back', secondary: true, action: tour.back },
                      { text: 'Next', action: tour.next }
                 ]
             });
             console.log("Added step: step-nav (Desktop)");
         } else {
              console.log("Skipped step: step-nav (Mobile or element not found)");
         }


         tour.addStep({
            id: 'step-how-to-buy',
            text: 'Want to get some $CGPTS? This section explains exactly how to buy.',
            attachTo: { element: '#how-to-buy h2', on: 'bottom' },
             buttons: [
                 { text: 'Back', secondary: true, action: tour.back },
                 { text: 'Next', action: tour.next }
            ]
        });
        console.log("Added step: step-how-to-buy");

        // Check if chart container exists before adding step
        const chartContainer = document.querySelector('#live-chart .chart-container');
        if (chartContainer) {
             tour.addStep({
                id: 'step-chart',
                text: "Here you can see the live price chart (once it's available).",
                attachTo: { element: '#live-chart .chart-container', on: 'bottom' },
                 buttons: [
                     { text: 'Back', secondary: true, action: tour.back },
                     { text: 'Next', action: tour.next }
                ]
            });
            console.log("Added step: step-chart");
        } else {
            console.log("Skipped step: step-chart (container not found)");
        }

        // Check if swap terminal container exists before adding step
         const swapContainer = document.querySelector('#swap-terminal #integrated-terminal'); // Target inner div
         if (swapContainer) {
             tour.addStep({
                id: 'step-swap',
                text: "Use this terminal to swap SOL for $CGPTS directly on the site!",
                attachTo: { element: '#swap-terminal #integrated-terminal', on: 'top' }, // Attach to the terminal div itself
                 buttons: [
                     { text: 'Back', secondary: true, action: tour.back },
                     { text: 'Next', action: tour.next }
                ]
            });
            console.log("Added step: step-swap");
        } else {
             console.log("Skipped step: step-swap (container not found)");
        }

        tour.addStep({
            id: 'step-socials',
            text: "Don't forget to join our community on Twitter (X) and Telegram!",
            attachTo: { element: '#socials .social-links', on: 'top' },
             buttons: [
                 { text: 'Back', secondary: true, action: tour.back },
                 { text: 'End!', action: tour.complete }
            ]
        });
        console.log("Added step: step-socials");

        // Handle tour completion or cancellation
        tour.on('complete', () => console.log("Tour completed!"));
        tour.on('cancel', () => console.log("Tour cancelled!"));

        tour.start();
        console.log("Shepherd tour started successfully"); // Debug log after start

    } catch (error) {
         console.error("Error initializing or running Shepherd tour:", error);
         // Optionally provide user feedback if tour fails to start
         // alert("Sorry, the site tour couldn't start right now.");
    }
}


// ======================== //
// Main Execution           //
// ======================== //
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Fully Loaded");

    // --- Initialize Components ---
    startCountdown(); // Start the countdown timer

    // --- Mobile Navigation (Burger Menu) ---
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links'); // The UL element
    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
            const isExpanded = burgerMenu.getAttribute('aria-expanded') === 'true';
            burgerMenu.setAttribute('aria-expanded', !isExpanded);
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 900 && navLinks.classList.contains('active')) {
                    burgerMenu.classList.remove('active');
                    navLinks.classList.remove('active');
                    burgerMenu.setAttribute('aria-expanded', 'false');
                }
            });
        });
        document.addEventListener('click', (event) => {
             if (!navLinks.contains(event.target) && !burgerMenu.contains(event.target) && navLinks.classList.contains('active')) {
                 burgerMenu.classList.remove('active');
                 navLinks.classList.remove('active');
                 burgerMenu.setAttribute('aria-expanded', 'false');
             }
          });
    } else { console.error("Burger menu or nav links element not found!"); }

    // --- Copy Contract Address ---
    const copyButtons = document.querySelectorAll('.copy-ca-button');
    copyButtons.forEach(button => {
        const initialAddress = button.getAttribute('data-address');
        const placeholderTexts = [
            '[TBA - To Be Announced at Launch]',
            '[PASTE CONTRACT ADDRESS HERE WHEN AVAILABLE - Triple check this!]',
            '[TBA SOON!]',
            '[CONTRACT ADDRESS DROP SOON!]'
         ];

        // Set initial state based on placeholder text
        if (!initialAddress || placeholderTexts.includes(initialAddress)) {
             button.textContent = 'Soon';
             button.disabled = true;
        } else {
             button.textContent = 'Copy';
             button.disabled = false;
        }

        button.addEventListener('click', () => {
            const address = button.getAttribute('data-address');
            // Re-check if it's NOT a placeholder before copying
            if (address && !placeholderTexts.includes(address)) {
                navigator.clipboard.writeText(address).then(() => {
                    const originalText = 'Copy'; // Keep original as 'Copy'
                    button.textContent = 'Copied!';
                    button.style.backgroundColor = 'var(--secondary-color)';
                    button.style.borderColor = 'var(--secondary-color)';
                    button.style.color = 'var(--background-color)';
                    button.disabled = true;
                    setTimeout(() => {
                        button.textContent = originalText;
                         button.style.backgroundColor = '';
                         button.style.borderColor = '';
                         button.style.color = '';
                         button.disabled = false;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy address: ', err);
                     button.textContent = 'Error!';
                     setTimeout(() => { button.textContent = 'Copy'; button.disabled = false; }, 2000);
                });
            } else {
                // Feedback if trying to copy placeholder
                const originalText = button.textContent;
                button.textContent = 'Not Yet!';
                button.disabled = true;
                setTimeout(() => {
                    button.textContent = initialAddress.startsWith('[') ? 'Soon' : originalText;
                    button.disabled = true;
                 }, 2000);
                console.warn('Attempted to copy placeholder address.');
            }
        });
    });


    // --- Fade-in Animation on Scroll ---
    const sections = document.querySelectorAll('main section');
    if ("IntersectionObserver" in window) {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        };
        const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach(section => {
            section.classList.add('fade-in-section');
            sectionObserver.observe(section);
        });
    } else {
         console.warn("Intersection Observer not supported. Animations disabled.");
         sections.forEach(section => section.classList.add('visible'));
    }

    // --- Welcome Modal & Tour Trigger ---
    const welcomeModal = document.getElementById('welcome-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const startTourBtn = document.getElementById('start-tour-btn');

    if (welcomeModal && closeModalBtn && startTourBtn) {
        if (!sessionStorage.getItem('welcomeShown')) {
            // Show the modal after initial delay
            setTimeout(() => {
                welcomeModal.style.display = 'flex';
                 requestAnimationFrame(() => { requestAnimationFrame(() => { welcomeModal.classList.add('visible'); }); });

                // Trigger confetti
                if (typeof confetti === 'function') {
                   try { confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }, zIndex: 2001 }); } 
                   catch(confettiError){ console.error("Error running confetti:", confettiError); }
                } else { console.warn("Confetti library not loaded."); }
                
                sessionStorage.setItem('welcomeShown', 'true');
            }, 700); 
        }

        // Event Listeners for Modal
        closeModalBtn.addEventListener('click', closeModal);
        welcomeModal.addEventListener('click', (event) => { if (event.target === welcomeModal) { closeModal(); } });
        document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && welcomeModal.classList.contains('visible')) { closeModal(); } });
        
        // Start Tour Button Listener
        startTourBtn.addEventListener('click', () => {
            console.log("Start tour button clicked"); 
            closeModal();
            setTimeout(startWebsiteTour, 450); // Delay allows modal to close first
        });

    } else {
        if (!welcomeModal) console.error("Welcome modal element (#welcome-modal) not found.");
        if (!closeModalBtn) console.error("Close modal button (#close-modal-btn) not found.");
        if (!startTourBtn) console.error("Start tour button (#start-tour-btn) not found.");
    }


    // --- Initialize Jupiter Terminal ---
    if (document.getElementById('integrated-terminal')) {
        const jupiterIntervalId = setInterval(() => {
            if (window.Jupiter && typeof window.Jupiter.init === 'function') {
                clearInterval(jupiterIntervalId);
                console.log("Jupiter object found, initializing terminal...");
                try {
                    window.Jupiter.init({
                        displayMode: "integrated",
                        integratedTargetId: "integrated-terminal",
                        endpoint: "https://wiser-skilled-layer.solana-mainnet.quiknode.pro/d6d3ae205e58c061f513482b1ede0eabbd8bca2a/", // User's QuickNode endpoint
                        strictTokenList: false,
                        formProps: {
                            initialInputMint: "So11111111111111111111111111111111111111112", // SOL
                            // !!! ================================================== !!!
                            // !!! IMPORTANT: REPLACE WITH YOUR ACTUAL TOKEN MINT ADDRESS !!!
                             initialOutputMint: "7tJSy9wP5H2WjoSBxQ2hh9uR3AuGn9JWLTN6uLdjpump", // REPLACE ME - Using user provided address from HTML
                            // !!! ================================================== !!!
                        },
                         // Optional Callbacks (Uncomment to add logging)
                         // onWalletConnected: (wallet) => { console.log("Wallet connected via Jupiter:", wallet?.adapter?.name); },
                         // onSuccess: ({ txid, swapResult }) => { 
                         //     // Use outputTokenInfo for decimals if available, otherwise guess or omit decimals
                         //     const decimals = swapResult?.outputTokenInfo?.decimals;
                         //     const amount = decimals !== undefined ? swapResult.outputAmount / (10**decimals) : swapResult.outputAmount;
                         //     console.log(`Swap successful via Jupiter: ${txid}, Amount out: ${amount} ${swapResult?.outputTokenInfo?.symbol || ''}`); 
                         // },
                         // onError: (error) => { console.error("Jupiter Swap Error:", error); }
                    });
                    console.log("Jupiter Terminal Initialized successfully.");
                } catch (error) {
                     console.error("Error initializing Jupiter Terminal:", error);
                }
            }
        }, 100); // Check every 100ms
    } else {
        console.error("Jupiter Terminal target element 'integrated-terminal' not found.");
    }


 

            // Fade out, update text, fade in, apply flash
            tickerContent.style.opacity = '0'; 
            setTimeout(() => {
                tickerContent.textContent = newMessage;
                tickerContent.style.opacity = '1';
                tickerBar.classList.remove('flash-buy', 'flash-sell'); 
                 requestAnimationFrame(() => { requestAnimationFrame(() => { tickerBar.classList.add(flashClass); }); });
                setTimeout(() => { tickerBar.classList.remove(flashClass); }, flashDuration);
            }, 300); // Fade out time
        }

        // Initial delay
        setTimeout(() => {
            if (tickerBar) {
                tickerBar.style.display = 'flex'; 
                console.log("Ticker bar displayed."); 
                showRandomTransaction(); 
                setInterval(showRandomTransaction, updateInterval); 
                console.log("Ticker interval started."); 
            }
        }, 2500); 

    } else { console.error("Ticker elements not found (#simulated-ticker or #ticker-content)"); }
    // --- End Simulated Transaction Ticker ---

}); // End of DOMContentLoaded
