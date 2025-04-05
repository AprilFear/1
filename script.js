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


}); // End of DOMContentLoaded