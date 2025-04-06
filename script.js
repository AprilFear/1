// script.js for $CGPTS - Glitchy Edition

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Navigation (Burger Menu) ---
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links'); // The UL element

    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            // Toggle 'active' class on both burger and nav links list
            burgerMenu.classList.toggle('active');
            navLinks.classList.toggle('active');

            // Accessibility: Update aria-expanded attribute
            const isExpanded = burgerMenu.getAttribute('aria-expanded') === 'true';
            burgerMenu.setAttribute('aria-expanded', !isExpanded);
        });

        // Close mobile menu when a link is clicked (optional but good UX)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    burgerMenu.classList.remove('active');
                    navLinks.classList.remove('active');
                    burgerMenu.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Close mobile menu if clicked outside of it (optional)
        document.addEventListener('click', (event) => {
             // Check if the click is outside the navLinks AND outside the burgerMenu
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
         // Set the initial text based on the address availability during load
         const initialAddress = button.getAttribute('data-address');
         if (!initialAddress || initialAddress.startsWith('[')) { // Check if placeholder
             // Optionally disable or change text if address not ready
             // button.disabled = true;
             // button.textContent = 'Soon';
         }

        button.addEventListener('click', () => {
            const address = button.getAttribute('data-address');
            const placeholderTexts = [
                '[TBA - To Be Announced at Launch]',
                '[PASTE CONTRACT ADDRESS HERE WHEN AVAILABLE - Triple check this!]'
             ];

            // Check if the address is valid and not a placeholder
            if (address && !placeholderTexts.includes(address)) {
                navigator.clipboard.writeText(address).then(() => {
                    const originalText = button.textContent; // Use textContent
                    button.textContent = 'Copied!'; // Change text
                    button.style.backgroundColor = 'var(--secondary-color)'; // Cyan feedback
                    button.style.borderColor = 'var(--secondary-color)';
                    button.style.color = 'var(--background-color)';

                    setTimeout(() => {
                        button.textContent = originalText; // Restore text
                        // Restore original styles (or rely on CSS :hover/:active states)
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
                // Indicate that the address is not available yet
                const originalText = button.textContent;
                button.textContent = 'Not Yet!';
                 button.disabled = true; // Temporarily disable
                setTimeout(() => {
                     button.textContent = originalText;
                     button.disabled = false; // Re-enable
                 }, 2000);
                console.warn('Contract address is not available yet or is a placeholder.');
            }
        });
    });


    // --- 3. Fade-in Animation on Scroll ---
    const sections = document.querySelectorAll('main section'); // Target sections inside main

    if ("IntersectionObserver" in window) { // Check if browser supports it
        const observerOptions = {
            root: null, // relative to the viewport
            rootMargin: '0px',
            threshold: 0.15 // Trigger when 15% of the section is visible
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing once visible (optional)
                }
                // No 'else' needed if we only want fade-in once
            });
        };

        const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach(section => {
            section.classList.add('fade-in-section'); // Add base class for initial state
            sectionObserver.observe(section);
        });

    } else {
        // Fallback for older browsers (optional): just make sections visible
         console.warn("Intersection Observer not supported. Animations disabled.");
         sections.forEach(section => section.classList.add('visible')); // Make all visible immediately
    }

     // --- Optional: Smooth scroll replacement (if CSS version isn't sufficient) ---
     // NOTE: Your CSS already has html { scroll-behavior: smooth; }, so this might be redundant.
     // If you want more control or compatibility, uncomment this block.
     /*
     const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
     smoothScrollLinks.forEach(link => {
         link.addEventListener('click', function (e) {
             const hrefAttribute = this.getAttribute('href');
             // Make sure it's an internal link and not just "#"
             if (hrefAttribute.length > 1 && hrefAttribute.startsWith('#')) {
                 const targetElement = document.querySelector(hrefAttribute);
                 if (targetElement) {
                     e.preventDefault(); // Prevent default jump ONLY if target exists
                     targetElement.scrollIntoView({
                         behavior: 'smooth',
                         block: 'start'
                     });
                 }
             }
         });
     });
     */

    // ============================================
    // ===== הוספת קוד המודאל והקונפטי מתחילה כאן =====
    // ============================================

    // --- 4. Welcome Modal & Confetti ---
    const welcomeModal = document.getElementById('welcome-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    // const modalCtaBtn = document.getElementById('modal-cta-btn'); // אם הוספת כפתור CTA

    if (welcomeModal && closeModalBtn) {
        // בדוק אם הודעת הברוכים הבאים כבר הוצגה בסשן הנוכחי
        if (!sessionStorage.getItem('welcomeShown')) {
            // הצג את המודאל אחרי השהייה קצרה (אופציונלי, לאפקט נחמד)
            setTimeout(() => {
                welcomeModal.style.display = 'flex'; // הצג את הרקע (כי הוא display: none בהתחלה)
                setTimeout(() => { // תן לרקע להופיע לפני שהתוכן 'קופץ'
                     welcomeModal.classList.add('visible'); // הפעל את אנימציית הכניסה
                }, 50); // השהייה קטנה מאוד

                // הפעל אפקט קונפטי
                if (typeof confetti === 'function') { // ודא שהספרייה נטענה
                   // ירייה בסיסית
                   confetti({
                       particleCount: 150, // כמות חלקיקים
                       spread: 90,        // זווית פיזור
                       origin: { y: 0.6 }, // מיקום התחלה (0.6 = קצת מתחת לאמצע המסך)
                       zIndex: 2001       // ודא שהקונפטי מעל המודאל
                   });

                   // דוגמה לאפקט מתקדם יותר (לא חובה):
                   /*
                   var end = Date.now() + (3 * 1000); // משך האנימציה (3 שניות)
                   var colors = ['#ec4899', '#22d3ee', '#a3e635', '#f8fafc']; // צבעים מהערכה שלך

                   (function frame() {
                     confetti({
                       particleCount: 4,
                       angle: 60,
                       spread: 55,
                       origin: { x: 0 },
                       colors: colors,
                       zIndex: 2001
                     });
                     confetti({
                       particleCount: 4,
                       angle: 120,
                       spread: 55,
                       origin: { x: 1 },
                       colors: colors,
                       zIndex: 2001
                     });

                     if (Date.now() < end) {
                       requestAnimationFrame(frame);
                     }
                   }());
                   */

                } else {
                    console.warn("Confetti library (canvas-confetti) not loaded.");
                }

                // סמן שההודעה הוצגה בסשן זה
                sessionStorage.setItem('welcomeShown', 'true');
            }, 700); // השהייה של 700ms לפני שהמודאל מופיע
        }

        // פונקציה לסגירת המודאל
        const closeModal = () => {
            welcomeModal.classList.remove('visible'); // הפעל אנימציית יציאה
            // המתן לסיום האנימציה לפני הסתרה מלאה (display: none)
            setTimeout(() => {
                 welcomeModal.style.display = 'none';
            }, 400); // זמן זהה למשך האנימציה ב-CSS
        };

        // הוספת אירועי לחיצה לסגירה
        closeModalBtn.addEventListener('click', closeModal);

        // אופציונלי: סגירה בלחיצה על הרקע השקוף מחוץ לחלון
        welcomeModal.addEventListener('click', (event) => {
            // event.target הוא האלמנט שעליו לחצו
            if (event.target === welcomeModal) {
                closeModal();
            }
        });

        // אופציונלי: סגירה בלחיצה על כפתור ה-CTA
        // if (modalCtaBtn) {
        //     modalCtaBtn.addEventListener('click', closeModal); // סוגר את המודאל ומוביל ללינק
        // }

         // אופציונלי: סגירה בלחיצה על מקש Escape
         document.addEventListener('keydown', (event) => {
             if (event.key === 'Escape' && welcomeModal.classList.contains('visible')) {
                 closeModal();
             }
         });

    } else {
        console.error("Could not find Welcome modal elements (welcome-modal or close-modal-btn).");
    }
    // --- End of Welcome Modal ---

    // ==========================================
    // ===== סוף קוד המודאל והקונפטי =====
    // ==========================================


}); // End of DOMContentLoaded
