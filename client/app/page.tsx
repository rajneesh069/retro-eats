import RestaurantListingPage from "@/components/RestaurantListingPage";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <HeroSection />
        <RestaurantListingPage />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
