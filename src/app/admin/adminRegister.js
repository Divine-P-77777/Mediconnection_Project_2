// app/admin/register.jsx
"use client"
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '@/utils/supabaseClient';

export default function adminRegister() {
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const [formData, setFormData] = useState({
        name: '',
        pincode: '',
        email: '',
        password: '',
        confirmPassword: '',
        contact: '',
        address: '',
        hcrn: '',
        hfc: '',
        documents: null
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, documents: e.target.files });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
    
        // Sign up the user using Supabase
        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
        });
    
        if (error) {
            alert(error.message);
            return;
        }
    
        // If signup is successful, send data to your backend
        try {
            const response = await fetch("http://localhost:5000/register/admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
    
            const result = await response.json();
            if (response.ok) {
                alert("Registration successful! Await approval.");
            } else {
                alert(result.message || "Registration failed");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("An error occurred while registering.");
        }
    };
    

    return (
        <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <form onSubmit={handleSubmit} className="w-96 p-6 shadow-lg rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Admin Registration</h2>
                <input type="text" name="name" placeholder="Health Center Name" onChange={handleChange} required className="w-full p-2 border mb-2" />
                <input type="text" name="pincode" placeholder="Pincode" onChange={handleChange} required className="w-full p-2 border mb-2" />
                <input type="email" name="email" placeholder="Official Email" onChange={handleChange} required className="w-full p-2 border mb-2" />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 border mb-2" />
                <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required className="w-full p-2 border mb-2" />
                <input type="text" name="contact" placeholder="Contact Number" onChange={handleChange} required className="w-full p-2 border mb-2" />
                <textarea name="address" placeholder="Full Address" onChange={handleChange} required className="w-full p-2 border mb-2"></textarea>
                <input type="text" name="hcrn" placeholder="HCRN (if available)" onChange={handleChange} className="w-full p-2 border mb-2" />
                <input type="text" name="hfc" placeholder="HFC (if available)" onChange={handleChange} className="w-full p-2 border mb-2" />
                <input type="file" multiple onChange={handleFileChange} className="w-full p-2 border mb-2" />
                <button type="submit" className="bg-blue-600 text-white p-2 w-full">Register</button>
            </form>
        </div>
    );
}
