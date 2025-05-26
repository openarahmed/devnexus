// pages/privacy.tsx
import React from "react";
import Head from "next/head"; // For setting the page title

const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy - DevNexus</title>
      </Head>
      <main className="bg-gray-900 text-white min-h-screen py-12 sm:py-16 px-6 sm:px-8">
        <div className="container mx-auto max-w-3xl bg-gray-800 p-8 sm:p-10 md:p-12 rounded-xl shadow-xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-400 mb-8 text-center">
            Privacy Policy
          </h1>

          <div className="space-y-6 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                1. Introduction
              </h2>
              <p>
                Welcome to DevNexus (us, we, or our). We are committed to
                protecting your personal information and your right to privacy.
                If you have any questions or concerns about our policy, or our
                practices with regards to your personal information, please
                contact us.
              </p>
              <p>
                This privacy policy applies to all information collected through
                our website (such as [YourWebsiteURL.com]), and/or any related
                services, sales, marketing or events (we refer to them
                collectively in this privacy policy as the Services).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                2. Information We Collect
              </h2>
              <p>
                We collect personal information that you voluntarily provide to
                us when you register on the Services, express an interest in
                obtaining information about us or our products and services,
                when you participate in activities on the Services or otherwise
                when you contact us.
              </p>
              <p>
                The personal information that we collect depends on the context
                of your interactions with us and the Services, the choices you
                make and the products and features you use. The personal
                information we collect may include the following:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-1 mt-2">
                <li>Names</li>
                <li>Email addresses</li>
                <li>Usernames</li>
                <li>Passwords (stored securely and hashed)</li>
                <li>Contact preferences</li>
                <li>
                  Interests and skills (as provided by you for roadmap
                  generation)
                </li>
                <li>Usage Data (e.g., features used, progress tracked)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                3. How We Use Your Information
              </h2>
              <p>
                We use personal information collected via our Services for a
                variety of business purposes described below. We process your
                personal information for these purposes in reliance on our
                legitimate business interests, in order to enter into or perform
                a contract with you, with your consent, and/or for compliance
                with our legal obligations.
              </p>
              <ul className="list-disc list-inside pl-4 space-y-1 mt-2">
                <li>To facilitate account creation and logon process.</li>
                <li>
                  To personalize your experience and generate tailored roadmaps.
                </li>
                <li>To send administrative information to you.</li>
                <li>To manage user accounts.</li>
                <li>To provide and improve our Services.</li>
                <li>
                  For data analysis, identifying usage trends, and to evaluate
                  and improve our Services.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                4. Will Your Information Be Shared With Anyone?
              </h2>
              <p>
                We only share information with your consent, to comply with
                laws, to provide you with services, to protect your rights, or
                to fulfill business obligations.
              </p>
              <p>
                Specifically, we may need to process your data or share your
                personal information in the following situations: Business
                Transfers, Affiliates, Third-Party Service Providers (e.g., AI
                API providers, hosting services - with strict data protection
                agreements).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                5. How Long Do We Keep Your Information?
              </h2>
              <p>
                We will only keep your personal information for as long as it is
                necessary for the purposes set out in this privacy policy,
                unless a longer retention period is required or permitted by law
                (such as tax, accounting or other legal requirements).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                6. How Do We Keep Your Information Safe?
              </h2>
              <p>
                We have implemented appropriate technical and organizational
                security measures designed to protect the security of any
                personal information we process. However, despite our safeguards
                and efforts to secure your information, no electronic
                transmission over the Internet or information storage technology
                can be guaranteed to be 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                7. Your Privacy Rights
              </h2>
              <p>
                In some regions (like the EEA and UK), you have rights that
                allow you greater access to and control over your personal
                information. You may review, change, or terminate your account
                at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                8. Updates To This Policy
              </h2>
              <p>
                We may update this privacy policy from time to time. The updated
                version will be indicated by an updated &quot;Revised&quot; date
                and the updated version will be effective as soon as it is
                accessible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                9. How Can You Contact Us About This Policy?
              </h2>
              <p>
                If you have questions or comments about this policy, you may
                email us at [YourContactEmail@example.com] or by post to:
              </p>
              <p className="mt-2">
                [Your Company Name/Your Name]
                <br />
                [Your Address Line 1]
                <br />
                [Your Address Line 2]
                <br />
                [City, State, Zip Code]
                <br />
                [Country]
              </p>
            </section>
            <p className="text-sm text-gray-500 text-center pt-4">
              Last updated: May 26, 2025
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default PrivacyPolicyPage;
