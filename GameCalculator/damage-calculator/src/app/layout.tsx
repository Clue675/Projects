import React from 'react';
import '@/app/styles/globals.css'; // Import global styles here

export const metadata = {
    title: 'Damage Calculator',
    description: 'A Next.js application to calculate combat damage with character perks and stats.',
};

// The `children` prop is used to render the content of the specific page
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-gray-100 text-gray-900">
                {/* You can add a global header here */}
                <header className="bg-blue-500 text-white p-4 shadow-md">
                    <div className="container mx-auto">
                        <h1 className="text-2xl font-bold">Damage Calculator</h1>
                    </div>
                </header>

                {/* Main content area where the page components will be rendered */}
                <main className="container mx-auto p-4">
                    {children}
                </main>

                {/* You can add a global footer here */}
                <footer className="bg-blue-500 text-white p-4 shadow-md mt-8">
                    <div className="container mx-auto text-center">
                        <p>&copy; {new Date().getFullYear()} Damage Calculator. All rights reserved.</p>
                    </div>
                </footer>
            </body>
        </html>
    );
}
