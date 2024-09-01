export default function Profile() {
    return (
        <main className="profile min-h-screen bg-[#E6F0FF] py-8">
            <div className="container mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-8">
                
                {/* Personal Profile Section */}
                <div className="lg:w-1/3">
                    <h2 className="text-3xl font-semibold mb-4 text-gray-900">Patient Personal Profile</h2>
                    <div className="bg-white p-6 rounded-lg shadow-lg">

                        <p className="text-gray-700 text-lg">Hi</p>
                    </div>
                </div>

                {/* Treatment and Appointment Sections */}
                <div className="lg:w-2/3 flex flex-col gap-6">
                    
                    <div>
                        <h2 className="text-3xl font-semibold mb-2 text-gray-900">Treatment</h2>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <p className="text-gray-700 text-lg">Hello</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl font-semibold mb-2 text-gray-900">Appointment</h2>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <p className="text-gray-700 text-lg">Hello</p>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
