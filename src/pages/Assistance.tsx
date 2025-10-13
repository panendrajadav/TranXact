import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import { HelpCircle, MessageCircle, FileText, Phone } from "lucide-react";
import { Chat } from "@/components/ui/chat";

const Assistance = () => {
  const helpTopics = [
    {
      icon: MessageCircle,
      title: "Getting Started",
      description: "Learn how to create your account and make your first donation"
    },
    {
      icon: FileText,
      title: "Transaction Help",
      description: "Understanding blockchain transactions and tracking donations"
    },
    {
      icon: HelpCircle,
      title: "Account Management",
      description: "Managing your profile, security settings, and preferences"
    },
    {
      icon: Phone,
      title: "Technical Support",
      description: "Troubleshooting technical issues and platform problems"
    }
  ];

  const faqs = [
    {
      question: "How do I track my donations?",
      answer: "You can track all your donations in your dashboard. Each donation is recorded on the blockchain for complete transparency."
    },
    {
      question: "Is my donation secure?",
      answer: "Yes, all donations are secured using blockchain technology, ensuring transparency and security of your funds."
    },
    {
      question: "How long does it take for donations to be processed?",
      answer: "Donations are typically processed within minutes, depending on network congestion."
    },
    {
      question: "Can I cancel a donation after it's sent?",
      answer: "Once a donation is confirmed on the blockchain, it cannot be reversed. Please review your donation details carefully before confirming."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">How Can We Help?</h1>
            <p className="text-muted-foreground text-lg">
              Get support and find answers to your questions about TranXact
            </p>
          </div>

          {/* Help Topics */}
          <section>
            <h2 className="text-3xl font-semibold mb-8 text-center">Browse Help Topics</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {helpTopics.map((topic, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <topic.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground">{topic.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQs */}
          <section>
            <h2 className="text-3xl font-semibold mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Live Chat */}
          <section>
            <h2 className="text-3xl font-semibold mb-8">Chat with Support</h2>
            <Chat />
          </section>

          {/* Contact Information */}
          <section className="text-center">
            <h3 className="text-xl font-semibold mb-4">Other Ways to Reach Us</h3>
            <div className="flex justify-center gap-8 text-muted-foreground">
              <div>
                <strong>Email:</strong> panendrajadav@gmail.com
              </div>
              <div>
                <strong>Phone:</strong> +(91) 7780590938
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Assistance;