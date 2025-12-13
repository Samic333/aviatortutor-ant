import Link from "next/link";
import { Mail, MessageCircle, FileQuestion } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PublicSupportPage() {
    return (
        <div className="container py-12 max-w-5xl">
            <div className="space-y-6 text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight">Help & Support</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Have questions? We're here to help you get the most out of AviatorTutor.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Email Support</CardTitle>
                        <CardDescription>Get in touch with our team</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <Link href="mailto:support@aviatortutor.com">
                            <Button variant="outline" className="w-full">
                                support@aviatortutor.com
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                            <MessageCircle className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Live Chat</CardTitle>
                        <CardDescription>Chat with us directly</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <Button variant="outline" className="w-full" disabled>
                            Coming Soon
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                            <FileQuestion className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>FAQ</CardTitle>
                        <CardDescription>Frequently asked questions</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <Link href="#faq">
                            <Button variant="outline" className="w-full">
                                View FAQ
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <div id="faq" className="space-y-8 max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                </div>

                <div className="grid gap-6">
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">How do I book an instructor?</h3>
                        <p className="text-muted-foreground">
                            Browse out list of qualified instructors, view their profiles, and select a time slot that works for you. You can filter by aircraft type, rating, and price.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">How do payments work?</h3>
                        <p className="text-muted-foreground">
                            Payments are processed securely through our platform. You will be charged when you book a lesson. We hold the funds until the lesson is marked as complete.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">What is the cancellation policy?</h3>
                        <p className="text-muted-foreground">
                            You can cancel a lesson up to 24 hours before the scheduled time for a full refund. Cancellations made within 24 hours may be subject to a fee determined by the instructor.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">I'm an instructor. How do I get paid?</h3>
                        <p className="text-muted-foreground">
                            Earnings are transferred to your connected bank account weekly. You can view your earnings and payout history in your instructor dashboard.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
