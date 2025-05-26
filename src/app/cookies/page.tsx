// pages/cookies.tsx
import React from "react";
import Head from "next/head";

const CookiePolicyPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Cookie Policy - DevNexus</title>
      </Head>
      <main className="bg-gray-900 text-white min-h-screen py-12 sm:py-16 px-6 sm:px-8">
        <div className="container mx-auto max-w-3xl bg-gray-800 p-8 sm:p-10 md:p-12 rounded-xl shadow-xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-400 mb-8 text-center">
            Cookie Policy
          </h1>

          <div className="space-y-6 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                1. What Are Cookies?
              </h2>
              <p>
                Cookies are small text files that are stored on your computer or
                mobile device when you visit a website. They allow the website
                to recognize your device and remember if you’ve been to the
                website before.
              </p>
              <p>
                Cookies are widely used in order to make websites work, or work
                more efficiently, as well as to provide information to the
                owners of the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                2. How We Use Cookies
              </h2>
              <p>
                We use cookies for a variety of reasons detailed below.
                Unfortunately, in most cases, there are no industry standard
                options for disabling cookies without completely disabling the
                functionality and features they add to this site. It is
                recommended that you leave on all cookies if you are not sure
                whether you need them or not in case they are used to provide a
                service that you use.
              </p>
              <p>We may use cookies to:</p>
              <ul className="list-disc list-inside pl-4 space-y-1 mt-2">
                <li>Remember your login details and preferences.</li>
                <li>
                  Understand how you use our Site to improve user experience.
                </li>
                <li>
                  Track your progress and saved roadmaps (for authenticated
                  users).
                </li>
                <li>
                  Gather analytics data (e.g., via Google Analytics or similar
                  services) to understand site traffic and usage patterns.
                </li>
                <li>Ensure the security of our Site.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                3. Types of Cookies We Use
              </h2>
              <p>
                <strong>Essential Cookies:</strong> These cookies are necessary
                for the website to function and cannot be switched off in our
                systems. They are usually only set in response to actions made
                by you which amount to a request for services, such as setting
                your privacy preferences, logging in or filling in forms.
              </p>
              <p>
                <strong>Performance and Analytics Cookies:</strong> These
                cookies allow us to count visits and traffic sources so we can
                measure and improve the performance of our site. They help us to
                know which pages are the most and least popular and see how
                visitors move around the site.
              </p>
              <p>
                <strong>Functionality Cookies:</strong> These cookies enable the
                website to provide enhanced functionality and personalization.
                They may be set by us or by third party providers whose services
                we have added to our pages.
              </p>
              {/* Add other types if applicable, e.g., Targeting/Advertising Cookies */}
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                4. Disabling Cookies
              </h2>
              <p>
                You can prevent the setting of cookies by adjusting the settings
                on your browser (see your browser Help for how to do this). Be
                aware that disabling cookies will affect the functionality of
                this and many other websites that you visit. Disabling cookies
                will usually result in also disabling certain functionality and
                features of this site. Therefore it is recommended that you do
                not disable cookies.
              </p>
              <p>
                You can usually find these settings in the options or
                preferences menu of your browser. To understand these settings,
                the following links for common browsers may be helpful, or you
                can use the ‘Help’ option in your browser for more details:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-1 mt-2">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Cookie settings in Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Cookie settings in Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Cookie settings in Safari
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Cookie settings in Edge
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                5. More Information
              </h2>
              <p>
                Hopefully, that has clarified things for you. As was previously
                mentioned, if there is something that you are not sure whether
                you need or not, it is usually safer to leave cookies enabled in
                case it does interact with one of the features you use on our
                Site.
              </p>
              <p>
                However, if you are still looking for more information, then you
                can contact us through one of our preferred contact methods:
              </p>
              <p className="mt-2">Email: [YourContactEmail@example.com]</p>
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

export default CookiePolicyPage;
