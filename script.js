// script.js for $CGPTS - Glitchy Edition

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
                '7tJSy9wP5H2WjoSBxQ2hh9uR3AuGn9JWLTN6uLdjpump',
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
                            initialOutputMint: "7tJSy9wP5H2WjoSBxQ2hh9uR3AuGn9JWLTN6uLdjpump", // REPLACE ME
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
// --- 6. Simulated Transaction Ticker ---
const tickerBar = document.getElementById('simulated-ticker');
const tickerContent = document.getElementById('ticker-content');

if (tickerBar && tickerContent) {
    console.log("Initializing simulated transaction ticker..."); // Debug

    // מערך של עסקאות פיקטיביות (קנייה ומכירה)
    const fakeTransactions = [
   { type: 'buy', sol: 0.781, tokens: 515000, addr: 'rT4...uVw' },
            { type: 'sell', sol: 1.45, tokens: 980000, addr: 'xY9...aBc' },
            { type: 'buy', sol: 3.112, tokens: 2450000, addr: 'dEf...gHi' },
            { type: 'buy', sol: 0.250, tokens: 155000, addr: 'JkL...mNo' },
            { type: 'sell', sol: 0.90, tokens: 610000, addr: 'pQr...sTu' },
            { type: 'buy', sol: 4.505, tokens: 3800000, addr: 'VwX...yZa' },
            { type: 'buy', sol: 0.915, tokens: 642000, addr: 'StU...hGf' },
            { type: 'sell', sol: 2.80, tokens: 1980000, addr: 'vWx...EdC' },
            { type: 'buy', sol: 1.750, tokens: 1280000, addr: 'yZa...bA9' },
            { type: 'sell', sol: 0.25, tokens: 145000, addr: 'bCd...8Y7' },
            { type: 'buy', sol: 3.333, tokens: 2490000, addr: 'eFg...6X5' },
            { type: 'sell', sol: 1.90, tokens: 1410000, addr: 'hIj...4W3' },
            { type: 'buy', sol: 0.682, tokens: 485000, addr: 'kLm...2V1' },
            { type: 'sell', sol: 0.95, tokens: 690000, addr: 'nOp...0U9' },
            { type: 'buy', sol: 2.041, tokens: 1605000, addr: 'QrS...8T7' },
            { type: 'buy', sol: 0.330, tokens: 215000, addr: 'UvW...6S5' },
            { type: 'sell', sol: 1.62, tokens: 1150000, addr: 'XyZ...4R3' },
            { type: 'buy', sol: 3.999, tokens: 3100000, addr: 'aBc...2Q1' },
            { type: 'sell', sol: 0.55, tokens: 380000, addr: 'DeF...0P9' },
            { type: 'buy', sol: 1.001, tokens: 750000, addr: 'gHi...8O7' },
            { type: 'buy', sol: 0.195, tokens: 120000, addr: 'jKl...6N5' },
            { type: 'sell', sol: 2.15, tokens: 1650000, addr: 'MnP...4M3' },
            { type: 'buy', sol: 4.123, tokens: 3300000, addr: 'qRs...2L1' },
            { type: 'sell', sol: 1.30, tokens: 950000, addr: 'TuV...0K9' },
            { type: 'buy', sol: 0.808, tokens: 590000, addr: 'wXy...8J7' },
            { type: 'sell', sol: 0.40, tokens: 280000, addr: 'ZaB...6I5' },
            { type: 'buy', sol: 2.760, tokens: 2100000, addr: 'cDe...4H3' },
            { type: 'sell', sol: 3.05, tokens: 2300000, addr: 'FgH...2G1' },
            { type: 'buy', sol: 1.490, tokens: 1150000, addr: 'iJk...0F9' },
            { type: 'buy', sol: 0.555, tokens: 390000, addr: 'LmN...8E7' }
        // אפשר להוסיף עוד עסקאות מגוונות
    ];

    let currentTxIndex = -1;
    const flashDuration = 700; // צריך להתאים למשך האנימציה ב-CSS (0.7s)
    const updateInterval = 5500; // זמן בין עדכונים (5.5 שניות)

    function showRandomTransaction() {
        if (document.hidden) return; // אל תעדכן אם הטאב לא פעיל

        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * fakeTransactions.length);
        } while (randomIndex === currentTxIndex && fakeTransactions.length > 1);
        
        currentTxIndex = randomIndex;
        const tx = fakeTransactions[currentTxIndex];

        // פורמט הודעה חדש: Address | SOL Amount | Token Amount
        const formattedTokens = tx.tokens.toLocaleString('en-US'); // הוספת פסיקים למספר גדול
        const newMessage = `${tx.addr} | ${tx.sol} SOL | ${formattedTokens} $CGPTS`;
        
        // קלאס האנימציה המתאים (קנייה או מכירה)
        const flashClass = tx.type === 'buy' ? 'flash-buy' : 'flash-sell';
        // צבע טקסט מתאים (אופציונלי, כרגע נשאר ציאן)
        // tickerContent.style.color = tx.type === 'buy' ? 'var(--accent-color)' : 'var(--primary-color)';

        // אפקט החלפת טקסט
        tickerContent.style.opacity = '0'; 

        setTimeout(() => {
            tickerContent.textContent = newMessage;
            tickerContent.style.opacity = '1';

            // הפעל אנימציית הבהוב
            // הסר קודם קלאס ישן אם קיים במקרה
            tickerBar.classList.remove('flash-buy', 'flash-sell'); 
            // הוסף קלאס חדש (ייתכן שצריך השהייה קלה כדי שהסרה תסתיים לפני הוספה)
             requestAnimationFrame(() => {
                 requestAnimationFrame(() => {
                    tickerBar.classList.add(flashClass);
                 });
            });
            
            // הסר את קלאס ההבהוב אחרי שהאנימציה מסתיימת
            setTimeout(() => {
                tickerBar.classList.remove(flashClass);
            }, flashDuration);

        }, 300); // זמן ל-Fade Out
    }

    // הצג את הפס אחרי השהייה קלה
    setTimeout(() => {
        if (tickerBar) {
            tickerBar.style.display = 'flex'; // שונה ל-flex כדי ליישר עם הלוגואים
            console.log("Ticker bar displayed."); 
            showRandomTransaction(); // הצג הודעה ראשונה מייד
            setInterval(showRandomTransaction, updateInterval); // התחל אינטרוול
            console.log("Ticker interval started."); 
        }
    }, 2500); 

} else {
    console.error("Ticker elements not found (#simulated-ticker or #ticker-content)");
}
// --- End Simulated Transaction Ticker ---
}); // End of DOMContentLoaded
