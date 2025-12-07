import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Shield, Languages, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import logo from "@/assets/logo.png";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDestinations, setOpenDestinations] = useState(false);
  const [openServices, setOpenServices] = useState(false);
  const [openUpdates, setOpenUpdates] = useState(false);
  const [openResources, setOpenResources] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session) {
        const { data } = await supabase.rpc('has_role', {
          _user_id: session.user.id,
          _role: 'admin'
        });
        setIsAdmin(data || false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) {
        supabase.rpc('has_role', {
          _user_id: session.user.id,
          _role: 'admin'
        }).then(({ data }) => setIsAdmin(data || false));
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
      }
      
      // Clear local state immediately
      setUser(null);
      setIsAdmin(false);
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const destinations = [
    { name: "Study in USA", href: "/study-usa" },
    { name: "Study in UK", href: "/study-uk" },
    { name: "Study in Canada", href: "/study-canada" },
    { name: "Study in Australia", href: "/study-australia" },
    { name: "Study in Europe", href: "/study-germany" },
    { name: "Study in New Zealand", href: "/study-new-zealand" },
    { name: "Study in South Korea", href: "/study-south-korea" },
  ];

  const studentServices = [
    { name: "Admission Guidance", href: "/admission" },
    { name: "Visa Assistance", href: "/visa" },
    { name: "Scholarship Support", href: "/scholarship" },
    { name: "Career Counseling", href: "/career" },
    { name: "Accommodation Help", href: "/accommodation" },
    { name: "Pre-Departure Briefing", href: "/pre-departure" },
  ];

  const freeResources = [
    { name: "IELTS Learning", href: "/ielts-learning", external: false },
    { name: "Study Planner", href: "/study-planner", external: false },
    { name: "AI Advisor", href: "/ai-advisor", external: false },
  ];

  const latestUpdates = [
    { name: "News & Events", href: "#news" },
    { name: "Success Stories", href: "#success" },
    { name: "Blog", href: "/blog" },
    { name: "Webinars", href: "#webinars" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src={logo} 
                alt="Education International Logo" 
                className="h-16 md:h-20 w-auto object-contain"
              />
              <h1 className="text-xl md:text-2xl font-display font-bold text-primary">
                Education International
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Destination Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-primary font-medium">
                    Destination
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4">
                      {destinations.map((item) => (
                        item.href.startsWith('#') ? (
                          <NavigationMenuLink
                            key={item.name}
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.name}</div>
                          </NavigationMenuLink>
                        ) : (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.name}</div>
                          </Link>
                        )
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Student Services Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-primary font-medium">
                    Student Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4">
                      {studentServices.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{item.name}</div>
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Free Resources Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-primary font-medium">
                    Free Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[300px] gap-3 p-4">
                      {freeResources.map((item) => (
                        item.external ? (
                          <a
                            key={item.name}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.name}</div>
                          </a>
                        ) : (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.name}</div>
                          </Link>
                        )
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Latest Updates Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-primary font-medium">
                    Latest Updates
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[300px] gap-3 p-4">
                      {latestUpdates.map((item) => (
                        <NavigationMenuLink
                          key={item.name}
                          href={item.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{item.name}</div>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Free Consultation */}
                <NavigationMenuItem>
                  <a
                    href="#consultation"
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    Free Consultation
                  </a>
                </NavigationMenuItem>

                {/* Student Dashboard Link */}
                {user && !isAdmin && (
                  <NavigationMenuItem>
                    <Button 
                      variant="default"
                      size="sm"
                      asChild
                    >
                      <Link to="/portal">
                        My Dashboard
                      </Link>
                    </Button>
                  </NavigationMenuItem>
                )}

                {/* Admin Link */}
                {isAdmin && (
                  <NavigationMenuItem>
                    <Button 
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <Link to="/admin">
                        <Shield className="w-4 h-4 mr-2" />
                        Admin
                      </Link>
                    </Button>
                  </NavigationMenuItem>
                )}

                {/* Language Switcher */}
                <NavigationMenuItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                    className="flex items-center gap-2"
                  >
                    <Languages className="w-4 h-4" />
                    {language === 'en' ? 'বাংলা' : 'English'}
                  </Button>
                </NavigationMenuItem>

                {/* Auth Button */}
                <NavigationMenuItem>
                  {user ? (
                    <Button 
                      onClick={handleLogout}
                      variant="outline"
                      className="gap-2 rounded-full ml-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  ) : (
                    <Button 
                      asChild
                      className="bg-secondary hover:bg-secondary/90 text-primary font-semibold rounded-full ml-2"
                    >
                      <Link to="/login">Sign up/Log in</Link>
                    </Button>
                  )}
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {/* Destinations Collapsible */}
              <Collapsible open={openDestinations} onOpenChange={setOpenDestinations}>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors">
                  Destination
                  <ChevronDown className={`w-4 h-4 transition-transform ${openDestinations ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pt-2">
                  {destinations.map((item) => (
                    item.href.startsWith('#') ? (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block pl-4 py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block pl-4 py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Student Services Collapsible */}
              <Collapsible open={openServices} onOpenChange={setOpenServices}>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors">
                  Student Services
                  <ChevronDown className={`w-4 h-4 transition-transform ${openServices ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pt-2">
                  {studentServices.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block pl-4 py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Free Resources Collapsible */}
              <Collapsible open={openResources} onOpenChange={setOpenResources}>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors">
                  Free Resources
                  <ChevronDown className={`w-4 h-4 transition-transform ${openResources ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pt-2">
                  {freeResources.map((item) => (
                    item.external ? (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block pl-4 py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block pl-4 py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Latest Updates Collapsible */}
              <Collapsible open={openUpdates} onOpenChange={setOpenUpdates}>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors">
                  Latest Updates
                  <ChevronDown className={`w-4 h-4 transition-transform ${openUpdates ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pt-2">
                  {latestUpdates.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block pl-4 py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <a 
                href="#consultation" 
                className="py-2 text-foreground hover:text-primary transition-colors font-medium text-sm"
                onClick={() => setIsOpen(false)}
              >
                Free Consultation
              </a>
              {user && !isAdmin && (
                <Link
                  to="/portal"
                  className="py-2 text-foreground hover:text-primary transition-colors font-medium text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  My Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="py-2 text-foreground hover:text-primary transition-colors font-medium text-sm flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Shield className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}
              <Button
                variant="ghost"
                onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                className="flex items-center gap-2 w-full justify-start"
              >
                <Languages className="w-4 h-4" />
                {language === 'en' ? 'বাংলা' : 'English'}
              </Button>
              {user ? (
                <Button 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  variant="outline"
                  className="gap-2 w-full mt-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              ) : (
                <Button 
                  className="bg-secondary hover:bg-secondary/90 text-primary font-semibold rounded-full w-full mt-2"
                  asChild
                >
                  <Link to="/login" onClick={() => setIsOpen(false)}>Sign up/Log in</Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
