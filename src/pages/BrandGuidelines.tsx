import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useState } from "react";

const BrandGuidelines = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    const element = document.getElementById("brand-guidelines-content");
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("eduintbd-brand-guidelines.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const colors = [
    { name: "Primary", value: "hsl(215, 45%, 12%)", hex: "#1a2332", desc: "Deep navy blue" },
    { name: "Primary Foreground", value: "hsl(0, 0%, 100%)", hex: "#ffffff", desc: "White" },
    { name: "Secondary/Accent", value: "hsl(48, 50%, 65%)", hex: "#d9c179", desc: "Warm gold" },
    { name: "Background", value: "hsl(0, 0%, 100%)", hex: "#ffffff", desc: "Pure white" },
    { name: "Foreground", value: "hsl(215, 28%, 17%)", hex: "#20293d", desc: "Dark blue-gray" },
    { name: "Muted", value: "hsl(210, 20%, 96%)", hex: "#f2f4f7", desc: "Light gray" },
    { name: "Border", value: "hsl(215, 20%, 90%)", hex: "#d9dfe8", desc: "Light border gray" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Brand Guidelines</h1>
            <p className="text-muted-foreground">EduInt BD Design System</p>
          </div>
          <Button onClick={handleDownloadPDF} disabled={isGenerating}>
            <Download className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Download PDF"}
          </Button>
        </div>

        <div id="brand-guidelines-content" className="bg-white p-8 space-y-12">
          {/* Header */}
          <div className="text-center border-b pb-8">
            <h1 className="text-5xl font-display font-bold text-primary mb-4">
              EduInt BD
            </h1>
            <p className="text-xl text-muted-foreground">Brand Guidelines & Design System</p>
            <p className="text-sm text-muted-foreground mt-2">Version 1.0 • 2025</p>
          </div>

          {/* Color Palette */}
          <section>
            <h2 className="text-3xl font-display font-semibold text-primary mb-6">Color Palette</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {colors.map((color) => (
                <Card key={color.name} className="p-6">
                  <div
                    className="w-full h-24 rounded-lg mb-4 border"
                    style={{ backgroundColor: color.hex }}
                  />
                  <h3 className="font-semibold text-lg mb-2">{color.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{color.desc}</p>
                  <div className="space-y-1 text-xs font-mono">
                    <p className="text-muted-foreground">HSL: {color.value}</p>
                    <p className="text-muted-foreground">HEX: {color.hex}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section>
            <h2 className="text-3xl font-display font-semibold text-primary mb-6">Typography</h2>
            
            <Card className="p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Display Font - Playfair Display</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Used for headings and titles. Elegant and authoritative.
              </p>
              <div className="space-y-3">
                <div className="font-display text-5xl font-bold">Heading 1</div>
                <div className="font-display text-4xl font-semibold">Heading 2</div>
                <div className="font-display text-3xl font-semibold">Heading 3</div>
                <div className="font-display text-2xl font-semibold">Heading 4</div>
                <div className="font-display text-xl font-semibold">Heading 5</div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Body Font - Inter</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Used for body text and UI elements. Modern and highly readable.
              </p>
              <div className="space-y-3">
                <p className="text-lg">Large Text - 18px</p>
                <p className="text-base">Body Text - 16px</p>
                <p className="text-sm">Small Text - 14px</p>
                <p className="text-xs">Extra Small - 12px</p>
              </div>
            </Card>
          </section>

          {/* Gradients */}
          <section>
            <h2 className="text-3xl font-display font-semibold text-primary mb-6">Gradients</h2>
            <div className="space-y-4">
              <Card className="p-6">
                <div
                  className="w-full h-32 rounded-lg mb-4"
                  style={{
                    background: "linear-gradient(135deg, hsl(215 45% 12%) 0%, hsl(220 50% 20%) 100%)",
                  }}
                />
                <h3 className="font-semibold text-lg mb-2">Primary Gradient</h3>
                <p className="text-xs font-mono text-muted-foreground">
                  linear-gradient(135deg, hsl(215 45% 12%) 0%, hsl(220 50% 20%) 100%)
                </p>
              </Card>

              <Card className="p-6">
                <div
                  className="w-full h-32 rounded-lg mb-4"
                  style={{
                    background: "linear-gradient(135deg, hsl(48 50% 65%) 0%, hsl(45 70% 75%) 100%)",
                  }}
                />
                <h3 className="font-semibold text-lg mb-2">Accent Gradient</h3>
                <p className="text-xs font-mono text-muted-foreground">
                  linear-gradient(135deg, hsl(48 50% 65%) 0%, hsl(45 70% 75%) 100%)
                </p>
              </Card>
            </div>
          </section>

          {/* Spacing & Borders */}
          <section>
            <h2 className="text-3xl font-display font-semibold text-primary mb-6">Spacing & Borders</h2>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Border Radius</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-primary rounded-lg"></div>
                  <div>
                    <p className="font-semibold">Large</p>
                    <p className="text-sm text-muted-foreground">0.75rem (12px)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-primary rounded-md"></div>
                  <div>
                    <p className="font-semibold">Medium</p>
                    <p className="text-sm text-muted-foreground">0.5rem (8px)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-primary rounded-sm"></div>
                  <div>
                    <p className="font-semibold">Small</p>
                    <p className="text-sm text-muted-foreground">0.25rem (4px)</p>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Brand Essence */}
          <section>
            <h2 className="text-3xl font-display font-semibold text-primary mb-6">Brand Essence</h2>
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Color Philosophy</h3>
                  <p className="text-muted-foreground">
                    Deep Navy Blue conveys trust, professionalism, and educational authority. 
                    Warm Gold represents achievement, success, and premium quality.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Typography Philosophy</h3>
                  <p className="text-muted-foreground">
                    Playfair Display provides elegance and authority for headings, while Inter 
                    offers modern readability for body content, creating a professional yet 
                    approachable aesthetic.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Design Principles</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Premium, elegant aesthetic</li>
                    <li>High contrast for accessibility</li>
                    <li>Smooth, sophisticated animations</li>
                    <li>Professional color palette balancing trust with warmth</li>
                    <li>Responsive and mobile-first approach</li>
                  </ul>
                </div>
              </div>
            </Card>
          </section>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground border-t pt-8">
            <p>© 2025 EduInt BD. All rights reserved.</p>
            <p className="mt-2">For internal use only. Do not distribute without permission.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandGuidelines;
