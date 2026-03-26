import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProductsPage       from './pages/ProductsPage';
import ProductDetailPage  from './pages/ProductDetail/ProductDetail';
import CartPage from './pages/CartPage/CartPage';
import AdminDashboard from './pages/AdminDashboard/AdminDashBoard';
import ProductsPageAdmin from './pages/ProductsPageAdmin';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import AboutUs from './pages/AboutUs/AboutUs';
import HomePage from './pages/Hompage/Hompage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';


function App() {
  return (
    <MantineProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/admin/products" element={<ProductsPageAdmin />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/adminDash" element={<AdminDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/about" element={<AboutUs/>} />
        <Route path="/home" element={<HomePage/>} />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
