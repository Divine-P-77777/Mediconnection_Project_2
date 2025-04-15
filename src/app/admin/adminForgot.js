import { useState } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '@/utils/supabaseClient';

export default function ForgotPassword() {
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        
        if (error) {
            setMessage('Error: ' + error.message);
        } else {
            setMessage('Password reset link has been sent to your email.');
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <form onSubmit={handleSubmit} className="w-96 p-6 shadow-lg rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
                {message && <p className="text-green-500 mb-2">{message}</p>}
                <input type="email" name="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 border mb-2" />
                <button type="submit" className="bg-blue-600 text-white p-2 w-full">Reset Password</button>
            </form>
        </div>
    );
}