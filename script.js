// script.js for $CGPTS - Glitchy Edition

document.addEventListener('DOMContentLoaded', () => {

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
                if (navLinks.classList.contains('active')) {
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
    } else {
        console.error("Burger menu or nav links element not found!");
    }

    // --- 2. Copy Contract Address ---
    const copyButtons = document.querySelectorAll('.copy-ca-button');
    copyButtons.forEach(button => {
         const initialAddress = button.getAttribute('data-address');
         if (!initialAddress || initialAddress.startsWith('[')) { /* Placeholder check */ }
        button.addEventListener('click', () => {
            const address = button.getAttribute('data-address');
            const placeholderTexts = [
                '[TBA - To Be Announced at Launch]',
                '[PASTE CONTRACT ADDRESS HERE WHEN AVAILABLE - Triple check this!]'
             ];
            if (address && !placeholderTexts.includes(address)) {
                navigator.clipboard.writeText(address).then(() => {
                    const originalText = button.textContent;
                    button.textContent = 'Copied!';
                    button.style.backgroundColor = 'var(--secondary-color)';
                    button.style.borderColor = 'var(--secondary-color)';
                    button.style.color = 'var(--background-color)';
                    setTimeout(() => {
                        button.textContent = originalText;
                         button.style.backgroundColor = '';
                         button.style.borderColor = '';
                         button.style.color = '';
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy address: ', err);
                     button.textContent = 'Error!';
                     setTimeout(() => { button.textContent = 'Copy'; }, 2000);
                });
            } else {
                const originalText = button.textContent;
                button.textContent = 'Not Yet!';
                 button.disabled = true;
                setTimeout(() => {
                     button.textContent = originalText;
                     button.disabled = false;
                 }, 2000);
                console.warn('Contract address is not available yet or is a placeholder.');
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
            section.classList.add('fade-in-section');
            sectionObserver.observe(section);
        });
    } else {
         console.warn("Intersection Observer not supported. Animations disabled.");
         sections.forEach(section => section.classList.add('visible'));
    }

    // ============================================
    // ===== קוד המודאל, הקונפטי והסיור מתחיל כאן =====
    // ============================================

    // --- 4. Welcome Modal, Confetti & Tour ---
    const welcomeModal = document.getElementById('welcome-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const startTourBtn = document.getElementById('start-tour-btn'); // <<< הכפתור החדש

    // פונקציה לסגירת המודאל (נצטרך אותה גם לכפתור הסיור)
    const closeModal = () => {
        if (welcomeModal) {
            welcomeModal.classList.remove('visible');
            setTimeout(() => {
                 welcomeModal.style.display = 'none';
            }, 400);
        }
    };

    // פונקציה להפעלת הסיור
  // פונקציה להפעלת הסיור (גרסה עם טקסטים באנגלית)
    function startWebsiteTour() {
        // בדוק אם ספריית Shepherd נטענה
        if (typeof Shepherd === 'undefined') {
            console.error('Shepherd.js library not loaded.');
            alert('Could not start the tour. Please try refreshing the page.');
            return;
        }

        const tour = new Shepherd.Tour({
            useModalOverlay: true, // מחשיך את הרקע בזמן הסיור
            defaultStepOptions: {
                classes: 'shepherd-theme-arrows shepherd-custom-theme', // עיצוב בסיסי + קלאס לעיצוב מותאם
                scrollTo: { behavior: 'smooth', block: 'center' } // גלילה חלקה לאלמנטים
            }
        });

        // הגדרת שלבי הסיור (עם טקסטים באנגלית)
        tour.addStep({
            id: 'step-logo',
            text: 'This is our logo and name! Click it anytime to return to the top.', // טקסט הסבר באנגלית
            attachTo: {
                element: '.logo-link',
                on: 'bottom'
            },
            buttons: [
                {
                    text: 'Next', // טקסט כפתור באנגלית
                    action: tour.next
                }
            ]
        });

        tour.addStep({
            id: 'step-nav',
            text: 'Use the navigation bar to jump to different sections like About, Tokenomics, How to Buy, and our Roadmap.', // טקסט הסבר באנגלית
            attachTo: {
                element: 'header nav ul.nav-links',
                on: 'bottom'
            },
            buttons: [
                 {
                    text: 'Back', // טקסט כפתור באנגלית
                    secondary: true,
                    action: tour.back
                },
                {
                    text: 'Next', // טקסט כפתור באנגלית
                    action: tour.next
                }
            ]
        });

         tour.addStep({
            id: 'step-how-to-buy',
            text: 'Want to get some $CGPTS? This section explains exactly how to buy using Pump.fun (initially).', // טקסט הסבר באנגלית
            attachTo: {
                element: '#how-to-buy h2',
                on: 'bottom'
            },
             buttons: [
                 {
                    text: 'Back', // טקסט כפתור באנגלית
                    secondary: true,
                    action: tour.back
                },
                {
                    text: 'Next', // טקסט כפתור באנגלית
                    action: tour.next
                }
            ]
        });

        tour.addStep({
            id: 'step-socials',
            text: "Don't forget to join our community on Twitter (X) and Telegram!", // טקסט הסבר באנגלית
            attachTo: {
                element: '#socials .social-links',
                on: 'top'
            },
             buttons: [
                 {
                    text: 'Back', // טקסט כפתור באנגלית
                    secondary: true,
                    action: tour.back
                },
                {
                    text: 'End!', // טקסט כפתור באנגלית
                    action: tour.complete
                }
            ]
        });

        // הפעל את הסיור
        tour.start();
    }

    // בדיקה והצגת המודאל (אם צריך)
    if (welcomeModal && closeModalBtn && startTourBtn) { // ודא שכל הכפתורים קיימים

        // בדוק אם הודעת הברוכים הבאים כבר הוצגה בסשן הנוכחי
        if (!sessionStorage.getItem('welcomeShown')) {
            // הצג את המודאל אחרי השהייה קצרה
            setTimeout(() => {
                welcomeModal.style.display = 'flex';
                setTimeout(() => {
                     welcomeModal.classList.add('visible');
                }, 50);

                // הפעל אפקט קונפטי
                if (typeof confetti === 'function') {
                   confetti({
                       particleCount: 150,
                       spread: 90,
                       origin: { y: 0.6 },
                       zIndex: 2001
                   });
                } else {
                    console.warn("Confetti library (canvas-confetti) not loaded.");
                }
                // סמן שההודעה הוצגה בסשן זה
                sessionStorage.setItem('welcomeShown', 'true');
            }, 700);
        }

        // --- Event Listeners ---
        // סגירה רגילה
        closeModalBtn.addEventListener('click', closeModal);
        // סגירה בלחיצה על הרקע
        welcomeModal.addEventListener('click', (event) => {
            if (event.target === welcomeModal) { closeModal(); }
        });
        // סגירה במקש Escape
         document.addEventListener('keydown', (event) => {
             if (event.key === 'Escape' && welcomeModal.classList.contains('visible')) { closeModal(); }
        });

        // <<<< חדש: הפעלת הסיור בלחיצה על הכפתור במודאל >>>>
        startTourBtn.addEventListener('click', () => {
            closeModal(); // קודם כל סגור את חלון הברוכים הבאים
            // תן אנימציית הסגירה להסתיים לפני שמתחילים את הסיור
            setTimeout(startWebsiteTour, 450); // התחל את הסיור אחרי כ-450 אלפיות שנייה
        });

    } else {
        console.error("Could not find Welcome modal elements (welcome-modal, close-modal-btn, or start-tour-btn).");
    }
    // --- End of Welcome Modal Logic ---

    // ==========================================
    // ===== סוף קוד המודאל, הקונפטי והסיור =====
    // ==========================================
// בסוף הקובץ script.js, לפני הסוגר });

// --- 5. Initialize Jupiter Terminal ---
// ודא שהקוד הזה רץ רק אחרי שה-DOM טעון במלואו
if (document.getElementById('integrated-terminal')) {
    // המתן שהסקריפט של Jupiter ייטען (אופציונלי, אבל יכול למנוע שגיאות)
    const intervalId = setInterval(() => {
        if (window.Jupiter) {
            clearInterval(intervalId); // הפסק לבדוק ברגע שנמצא

            window.Jupiter.init({
                displayMode: "integrated",
                integratedTargetId: "integrated-terminal", // ה-ID של ה-div שהכנו
                endpoint: "https://api.mainnet-beta.solana.com", // נקודת גישה לרשת סולנה (אפשר להחליף ב-RPC אישי אם יש)
                strictTokenList: false, // אפשר למשתמשים לבחור גם מטבעות אחרים, לא רק מרשימה קפדנית

                // --- הגדרות חשובות ---
                formProps: {
                    // הגדר את המטבעות ההתחלתיים שיוצגו למשתמש
                    initialInputMint: "So11111111111111111111111111111111111111112", // כתובת של SOL (WRAPPED SOL)
                    initialOutputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // <<< !!! החלף בכתובת החוזה (Mint Address) של $CGPTS !!!
                },
                // --- אפשרויות נוספות (אופציונלי) ---
                // לדוגמה, אפשר לשנות את ברירת המחדל של ה-slippage:
                // defaultSlippage: 0.5, // חצי אחוז החלקה

                // קריאה לפונקציה כאשר משתמש מחבר ארנק (אם רוצים לעשות משהו נוסף)
                // onWalletConnected: (wallet) => {
                //    console.log("Wallet connected:", wallet.adapter.name);
                // },

                // קריאה לפונקציה אחרי החלפה מוצלחת
                // onSuccess: ({ txid, swapResult }) => {
                //    console.log("Swap successful:", txid, "Amount out:", swapResult.outputAmount);
                // }
            });
        }
    }, 100); // בדוק כל 100 אלפיות שנייה אם Jupiter נטען
} else {
    console.error("Jupiter Terminal target element 'integrated-terminal' not found.");
}
// --- End of Jupiter Terminal Init ---
}); // End of DOMContentLoaded
