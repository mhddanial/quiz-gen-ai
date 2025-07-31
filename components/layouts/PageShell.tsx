import { ReactNode } from "react";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface PageShellProps {
  title?: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  children: ReactNode;
  rightSidebar?: ReactNode;
}

export default function PageShell({
  breadcrumbs = [],
  children,
  rightSidebar,
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <nav className="flex items-center space-x-1 text-sm text-gray-600 mb-6">
          <Link
            href="/"
            className="flex items-center hover:text-blue-600 transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Link>
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              {item.href ? (
                <Link href={item.href} className="hover:text-blue-600">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{item.label}</span>
              )}
            </div>
          ))}
        </nav>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          <div className="xl:col-span-2">
            {children}
          </div>
          {rightSidebar && <div className="space-y-6">{rightSidebar}</div>}
        </div>
      </div>
    </div>
  );
}
