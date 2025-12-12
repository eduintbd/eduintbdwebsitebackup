import { Navigation } from "@/components/Navigation";

const Career = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Embedded Career Portal */}
      <div className="flex-1 pt-16 sm:pt-20">
        <iframe
          src="https://eduintbdteam.lovable.app"
          className="w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] border-0"
          title="EduIntBD Careers Portal"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default Career;
