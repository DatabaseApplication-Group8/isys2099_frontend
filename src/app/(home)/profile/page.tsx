export default function Profile() {
    return (
        <main className="profile min-h-screen bg-[#BFD2F8] bg-opacity-50 py-8">
            <div className="container mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-8">
                {/* Personal Profile Section */}
                <div className="first-container bg-red-300 p-6 rounded-lg shadow-lg flex-1">
                    <h1 className="text-3xl font-bold mb-4 text-gray-800">Patient Personal Profile</h1>
                    <p className="text-gray-700">Hi</p>
                </div>

                {/* History Sections */}
                <div className="second-container flex-1 flex flex-col gap-3">
                    <h2 className="text-2xl font-semibold mb-2 text-gray-800">Treatment History</h2>
                    <div className="bg-orange-200 p-6 mb-3 rounded-lg shadow-lg flex flex-col">
                        <p className="text-gray-700">Hello</p>
                    </div>

                    <h2 className="text-2xl font-semibold mb-2 text-gray-800">Appointment History</h2>
                    <div className="bg-pink-200 p-6 rounded-lg shadow-lg flex flex-col">
                        <p className="text-gray-700">Hello</p>
                    </div>
                </div>
            </div>
        </main>
    );
}


