// SideBar.tsx
import React from 'react';
import styles from './SideBar.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../stores/useAuthStore';

type NavItem = {
    label: string;
    icon: string;
    path: string;
    adminOnly?: boolean;
};

const navItems: NavItem[] = [
    { label: 'Home',       icon: 'pi pi-home',         path: '/home' },
    { label: 'Products',   icon: 'pi pi-shopping-bag', path: '/products' },
    { label: 'Cart',       icon: 'pi pi-cart-plus',    path: '/cart' },
    { label: 'Checkout',   icon: 'pi pi-credit-card',  path: '/checkout' },
    { label: 'About Us',   icon: 'pi pi-info-circle',  path: '/about' },
];

const adminItems: NavItem[] = [
    { label: 'Dashboard',       icon: 'pi pi-chart-bar',  path: '/adminDash',       adminOnly: true },
    { label: 'Manage Products', icon: 'pi pi-cog',        path: '/admin/products',  adminOnly: true },
];

export default function SideBar() {
    const navigate   = useNavigate();
    const location   = useLocation();
    const role       = useAuthStore(state => state.role);
    const userName   = useAuthStore(state => state.userName);
    const clearToken = useAuthStore(state => state.clearToken);
    const clearRole  = useAuthStore(state => state.clearRole);
    const clearUsername = useAuthStore(state => state.clearUsername);

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        clearToken();
        clearRole();
        clearUsername();
        navigate('/login');
    };

    return (
        <aside className={styles.sidebar}>

            {/* User badge */}
            <div className={styles.userBadge}>
                <i className="pi pi-user" style={{ fontSize: '1.4rem', color: '#3b82f6' }} />
                <div className={styles.userInfo}>
                    <span className={styles.userName}>{userName ?? 'Guest'}</span>
                    <span className={styles.userRole}>{role ?? 'Not logged in'}</span>
                </div>
            </div>

            <hr className={styles.divider} />

            {/* Main nav */}
            <p className={styles.sectionLabel}>NAVIGATION</p>
            <nav>
                <ul className={styles.menu}>
                    {navItems.map(item => (
                        <li
                            key={item.path}
                            className={`${styles.menuItem} ${isActive(item.path) ? styles.active : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            <i className={`${item.icon} ${styles.menuIcon}`} />
                            <span>{item.label}</span>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Admin section — only rendered if role is admin */}
            {role === 'admin' && (
                <>
                    <hr className={styles.divider} />
                    <p className={styles.sectionLabel}>ADMIN</p>
                    <nav>
                        <ul className={styles.menu}>
                            {adminItems.map(item => (
                                <li
                                    key={item.path}
                                    className={`${styles.menuItem} ${isActive(item.path) ? styles.active : ''}`}
                                    onClick={() => navigate(item.path)}
                                >
                                    <i className={`${item.icon} ${styles.menuIcon}`} />
                                    <span>{item.label}</span>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </>
            )}

            {/* Logout at bottom */}
            <div className={styles.bottomSection}>
                <hr className={styles.divider} />
                <ul className={styles.menu}>
                    <li className={`${styles.menuItem} ${styles.logoutItem}`} onClick={handleLogout}>
                        <i className={`pi pi-sign-out ${styles.menuIcon}`} />
                        <span>Logout</span>
                    </li>
                </ul>
            </div>

        </aside>
    );
}