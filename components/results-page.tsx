"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sampleQuestions,
  dimensions,
  levels,
  learningResources,
} from "@/lib/test-data";
import {
  Download,
  Share2,
  RefreshCw,
  BookOpen,
  TrendingUp,
  Award,
  ChevronRight,
  Wrench,
  MessageSquare,
  CheckCircle,
  GitMerge,
  Shield,
  BarChart3,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

interface ResultsPageProps {
  answers: Record<number, string>;
  onRetake: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Wrench,
  MessageSquare,
  CheckCircle,
  GitMerge,
  Shield,
  TrendingUp,
};

export function ResultsPage({ answers, onRetake }: ResultsPageProps) {
  // Calculate dimension scores
  const dimensionScores = useMemo(() => {
    const scores: Record<string, { total: number; max: number; count: number }> = {};

    dimensions.forEach((dim) => {
      scores[dim.id] = { total: 0, max: 0, count: 0 };
    });

    sampleQuestions.forEach((q) => {
      const answerId = answers[q.id];
      const selectedOption = q.options.find((opt) => opt.id === answerId);
      const maxScore = Math.max(...q.options.map((opt) => opt.score));

      if (selectedOption) {
        scores[q.dimension].total += selectedOption.score;
        scores[q.dimension].max += maxScore;
        scores[q.dimension].count += 1;
      }
    });

    return Object.entries(scores).map(([id, data]) => {
      const dimension = dimensions.find((d) => d.id === id)!;
      const percentage = data.max > 0 ? Math.round((data.total / data.max) * 100) : 0;
      return {
        id,
        name: dimension.name,
        shortName: dimension.name.split(" ")[0],
        score: percentage,
        fullMark: 100,
      };
    });
  }, [answers]);

  // Calculate total score and level
  const totalScore = useMemo(() => {
    const avg =
      dimensionScores.reduce((sum, d) => sum + d.score, 0) / dimensionScores.length;
    return Math.round(avg);
  }, [dimensionScores]);

  const currentLevel = useMemo(() => {
    return levels.find((l) => totalScore >= l.minScore && totalScore <= l.maxScore) || levels[0];
  }, [totalScore]);

  // Find strengths and areas for improvement
  const sortedDimensions = useMemo(() => {
    return [...dimensionScores].sort((a, b) => b.score - a.score);
  }, [dimensionScores]);

  const strengths = sortedDimensions.slice(0, 2);
  const improvements = sortedDimensions.slice(-2).reverse();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="border-b border-border/40 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="mb-6 rounded-full border-border/60 px-4 py-1.5"
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Assessment Complete
            </Badge>

            <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Your AI Fluency Profile
            </h1>
            <p className="mx-auto mb-10 max-w-xl text-muted-foreground">
              Based on your responses, here&apos;s a comprehensive analysis of your AI
              literacy across six key dimensions.
            </p>
          </motion.div>

          {/* Level Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10"
          >
            <div className="inline-flex flex-col items-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-xl" />
                <div
                  className={`relative flex h-32 w-32 flex-col items-center justify-center rounded-full ${currentLevel.color} text-white shadow-lg`}
                >
                  <span className="text-4xl font-bold">{currentLevel.badge}</span>
                  <span className="text-sm font-medium opacity-90">
                    {totalScore} pts
                  </span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground">{currentLevel.name}</h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                {currentLevel.description}
              </p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <Button variant="outline" className="gap-2 rounded-full">
              <Share2 className="h-4 w-4" />
              Share Results
            </Button>
            <Button variant="outline" className="gap-2 rounded-full">
              <Download className="h-4 w-4" />
              Download Certificate
            </Button>
            <Button variant="ghost" onClick={onRetake} className="gap-2 rounded-full">
              <RefreshCw className="h-4 w-4" />
              Retake Test
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-10 grid w-full max-w-md grid-cols-3 mx-auto rounded-full bg-secondary p-1">
            <TabsTrigger value="overview" className="gap-2 rounded-full text-sm">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="gap-2 rounded-full text-sm">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Breakdown</span>
            </TabsTrigger>
            <TabsTrigger value="learning" className="gap-2 rounded-full text-sm">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Learn</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Radar Chart */}
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Award className="h-5 w-5 text-primary" />
                    Competency Radar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="70%"
                        data={dimensionScores}
                      >
                        <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.5} />
                        <PolarAngleAxis
                          dataKey="shortName"
                          tick={{
                            fill: "hsl(var(--muted-foreground))",
                            fontSize: 11,
                            fontWeight: 500,
                          }}
                        />
                        <PolarRadiusAxis
                          angle={30}
                          domain={[0, 100]}
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                          axisLine={false}
                        />
                        <Radar
                          name="Score"
                          dataKey="score"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.15}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Strengths & Improvements */}
              <div className="space-y-6">
                <Card className="border-border/40">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg text-teal-600">
                      <TrendingUp className="h-5 w-5" />
                      Your Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {strengths.map((dim) => {
                      const fullDim = dimensions.find((d) => d.id === dim.id);
                      const Icon = iconMap[fullDim?.icon || "Wrench"];
                      return (
                        <div
                          key={dim.id}
                          className="flex items-center justify-between rounded-xl bg-teal-50 p-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100">
                              <Icon className="h-5 w-5 text-teal-600" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{dim.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {fullDim?.description}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-teal-500 text-white hover:bg-teal-500">
                            {dim.score}%
                          </Badge>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card className="border-border/40">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg text-amber-600">
                      <BookOpen className="h-5 w-5" />
                      Areas for Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {improvements.map((dim) => {
                      const fullDim = dimensions.find((d) => d.id === dim.id);
                      const Icon = iconMap[fullDim?.icon || "Wrench"];
                      return (
                        <div
                          key={dim.id}
                          className="flex items-center justify-between rounded-xl bg-amber-50 p-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
                              <Icon className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{dim.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {fullDim?.description}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="border-amber-300 text-amber-600"
                          >
                            {dim.score}%
                          </Badge>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details">
            <div className="grid gap-4 md:grid-cols-2">
              {dimensionScores.map((dim, index) => {
                const fullDim = dimensions.find((d) => d.id === dim.id);
                const Icon = iconMap[fullDim?.icon || "Wrench"];
                return (
                  <motion.div
                    key={dim.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-border/40">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
                            <Icon className="h-6 w-6 text-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-foreground">
                                {dim.name}
                              </h3>
                              <span className="text-lg font-bold text-primary">
                                {dim.score}%
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {fullDim?.description}
                            </p>
                            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${dim.score}%` }}
                                transition={{ duration: 0.8, delay: 0.2 + index * 0.05 }}
                                className="h-full rounded-full bg-primary"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning">
            <div className="mb-8 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-accent/5 p-6 md:p-8">
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Personalized Learning Path
              </h3>
              <p className="text-muted-foreground">
                Based on your assessment, we recommend focusing on these areas to
                advance from {currentLevel.name} to the next level.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {improvements.map((dim) => {
                const resources = learningResources.find((r) => r.dimension === dim.id);
                const fullDim = dimensions.find((d) => d.id === dim.id);
                const Icon = iconMap[fullDim?.icon || "Wrench"];

                return (
                  <Card key={dim.id} className="border-border/40">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                          <Icon className="h-5 w-5 text-foreground" />
                        </div>
                        <div>
                          <span className="text-lg">{dim.name}</span>
                          <Badge variant="outline" className="ml-3 text-xs">
                            Priority
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {resources?.resources.map((res, idx) => (
                        <div
                          key={idx}
                          className="group flex cursor-pointer items-center justify-between rounded-xl border border-border/40 p-4 transition-all hover:border-primary/30 hover:bg-secondary/50"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-foreground group-hover:text-primary">
                              {res.title}
                            </p>
                            <div className="mt-1.5 flex items-center gap-3 text-sm text-muted-foreground">
                              <Badge variant="secondary" className="text-xs font-normal">
                                {res.type === "article"
                                  ? "Article"
                                  : res.type === "video"
                                  ? "Video"
                                  : res.type === "course"
                                  ? "Course"
                                  : res.type === "template"
                                  ? "Template"
                                  : "Newsletter"}
                              </Badge>
                              <span>{res.duration}</span>
                            </div>
                          </div>
                          <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-10 text-center">
              <Button size="lg" className="gap-2 rounded-full px-8">
                Explore Full Learning Catalog
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
