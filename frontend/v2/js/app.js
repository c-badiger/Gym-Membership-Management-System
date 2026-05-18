document.addEventListener('DOMContentLoaded', () => {
  // Mobile Sidebar Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (mobileToggle && sidebar && overlay) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.add('show');
      overlay.classList.add('show');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
    });
  }

  // Active Link Highlighting (Based on URL or Data Attribute)
  const navItems = document.querySelectorAll('.nav-item');
  const currentPath = window.location.pathname.split('/').pop();
  
  navItems.forEach(item => {
    // Basic active state logic for the prototype
    if (item.getAttribute('href') === currentPath) {
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
    }
    
    item.addEventListener('click', function() {
      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Chart Animation (for prototype only)
  const bars = document.querySelectorAll('.bar');
  bars.forEach(bar => {
    const height = bar.style.height;
    bar.style.height = '0';
    setTimeout(() => {
      bar.style.transition = 'height 1s ease-out';
      bar.style.height = height;
    }, 100);
  });
});
