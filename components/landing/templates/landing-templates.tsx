import { Layout, Calendar, ShoppingCart, Rocket, Newspaper, Gift } from "lucide-react";

export const landingTemplates = [
  {
    id: "product-launch",
    title: "Product Launch",
    description: "Perfect for launching your new product",
    icon: Rocket,
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
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
            cta: {
              text: "Get Early Access",
              url: "#"
            }
          }
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
                icon: "Zap"
              },
              {
                title: "Feature 2",
                description: "Description of feature 2",
                icon: "Shield"
              },
              {
                title: "Feature 3",
                description: "Description of feature 3",
                icon: "Star"
              }
            ]
          }
        }
      ],
      styles: {
        theme: "modern",
        fontFamily: "Inter",
        colors: {
          primary: "#7c3aed",
          background: "#ffffff",
          text: "#1f2937"
        }
      }
    }
  },
  {
    id: "event",
    title: "Event Landing",
    description: "Promote your upcoming event",
    icon: Calendar,
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
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200",
            cta: {
              text: "Register Now",
              url: "#"
            }
          }
        },
        {
          id: "2",
          type: "content",
          content: {
            heading: "About the Event",
            body: "Join us for an incredible day of learning and networking...",
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
            alignment: "right"
          }
        }
      ],
      styles: {
        theme: "elegant",
        fontFamily: "Montserrat",
        colors: {
          primary: "#2563eb",
          background: "#ffffff",
          text: "#1f2937"
        }
      }
    }
  },
  {
    id: "sales",
    title: "Sales Page",
    description: "Convert visitors into customers",
    icon: ShoppingCart,
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
            image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200",
            cta: {
              text: "Buy Now",
              url: "#"
            }
          }
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
                icon: "Star"
              },
              {
                title: "24/7 Support",
                description: "Round the clock customer support",
                icon: "Shield"
              }
            ]
          }
        }
      ],
      styles: {
        theme: "bold",
        fontFamily: "Poppins",
        colors: {
          primary: "#ef4444",
          background: "#ffffff",
          text: "#1f2937"
        }
      }
    }
  }
];