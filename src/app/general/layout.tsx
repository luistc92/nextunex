"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GeneralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/general/tasks") return "Task Manager";
    if (pathname === "/general/nomina") return "Payroll Management";
    return "Dashboard Overview";
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              General Dashboard
            </h2>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/general/tasks"
                  className="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                >
                  <svg className="h-5 w-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="font-medium">Task Manager</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/general/nomina"
                  className="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                >
                  <svg className="h-5 w-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="font-medium">Payroll</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <nav className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
          <div className="px-6 py-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50">
              {getPageTitle()}
            </h1>
          </div>
        </nav>

        {/* Page Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
