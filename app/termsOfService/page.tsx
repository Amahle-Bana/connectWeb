'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsOfService() {
    return (
        // Terms Of Service Container
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-background rounded-lg shadow-lg p-8">

                {/* Terms Of Service Title */}
                <h1 className="font-playfair-display text-4xl font-bold text-primary mb-4">
                    Terms Of Service
                </h1>


                {/* Last Updated Date */}
                <p className="text-primary mb-8 font-playfair-display">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <div className="space-y-8">


                    {/* Acceptance of Terms Section */}
                    <section className="mb-8">
                        <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-primary leading-relaxed font-playfair-display">
                            By accessing and using the Box university campus voting platform, you agree to be bound by these Terms of Service and all applicable university policies, laws, and regulations. If you do not agree with any of these terms, you are prohibited from using this voting platform.
                        </p>
                    </section>


                    {/* Eligibility and User Accounts Section */}
                    <section className="mb-8">
                        <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                            2. Eligibility and User Accounts
                        </h2>
                        <p className="text-primary mb-4 font-playfair-display">
                            To use the voting platform, you must:
                        </p>
                        <ul className="list-disc pl-6 text-primary space-y-2 font-playfair-display">
                            <li>Be a currently enrolled student at the university</li>
                            <li>Have a valid student ID and university email address</li>
                            <li>Be eligible to vote according to university election policies</li>
                            <li>Register for an account using your university credentials</li>
                        </ul>
                        <p className="text-primary leading-relaxed font-playfair-display mt-4">
                            You are responsible for maintaining the confidentiality of your account information and for all voting activities that occur under your account.
                        </p>
                    </section>


                    {/* Voting Rules and Guidelines Section */}
                    <section className="mb-8">
                        <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                            3. Voting Rules and Guidelines
                        </h2>
                        <p className="text-primary mb-4 font-playfair-display">
                            When using the voting platform, you must:
                        </p>
                        <ul className="list-disc pl-6 text-primary space-y-2 font-playfair-display">
                            <li>Vote only once per election or ballot measure</li>
                            <li>Use only your own account to cast votes</li>
                            <li>Not attempt to influence other voters through the platform</li>
                            <li>Respect the voting process and election integrity</li>
                            <li>Not share your voting credentials with others</li>
                            <li>Report any suspicious activity or technical issues</li>
                        </ul>
                    </section>


                    {/* Election Integrity Section */}
                    <section className="mb-8">
                        <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                            4. Election Integrity
                        </h2>
                        <p className="text-primary leading-relaxed font-playfair-display">
                            We are committed to maintaining the integrity of campus elections. Any attempt to manipulate voting results, create fake accounts, or interfere with the voting process is strictly prohibited and may result in disciplinary action by the university.
                        </p>
                    </section>


                    {/* Privacy and Data Protection Section */}
                    <section className="mb-8">
                        <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                            5. Privacy and Data Protection
                        </h2>
                        <p className="text-primary leading-relaxed font-playfair-display">
                            We collect and process personal data in accordance with our Privacy Policy. By using the voting platform, you consent to such processing and warrant that all data provided is accurate. Your individual voting choices are kept confidential and anonymous.
                        </p>
                    </section>


                    {/* Prohibited Activities Section */}
                    <section className="mb-8">
                        <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                            6. Prohibited Activities
                        </h2>
                        <p className="text-primary mb-4 font-playfair-display">
                            Users must not:
                        </p>
                        <ul className="list-disc pl-6 text-primary space-y-2 font-playfair-display">
                            <li>Attempt to vote multiple times in the same election</li>
                            <li>Share or sell their voting credentials</li>
                            <li>Use automated systems or bots to access the platform</li>
                            <li>Attempt to gain unauthorized access to voting systems</li>
                            <li>Interfere with the voting process or platform operations</li>
                            <li>Harass or intimidate other voters</li>
                            <li>Attempt to manipulate or influence election results</li>
                        </ul>
                    </section>


                    {/* Account Suspension and Termination Section */}
                    <section className="mb-8">
                        <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                            7. Account Suspension and Termination
                        </h2>
                        <p className="text-primary leading-relaxed font-playfair-display">
                            We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent voting activities, or fail to comply with university election policies. Such actions may also result in disciplinary proceedings by the university.
                        </p>
                    </section>


                    {/* Platform Availability Section */}
                    <section className="mb-8">
                        <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                            8. Platform Availability
                        </h2>
                        <p className="text-primary leading-relaxed font-playfair-display">
                            We strive to maintain platform availability during election periods but do not guarantee uninterrupted service. We reserve the right to modify, suspend, or discontinue any aspect of the voting platform at any time, with appropriate notice when possible.
                        </p>
                    </section>


                    {/* Limitation of Liability Section */}
                    <section className="mb-8">
                        <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                            9. Limitation of Liability
                        </h2>
                        <p className="text-primary leading-relaxed font-playfair-display">
                            We are not liable for any damages arising from the use or inability to use the voting platform, including but not limited to direct, indirect, incidental, or consequential damages. However, we are committed to maintaining accurate and secure voting records.
                        </p>
                    </section>


                    {/* Election Results and Appeals Section */}
                    <section className="mb-8">
                        <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                            10. Election Results and Appeals
                        </h2>
                        <p className="text-primary leading-relaxed font-playfair-display">
                            Election results are determined by the university&apos;s election committee and are final unless appealed through the proper university channels. The voting platform provides technical support for the voting process but does not determine election outcomes.
                        </p>
                    </section>


                    {/* Changes to Terms Section */}
                    <section className="mb-8">
                        <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                            11. Changes to Terms
                        </h2>
                        <p className="text-primary leading-relaxed font-playfair-display">
                            We may modify these terms at any time to reflect changes in university policies or applicable laws. Continued use of the voting platform after changes constitutes acceptance of the modified terms.
                        </p>
                    </section>


                    {/* Governing Law Section */}
                    <section className="mb-8">
                        <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                            12. Governing Law
                        </h2>
                        <p className="text-primary leading-relaxed font-playfair-display">
                            These terms are governed by applicable laws and university policies. Any disputes shall be resolved in accordance with university disciplinary procedures and applicable legal jurisdiction.
                        </p>
                    </section>


                    {/* Contact Information Section */}
                    <section className="mb-8">
                        <h2 className="font-playfair-display text-2xl font-semibold text-primary mb-4">
                            13. Contact Information
                        </h2>
                        <p className="text-primary leading-relaxed font-playfair-display">
                            For questions about these terms or voting-related issues, please contact:
                        </p>
                        <p className="text-primary font-playfair-display mt-2">
                            Email: support@box-voting.com
                        </p>
                        <p className="text-primary font-playfair-display">
                            University IT Support: support@university.edu
                        </p>
                        <p className="text-primary font-playfair-display">
                            Election Committee: elections@university.edu
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}

