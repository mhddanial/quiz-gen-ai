'use client';

import { useEffect, useState, useCallback, useMemo } from "react";
import { FileText, LogOut, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import NextLink from "next/link";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

// Navigation links configuration
const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it Works" },
  { href: "/#why-choose-us", label: "Why Choose Us" },
] as const;

// Custom hook for auth state management
function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const getUserSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          return;
        }

        if (mounted) {
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in getUserSession:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getUserSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        return;
      }
      setUser(null);
    } catch (error) {
      console.error("Error in signOut:", error);
    }
  }, []);

  return { user, isLoading, signOut };
}

// Mobile menu component
function MobileMenu({ isOpen, onClose, user, onSignOut }) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 z-50 h-full w-64 bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-semibold">Menu</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 space-y-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-2 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={onClose}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 border-t">
            {!user ? (
              <NextLink href="/auth/login" onClick={onClose}>
                <Button variant="default" className="w-full">
                  Sign In
                </Button>
              </NextLink>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 text-sm text-gray-600">
                  {user.user_metadata?.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt="User avatar"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  <span className="truncate">{user.email}</span>
                </div>
                <NextLink href="/profile" onClick={onClose}>
                  <Button variant="ghost" className="w-full justify-start">
                    Profile
                  </Button>
                </NextLink>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    onSignOut();
                    onClose();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// User avatar component
function UserAvatar({ user }) {
  const avatarSrc = user?.user_metadata?.avatar_url;

  if (avatarSrc) {
    return (
      <Image
        src={avatarSrc}
        alt="User avatar"
        width={32}
        height={32}
        className="rounded-full object-cover"
        priority={false}
        onError={(e) => {
          // Fallback to user icon if image fails to load
          e.currentTarget.style.display = "none";
        }}
      />
    );
  }

  return <User className="h-6 w-6" />;
}

// Main navbar component
export default function Navbar() {
  const { user, isLoading, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Memoize navigation links to prevent unnecessary re-renders
  const navigationLinks = useMemo(
    () =>
      NAV_LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
        >
          {link.label}
        </a>
      )),
    []
  );

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-lg border-b border-gray-200/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <NextLink href="/" className="flex items-center space-x-2 group">
              <FileText className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <span className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                QuizGen AI
              </span>
            </NextLink>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationLinks}

              {/* Auth Section */}
              {isLoading ? (
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              ) : !user ? (
                <NextLink href="/auth/login">
                  <Button
                    variant="default"
                    className="shadow-sm hover:shadow-md transition-shadow"
                  >
                    Sign In
                  </Button>
                </NextLink>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="User menu"
                    >
                      <UserAvatar user={user} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.user_metadata?.full_name || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <NextLink href="/profile" className="cursor-pointer ">
                        <User className="h-4 w-4" />
                        Profile
                      </NextLink>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={signOut}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        user={user}
        onSignOut={signOut}
      />
    </>
  );
}