import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Search } from "lucide-react";

const SearchFilters = ({ onSearch }: { onSearch: (filters: any) => void }) => {
  const [filters, setFilters] = useState({
    keywords: "",
    industry: "",
    companySize: "",
    country: "",
    techStack: [] as string[],
  });

  const industries = [
    "SaaS", "FinTech", "E-commerce", "Healthcare", "EdTech", 
    "MarTech", "PropTech", "InsurTech", "HRTech", "LogTech"
  ];

  const companySizes = [
    "1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"
  ];

  const countries = [
    "United States", "Canada", "United Kingdom", "Germany", 
    "France", "Netherlands", "Australia", "Singapore"
  ];

  const techStacks = [
    "React", "Node.js", "Python", "AWS", "Salesforce", 
    "HubSpot", "Stripe", "Shopify", "WordPress", "Slack"
  ];

  const handleTechStackToggle = (tech: string) => {
    setFilters(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech]
    }));
  };

  const clearFilters = () => {
    setFilters({
      keywords: "",
      industry: "",
      companySize: "",
      country: "",
      techStack: [],
    });
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <Card className="card-elevated">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg">
          <Filter className="mr-2 h-5 w-5 text-primary" />
          Search Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Keywords */}
        <div className="space-y-2">
          <Label htmlFor="keywords" className="text-sm font-medium">
            Keywords
          </Label>
          <Input
            id="keywords"
            placeholder="e.g., CRM, automation, analytics..."
            value={filters.keywords}
            onChange={(e) => setFilters(prev => ({ ...prev, keywords: e.target.value }))}
            className="search-input"
          />
        </div>

        {/* Industry */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Industry</Label>
          <Select
            value={filters.industry}
            onValueChange={(value) => setFilters(prev => ({ ...prev, industry: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Company Size */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Company Size</Label>
          <Select
            value={filters.companySize}
            onValueChange={(value) => setFilters(prev => ({ ...prev, companySize: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              {companySizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size} employees
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Country</Label>
          <Select
            value={filters.country}
            onValueChange={(value) => setFilters(prev => ({ ...prev, country: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tech Stack */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Tech Stack</Label>
          <div className="grid grid-cols-2 gap-2">
            {techStacks.map((tech) => (
              <div key={tech} className="flex items-center space-x-2">
                <Checkbox
                  id={tech}
                  checked={filters.techStack.includes(tech)}
                  onCheckedChange={() => handleTechStackToggle(tech)}
                />
                <Label htmlFor={tech} className="text-sm cursor-pointer">
                  {tech}
                </Label>
              </div>
            ))}
          </div>
          
          {/* Selected tech stack badges */}
          {filters.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {filters.techStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                  {tech}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleTechStackToggle(tech)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSearch} className="flex-1 btn-primary">
            <Search className="mr-2 h-4 w-4" />
            Search Leads
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;