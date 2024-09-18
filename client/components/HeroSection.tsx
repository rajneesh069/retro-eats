export default function HeroSection() {
  return (
    <div className="relative h-screen w-full bg-gray-900">
      {/* Video Background */}
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/a.mp4"
          autoPlay
          muted
          loop
          aria-hidden="true"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-70"></div>
      </div>

      {/* Hero Content */}
    </div>
  );
}
