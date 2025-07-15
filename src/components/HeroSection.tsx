import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Target, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background to-secondary py-20 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 mx-0 max-w-none overflow-hidden">
        <div className="absolute left-1/2 top-0 ml-[-38rem] h-[25rem] w-[81.25rem] -translate-x-1/2 rotate-12 transform bg-gradient-to-r from-primary/10 to-primary-glow/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="mr-2 h-4 w-4" />
            AI-Powered Lead Discovery
          </div>

          {/* Main headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Discover High-Quality{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              B2B Leads
            </span>{" "}
            in Minutes
          </h1>

          {/* Subheadline */}
          <p className="mb-10 text-xl text-muted-foreground sm:text-2xl lg:text-xl max-w-3xl mx-auto leading-relaxed">
            AI-powered web scraping to find prospects that match your ICP — no manual searching required.
            Transform your sales pipeline with intelligent lead discovery.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <Button size="lg" className="btn-primary text-lg px-8 py-4" asChild>
              <Link to="/search">
                Start Free Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4" asChild>
              <Link to="/contact">
                Upload Criteria
              </Link>
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Smart Targeting</h3>
              <p className="text-muted-foreground">AI algorithms identify prospects matching your ideal customer profile</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Lightning Fast</h3>
              <p className="text-muted-foreground">Get comprehensive lead data in minutes, not hours or days</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">AI Enrichment</h3>
              <p className="text-muted-foreground">Automatically enrich leads with contact info, tech stack, and scoring</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;