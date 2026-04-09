'use client';

import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-background rounded-lg shadow-lg p-8">


                {/* Privacy Policy Title */}
                <h1 className="font-playfair-display text-4xl font-bold text-primary mb-4">
                    Privacy Policy
                </h1>


                {/* Last Updated Date */}
                <p className="text-primary mb-8 font-playfair-display">
                    Last updated: {new Date().toLocaleDateString()}
                </p>


                {/* Introduction Section */}
                <section className="mb-8">
                    <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                        1. Introduction
                    </h2>
                    <p className="text-primary leading-relaxed font-playfair-display">
                        Welcome to Box, the university campus voting application. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our campus voting platform.
                    </p>
                </section>


                {/* Information We Collect Section */}
                <section className="mb-8">
                    <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                        2. Information We Collect
                    </h2>
                    <p className="text-primary mb-4 font-playfair-display">
                        We collect the following types of information for campus voting purposes:
                    </p>
                    <ul className="list-disc pl-6 text-primary space-y-2 font-playfair-display">
                        <li>Student identification information (student ID, name, email address)</li>
                        <li>University affiliation (department, year of study, enrollment status)</li>
                        <li>Voting preferences and ballot selections</li>
                        <li>Account activity and login information</li>
                        <li>Technical data (IP address, device information, browser type)</li>
                        <li>Voting history and participation records</li>
                    </ul>
                </section>


                {/* How We Use Your Information Section */}
                <section className="mb-8">
                    <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                        3. How We Use Your Information
                    </h2>
                    <p className="text-primary mb-4 font-playfair-display">
                        We use your information to:
                    </p>
                    <ul className="list-disc pl-6 text-primary space-y-2 font-playfair-display">
                        <li>Verify your eligibility to vote in campus elections</li>
                        <li>Process and record your votes securely</li>
                        <li>Prevent duplicate voting and ensure election integrity</li>
                        <li>Generate anonymous voting statistics and results</li>
                        <li>Send important election updates and notifications</li>
                        <li>Maintain accurate voting records for audit purposes</li>
                        <li>Improve the voting platform and user experience</li>
                    </ul>
                </section>


                {/* Voting Privacy Section */}
                <section className="mb-8">
                    <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                        4. Voting Privacy and Anonymity
                    </h2>
                    <p className="text-primary leading-relaxed font-playfair-display">
                        Your individual voting choices are kept confidential and anonymous. While we record that you have voted to prevent duplicate voting, your specific ballot selections are not linked to your personal identity in our systems. Only aggregated, anonymous voting results are shared publicly.
                    </p>
                </section>


                {/* Data Security Section */}
                <section className="mb-8">
                    <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                        5. Data Security
                    </h2>
                    <p className="text-primary leading-relaxed font-playfair-display">
                        We implement industry-standard security measures to protect your personal information and voting data. This includes encryption, secure authentication, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                    </p>
                </section>


                {/* Your Rights Section */}
                <section className="mb-8">
                    <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                        6. Your Rights
                    </h2>
                    <p className="text-primary mb-4 font-playfair-display">
                        You have the right to:
                    </p>
                    <ul className="list-disc pl-6 text-primary space-y-2 font-playfair-display">
                        <li>Access your personal data and voting participation records</li>
                        <li>Correct inaccurate personal information</li>
                        <li>Request deletion of your account data (subject to legal retention requirements)</li>
                        <li>Object to processing of your data for non-voting purposes</li>
                        <li>Export your personal data</li>
                        <li>Withdraw consent for non-essential data processing</li>
                        <li>Verify that your vote was recorded without revealing your choices</li>
                    </ul>
                </section>


                {/* Data Retention Section */}
                <section className="mb-8">
                    <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                        7. Data Retention
                    </h2>
                    <p className="text-primary leading-relaxed font-playfair-display">
                        We retain your personal information and voting records for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, and maintain election integrity. Voting records may be retained for audit purposes as required by university policy or applicable laws.
                    </p>
                </section>


                {/* Third-Party Services Section */}
                <section className="mb-8">
                    <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                        8. Third-Party Services
                    </h2>
                    <p className="text-primary leading-relaxed font-playfair-display">
                        Our voting platform may integrate with university authentication systems and other campus services. We are not responsible for the privacy practices of these third-party services. We encourage you to review their respective privacy policies.
                    </p>
                </section>


                {/* Election Integrity Section */}
                <section className="mb-8">
                    <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                        9. Election Integrity and Compliance
                    </h2>
                    <p className="text-primary leading-relaxed font-playfair-display">
                        We are committed to maintaining the integrity of campus elections. This may require us to share certain information with university officials, election committees, or legal authorities when required by law or university policy. Such disclosures will be made in accordance with applicable privacy laws.
                    </p>
                </section>


                {/* Changes to This Policy Section */}
                <section className="mb-8">
                    <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                        10. Changes to This Policy
                    </h2>
                    <p className="text-primary leading-relaxed font-playfair-display">
                        We may update this privacy policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. Continued use of the platform after changes constitutes acceptance of the updated policy.
                    </p>
                </section>


                {/* Contact Us Section */}
                <section className="mb-8">
                    <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                        11. Contact Us
                    </h2>
                    <p className="text-primary mb-4 font-playfair-display">
                        If you have any questions about this privacy policy, our data practices, or concerns about voting privacy, please contact us at:
                    </p>
                    <p className="text-primary font-playfair-display">
                        Email: privacy@box-voting.com
                    </p>
                    <p className="text-primary font-playfair-display">
                        University IT Support: support@university.edu
                    </p>
                </section>
            </div>
        </div>
    );
};

