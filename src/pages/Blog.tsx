import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const blogPosts = [
  {
    title: "A Complete Guide to the Student Visa Process for Australia from Bangladesh",
    excerpt: "Securing a student visa is a crucial step in your academic journey. Learn everything about eligibility requirements, documentation, financial proof, and interview preparation.",
    slug: "a-complete-guide-to-the-student-visa-process-for-australia-from-bangladesh"
  },
  {
    title: "MBA Abroad from Bangladesh: Pathways and Opportunities",
    excerpt: "Explore top MBA programs worldwide accessible to Bangladeshi students. Discover entry requirements, popular destinations, and scholarship opportunities.",
    slug: "mba-abroad-from-bangladesh-pathways-and-opportunities"
  },
  {
    title: "Masters in Computer Science in USA: Admission, Scholarships, and Student Life",
    excerpt: "Comprehensive guide covering university selection, application process, GRE/TOEFL requirements, and available scholarships for Bangladeshi students.",
    slug: "masters-in-computer-science-in-usa-admission-scholarships-and-student-life"
  },
  {
    title: "Undergraduate Programs in UK: Step-by-Step Application Guide",
    excerpt: "Discover how Bangladeshi students can apply for undergraduate degrees in the UK, including UCAS procedures and key deadlines.",
    slug: "undergraduate-programs-in-uk-step-by-step-application-guide"
  },
  {
    title: "PhD Scholarships Abroad: Unlocking Advanced Research Opportunities",
    excerpt: "Find out about major scholarship programs available for Bangladeshi students, eligibility criteria, and application tips for PhD programs.",
    slug: "phd-scholarships-abroad-unlocking-advanced-research-opportunities"
  },
  {
    title: "Medical Studies Abroad for Bangladeshi Students: Admission, Visa, and Scholarships",
    excerpt: "Learn about medical school options abroad, including entry exams, required qualifications, and student visa processes.",
    slug: "medical-studies-abroad-for-bangladeshi-students-admission-visa-and-scholarships"
  },
  {
    title: "Engineering Universities in Canada: Admission Process Simplified",
    excerpt: "Explore top engineering schools in Canada and understand the admission steps, academic prerequisites, and available scholarships.",
    slug: "engineering-universities-in-canada-admission-process-simplified"
  },
  {
    title: "BBA in Australia: How to Apply from Bangladesh",
    excerpt: "Get a detailed roadmap for Bangladeshi students interested in BBA programs in Australia, including admission requirements and visa guidance.",
    slug: "bba-in-australia-how-to-apply-from-bangladesh"
  },
  {
    title: "Public University Admission Abroad: Key Considerations",
    excerpt: "This post highlights differences in admission criteria, tuition fees, and scholarship availability for public universities overseas.",
    slug: "public-university-admission-abroad-key-considerations"
  },
  {
    title: "Which Is the Best Education Consultancy in Dhaka?",
    excerpt: "Learn why Universal Council stands out in Dhaka, offering expert guidance, comprehensive support, and a proven track record.",
    slug: "which-is-the-best-education-consultancy-in-dhaka"
  },
  {
    title: "How to Get a Full Scholarship to Study in Canada?",
    excerpt: "Discover actionable tips and resources to secure full scholarships for study in Canada with comprehensive insights.",
    slug: "how-to-get-a-full-scholarship-to-study-in-canada"
  },
  {
    title: "Cost of Studying in Germany for Bangladeshi Students",
    excerpt: "This post breaks down costs for Bangladeshi students, including tuition, accommodation, insurance, and daily expenses.",
    slug: "cost-of-studying-in-germany-for-bangladeshi-students"
  },
  {
    title: "Student Visa Success Rate for Australia",
    excerpt: "Analyze the latest statistics and share tips to improve your success rate for Australian student visa applications.",
    slug: "student-visa-success-rate-for-australia"
  },
  {
    title: "SOP Sample for Masters in Data Science",
    excerpt: "Find a sample SOP for Masters in Data Science, tailored for Bangladeshi applicants with personalization tips.",
    slug: "sop-sample-for-masters-in-data-science"
  },
  {
    title: "Study Abroad Consultants Near Me: Why Local Expertise Matters",
    excerpt: "Learn how Universal Council's local presence and personalized services make the difference for Bangladeshi students seeking overseas opportunities.",
    slug: "study-abroad-consultants-near-me-why-local-expertise-matters"
  }
];

const Blog = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-32 pb-24">
        <div className="container px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
              Latest Updates
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay informed with our latest guides, tips, and insights for studying abroad
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {blogPosts.map((post, index) => (
              <Card
                key={post.slug}
                className="p-6 hover:shadow-xl transition-all duration-300 animate-scale-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link to={`/blog/${post.slug}`}>
                  <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-primary font-medium group-hover:gap-3 transition-all">
                    Read More
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActions />
    </main>
  );
};

export default Blog;
