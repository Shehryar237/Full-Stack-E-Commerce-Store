import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import styles from './LoginPage.module.css';
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../../services/authService';

export default function LoginPage() {
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e?: React.FormEvent) => {
    try {
      if (e) e.preventDefault();
      setError(null);

      if (!email || !password) {
        setError('Please enter email and password');  
        return;
      }

      setLoading(true);
      const result = await userLogin(email, password); 
      setLoading(false);

      if (result.success) {
        navigate('/products');
      } else {
        setError(result.message || 'Login failed');
      }
    } 
    catch (err: unknown) {
      setLoading(false);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unexpected error');
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Left side */}
      <div className={styles.leftPanel}>
        <h2>Welcome Back!</h2>
        <p>Use one of the following methods to sign in:</p>
        <Button
          icon="pi pi-google"
          label="Sign in with Google"
          className={styles.customGoogleBtn}
        />
        <p className={styles.registerLink}>
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>

      {/* Right side */}
      <div className={styles.rightPanel}>
        <h2>Login</h2>
        <div className={`${styles.loginForm} p-fluid`}>
          <div className="p-field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </div>

          <div className="p-field">
            <label htmlFor="password">Password</label>
            <Password
              id="password"
              placeholder="Enter your password"
              toggleMask
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
          </div>
          {err && <div style={{ color: 'red', marginTop: 8 }}>{err}</div>}
          <Button
            label={loading ? 'Signing...' : 'Login'}
            className="p-mt-3"
            onClick={handleSubmit}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}
