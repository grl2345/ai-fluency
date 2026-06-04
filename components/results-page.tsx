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
  allQuestions,
  dimensions,
  levels,
  learningResources,
  scorePractical,
} from "@/lib/test-data";
import { useLang } from "@/contexts/language-context";
import { UI, t } from "@/lib/i18n";
import {
  Download,
  Share2,
  RefreshCw,
  BookOpen,
  TrendingUp,
  Award,
  ChevronRight,
  MessageSquare,
  CheckCircle,
  GitMerge,
  Shield,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  Brain,
  Target,
} from "lucide-react";

interface ResultsPageProps {
  answers: Record<number, string>;
  practicalTexts: Record<string, string>;
  profileData: Record<string, string | string[]>;
  onRetake: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Brain,
  Target,
  MessageSquare,
  CheckCircle,
  GitMerge,
  Shield,
};

export function ResultsPage({ answers, practicalTexts, profileData, onRetake }: ResultsPageProps) {
  const { lang } = useLang();

  // Dimension scores from knowledge + scenario questions
  const dimensionScores = useMemo(() => {
    const scores: Record<string, { total: number; max: number }> = {};
    dimensions.forEach((dim) => {
      scores[dim.id] = { total: 0, max: 0 };
    });

    allQuestions.forEach((q) => {
      if (!q.dimension || q.type === "profile" || q.type === "practical") return;
      const answerId = answers[q.id as unknown as number];
      if (!answerId) return;
      const selectedOption = q.options?.find((opt) => opt.id === answerId);
      const maxScore = q.options ? Math.max(...q.options.map((opt) => opt.score)) : 0;
      if (selectedOption) {
        scores[q.dimension].total += selectedOption.score * q.weight;
        scores[q.dimension].max += maxScore * q.weight;
      }
    });

    // Add practical scores into their dimensions
    allQuestions
      .filter((q) => q.type === "practical" && q.dimension)
      .forEach((q) => {
        const text = practicalTexts[q.id] || "";
        const prScore = scorePractical(q.id, text);
        const maxPr = 5;
        scores[q.dimension!].total += prScore * q.weight;
        scores[q.dimension!].max += maxPr * q.weight;
      });

    return Object.entries(scores).map(([id, data]) => {
      const dimension = dimensions.find((d) => d.id === id)!;
      const percentage = data.max > 0 ? Math.round((data.total / data.max) * 100) : 0;
      const nameStr = dimension.name[lang];
      const shortName = lang === "zh" ? nameStr.slice(0, 4) : nameStr.slice(0, 8);
      return {
        id,
        name: nameStr,
        shortName,
        score: Math.min(100, percentage),
        fullMark: 100,
      };
    });
  }, [answers, practicalTexts, lang]);

  // Tier calculation from scenario tierSignals
  const behavioralTier = useMemo(() => {
    const signals: number[] = [];
    allQuestions
      .filter((q) => q.type === "scenario")
      .forEach((q) => {
        const answerId = answers[q.id as unknown as number];
        if (!answerId) return;
        const opt = q.options?.find((o) => o.id === answerId);
        if (opt?.tierSignal) signals.push(opt.tierSignal);
      });
    if (signals.length === 0) return 1;
    signals.sort((a, b) => a - b);
    const mid = Math.floor(signals.length / 2);
    return signals.length % 2 !== 0
      ? signals[mid]
      : Math.round((signals[mid - 1] + signals[mid]) / 2);
  }, [answers]);

  const practicalTier = useMemo(() => {
    const pr1 = scorePractical("PR1", practicalTexts["PR1"] || "");
    const pr2 = scorePractical("PR2", practicalTexts["PR2"] || "");
    const pr3 = scorePractical("PR3", practicalTexts["PR3"] || "");
    const total = pr1 + pr2 + pr3;
    if (total <= 5) return 2;
    if (total <= 10) return 3;
    return 4;
  }, [practicalTexts]);

  const mainTier = Math.min(behavioralTier, practicalTier);

  const currentLevel = useMemo(() => {
    // map tier to level index
    // tier 1→L1, 2→L2, 3→L3, 4→L4, 5-6→L5
    const levelIdx = Math.max(0, Math.min(4, mainTier - 1));
    return levels[levelIdx];
  }, [mainTier]);

  const totalScore = currentLevel.minScore + Math.round((currentLevel.maxScore - currentLevel.minScore) * 0.5);

  // Gap analysis
  const gapMessage = useMemo(() => {
    const p2 = profileData["P2"] as string | undefined;
    const expectedTierMap: Record<string, number> = {
      never: 1,
      lt6m: 2,
      "6m2y": 3,
      gt2y: 4,
    };
    if (!p2 || !(p2 in expectedTierMap)) return null;
    const expected = expectedTierMap[p2];
    const gap = expected - mainTier;
    if (gap > 0) return t(UI.results.gapPositive, lang);
    if (gap < 0) return t(UI.results.gapNegative, lang);
    return t(UI.results.gapNeutral, lang);
  }, [profileData, mainTier, lang]);

  const sortedDimensions = useMemo(
    () => [...dimensionScores].sort((a, b) => b.score - a.score),
    [dimensionScores]
  );

  const strengths = sortedDimensions.slice(0, 2);
  const improvements = sortedDimensions.slice(-2).reverse();

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Section — light, celebratory */}
      <section className="relative overflow-hidden px-6 py-16 md:py-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-indigo-300/25 blur-[120px]" />
          <div className="absolute -right-24 top-10 h-[380px] w-[380px] rounded-full bg-fuchsia-300/20 blur-[120px]" />
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700">
              <Sparkles className="h-3.5 w-3.5" />
              {t(UI.results.badge, lang)}
            </span>

            <h1 className="mb-3 mt-6 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              {t(UI.results.title, lang)}
            </h1>
            <p className="mx-auto mb-10 max-w-xl text-slate-600">
              {t(UI.results.subtitle, lang)}
            </p>
          </motion.div>

          {/* Level Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <div className="inline-flex flex-col items-center">
              <div className="relative mb-5">
                <div className={`absolute inset-0 rounded-full blur-2xl opacity-30 ${currentLevel.color}`} />
                <div
                  className={`relative flex h-32 w-32 flex-col items-center justify-center rounded-full border-4 border-white ${currentLevel.color} text-white shadow-2xl shadow-indigo-500/20`}
                >
                  <span className="text-4xl font-black">{currentLevel.badge}</span>
                  <span className="text-sm font-semibold opacity-90">
                    {totalScore}{t(UI.levels.points, lang)}
                  </span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{currentLevel.name[lang]}</h2>
              <p className="mt-2 max-w-sm text-sm text-slate-500">
                {currentLevel.description[lang]}
              </p>
            </div>
          </motion.div>

          {/* Gap analysis */}
          {gapMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mx-auto mb-8 max-w-md rounded-2xl border border-indigo-100 bg-indigo-50/60 px-6 py-4 text-sm text-slate-600"
            >
              {gapMessage}
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg">
              <Share2 className="h-4 w-4" />
              {t(UI.results.share, lang)}
            </button>
            <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50">
              <Download className="h-4 w-4" />
              {t(UI.results.download, lang)}
            </button>
            <button onClick={onRetake} className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900">
              <RefreshCw className="h-4 w-4" />
              {t(UI.results.retake, lang)}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mx-auto mb-10 grid w-full max-w-sm grid-cols-3 rounded-lg border border-slate-200 bg-slate-100 p-1">
            <TabsTrigger value="overview" className="gap-1.5 rounded-md text-sm font-medium">
              <Award className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t(UI.results.overview, lang)}</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="gap-1.5 rounded-md text-sm font-medium">
              <BarChart3 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t(UI.results.breakdown, lang)}</span>
            </TabsTrigger>
            <TabsTrigger value="learning" className="gap-1.5 rounded-md text-sm font-medium">
              <BookOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t(UI.results.learn, lang)}</span>
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
                    {t(UI.results.radar, lang)}
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
                        <PolarGrid stroke="#e2e8f0" strokeOpacity={0.8} />
                        <PolarAngleAxis
                          dataKey="shortName"
                          tick={{
                            fill: "#64748b",
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        />
                        <PolarRadiusAxis
                          angle={30}
                          domain={[0, 100]}
                          tick={{ fill: "#94a3b8", fontSize: 10 }}
                          axisLine={false}
                        />
                        <Radar
                          name="Score"
                          dataKey="score"
                          stroke="#6366f1"
                          fill="#6366f1"
                          fillOpacity={0.18}
                          strokeWidth={2.5}
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
                      {t(UI.results.strengths, lang)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {strengths.map((dim) => {
                      const fullDim = dimensions.find((d) => d.id === dim.id);
                      const Icon = iconMap[fullDim?.icon || "Brain"];
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
                                {fullDim?.description[lang]}
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
                      {t(UI.results.growth, lang)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {improvements.map((dim) => {
                      const fullDim = dimensions.find((d) => d.id === dim.id);
                      const Icon = iconMap[fullDim?.icon || "Brain"];
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
                                {fullDim?.description[lang]}
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
                const Icon = iconMap[fullDim?.icon || "Brain"];
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
                              {fullDim?.description[lang]}
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
                {t(UI.results.learningPath, lang)}
              </h3>
              <p className="text-muted-foreground">
                {t(UI.results.learningDesc, lang)}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {improvements.map((dim) => {
                const resources = learningResources.find((r) => r.dimension === dim.id);
                const fullDim = dimensions.find((d) => d.id === dim.id);
                const Icon = iconMap[fullDim?.icon || "Brain"];

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
                            {t(UI.results.priority, lang)}
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {resources?.resources.map((res, idx) => {
                        const resTitle = typeof res.title === "object" ? res.title[lang] : res.title;
                        const resDuration = typeof res.duration === "object" ? res.duration[lang] : res.duration;
                        const typeLabel =
                          res.type === "article" ? t(UI.results.article, lang)
                          : res.type === "video" ? t(UI.results.video, lang)
                          : res.type === "course" ? t(UI.results.course, lang)
                          : res.type === "template" ? t(UI.results.template, lang)
                          : t(UI.results.newsletter, lang);

                        return (
                          <div
                            key={idx}
                            className="group flex cursor-pointer items-center justify-between rounded-xl border border-border/40 p-4 transition-all hover:border-primary/30 hover:bg-secondary/50"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-foreground group-hover:text-primary">
                                {resTitle}
                              </p>
                              <div className="mt-1.5 flex items-center gap-3 text-sm text-muted-foreground">
                                <Badge variant="secondary" className="text-xs font-normal">
                                  {typeLabel}
                                </Badge>
                                <span>{resDuration}</span>
                              </div>
                            </div>
                            <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-10 text-center">
              <Button size="lg" className="gap-2 rounded-full px-8">
                {t(UI.results.exploreCatalog, lang)}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
