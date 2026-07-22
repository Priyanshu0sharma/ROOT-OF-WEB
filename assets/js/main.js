// Preloader - Instant Millisecond Load Optimization
document.body.style.overflow = 'hidden';
function removePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader && !preloader.classList.contains('done')) {
    preloader.classList.add('done');
    document.body.style.overflow = '';
    window.dispatchEvent(new Event('scroll'));
  }
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
  setTimeout(removePreloader, 150);
} else {
  document.addEventListener('DOMContentLoaded', () => setTimeout(removePreloader, 150));
  window.addEventListener('load', () => setTimeout(removePreloader, 150));
  setTimeout(removePreloader, 350);
}


    // Nav scroll
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 60); });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileBtn && navMenu) {
      mobileBtn.addEventListener('click', () => {
        mobileBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
      });
      // Close menu when clicking a link
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
          mobileBtn.classList.remove('active');
          navMenu.classList.remove('active');
        });
      });
    }

    // Scroll reveal
    const reveals = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), e.target.dataset.delay || 0);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el, i) => {
      el.dataset.delay = (i % 3) * 80;
      io.observe(el);
    });

    // 3D Interactive Card Tilt Engine (Flutter-style Motion)
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rx = (y / (rect.height / 2)) * -6;
        const ry = (x / (rect.width / 2)) * 6;
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.015, 1.015, 1.015)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      });
    });

    // Counter animation
    function animCount(el, target, suffix = '') {
      let start = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        start += step;
        if (start >= target) { el.textContent = target + suffix; clearInterval(timer); }
        else el.textContent = Math.floor(start) + suffix;
      }, 16);
    }

    // Form submit
    const formSubmit = document.querySelector('.form-submit:not(#admin-modal .form-submit)');
    if (formSubmit) {
      formSubmit.addEventListener('click', function () {
        this.textContent = 'Message Sent ✓';
        this.style.background = '#2d4a39';
        this.style.color = '#B8922A';
        setTimeout(() => { this.textContent = 'Send Message'; this.style.background = ''; this.style.color = ''; }, 3000);
      });
    }

    // Admin Login Logic
    const navLogo = document.querySelector('.nav-logo');
    const adminModal = document.getElementById('admin-modal');
    
    navLogo.addEventListener('click', (e) => {
      e.preventDefault();
      adminModal.style.display = 'flex';
      setTimeout(() => adminModal.classList.add('active'), 10);
    });

    function closeAdminModal() {
      adminModal.classList.remove('active');
      setTimeout(() => adminModal.style.display = 'none', 300);
    }

    function attemptAdminLogin() {
      const email = document.getElementById('admin-email').value;
      const pass = document.getElementById('admin-password').value;
      const err = document.getElementById('admin-error');
      
      const isAdmin = (email === 'priyanshusharma1131@gmail.com' && pass === 'Zero9352286423@');
      const isEditor = (email === 'rootofwebs@gmail.com' && pass === 'RootOfWeb@24EARAD');

      if(isAdmin || isEditor) {
        err.style.display = 'none';
        closeAdminModal();
        
        // Setup Toolbar if not exists
        if(!document.getElementById('admin-toolbar')) {
            const tb = document.createElement('div');
            tb.id = 'admin-toolbar';
            tb.style.cssText = 'position:fixed; bottom:40px; left:50%; transform:translateX(-50%); background:var(--gold); color:var(--charcoal); z-index:10000; padding:12px 24px; display:flex; gap: 24px; align-items:center; font-family:"DM Sans", sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border-radius: 50px;';
            tb.innerHTML = '<div style="font-weight:bold; letter-spacing:2px; font-size:14px; text-transform:uppercase;">Admin Edit Mode Active</div><button onclick="saveAndExitAdmin()" style="background:var(--charcoal); color:var(--gold); border:none; border-radius: 30px; padding:10px 24px; cursor:pointer; font-weight:bold; font-size:12px; letter-spacing:1px; text-transform:uppercase; transition:all 0.3s;">Save & Exit</button>';
            document.body.prepend(tb);
        }
        document.getElementById('admin-toolbar').style.display = 'flex';
        
        // Check for pending drafts if God Admin
        if(isAdmin) {
            fetch(`/api/save?action=check_draft&email=${encodeURIComponent(email)}&password=${encodeURIComponent(pass)}`)
            .then(res => res.json())
            .then(data => {
                if(data.status === 'success' && data.has_draft) {
                    let reqBtn = document.getElementById('pending-req-btn');
                    if(!reqBtn) {
                        reqBtn = document.createElement('button');
                        reqBtn.id = 'pending-req-btn';
                        reqBtn.innerHTML = '🔔 1 Pending Request';
                        reqBtn.style.cssText = 'background:#e74c3c; color:#fff; border:none; border-radius: 30px; padding:10px 24px; cursor:pointer; font-weight:bold; font-size:12px; letter-spacing:1px; text-transform:uppercase; transition:all 0.3s; margin-left: 10px; animation: pulseBtn 2s infinite;';
                        reqBtn.onclick = () => {
                            const modal = document.getElementById('request-box-modal');
                            if(modal) {
                                modal.style.display = 'flex';
                                setTimeout(() => modal.classList.add('active'), 10);
                            }
                        };
                        document.getElementById('admin-toolbar').appendChild(reqBtn);
                        
                        if(!document.getElementById('pulse-anim')) {
                            const style = document.createElement('style');
                            style.id = 'pulse-anim';
                            style.innerHTML = '@keyframes pulseBtn { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }';
                            document.head.appendChild(style);
                        }
                    }
                    reqBtn.style.display = 'block';
                }
            }).catch(e => console.error(e));
        }
        
        // Show Add Social Button
        const addBtn = document.querySelector('.admin-add-social-btn');
        if(addBtn) addBtn.style.display = 'inline-flex';
        
        // Make text elements editable
        const editables = document.querySelectorAll('h1, h2, h3, h4, h5, p, span, a, button, .service-name, .pricing-name, .project-name');
        editables.forEach(el => {
            if(el.id === 'admin-toolbar' || el.closest('#admin-toolbar') || el.classList.contains('admin-link-edit-wrapper')) return;
            el.contentEditable = "true";
            el.style.outline = "1px dashed rgba(184, 146, 42, 0.6)";
            el.style.outlineOffset = "2px";
        });

        // Add link edit buttons only for external/non-anchor links
        document.querySelectorAll('a').forEach(a => {
            if(a.querySelector('.admin-link-edit-wrapper') || a.closest('#admin-toolbar')) return;
            
            // Skip main navigation links and the logo itself
            const href = a.getAttribute('href') || '';
            const isNavAnchor = ['#home', '#services', '#pricing', '#work', '#team', '#contact'].includes(href);
            if (isNavAnchor || a.classList.contains('nav-logo')) return;

            const editWrapper = document.createElement('div');
            editWrapper.className = 'admin-link-edit-wrapper';
            editWrapper.style.cssText = 'position: absolute; bottom: -30px; left: 0; background: var(--charcoal); color: var(--gold); font-size: 11px; padding: 6px 10px; cursor: pointer; border: 1px solid var(--gold); border-radius: 4px; z-index: 10000; display: inline-block; font-weight: bold; font-family: sans-serif; line-height: 1; white-space:nowrap;';
            editWrapper.contentEditable = "false";
            editWrapper.innerHTML = '🔗 Edit';
            
            if (a.classList.contains('big-social-icon')) {
                const delBtn = document.createElement('span');
                delBtn.innerHTML = ' &nbsp;🗑️';
                delBtn.style.cssText = 'color: #ff4a4a; margin-left: 4px;';
                delBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if(confirm('Delete this social icon?')) {
                        a.remove();
                    }
                };
                editWrapper.appendChild(delBtn);
            }
            
            if(getComputedStyle(a).position === 'static') {
                a.style.position = 'relative';
            }
            
            editWrapper.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const newUrl = prompt('Enter new URL for this link:', a.href);
                if (newUrl !== null) {
                    a.href = newUrl;
                    alert('Link updated successfully!');
                }
            };
            
            a.appendChild(editWrapper);
            a.dataset.oldClick = typeof a.onclick === 'function' ? 'hasFunc' : 'none';
            a.addEventListener('click', preventLinkNav);
        });
        
        document.getElementById('admin-email').value = '';
        document.getElementById('admin-password').value = '';
      } else {
        err.style.display = 'block';
      }
    }

    function preventLinkNav(e) {
      if(e.target.closest('.admin-link-edit-wrapper') || e.target.closest('.admin-add-social-btn')) return;
      e.preventDefault();
    }

    function saveAndExitAdmin() {
        document.getElementById('admin-toolbar').style.display = 'none';
        
        const addBtn = document.querySelector('.admin-add-social-btn');
        if(addBtn) addBtn.style.display = 'none';
        
        const editables = document.querySelectorAll('[contenteditable="true"]');
        editables.forEach(el => {
            el.contentEditable = "false";
            el.style.outline = "";
            el.style.outlineOffset = "";
        });

        document.querySelectorAll('.admin-link-edit-wrapper').forEach(el => el.remove());
        
        document.querySelectorAll('a').forEach(a => {
            a.removeEventListener('click', preventLinkNav);
        });

        // Get stored credentials from the modal inputs
        const email = document.getElementById('admin-email').value;
        const pass = document.getElementById('admin-password').value;
        
        // Grab clean HTML
        let htmlContent = document.documentElement.outerHTML;

        // Save to backend
        fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'save_html', email: email, password: pass, html_content: htmlContent })
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === 'success') {
                if(data.message === 'LIVE_SAVED') {
                    alert('Changes saved successfully to LIVE site! Exited Admin Mode.');
                } else {
                    alert('Changes saved as DRAFT. Waiting for Admin approval. Exited Admin Mode.');
                }
            } else {
                alert('Error saving: ' + data.message);
            }
        })
        .catch(err => {
            alert('Error saving changes. Check your connection.');
            console.error(err);
        });
    }

    function addSocialLink() {
        const url = prompt("Enter the new Social Media URL (e.g. https://linkedin.com/...):");
        if(!url) return;
        const iconName = prompt("Enter icon name (Options: linkedin, youtube, pinterest, whatsapp, github, dribbble, tiktok). If other, leave blank:", "linkedin");
        
        let svg = '';
        const name = iconName ? iconName.toLowerCase().trim() : '';
        if(name === 'linkedin') {
            svg = '<svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>';
        } else if(name === 'youtube') {
            svg = '<svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>';
        } else if(name === 'whatsapp') {
            svg = '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" stroke="none" d="M11.97 0C5.364 0 .003 5.358.003 11.964c0 2.106.548 4.162 1.588 5.975L.03 23.931l6.14-1.61c1.74.96 3.7 1.467 5.748 1.467 6.607 0 11.968-5.36 11.968-11.966C23.945 5.359 18.583 0 11.97 0zm6.536 17.114c-.28.788-1.543 1.542-2.223 1.632-.547.09-1.224.15-2.42-.28-1.42-.524-3.37-1.924-4.734-3.404-1.382-1.48-2.578-3.79-2.578-5.948 0-2.143 1.107-3.183 1.501-3.6.393-.416.857-.522 1.137-.522.28 0 .56.02.801.04.241.02.563-.09.885.686.33.786 1.125 2.74 1.224 2.942.1.202.16.443.02.724-.14.282-.2.443-.401.684-.202.242-.423.524-.602.686-.2.201-.423.423-.182.845.242.423 1.076 1.775 2.298 2.87 1.572 1.409 2.89 1.843 3.31 2.045.423.2.663.16.904-.1.242-.262 1.045-1.208 1.328-1.612.28-.403.562-.33.944-.2.383.14 2.42 1.147 2.844 1.348.423.202.704.312.804.484.1.182.1 1.016-.18 1.8z" /></svg>';
        } else if(name === 'github') {
            svg = '<svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>';
        } else if(name === 'dribbble') {
            svg = '<svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"></path></svg>';
        } else if(name === 'pinterest') {
            svg = '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" stroke="none" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.305 0 7.655 3.067 7.655 7.147 0 4.28-2.695 7.723-6.444 7.723-1.259 0-2.443-.654-2.848-1.426l-.779 2.968c-.282 1.077-1.037 2.424-1.545 3.245 1.157.34 2.391.523 3.666.523 6.621 0 11.988-5.368 11.988-11.987C24.005 5.367 18.638 0 12.017 0z"/></svg>';
        } else if(name === 'tiktok') {
            svg = '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" stroke="none" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.62-.43 3.25-1.3 4.62-1.42 2.22-3.8 3.56-6.41 3.73-2.61.16-5.22-.68-7.14-2.32-2.18-1.85-3.23-4.79-2.73-7.58.5-2.81 2.5-5.21 5.16-6.2 1.87-.7 3.93-.72 5.82-.12v4.11c-.91-.25-1.87-.27-2.78-.05-.85.2-1.63.66-2.2 1.3-.92 1.01-1.28 2.44-1.01 3.77.29 1.45 1.34 2.68 2.7 3.19 1.34.5 2.87.35 4.09-.36.98-.56 1.69-1.5 1.94-2.58.05-.2.07-.4.07-.61V.02z"/></svg>';
        } else {
            svg = '<svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
        }

        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.className = 'big-social-icon';
        a.title = iconName || 'Link';
        a.innerHTML = svg;
        
        const container = document.querySelector('.big-socials');
        const btn = document.querySelector('.admin-add-social-btn');
        container.insertBefore(a, btn);
        
        // Make new link editable immediately
        const editWrapper = document.createElement('div');
        editWrapper.className = 'admin-link-edit-wrapper';
        editWrapper.style.cssText = 'position: absolute; bottom: -30px; left: 0; background: var(--charcoal); color: var(--gold); font-size: 11px; padding: 6px 10px; cursor: pointer; border: 1px solid var(--gold); border-radius: 4px; z-index: 10000; display: inline-block; font-weight: bold; font-family: sans-serif; line-height: 1; white-space:nowrap;';
        editWrapper.contentEditable = "false";
        editWrapper.innerHTML = '🔗 Edit';
        
        const delBtn = document.createElement('span');
        delBtn.innerHTML = ' &nbsp;🗑️';
        delBtn.style.cssText = 'color: #ff4a4a; margin-left: 4px;';
        delBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if(confirm('Delete this social icon?')) {
                a.remove();
            }
        };
        editWrapper.appendChild(delBtn);

        a.style.position = 'relative';
        
        editWrapper.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const newUrl = prompt('Enter new URL for this link:', a.href);
            if (newUrl !== null) {
                a.href = newUrl;
                alert('Link updated successfully!');
            }
        };
        a.appendChild(editWrapper);
        a.dataset.oldClick = 'none';
        a.addEventListener('click', preventLinkNav);
    }

    // --- REQUEST BOX LOGIC ---
    function closeRequestBox() {
        const modal = document.getElementById('request-box-modal');
        if(modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.style.display = 'none', 300);
        }
    }

    function previewDraft() {
        window.open('draft.html', '_blank');
    }

    function approveDraft() {
        const email = document.getElementById('admin-email').value;
        const pass = document.getElementById('admin-password').value;
        
        fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'approve_draft', email: email, password: pass })
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === 'success') {
                alert('Draft approved and published to live site successfully!');
                closeRequestBox();
                document.getElementById('pending-req-btn').remove();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(err => {
            alert('Error communicating with server.');
            console.error(err);
        });
    }

    function rejectDraft() {
        if(!confirm('Are you sure you want to reject and delete this request? This cannot be undone.')) return;
        
        const email = document.getElementById('admin-email').value;
        const pass = document.getElementById('admin-password').value;
        
        fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'reject_draft', email: email, password: pass })
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === 'success') {
                alert('Request rejected and deleted.');
                closeRequestBox();
                document.getElementById('pending-req-btn').remove();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(err => {
            alert('Error communicating with server.');
            console.error(err);
        });
    }
