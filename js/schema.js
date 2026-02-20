// ============================================
// MOBILE.JS - Мобильная оптимизация для МИРУМ
// Версия: 3.0 (20.02.2026) - Упрощенная версия
// ============================================

(function() {
    'use strict';
    
    console.log('📱 Загружаем mobile.js v3.0...');
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📱 DOM загружен, инициализация...');
        
        initMobileMenu();
        initMobileOptimizations();
    });
    
    function initMobileMenu() {
        console.log('📱 Инициализация мобильного меню...');
        
        const menuToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');
        
        if (!menuToggle || !mobileNav) {
            console.warn('📱 Элементы мобильного меню не найдены');
            return;
        }
        
        console.log('✅ Мобильное меню найдено');
        
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            
            if (mobileNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                console.log('📱 Меню открыто');
            } else {
                document.body.style.overflow = '';
                console.log('📱 Меню закрыто');
            }
        });
        
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        document.addEventListener('click', function(e) {
            if (mobileNav.classList.contains('active') && 
                !mobileNav.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        const mobileDropdowns = mobileNav.querySelectorAll('.mobile-dropdown');
        mobileDropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.mobile-dropdown-toggle');
            
            if (toggle) {
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    mobileDropdowns.forEach(other => {
                        if (other !== dropdown && other.classList.contains('active')) {
                            other.classList.remove('active');
                        }
                    });
                    
                    dropdown.classList.toggle('active');
                });
            }
        });
    }
    
    function initMobileOptimizations() {
        console.log('📱 Применяем общую мобильную оптимизацию...');
        
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, { rootMargin: '50px' });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            images.forEach(img => img.classList.add('loaded'));
        }
        
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                const menuToggle = document.getElementById('mobileMenuToggle');
                const mobileNav = document.getElementById('mobileNav');
                
                if (menuToggle && mobileNav && mobileNav.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
        
        console.log('✅ Мобильная оптимизация завершена');
    }
})();