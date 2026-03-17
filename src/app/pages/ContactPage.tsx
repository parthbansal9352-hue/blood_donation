import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { Mail, Phone, MapPin, Send, MessageSquare, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { motion } from 'motion/react';

export default function ContactPage() {
    const { isDarkMode } = useApp();
    const [result, setResult] = useState("");

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setResult("Sending...");

        const formData = new FormData(event.currentTarget);
        formData.append("access_key", "cfe8db01-5b57-4006-95e5-21c63f85b72a");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setResult("Success!");
                (event.target as HTMLFormElement).reset();
            } else {
                console.log("Error", data);
                setResult("Error");
            }
        } catch (error) {
            console.error("Submission error", error);
            setResult("Error");
        }
    };

    return (
        <Layout>
            <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Get in Touch
                        </h1>
                        <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Have questions about blood donation or need technical support?
                            Our team is here to help you save lives.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                                        <Phone className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Call Us</h3>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>+91-141-2345678</p>
                                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Mon-Sat, 9am - 6pm</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                                        <Mail className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Email Support</h3>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>support@bloodbankjaipur.in</p>
                                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>24/7 Response time</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                                        <MapPin className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Our Office</h3>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Health Plaza, JLN Marg,<br />
                                            Jaipur, Rajasthan 302004
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                                <CardHeader>
                                    <CardTitle className={isDarkMode ? 'text-white' : ''}>Send us a Message</CardTitle>
                                    <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
                                        We'll get back to you as soon as possible.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={onSubmit} className="space-y-6">
                                        <input type="hidden" name="from_name" value="BloodDonation.in Contact Form" />
                                        <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className={isDarkMode ? 'text-gray-300' : ''}>
                                                    Your Name
                                                </Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        placeholder="John Doe"
                                                        className={`pl-10 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className={isDarkMode ? 'text-gray-300' : ''}>
                                                    Email Address
                                                </Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        placeholder="john@example.com"
                                                        className={`pl-10 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject" className={isDarkMode ? 'text-gray-300' : ''}>
                                                Subject
                                            </Label>
                                            <Input
                                                id="subject"
                                                name="subject"
                                                placeholder="How can we help?"
                                                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message" className={isDarkMode ? 'text-gray-300' : ''}>
                                                Message
                                            </Label>
                                            <div className="relative">
                                                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                <Textarea
                                                    id="message"
                                                    name="message"
                                                    placeholder="Write your message here..."
                                                    className={`pl-10 min-h-[150px] ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <Button
                                                type="submit"
                                                className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg"
                                                disabled={result === "Sending..."}
                                            >
                                                {result === "Sending..." ? "Sending Message..." : (
                                                    <>
                                                        <Send className="w-5 h-5 mr-2" />
                                                        Send Message
                                                    </>
                                                )}
                                            </Button>

                                            {result && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className={`p-4 rounded-lg text-center font-semibold ${result === "Success!"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                        : result === "Error"
                                                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                                        }`}
                                                >
                                                    {result === "Success!" ? "Message sent successfully!" : result === "Error" ? "Something went wrong. Please try again." : result}
                                                </motion.div>
                                            )}
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
