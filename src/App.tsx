import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import { useMetaPixel } from "@/hooks/use-meta-pixel";
import Index from "./pages/Index";
import IELTSLearning from "./pages/IELTSLearning";
import IELTSModule from "./pages/IELTSModule";
import IELTSMaterials from "./pages/IELTSMaterials";
import GamifiedLearning from "./pages/GamifiedLearning";
import IELTSAnalytics from "./pages/IELTSAnalytics";
import VocabularyRace from "./pages/games/VocabularyRace";
import GrammarBattle from "./pages/games/GrammarBattle";
import ListeningPuzzle from "./pages/games/ListeningPuzzle";
import ReadingSprint from "./pages/games/ReadingSprint";
import AIBuddy from "./pages/AIBuddy";
import WritingPractice from "./pages/WritingPractice";
import ListeningPractice from "./pages/ListeningPractice";
import SpeakingPractice from "./pages/SpeakingPractice";
import ReadingPractice from "./pages/ReadingPractice";
import AIAdvisor from "./pages/AIAdvisor";
import StudyPlanner from "./pages/StudyPlanner";
import NotFound from "./pages/NotFound";
import StudyUSA from "./pages/StudyUSA";
import StudyUK from "./pages/StudyUK";
import StudyCanada from "./pages/StudyCanada";
import StudyAustralia from "./pages/StudyAustralia";
import StudyGermany from "./pages/StudyGermany";
import StudyNewZealand from "./pages/StudyNewZealand";
import StudySouthKorea from "./pages/StudySouthKorea";
import Admission from "./pages/Admission";
import Visa from "./pages/Visa";
import Scholarship from "./pages/Scholarship";
import Career from "./pages/Career";
import Accommodation from "./pages/Accommodation";
import PreDeparture from "./pages/PreDeparture";
import Login from "./pages/Login";
import Portal from "./pages/Portal";
import Admin from "./pages/Admin";
import Blog from "./pages/Blog";
import AustraliaVisaGuide from "./pages/blog/AustraliaVisaGuide";
import MBAAbroad from "./pages/blog/MBAAbroad";
import MastersCS from "./pages/blog/MastersCS";
import UKUndergraduate from "./pages/blog/UKUndergraduate";
import PhDScholarships from "./pages/blog/PhDScholarships";
import MedicalStudies from "./pages/blog/MedicalStudies";
import EngineeringCanada from "./pages/blog/EngineeringCanada";
import BBAAustralia from "./pages/blog/BBAAustralia";
import PublicUniversities from "./pages/blog/PublicUniversities";
import BestConsultancy from "./pages/blog/BestConsultancy";
import CanadaScholarship from "./pages/blog/CanadaScholarship";
import GermanyCost from "./pages/blog/GermanyCost";
import AustraliaVisaSuccess from "./pages/blog/AustraliaVisaSuccess";
import SOPSample from "./pages/blog/SOPSample";
import LocalConsultants from "./pages/blog/LocalConsultants";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import BrandGuidelines from "./pages/BrandGuidelines";
import { FloatingActions } from "./components/FloatingActions";

const queryClient = new QueryClient();

// Initialize Google Analytics
// Replace 'G-XXXXXXXXXX' with your actual Google Analytics Measurement ID
const GA_MEASUREMENT_ID = "G-50CX4L5XY5";
ReactGA.initialize(GA_MEASUREMENT_ID);

const PageTracker = () => {
  const location = useLocation();
  const { trackPageView } = useMetaPixel();

  useEffect(() => {
    // Track page view on route change
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
    trackPageView();
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageTracker />
        <FloatingActions />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/study-usa" element={<StudyUSA />} />
          <Route path="/study-uk" element={<StudyUK />} />
          <Route path="/study-canada" element={<StudyCanada />} />
          <Route path="/study-australia" element={<StudyAustralia />} />
          <Route path="/study-germany" element={<StudyGermany />} />
          <Route path="/study-new-zealand" element={<StudyNewZealand />} />
          <Route path="/study-south-korea" element={<StudySouthKorea />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/visa" element={<Visa />} />
          <Route path="/scholarship" element={<Scholarship />} />
          <Route path="/career" element={<Career />} />
          <Route path="/accommodation" element={<Accommodation />} />
          <Route path="/pre-departure" element={<PreDeparture />} />
          <Route path="/login" element={<Login />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/a-complete-guide-to-the-student-visa-process-for-australia-from-bangladesh" element={<AustraliaVisaGuide />} />
          <Route path="/blog/mba-abroad-from-bangladesh-pathways-and-opportunities" element={<MBAAbroad />} />
          <Route path="/blog/masters-in-computer-science-in-usa-admission-scholarships-and-student-life" element={<MastersCS />} />
          <Route path="/blog/undergraduate-programs-in-uk-step-by-step-application-guide" element={<UKUndergraduate />} />
          <Route path="/blog/phd-scholarships-abroad-unlocking-advanced-research-opportunities" element={<PhDScholarships />} />
          <Route path="/blog/medical-studies-abroad-for-bangladeshi-students-admission-visa-and-scholarships" element={<MedicalStudies />} />
          <Route path="/blog/engineering-universities-in-canada-admission-process-simplified" element={<EngineeringCanada />} />
          <Route path="/blog/bba-in-australia-how-to-apply-from-bangladesh" element={<BBAAustralia />} />
          <Route path="/blog/public-university-admission-abroad-key-considerations" element={<PublicUniversities />} />
          <Route path="/blog/which-is-the-best-education-consultancy-in-dhaka" element={<BestConsultancy />} />
          <Route path="/blog/how-to-get-a-full-scholarship-to-study-in-canada" element={<CanadaScholarship />} />
          <Route path="/blog/cost-of-studying-in-germany-for-bangladeshi-students" element={<GermanyCost />} />
          <Route path="/blog/student-visa-success-rate-for-australia" element={<AustraliaVisaSuccess />} />
          <Route path="/blog/sop-sample-for-masters-in-data-science" element={<SOPSample />} />
          <Route path="/blog/study-abroad-consultants-near-me-why-local-expertise-matters" element={<LocalConsultants />} />
          <Route path="/ielts-learning" element={<IELTSLearning />} />
          <Route path="/ielts/module/:moduleId" element={<IELTSModule />} />
          <Route path="/ielts/materials" element={<IELTSMaterials />} />
          <Route path="/ielts/gamified" element={<GamifiedLearning />} />
          <Route path="/ielts/analytics" element={<IELTSAnalytics />} />
          <Route path="/ielts/games/vocabulary-race" element={<VocabularyRace />} />
          <Route path="/ielts/games/grammar-battle" element={<GrammarBattle />} />
          <Route path="/ielts/games/listening-puzzle" element={<ListeningPuzzle />} />
          <Route path="/ielts/games/reading-sprint" element={<ReadingSprint />} />
          <Route path="/ielts/ai-buddy" element={<AIBuddy />} />
          <Route path="/ielts/writing" element={<WritingPractice />} />
          <Route path="/ielts/listening" element={<ListeningPractice />} />
          <Route path="/ielts/speaking" element={<SpeakingPractice />} />
          <Route path="/ielts/reading" element={<ReadingPractice />} />
          <Route path="/ai-advisor" element={<AIAdvisor />} />
          <Route path="/study-planner" element={<StudyPlanner />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/brand-guidelines" element={<BrandGuidelines />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
