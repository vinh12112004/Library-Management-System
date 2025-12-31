import React from "react";
import "./HomePage.css";

const HomePage = () => {
    return (
        <div className="home-container">
            <div className="hero-content">
                <h1>Chào mừng tới Thư viện Số</h1>
                <p>
                    Khám phá hàng ngàn cuốn sách tri thức chỉ với một cú click.
                </p>
                <button className="cta-button">Khám phá ngay</button>
            </div>
        </div>
    );
};

export default HomePage;
