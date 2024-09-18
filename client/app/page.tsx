import RestaurantListingPage from "@/components/RestaurantListingPage";
import HeroSection from "@/components/HeroSection";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <HeroSection />
        <RestaurantListingPage />
      </main>
    </div>
  );
};

export default Home;
