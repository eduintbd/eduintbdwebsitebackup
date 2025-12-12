import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container px-6 py-24">
        <article className="max-w-4xl mx-auto prose prose-slate">
          <h1 className="text-4xl font-display font-bold text-foreground mb-8">Privacy Policy</h1>
          
          <p className="text-muted-foreground mb-6">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Education International ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-foreground mb-3">2.1 Personal Information</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Register for an account</li>
              <li>Fill out contact forms</li>
              <li>Subscribe to our newsletters</li>
              <li>Apply for our services</li>
              <li>Communicate with us</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              This information may include: name, email address, phone number, date of birth, educational background, passport information, and other relevant details for study abroad applications.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">2.2 Automatically Collected Information</h3>
            <p className="text-muted-foreground leading-relaxed">
              When you visit our website, we automatically collect certain information about your device, including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Pages visited and time spent</li>
              <li>Referring URLs</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>To provide and manage our education consulting services</li>
              <li>To process your applications and communications</li>
              <li>To improve our website and services</li>
              <li>To send you updates, newsletters, and marketing communications (with your consent)</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To comply with legal obligations</li>
              <li>To protect against fraud and unauthorized activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Educational Institutions:</strong> Universities and colleges you're applying to</li>
              <li><strong>Service Providers:</strong> Third-party vendors who assist us in operating our website and services</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with any merger, sale, or acquisition of our business</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Objection:</strong> Object to processing of your information</li>
              <li><strong>Data Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Withdrawal of Consent:</strong> Withdraw consent for marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Cookies and Tracking Technologies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website may contain links to third-party websites and services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children under 16. If you become aware that a child has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <ul className="list-none text-muted-foreground space-y-2">
              <li><strong>Email:</strong> info@eduintbd.com</li>
              <li><strong>Phone:</strong> +880 1898934855</li>
              <li><strong>Address:</strong> 264 Elephant Road, Bata Signal, Dhaka 1205</li>
            </ul>
          </section>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;