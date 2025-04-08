// script.js for $CGPTS - Glitchy Edition
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

    // ודא שכל האלמנטים קיימים
    if (!countdownElement || !daysEl || !hoursEl || !minutesEl || !secondsEl || !countdownMessageEl) {
        console.error("One or more countdown elements not found!");
        if(countdownMessageEl) { // נסה להציג שגיאה אם אפשר
             countdownMessageEl.innerHTML = "Countdown Error: Elements missing.";
             countdownMessageEl.style.display = 'block';
        }
        return; // עצור אם אלמנטים חסרים
    }

    // --- הגדר את תאריך ושעת היעד כאן ---
    // שים לב: הזמן הוא לפי שעון ישראל (IDT = UTC+3)
    const targetDateString = "2025-04-08T18:00:00+03:00"; // תאריך: 8 באפריל 2025, שעה: 18:00, אזור זמן: ישראל (IDT)
    // ------------------------------------

    const targetTime = new Date(targetDateString).getTime();

    // בדיקה אם התאריך תקין
    if (isNaN(targetTime)) {
         console.error("Invalid target date string for countdown:", targetDateString);
         countdownMessageEl.innerHTML = "Countdown target date is invalid!";
         countdownMessageEl.style.display = 'block';
         countdownElement.style.display = 'none'; // הסתר את הטיימר השגוי
         return;
    }
     console.log(`Countdown target set to: ${new Date(targetTime).toLocaleString('en-IL', { timeZone: 'Asia/Jerusalem' })}`); // Debug log target time

    // פונקציה שמתעדכנת כל שנייה
    const updateTimer = () => {
        const now = new Date().getTime();
        const distance = targetTime - now;

        // אם הספירה הסתיימה
        if (distance < 0) {
            clearInterval(intervalId); // הפסק את העדכון
            daysEl.innerHTML = '00';
            hoursEl.innerHTML = '00';
            minutesEl.innerHTML = '00';
            secondsEl.innerHTML = '00';
            countdownElement.classList.add('finished');
            countdownElement.classList.remove('hide-days'); 
            countdownMessageEl.style.display = 'block'; // הצג הודעת סיום
            countdownMessageEl.classList.add('visible'); // Add class for potential animation trigger
            console.log("Countdown finished!"); 
            return; // אין צורך להמשיך לחשב
        }

        // חישוב זמן
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // פונקציה להוספת 0 מוביל
        const format = (num) => (num < 10 ? '0' + num : num);

        // עדכון ה-HTML
        daysEl.innerHTML = format(days);
        hoursEl.innerHTML = format(hours);
        minutesEl.innerHTML = format(minutes);
        secondsEl.innerHTML = format(seconds);

         // הסתרת הימים אם נשאר פחות מיום אחד
         if (days <= 0) {
             countdownElement.classList.add('hide-days');
         } else {
             countdownElement.classList.remove('hide-days');
         }
    };

    // הפעל את הטיימר מיידית וכל שנייה
    const intervalId = setInterval(updateTimer, 1000);
    updateTimer(); // קריאה ראשונית כדי להציג מיד ולא לחכות שנייה
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Fully Loaded"); // Debug log: Verify DOMContentLoaded fires
    startCountdown();
    // --- 1. Mobile Navigation (Burger Menu) ---
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
                // Only close if mobile menu is active
                if (window.innerWidth <= 900 && navLinks.classList.contains('active')) {
                    burgerMenu.classList.remove('active');
                    navLinks.classList.remove('active');
                    burgerMenu.setAttribute('aria-expanded', 'false');
                }
            });
        });
        document.addEventListener('click', (event) => {
             // Close if clicked outside nav and burger, only if mobile menu is active
             if (!navLinks.contains(event.target) && !burgerMenu.contains(event.target) && navLinks.classList.contains('active')) {
                 burgerMenu.classList.remove('active');
                 navLinks.classList.remove('active');
                 burgerMenu.setAttribute('aria-expanded', 'false');
             }
          });
    } else {
        console.error("Burger menu or nav links element not found!");
    }

    // --- 2. Copy Contract Address ---
    const copyButtons = document.querySelectorAll('.copy-ca-button');
    copyButtons.forEach(button => {
         const initialAddress = button.getAttribute('data-address');
         // Set initial state based on placeholder text
         if (!initialAddress || initialAddress.startsWith('[')) {
              button.textContent = 'Soon'; // Indicate address is not ready yet
              button.disabled = true;
         } else {
             button.textContent = 'Copy'; // Ensure correct text if address is present
             button.disabled = false;
         }

        button.addEventListener('click', () => {
            const address = button.getAttribute('data-address');
            // Re-check placeholders in case they change
            const placeholderTexts = [
                '[TBA - To Be Announced at Launch]',
                '[PASTE CONTRACT ADDRESS HERE WHEN AVAILABLE - Triple check this!]',
                '[TBA SOON!]',
                '[CONTRACT ADDRESS DROP SOON!]' // Add all possible placeholders
             ];

            if (address && !placeholderTexts.includes(address)) {
                navigator.clipboard.writeText(address).then(() => {
                    const originalText = 'Copy'; // Set original text explicitly
                    button.textContent = 'Copied!';
                    button.style.backgroundColor = 'var(--secondary-color)';
                    button.style.borderColor = 'var(--secondary-color)';
                    button.style.color = 'var(--background-color)';
                    button.disabled = true; // Disable briefly after copy
                    setTimeout(() => {
                        button.textContent = originalText;
                         button.style.backgroundColor = '';
                         button.style.borderColor = '';
                         button.style.color = '';
                         button.disabled = false; // Re-enable
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy address: ', err);
                     button.textContent = 'Error!';
                     setTimeout(() => { button.textContent = 'Copy'; button.disabled = false; }, 2000); // Restore text and enable
                });
            } else {
                // If button still shows "Soon" or placeholder text
                const originalText = button.textContent; // Should be 'Soon' or placeholder
                button.textContent = 'Not Yet!';
                button.disabled = true; // Keep disabled
                setTimeout(() => {
                    // Restore original placeholder text if needed, keep disabled
                     button.textContent = initialAddress.startsWith('[') ? 'Soon' : originalText; 
                     button.disabled = true; // Keep disabled if no address
                 }, 2000);
                console.warn('Attempted to copy placeholder address.');
            }
        });
    });


    // --- 3. Fade-in Animation on Scroll ---
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
            section.classList.add('fade-in-section'); // Apply initial state for animation
            sectionObserver.observe(section);
        });
    } else {
         console.warn("Intersection Observer not supported. Animations disabled.");
         sections.forEach(section => section.classList.add('visible')); // Show all immediately
    }

    // ============================================
    // ===== Welcome Modal, Confetti & Tour =====
    // ============================================

    // --- 4. Welcome Modal, Confetti & Tour ---
    const welcomeModal = document.getElementById('welcome-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const startTourBtn = document.getElementById('start-tour-btn');

    // Function to close the modal
    const closeModal = () => {
        if (welcomeModal && welcomeModal.classList.contains('visible')) { // Check if actually visible before trying to close
            welcomeModal.classList.remove('visible');
            // Use transition end event for smoother hiding
            welcomeModal.addEventListener('transitionend', function handler() {
                 // Only set display none if it's still not visible (prevents issues if opened again quickly)
                 if (!welcomeModal.classList.contains('visible')) {
                     welcomeModal.style.display = 'none';
                 }
                 welcomeModal.removeEventListener('transitionend', handler); // Clean up listener
             });
        }
    };

    // Function to start the website tour
    function startWebsiteTour() {
        console.log("Attempting to start website tour..."); // Debug log 1
        if (typeof Shepherd === 'undefined') {
            console.error('Shepherd.js library not loaded.');
            alert('Could not start the tour. Please try refreshing the page.');
            return;
        }
        console.log("Shepherd object found:", Shepherd); // Debug log 2

        // Prevent starting a new tour if one is already active
        if (Shepherd.activeTour) {
            console.log("Tour is already active.");
            return;
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

            // Only add nav step if the nav links are visible (desktop)
             if (window.getComputedStyle(navLinks).display !== 'none') {
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
                  console.log("Skipped step: step-nav (Mobile)");
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
             const swapContainer = document.querySelector('#swap-terminal .terminal-container');
             if (swapContainer) {
                 tour.addStep({
                    id: 'step-swap', 
                    text: "Use this terminal to swap SOL for $CGPTS directly on the site!",
                    attachTo: { element: '#swap-terminal .terminal-container', on: 'top' },
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

            tour.start();
            console.log("Shepherd tour started successfully"); // Debug log after start

        } catch (error) {
             console.error("Error initializing or running Shepherd tour:", error); 
             alert("An error occurred while trying to start the tour.");
        }
    }

    // Show Welcome Modal Logic
    if (welcomeModal && closeModalBtn && startTourBtn) {
        if (!sessionStorage.getItem('welcomeShown')) {
            setTimeout(() => {
                welcomeModal.style.display = 'flex'; 
                // Use double requestAnimationFrame for better browser compatibility ensuring display:flex is applied before transition starts
                 requestAnimationFrame(() => {
                      requestAnimationFrame(() => { 
                          welcomeModal.classList.add('visible'); 
                      });
                 });

                if (typeof confetti === 'function') {
                   try { // Add try-catch around confetti too
                        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }, zIndex: 2001 });
                   } catch(confettiError){
                        console.error("Error running confetti:", confettiError);
                   }
                } else { console.warn("Confetti library not loaded."); }
                sessionStorage.setItem('welcomeShown', 'true');
            }, 700); // Delay before showing modal
        }

        // --- Event Listeners ---
        closeModalBtn.addEventListener('click', closeModal);
        welcomeModal.addEventListener('click', (event) => {
            if (event.target === welcomeModal) { closeModal(); }
        });
         document.addEventListener('keydown', (event) => {
             if (event.key === 'Escape' && welcomeModal.classList.contains('visible')) { closeModal(); }
        });

        startTourBtn.addEventListener('click', () => {
            console.log("Start tour button clicked"); // Debug log
            closeModal();
            // Use a delay that accounts for the modal close transition (400ms) + buffer
            setTimeout(startWebsiteTour, 450);
        });

    } else {
        // Log which specific element is missing
        if (!welcomeModal) console.error("Welcome modal element (#welcome-modal) not found.");
        if (!closeModalBtn) console.error("Close modal button (#close-modal-btn) not found.");
        if (!startTourBtn) console.error("Start tour button (#start-tour-btn) not found.");
    }
    // --- End of Welcome Modal Logic ---

    // ==========================================
    // ===== Jupiter Terminal Init ==========
    // ==========================================

    // --- 5. Initialize Jupiter Terminal ---
    if (document.getElementById('integrated-terminal')) {
        const intervalId = setInterval(() => {
            // Check more robustly if Jupiter is ready
            if (window.Jupiter && typeof window.Jupiter.init === 'function') {
                clearInterval(intervalId);
                console.log("Jupiter object found, initializing terminal..."); // Log before init
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
                            // !!! Using USDC as temporary placeholder               !!!
                            // !!! ================================================== !!!
                            initialOutputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // REPLACE ME
                        },
                        // Example callbacks (uncomment to use)
                        // onWalletConnected: (wallet) => { console.log("Wallet connected via Jupiter:", wallet.adapter.name); },
                        // onSuccess: ({ txid, swapResult }) => { 
                        //    const outputAmount = swapResult.outputAmount / (10**(swapResult.outputTokenInfo.decimals || 0)); // Adjust for decimals
                        //    console.log("Swap successful via Jupiter:", txid, "Amount out:", outputAmount); 
                        // }
                    });
                    console.log("Jupiter Terminal Initialized successfully."); // Log success
                } catch (error) {
                     console.error("Error initializing Jupiter Terminal:", error);
                }
            } else {
                // Optional: Log if Jupiter object not yet ready
                 // console.log("Waiting for Jupiter object...");
            }
        }, 100); // Check every 100ms
    } else {
        console.error("Jupiter Terminal target element 'integrated-terminal' not found.");
    }
    // --- 6. Simulated Buy Ticker ---
const tickerBar = document.getElementById('simulated-ticker');
const tickerContent = document.getElementById('ticker-content');

if (tickerBar && tickerContent) {
    console.log("Initializing simulated ticker..."); // Debug

    // הודעות קנייה פיקטיביות (שנה/הוסף לפי הצורך)
    const fakeBuys = [
        "AI detected BUY! 0.5 SOL >> 450K $CGPTS by 7aX...k9P",
        "Executing purchase... 1.2 SOL >> 1.1M $CGPTS by FgT...w3c",
        "Confirmed $CGPTS Acquisition! 0.8 SOL >> 720K $CGPTS by LnM...zTq",
        "Someone aped! Analyzing... 2.5 SOL >> 2.2M $CGPTS by 9bR...vY2",
        "Processing buy order... 0.3 SOL >> 270K $CGPTS by PqZ...m8a",
        "Neural network reports BUY: 1.0 SOL >> 900K $CGPTS by 3dV...hJ6",
        "$CGPTS secured! 0.6 SOL >> 540K $CGPTS by RrS...e4W",
        "Anomaly detected! Large BUY: 3.1 SOL >> 2.8M $CGPTS by Xy1...bN7"
    ];

    let currentBuyIndex = -1; 
    const flashDuration = 800; // משך האנימציה ב-CSS (0.8s) במ"ש
    const updateInterval = 6500; // זמן בין עדכונים (6.5 שניות) במ"ש

    function showRandomBuy() {
        // אל תעדכן אם הטאב לא פעיל
        if (document.hidden) return; 

        let randomIndex;
        // ודא שההודעה הבאה שונה מהקודמת
        do {
            randomIndex = Math.floor(Math.random() * fakeBuys.length);
        } while (randomIndex === currentBuyIndex && fakeBuys.length > 1);

        currentBuyIndex = randomIndex;
        const newMessage = fakeBuys[currentBuyIndex];

        // אפקט Fade Out -> עדכון טקסט -> Fade In
        tickerContent.style.opacity = '0'; 

        setTimeout(() => {
            tickerContent.textContent = newMessage;
            tickerContent.style.opacity = '1';

            // הפעל אנימציית הבהוב
            tickerBar.classList.add('flash');

            // הסר את קלאס ההבהוב אחרי שהאנימציה מסתיימת
            // כדי שיהיה אפשר להפעיל אותה שוב בפעם הבאה
            setTimeout(() => {
                tickerBar.classList.remove('flash');
            }, flashDuration);

        }, 300); // זמן ל-Fade Out לפני העדכון (0.3 שניות)
    }

    // הצג את הפס אחרי השהייה קלה (לתת לאתר להיטען)
    setTimeout(() => {
        if (tickerBar) {
            tickerBar.style.display = 'block'; // הצג את הפס
            console.log("Ticker bar displayed."); // Debug
            showRandomBuy(); // הצג הודעה ראשונה מייד
            // התחל את האינטרוול להודעות הבאות
            setInterval(showRandomBuy, updateInterval); 
            console.log("Ticker interval started."); // Debug
        }
    }, 2500); // השהייה של 2.5 שניות

} else {
    console.error("Ticker elements not found (#simulated-ticker or #ticker-content)");
}
// --- End Simulated Buy Ticker ---
    // --- End of Jupiter Terminal Init ---

}); // End of DOMContentLoaded
