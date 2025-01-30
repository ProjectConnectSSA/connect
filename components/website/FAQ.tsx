"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "How does the link management system work?",
      answer:
        "Our link management system allows you to create custom link pages, track clicks and engagement, and organize your links in a beautiful way. You can customize the appearance and add your branding elements.",
    },
    {
      question: "Can I use my own domain name?",
      answer:
        "Yes! You can use your own custom domain name with our Pro and Enterprise plans. We provide simple DNS settings and full support to help you set it up.",
    },
    {
      question: "What analytics do you provide?",
      answer:
        "We provide comprehensive analytics including page views, click-through rates, geographic data, device information, and custom event tracking. All data is available in real-time.",
    },
    {
      question: "How does pricing work for larger teams?",
      answer:
        "Our Pro plan includes up to 5 team members, and Enterprise plans include unlimited team members. We also offer custom pricing for larger organizations with specific needs.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes! We offer a 14-day free trial on all our plans. No credit card required to start. You can test all features and decide which plan works best for you.",
    },
  ];

  return (
    <section
      id="faq"
      className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">Everything you need to know about our platform</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={false}
      className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left">
        <span className="font-semibold text-gray-900">{question}</span>
        {isOpen ? <Minus className="w-5 h-5 text-gray-500" /> : <Plus className="w-5 h-5 text-gray-500" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <div className="p-4 pt-0 text-gray-600">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FAQ;
