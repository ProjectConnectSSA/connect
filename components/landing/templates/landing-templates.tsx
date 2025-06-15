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
  Coffee,
  Home,
  Smartphone,
  Video,
  Mic2,
  Activity,
  Cloud,
  Book,
  Laptop,
  Camera,
  Clock,
  HardHat,
  DollarSign,
  Gamepad2,
  Wind,
  Leaf,
  Film,
  Trophy,
  BookOpen,
  // Add these new imports for the new template icons
  Globe,
  Store,
  Music,
  Gavel,
  Stethoscope,
  Headphones,
  Users,
  MapPin,
  Utensils,
  Palette,
} from "lucide-react";

// Example of improved data structure
export const landingTemplates = [
  {
    id: "product-launch",
    title: "Product Launch",
    category: "Product", // Explicit category field
    description: "Perfect for launching your new product",
    icon: Rocket,
    iconColor: "text-purple-600",
    image:
      "https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=800&auto=format&fit=crop",
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
    category: "Event", // Explicit category field
    description: "Promote your upcoming event",
    icon: Calendar,
    iconColor: "text-blue-600",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop",
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
    category: "Sales", // Explicit category field
    description: "Convert visitors into customers",
    icon: ShoppingCart,
    iconColor: "text-green-600",
    image:
      "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&auto=format&fit=crop",
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
    category: "Blog", // Explicit category field
    description: "Share your latest articles and news",
    icon: Newspaper,
    iconColor: "text-cyan-600",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop",
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
    category: "Marketing", // Explicit category field
    description: "Grow your email subscriber list",
    icon: Mail,
    iconColor: "text-pink-600",
    image:
      "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&auto=format&fit=crop",
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
    category: "Portfolio", // Explicit category field
    description: "Showcase your work and projects",
    icon: Briefcase,
    iconColor: "text-orange-600",
    image:
      "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800&auto=format&fit=crop",
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
    title: "Course/Educational",
    category: "Education", // Explicit category field
    description: "Promote your online course or workshop",
    icon: GraduationCap,
    iconColor: "text-amber-600",
    image:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&auto=format&fit=crop",
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
    title: "Nonprofit/Charity",
    category: "Nonprofit", // Explicit category field
    description: "Raise awareness and support for your cause",
    icon: Gift,
    iconColor: "text-green-700",
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&auto=format&fit=crop",
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
    category: "Personal", // Explicit category field
    description: "Build your personal brand presence",
    icon: Heart,
    iconColor: "text-indigo-600",
    image:
      "https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?w=800&auto=format&fit=crop",
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
  {
    id: "restaurant-cafe",
    title: "Restaurant/Cafe",
    category: "Food", // Explicit category field
    description: "Showcase your menu, gallery, and reservation options",
    icon: Coffee,
    iconColor: "text-lime-600",
    image:
      "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&auto=format&fit=crop",
    template: {
      title: "Restaurant/Cafe",
      description: "A delicious experience awaits",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Welcome to Our Cafe",
            subheading: "Freshly brewed coffee and gourmet dishes",
            image:
              "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=1200",
            cta: { text: "Book a Table", url: "#" },
          },
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "Our Menu",
            body: "Explore our curated selection of dishes, from classic breakfasts to decadent desserts. Every plate is crafted with fresh, local ingredients.",
            image:
              "https://images.unsplash.com/photo-1543353071-087092ec3931?w=800",
            alignment: "left",
          },
        },
        {
          id: "3",
          type: "footer",
          content: {
            heading: "Come Visit Us",
            companyName: "Your Cafe",
            tagline: "Quality you can taste",
            links: [
              { label: "Home", url: "#" },
              { label: "Menu", url: "#" },
              { label: "Reservations", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "Facebook", url: "#", icon: "Facebook" },
            ],
            copyright: `© ${new Date().getFullYear()} Your Cafe.`,
          },
        },
      ],
      styles: {
        theme: "gourmet",
        fontFamily: "Lora",
        colors: {
          primary: "#6ee7b7",
          background: "#ffffff",
          text: "#374151",
        },
      },
    },
  },
  {
    id: "real-estate",
    title: "Real Estate Listing",
    category: "Real Estate", // Explicit category field
    description: "Feature a property with rich details and contact form",
    icon: Home,
    iconColor: "text-emerald-600",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop",
    template: {
      title: "Real Estate",
      description: "Your dream home awaits",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Luxury Home for Sale",
            subheading: "Prime location with modern amenities",
            image:
              "https://images.unsplash.com/photo-1600573477886-cbc5af7a6710?w=1200",
            cta: { text: "Schedule a Tour", url: "#" },
          },
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "Property Highlights",
            body: "Spacious living area, state-of-the-art kitchen, and a stunning backyard. Conveniently located near top schools and shopping centers.",
            image:
              "https://images.unsplash.com/photo-1594676110783-a1a9ca680f5c?w=800",
            alignment: "right",
          },
        },
        {
          id: "3",
          type: "footer",
          content: {
            heading: "Contact Our Agent",
            companyName: "Your Realty",
            tagline: "Where dreams meet homes",
            links: [
              { label: "Home", url: "#" },
              { label: "Listings", url: "#" },
              { label: "About Us", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "LinkedIn", url: "#", icon: "Linkedin" },
              { platform: "Twitter", url: "#", icon: "Twitter" },
            ],
            copyright: `© ${new Date().getFullYear()} Your Realty.`,
          },
        },
      ],
      styles: {
        theme: "professional",
        fontFamily: "Roboto",
        colors: {
          primary: "#10b981",
          background: "#ffffff",
          text: "#1f2937",
        },
      },
    },
  },
  {
    id: "mobile-app",
    title: "Mobile App Showcase",
    category: "App", // Explicit category field
    description: "Highlight features, screenshots, and download links",
    icon: Smartphone,
    iconColor: "text-purple-500",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop",
    template: {
      title: "Mobile App",
      description: "Show off your cutting-edge app",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Introducing Our Mobile App",
            subheading: "Seamless user experience at your fingertips",
            image:
              "https://images.unsplash.com/photo-1598370696960-22735655f528?w=1200",
            cta: { text: "Download Now", url: "#" },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "Key Features",
            items: [
              {
                title: "User-Friendly Interface",
                description: "Designed for simplicity and ease of use",
                icon: "Smartphone",
              },
              {
                title: "Real-Time Sync",
                description: "Access data across all your devices",
                icon: "RefreshCw",
              },
              {
                title: "Offline Mode",
                description:
                  "Stay productive even without an internet connection",
                icon: "WifiOff",
              },
            ],
          },
        },
        {
          id: "3",
          type: "footer",
          content: {
            heading: "Get Started",
            companyName: "Your App",
            tagline: "Built for the future",
            links: [
              { label: "Home", url: "#" },
              { label: "Features", url: "#" },
              { label: "Pricing", url: "#" },
              { label: "Support", url: "#" },
            ],
            socialLinks: [
              { platform: "Twitter", url: "#", icon: "Twitter" },
              { platform: "Facebook", url: "#", icon: "Facebook" },
            ],
            copyright: `© ${new Date().getFullYear()} Your App.`,
          },
        },
      ],
      styles: {
        theme: "tech",
        fontFamily: "Inter",
        colors: {
          primary: "#a78bfa",
          background: "#f9fafb",
          text: "#111827",
        },
      },
    },
  },
  {
    id: "webinar",
    title: "Webinar Registration",
    category: "Webinar", // Explicit category field
    description: "Promote an upcoming webinar and capture sign-ups",
    icon: Video,
    iconColor: "text-yellow-600",
    image:
      "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&auto=format&fit=crop",
    template: {
      title: "Webinar",
      description: "Join our exclusive online session",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Webinar: Level Up Your Skills",
            subheading: "Expert insights from industry leaders",
            image:
              "https://images.unsplash.com/photo-1484704849700-f0329c01c467?w=1200",
            cta: { text: "Register Free", url: "#" },
          },
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "What You'll Learn",
            body: "In this webinar, we’ll cover advanced strategies, real-life case studies, and actionable steps you can apply immediately to see real results.",
            image:
              "https://images.unsplash.com/photo-1581092160633-70b84f7e01e4?w=800",
            alignment: "left",
          },
        },
        {
          id: "3",
          type: "footer",
          content: {
            heading: "Secure Your Spot",
            companyName: "Your Webinar Series",
            tagline: "Knowledge is power",
            links: [
              { label: "Home", url: "#" },
              { label: "Schedule", url: "#" },
              { label: "Speakers", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "LinkedIn", url: "#", icon: "Linkedin" },
              { platform: "Twitter", url: "#", icon: "Twitter" },
            ],
            copyright: `© ${new Date().getFullYear()} Your Webinar.`,
          },
        },
      ],
      styles: {
        theme: "bright",
        fontFamily: "Montserrat",
        colors: {
          primary: "#f59e0b",
          background: "#ffffff",
          text: "#1f2937",
        },
      },
    },
  },
  {
    id: "podcast",
    title: "Podcast Page",
    category: "Media", // Explicit category field
    description: "Display latest episodes, player, and subscription links",
    icon: Mic2,
    iconColor: "text-teal-600",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop",
    template: {
      title: "Podcast",
      description: "Tune in to our latest episodes",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Welcome to Our Podcast",
            subheading: "Insights, stories, and inspiration",
            image:
              "https://images.unsplash.com/photo-1535958636472-aef9f3e09fce?w=1200",
            cta: { text: "Listen Now", url: "#" },
          },
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "Recent Episodes",
            body: "Discover in-depth interviews and discussions with industry experts, thought leaders, and creative minds shaping the future.",
            image:
              "https://images.unsplash.com/photo-1525182008055-f088d8aa4448?w=800",
            alignment: "right",
          },
        },
        {
          id: "3",
          type: "footer",
          content: {
            heading: "Subscribe",
            companyName: "Your Podcast",
            tagline: "Hear it first, every week",
            links: [
              { label: "Home", url: "#" },
              { label: "Episodes", url: "#" },
              { label: "Host", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "Apple Podcast", url: "#", icon: "Music" },
              { platform: "Spotify", url: "#", icon: "Spotify" },
            ],
            copyright: `© ${new Date().getFullYear()} Your Podcast.`,
          },
        },
      ],
      styles: {
        theme: "aqua",
        fontFamily: "Nunito",
        colors: {
          primary: "#14b8a6",
          background: "#ffffff",
          text: "#1f2937",
        },
      },
    },
  },
  {
    id: "fitness-coach",
    title: "Fitness/Wellness Coach",
    category: "Health", // Explicit category field
    description: "Offer services, testimonials, and booking options",
    icon: Activity,
    iconColor: "text-green-600",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop",
    template: {
      title: "Fitness Coach",
      description: "Transform your life with expert guidance",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Achieve Your Fitness Goals",
            subheading: "Personalized workouts and meal plans",
            image:
              "https://images.unsplash.com/photo-1584824486539-53bb4646bdbc?w=1200",
            cta: { text: "Start Now", url: "#" },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "Why Train With Me?",
            items: [
              {
                title: "Tailored Programs",
                description: "Individualized plans for every fitness level",
                icon: "UserCheck",
              },
              {
                title: "Expert Support",
                description:
                  "Guidance from certified trainers and nutritionists",
                icon: "Heart",
              },
              {
                title: "Flexible Scheduling",
                description: "Book sessions that fit your routine",
                icon: "Calendar",
              },
            ],
          },
        },
        {
          id: "3",
          type: "footer",
          content: {
            heading: "Get in Shape",
            companyName: "Your Fitness Coach",
            tagline: "Wellness made simple",
            links: [
              { label: "Home", url: "#" },
              { label: "Programs", url: "#" },
              { label: "Testimonials", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "Facebook", url: "#", icon: "Facebook" },
            ],
            copyright: `© ${new Date().getFullYear()} Your Fitness.`,
          },
        },
      ],
      styles: {
        theme: "energetic",
        fontFamily: "Open Sans",
        colors: {
          primary: "#10b981",
          background: "#f9fafb",
          text: "#1f2937",
        },
      },
    },
  },
  {
    id: "saas-product",
    title: "SaaS Product Features",
    category: "SaaS", // Explicit category field
    description: "Detail features and benefits of your software service",
    icon: Cloud,
    iconColor: "text-sky-600",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
    template: {
      title: "SaaS Product",
      description: "Scale your business with our cloud solution",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "All-in-One SaaS Platform",
            subheading: "Streamline your operations and accelerate growth",
            image:
              "https://images.unsplash.com/photo-1587139769225-8e33e0447019?w=1200",
            cta: { text: "Start Free Trial", url: "#" },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "Powerful Features",
            items: [
              {
                title: "Dashboard Analytics",
                description: "Real-time insights into your key metrics",
                icon: "BarChart",
              },
              {
                title: "Automation",
                description: "Automate repetitive tasks and save time",
                icon: "Settings",
              },
              {
                title: "Team Collaboration",
                description: "Work together seamlessly from anywhere",
                icon: "Users",
              },
            ],
          },
        },
        {
          id: "3",
          type: "footer",
          content: {
            heading: "Ready to Launch?",
            companyName: "Your SaaS",
            tagline: "Empowering success in the cloud",
            links: [
              { label: "Home", url: "#" },
              { label: "Pricing", url: "#" },
              { label: "Features", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "LinkedIn", url: "#", icon: "Linkedin" },
              { platform: "Twitter", url: "#", icon: "Twitter" },
            ],
            copyright: `© ${new Date().getFullYear()} Your SaaS.`,
          },
        },
      ],
      styles: {
        theme: "cloudy",
        fontFamily: "Inter",
        colors: {
          primary: "#0ea5e9",
          background: "#ffffff",
          text: "#1f2937",
        },
      },
    },
  },
  {
    id: "book-launch",
    title: "Book Launch",
    category: "Publishing", // Explicit category field
    description: "Promote a new book with author info and reviews",
    icon: Book,
    iconColor: "text-red-600",
    image:
      "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=800&auto=format&fit=crop",
    template: {
      title: "Book Launch",
      description: "Discover an exciting new release",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "[Your Book Title]",
            subheading: "A journey of discovery and inspiration",
            image:
              "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1200",
            cta: { text: "Buy Now", url: "#" },
          },
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "About the Author",
            body: "Learn about the author's background, inspiration, and accolades. Discover what makes this book a must-read for enthusiasts and newcomers alike.",
            image:
              "https://images.unsplash.com/photo-1525182008055-f088d8aa4448?w=800",
            alignment: "left",
          },
        },
        {
          id: "3",
          type: "footer",
          content: {
            heading: "Get Your Copy",
            companyName: "Your Publishing",
            tagline: "Helping you write the next chapter",
            links: [
              { label: "Home", url: "#" },
              { label: "Books", url: "#" },
              { label: "Reviews", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "Twitter", url: "#", icon: "Twitter" },
              { platform: "Instagram", url: "#", icon: "Instagram" },
            ],
            copyright: `© ${new Date().getFullYear()} Your Publishing.`,
          },
        },
      ],
      styles: {
        theme: "literary",
        fontFamily: "Georgia",
        colors: {
          primary: "#dc2626",
          background: "#ffffff",
          text: "#1f2937",
        },
      },
    },
  },
  {
    id: "photography-portfolio",
    title: "Photography Portfolio",
    category: "Portfolio", // Explicit category field
    description: "A visually rich portfolio for photographers",
    icon: Camera,
    iconColor: "text-pink-700",
    image:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&auto=format&fit=crop",
    template: {
      title: "Photography Portfolio",
      description: "Capture moments that last a lifetime",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "[Your Name] Photography",
            subheading: "Explore my world through the lens",
            image:
              "https://images.unsplash.com/photo-1506863530036-1e1c62e13696?w=1200",
            cta: { text: "View Gallery", url: "#" },
          },
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "About Me",
            body: "I'm a professional photographer with an eye for detail and a passion for storytelling. Let's work together to capture life’s most precious moments.",
            image:
              "https://images.unsplash.com/photo-1516728778615-2d590ea1856f?w=800",
            alignment: "right",
          },
        },
        {
          id: "3",
          type: "footer",
          content: {
            heading: "Schedule a Shoot",
            companyName: "[Your Name]",
            tagline: "Capturing beauty in every frame",
            links: [
              { label: "Home", url: "#" },
              { label: "Gallery", url: "#" },
              { label: "Services", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "Behance", url: "#", icon: "Behance" },
            ],
            copyright: `© ${new Date().getFullYear()} [Your Name].`,
          },
        },
      ],
      styles: {
        theme: "artistic",
        fontFamily: "Raleway",
        colors: {
          primary: "#be185d",
          background: "#ffffff",
          text: "#1f2937",
        },
      },
    },
  },
  {
    id: "coming-soon",
    title: "Startup Coming Soon",
    category: "Business", // Explicit category field
    description: "Announce a new venture and collect emails",
    icon: Clock,
    iconColor: "text-gray-700",
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop",
    template: {
      title: "Coming Soon",
      description: "Stay tuned for our big launch",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Launching Soon",
            subheading: "Sign up to get notified",
            image:
              "https://images.unsplash.com/photo-1619140886828-cd3a9f6e9bd7?w=1200",
            cta: { text: "Notify Me", url: "#" },
          },
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "Be the First to Know",
            body: "We’re working on something amazing. Leave us your email and we’ll let you know once we’re ready to launch!",
            image:
              "https://images.unsplash.com/photo-1564866657311-e977d0a1d2d3?w=800",
            alignment: "left",
          },
        },
        {
          id: "3",
          type: "footer",
          content: {
            heading: "Stay Updated",
            companyName: "Your Startup",
            tagline: "Innovating the future",
            links: [
              { label: "Home", url: "#" },
              { label: "Blog", url: "#" },
              { label: "Jobs", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "Twitter", url: "#", icon: "Twitter" },
              { platform: "LinkedIn", url: "#", icon: "Linkedin" },
            ],
            copyright: `© ${new Date().getFullYear()} Your Startup.`,
          },
        },
      ],
      styles: {
        theme: "futuristic",
        fontFamily: "Inter",
        colors: {
          primary: "#64748b",
          background: "#ffffff",
          text: "#1f2937",
        },
      },
    },
  },
  {
    id: "travel-blog",
    title: "Travel Blog",
    category: "Blog", // Explicit category field
    description: "Share your adventures and travel tips",
    icon: Globe,
    iconColor: "text-blue-500",
    image:
      "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&auto=format&fit=crop",
    template: {
      title: "Travel Blog",
      description: "Explore the world with us",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Adventure Awaits",
            subheading: "Discover breathtaking destinations and hidden gems",
            image:
              "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200",
            cta: {
              text: "Start Exploring",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "Recent Destinations",
            items: [
              {
                title: "Tropical Paradise",
                description: "White sand beaches and crystal clear waters",
                icon: "Palm",
              },
              {
                title: "Mountain Retreat",
                description: "Stunning vistas and peaceful hiking trails",
                icon: "Mountain",
              },
              {
                title: "Urban Adventure",
                description: "Vibrant city life and cultural experiences",
                icon: "Building",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "Travel Tips",
            body: "Whether you're a seasoned traveler or planning your first adventure, our guides will help you make the most of your journey. From packing essentials to finding hidden local spots, we've got you covered with expert advice.",
            image:
              "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800",
            alignment: "right",
          },
        },
        {
          id: "4",
          type: "footer",
          content: {
            heading: "Join Our Community",
            companyName: "Wanderlust Adventures",
            tagline: "Every journey begins with a single step",
            links: [
              { label: "Home", url: "#" },
              { label: "Destinations", url: "#" },
              { label: "Travel Tips", url: "#" },
              { label: "About", url: "#" },
            ],
            socialLinks: [
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "Pinterest", url: "#", icon: "Pinterest" },
              { platform: "YouTube", url: "#", icon: "Youtube" },
            ],
            copyright: `© ${new Date().getFullYear()} Wanderlust Adventures. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "adventurous",
        fontFamily: "Montserrat",
        colors: {
          primary: "#2563eb",
          background: "#ffffff",
          text: "#374151",
        },
      },
    },
  },
  {
    id: "ecommerce",
    title: "Online Store",
    category: "Ecommerce", // Explicit category field
    description: "Sell products with a beautiful storefront",
    icon: Store,
    iconColor: "text-emerald-500",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop",
    template: {
      title: "Online Store",
      description: "Shop our curated collection",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Quality Products, Delivered",
            subheading: "Free shipping on orders over $50",
            image:
              "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1200",
            cta: {
              text: "Shop Now",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "Featured Collections",
            items: [
              {
                title: "New Arrivals",
                description: "Just landed in our store",
                icon: "Star",
              },
              {
                title: "Best Sellers",
                description: "Our most popular products",
                icon: "Award",
              },
              {
                title: "Special Offers",
                description: "Limited time deals and discounts",
                icon: "Tag",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "Our Promise",
            body: "We believe in quality, sustainability, and exceptional customer service. Every product is carefully selected to ensure it meets our high standards. If you're not completely satisfied, our 30-day return policy has you covered.",
            image:
              "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800",
            alignment: "left",
          },
        },
        {
          id: "4",
          type: "footer",
          content: {
            heading: "Stay Connected",
            companyName: "Your Store",
            tagline: "Quality you can trust",
            links: [
              { label: "Shop", url: "#" },
              { label: "About Us", url: "#" },
              { label: "Shipping", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "Facebook", url: "#", icon: "Facebook" },
              { platform: "Pinterest", url: "#", icon: "Pinterest" },
            ],
            copyright: `© ${new Date().getFullYear()} Your Store. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "clean",
        fontFamily: "Inter",
        colors: {
          primary: "#10b981",
          background: "#ffffff",
          text: "#1f2937",
        },
      },
    },
  },
  {
    id: "wedding",
    title: "Wedding",
    category: "Event", // Explicit category field
    description: "Share all the details about your special day",
    icon: Heart,
    iconColor: "text-pink-400",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop",
    template: {
      title: "Wedding",
      description: "Join us to celebrate our special day",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Amanda & Michael",
            subheading: "We're getting married - June 12, 2025",
            image:
              "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200",
            cta: {
              text: "RSVP Now",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "Our Story",
            body: "We met five years ago at a friend's birthday party and instantly connected over our shared love of hiking and classic movies. After three years of adventures together, Michael proposed during a sunrise hike to our favorite mountain overlook.",
            image:
              "https://images.unsplash.com/photo-1522673607200-164d1b3ce551?w=800",
            alignment: "right",
          },
        },
        {
          id: "3",
          type: "features",
          content: {
            heading: "Event Details",
            items: [
              {
                title: "Ceremony",
                description: "June 12, 2025 at 3:00 PM - Riverside Gardens",
                icon: "Heart",
              },
              {
                title: "Reception",
                description: "6:00 PM - The Grand Ballroom at Westlake",
                icon: "GlassWater",
              },
              {
                title: "Dress Code",
                description: "Formal Attire - Black tie optional",
                icon: "Shirt",
              },
            ],
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Travel & Accommodations",
            body: 'For guests traveling from out of town, we\'ve reserved a block of rooms at the Westlake Hotel. Call (555) 123-4567 and mention the "Johnson-Smith Wedding" for a special rate. The hotel offers a shuttle service to and from the venue.',
            image:
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
            alignment: "left",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "We can't wait to celebrate with you",
            companyName: "Amanda & Michael",
            tagline: "June 12, 2025",
            links: [
              { label: "Our Story", url: "#" },
              { label: "Event Details", url: "#" },
              { label: "Registry", url: "#" },
              { label: "RSVP", url: "#" },
            ],
            socialLinks: [
              { platform: "Instagram", url: "#", icon: "Instagram" },
            ],
            copyright: `© ${new Date().getFullYear()} Amanda & Michael's Wedding.`,
          },
        },
      ],
      styles: {
        theme: "elegant",
        fontFamily: "Cormorant Garamond",
        colors: {
          primary: "#ec4899",
          background: "#fffaf3",
          text: "#44403c",
        },
      },
    },
  },
  {
    id: "medical-practice",
    title: "Medical Practice",
    category: "Healthcare", // Explicit category field
    description: "Professional site for healthcare providers",
    icon: Stethoscope,
    iconColor: "text-cyan-600",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop",
    template: {
      title: "Medical Practice",
      description: "Compassionate care for your health needs",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Your Health Is Our Priority",
            subheading: "Expert medical care with a compassionate approach",
            image:
              "https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?w=1200",
            cta: {
              text: "Schedule Appointment",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "Our Services",
            items: [
              {
                title: "Primary Care",
                description:
                  "Comprehensive healthcare for patients of all ages",
                icon: "Heart",
              },
              {
                title: "Specialized Treatment",
                description: "Expert care for specific conditions",
                icon: "Activity",
              },
              {
                title: "Preventive Medicine",
                description: "Regular check-ups and health screenings",
                icon: "Shield",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "Meet Our Doctors",
            body: "Our team of board-certified physicians brings decades of combined experience to provide you with the highest quality care. We take the time to listen to your concerns and develop personalized treatment plans.",
            image:
              "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800",
            alignment: "right",
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Patient Information",
            body: "New to our practice? Please download and complete our new patient forms prior to your first visit. We accept most major insurance plans and offer convenient online payment options for your convenience.",
            image:
              "https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=800",
            alignment: "left",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Contact Us",
            companyName: "Westside Medical Center",
            tagline: "Caring for our community since 1995",
            links: [
              { label: "Home", url: "#" },
              { label: "Services", url: "#" },
              { label: "Doctors", url: "#" },
              { label: "Patient Portal", url: "#" },
            ],
            socialLinks: [
              { platform: "Facebook", url: "#", icon: "Facebook" },
              { platform: "Twitter", url: "#", icon: "Twitter" },
            ],
            copyright: `© ${new Date().getFullYear()} Westside Medical Center. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "professional",
        fontFamily: "Source Sans Pro",
        colors: {
          primary: "#0891b2",
          background: "#ffffff",
          text: "#334155",
        },
      },
    },
  },
  {
    id: "legal-services",
    title: "Legal Services",
    category: "Legal", // Explicit category field
    description: "Professional site for law firms and attorneys",
    icon: Gavel,
    iconColor: "text-indigo-700",
    image:
      "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=800&auto=format&fit=crop",
    template: {
      title: "Legal Services",
      description: "Expert legal representation you can trust",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Experienced Legal Counsel",
            subheading: "Protecting your rights with dedication and expertise",
            image:
              "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200",
            cta: {
              text: "Free Consultation",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "Practice Areas",
            items: [
              {
                title: "Family Law",
                description: "Divorce, custody, and support matters",
                icon: "Users",
              },
              {
                title: "Personal Injury",
                description:
                  "Accidents, medical malpractice, and workplace injuries",
                icon: "Shield",
              },
              {
                title: "Business Law",
                description: "Formation, contracts, and dispute resolution",
                icon: "Briefcase",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "Our Attorneys",
            body: "Our team of skilled attorneys brings decades of combined experience in various legal disciplines. Each member of our firm is committed to providing personalized attention and developing strategies tailored to your specific circumstances.",
            image:
              "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800",
            alignment: "left",
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Client Testimonials",
            body: '"The legal expertise and personal attention I received was exceptional. My case was handled with the utmost professionalism." - Sarah M.\n\n"Their knowledge of business law saved our company from a potentially devastating situation." - James T., CEO',
            image:
              "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
            alignment: "right",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Contact Our Office",
            companyName: "Hamilton & Associates",
            tagline: "Justice. Integrity. Results.",
            links: [
              { label: "Home", url: "#" },
              { label: "Practice Areas", url: "#" },
              { label: "Attorneys", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "LinkedIn", url: "#", icon: "Linkedin" },
              { platform: "Facebook", url: "#", icon: "Facebook" },
            ],
            copyright: `© ${new Date().getFullYear()} Hamilton & Associates. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "distinguished",
        fontFamily: "Libre Baskerville",
        colors: {
          primary: "#4338ca",
          background: "#ffffff",
          text: "#1f2937",
        },
      },
    },
  },
  {
    id: "job-board",
    title: "Job Board",
    category: "Job", // Explicit category field
    description: "Connect employers with potential candidates",
    icon: Briefcase,
    iconColor: "text-blue-700",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop",
    template: {
      title: "Job Board",
      description: "Find your perfect career match",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Your Career Journey Starts Here",
            subheading: "Connecting talent with opportunity across industries",
            image:
              "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200",
            cta: {
              text: "Browse Jobs",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "Featured Categories",
            items: [
              {
                title: "Technology",
                description: "Software development, IT, data science",
                icon: "Code",
              },
              {
                title: "Marketing",
                description: "Digital marketing, SEO, content creation",
                icon: "LineChart",
              },
              {
                title: "Finance",
                description: "Accounting, banking, financial analysis",
                icon: "DollarSign",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "For Job Seekers",
            body: "Create a free account to access thousands of job listings, set up personalized alerts, and showcase your skills to potential employers. Our advanced matching algorithm helps connect you with opportunities that align with your career goals.",
            image:
              "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800",
            alignment: "right",
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "For Employers",
            body: "Find qualified candidates quickly with our comprehensive recruitment platform. Post job listings, review applications, and connect with potential hires all in one place. Our targeted approach ensures your opportunities reach the most relevant talent.",
            image:
              "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
            alignment: "left",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Start Your Journey",
            companyName: "CareerConnect",
            tagline: "Where talent meets opportunity",
            links: [
              { label: "Home", url: "#" },
              { label: "Browse Jobs", url: "#" },
              { label: "For Employers", url: "#" },
              { label: "Resources", url: "#" },
            ],
            socialLinks: [
              { platform: "LinkedIn", url: "#", icon: "Linkedin" },
              { platform: "Twitter", url: "#", icon: "Twitter" },
              { platform: "Facebook", url: "#", icon: "Facebook" },
            ],
            copyright: `© ${new Date().getFullYear()} CareerConnect. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "professional",
        fontFamily: "Inter",
        colors: {
          primary: "#1d4ed8",
          background: "#ffffff",
          text: "#374151",
        },
      },
    },
  },
  {
    id: "music-band",
    title: "Music/Band",
    category: "Music", // Explicit category field
    description: "Showcase music, tour dates, and merchandise",
    icon: Music,
    iconColor: "text-purple-700",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop",
    template: {
      title: "Music/Band",
      description: "Connect with fans and share your music",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "The Midnight Echo",
            subheading: "New album 'Horizons' available now",
            image:
              "https://images.unsplash.com/photo-1501612780327-45045538702b?w=1200",
            cta: {
              text: "Listen Now",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "Tour Dates",
            body: "June 15 - The Sound Lounge, New York, NY\nJune 22 - Electric Hall, Boston, MA\nJuly 10 - Rhythm Room, Chicago, IL\nJuly 18 - Sonic Stage, Austin, TX\nAugust 5 - Melody Gardens, Los Angeles, CA\n\nTickets available through our official website or authorized partners.",
            image:
              "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800",
            alignment: "left",
          },
        },
        {
          id: "3",
          type: "features",
          content: {
            heading: "Latest Releases",
            items: [
              {
                title: "Horizons",
                description: "Our latest studio album featuring 12 new tracks",
                icon: "Disc",
              },
              {
                title: "Acoustic Sessions",
                description: "Stripped-down versions of fan favorites",
                icon: "Music",
              },
              {
                title: "Echoes EP",
                description: "Four unreleased tracks from our early days",
                icon: "Vinyl",
              },
            ],
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Merch Store",
            body: "Support the band and get exclusive merchandise including vinyl records, limited edition t-shirts, posters, and more. Every purchase helps us continue creating the music you love. Check out our new collection inspired by the 'Horizons' album.",
            image:
              "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
            alignment: "right",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Connect With Us",
            companyName: "The Midnight Echo",
            tagline: "Music for the soul",
            links: [
              { label: "Home", url: "#" },
              { label: "Music", url: "#" },
              { label: "Tour", url: "#" },
              { label: "Merch", url: "#" },
            ],
            socialLinks: [
              { platform: "Spotify", url: "#", icon: "Music" },
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "YouTube", url: "#", icon: "Youtube" },
              { platform: "Twitter", url: "#", icon: "Twitter" },
            ],
            copyright: `© ${new Date().getFullYear()} The Midnight Echo. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "dark",
        fontFamily: "Oswald",
        colors: {
          primary: "#8b5cf6",
          background: "#121212",
          text: "#f3f4f6",
        },
      },
    },
  },
  {
    id: "local-business",
    title: "Local Business",
    category: "Business", // Explicit category field
    description: "Connect with customers in your community",
    icon: MapPin,
    iconColor: "text-orange-500",
    image:
      "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&auto=format&fit=crop",
    template: {
      title: "Local Business",
      description: "Serving our community with pride",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Family Owned Since 1985",
            subheading: "Quality products and personalized service",
            image:
              "https://images.unsplash.com/photo-1613743990305-65a239474f13?w=1200",
            cta: {
              text: "Visit Us",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "What We Offer",
            items: [
              {
                title: "Quality Products",
                description:
                  "Carefully selected merchandise from trusted sources",
                icon: "Star",
              },
              {
                title: "Expert Advice",
                description: "Knowledgeable staff ready to assist you",
                icon: "HelpCircle",
              },
              {
                title: "Community Focus",
                description: "Supporting local initiatives and events",
                icon: "Users",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "Our Story",
            body: "Founded in 1985 by the Johnson family, our business has grown from a small corner shop to a beloved community fixture. Three generations later, we still maintain the same commitment to quality and customer service that has defined us from the beginning.",
            image:
              "https://images.unsplash.com/photo-1612835362596-4b6b4eda75f7?w=800",
            alignment: "right",
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Visit Our Store",
            body: "123 Main Street\nYourtown, State 12345\n\nHours:\nMonday - Friday: 9AM - 7PM\nSaturday: 10AM - 5PM\nSunday: Closed\n\nPhone: (555) 123-4567\nEmail: info@yourbusiness.com",
            image:
              "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
            alignment: "left",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Stay Connected",
            companyName: "Johnson's General Store",
            tagline: "Your neighborhood source for quality goods",
            links: [
              { label: "Home", url: "#" },
              { label: "Products", url: "#" },
              { label: "About Us", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "Facebook", url: "#", icon: "Facebook" },
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "Yelp", url: "#", icon: "Star" },
            ],
            copyright: `© ${new Date().getFullYear()} Johnson's General Store. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "warm",
        fontFamily: "Lora",
        colors: {
          primary: "#f97316",
          background: "#fffbeb",
          text: "#44403c",
        },
      },
    },
  },
  {
    id: "virtual-conference",
    title: "Virtual Conference",
    category: "Event", // Explicit category field
    description: "Host engaging online events and webinars",
    icon: Video,
    iconColor: "text-violet-600",
    image:
      "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&auto=format&fit=crop",
    template: {
      title: "Virtual Conference",
      description: "Join our global online event",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "TechSummit 2025",
            subheading:
              "A virtual gathering of industry leaders and innovators",
            image:
              "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1200",
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
            body: "TechSummit 2025 brings together thought leaders, developers, and entrepreneurs from across the globe for three days of inspiring talks, interactive workshops, and unmatched networking opportunities. Join us from anywhere in the world via our state-of-the-art virtual platform.",
            image:
              "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800",
            alignment: "left",
          },
        },
        {
          id: "3",
          type: "features",
          content: {
            heading: "Conference Highlights",
            items: [
              {
                title: "Keynote Speakers",
                description:
                  "Hear from CEOs and founders of leading tech companies",
                icon: "Mic",
              },
              {
                title: "Interactive Sessions",
                description: "Participate in live Q&A and hands-on workshops",
                icon: "Users",
              },
              {
                title: "Networking",
                description:
                  "Connect with peers through our virtual networking lounge",
                icon: "Network",
              },
            ],
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Schedule Overview",
            body: "Day 1: Opening keynote, technical workshops, industry panels\nDay 2: Product showcases, hands-on labs, breakout sessions\nDay 3: Career development, networking events, closing keynote\n\nDetailed schedule will be available to registered attendees through our event platform.",
            image:
              "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800",
            alignment: "right",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Join the Conversation",
            companyName: "TechSummit 2025",
            tagline: "Where innovation meets opportunity",
            links: [
              { label: "Home", url: "#" },
              { label: "Speakers", url: "#" },
              { label: "Schedule", url: "#" },
              { label: "Register", url: "#" },
            ],
            socialLinks: [
              { platform: "Twitter", url: "#", icon: "Twitter" },
              { platform: "LinkedIn", url: "#", icon: "Linkedin" },
              { platform: "YouTube", url: "#", icon: "Youtube" },
            ],
            copyright: `© ${new Date().getFullYear()} TechSummit. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "tech",
        fontFamily: "Inter",
        colors: {
          primary: "#8b5cf6",
          background: "#f8f9ff",
          text: "#1f2937",
        },
      },
    },
  },
  {
    id: "food-delivery",
    title: "Food Delivery",
    category: "Food", // Explicit category field
    description: "Online ordering for restaurants and meal delivery",
    icon: Utensils,
    iconColor: "text-red-500",
    image:
      "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&auto=format&fit=crop",
    template: {
      title: "Food Delivery",
      description: "Delicious meals delivered to your door",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Delicious Food, Delivered Fast",
            subheading: "From our kitchen to your table in 30 minutes or less",
            image:
              "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200",
            cta: {
              text: "Order Now",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "Featured Categories",
            items: [
              {
                title: "Signature Dishes",
                description: "Our most popular chef-crafted recipes",
                icon: "Utensils",
              },
              {
                title: "Healthy Options",
                description: "Nutritious meals under 600 calories",
                icon: "Heart",
              },
              {
                title: "Family Meals",
                description: "Generous portions perfect for sharing",
                icon: "Users",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "How It Works",
            body: "1. Browse our menu and select your favorite dishes\n2. Choose delivery time and payment method\n3. Track your order in real-time\n4. Enjoy your meal fresh from our kitchen\n\nAll meals are prepared with fresh ingredients and packaged with care to ensure they arrive in perfect condition.",
            image:
              "https://images.unsplash.com/photo-1551326844-4df70f78d0e9?w=800",
            alignment: "right",
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Customer Favorites",
            body: "Our signature Margherita Pizza and Classic Burger consistently top our bestseller list. For those with a sweet tooth, don't miss our award-winning Chocolate Lava Cake, made with premium Belgian chocolate.\n\nNew to our menu? Try our Chef's Weekly Special featuring seasonal ingredients and innovative flavor combinations.",
            image:
              "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
            alignment: "left",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Ready to Order?",
            companyName: "FreshDelivery",
            tagline: "Bringing good food to your doorstep",
            links: [
              { label: "Menu", url: "#" },
              { label: "Promotions", url: "#" },
              { label: "About Us", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "Facebook", url: "#", icon: "Facebook" },
              { platform: "Twitter", url: "#", icon: "Twitter" },
            ],
            copyright: `© ${new Date().getFullYear()} FreshDelivery. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "appetizing",
        fontFamily: "Poppins",
        colors: {
          primary: "#ef4444",
          background: "#ffffff",
          text: "#374151",
        },
      },
    },
  },
  {
    id: "art-creative",
    title: "Art & Creative",
    category: "Art", // Explicit category field
    description: "Showcase artistic work and creative services",
    icon: Palette,
    iconColor: "text-fuchsia-500",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop",
    template: {
      title: "Art & Creative",
      description: "Where imagination meets expression",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Creative Vision Brought to Life",
            subheading: "Custom art and design that tells your unique story",
            image:
              "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200",
            cta: {
              text: "Explore Gallery",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "About the Artist",
            body: "With over a decade of experience in visual arts, I blend traditional techniques with contemporary vision to create pieces that resonate with emotion and narrative. My work has been featured in galleries across the country and commissioned by private collectors worldwide.",
            image:
              "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800",
            alignment: "left",
          },
        },
        {
          id: "3",
          type: "features",
          content: {
            heading: "Services Offered",
            items: [
              {
                title: "Custom Artwork",
                description: "Commissioned pieces tailored to your vision",
                icon: "Palette",
              },
              {
                title: "Art Direction",
                description: "Creative guidance for projects and campaigns",
                icon: "Compass",
              },
              {
                title: "Workshops",
                description:
                  "Group and individual instruction in various techniques",
                icon: "Brush",
              },
            ],
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Recent Projects",
            body: '"Chromatic Memories" - A series exploring the intersection of color and emotion, featured at the Urban Gallery\'s spring exhibition.\n\n"Corporate Rebranding" - Visual identity refresh for Horizon Industries, including custom artwork for their headquarters.\n\n"Community Mural" - Led a collaborative public art project celebrating local heritage.',
            image:
              "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800",
            alignment: "right",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Let's Create Together",
            companyName: "Studio Creativa",
            tagline: "Art that speaks to the soul",
            links: [
              { label: "Gallery", url: "#" },
              { label: "Services", url: "#" },
              { label: "Process", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "Pinterest", url: "#", icon: "Pinterest" },
              { platform: "Behance", url: "#", icon: "Figma" },
            ],
            copyright: `© ${new Date().getFullYear()} Studio Creativa. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "artistic",
        fontFamily: "Montserrat",
        colors: {
          primary: "#d946ef",
          background: "#ffffff",
          text: "#262626",
        },
      },
    },
  },
  // Add these new templates to the existing landingTemplates array

  {
    id: "online-course-marketplace",
    title: "Course Marketplace",
    category: "Education", // Explicit category field
    description: "Platform for multiple instructors and courses",
    icon: Book,
    iconColor: "text-emerald-600",
    image:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop",
    template: {
      title: "Course Marketplace",
      description: "Learn from expert instructors worldwide",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Learn Any Skill, Anytime",
            subheading: "Thousands of courses taught by industry experts",
            image:
              "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200",
            cta: {
              text: "Browse Courses",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "Top Categories",
            items: [
              {
                title: "Development",
                description: "Web, mobile, and software development courses",
                icon: "Code",
              },
              {
                title: "Business",
                description: "Marketing, finance, and entrepreneurship",
                icon: "Briefcase",
              },
              {
                title: "Creative",
                description: "Design, photography, and music production",
                icon: "Palette",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "Learn On Your Schedule",
            body: "Access high-quality courses anytime, anywhere. Our platform offers flexible learning with lifetime access to purchased courses, allowing you to learn at your own pace from any device.\n\nAll courses include video lectures, downloadable resources, and completion certificates.",
            image:
              "https://images.unsplash.com/photo-1610484826967-09c5720778c7?w=800",
            alignment: "right",
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Become an Instructor",
            body: "Share your expertise with students worldwide. Our platform makes it easy to create and sell your courses to a global audience.\n\n- Intuitive course creation tools\n- Marketing and promotion support\n- Analytics to track performance\n- Multiple monetization options",
            image:
              "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
            alignment: "left",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Start Learning Today",
            companyName: "EduMarket",
            tagline: "Knowledge for everyone, everywhere",
            links: [
              { label: "Courses", url: "#" },
              { label: "Instructors", url: "#" },
              { label: "Pricing", url: "#" },
              { label: "Help", url: "#" },
            ],
            socialLinks: [
              { platform: "Facebook", url: "#", icon: "Facebook" },
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "YouTube", url: "#", icon: "Youtube" },
              { platform: "LinkedIn", url: "#", icon: "Linkedin" },
            ],
            copyright: `© ${new Date().getFullYear()} EduMarket. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "clean",
        fontFamily: "Inter",
        colors: {
          primary: "#10b981",
          background: "#ffffff",
          text: "#334155",
        },
      },
    },
  },
  {
    id: "coaching-services",
    title: "Coaching Services",
    category: "Coaching", // Explicit category field
    description: "Offer professional coaching and mentorship",
    icon: Users,
    iconColor: "text-amber-500",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop",
    template: {
      title: "Coaching Services",
      description: "Unlock your potential with expert guidance",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Transform Your Life & Career",
            subheading: "Professional coaching tailored to your unique goals",
            image:
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200",
            cta: {
              text: "Book a Discovery Call",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "My Approach",
            body: "I believe everyone has the capacity to achieve extraordinary results with the right guidance. My coaching combines proven methodologies with personalized strategies to help you overcome obstacles, maximize strengths, and achieve your most ambitious goals.\n\nThrough a collaborative partnership, we'll develop actionable plans that align with your values and vision.",
            image:
              "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800",
            alignment: "left",
          },
        },
        {
          id: "3",
          type: "features",
          content: {
            heading: "Coaching Programs",
            items: [
              {
                title: "Career Acceleration",
                description: "Strategies to advance your professional journey",
                icon: "TrendingUp",
              },
              {
                title: "Leadership Development",
                description: "Enhance your ability to inspire and lead teams",
                icon: "Star",
              },
              {
                title: "Life Balance",
                description:
                  "Create harmony between personal and professional life",
                icon: "Heart",
              },
            ],
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Client Success Stories",
            body: '"Working with Sarah transformed my approach to leadership. I gained the confidence to pursue a promotion I previously thought was out of reach." - James T., Marketing Director\n\n"The insights and strategies I learned helped me redesign my work-life balance. I\'m now more productive and happier than ever." - Elena M., Tech Entrepreneur',
            image:
              "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
            alignment: "right",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Ready to Begin Your Journey?",
            companyName: "Breakthrough Coaching",
            tagline: "Your potential is limitless",
            links: [
              { label: "Home", url: "#" },
              { label: "Services", url: "#" },
              { label: "About", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "LinkedIn", url: "#", icon: "Linkedin" },
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "Twitter", url: "#", icon: "Twitter" },
            ],
            copyright: `© ${new Date().getFullYear()} Breakthrough Coaching. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "warm",
        fontFamily: "Nunito",
        colors: {
          primary: "#f59e0b",
          background: "#fffbeb",
          text: "#44403c",
        },
      },
    },
  },
  {
    id: "interior-design",
    title: "Interior Design",
    category: "Design", // Explicit category field
    description: "Showcase interior design projects and services",
    icon: Palette,
    iconColor: "text-rose-500",
    image:
      "https://images.unsplash.com/photo-1615529179035-e760f6a2dcee?w=800&auto=format&fit=crop",
    template: {
      title: "Interior Design",
      description: "Transform your living spaces",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Beautiful Spaces, Thoughtfully Designed",
            subheading:
              "Interior design that reflects your lifestyle and personality",
            image:
              "https://images.unsplash.com/photo-1616627051692-c2a79d24e5c3?w=1200",
            cta: {
              text: "View Portfolio",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "Our Services",
            items: [
              {
                title: "Residential Design",
                description: "Creating comfortable and stylish homes",
                icon: "Home",
              },
              {
                title: "Commercial Spaces",
                description: "Functional and inspiring work environments",
                icon: "Building",
              },
              {
                title: "Renovation Consulting",
                description: "Expert guidance for your remodeling projects",
                icon: "Tool",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "Our Design Process",
            body: "We believe in a collaborative approach that puts your needs first. Our process begins with understanding your vision, followed by conceptual design, detailed planning, and meticulous execution.\n\nEvery project is unique, and we tailor our services to match your specific requirements, timeline, and budget.",
            image:
              "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
            alignment: "right",
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Featured Projects",
            body: "**Modern Minimalist Apartment**\nA complete renovation of a downtown loft, emphasizing clean lines and functional spaces while maintaining warmth and comfort.\n\n**Coastal Family Home**\nA beachside residence designed to maximize natural light and create seamless indoor-outdoor living areas perfect for entertaining.",
            image:
              "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800",
            alignment: "left",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Transform Your Space",
            companyName: "Studio Interiors",
            tagline: "Where design meets functionality",
            links: [
              { label: "Home", url: "#" },
              { label: "Projects", url: "#" },
              { label: "Services", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "Pinterest", url: "#", icon: "Pinterest" },
              { platform: "Houzz", url: "#", icon: "Home" },
            ],
            copyright: `© ${new Date().getFullYear()} Studio Interiors. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "elegant",
        fontFamily: "Playfair Display",
        colors: {
          primary: "#f43f5e",
          background: "#ffffff",
          text: "#27272a",
        },
      },
    },
  },
  {
    id: "home-services",
    title: "Home Services",
    category: "Services", // Explicit category field
    description: "Promote home repair and renovation services",
    icon: Home,
    iconColor: "text-blue-600",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop",
    template: {
      title: "Home Services",
      description: "Professional home repair and improvement",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Expert Home Services You Can Trust",
            subheading:
              "Licensed professionals for all your home improvement needs",
            image:
              "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200",
            cta: {
              text: "Get a Free Quote",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "Our Services",
            items: [
              {
                title: "Plumbing",
                description: "Repairs, installations, and emergency services",
                icon: "Droplet",
              },
              {
                title: "Electrical",
                description: "Wiring, lighting, and electrical panel upgrades",
                icon: "Zap",
              },
              {
                title: "Remodeling",
                description: "Kitchen, bathroom, and whole-home renovations",
                icon: "Tool",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "Why Choose Us",
            body: "With over 20 years of experience, our team of licensed professionals delivers quality workmanship on every project. We pride ourselves on reliability, punctuality, and transparent pricing.\n\n- Licensed and insured technicians\n- 100% satisfaction guarantee\n- Upfront pricing with no hidden fees\n- Emergency services available 24/7",
            image:
              "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
            alignment: "left",
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Customer Testimonials",
            body: '"The team was professional, efficient, and left my home spotless after completing the project. I couldn\'t be happier with the results." - Sarah M.\n\n"When our water heater failed on a Sunday evening, they responded within an hour. Exceptional service at a fair price." - Robert J.',
            image:
              "https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?w=800",
            alignment: "right",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Ready to Improve Your Home?",
            companyName: "Premier Home Services",
            tagline: "Quality work guaranteed",
            links: [
              { label: "Home", url: "#" },
              { label: "Services", url: "#" },
              { label: "Estimates", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "Facebook", url: "#", icon: "Facebook" },
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "Yelp", url: "#", icon: "Star" },
            ],
            copyright: `© ${new Date().getFullYear()} Premier Home Services. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "professional",
        fontFamily: "Source Sans Pro",
        colors: {
          primary: "#2563eb",
          background: "#f8fafc",
          text: "#334155",
        },
      },
    },
  },
  {
    id: "freelancer-portfolio",
    title: "Freelancer Portfolio",
    category: "Portfolio", // Explicit category field
    description: "Showcase your skills and attract clients",
    icon: Briefcase,
    iconColor: "text-violet-600",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop",
    template: {
      title: "Freelancer Portfolio",
      description: "Professional services tailored to your needs",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Hi, I'm [Your Name]",
            subheading: "Freelance [Your Specialty] helping brands stand out",
            image:
              "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200",
            cta: {
              text: "See My Work",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "What I Do",
            body: "I specialize in creating custom [your service] solutions that help businesses achieve their goals. With [X] years of experience working with clients across various industries, I bring a versatile skill set and strategic approach to every project.\n\nMy process involves deep collaboration with clients to ensure deliverables that not only meet but exceed expectations.",
            image:
              "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
            alignment: "right",
          },
        },
        {
          id: "3",
          type: "features",
          content: {
            heading: "Services",
            items: [
              {
                title: "[Service 1]",
                description:
                  "Detailed description of your first service offering",
                icon: "Layout",
              },
              {
                title: "[Service 2]",
                description:
                  "Detailed description of your second service offering",
                icon: "Edit",
              },
              {
                title: "[Service 3]",
                description:
                  "Detailed description of your third service offering",
                icon: "BarChart",
              },
            ],
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Featured Projects",
            body: "**[Project Name 1]**\nBrief description of the project, your role, and the results achieved for the client.\n\n**[Project Name 2]**\nBrief description of another significant project showcasing different skills or industry experience.",
            image:
              "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
            alignment: "left",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Let's Work Together",
            companyName: "[Your Name]",
            tagline: "Freelance [Your Specialty]",
            links: [
              { label: "Home", url: "#" },
              { label: "Portfolio", url: "#" },
              { label: "Services", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "LinkedIn", url: "#", icon: "Linkedin" },
              { platform: "GitHub", url: "#", icon: "Github" },
              { platform: "Twitter", url: "#", icon: "Twitter" },
            ],
            copyright: `© ${new Date().getFullYear()} [Your Name]. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "minimal",
        fontFamily: "Inter",
        colors: {
          primary: "#8b5cf6",
          background: "#ffffff",
          text: "#1f2937",
        },
      },
    },
  },
  {
    id: "charity-fundraiser",
    title: "Charity Fundraiser",
    category: "Nonprofit", // Explicit category field
    description: "Raise funds and awareness for your cause",
    icon: Gift,
    iconColor: "text-green-600",
    image:
      "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&auto=format&fit=crop",
    template: {
      title: "Charity Fundraiser",
      description: "Support our mission to make a difference",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Help Us Make a Difference",
            subheading:
              "Join our campaign to provide clean water to communities in need",
            image:
              "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=1200",
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
            body: "We believe that access to clean water is a fundamental human right. Our organization works to build sustainable water systems in underserved communities, improving health, education, and quality of life.\n\nYour donation directly funds well construction, water filtration systems, and educational programs on water conservation and hygiene.",
            image:
              "https://images.unsplash.com/photo-1621506821955-0045a5971ac0?w=800",
            alignment: "right",
          },
        },
        {
          id: "3",
          type: "features",
          content: {
            heading: "Your Impact",
            items: [
              {
                title: "$25",
                description:
                  "Provides clean water to a child for an entire year",
                icon: "Droplet",
              },
              {
                title: "$100",
                description: "Installs a water filter for a family's home",
                icon: "Home",
              },
              {
                title: "$500",
                description: "Helps fund a community water pump installation",
                icon: "Users",
              },
            ],
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Success Stories",
            body: "In the village of Nyabweke, our recently completed well now serves over 500 residents who previously walked 3 miles daily to collect often contaminated water. School attendance has increased by 30% as children, especially girls, no longer spend hours collecting water.\n\nWith your support, we can bring similar transformation to more communities.",
            image:
              "https://images.unsplash.com/photo-1569144157591-c60f3f82f137?w=800",
            alignment: "left",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Be Part of the Solution",
            companyName: "Clean Water Initiative",
            tagline: "Every drop makes a difference",
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
            copyright: `© ${new Date().getFullYear()} Clean Water Initiative. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "warm",
        fontFamily: "Montserrat",
        colors: {
          primary: "#16a34a",
          background: "#f0fdf4",
          text: "#374151",
        },
      },
    },
  },
  {
    id: "fitness-app",
    title: "Fitness App",
    category: "App", // Explicit category field
    description: "Promote your fitness application or platform",
    icon: Activity,
    iconColor: "text-red-500",
    image:
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&auto=format&fit=crop",
    template: {
      title: "Fitness App",
      description: "Your personal trainer in your pocket",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Fitness That Fits Your Life",
            subheading:
              "Personalized workouts, nutrition plans, and coaching in one app",
            image:
              "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200",
            cta: {
              text: "Download Now",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "App Features",
            items: [
              {
                title: "Custom Workouts",
                description: "Tailored fitness plans based on your goals",
                icon: "Dumbbell",
              },
              {
                title: "Nutrition Tracking",
                description: "Log meals and track macros with ease",
                icon: "Apple",
              },
              {
                title: "Progress Analytics",
                description: "Visualize your improvements over time",
                icon: "BarChart2",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "Training That Adapts to You",
            body: "Whether you're a beginner or an experienced athlete, our app adjusts to your fitness level. Using AI technology, we analyze your performance and modify workouts to ensure optimal results.\n\nTrain anywhere with minimal equipment or access our gym-specific routines for a full fitness experience.",
            image:
              "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800",
            alignment: "left",
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Real Results",
            body: "Our users have logged over 2 million workouts and achieved remarkable transformations. With an average rating of 4.8/5 stars, people love how our app makes fitness accessible, enjoyable, and effective.\n\nJoin a supportive community of like-minded individuals on their fitness journey.",
            image:
              "https://images.unsplash.com/photo-1593476550919-31456cc74d19?w=800",
            alignment: "right",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Start Your Fitness Journey",
            companyName: "FitLife App",
            tagline: "Fitness for every body",
            links: [
              { label: "Features", url: "#" },
              { label: "Pricing", url: "#" },
              { label: "Testimonials", url: "#" },
              { label: "Support", url: "#" },
            ],
            socialLinks: [
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "Facebook", url: "#", icon: "Facebook" },
              { platform: "Twitter", url: "#", icon: "Twitter" },
              { platform: "YouTube", url: "#", icon: "Youtube" },
            ],
            copyright: `© ${new Date().getFullYear()} FitLife App. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "energetic",
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
    id: "hotel-booking",
    title: "Hotel Booking",
    category: "Travel", // Explicit category field
    description: "Showcase accommodation and amenities",
    icon: MapPin,
    iconColor: "text-sky-500",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
    template: {
      title: "Hotel Booking",
      description: "Luxury accommodations for your perfect getaway",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Experience True Luxury",
            subheading:
              "Award-winning accommodations in breathtaking locations",
            image:
              "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200",
            cta: {
              text: "Book Your Stay",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "Accommodations",
            body: "Our elegantly appointed rooms and suites offer the perfect blend of comfort and sophistication. Each space features premium bedding, modern amenities, and thoughtful touches to ensure a memorable stay.\n\nChoose from garden view rooms, ocean-facing suites, or exclusive villas with private pools.",
            image:
              "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
            alignment: "left",
          },
        },
        {
          id: "3",
          type: "features",
          content: {
            heading: "Resort Amenities",
            items: [
              {
                title: "Fine Dining",
                description: "Award-winning restaurants and bars",
                icon: "Utensils",
              },
              {
                title: "Wellness Spa",
                description: "Rejuvenating treatments and facilities",
                icon: "Wind",
              },
              {
                title: "Infinity Pools",
                description: "Stunning pools overlooking the ocean",
                icon: "Droplet",
              },
            ],
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Experiences",
            body: "Immerse yourself in curated experiences that showcase the best of our location. From guided nature walks and water sports to cooking classes and cultural excursions, our concierge team can arrange unforgettable activities for every interest.",
            image:
              "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800",
            alignment: "right",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Reserve Your Escape",
            companyName: "Azure Resort & Spa",
            tagline: "Where memories are made",
            links: [
              { label: "Accommodations", url: "#" },
              { label: "Dining", url: "#" },
              { label: "Experiences", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "Facebook", url: "#", icon: "Facebook" },
              { platform: "TripAdvisor", url: "#", icon: "Star" },
            ],
            copyright: `© ${new Date().getFullYear()} Azure Resort & Spa. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "elegant",
        fontFamily: "Cormorant Garamond",
        colors: {
          primary: "#0ea5e9",
          background: "#ffffff",
          text: "#334155",
        },
      },
    },
  },
  {
    id: "tech-conference",
    title: "Tech Conference",
    category: "Event", // Explicit category field
    description: "Promote a technology event or conference",
    icon: Video,
    iconColor: "text-indigo-500",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop",
    template: {
      title: "Tech Conference",
      description: "Join the biggest tech event of the year",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "TechConnect 2025",
            subheading:
              "The premier conference for innovation and digital transformation",
            image:
              "https://images.unsplash.com/photo-1582192730841-2a682d7375f9?w=1200",
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
            body: "TechConnect brings together industry leaders, innovators, and technology enthusiasts for three days of inspiring keynotes, hands-on workshops, and unmatched networking opportunities.\n\nWhether you're a developer, designer, entrepreneur, or executive, you'll gain valuable insights and connections to drive your career and business forward.",
            image:
              "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800",
            alignment: "right",
          },
        },
        {
          id: "3",
          type: "features",
          content: {
            heading: "Conference Tracks",
            items: [
              {
                title: "AI & Machine Learning",
                description:
                  "Exploring the frontiers of artificial intelligence",
                icon: "Brain",
              },
              {
                title: "Web3 & Blockchain",
                description: "Decentralized technologies shaping the future",
                icon: "Link",
              },
              {
                title: "Product Innovation",
                description: "Strategies for building remarkable products",
                icon: "Lightbulb",
              },
            ],
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Featured Speakers",
            body: "Learn from industry titans and emerging voices who are shaping the future of technology. Our carefully selected speakers bring diverse perspectives and cutting-edge insights across multiple disciplines.\n\nView the complete speaker lineup and agenda on our conference website.",
            image:
              "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800",
            alignment: "left",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Join Us for TechConnect 2025",
            companyName: "TechConnect Conference",
            tagline: "Where innovation meets opportunity",
            links: [
              { label: "Home", url: "#" },
              { label: "Speakers", url: "#" },
              { label: "Schedule", url: "#" },
              { label: "Register", url: "#" },
            ],
            socialLinks: [
              { platform: "Twitter", url: "#", icon: "Twitter" },
              { platform: "LinkedIn", url: "#", icon: "Linkedin" },
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "YouTube", url: "#", icon: "Youtube" },
            ],
            copyright: `© ${new Date().getFullYear()} TechConnect Conference. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "tech",
        fontFamily: "Inter",
        colors: {
          primary: "#6366f1",
          background: "#fafafa",
          text: "#18181b",
        },
      },
    },
  },
  {
    id: "digital-product",
    title: "Digital Product",
    category: "Marketing", // Explicit category field
    description: "Promote ebooks, courses, or digital downloads",
    icon: Cloud,
    iconColor: "text-teal-500",
    image:
      "https://images.unsplash.com/photo-1561069934-eee225952461?w=800&auto=format&fit=crop",
    template: {
      title: "Digital Product",
      description: "Download instant solutions for your needs",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "The Ultimate [Product] Guide",
            subheading:
              "Everything you need to succeed with [topic] in one comprehensive package",
            image:
              "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1200",
            cta: {
              text: "Get Instant Access",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "What's Included",
            items: [
              {
                title: "200+ Page eBook",
                description: "Comprehensive guide with actionable strategies",
                icon: "BookOpen",
              },
              {
                title: "Video Tutorials",
                description: "12 in-depth video lessons with examples",
                icon: "Video",
              },
              {
                title: "Templates & Resources",
                description: "Ready-to-use files to implement immediately",
                icon: "FileText",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "Why This Guide Works",
            body: "Unlike generic advice you'll find elsewhere, our guide provides a proven system developed through years of experience and testing. We break down complex concepts into simple, actionable steps you can implement immediately.\n\nWhether you're a beginner or have some experience, this resource will help you achieve results faster and avoid common pitfalls.",
            image:
              "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
            alignment: "right",
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Customer Success Stories",
            body: '"This guide helped me achieve [specific result] in just 30 days. The templates alone saved me countless hours!" - Jamie T.\n\n"I was skeptical at first, but the step-by-step approach made it so easy to implement. I\'ve already [achieved specific outcome]." - Alex M.',
            image:
              "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
            alignment: "left",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Ready to Transform Your Results?",
            companyName: "Digital Solutions",
            tagline: "Expert resources for real-world success",
            links: [
              { label: "Home", url: "#" },
              { label: "Products", url: "#" },
              { label: "FAQ", url: "#" },
              { label: "Support", url: "#" },
            ],
            socialLinks: [
              { platform: "Twitter", url: "#", icon: "Twitter" },
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "Facebook", url: "#", icon: "Facebook" },
            ],
            copyright: `© ${new Date().getFullYear()} Digital Solutions. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "modern",
        fontFamily: "Nunito",
        colors: {
          primary: "#14b8a6",
          background: "#ffffff",
          text: "#334155",
        },
      },
    },
  },
  {
    id: "remote-work",
    title: "Remote Work Platform",
    category: "Business", // Explicit category field
    description: "Connect distributed teams and enhance productivity",
    icon: Laptop,
    iconColor: "text-blue-600",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop",
    template: {
      title: "Remote Work Platform",
      description: "Seamless collaboration for distributed teams",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Work From Anywhere",
            subheading: "Keep your team connected, productive, and engaged",
            image:
              "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200",
            cta: {
              text: "Start Free Trial",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "Platform Features",
            items: [
              {
                title: "Virtual Workspaces",
                description: "Customizable environments for every team",
                icon: "Layout",
              },
              {
                title: "Smart Scheduling",
                description: "Time zone-aware meeting coordination",
                icon: "Calendar",
              },
              {
                title: "Team Analytics",
                description: "Insights to optimize productivity and wellbeing",
                icon: "BarChart2",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "Built for Remote Teams",
            body: "Our platform addresses the unique challenges of distributed workforces with tools designed to overcome distance, time zones, and communication barriers. Foster connection and collaboration regardless of physical location.\n\nFrom asynchronous workflows to virtual team building, we've reimagined every aspect of work for the remote-first era.",
            image:
              "https://images.unsplash.com/photo-1552581234-26160f608093?w=800",
            alignment: "left",
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Customer Success",
            body: '"Since adopting this platform, our team productivity increased by 32% while employee satisfaction scores improved across all departments." - Sarah K., CTO at TechNova\n\n"As a company with team members across 12 time zones, this solution has transformed how we collaborate and stay connected." - Miguel R., Operations Director',
            image:
              "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800",
            alignment: "right",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Ready to Transform Your Remote Work?",
            companyName: "RemoteHub",
            tagline: "Redefining work in the digital age",
            links: [
              { label: "Features", url: "#" },
              { label: "Pricing", url: "#" },
              { label: "Resources", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "LinkedIn", url: "#", icon: "Linkedin" },
              { platform: "Twitter", url: "#", icon: "Twitter" },
              { platform: "YouTube", url: "#", icon: "Youtube" },
            ],
            copyright: `© ${new Date().getFullYear()} RemoteHub. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "modern",
        fontFamily: "Inter",
        colors: {
          primary: "#3b82f6",
          background: "#ffffff",
          text: "#1f2937",
        },
      },
    },
  },
  {
    id: "health-clinic",
    title: "Health Clinic",
    category: "Healthcare", // Explicit category field
    description: "Medical services with a patient-centered approach",
    icon: Stethoscope,
    iconColor: "text-emerald-600",
    image:
      "https://images.unsplash.com/photo-1631507623112-0092cef9c70d?q=80&w=2070&auto=format&fit=crop",
    template: {
      title: "Health Clinic",
      description: "Compassionate healthcare for the whole family",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Your Health, Our Priority",
            subheading: "Expert medical care with a personalized approach",
            image:
              "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=1200",
            cta: {
              text: "Book Appointment",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "Our Services",
            items: [
              {
                title: "Family Medicine",
                description: "Comprehensive care for patients of all ages",
                icon: "Users",
              },
              {
                title: "Preventive Health",
                description: "Screenings and wellness programs",
                icon: "ShieldCheck",
              },
              {
                title: "Telehealth",
                description: "Virtual consultations for your convenience",
                icon: "Video",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "Meet Our Team",
            body: "Our healthcare professionals combine extensive clinical experience with genuine compassion. Led by Dr. Emily Chen, our team includes board-certified physicians, nurse practitioners, and support staff dedicated to providing exceptional care.\n\nWe take the time to listen to your concerns and develop personalized treatment plans.",
            image:
              "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800",
            alignment: "right",
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Patient Information",
            body: "**New Patients**\nComplete registration forms online before your first visit to streamline your check-in process.\n\n**Insurance**\nWe accept most major insurance plans. Contact our office to verify coverage.\n\n**Hours**\nMonday-Friday: 8am-6pm\nSaturday: 9am-1pm\nSunday: Closed",
            image:
              "https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=800",
            alignment: "left",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "We're Here For You",
            companyName: "Wellness Medical Clinic",
            tagline: "Caring for our community since 1998",
            links: [
              { label: "Home", url: "#" },
              { label: "Services", url: "#" },
              { label: "Providers", url: "#" },
              { label: "Patient Portal", url: "#" },
            ],
            socialLinks: [
              { platform: "Facebook", url: "#", icon: "Facebook" },
              { platform: "Instagram", url: "#", icon: "Instagram" },
            ],
            copyright: `© ${new Date().getFullYear()} Wellness Medical Clinic. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "clean",
        fontFamily: "Source Sans Pro",
        colors: {
          primary: "#10b981",
          background: "#f8fafc",
          text: "#334155",
        },
      },
    },
  },
  {
    id: "educational-workshop",
    title: "Educational Workshop",
    category: "Education", // Explicit category field
    description: "Interactive learning experiences for skill development",
    icon: GraduationCap,
    iconColor: "text-amber-600",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop",
    template: {
      title: "Educational Workshop",
      description: "Hands-on learning to master new skills",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Master New Skills in Just 3 Days",
            subheading: "Intensive workshops led by industry experts",
            image:
              "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200",
            cta: {
              text: "Reserve Your Spot",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "About This Workshop",
            body: "Join us for an immersive 3-day workshop designed to take your skills from basic to professional level. Through hands-on exercises, real-world projects, and personalized feedback, you'll gain practical expertise you can immediately apply.\n\nWith small class sizes (maximum 15 participants), you'll receive individualized attention and guidance throughout the learning process.",
            image:
              "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800",
            alignment: "right",
          },
        },
        {
          id: "3",
          type: "features",
          content: {
            heading: "What You'll Learn",
            items: [
              {
                title: "Fundamental Concepts",
                description: "Master the core principles and foundations",
                icon: "Layers",
              },
              {
                title: "Practical Techniques",
                description: "Hands-on application of advanced methods",
                icon: "Tool",
              },
              {
                title: "Industry Standards",
                description: "Current best practices and workflows",
                icon: "Award",
              },
            ],
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Your Instructor",
            body: "This workshop is led by [Instructor Name], a recognized expert with over 15 years of experience in the field. Having worked with leading organizations including [Notable Companies], they bring real-world insights and practical knowledge to the classroom.\n\n\"My teaching philosophy centers on active learning and practical application. You won't just learn concepts—you'll apply them and leave with portfolio-worthy projects.\"",
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800",
            alignment: "left",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Join Our Workshop",
            companyName: "SkillForge Academy",
            tagline: "Transform your potential into expertise",
            links: [
              { label: "Workshops", url: "#" },
              { label: "Schedule", url: "#" },
              { label: "Instructors", url: "#" },
              { label: "FAQ", url: "#" },
            ],
            socialLinks: [
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "LinkedIn", url: "#", icon: "Linkedin" },
              { platform: "Twitter", url: "#", icon: "Twitter" },
            ],
            copyright: `© ${new Date().getFullYear()} SkillForge Academy. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "academic",
        fontFamily: "Nunito",
        colors: {
          primary: "#f59e0b",
          background: "#ffffff",
          text: "#334155",
        },
      },
    },
  },
  {
    id: "construction-company",
    title: "Construction Company",
    category: "Construction", // Explicit category field
    description: "Building and renovation services with expertise",
    icon: HardHat,
    iconColor: "text-yellow-600",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&auto=format&fit=crop",
    template: {
      title: "Construction Company",
      description: "Quality building and renovation services",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Building Your Vision",
            subheading: "From concept to completion with excellence",
            image:
              "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1200",
            cta: {
              text: "Get a Quote",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "Our Services",
            items: [
              {
                title: "New Construction",
                description: "Custom homes and commercial buildings",
                icon: "Building",
              },
              {
                title: "Renovations",
                description: "Transforming existing spaces",
                icon: "Tool",
              },
              {
                title: "Design-Build",
                description: "Integrated design and construction services",
                icon: "PenTool",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "Why Choose Us",
            body: "With over 25 years of experience, our licensed team delivers exceptional craftsmanship on every project. We pride ourselves on transparency, quality materials, and attention to detail.\n\n- Licensed and fully insured professionals\n- On-time and on-budget completion\n- Industry-leading 5-year workmanship warranty\n- Sustainable building practices",
            image:
              "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
            alignment: "right",
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Recent Projects",
            body: "**Modern Family Home - Riverdale**\nA 3,200 sq ft custom home featuring energy-efficient design, smart home technology, and open-concept living spaces.\n\n**Commercial Renovation - Downtown**\nComplete transformation of a 1920s building into contemporary office space while preserving historical architectural elements.",
            image:
              "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800",
            alignment: "left",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Start Your Project",
            companyName: "Precision Builders",
            tagline: "Constructing quality since 1998",
            links: [
              { label: "Home", url: "#" },
              { label: "Services", url: "#" },
              { label: "Projects", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "Facebook", url: "#", icon: "Facebook" },
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "Houzz", url: "#", icon: "Home" },
            ],
            copyright: `© ${new Date().getFullYear()} Precision Builders. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "industrial",
        fontFamily: "Roboto",
        colors: {
          primary: "#ca8a04",
          background: "#ffffff",
          text: "#334155",
        },
      },
    },
  },
  {
    id: "financial-services",
    title: "Financial Services",
    category: "Finance", // Explicit category field
    description: "Expert financial planning and wealth management",
    icon: DollarSign,
    iconColor: "text-emerald-700",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop",
    template: {
      title: "Financial Services",
      description: "Secure your financial future with expert guidance",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Your Financial Future, Planned",
            subheading:
              "Personalized strategies for wealth building and protection",
            image:
              "https://images.unsplash.com/photo-1579621970590-9d624316904b?w=1200",
            cta: {
              text: "Schedule Consultation",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "Our Expertise",
            items: [
              {
                title: "Retirement Planning",
                description: "Securing your future financial independence",
                icon: "CalendarClock",
              },
              {
                title: "Investment Management",
                description: "Strategic portfolio construction and oversight",
                icon: "TrendingUp",
              },
              {
                title: "Tax Optimization",
                description: "Minimizing tax burden through strategic planning",
                icon: "FileText",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "Our Approach",
            body: "We believe financial planning should be comprehensive, transparent, and aligned with your personal values. Our fiduciary advisors take the time to understand your unique goals, risk tolerance, and time horizon before developing customized strategies.\n\nUsing advanced planning tools and decades of combined experience, we create roadmaps that adapt to changing market conditions and life circumstances.",
            image:
              "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800",
            alignment: "left",
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Client Success Stories",
            body: '"Their comprehensive approach to retirement planning gave us confidence that we\'re on track for the future we envision." - Robert & Susan M.\n\n"As a business owner, their integrated tax and investment strategies have saved me thousands while growing my wealth." - David L.',
            image:
              "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800",
            alignment: "right",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Take Control of Your Financial Future",
            companyName: "Meridian Financial Partners",
            tagline: "Guidance you can trust, strategies that work",
            links: [
              { label: "Services", url: "#" },
              { label: "Our Team", url: "#" },
              { label: "Resources", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "LinkedIn", url: "#", icon: "Linkedin" },
              { platform: "Twitter", url: "#", icon: "Twitter" },
              { platform: "Facebook", url: "#", icon: "Facebook" },
            ],
            copyright: `© ${new Date().getFullYear()} Meridian Financial Partners. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "professional",
        fontFamily: "Source Sans Pro",
        colors: {
          primary: "#047857",
          background: "#ffffff",
          text: "#1f2937",
        },
      },
    },
  },
  {
    id: "gaming-community",
    title: "Gaming Community",
    category: "Community", // Explicit category field
    description: "Connect with fellow gamers and gaming events",
    icon: Gamepad2,
    iconColor: "text-purple-500",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop",
    template: {
      title: "Gaming Community",
      description: "Join our thriving community of passionate gamers",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Level Up Your Gaming Experience",
            subheading: "Connect, compete, and celebrate with fellow gamers",
            image:
              "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200",
            cta: {
              text: "Join Community",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "Community Features",
            items: [
              {
                title: "Weekly Tournaments",
                description: "Compete for prizes and glory",
                icon: "Trophy",
              },
              {
                title: "Team Formation",
                description: "Find teammates who match your style",
                icon: "Users",
              },
              {
                title: "Coaching Sessions",
                description: "Improve your skills with pro guidance",
                icon: "GraduationCap",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "Upcoming Events",
            body: "**Summer Championship Series**\nOur flagship tournament featuring multiple game categories and $5,000 in prizes. Qualifiers start next month!\n\n**Developer Meet & Greet**\nExclusive opportunity to chat with the creators behind the upcoming release of [Game Title].\n\n**Charity Stream Marathon**\n24-hour community stream supporting Games for Good Foundation.",
            image:
              "https://images.unsplash.com/photo-1551431009-a802eeec77b1?w=800",
            alignment: "right",
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Community Values",
            body: "We believe gaming is for everyone. Our community promotes:\n\n- Sportsmanship and positive competition\n- Inclusivity across all skill levels and backgrounds\n- Knowledge sharing and mutual improvement\n- Creating lasting friendships beyond the game\n\nAll members agree to our code of conduct ensuring a welcoming environment for players from all walks of life.",
            image:
              "https://images.unsplash.com/photo-1523843268911-45a882919fec?w=800",
            alignment: "left",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Ready to Join?",
            companyName: "Nexus Gaming Community",
            tagline: "Where passion meets play",
            links: [
              { label: "Home", url: "#" },
              { label: "Events", url: "#" },
              { label: "Forums", url: "#" },
              { label: "Discord", url: "#" },
            ],
            socialLinks: [
              { platform: "Twitch", url: "#", icon: "Tv" },
              { platform: "YouTube", url: "#", icon: "Youtube" },
              { platform: "Twitter", url: "#", icon: "Twitter" },
              { platform: "Discord", url: "#", icon: "MessageSquare" },
            ],
            copyright: `© ${new Date().getFullYear()} Nexus Gaming Community. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "dark",
        fontFamily: "Inter",
        colors: {
          primary: "#a855f7",
          background: "#0f172a",
          text: "#e2e8f0",
        },
      },
    },
  },
  {
    id: "spiritual-center",
    title: "Spiritual Center",
    category: "Community", // Explicit category field
    description: "Find peace, community, and spiritual growth",
    icon: Wind,
    iconColor: "text-amber-400",
    image:
      "https://images.unsplash.com/photo-1489659639091-8b687bc4386e?w=800&auto=format&fit=crop",
    template: {
      title: "Spiritual Center",
      description: "A welcoming community for spiritual exploration",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Find Your Path",
            subheading: "A sanctuary for spiritual growth and community",
            image:
              "https://images.unsplash.com/photo-1489659639091-8b687bc4386e?w=1200",
            cta: {
              text: "Join Us",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "Our Community",
            body: "Welcome to a place where all spiritual seekers are embraced. Our center provides a supportive environment for exploring spiritual practices, fostering personal growth, and building meaningful connections.\n\nFounded on principles of compassion, respect, and inclusivity, we welcome people of all backgrounds and beliefs who seek deeper meaning and purpose.",
            image:
              "https://images.unsplash.com/photo-1504697570352-57d5b066f2c3?w=800",
            alignment: "right",
          },
        },
        {
          id: "3",
          type: "features",
          content: {
            heading: "Weekly Offerings",
            items: [
              {
                title: "Meditation",
                description: "Guided sessions for inner peace",
                icon: "Heart",
              },
              {
                title: "Study Groups",
                description: "Explore spiritual texts and teachings",
                icon: "BookOpen",
              },
              {
                title: "Community Service",
                description: "Putting compassion into action",
                icon: "Helping hand",
              },
            ],
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Upcoming Events",
            body: '**Summer Retreat: Finding Inner Balance**\nA weekend of meditation, reflection, and connection in a beautiful natural setting. Early registration now open.\n\n**Monthly Potluck & Discussion**\nJoin us for a community meal followed by an engaging conversation on "Finding Purpose in Modern Life."\n\n**Weekly Meditation Circle**\nEvery Wednesday evening, open to practitioners of all levels.',
            image:
              "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800",
            alignment: "left",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Connect With Us",
            companyName: "Harmony Spiritual Center",
            tagline: "Walking the path together",
            links: [
              { label: "About", url: "#" },
              { label: "Calendar", url: "#" },
              { label: "Resources", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "Facebook", url: "#", icon: "Facebook" },
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "YouTube", url: "#", icon: "Youtube" },
            ],
            copyright: `© ${new Date().getFullYear()} Harmony Spiritual Center. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "serene",
        fontFamily: "Cormorant Garamond",
        colors: {
          primary: "#fbbf24",
          background: "#fffbeb",
          text: "#44403c",
        },
      },
    },
  },
  {
    id: "eco-friendly-products",
    title: "Eco-Friendly Products",
    category: "Shop", // Explicit category field
    description: "Sustainable solutions for conscious consumers",
    icon: Leaf,
    iconColor: "text-green-500",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop",
    template: {
      title: "Eco-Friendly Products",
      description: "Sustainable alternatives for everyday living",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Live Sustainably",
            subheading: "Beautiful, ethical products for a healthier planet",
            image:
              "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200",
            cta: {
              text: "Shop Collection",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "features",
          content: {
            heading: "Our Commitment",
            items: [
              {
                title: "Plastic-Free",
                description: "Zero plastic in products and packaging",
                icon: "Recycle",
              },
              {
                title: "Ethically Sourced",
                description: "Fair wages and safe working conditions",
                icon: "Heart",
              },
              {
                title: "Carbon Neutral",
                description: "Offsetting our environmental footprint",
                icon: "Leaf",
              },
            ],
          },
        },
        {
          id: "3",
          type: "content",
          content: {
            heading: "Our Products",
            body: "Discover our range of sustainable alternatives to everyday items. From kitchen essentials and personal care products to home décor and gifts, each item is carefully designed with both functionality and environmental impact in mind.\n\nEvery purchase contributes to our mission of reducing waste and promoting sustainable consumption patterns worldwide.",
            image:
              "https://images.unsplash.com/photo-1584473457409-ce95a89c0fff?w=800",
            alignment: "left",
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Impact",
            body: "Since our founding in 2018, our community of customers has helped:\n\n- Prevent over 1.2 million plastic items from entering landfills\n- Plant 50,000 trees through our reforestation partners\n- Support 12 women-led cooperatives in developing regions\n\nEvery purchase creates positive change for our planet and communities.",
            image:
              "https://images.unsplash.com/photo-1550853024-fae8cd4be47f?w=800",
            alignment: "right",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Join Our Mission",
            companyName: "EcoEssentials",
            tagline: "Small changes, big impact",
            links: [
              { label: "Shop", url: "#" },
              { label: "Our Story", url: "#" },
              { label: "Impact", url: "#" },
              { label: "Blog", url: "#" },
            ],
            socialLinks: [
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "Pinterest", url: "#", icon: "Pinterest" },
              { platform: "Facebook", url: "#", icon: "Facebook" },
            ],
            copyright: `© ${new Date().getFullYear()} EcoEssentials. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "organic",
        fontFamily: "Poppins",
        colors: {
          primary: "#22c55e",
          background: "#f0fdf4",
          text: "#365314",
        },
      },
    },
  },
  {
    id: "documentary-film",
    title: "Documentary Film",
    category: "Film", // Explicit category field
    description: "Promote your film and engage with audiences",
    icon: Film,
    iconColor: "text-red-600",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop",
    template: {
      title: "Documentary Film",
      description: "A powerful story that needs to be told",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "THE WATERSHED",
            subheading: "A journey into the heart of environmental activism",
            image:
              "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200",
            cta: {
              text: "Watch Trailer",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "About the Film",
            body: "THE WATERSHED follows the remarkable story of grassroots activists fighting to protect critical water resources against overwhelming odds. Shot over three years across five countries, this feature-length documentary captures the passion, struggles, and triumphs of ordinary people making extraordinary change.\n\nDirected by award-winning filmmaker Sarah Chen, the film has been officially selected for multiple international film festivals.",
            image:
              "https://images.unsplash.com/photo-1500240868405-5bbe769b402d?w=800",
            alignment: "right",
          },
        },
        {
          id: "3",
          type: "features",
          content: {
            heading: "Film Recognition",
            items: [
              {
                title: "Best Documentary",
                description: "International Environmental Film Festival",
                icon: "Award",
              },
              {
                title: "Audience Choice",
                description: "Portland Independent Film Festival",
                icon: "Star",
              },
              {
                title: "Official Selection",
                description: "Sundance Film Festival 2025",
                icon: "Film",
              },
            ],
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Screenings & Events",
            body: "**New York Premiere**\nLincoln Center, March 15, 2025 at 7:00 PM\nFollowed by Q&A with director and featured activists\n\n**Los Angeles Screening**\nLandmark Theatre, April 2, 2025 at 6:30 PM\n\n**Virtual Screening**\nAvailable worldwide April 10-17, 2025\nTickets include access to exclusive behind-the-scenes content",
            image:
              "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800",
            alignment: "left",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Join the Conversation",
            companyName: "Meridian Films Presents",
            tagline: "THE WATERSHED",
            links: [
              { label: "Home", url: "#" },
              { label: "About", url: "#" },
              { label: "Screenings", url: "#" },
              { label: "Impact", url: "#" },
            ],
            socialLinks: [
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "Twitter", url: "#", icon: "Twitter" },
              { platform: "Facebook", url: "#", icon: "Facebook" },
              { platform: "YouTube", url: "#", icon: "Youtube" },
            ],
            copyright: `© ${new Date().getFullYear()} Meridian Films. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "cinematic",
        fontFamily: "Montserrat",
        colors: {
          primary: "#dc2626",
          background: "#0f172a",
          text: "#f8fafc",
        },
      },
    },
  },
  {
    id: "sports-team",
    title: "Sports Team",
    category: "Sports", // Explicit category field
    description: "Connect fans with team news and events",
    icon: Trophy,
    iconColor: "text-blue-500",
    image:
      "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800&auto=format&fit=crop",
    template: {
      title: "Sports Team",
      description: "Follow your favorite team's journey to victory",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "Metro City Titans",
            subheading: "Championship contenders for the 2025 season",
            image:
              "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=1200",
            cta: {
              text: "Get Tickets",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "Upcoming Games",
            body: "**Home vs. Riverside Raptors**\nSaturday, June 14, 2025 - 7:00 PM\nMetro Arena\n\n**Away vs. Eastside Eagles**\nTuesday, June 24, 2025 - 8:00 PM\nEagle Stadium\n\n**Home vs. Northern Knights**\nSunday, July 5, 2025 - 3:30 PM\nMetro Arena",
            image:
              "https://images.unsplash.com/photo-1518640467658-969464a9c8c5?w=800",
            alignment: "left",
          },
        },
        {
          id: "3",
          type: "features",
          content: {
            heading: "Team Highlights",
            items: [
              {
                title: "League Champions",
                description: "Back-to-back titles in 2023 & 2024",
                icon: "Trophy",
              },
              {
                title: "Star Players",
                description: "Home to 3 national team athletes",
                icon: "Star",
              },
              {
                title: "Community Leaders",
                description: "Youth programs reaching 5,000+ kids annually",
                icon: "Heart",
              },
            ],
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Fan Experience",
            body: "Join the most passionate fans in the league at Metro Arena. Every home game features:\n\n- Pre-game fan zone with player appearances\n- Family-friendly concessions with local food vendors\n- Exclusive merchandise and memorabilia\n- Post-game autograph sessions on select dates\n\nBecome a season ticket holder for premium benefits including VIP parking, special events, and priority playoff tickets.",
            image:
              "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800",
            alignment: "right",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Join Titan Nation",
            companyName: "Metro City Titans",
            tagline: "United in victory",
            links: [
              { label: "Schedule", url: "#" },
              { label: "Tickets", url: "#" },
              { label: "Team Roster", url: "#" },
              { label: "Fan Club", url: "#" },
            ],
            socialLinks: [
              { platform: "Twitter", url: "#", icon: "Twitter" },
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "Facebook", url: "#", icon: "Facebook" },
              { platform: "YouTube", url: "#", icon: "Youtube" },
            ],
            copyright: `© ${new Date().getFullYear()} Metro City Titans. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "energetic",
        fontFamily: "Montserrat",
        colors: {
          primary: "#2563eb",
          background: "#ffffff",
          text: "#0f172a",
        },
      },
    },
  },
  {
    id: "author-website",
    title: "Author Website",
    category: "Personal", // Explicit category field
    description: "Showcase books and connect with readers",
    icon: BookOpen,
    iconColor: "text-amber-700",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop",
    template: {
      title: "Author Website",
      description: "Explore my books and writing journey",
      sections: [
        {
          id: "1",
          type: "hero",
          content: {
            heading: "J.A. WINTERS",
            subheading:
              "New York Times bestselling author of mystery and suspense",
            image:
              "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200",
            cta: {
              text: "Latest Release",
              url: "#",
            },
          },
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "About the Author",
            body: "J.A. Winters is the author of twelve novels, including the internationally acclaimed Detective Morgan series. With works translated into 28 languages and over five million copies sold worldwide, Winters has established a reputation for intricately plotted mysteries with compelling characters and unexpected twists.\n\nBefore becoming a novelist, Winters worked as a criminal defense attorney, bringing authentic legal and forensic details to each story.",
            image:
              "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=800",
            alignment: "right",
          },
        },
        {
          id: "3",
          type: "features",
          content: {
            heading: "Featured Books",
            items: [
              {
                title: "Silent Witness",
                description: "The latest Detective Morgan thriller",
                icon: "BookOpen",
              },
              {
                title: "Midnight Confession",
                description: "Winner of the Golden Quill Award",
                icon: "Award",
              },
              {
                title: "The Jury's Secret",
                description: "The New York Times bestseller for 24 weeks",
                icon: "Star",
              },
            ],
          },
        },
        {
          id: "4",
          type: "content",
          content: {
            heading: "Upcoming Events",
            body: '**Book Signing - Chicago**\nBarnes & Noble Downtown, June 18, 2025 at 6:30 PM\n\n**Literary Festival Panel**\nPacific Northwest Book Festival, July 8-10, 2025\nPanel: "Crafting the Perfect Mystery" - July 9, 2:00 PM\n\n**Virtual Book Club**\nLive discussion of "Silent Witness" - August 5, 2025, 7:00 PM EST\nRegistration required through website',
            image:
              "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800",
            alignment: "left",
          },
        },
        {
          id: "5",
          type: "footer",
          content: {
            heading: "Connect With Me",
            companyName: "J.A. Winters",
            tagline: "Stories that keep you guessing until the last page",
            links: [
              { label: "Books", url: "#" },
              { label: "Events", url: "#" },
              { label: "Blog", url: "#" },
              { label: "Contact", url: "#" },
            ],
            socialLinks: [
              { platform: "Goodreads", url: "#", icon: "BookOpen" },
              { platform: "Instagram", url: "#", icon: "Instagram" },
              { platform: "Facebook", url: "#", icon: "Facebook" },
              { platform: "Twitter", url: "#", icon: "Twitter" },
            ],
            copyright: `© ${new Date().getFullYear()} J.A. Winters. All rights reserved.`,
          },
        },
      ],
      styles: {
        theme: "literary",
        fontFamily: "Libre Baskerville",
        colors: {
          primary: "#b45309",
          background: "#fffbeb",
          text: "#292524",
        },
      },
    },
  },
];
