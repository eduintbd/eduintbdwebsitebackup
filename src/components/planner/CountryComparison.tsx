import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, DollarSign, Clock, GraduationCap, Briefcase, 
  Home, FileCheck, TrendingUp, ChevronRight, Star
} from "lucide-react";

interface CountryInfo {
  name: string;
  flag: string;
  route: string;
  popular: boolean;
  tuitionRange: string;
  livingCost: string;
  visaTime: string;
  workRights: string;
  prPathway: string;
  topPrograms: string[];
  highlights: string[];
  rating: number;
}

export function CountryComparison() {
  const navigate = useNavigate();
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const countries: CountryInfo[] = [
    {
      name: "United States",
      flag: "🇺🇸",
      route: "/study-usa",
      popular: true,
      tuitionRange: "$20,000 - $60,000/year",
      livingCost: "$15,000 - $25,000/year",
      visaTime: "3-6 weeks",
      workRights: "20 hrs/week during study",
      prPathway: "H1B → Green Card",
      topPrograms: ["Computer Science", "MBA", "Engineering", "Medicine"],
      highlights: ["World's top universities", "OPT work extension", "Research opportunities"],
      rating: 4.8,
    },
    {
      name: "United Kingdom",
      flag: "🇬🇧",
      route: "/study-uk",
      popular: true,
      tuitionRange: "£12,000 - £35,000/year",
      livingCost: "£12,000 - £18,000/year",
      visaTime: "3-4 weeks",
      workRights: "20 hrs/week during study",
      prPathway: "Graduate Route → Skilled Worker",
      topPrograms: ["Business", "Law", "Arts", "Engineering"],
      highlights: ["1-year Masters", "2-year post-study work", "Rich culture"],
      rating: 4.7,
    },
    {
      name: "Canada",
      flag: "🇨🇦",
      route: "/study-canada",
      popular: true,
      tuitionRange: "CAD $15,000 - $35,000/year",
      livingCost: "CAD $12,000 - $20,000/year",
      visaTime: "4-8 weeks",
      workRights: "20 hrs/week during study",
      prPathway: "PGWP → Express Entry",
      topPrograms: ["IT", "Healthcare", "Business", "Engineering"],
      highlights: ["Easy PR pathway", "3-year PGWP", "Quality of life"],
      rating: 4.9,
    },
    {
      name: "Australia",
      flag: "🇦🇺",
      route: "/study-australia",
      popular: true,
      tuitionRange: "AUD $20,000 - $45,000/year",
      livingCost: "AUD $18,000 - $25,000/year",
      visaTime: "4-6 weeks",
      workRights: "48 hrs/fortnight during study",
      prPathway: "485 Visa → Skilled Migration",
      topPrograms: ["Nursing", "IT", "Accounting", "Engineering"],
      highlights: ["Post-study work rights", "High living standards", "Diverse culture"],
      rating: 4.6,
    },
    {
      name: "Germany",
      flag: "🇩🇪",
      route: "/study-germany",
      popular: false,
      tuitionRange: "€0 - €20,000/year (mostly free)",
      livingCost: "€10,000 - €15,000/year",
      visaTime: "4-8 weeks",
      workRights: "120 full days/year",
      prPathway: "Job Seeker → EU Blue Card",
      topPrograms: ["Engineering", "Science", "Automotive", "Research"],
      highlights: ["Free/low tuition", "Strong economy", "18-month job search visa"],
      rating: 4.5,
    },
    {
      name: "New Zealand",
      flag: "🇳🇿",
      route: "/study-new-zealand",
      popular: false,
      tuitionRange: "NZD $22,000 - $35,000/year",
      livingCost: "NZD $15,000 - $20,000/year",
      visaTime: "3-4 weeks",
      workRights: "20 hrs/week during study",
      prPathway: "Post-Study Work → Skilled Migrant",
      topPrograms: ["Agriculture", "Tourism", "IT", "Healthcare"],
      highlights: ["Safe environment", "Work rights", "Nature & lifestyle"],
      rating: 4.4,
    },
  ];

  const toggleCountry = (name: string) => {
    if (selectedCountries.includes(name)) {
      setSelectedCountries(selectedCountries.filter(c => c !== name));
    } else if (selectedCountries.length < 3) {
      setSelectedCountries([...selectedCountries, name]);
    }
  };

  const comparedCountries = countries.filter(c => selectedCountries.includes(c.name));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Compare Study Destinations</h2>
        <p className="text-muted-foreground">Select up to 3 countries to compare side by side</p>
      </div>

      {/* Country Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {countries.map((country) => (
          <Card 
            key={country.name}
            className={`cursor-pointer border-2 transition-all hover:shadow-md ${
              selectedCountries.includes(country.name) 
                ? 'border-primary bg-primary/5' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => toggleCountry(country.name)}
          >
            <CardContent className="p-4 text-center">
              <span className="text-4xl block mb-2">{country.flag}</span>
              <p className="font-medium text-sm">{country.name}</p>
              {country.popular && (
                <Badge variant="secondary" className="mt-2 text-xs">Popular</Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      {comparedCountries.length > 0 && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Comparison</CardTitle>
            <CardDescription>Side-by-side comparison of selected countries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-muted-foreground">Criteria</th>
                    {comparedCountries.map(c => (
                      <th key={c.name} className="text-left p-3 font-medium">
                        <span className="flex items-center gap-2">
                          <span className="text-2xl">{c.flag}</span>
                          <span>{c.name}</span>
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      Tuition Fees
                    </td>
                    {comparedCountries.map(c => (
                      <td key={c.name} className="p-3 text-sm">{c.tuitionRange}</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 flex items-center gap-2">
                      <Home className="w-4 h-4 text-primary" />
                      Living Cost
                    </td>
                    {comparedCountries.map(c => (
                      <td key={c.name} className="p-3 text-sm">{c.livingCost}</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Visa Processing
                    </td>
                    {comparedCountries.map(c => (
                      <td key={c.name} className="p-3 text-sm">{c.visaTime}</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      Work Rights
                    </td>
                    {comparedCountries.map(c => (
                      <td key={c.name} className="p-3 text-sm">{c.workRights}</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      PR Pathway
                    </td>
                    {comparedCountries.map(c => (
                      <td key={c.name} className="p-3 text-sm">{c.prPathway}</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-primary" />
                      Rating
                    </td>
                    {comparedCountries.map(c => (
                      <td key={c.name} className="p-3">
                        <Badge variant="secondary">{c.rating}/5</Badge>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      Top Programs
                    </td>
                    {comparedCountries.map(c => (
                      <td key={c.name} className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {c.topPrograms.slice(0, 3).map(p => (
                            <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex gap-4 mt-6 pt-4 border-t">
              {comparedCountries.map(c => (
                <Button key={c.name} variant="outline" className="flex-1" onClick={() => navigate(c.route)}>
                  Learn More About {c.name}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Countries Detail Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {countries.map((country) => (
          <Card key={country.name} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{country.flag}</span>
                  <div>
                    <CardTitle>{country.name}</CardTitle>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">{country.rating}</span>
                    </div>
                  </div>
                </div>
                {country.popular && <Badge>Popular</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {country.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {highlight}
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-2">Tuition: {country.tuitionRange}</p>
              </div>
              <Button className="w-full" onClick={() => navigate(country.route)}>
                Explore {country.name}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
