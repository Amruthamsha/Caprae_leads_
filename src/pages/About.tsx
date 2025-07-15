import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Target, Zap, Brain, Users, Award, Globe } from "lucide-react";

const About = () => {
  const achievements = [
    { metric: "100M+", label: "Company Profiles" },
    { metric: "50+", label: "Data Sources" },
    { metric: "95%", label: "Accuracy Rate" },
    { metric: "10x", label: "Faster than Manual" },
  ];

  const technologies = [
    "Machine Learning", "Natural Language Processing", "Web Scraping", 
    "Data Enrichment", "Real-time APIs", "Cloud Infrastructure"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            About Caprae Leads
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            This tool was built as part of Caprae Capital's AI-readiness challenge to help 
            transform private equity through intelligent tech solutions.
          </p>
        </div>

        {/* Challenge Context */}
        <Card className="card-elevated mb-12">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Target className="mr-3 h-6 w-6 text-primary" />
              The 5-Hour Challenge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Caprae Capital challenged candidates to demonstrate AI-readiness by building a 
              professional lead generation tool in just 5 hours. This project showcases the 
              ability to rapidly prototype intelligent solutions that can transform business operations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Rapid Development</h3>
                <p className="text-sm text-muted-foreground">
                  Built from concept to deployment in under 5 hours
                </p>
              </div>
              
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">AI-First Approach</h3>
                <p className="text-sm text-muted-foreground">
                  Leverages artificial intelligence for intelligent lead discovery
                </p>
              </div>
              
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Business Impact</h3>
                <p className="text-sm text-muted-foreground">
                  Designed to deliver immediate value to sales teams
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Caprae Capital */}
        <Card className="card-elevated mb-12">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Award className="mr-3 h-6 w-6 text-primary" />
              About Caprae Capital
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Caprae Capital is transforming private equity through intelligent technology solutions. 
              They focus on leveraging AI and data-driven approaches to enhance investment decisions, 
              portfolio management, and operational excellence.
            </p>
            
            <div className="flex items-center justify-center">
              <Button variant="outline" size="lg" asChild>
                <a href="https://www.saasquatchleads.com" target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2 h-4 w-4" />
                  Visit SaaSquatch Leads
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Technical Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-xl">Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="text-center">
                    <p className="text-3xl font-bold text-primary">{achievement.metric}</p>
                    <p className="text-sm text-muted-foreground">{achievement.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-xl">Technologies Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Goals */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-2xl">Project Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-foreground mb-3">Technical Excellence</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Clean, modern UI/UX design</li>
                  <li>• Professional SaaS-quality interface</li>
                  <li>• Responsive design for all devices</li>
                  <li>• Scalable architecture patterns</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-3">Business Value</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Solve real lead generation challenges</li>
                  <li>• Demonstrate AI/ML integration capabilities</li>
                  <li>• Show understanding of B2B sales workflows</li>
                  <li>• Deliver investor-ready prototype</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t">
          <p className="text-muted-foreground mb-2">
            Built with ❤️ for Caprae Capital's AI-readiness challenge
          </p>
          <p className="text-sm text-muted-foreground">
            Demonstrating the future of intelligent business solutions
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;