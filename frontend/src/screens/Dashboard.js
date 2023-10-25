import React from 'react'
import Logo from "../assets/form/logo.png"
import Home from "../assets/dashboard/Home.svg"
import Chart from "../assets/dashboard/Chart.svg"
import product from "../assets/dashboard/product.svg"
import { useLocation, useNavigate } from 'react-router-dom'
import DashBoardMain from './DashBoardMain'
import DashboardChart from './DashboardChart'
import DashboardMedical from './DashboardMedical'
const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <div style={{ background: '#ebebeb', minHeight: '100vh', display: 'flex' }}>
            <div>
                <header className='dashHeader'>
                    <img style={{ width: 100, marginTop: 20 }} src={Logo} alt="logo" />
                    <h2 style={{ marginTop: 10, color: '#2db84c' }} className='logo'>Spend Savvy</h2>
                    <div style={{ marginTop: 100 }} className='navDiv'>
                        <div onClick={() => navigate("/dashboard")} className='nav'>
                            <img style={{ color: 'black' }} src={Home} alt="Home" />
                            <p style={{ color: '#2db84c' }}>Dashboard</p>
                        </div>
                        <div onClick={() => navigate("/dashboard/chart")} className='nav'>
                            <img style={{ color: 'black' }} src={Chart} alt="Chart" />
                            <p style={{ color: 'black' }}>Transactions</p>
                        </div>
                        <div onClick={() => navigate("/dashboard/medical")} className='nav'>
                            <img style={{ color: 'black' }} src={product} alt="product" />
                            <p style={{ color: 'black' }}>Medical </p>
                        </div>
                    </div>
                </header>
            </div>
            {
                location.pathname === '/dashboard'
                    ?
                    <DashBoardMain />
                    :
                    location.pathname === '/dashboard/chart'
                    ?
                    <DashboardChart />
                    :
                    <DashboardMedical/>
            }

        </div>
    )
}

export default Dashboard
