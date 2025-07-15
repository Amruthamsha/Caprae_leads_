import { useState } from "react";
import Navigation from "@/components/Navigation";
import SearchFilters from "@/components/SearchFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchLeads = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = (filters: any) => {
    setIsSearching(true);
    
    // Simulate API call
    toast({
      title: "Search Started",
      description: "AI is discovering leads that match your criteria...",
    });

    setTimeout(() => {
      setIsSearching(false);
      navigate("/results");
    }, 2000);
  };

  const handleNaturalLanguageSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Query Required",
        description: "Please enter a search query to find leads.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    toast({
      title: "AI Processing",
      description: `Analyzing: "${searchQuery}"`,
    });

    setTimeout(() => {
      setIsSearching(false);
      navigate("/results");
    }, 2000);
  };

  const sampleQueries = [
    "Find SaaS companies in US with 50-200 employees using Salesforce",
    "B2B companies in fintech space with recent funding rounds",
    "E-commerce platforms in Europe using Shopify or WooCommerce",
    "Healthcare startups with AI/ML technology in their stack"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Search for High-Quality Leads
          </h1>
          <p className="text-muted-foreground">
            Use AI-powered search to discover prospects that match your ideal customer profile
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <SearchFilters onSearch={handleSearch} />
          </div>

          {/* Main Search Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Natural Language Search */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <MessageCircle className="mr-2 h-5 w-5 text-primary" />
                  Natural Language Search
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Describe your ideal customer in plain English, and AI will find them
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="e.g., Find B2B SaaS companies in the US with 100-500 employees that use Hubspot..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                    onKeyPress={(e) => e.key === 'Enter' && handleNaturalLanguageSearch()}
                  />
                  <Button 
                    onClick={handleNaturalLanguageSearch}
                    disabled={isSearching}
                    className="btn-primary"
                  >
                    {isSearching ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Sample Queries */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Try these examples:</p>
                  <div className="flex flex-wrap gap-2">
                    {sampleQueries.map((query, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10 text-xs p-2"
                        onClick={() => setSearchQuery(query)}
                      >
                        {query}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search Tips */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Sparkles className="mr-2 h-5 w-5 text-primary" />
                  Pro Tips for Better Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Be Specific</h4>
                    <p className="text-sm text-muted-foreground">
                      Include industry, company size, location, and technology requirements
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Use Keywords</h4>
                    <p className="text-sm text-muted-foreground">
                      Mention specific tools, platforms, or technologies they might use
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Filter Results</h4>
                    <p className="text-sm text-muted-foreground">
                      Use the sidebar filters to narrow down your search results
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Quality Scores</h4>
                    <p className="text-sm text-muted-foreground">
                      Focus on A+ and A-rated leads for highest conversion rates
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Searches */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg">Recent Searches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { query: "SaaS companies in California", results: 247, time: "2 hours ago" },
                    { query: "Fintech startups with Series A funding", results: 89, time: "1 day ago" },
                    { query: "E-commerce platforms using Shopify", results: 156, time: "3 days ago" },
                  ].map((search, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSearchQuery(search.query)}
                    >
                      <div>
                        <p className="font-medium text-foreground">{search.query}</p>
                        <p className="text-sm text-muted-foreground">
                          {search.results} leads found • {search.time}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchLeads;