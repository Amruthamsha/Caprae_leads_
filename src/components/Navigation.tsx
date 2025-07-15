import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Home, Users, BarChart3, User } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Search className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              Caprae Leads
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/search"
              className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                isActive("/search") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Search Leads</span>
            </Link>
            <Link
              to="/results"
              className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                isActive("/results") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Results</span>
            </Link>
            <Link
              to="/about"
              className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                isActive("/about") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <User className="h-4 w-4" />
              <span>About</span>
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/contact">Upload Criteria</Link>
            </Button>
            <Button size="sm" className="btn-primary" asChild>
              <Link to="/search">Start Free Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;