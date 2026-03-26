import { IconChevronDown, IconHome, IconShoppingBag, IconInfoCircle, IconShoppingCart } from '@tabler/icons-react';
import {Center, Container, Group, Menu, Button} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/useAuthStore'; // adjust path if needed

import classes from './NavBar.module.css';

const links = [
  { link: '/', label: 'Home', icon: <IconHome size={18} /> },
  {
    link: '/products',
    label: 'Shop',
    icon: <IconShoppingBag size={18} />,
    links: [
      { link: '/products',                      label: 'All Products' },
      { link: '/products?category=electronics', label: 'Electronics' },
      { link: '/products?category=clothing',    label: 'Clothing' },
      { link: '/products?category=accessories', label: 'Accessories' },
      { link: '/products/best-sellers',         label: 'Best Sellers' },
      { link: '/products/new',                  label: 'New Arrivals' },
    ],
  },
  { link: '/about',           label: 'About Us', icon: <IconInfoCircle size={18} /> },
  { link: '/cart',            label: 'Cart',     icon: <IconShoppingCart size={18} /> },
  { link: '/adminDash',       label: 'Admin' },
  { link: '/admin/products',  label: 'Admin Products' },
];

export default function HeaderMenu() {
  const username = useAuthStore(s => s.userName);
  
  const clearToken = useAuthStore(s => s.clearToken);
  const clearUsername = useAuthStore(s => s.clearUsername);
  const role= useAuthStore((s)=>s.role);
  console.log('Role:', role);

  const roleLinks = links
  .filter((item) => {
    if (item.link.startsWith('/admin') && role !== 'admin') {
      return false;
    }
    return true;
  })

  const navigate = useNavigate();

  const items = roleLinks.map((item) => {
    if (item.links) {
      const menuItems = item.links.map((sub) => (
        <Menu.Item
          key={sub.link}
          onClick={() => (window.location.href = sub.link)}
        >
          {sub.label}
        </Menu.Item>
      ));

      return (
        <Menu key={item.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
          <Menu.Target>
            <a
              href={item.link}
              className={classes.link}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = item.link;
              }}
            >
              <Center>
                {item.icon}
                <span className={classes.linkLabel}>{item.label}</span>
                <IconChevronDown size={14} stroke={1.5} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <a
        key={item.label}
        href={item.link}
        className={classes.link}
        onClick={(e) => {
          e.preventDefault();
          window.location.href = item.link;
        }}
      >
        <Center>
          {item.icon}
          <span className={classes.linkLabel}>{item.label}</span>
        </Center>
      </a>
    );
  });

  return (
    <header className={classes.header}>
      <Container className={classes.navContainer} size="xl">
        <div className={classes.inner}>
          <Group gap={10} visibleFrom="sm">
            {items}
          </Group>
          <Group className={classes.loginSection} gap="xs">
            {
              username?(
                <>
                  <p style={{'color':'white'}}>{username}</p>
                  <Button
                    className={classes.loginButton}
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      clearToken();
                      clearUsername();
                      navigate('/products');
                    }}
                  >
                    Logout
                  </Button>
                </>
              ):(
                <Button variant="outline" size="xs" onClick={() => navigate('/login')}>
                  Login
                </Button>
              )
            }
                
            {/*OLD BUTTON <Button variant="outline" size="xs" onClick={() => navigate('/login')}>
                Login
              </Button>
            <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />*/}
          </Group>
        </div>
      </Container>
    </header>
  );
}
