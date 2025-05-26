// pages/terms.tsx
import React from "react";
import Head from "next/head";

const TermsOfServicePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Terms of Service - DevNexus</title>
      </Head>
      <main className="bg-gray-900 text-white min-h-screen py-12 sm:py-16 px-6 sm:px-8">
        <div className="container mx-auto max-w-3xl bg-gray-800 p-8 sm:p-10 md:p-12 rounded-xl shadow-xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-400 mb-8 text-center">
            Terms of Service
          </h1>

          <div className="space-y-6 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                1. Agreement to Terms
              </h2>
              <p>
                These Terms of Service constitute a legally binding agreement
                made between you, whether personally or on behalf of an entity
                (“you”) and DevNexus (“we,” “us” or “our”), concerning your
                access to and use of the [YourWebsiteURL.com] website as well as
                any other media form, media channel, mobile website or mobile
                application related, linked, or otherwise connected thereto
                (collectively, the “Site” or Services).
              </p>
              <p>
                You agree that by accessing the Site, you have read, understood,
                and agree to be bound by all of these Terms of Service. If you
                do not agree with all of these Terms of Service, then you are
                expressly prohibited from using the Site and you must
                discontinue use immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                2. Intellectual Property Rights
              </h2>
              <p>
                Unless otherwise indicated, the Site is our proprietary property
                and all source code, databases, functionality, software, website
                designs, audio, video, text, photographs, and graphics on the
                Site (collectively, the “Content”) and the trademarks, service
                marks, and logos contained therein (the “Marks”) are owned or
                controlled by us or licensed to us, and are protected by
                copyright and trademark laws.
              </p>
              <p>
                The Content and the Marks are provided on the Site “AS IS” for
                your information and personal use only. Except as expressly
                provided in these Terms of Service, no part of the Site and no
                Content or Marks may be copied, reproduced, aggregated,
                republished, uploaded, posted, publicly displayed, encoded,
                translated, transmitted, distributed, sold, licensed, or
                otherwise exploited for any commercial purpose whatsoever,
                without our express prior written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                3. User Representations
              </h2>
              <p>
                By using the Site, you represent and warrant that: (1) all
                registration information you submit will be true, accurate,
                current, and complete; (2) you will maintain the accuracy of
                such information and promptly update such registration
                information as necessary; (3) you have the legal capacity and
                you agree to comply with these Terms of Service; ... (etc. Add
                more representations as needed)
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                4. User Registration
              </h2>
              <p>
                You may be required to register with the Site. You agree to keep
                your password confidential and will be responsible for all use
                of your account and password. We reserve the right to remove,
                reclaim, or change a username you select if we determine, in our
                sole discretion, that such username is inappropriate, obscene,
                or otherwise objectionable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                5. Prohibited Activities
              </h2>
              <p>
                You may not access or use the Site for any purpose other than
                that for which we make the Site available. The Site may not be
                used in connection with any commercial endeavors except those
                that are specifically endorsed or approved by us.
              </p>
              <p>
                As a user of the Site, you agree not to: ... (List prohibited
                activities, e.g., systematic retrieval of data, unauthorized
                framing, tricking or misleading us and other users, etc.)
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                6. AI Generated Content
              </h2>
              <p>
                The Site utilizes artificial intelligence (AI) to generate
                suggestions, roadmaps, and other content. While we strive for
                accuracy and usefulness, AI-generated content may sometimes be
                incomplete, inaccurate, or reflect biases present in the data it
                was trained on. You acknowledge that any reliance on
                AI-generated content is at your own risk. We are not liable for
                any decisions made or actions taken based on such content.
              </p>
              <p>
                You are responsible for reviewing and verifying any AI-generated
                content before relying on it for critical decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                7. Term and Termination
              </h2>
              <p>
                These Terms of Service shall remain in full force and effect
                while you use the Site. WITHOUT LIMITING ANY OTHER PROVISION OF
                THESE TERMS OF SERVICE, WE RESERVE THE RIGHT TO, IN OUR SOLE
                DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND
                USE OF THE SITE (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO
                ANY PERSON FOR ANY REASON OR FOR NO REASON...
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                8. Governing Law
              </h2>
              <p>
                These Terms shall be governed by and defined following the laws
                of [Your Jurisdiction, e.g., State of California, USA]. DevNexus
                and yourself irrevocably consent that the courts of [Your
                Jurisdiction] shall have exclusive jurisdiction to resolve any
                dispute which may arise in connection with these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                9. Disclaimer
              </h2>
              <p>
                THE SITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU
                AGREE THAT YOUR USE OF THE SITE AND OUR SERVICES WILL BE AT YOUR
                SOLE RISK... (Include standard disclaimer language)
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                10. Limitation of Liability
              </h2>
              <p>
                IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE
                LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT,
                CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE
                DAMAGES... (Include standard limitation of liability language)
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                11. Contact Us
              </h2>
              <p>
                In order to resolve a complaint regarding the Site or to receive
                further information regarding use of the Site, please contact us
                at:
              </p>
              <p className="mt-2">
                [Your Company Name/Your Name]
                <br />
                [YourContactEmail@example.com]
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

export default TermsOfServicePage;
