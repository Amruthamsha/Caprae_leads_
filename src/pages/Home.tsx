import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Zap, Shield, BarChart3 } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Discovery",
      description: "AI-powered algorithms scan thousands of companies in minutes, not days."
    },
    {
      icon: Shield,
      title: "High-Quality Filtering",
      description: "Advanced filters ensure you only get leads that match your exact criteria."
    },
    {
      icon: BarChart3,
      title: "Smart Scoring System",
      description: "Each lead gets an AI-generated quality score from A+ to C for prioritization."
    }
  ];

  const benefits = [
    "Save 10+ hours per week on manual prospecting",
    "Increase lead quality by 3x with AI filtering",
    "Access to 100M+ company profiles globally",
    "Real-time data enrichment and verification",
    "One-click CRM integration",
    "Export leads in CSV, Excel, or API format"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
              Why Choose Caprae Leads?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for modern sales teams who need quality leads, not quantity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-elevated text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-6">
                Transform Your Sales Pipeline
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Stop wasting time on manual research. Let AI find your perfect prospects while you focus on closing deals.
              </p>
              
              <ul className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success mr-3 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Button size="lg" className="btn-primary" asChild>
                <Link to="/search">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="relative">
              <Card className="card-elevated p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Lead Quality</span>
                    <span className="text-2xl font-bold text-success">A+</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>TechCorp Solutions</span>
                      <span className="text-primary">SaaS</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>201-500 employees</span>
                      <span>United States</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      Perfect match for your ICP with high conversion probability
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
            Ready to 10x Your Lead Generation?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of sales teams already using Caprae Leads to discover their next big customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-primary text-lg px-8 py-4" asChild>
              <Link to="/search">Start Free Demo</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4" asChild>
              <Link to="/contact">Schedule Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              Built with ❤️ for Caprae Capital's AI-readiness challenge
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Transforming private equity through intelligent tech solutions
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;