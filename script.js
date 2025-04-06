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
    function startWebsiteTour() {
        // בדוק אם ספריית Shepherd נטענה
        if (typeof Shepherd === 'undefined') {
            console.error('Shepherd.js library not loaded.');
            alert('Could not start the tour. Please try refreshing the page.'); // הודעה למשתמש
            return;
        }

        const tour = new Shepherd.Tour({
            useModalOverlay: true, // מחשיך את הרקע בזמן הסיור
            defaultStepOptions: {
                classes: 'shepherd-theme-arrows shepherd-custom-theme', // עיצוב בסיסי + קלאס לעיצוב מותאם
                scrollTo: { behavior: 'smooth', block: 'center' } // גלילה חלקה לאלמנטים
            }
        });

        // הגדרת שלבי הסיור (שנה את הטקסטים והבוררים לפי הצורך)
        tour.addStep({
            id: 'step-logo',
            text: 'This is the logo and name of the project. Clicking here will always return you to the top of the page.',
            attachTo: {
                element: '.logo-link', // בורר CSS שמצביע על הלינק של הלוגו ב-header
                on: 'bottom' // איפה להציג את ההסבר ביחס לאלמנט
            },
            buttons: [
                {
                    text: 'next', // טקסט כפתור
                    action: tour.next // מה קורה בלחיצה
                }
            ]
        });

        tour.addStep({
            id: 'step-nav',
            text: 'Here is the navigation menu. You can jump to the different sections of the site such as About, Tokenomics, How to Buy, and the Roadmap.',
            attachTo: {
                element: 'header nav ul.nav-links', // תפריט הניווט ב-header (חשוב שה-UL יהיה גלוי)
                on: 'bottom'
            },
            buttons: [
                 {
                    text: 'back',
                    secondary: true, // עיצוב משני לכפתור 'הקודם'
                    action: tour.back
                },
                {
                    text: 'next',
                    action: tour.next
                }
            ]
        });

         tour.addStep({
            id: 'step-how-to-buy',
            text: 'Want to join? Heres how to buy the $CGPTS coin through Pump.fun (during launch).',
            attachTo: {
                element: '#how-to-buy h2', // כותרת הסקשן "How to Buy"
                on: 'bottom' // נציג מתחת לכותרת
            },
             buttons: [
                 {
                    text: 'back',
                    secondary: true,
                    action: tour.back
                },
                {
                    text: 'next',
                    action: tour.next
                }
            ]
        });

        tour.addStep({
            id: 'step-socials',
            text: "Don't forget to join our community on Twitter (X) and Telegram!",
            attachTo: {
                element: '#socials .social-links', // אזור הקישורים לרשתות חברתיות
                on: 'top' // נציג מעל הקישורים
            },
             buttons: [
                 {
                    text: 'back',
                    secondary: true,
                    action: tour.back
                },
                {
                    text: 'End!', // כפתור אחרון
                    action: tour.complete // מסמן שהסיור הושלם
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

}); // End of DOMContentLoaded
