import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Award, DollarSign, Calendar, GraduationCap, Globe, 
  Search, ExternalLink, Filter, ChevronRight, Star
} from "lucide-react";

interface Scholarship {
  id: string;
  name: string;
  provider: string;
  country: string;
  flag: string;
  amount: string;
  deadline: string;
  eligibility: string[];
  level: string[];
  fields: string[];
  link: string;
  featured: boolean;
}

export function ScholarshipFinder() {
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");

  const scholarships: Scholarship[] = [
    {
      id: "1",
      name: "Chevening Scholarship",
      provider: "UK Government",
      country: "UK",
      flag: "🇬🇧",
      amount: "Full funding",
      deadline: "November 2025",
      eligibility: ["Bachelor's degree", "2 years work experience", "Return to home country"],
      level: ["Masters"],
      fields: ["All fields"],
      link: "https://www.chevening.org",
      featured: true,
    },
    {
      id: "2",
      name: "Fulbright Scholarship",
      provider: "US Government",
      country: "USA",
      flag: "🇺🇸",
      amount: "Full funding",
      deadline: "May 2025",
      eligibility: ["Bachelor's degree", "Strong academic record", "Leadership potential"],
      level: ["Masters", "PhD"],
      fields: ["All fields"],
      link: "https://www.fulbright.org",
      featured: true,
    },
    {
      id: "3",
      name: "Commonwealth Scholarship",
      provider: "Commonwealth Secretariat",
      country: "UK",
      flag: "🇬🇧",
      amount: "Full funding",
      deadline: "December 2025",
      eligibility: ["Commonwealth citizen", "Bachelor's degree", "Cannot afford study"],
      level: ["Masters", "PhD"],
      fields: ["Development-related"],
      link: "https://cscuk.fcdo.gov.uk",
      featured: true,
    },
    {
      id: "4",
      name: "DAAD Scholarship",
      provider: "German Academic Exchange",
      country: "Germany",
      flag: "🇩🇪",
      amount: "€934/month + benefits",
      deadline: "October 2025",
      eligibility: ["Bachelor's degree", "Work experience preferred", "German/English proficiency"],
      level: ["Masters", "PhD"],
      fields: ["All fields"],
      link: "https://www.daad.de",
      featured: true,
    },
    {
      id: "5",
      name: "Australia Awards",
      provider: "Australian Government",
      country: "Australia",
      flag: "🇦🇺",
      amount: "Full funding",
      deadline: "April 2025",
      eligibility: ["Bachelor's degree", "2 years work experience", "Return to home country"],
      level: ["Masters", "PhD"],
      fields: ["Priority areas"],
      link: "https://www.australiaawards.gov.au",
      featured: true,
    },
    {
      id: "6",
      name: "Vanier Canada Graduate",
      provider: "Canadian Government",
      country: "Canada",
      flag: "🇨🇦",
      amount: "CAD $50,000/year",
      deadline: "November 2025",
      eligibility: ["Doctoral student", "Leadership skills", "Research potential"],
      level: ["PhD"],
      fields: ["All fields"],
      link: "https://vanier.gc.ca",
      featured: false,
    },
    {
      id: "7",
      name: "Gates Cambridge",
      provider: "Gates Foundation",
      country: "UK",
      flag: "🇬🇧",
      amount: "Full funding",
      deadline: "October 2025",
      eligibility: ["Outstanding academic record", "Leadership", "Commitment to improving others' lives"],
      level: ["Masters", "PhD"],
      fields: ["All fields"],
      link: "https://www.gatescambridge.org",
      featured: false,
    },
    {
      id: "8",
      name: "Erasmus Mundus",
      provider: "European Union",
      country: "Europe",
      flag: "🇪🇺",
      amount: "€1,400/month + travel",
      deadline: "January 2025",
      eligibility: ["Bachelor's degree", "Program-specific requirements"],
      level: ["Masters"],
      fields: ["Joint programs"],
      link: "https://erasmus-plus.ec.europa.eu",
      featured: false,
    },
    {
      id: "9",
      name: "New Zealand Scholarships",
      provider: "NZ Government",
      country: "New Zealand",
      flag: "🇳🇿",
      amount: "Full funding",
      deadline: "March 2025",
      eligibility: ["From eligible country", "Bachelor's degree", "Return commitment"],
      level: ["Masters", "PhD"],
      fields: ["Priority fields"],
      link: "https://www.mfat.govt.nz/scholarships",
      featured: false,
    },
    {
      id: "10",
      name: "Swiss Government Excellence",
      provider: "Swiss Confederation",
      country: "Switzerland",
      flag: "🇨🇭",
      amount: "CHF 1,920/month",
      deadline: "December 2025",
      eligibility: ["Master's degree", "Under 35 years", "Research proposal"],
      level: ["PhD", "Postdoc"],
      fields: ["All fields"],
      link: "https://www.sbfi.admin.ch",
      featured: false,
    },
    {
      id: "11",
      name: "Korean Government Scholarship (KGSP)",
      provider: "Korean Government",
      country: "South Korea",
      flag: "🇰🇷",
      amount: "Full funding + allowance",
      deadline: "February 2025",
      eligibility: ["Under 25 (Bachelor's) or 40 (Graduate)", "GPA 80%+", "Good health"],
      level: ["Bachelors", "Masters", "PhD"],
      fields: ["All fields"],
      link: "https://www.studyinkorea.go.kr",
      featured: true,
    },
    {
      id: "12",
      name: "Global Korea Scholarship",
      provider: "NIIED",
      country: "South Korea",
      flag: "🇰🇷",
      amount: "₩900,000/month + tuition",
      deadline: "March 2025",
      eligibility: ["Bachelor's degree", "No Korean heritage", "Language courses included"],
      level: ["Masters", "PhD"],
      fields: ["All fields"],
      link: "https://www.studyinkorea.go.kr",
      featured: false,
    },
  ];

  const filteredScholarships = scholarships.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = countryFilter === "all" || s.country === countryFilter;
    const matchesLevel = levelFilter === "all" || s.level.includes(levelFilter);
    return matchesSearch && matchesCountry && matchesLevel;
  });

  const featuredScholarships = filteredScholarships.filter(s => s.featured);
  const otherScholarships = filteredScholarships.filter(s => !s.featured);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Scholarship Finder</h2>
        <p className="text-muted-foreground">Discover funding opportunities for Bangladeshi students</p>
      </div>

      {/* Search and Filters */}
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search scholarships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="USA">🇺🇸 USA</SelectItem>
                <SelectItem value="UK">🇬🇧 UK</SelectItem>
                <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                <SelectItem value="Australia">🇦🇺 Australia</SelectItem>
                <SelectItem value="Germany">🇩🇪 Germany</SelectItem>
                <SelectItem value="South Korea">🇰🇷 South Korea</SelectItem>
                <SelectItem value="Europe">🇪🇺 Europe</SelectItem>
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <GraduationCap className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Bachelors">Bachelors</SelectItem>
                <SelectItem value="Masters">Masters</SelectItem>
                <SelectItem value="PhD">PhD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Featured Scholarships */}
      {featuredScholarships.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            Featured Scholarships
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {featuredScholarships.map((scholarship) => (
              <Card key={scholarship.id} className="border-2 border-primary/20 bg-primary/5 hover:border-primary/50 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{scholarship.flag}</span>
                      <Badge variant="secondary">{scholarship.country}</Badge>
                    </div>
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Featured</Badge>
                  </div>
                  <CardTitle className="text-lg">{scholarship.name}</CardTitle>
                  <CardDescription>{scholarship.provider}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-medium">{scholarship.amount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{scholarship.deadline}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {scholarship.level.map(l => (
                      <Badge key={l} variant="outline" className="text-xs">{l}</Badge>
                    ))}
                  </div>
                  <Button className="w-full" size="sm" asChild>
                    <a href={scholarship.link} target="_blank" rel="noopener noreferrer">
                      Apply Now
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Scholarships */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">All Scholarships ({filteredScholarships.length})</h3>
        <div className="space-y-3">
          {filteredScholarships.map((scholarship) => (
            <Card key={scholarship.id} className="border-2 hover:border-primary/50 transition-all">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{scholarship.flag}</span>
                    <div>
                      <h4 className="font-semibold">{scholarship.name}</h4>
                      <p className="text-sm text-muted-foreground">{scholarship.provider}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {scholarship.amount}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {scholarship.deadline}
                        </Badge>
                        {scholarship.level.map(l => (
                          <Badge key={l} variant="secondary" className="text-xs">{l}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild className="shrink-0">
                    <a href={scholarship.link} target="_blank" rel="noopener noreferrer">
                      Learn More
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {filteredScholarships.length === 0 && (
        <Card className="border-2 border-dashed">
          <CardContent className="p-8 text-center">
            <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No scholarships found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
