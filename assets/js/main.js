/*
    Massively by HTML5 UP
    html5up.net | @ajlkn
    Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

// Add API URL constant
const API_URL = 'http://68.183.131.82:3000';

// Authentication Functions
const auth = {
    // Signup Function
    signup: async (username, email, password) => {
        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, message: 'Connection error. Please try again.' };
        }
    },

    // Login Function
    login: async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('solar_token', data.token);
                localStorage.setItem('solar_days', data.daysRemaining);
            }
            return data;
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Connection error. Please try again.' };
        }
    },

    // Verify Email Function
    verify: async (token) => {
        try {
            const response = await fetch(`${API_URL}/verify?token=${token}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Verification error:', error);
            return { success: false, message: 'Verification failed. Please try again.' };
        }
    },

    // Check if user is logged in
    checkAuth: () => {
        const token = localStorage.getItem('solar_token');
        return !!token;
    },

    // Logout Function
    logout: () => {
        localStorage.removeItem('solar_token');
        localStorage.removeItem('solar_days');
        window.location.href = 'login.html';
    }
};

// Form Handlers
document.addEventListener('DOMContentLoaded', () => {
    // Signup Form Handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const result = await auth.signup(username, email, password);
            if (result.success) {
                alert('Account created! Please check your email to verify.');
                window.location.href = 'login.html';
            } else {
                const errorMsg = document.getElementById('error-message');
                errorMsg.textContent = result.message;
                errorMsg.style.display = 'block';
            }
        });
    }

    // Login Form Handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            const result = await auth.login(username, password);
            if (result.success) {
                alert(`Login successful! You have ${result.daysRemaining} days remaining.`);
                window.location.href = 'dashboard.html';
            } else {
                const errorMsg = document.getElementById('error-message');
                errorMsg.textContent = result.message;
                errorMsg.style.display = 'block';
            }
        });
    }

    // Verification Handler
    if (window.location.pathname.includes('verify.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            auth.verify(token).then(result => {
                const statusDiv = document.getElementById('verificationStatus');
                if (result.success) {
                    statusDiv.innerHTML = `
                        <h3>Account Verified Successfully!</h3>
                        <p>Your account has been verified. You can now proceed to login.</p>
                        <a href="login.html" class="button primary">Login Now</a>
                    `;
                } else {
                    statusDiv.innerHTML = `
                        <h3>Verification Failed</h3>
                        <p>${result.message}</p>
                        <a href="signup.html" class="button">Try Again</a>
                    `;
                }
            });
        }
    }

    // Dashboard Protection
    if (window.location.pathname.includes('dashboard.html')) {
        if (!auth.checkAuth()) {
            window.location.href = 'login.html';
        }
    }
});

(function($) {
    var $window = $(window),
        $body = $('body'),
        $wrapper = $('#wrapper'),
        $header = $('#header'),
        $nav = $('#nav'),
        $main = $('#main'),
        $navPanelToggle, $navPanel, $navPanelInner;

    // Breakpoints.
    breakpoints({
        default:   ['1681px',   null       ],
        xlarge:    ['1281px',   '1680px'   ],
        large:     ['981px',    '1280px'   ],
        medium:    ['737px',    '980px'    ],
        small:     ['481px',    '736px'    ],
        xsmall:    ['361px',    '480px'    ],
        xxsmall:   [null,       '360px'    ]
    });

    /**
     * Applies parallax scrolling to an element's background image.
     * @return {jQuery} jQuery object.
     */
    $.fn._parallax = function(intensity) {
        var $window = $(window),
            $this = $(this);

        if (this.length == 0 || intensity === 0)
            return $this;

        if (this.length > 1) {
            for (var i=0; i < this.length; i++)
                $(this[i])._parallax(intensity);
            return $this;
        }

        if (!intensity)
            intensity = 0.25;

        $this.each(function() {
            var $t = $(this),
                $bg = $('<div class="bg"></div>').appendTo($t),
                on, off;

            on = function() {
                $bg
                    .removeClass('fixed')
                    .css('transform', 'matrix(1,0,0,1,0,0)');

                $window
                    .on('scroll._parallax', function() {
                        var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);
                        $bg.css('transform', 'matrix(1,0,0,1,0,' + (pos * intensity) + ')');
                    });
            };

            off = function() {
                $bg
                    .addClass('fixed')
                    .css('transform', 'none');

                $window
                    .off('scroll._parallax');
            };

            // Disable parallax on ..
            if (browser.name == 'ie'          // IE
            ||  browser.name == 'edge'        // Edge
            ||  window.devicePixelRatio > 1   // Retina/HiDPI (= poor performance)
            ||  browser.mobile)               // Mobile devices
                off();
            // Enable everywhere else.
            else {
                breakpoints.on('>large', on);
                breakpoints.on('<=large', off);
            }
        });

        $window
            .off('load._parallax resize._parallax')
            .on('load._parallax resize._parallax', function() {
                $window.trigger('scroll');
            });

        return $(this);
    };

    // Play initial animations on page load.
    $window.on('load', function() {
        window.setTimeout(function() {
            $body.removeClass('is-preload');
        }, 100);
    });

    // Scrolly.
    $('.scrolly').scrolly();

    // Background.
    $wrapper._parallax(0.925);

    // Nav Panel.

    // Toggle.
    $navPanelToggle = $(
        '<a href="#navPanel" id="navPanelToggle">Menu</a>'
    )
        .appendTo($wrapper);

    // Change toggle styling once we've scrolled past the header.
    $header.scrollex({
        bottom: '5vh',
        enter: function() {
            $navPanelToggle.removeClass('alt');
        },
        leave: function() {
            $navPanelToggle.addClass('alt');
        }
    });

    // Panel.
    $navPanel = $(
        '<div id="navPanel">' +
            '<nav>' +
            '</nav>' +
            '<a href="#navPanel" class="close"></a>' +
        '</div>'
    )
        .appendTo($body)
        .panel({
            delay: 500,
            hideOnClick: true,
            hideOnSwipe: true,
            resetScroll: true,
            resetForms: true,
            side: 'right',
            target: $body,
            visibleClass: 'is-navPanel-visible'
        });

    // Get inner.
    $navPanelInner = $navPanel.children('nav');

    // Move nav content on breakpoint change.
    var $navContent = $nav.children();

    breakpoints.on('>medium', function() {
        // NavPanel -> Nav.
        $navContent.appendTo($nav);

        // Flip icon classes.
        $nav.find('.icons, .icon')
            .removeClass('alt');
    });

    breakpoints.on('<=medium', function() {
        // Nav -> NavPanel.
        $navContent.appendTo($navPanelInner);

        // Flip icon classes.
        $navPanelInner.find('.icons, .icon')
            .addClass('alt');
    });

    // Hack: Disable transitions on WP.
    if (browser.os == 'wp' && browser.osVersion < 10)
        $navPanel.css('transition', 'none');

    // Intro.
    var $intro = $('#intro');

    if ($intro.length > 0) {
        // Hack: Fix flex min-height on IE.
        if (browser.name == 'ie') {
            $window.on('resize.ie-intro-fix', function() {
                var h = $intro.height();

                if (h > $window.height())
                    $intro.css('height', 'auto');
                else
                    $intro.css('height', h);
            }).trigger('resize.ie-intro-fix');
        }

        // Hide intro on scroll (> small).
        breakpoints.on('>small', function() {
            $main.unscrollex();

            $main.scrollex({
                mode: 'bottom',
                top: '25vh',
                bottom: '-50vh',
                enter: function() {
                    $intro.addClass('hidden');
                },
                leave: function() {
                    $intro.removeClass('hidden');
                }
            });
        });

        // Hide intro on scroll (<= small).
        breakpoints.on('<=small', function() {
            $main.unscrollex();

            $main.scrollex({
                mode: 'middle',
                top: '15vh',
                bottom: '-15vh',
                enter: function() {
                    $intro.addClass('hidden');
                },
                leave: function() {
                    $intro.removeClass('hidden');
                }
            });
        });
    }
})(jQuery);
