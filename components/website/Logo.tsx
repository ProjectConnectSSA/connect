interface LogoProps {
  className?: string;
}

const Logo = ({ className = "w-6 h-6" }: LogoProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19.5,8.4L15.6,6l-3.9,2.4L7.8,6L4,8.4l3.9,2.4L4,13.2l3.9,2.4l3.9-2.4l3.9,2.4l3.9-2.4l-3.9-2.4L19.5,8.4z M11.7,13.2 L7.8,15.6l-3.9-2.4l3.9-2.4l3.9,2.4z M11.7,8.4L7.8,10.8L4,8.4l3.9-2.4L11.7,8.4z M15.6,15.6l-3.9-2.4l3.9-2.4l3.9,2.4L15.6,15.6z"/>
    </svg>
  );
};

export default Logo;