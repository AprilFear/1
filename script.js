// script.js for $CGPTS - Glitchy Edition

// ======================== //
// Helper Functions         //
// ======================== //
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}


// ======================== //
// Shepherd Tour Function   //
// ======================== //
function startWebsiteTour() {
    console.log("Attempting to start website tour..."); 
    if (typeof Shepherd === 'undefined') {
        console.error('Shepherd.js library not loaded.');
        alert('Could not start the tour. Please try refreshing the page.');
        return;
    }
    console.log("Shepherd object found:", Shepherd); 

    if (Shepherd.activeTour) {
        console.log("Tour is already active, exiting.");
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
        console.log("Shepherd tour initialized"); 

        // Define Tour Steps
        tour.addStep({ id: 'step-logo', text: 'This is our logo and name! Click it anytime to return to the top.', attachTo: { element: '.logo-link', on: 'bottom' }, buttons: [ { text: 'Next', action: tour.next } ] });
        console.log("Added step: step-logo");

        // Conditionally add nav step for desktop
         const navLinksElement = document.querySelector('header nav ul.nav-links'); 
         if (navLinksElement && window.getComputedStyle(navLinksElement).display !== 'none') {
             tour.addStep({ id: 'step-nav', text: 'Use the navigation bar to jump to different sections...', attachTo: { element: 'header nav ul.nav-links', on: 'bottom' }, buttons: [ { text: 'Back', secondary: true, action: tour.back },{ text: 'Next', action: tour.next } ] });
             console.log("Added step: step-nav (Desktop)");
         } else { console.log("Skipped step: step-nav (Mobile or element not found)"); }

         tour.addStep({ id: 'step-how-to-buy', text: 'Want to get some $CGPTS? This section explains exactly how to buy.', attachTo: { element: '#how-to-buy h2', on: 'bottom' }, buttons: [ { text: 'Back', secondary: true, action: tour.back },{ text: 'Next', action: tour.next } ] });
         console.log("Added step: step-how-to-buy");

        const chartContainer = document.querySelector('#live-chart .chart-container');
        if (chartContainer) {
             tour.addStep({ id: 'step-chart', text: "Here you can see the live price chart (once it's available).", attachTo: { element: '#live-chart .chart-container', on: 'bottom' }, buttons: [ { text: 'Back', secondary: true, action: tour.back }, { text: 'Next', action: tour.next } ] });
            console.log("Added step: step-chart");
        } else { console.log("Skipped step: step-chart (container not found)"); }

         const swapContainer = document.querySelector('#swap-terminal #integrated-terminal'); 
         if (swapContainer) {
             tour.addStep({ id: 'step-swap', text: "Use this terminal to swap SOL for $CGPTS directly on the site!", attachTo: { element: '#swap-terminal #integrated-terminal', on: 'top' }, buttons: [ { text: 'Back', secondary: true, action: tour.back }, { text: 'Next', action: tour.next } ] });
            console.log("Added step: step-swap");
        } else { console.log("Skipped step: step-swap (container not found)"); }

        tour.addStep({ id: 'step-socials', text: "Don't forget to join our community on Twitter (X) and Telegram!", attachTo: { element: '#socials .social-links', on: 'top' }, buttons: [ { text: 'Back', secondary: true, action: tour.back }, { text: 'End!', action: tour.complete } ] });
        console.log("Added step: step-socials");

        tour.on('complete', () => console.log("Tour completed!"));
        tour.on('cancel', () => console.log("Tour cancelled!"));

        tour.start();
        console.log("Shepherd tour started successfully"); 

    } catch (error) {
         console.error("Error initializing or running Shepherd tour:", error);
         alert("An error occurred while trying to start the tour.");
    }
}


// ======================== //
// Main Execution           //
// ======================== //
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Fully Loaded - Initializing scripts...");

    try {
        console.log("Section 0: Initializing Countdown...");
        startCountdown(); 
        console.log("Section 0: Countdown Initialized.");
    } catch(e) { console.error("Error starting countdown:", e); }

    try {
        console.log("Section 1: Initializing Mobile Nav...");
        const burgerMenu = document.querySelector('.burger-menu');
        const navLinks = document.querySelector('.nav-links'); 
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
            console.log("Section 1: Mobile Nav Initialized.");
        } else { console.error("Burger menu or nav links element not found!"); }
    } catch(e) { console.error("Error setting up Mobile Nav:", e); }

    try {
        console.log("Section 2: Initializing Copy Buttons...");
        const copyButtons = document.querySelectorAll('.copy-ca-button');
        copyButtons.forEach(button => {
            const initialAddress = button.getAttribute('data-address');
             const placeholderTexts = [
                 '[TBA - To Be Announced at Launch]',
                 '[PASTE CONTRACT ADDRESS HERE WHEN AVAILABLE - Triple check this!]',
                 '[TBA SOON!]',
                 '[CONTRACT ADDRESS DROP SOON!]',
                 // Also check for the actual address if it was accidentally included as placeholder
                 '7tJSy9wP5H2WjoSBxQ2hh9uR3AuGn9JWLTN6uLdjpump' 
              ];

             // Set initial state based on placeholder text OR if it contains the actual address (treat as not ready to copy yet maybe?)
             // Let's assume for now if it HAS the real address, it IS ready to copy
             if (!initialAddress || placeholderTexts.includes(initialAddress)) {
                  button.textContent = 'Soon';
                  button.disabled = true;
             } else {
                  button.textContent = 'Copy';
                  button.disabled = false;
             }

            button.addEventListener('click', () => {
                const address = button.getAttribute('data-address');
                 // Re-check placeholders
                 if (address && !placeholderTexts.includes(address)) {
                     navigator.clipboard.writeText(address).then(() => {
                        const originalText = 'Copy'; 
                        button.textContent = 'Copied!';
                        button.style.backgroundColor = 'var(--secondary-color)';
                        button.style.borderColor = 'var(--secondary-color)';
                        button.style.color = 'var(--background-color)';
                        button.disabled = true;
                        setTimeout(() => {
                            button.textContent = originalText;
                             button.style.backgroundColor = ''; button.style.borderColor = ''; button.style.color = '';
                             button.disabled = false;
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy address: ', err);
                         button.textContent = 'Error!';
                         setTimeout(() => { button.textContent = 'Copy'; button.disabled = false; }, 2000);
                    });
                 } else {
                    const originalText = button.textContent;
                    button.textContent = 'Not Yet!';
                    button.disabled = true;
                    setTimeout(() => {
                        // Restore original placeholder text if needed, keep disabled
                         button.textContent = initialAddress.startsWith('[') ? 'Soon' : originalText;
                         // Re-disable based on placeholder status
                         button.disabled = !initialAddress || placeholderTexts.includes(initialAddress);
                     }, 2000);
                    console.warn('Attempted to copy placeholder address.');
                }
             });
         });
        console.log(`Section 2: Copy Buttons Initialized (${copyButtons.length} found).`);
    } catch(e) { console.error("Error setting up Copy Buttons:", e); }

    try {
        console.log("Section 3: Initializing Fade-in Sections...");
        const sections = document.querySelectorAll('main section');
        if ("IntersectionObserver" in window) {
            const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
            const observerCallback = (entries, observer) => { /* ... */ };
            const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);
            sections.forEach(section => { section.classList.add('fade-in-section'); sectionObserver.observe(section); });
             console.log("Section 3: Fade-in Sections Initialized.");
        } else { console.warn("Fade-in disabled."); sections.forEach(section => section.classList.add('visible')); }
    } catch(e) { console.error("Error setting up Fade-in Sections:", e); }

    try {
        console.log("Section 4: Initializing Welcome Modal...");
        const welcomeModal = document.getElementById('welcome-modal');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const startTourBtn = document.getElementById('start-tour-btn');

        // Function to close the modal (defined globally now)
        const closeModal = () => { /* ... same logic ... */ }; 

        if (welcomeModal && closeModalBtn && startTourBtn) {
            console.log("Welcome Modal elements found.");
            if (!sessionStorage.getItem('welcomeShown')) {
                console.log("Welcome modal should be shown.");
                setTimeout(() => { /* ... show modal and confetti logic ... */ }, 700);
            } else { console.log("Welcome modal already shown this session."); }

            // Event Listeners for Modal
            closeModalBtn.addEventListener('click', closeModal);
            welcomeModal.addEventListener('click', (event) => { if (event.target === welcomeModal) { closeModal(); } });
            document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && welcomeModal.classList.contains('visible')) { closeModal(); } });
            startTourBtn.addEventListener('click', () => { console.log("Start tour button clicked"); closeModal(); setTimeout(startWebsiteTour, 450); });
            console.log("Section 4: Welcome Modal listeners attached.");
        } else { /* ... error logging for missing elements ... */ }
    } catch(e) { console.error("Error setting up Welcome Modal:", e); }

    // --- Moved Jupiter and Ticker Init inside DOMContentLoaded ---

    try {
        // --- 5. Initialize Jupiter Terminal ---
        console.log("Section 5: Checking for Jupiter Terminal container...");
        if (document.getElementById('integrated-terminal')) {
            const jupiterIntervalId = setInterval(() => { /* ... wait for window.Jupiter.init ... */ }, 100);
        } else { console.error("Jupiter Terminal target element not found."); }
    } catch(e) { console.error("Error setting up Jupiter Terminal:", e); }

    try {
        // --- 6. Simulated Transaction Ticker ---
        console.log("Section 6: Initializing simulated ticker...");
        const tickerBar = document.getElementById('simulated-ticker');
        const tickerContent = document.getElementById('ticker-content');
        if (tickerBar && tickerContent) {
             const fakeTransactions = [ /* ... array ... */ ];
             let currentTxIndex = -1;
             const flashDuration = 700;
             const updateInterval = 5500;
             function showRandomTransaction() { /* ... function logic ... */ }
             setTimeout(() => { /* ... show ticker and start interval ... */ }, 2500);
             console.log("Section 6: Simulated Ticker Initialized.");
        } else { console.error("Ticker elements not found."); }
    } catch(e) { console.error("Error setting up Simulated Ticker:", e); }

    console.log("All scripts in DOMContentLoaded finished initializing attempt.");

}); // End of DOMContentLoaded
