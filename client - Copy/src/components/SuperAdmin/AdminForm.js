import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';

const initialFormState = {
    name: '',
    surname: '',
    username: '',
    email: '',
    role: 'admin'
};

const AdminForm = ({ editingAccount, onSuccess, onCancel, showNotification }) => {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState("form"); // form | verify
    const [otp, setOtp] = useState("");
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (editingAccount) {
            setFormData({ ...editingAccount, password: '' });
        } else {
            resetForm();
        }
    }, [editingAccount]);

    const resetForm = () => {
        setFormData(initialFormState);
        setOtp("");
        setStep("form");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 🔹 STEP 1: Register or Update Admin
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingAccount) {
                await api.put(`/super/admin/${editingAccount._id}`, formData);
                showNotification('success', "Տվյալները թարմացվեցին:");
                onSuccess();
                resetForm(); // Clean state after edit
            } else {
                await api.post('/super/register-admin', formData);
                showNotification('success', "Կոդը ուղարկվեց էլ․ հասցեին:");
                setStep("verify");
            }
        } catch (err) {
            showNotification('error', err.response?.data?.message || "Գործողությունը ձախողվեց:");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 STEP 2: Verify OTP
    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('auth/verify-email', {
                email: formData.email,
                code: otp
            });

            showNotification('success', "Ադմինը հաջողությամբ հաստատվեց:");
            resetForm(); // Fully clear state after successful registration
            onSuccess();
        } catch (err) {
            showNotification('error', err.response?.data?.error || "Սխալ կոդ:");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={`form-card ${editingAccount ? 'edit-mode-active' : ''}`}>
            <h3>
                {editingAccount 
                    ? '📝 Խմբագրել Ադմին' 
                    : step === "verify" 
                        ? '📧 Հաստատել Էլ․ հասցեն' 
                        : '🆕 Ստեղծել Ադմին'}
            </h3>

            {step === "form" ? (
                <form onSubmit={handleSubmit} className="admin-form">
                    <input name="name" type="text" placeholder="Անուն"
                        value={formData.name} onChange={handleChange} required />

                    <input name="surname" type="text" placeholder="Ազգանուն"
                        value={formData.surname} onChange={handleChange} required />

                        <input name="username" type="text" placeholder="մուտքանուն"
                        value={formData.username} onChange={handleChange} required />

                    <input name="email" type="email" placeholder="Էլ. հասցե"
                        value={formData.email} onChange={handleChange} required />

                    {!editingAccount && (
                        <input name="password" type="password" placeholder="Գաղտնաբառ"
                            value={formData.password} onChange={handleChange} 
                            required minLength="6" />
                    )}

                   

                    <div className="btn-group">
                        <button type="submit" disabled={loading}>
                            {loading ? '...' : editingAccount ? 'Թարմացնել' : 'Ստեղծել'}
                        </button>
                        {(editingAccount || formData.name) && (
                            <button type="button" onClick={editingAccount ? onCancel : resetForm}>
                                Չեղարկել
                            </button>
                        )}
                    </div>
                </form>
            ) : (
                <form onSubmit={handleVerify} className="admin-form">
                    <input
                        type="text"
                        placeholder="Մուտքագրեք 6 նիշ կոդը"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <div className="btn-group">
                        <button type="submit" disabled={loading}>
                            {loading ? '...' : 'Հաստատել'}
                        </button>
                        <button type="button" onClick={() => setStep("form")}>
                            Վերադառնալ
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
};

export default AdminForm;