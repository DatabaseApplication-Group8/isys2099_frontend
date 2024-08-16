import Sidebar from "@/components/Sidebar";

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <section className="grid grid-cols-12 gap-3">
            <div className="col-span-3">
                <Sidebar />
            </div>
            <div className="col-span-9">
                {children}
            </div>
        </section>
    );
}