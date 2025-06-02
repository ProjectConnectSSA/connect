import {
  Layout,
  Calendar,
  ShoppingCart,
  Rocket,
  Newspaper,
  Gift,
  Mail,
  Briefcase,
  GraduationCap,
  Heart,
} from "lucide-react";

export const landingTemplates = [
  {
    id: "product-launch",
    title: "Product Launch",
    description: "Perfect for launching your new product",
    icon: Rocket,
    iconColor: "text-purple-600",
    template: {
      title: "Product Launch",
      description: "Launch your amazing product",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Introducing Our New Product",
            subheading: "The revolutionary solution you've been waiting for",
            image:
              "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
            cta: {
              text: "Get Early Access",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "Amazing Features",
            items: [
              {
                title: "Feature 1",
                description: "Description of feature 1",
                icon: "Zap",
              },
              {
                title: "Feature 2",
                description: "Description of feature 2",
                icon: "Shield",
              },
              {
                title: "Feature 3",
                description: "Description of feature 3",
                icon: "Star",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "How It Works",
            body: "Our product is designed to simplify your workflow and boost productivity. With a user-friendly interface and powerful capabilities, you'll wonder how you ever managed without it.\n\nDesigned with users in mind, every feature has been meticulously crafted to ensure maximum efficiency and ease of use.",
            image:
              "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800",
            alignment: "left",
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Pricing Plans",
            body: "Choose the plan that fits your needs. All plans come with a 14-day free trial, no credit card required.\n\n- Basic: $9/month\n- Pro: $19/month\n- Enterprise: $49/month",
            image:
              "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
            alignment: "right",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Contact Us",
            companyName: "Your Company",
            tagline: "Making your life easier through technology",
            links: [
              { label: "Home", url: "#" },
              { label: "Features", url: "#" },
              { label: "Pricing", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "Twitter", url: "#", icon: "Twitter" },
              { platform: "Facebook", url: "#", icon: "Facebook" },
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "LinkedIn", url: "#", icon: "Linkedin" },
            ],
            copyright: `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "modern",
        fontFamily: "Inter",
        colors: {
          primary: "#7c3aed",
          background: "#ffffff",
          text: "#1f2937",
        },
      },
    },
  },
  {
    id: "event",
    title: "Event Landing",
    description: "Promote your upcoming event",
    icon: Calendar,
    iconColor: "text-blue-600",
    template: {
      title: "Event Landing",
      description: "Join our amazing event",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Join Our Event",
            subheading: "A gathering of industry experts and innovators",
            image:
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200",
            cta: {
              text: "Register Now",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "About the Event",
            body: "Join us for an incredible day of learning and networking with industry professionals from around the world. Our event features keynote speeches, interactive workshops, and valuable networking opportunities.",
            image:
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
            alignment: "right",
          },
        },
        {
          id: "3",
          type: "features",
          content: {
            heading: "What to Expect",
            items: [
              {
                title: "Keynote Speakers",
                description: "Hear from industry leaders and visionaries",
                icon: "Zap",
              },
              {
                title: "Workshops",
                description: "Hands-on interactive sessions with experts",
                icon: "Shield",
              },
              {
                title: "Networking",
                description: "Connect with peers and potential partners",
                icon: "Users",
              },
            ],
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Event Schedule",
            body: "9:00 AM - Registration & Coffee\n10:00 AM - Opening Keynote\n11:30 AM - Workshop Session 1\n1:00 PM - Lunch Break\n2:00 PM - Workshop Session 2\n4:00 PM - Panel Discussion\n5:30 PM - Networking Reception",
            image:
              "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800",
            alignment: "left",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Event Details",
            companyName: "Your Company Events",
            tagline: "Creating memorable experiences",
            links: [
              { label: "Home", url: "#" },
              { label: "Schedule", url: "#" },
              { label: "Speakers", url: "#" },
              { label: "Venue", url: "#" },
            ],
            socialLinks: [
              { platform: "Twitter", url: "#", icon: "Twitter" },
              { platform: "Instagram", url: "#", icon: "Instagram" },
            ],
            copyright: `© ${new Date().getFullYear()} Your Company Events. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "elegant",
        fontFamily: "Montserrat",
        colors: {
          primary: "#2563eb",
          background: "#ffffff",
          text: "#1f2937",
        },
      },
    },
  },
  {
    id: "sales",
    title: "Sales Page",
    description: "Convert visitors into customers",
    icon: ShoppingCart,
    iconColor: "text-green-600",
    template: {
      title: "Sales Page",
      description: "Get our amazing offer",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Special Offer",
            subheading: "Limited time discount on our premium package",
            image:
              "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200",
            cta: {
              text: "Buy Now",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "What You Get",
            items: [
              {
                title: "Premium Feature",
                description: "Access to all premium features",
                icon: "Star",
              },
              {
                title: "24/7 Support",
                description: "Round the clock customer support",
                icon: "Shield",
              },
              {
                title: "Regular Updates",
                description: "New content and features every month",
                icon: "RefreshCw",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "Limited Time Offer",
            body: "This special price is only available for a limited time. Act now to secure your discount before it expires!\n\n- 50% off our regular price\n- Free bonus package included\n- 30-day money-back guarantee",
            image:
              "https://images.unsplash.com/photo-1586892478025-2b5472316bf4?w=800",
            alignment: "right",
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Customer Testimonials",
            body: '"This product has completely transformed my business. I\'ve seen a 200% increase in productivity since implementing it." - Jane D.\n\n"I wish I had found this sooner. The support team is amazing and the product exceeds expectations." - John S.',
            image:
              "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800",
            alignment: "left",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Questions?",
            companyName: "Your Company",
            tagline: "Premium solutions for discerning customers",
            links: [
              { label: "Home", url: "#" },
              { label: "FAQs", url: "#" },
              { label: "Refund Policy", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "Facebook", url: "#", icon: "Facebook" },
              { platform: "Instagram", url: "#", icon: "Instagram" },
            ],
            copyright: `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "bold",
        fontFamily: "Poppins",
        colors: {
          primary: "#ef4444",
          background: "#ffffff",
          text: "#1f2937",
        },
      },
    },
  },
  {
    id: "blog",
    title: "Blog/News",
    description: "Share your latest articles and news",
    icon: Newspaper,
    iconColor: "text-cyan-600",
    template: {
      title: "Blog Landing Page",
      description: "Stay updated with our latest articles",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Our Blog",
            subheading: "Insights, news, and expertise from our team",
            image:
              "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200",
            cta: {
              text: "Subscribe",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "Featured Articles",
            items: [
              {
                title: "Ultimate Guide to SEO",
                description:
                  "Learn the best practices for search engine optimization",
                icon: "Search",
              },
              {
                title: "Social Media Strategy",
                description: "Build an effective social media presence",
                icon: "Share2",
              },
              {
                title: "Content Marketing Tips",
                description: "Create engaging content that converts",
                icon: "FileText",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "About Our Blog",
            body: "Our blog is dedicated to providing valuable insights and information on the latest industry trends. Whether you're a beginner or an expert, you'll find content tailored to your needs.\n\nSubscribe to our newsletter to get weekly updates delivered straight to your inbox.",
            image:
              "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?w=800",
            alignment: "left",
          },
        },
        {
          id: "4",
          type: "footer",
          content: {
            heading: "Subscribe",
            companyName: "Your Blog",
            tagline: "Insights for the curious mind",
            links: [
              { label: "Home", url: "#" },
              { label: "Categories", url: "#" },
              { label: "About", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "Twitter", url: "#", icon: "Twitter" },
              { platform: "Facebook", url: "#", icon: "Facebook" },
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "Pinterest", url: "#", icon: "Pinterest" },
            ],
            copyright: `© ${new Date().getFullYear()} Your Blog. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "minimal",
        fontFamily: "Merriweather",
        colors: {
          primary: "#0ea5e9",
          background: "#ffffff",
          text: "#334155",
        },
      },
    },
  },
  {
    id: "newsletter",
    title: "Newsletter Signup",
    description: "Grow your email subscriber list",
    icon: Mail,
    iconColor: "text-pink-600",
    template: {
      title: "Newsletter Signup",
      description: "Join our newsletter for exclusive content",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Join Our Newsletter",
            subheading:
              "Get weekly updates, tips, and exclusive content directly in your inbox",
            image:
              "https://images.unsplash.com/photo-1579275542618-a1dfed5f54ba?w=1200",
            cta: {
              text: "Subscribe Now",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "Why Subscribe?",
            items: [
              {
                title: "Exclusive Content",
                description:
                  "Get access to articles and resources not published anywhere else",
                icon: "Lock",
              },
              {
                title: "Early Access",
                description:
                  "Be the first to know about new products and features",
                icon: "Clock",
              },
              {
                title: "Community",
                description: "Join a community of like-minded individuals",
                icon: "Users",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "What Our Subscribers Say",
            body: '"The newsletter has been incredibly valuable. Each issue provides actionable insights I can implement right away." - Maria K.\n\n"I look forward to receiving this newsletter every week. The content is always relevant and well-written." - David T.',
            image:
              "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800",
            alignment: "right",
          },
        },
        {
          id: "4",
          type: "footer",
          content: {
            heading: "Stay Connected",
            companyName: "Your Newsletter",
            tagline: "Valuable insights delivered to your inbox",
            links: [
              { label: "Home", url: "#" },
              { label: "Archive", url: "#" },
              { label: "Privacy Policy", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "Twitter", url: "#", icon: "Twitter" },
              { platform: "LinkedIn", url: "#", icon: "Linkedin" },
            ],
            copyright: `© ${new Date().getFullYear()} Your Newsletter. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "clean",
        fontFamily: "Open Sans",
        colors: {
          primary: "#8b5cf6",
          background: "#f9fafb",
          text: "#374151",
        },
      },
    },
  },
  {
    id: "portfolio",
    title: "Portfolio",
    description: "Showcase your work and projects",
    icon: Briefcase,
    iconColor: "text-orange-600",
    template: {
      title: "Portfolio",
      description: "View my work and projects",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Hi, I'm [Your Name]",
            subheading:
              "Designer & Developer creating memorable digital experiences",
            image:
              "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200",
            cta: {
              text: "View My Work",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "About Me",
            body: "I'm a passionate designer and developer with over 5 years of experience creating digital products for clients worldwide. My approach combines creative design with technical expertise to build solutions that not only look great but also perform exceptionally well.\n\nI specialize in UI/UX design, web development, and brand identity.",
            image:
              "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800",
            alignment: "left",
          },
        },
        {
          id: "3",
          type: "features",
          content: {
            heading: "Featured Projects",
            items: [
              {
                title: "E-commerce Redesign",
                description:
                  "Complete redesign of an online store resulting in 45% increased conversions",
                icon: "ShoppingBag",
              },
              {
                title: "Mobile App UI",
                description:
                  "User interface design for a fitness tracking app with 100k+ downloads",
                icon: "Smartphone",
              },
              {
                title: "Brand Identity",
                description: "Comprehensive brand system for a tech startup",
                icon: "Palette",
              },
            ],
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Let's Work Together",
            body: "I'm always interested in exciting projects and collaborations. If you have a project in mind or just want to chat about possibilities, feel free to reach out.\n\nCurrently available for freelance work and consulting.",
            image:
              "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
            alignment: "right",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Get In Touch",
            companyName: "Your Name",
            tagline: "Designer & Developer",
            links: [
              { label: "Home", url: "#" },
              { label: "Projects", url: "#" },
              { label: "About", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "Dribbble", url: "#", icon: "Dribbble" },
              { platform: "GitHub", url: "#", icon: "Github" },
              { platform: "LinkedIn", url: "#", icon: "Linkedin" },
              { platform: "Instagram", url: "#", icon: "Instagram" },
            ],
            copyright: `© ${new Date().getFullYear()} Your Name. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "minimal",
        fontFamily: "Raleway",
        colors: {
          primary: "#0f172a",
          background: "#ffffff",
          text: "#334155",
        },
      },
    },
  },
  {
    id: "course",
    title: "Course/ Educational",
    description: "Promote your online course or workshop",
    icon: GraduationCap,
    iconColor: "text-amber-600",
    template: {
      title: "Online Course",
      description: "Master new skills with our comprehensive course",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Master [Subject]",
            subheading:
              "A comprehensive course to help you develop expert-level skills",
            image:
              "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200",
            cta: {
              text: "Enroll Now",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "What You'll Learn",
            items: [
              {
                title: "Fundamentals",
                description: "Master the core concepts and principles",
                icon: "BookOpen",
              },
              {
                title: "Practical Skills",
                description: "Apply your knowledge with hands-on projects",
                icon: "Tool",
              },
              {
                title: "Advanced Techniques",
                description: "Learn expert strategies and methodologies",
                icon: "Zap",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "Course Curriculum",
            body: "Module 1: Introduction and Fundamentals\nModule 2: Building Core Skills\nModule 3: Advanced Concepts\nModule 4: Real-world Projects\nModule 5: Mastery and Certification\n\nEach module includes video lessons, downloadable resources, practical exercises, and quizzes to reinforce your learning.",
            image:
              "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800",
            alignment: "right",
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Your Instructor",
            body: 'Learn from [Instructor Name], an industry expert with over 10 years of experience. [Instructor] has helped thousands of students achieve their goals and has worked with leading companies in the field.\n\n"My teaching philosophy is centered around practical, applicable knowledge that you can use immediately."',
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800",
            alignment: "left",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Ready to Begin?",
            companyName: "Your Academy",
            tagline: "Expert-led courses for real-world skills",
            links: [
              { label: "Home", url: "#" },
              { label: "Courses", url: "#" },
              { label: "FAQ", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "YouTube", url: "#", icon: "Youtube" },
              { platform: "Twitter", url: "#", icon: "Twitter" },
              { platform: "Instagram", url: "#", icon: "Instagram" },
            ],
            copyright: `© ${new Date().getFullYear()} Your Academy. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "academic",
        fontFamily: "Nunito",
        colors: {
          primary: "#0369a1",
          background: "#ffffff",
          text: "#1f2937",
        },
      },
    },
  },
  {
    id: "nonprofit",
    title: "Nonprofit/ Charity",
    description: "Raise awareness and support for your cause",
    icon: Gift,
    iconColor: "text-green-700",
    template: {
      title: "Nonprofit Organization",
      description: "Join our mission to make a difference",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Making a Difference",
            subheading:
              "Join our mission to create positive change in communities worldwide",
            image:
              "https://images.unsplash.com/photo-1488521787991-ed7bbafc90bd?w=1200",
            cta: {
              text: "Donate Now",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "Our Mission",
            body: "We are dedicated to [your mission statement]. Through community engagement, education, and direct action, we work tirelessly to address the most pressing challenges facing our world today.\n\nSince our founding in [year], we've helped thousands of people and made a measurable impact in communities across [region/world].",
            image:
              "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
            alignment: "right",
          },
        },
        {
          id: "3",
          type: "features",
          content: {
            heading: "Our Impact",
            items: [
              {
                title: "12,000+",
                description: "People directly helped through our programs",
                icon: "Users",
              },
              {
                title: "24",
                description: "Communities where we maintain ongoing projects",
                icon: "Map",
              },
              {
                title: "$1.2M",
                description: "Raised last year to support our initiatives",
                icon: "DollarSign",
              },
            ],
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "How You Can Help",
            body: "Your support makes our work possible. Here are some ways you can get involved:\n\n- Make a one-time or recurring donation\n- Volunteer your time and skills\n- Attend our fundraising events\n- Spread awareness on social media\n\nEvery contribution, no matter the size, helps us continue our important work.",
            image:
              "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800",
            alignment: "left",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Get Involved",
            companyName: "Your Nonprofit",
            tagline: "Creating positive change together",
            links: [
              { label: "Home", url: "#" },
              { label: "Our Work", url: "#" },
              { label: "Donate", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "Facebook", url: "#", icon: "Facebook" },
              { platform: "Twitter", url: "#", icon: "Twitter" },
              { platform: "Instagram", url: "#", icon: "Instagram" },
            ],
            copyright: `© ${new Date().getFullYear()} Your Nonprofit. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "warm",
        fontFamily: "Source Sans Pro",
        colors: {
          primary: "#16a34a",
          background: "#fffbeb",
          text: "#1f2937",
        },
      },
    },
  },
  {
    id: "personal-brand",
    title: "Personal Brand",
    description: "Build your personal brand presence",
    icon: Heart,
    iconColor: "text-indigo-600",
    template: {
      title: "Personal Brand",
      description: "Connect with my work and experiences",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Hi, I'm [Your Name]",
            subheading:
              "Author, Speaker, and Consultant specializing in [your field]",
            image:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200",
            cta: {
              text: "Connect With Me",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "My Story",
            body: "With over 15 years of experience in [your industry], I've helped hundreds of clients achieve breakthrough results. My approach combines [your unique methodologies] with practical strategies that deliver measurable outcomes.\n\nI believe that [your core philosophy or belief], and this guides everything I do in my work.",
            image:
              "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800",
            alignment: "left",
          },
        },
        {
          id: "3",
          type: "features",
          content: {
            heading: "What I Offer",
            items: [
              {
                title: "Speaking",
                description:
                  "Engaging talks on leadership, innovation, and personal development",
                icon: "Mic",
              },
              {
                title: "Consulting",
                description:
                  "Strategic guidance for businesses and individuals",
                icon: "Briefcase",
              },
              {
                title: "Workshops",
                description:
                  "Interactive sessions designed for transformation and growth",
                icon: "Users",
              },
            ],
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Latest Work",
            body: 'My new book, "[Book Title]," explores [book subject] and provides practical strategies for [book benefit]. It\'s been featured in [publications] and has helped thousands of readers transform their approach to [subject area].\n\nCheck out my podcast where I interview industry experts and share insights on [podcast topic].',
            image:
              "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800",
            alignment: "right",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Let's Connect",
            companyName: "[Your Name]",
            tagline: "[Your Professional Tagline]",
            links: [
              { label: "Home", url: "#" },
              { label: "About", url: "#" },
              { label: "Services", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "LinkedIn", url: "#", icon: "Linkedin" },
              { platform: "Twitter", url: "#", icon: "Twitter" },
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "YouTube", url: "#", icon: "Youtube" },
            ],
            copyright: `© ${new Date().getFullYear()} [Your Name]. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "professional",
        fontFamily: "Playfair Display",
        colors: {
          primary: "#6d28d9",
          background: "#ffffff",
          text: "#1f2937",
        },
      },
    },
  },
];
