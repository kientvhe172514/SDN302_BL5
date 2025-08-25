import { Logo } from "./Logo";
import { Navigation } from "./Navigation";

export const Header = () => {
  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Logo />
        <Navigation />
      </div>
    </header>
  );
};
