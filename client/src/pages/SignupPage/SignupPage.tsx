// src/pages/SignupPage/SignupPage.tsx
import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import styles from './SignupPage.module.css';
import { useNavigate } from 'react-router-dom';
import { userSignup } from '../../services/authService';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [err, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e?: React.FormEvent) => {
        try {
        if (e) e.preventDefault();
        setError(null);

        if (!name || !email || !password || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        const result = await userSignup( name, email, password );
        setLoading(false);

        if (result.success) {
            navigate('/products'); // redirect after successful signup
        } else {
            setError(result.message || 'Signup failed');
        }
        } catch (err: unknown) {
        setLoading(false);
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('Unexpected error');
        }
        }
    };

    return (
        <div className={styles.signupContainer}>
            <div className={styles.leftPanel}>
                <h2>Join Us!</h2>
                <p>Already have an account?</p>
                <Button
                label="Go to Login"
                className={styles.customLoginBtn}
                onClick={() => navigate('/login')}
                />
            </div>

            <div className={styles.rightPanel}>
                <h2>Create Account</h2>
                <div className={`${styles.signupForm} p-fluid`}>
                    <div className="p-field">
                        <label htmlFor="name">Name</label>
                        <InputText
                        id="name"
                        placeholder="Enter your name"
                        onChange={(e) => setName(e.currentTarget.value)}
                        />
                    </div>

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

                    <div className="p-field">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <Password
                        id="confirmPassword"
                        placeholder="Re-enter your password"
                        toggleMask
                        onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                        />
                    </div>

                    {err && <div style={{ color: 'red', marginTop: 8 }}>{err}</div>}

                    <Button
                        label={loading ? 'Signing up...' : 'Sign Up'}
                        className="p-mt-3"
                        onClick={handleSubmit}
                        disabled={loading}
                    />
                </div>
            </div>
        </div>
    );
}
