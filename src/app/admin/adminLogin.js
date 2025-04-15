import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Login() {
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const { data: user, error } = await supabase.auth.signInWithPassword({
            email: formData.identifier,
            password: formData.password,
        });

        if (error) {
            setErrorMessage('Invalid login credentials or unapproved account.');
            return;
        }
        
        // Check if user is approved by Super Admin
        const { data: profile, error: profileError } = await supabase
            .from('admins')
            .select('is_approved')
            .eq('email', formData.identifier)
            .single();
        
        if (profileError || !profile || !profile.is_approved) {
            setErrorMessage('Your account is pending approval by the Super Admin.');
            await supabase.auth.signOut();
            return;
        }
        
        alert('Login successful!');
        router.push('/admin/dashboard');
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <form onSubmit={handleSubmit} className="w-96 p-6 shadow-lg rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
                {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
                <input type="text" name="identifier" placeholder="HCRN, HFC, or Email" onChange={handleChange} required className="w-full p-2 border mb-2" />
                
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 border mb-2" />
            <p className="my-2 text-center">
                    <a href="/admin/forgot-password" className="text-blue-500">Forgot Password?</a>
                </p>
                <button type="submit" className="bg-blue-600 text-white p-2 w-full">Login</button>
               
                <p className="mt-2 text-center">
                    <a href="/admin/register" className="text-blue-500">Sign Up</a>
                </p>
            </form>
        </div>
    );
}