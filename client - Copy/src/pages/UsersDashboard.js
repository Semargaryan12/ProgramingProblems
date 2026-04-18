import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { api } from '../api/api';
import '../styles/UserProfile.css';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            if (decoded.role !== "user") {
                navigate("/unauthorized");
                return;
            }
            fetchUserData();
        } catch (err) {
            localStorage.removeItem("accessToken");
            navigate("/login");
        }
    }, [navigate]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await api.get('auth/my-profile');
            setUserData(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Չհաջողվեց բեռնել տվյալները։');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('hy-AM', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    if (loading) return <div className="loader-container"><div className="loader"></div><p>Բեռնվում է...</p></div>;
    if (error) return <div className="error-card"><h3>⚠️ {error}</h3><button onClick={fetchUserData}>Փորձել կրկին</button></div>;

    return (
        <div className="profile-wrapper">
            {/* Գլխամաս */}
            <header className="profile-hero">
                <div className="hero-content">
                    <div className="avatar-large">
                        {userData.name?.[0]}{userData.surname?.[0]}
                    </div>
                    <div className="hero-text">
                        <h1>{userData.name} {userData.surname}</h1>
                        <p className="user-email">{userData.email}</p>
                        <span className={`badge ${userData.isBlocked ? 'badge-red' : 'badge-green'}`}>
                            {userData.isBlocked ? 'Արգելափակված' : 'Ուսանող'}
                        </span>
                    </div>
                </div>
            </header>

            {/* Նոր սեքցիա՝ Առաջադիմության ամփոփում */}
            <section className="dashboard-intro">
                <div className="intro-card">
                    <h2>Իմ Առաջադիմությունը</h2>
                    <p>Այստեղ դուք կտեսնեք ձեր կատարած առաջադրանքները և առաջադիմությունը:</p>
                    <p className="motivation-text">
                        Յուրաքանչյուր լուծված խնդիր և անցած քուիզ քայլ է դեպի պրոֆեսիոնալ ծրագրավորող դառնալուն: 
                        Հետևիր վիճակագրությանը և բարելավիր արդյունքներդ ամեն օր:
                    </p>
                </div>
            </section>
            {/* Նոր սեքցիա՝ Առաջադիմության ամփոփում */}
<section className="dashboard-intro">
    <div className="intro-card">
        <h2>Իմ Առաջադիմությունը</h2>
        <p>Այստեղ դուք կտեսնեք ձեր կատարած առաջադրանքները և առաջադիմությունը:</p>
        
        {/* Ավելացված նոր տողը */}
        <p className="learning-path-note">
            🚀 <strong>Խորհուրդ.</strong> Արդյունավետության համար անցիր լեզուների ուսուցումը հերթականությամբ՝ հիմունքներից դեպի բարդագույնները:
        </p>

        <p className="motivation-text">
            Յուրաքանչյուր լուծված խնդիր և անցած քուիզ քայլ է դեպի պրոֆեսիոնալ ծրագրավորող դառնալուն: 
            Հետևիր վիճակագրությանը և բարելավիր արդյունքներդ ամեն օր:
        </p>
    </div>
</section>

            <main className="profile-grid">
                {/* Առաջադրանքների սեքցիա */}
                <section className="data-card">
                    <div className="card-header">
                        <span className="icon">📝</span>
                        <h3>Առաջադրանքներ</h3>
                    </div>
                    <div className="card-body">
                        {userData.questionAnswers?.length > 0 ? (
                            userData.questionAnswers.map((item, index) => (
                                <div key={index} className="list-item">
                                    <div className="list-item-info">
                                        <h4>{item.questionId?.questionText || "Անհայտ առաջադրանք"}</h4>
                                        <span>{formatDate(item.submittedAt)}</span>
                                    </div>
                                    <div className="grade-pill">
                                        {item.answerId?.grade ?? 0} / 100
                                    </div>
                                </div>
                            ))
                        ) : <p className="empty-msg">Դեռ չկան կատարված առաջադրանքներ:</p>}
                    </div>
                </section>

                {/* Քուիզների սեքցիա */}
                <section className="data-card">
                    <div className="card-header">
                        <span className="icon">⚡</span>
                        <h3>Քուիզների Արդյունքներ</h3>
                    </div>
                    <div className="card-body">
                        {userData.quizSubmissions?.length > 0 ? (
                            userData.quizSubmissions.map((item, index) => (
                                <div key={index} className="list-item">
                                    <div className="list-item-info">
                                        <h4>{item.quizId?.title}</h4>
                                        <span>{formatDate(item.submittedAt)}</span>
                                    </div>
                                    <div className="score-pill">
                                        {item.score} Միավոր
                                    </div>
                                </div>
                            ))
                        ) : <p className="empty-msg">Քուիզներ դեռ չեք անցել:</p>}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default UserProfile;