import { Separator } from "@/components/ui/separator";

export default function PrivacyPage() {
    return (
        <div className="container py-12 max-w-4xl">
            <div className="space-y-6 mb-12">
                <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
                <p className="text-muted-foreground">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="leading-7">
                    At AviatorTutor, we value your privacy and are committed to protecting your personal information.
                    This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and services.
                </p>
            </div>

            <Separator className="my-8" />

            <div className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">1. Information We Collect</h2>
                    <p className="leading-7 text-muted-foreground">
                        We collect information that helps us provide you with the best possible service. This includes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>
                            <strong>Personal Information:</strong> Name, email address, phone number, and billing information provided during registration and booking.
                        </li>
                        <li>
                            <strong>Profile Information:</strong> For instructors, this includes qualifications, ratings, and biographical information.
                        </li>
                        <li>
                            <strong>Usage Data:</strong> Information on how you interact with our website, such as specific pages visited and time spent on the platform.
                        </li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">2. How We Use Your Information</h2>
                    <p className="leading-7 text-muted-foreground">
                        We use the collected information for the following purposes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>To provide and maintain our Service.</li>
                        <li>To manage your account and bookings.</li>
                        <li>To process payments securely.</li>
                        <li>To communicate with you about updates, offers, and support inquiries.</li>
                        <li>To improve the functionality and user experience of our platform.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">3. Data Sharing and Disclosure</h2>
                    <p className="leading-7 text-muted-foreground">
                        We do not sell your personal data. We may share your information in the following situations:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>
                            <strong>With Instructors/Students:</strong> Necessary information is shared between students and instructors to facilitate bookings and communication.
                        </li>
                        <li>
                            <strong>Service Providers:</strong> We may use third-party companies to facilitate our service (e.g., payment processors like Stripe or Flutterwave).
                        </li>
                        <li>
                            <strong>Legal Requirements:</strong> We may disclose your data if required to do so by law or in response to valid requests by public authorities.
                        </li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">4. Data Security</h2>
                    <p className="leading-7 text-muted-foreground">
                        The security of your data is important to us. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, please remember that no method of transmission over the Internet is 100% secure.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">5. Your Rights</h2>
                    <p className="leading-7 text-muted-foreground">
                        Depending on your location, you may have rights regarding your personal data, including the right to access, correct, or delete the information we hold about you. To exercise these rights, please contact us at support@aviatortutor.com.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">6. Contact Us</h2>
                    <p className="leading-7 text-muted-foreground">
                        If you have any questions about this Privacy Policy, please contact us:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>
                            By email: <a href="mailto:support@aviatortutor.com" className="text-primary hover:underline">support@aviatortutor.com</a>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
