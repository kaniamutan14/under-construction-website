// main.js

document.addEventListener('DOMContentLoaded', () => {
    // Reveal body smoothly after a tiny delay for tailwind parsing
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 150);

    // ---- Page Navigation State ----
    const pagePlayground = document.getElementById('page-playground');
    const pageRoast = document.getElementById('page-roast');

    const navigateToRoast = (e, updateHistory = true) => {
        if(e) e.preventDefault();
        pagePlayground.classList.remove('active');
        pagePlayground.classList.add('hidden');
        pageRoast.classList.remove('hidden');
        pageRoast.classList.add('active');
        window.scrollTo(0,0);
        
        if (updateHistory) {
            history.pushState({ page: 'roast' }, '', '#roast');
        }

        // Reset roast buttons state on enter
        const roastBtns = document.querySelectorAll('.btn-roast');
        roastBtns.forEach(btn => {
            btn.classList.remove('glitch-error');
            if (btn.getAttribute('data-original-text')) {
                btn.textContent = btn.getAttribute('data-original-text');
            }
            btn.dataset.clicks = 0;
        });
    };

    const navigateToPlayground = (e, updateHistory = true) => {
        if(e) e.preventDefault();
        pageRoast.classList.remove('active');
        pageRoast.classList.add('hidden');
        pagePlayground.classList.remove('hidden');
        pagePlayground.classList.add('active');
        window.scrollTo(0,0);
        
        if (updateHistory) {
            history.pushState({ page: 'playground' }, '', window.location.pathname);
        }

        // hide modal if open
        document.getElementById('sassy-modal').classList.remove('modal-active-flex');
        document.getElementById('sassy-modal').classList.add('hidden');
    };

    // Attach trap logic to all trap links
    const trapLinks = document.querySelectorAll('.btn-trap');
    trapLinks.forEach(link => {
        link.addEventListener('click', (e) => navigateToRoast(e, true));
    });

    // Escape button
    const btnEscape = document.getElementById('btn-escape');
    if (btnEscape) {
        btnEscape.addEventListener('click', (e) => navigateToPlayground(e, true));
    }
    
    // Header back button
    const btnHeaderBack = document.getElementById('btn-header-back');
    if (btnHeaderBack) {
        btnHeaderBack.addEventListener('click', (e) => navigateToPlayground(e, true));
    }

    // Handle back/forward buttons
    window.addEventListener('popstate', (e) => {
        if (window.location.hash === '#roast') {
            navigateToRoast(null, false);
        } else {
            navigateToPlayground(null, false);
        }
    });

    // Check initial hash on load
    if (window.location.hash === '#roast') {
        navigateToRoast(null, false);
    } else {
        history.replaceState({ page: 'playground' }, '', window.location.pathname);
    }

    // ---- Roast Page Button Logic (The Trap) ----
    const roastBtns = document.querySelectorAll('.btn-roast');
    const modal = document.getElementById('sassy-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');

    roastBtns.forEach(btn => {
        // Store original text
        btn.setAttribute('data-original-text', btn.innerHTML);
        btn.dataset.clicks = 0;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            let clicks = parseInt(btn.dataset.clicks);
            clicks++;
            btn.dataset.clicks = clicks;

            if (clicks === 1) {
                // First click: Glitch effect
                btn.classList.add('glitch-error');
                btn.innerHTML = "ERROR!";
                
                // Remove glitch class after animation so it can be retriggered if needed
                setTimeout(() => {
                    btn.classList.remove('glitch-error');
                }, 300); // 300ms matches our glitch-skew animation
            } else if (clicks >= 2) {
                // Second click: Sassy Modal
                modal.classList.remove('hidden');
                modal.classList.add('modal-active-flex');
            }
        });
    });

    // Close Modal Button
    if(btnCloseModal) {
        btnCloseModal.addEventListener('click', () => {
            modal.classList.remove('modal-active-flex');
            modal.classList.add('hidden');
        });
    }

    // ---- Easter Egg 1: Falling LEGOs ----
    const legoWord = document.getElementById('lego-word');
    if (legoWord) {
        legoWord.addEventListener('click', () => {
            if (legoWord.dataset.clicked) return;
            legoWord.dataset.clicked = true;
            
            // Fix container size to prevent layout shift
            const rect = legoWord.getBoundingClientRect();
            legoWord.style.width = `${rect.width}px`;
            legoWord.style.height = `${rect.height}px`;
            legoWord.style.display = 'inline-block';
            legoWord.style.whiteSpace = 'nowrap';
            
            const letters = legoWord.innerText.split('');
            legoWord.innerHTML = '';
            letters.forEach((char, index) => {
                const span = document.createElement('span');
                span.innerText = char;
                span.style.display = 'inline-block';
                // Delay each letter slightly for a cool effect
                span.style.animationDelay = `${index * 0.1}s`;
                legoWord.appendChild(span);
                
                // Trigger reflow and add animation class
                window.requestAnimationFrame(() => {
                    span.classList.add('lego-falling');
                });

                // Lock the end state so the animation doesn't replay when navigating between pages
                setTimeout(() => {
                    span.classList.remove('lego-falling');
                    span.style.opacity = '0';
                }, 1500 + (index * 100));
            });
            legoWord.style.pointerEvents = 'none';
        });
    }

    // ---- Newsletter Form Interception ----
    const newsletterForm = document.getElementById('roast-newsletter-form');
    const emailInput = document.getElementById('roast-email');
    const playgroundNewsletterForm = document.getElementById('playground-newsletter-form');
    const playgroundEmailInput = document.getElementById('playground-email');
    const newsletterModal = document.getElementById('newsletter-modal');
    const btnCloseNewsletter = document.getElementById('btn-close-newsletter');
    const emailDisplay = document.getElementById('newsletter-email-display');

    const handleEmailSubmit = (e, inputEl) => {
        e.preventDefault();
        const email = inputEl.value;
        emailDisplay.innerText = email || "nobody@nowhere.com";
        
        // Ensure we navigate to the roast page
        if (!pagePlayground.classList.contains('hidden')) {
            navigateToRoast(null, true);
        }
        
        newsletterModal.classList.remove('hidden');
        newsletterModal.classList.add('modal-active-flex');
        inputEl.value = ''; // clear
    };

    if(newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => handleEmailSubmit(e, emailInput));
    }
    
    if(playgroundNewsletterForm) {
        playgroundNewsletterForm.addEventListener('submit', (e) => handleEmailSubmit(e, playgroundEmailInput));
    }

    if(btnCloseNewsletter) {
        btnCloseNewsletter.addEventListener('click', () => {
            newsletterModal.classList.remove('modal-active-flex');
            newsletterModal.classList.add('hidden');
        });
    }

    // ---- Chaos Meter Logic ----
    const meterWrapper = document.getElementById('chaos-meter-wrapper');
    const chaosBar = document.getElementById('chaos-bar');
    const chaosPercentageText = document.getElementById('chaos-percentage');
    const tooltip = document.getElementById('chaos-tooltip');
    const puddleContainer = document.getElementById('puddle-container');
    
    let chaosInterval;
    let currentPercent = 68;
    let isBroken = false;
    let meterClicks = 0;

    // Start random fluctuations
    const startChaosFluctuation = () => {
        chaosInterval = setInterval(() => {
            if(isBroken) return;
            // Generate random percent between 30 and 99
            const newPercent = Math.floor(Math.random() * 70) + 30;
            currentPercent = newPercent;
            
            chaosBar.style.width = `${newPercent}%`;
            chaosPercentageText.innerText = `${newPercent}%`;
            
            // Move tooltip to match
            tooltip.style.left = `${newPercent}%`;
            
            if(newPercent > 90) {
                tooltip.innerText = "DANGER ZONE!";
                tooltip.classList.add("bg-error", "text-on-error");
            } else {
                tooltip.innerText = "ALMOST THERE!";
                tooltip.classList.remove("bg-error", "text-on-error");
            }
        }, 2000);
    };

    startChaosFluctuation();

    // The Easter Egg: Breaking the Chaos Meter
    meterWrapper.addEventListener('click', () => {
        if(isBroken) return;
        meterClicks++;

        if(meterClicks === 1) {
            meterWrapper.style.transform = "scale(0.98)";
            setTimeout(() => { meterWrapper.style.transform = "scale(1)"; }, 150);
        } else if(meterClicks === 2) {
            meterWrapper.style.transform = "scale(1.02) rotate(2deg)";
            setTimeout(() => { meterWrapper.style.transform = "scale(1)"; }, 150);
        } else if(meterClicks >= 3) {
            // TRIGGER BREAK
            isBroken = true;
            clearInterval(chaosInterval);
            
            // Visual Break
            meterWrapper.classList.add('meter-broken');
            tooltip.innerText = "CRITICAL FAILURE";
            tooltip.classList.add("bg-error", "text-on-error");

            // Start draining the bar
            chaosBar.style.transition = 'width 3s ease-in';
            chaosBar.style.width = `0%`;
            chaosPercentageText.innerText = `ERR%`;

            // Spawn fluid drops based on current percentage
            const totalDropsToSpawn = Math.floor(currentPercent * 1.5); // Lots of small drops
            let dropsSpawned = 0;

            const dripInterval = setInterval(() => {
                if(dropsSpawned >= totalDropsToSpawn) {
                    clearInterval(dripInterval);
                    return;
                }

                // Create drop
                const drop = document.createElement('div');
                drop.classList.add('fluid-drop');
                
                // Position accurately at the leaking end of the bar!
                const rect = chaosBar.getBoundingClientRect();
                
                // Spawn from the right-edge of the shrinking bar
                const leftPos = rect.right - 10 + (Math.random() * 20); 
                const topPos = rect.bottom - 10 + (Math.random() * 20);
                
                // Use fixed positioning so it matches absolute viewport coordinates exactly
                drop.style.position = 'fixed';
                drop.style.left = `${leftPos}px`;
                drop.style.top = `${topPos}px`;
                drop.style.zIndex = '9999';
                document.body.appendChild(drop);

                // No puddle! Just clean up the drop after it falls offscreen
                setTimeout(() => {
                    drop.remove();
                }, 1500);

                dropsSpawned++;
                
                // Update percentage text down to 0 manually
                const fakePercent = Math.max(0, currentPercent - Math.floor((dropsSpawned / totalDropsToSpawn) * currentPercent));
                chaosPercentageText.innerText = `${fakePercent}%`;
                tooltip.style.left = `${fakePercent}%`;

            }, 3000 / totalDropsToSpawn); // Space them out evenly over the 3 seconds it takes to drain
        }
    });

    // ---- Easter Egg 3: Console Log ----
    console.log("%c👷‍♂️ WAIT!", "color: red; font-size: 40px; font-weight: bold;");
    console.log("%cWhy are you looking in the console? We already told you the site isn't finished. Go away.", "color: orange; font-size: 16px; font-family: monospace;");
});
