import { Navigate, Route, Routes } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Footer, Header, ScrollToTop } from "./components/Layout";
import Home from "./pages/Home";
import Results from "./pages/Results";
import Listing from "./pages/Listing";
import Sell from "./pages/Sell";
import { Region, Regions } from "./pages/Regions";
import { Agent, Agents } from "./pages/Agents";
import Contact from "./pages/Contact";
import About from "./pages/About";
import { Blog, Post } from "./pages/Blog";
import Mortgage from "./pages/Mortgage";
import { Brand, Guides, Saved } from "./pages/Misc";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <AppProvider>
      <ScrollToTop />
      <div className="orbs" aria-hidden="true"><i /><i /><i /><i /></div>
      <Header />
      <main id="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<Results key="buy" kind="buy" />} />
          <Route path="/rent" element={<Results key="rent" kind="rent" />} />
          <Route path="/new-homes" element={<Results key="new-homes" kind="new-homes" />} />
          <Route path="/listing/:id" element={<Listing />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/regions" element={<Regions />} />
          <Route path="/region/:key" element={<Region />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agent/:slug" element={<Agent />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Post />} />
          <Route path="/mortgage" element={<Mortgage />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/brand" element={<Brand />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </AppProvider>
  );
}
