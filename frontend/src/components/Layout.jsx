import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children, fullName, pageClassName = "" }) {
    return (
        <div className="dashboard-page">
            <Navbar fullName={fullName} />

            <div className="wrapper">
                <Sidebar />

                <main className={`content ${pageClassName}`.trim()}>
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout;