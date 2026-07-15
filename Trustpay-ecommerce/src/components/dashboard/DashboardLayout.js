const DashboardLayout = ({ role, children }) => {
    return (
        <div className="dashboard-container">
            <Sidebar role={role} /> 
            <main className="content">
                {children}
            </main>
        </div>
    );
};