// Common Header Component
function loadHeader() {
    return `
    <header class="header">
        <div class="header-top">
            <div class="container">
                <a href="../index.html" class="logo-section">
                    <div class="university-logo">
                        <img src="../assets/HYU_logo.png" alt="한양대학교 로고">
                    </div>
                    <div class="project-logo">
                        <h1>HY HCI Group</h1>
                    </div>
                </a>
            </div>
        </div>

        <!-- Navigation -->
        <nav class="main-nav">
            <div class="container">
                <ul class="nav-menu">
                    <li class="nav-item">
                        <a href="../about/about.html">About</a>
                    </li>
                    <li class="nav-item">
                        <a href="../people/people.html">People</a>
                    </li>
                    <li class="nav-item">
                        <a href="../community/notice.html">News</a>
                    </li>
                    <li class="nav-item">
                        <a href="../community/news.html">Events</a>
                    </li>
                    <li class="nav-item">
                        <a href="../community/gallery.html">Gallery</a>
                    </li>
                </ul>
                <button class="mobile-menu-toggle" aria-label="메뉴 열기">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    </header>
    `;
}

// Common Footer Component
function loadFooter() {
    return `
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-info">
                    <h3>HY HCI Group</h3>
                    <p>Location: 222, Wangsimni-ro, Seongdong-gu, Seoul, Republic of Korea</p>
                    <p>Administrator: myungkim331@hanyang.ac.kr</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 HY HCI Group. All rights reserved.</p>
            </div>
        </div>
    </footer>
    `;
}

// Initialize page with header and footer
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = loadHeader();
    }

    // Load footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = loadFooter();
    }

    // Reinitialize mobile menu after header is loaded
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');

            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(8px, 8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.main-nav') && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');

                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
});
