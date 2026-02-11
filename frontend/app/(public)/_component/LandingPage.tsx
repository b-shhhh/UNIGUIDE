"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type University = {
  id: string;
  name: string;
  country: string;
  course: string;
  ranking: string;
  tuition: string;
  mode: "Online" | "Offline";
  location: string;
  logo: string;
  detailsUrl: string;
};

const universities: University[] = [
  {
    id: "u-1",
    name: "University of Melbourne",
    country: "Australia",
    course: "Data Science",
    ranking: "Top 20",
    tuition: "$39,000/year",
    mode: "Offline",
    location: "Melbourne",
    logo: "/images/globe.svg",
    detailsUrl: "https://www.unimelb.edu.au",
  },
  {
    id: "u-2",
    name: "Technical University of Munich",
    country: "Germany",
    course: "Computer Science",
    ranking: "Top 40",
    tuition: "$8,000/year",
    mode: "Offline",
    location: "Munich",
    logo: "/images/file.svg",
    detailsUrl: "https://www.tum.de",
  },
  {
    id: "u-3",
    name: "University of Toronto",
    country: "Canada",
    course: "Software Engineering",
    ranking: "Top 30",
    tuition: "$52,000/year",
    mode: "Offline",
    location: "Toronto",
    logo: "/images/window.svg",
    detailsUrl: "https://www.utoronto.ca",
  },
  {
    id: "u-4",
    name: "Open University",
    country: "UK",
    course: "Business Analytics",
    ranking: "Top 100",
    tuition: "$12,000/year",
    mode: "Online",
    location: "Milton Keynes",
    logo: "/images/next.svg",
    detailsUrl: "https://www.open.ac.uk",
  },
  {
    id: "u-5",
    name: "University of Amsterdam",
    country: "Netherlands",
    course: "Artificial Intelligence",
    ranking: "Top 60",
    tuition: "$18,000/year",
    mode: "Offline",
    location: "Amsterdam",
    logo: "/images/globe.svg",
    detailsUrl: "https://www.uva.nl",
  },
  {
    id: "u-6",
    name: "Arizona State University",
    country: "USA",
    course: "Cyber Security",
    ranking: "Top 150",
    tuition: "$27,000/year",
    mode: "Online",
    location: "Tempe",
    logo: "/images/file.svg",
    detailsUrl: "https://www.asu.edu",
  },
  {
    id: "u-7",
    name: "National University of Singapore",
    country: "Singapore",
    course: "Machine Learning",
    ranking: "Top 15",
    tuition: "$21,000/year",
    mode: "Offline",
    location: "Singapore",
    logo: "/images/window.svg",
    detailsUrl: "https://www.nus.edu.sg",
  },
  {
    id: "u-8",
    name: "University College Dublin",
    country: "Ireland",
    course: "Cloud Computing",
    ranking: "Top 200",
    tuition: "$16,000/year",
    mode: "Offline",
    location: "Dublin",
    logo: "/images/next.svg",
    detailsUrl: "https://www.ucd.ie",
  },
];

const rankings = ["All", "Top 20", "Top 30", "Top 40", "Top 60", "Top 100", "Top 150", "Top 200"];
const tuitionBands = ["All", "Below $15,000", "$15,000-$30,000", "Above $30,000"];
const modes = ["All", "Online", "Offline"];

const toNumber = (fee: string) => Number(fee.replace(/[^\d]/g, ""));

const tuitionBand = (fee: string) => {
  const value = toNumber(fee);
  if (value < 15000) return "Below $15,000";
  if (value <= 30000) return "$15,000-$30,000";
  return "Above $30,000";
};

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [country, setCountry] = useState("All");
  const [course, setCourse] = useState("All");
  const [ranking, setRanking] = useState("All");
  const [tuition, setTuition] = useState("All");
  const [mode, setMode] = useState("All");
  const [visible, setVisible] = useState(4);

  const countries = useMemo(() => ["All", ...Array.from(new Set(universities.map((u) => u.country)))], []);
  const courses = useMemo(() => ["All", ...Array.from(new Set(universities.map((u) => u.course)))], []);

  const filtered = useMemo(() => {
    return universities.filter((u) => {
      const matchesSearch = searchValue
        ? `${u.name} ${u.country} ${u.course} ${u.location}`.toLowerCase().includes(searchValue.toLowerCase())
        : true;

      const matchesCountry = country === "All" ? true : u.country === country;
      const matchesCourse = course === "All" ? true : u.course === course;
      const matchesRanking = ranking === "All" ? true : u.ranking === ranking;
      const matchesTuition = tuition === "All" ? true : tuitionBand(u.tuition) === tuition;
      const matchesMode = mode === "All" ? true : u.mode === mode;

      return matchesSearch && matchesCountry && matchesCourse && matchesRanking && matchesTuition && matchesMode;
    });
  }, [searchValue, country, course, ranking, tuition, mode]);

  const shown = filtered.slice(0, visible);
  const canLoadMore = visible < filtered.length;

  return (
    <main className="min-h-screen bg-white text-[#333333]">
      <header className="sticky top-0 z-50 h-[70px] bg-[#4A90E2]">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Image src="/images/globe.svg" alt="UniGuide Logo" width={40} height={40} />
          </div>

          <h1 className="hidden text-[20px] font-bold text-white md:block">AI University Finder</h1>

          <nav className="hidden items-center gap-5 text-sm font-medium text-white md:flex">
            <a href="#home" className="transition hover:text-[#F5A623]">Home</a>
            <a href="#about" className="transition hover:text-[#F5A623]">About</a>
            <a href="#contact" className="transition hover:text-[#F5A623]">Contact</a>
            <Link href="/login" className="transition hover:text-[#F5A623]">Login / Sign Up</Link>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded-lg border border-white/40 px-3 py-2 text-sm font-semibold text-white md:hidden"
          >
            Menu
          </button>
        </div>

        {menuOpen ? (
          <div className="bg-[#4A90E2] px-6 pb-4 md:hidden">
            <div className="flex flex-col gap-3 text-sm font-medium text-white">
              <a href="#home" className="hover:text-[#F5A623]">Home</a>
              <a href="#about" className="hover:text-[#F5A623]">About</a>
              <a href="#contact" className="hover:text-[#F5A623]">Contact</a>
              <Link href="/login" className="hover:text-[#F5A623]">Login / Sign Up</Link>
            </div>
          </div>
        ) : null}
      </header>

      <section
        id="home"
        className="flex min-h-[400px] items-center justify-center bg-[linear-gradient(90deg,#EAF2FF,#FFFFFF)] px-4 py-10"
      >
        <div className="w-full max-w-4xl text-center">
          <h2 className="mb-5 text-3xl font-bold text-[#333333] sm:text-4xl">Find Your Perfect University</h2>
          <div className="mx-auto flex w-full max-w-[620px] flex-col gap-3 sm:flex-row">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search universities by name, course, or country"
              className="h-[50px] w-full rounded-[8px] border border-[#CCCCCC] px-4 text-sm outline-none focus:ring-2 focus:ring-[#4A90E2]/40"
            />
            <button
              type="button"
              onClick={() => {
                setSearchValue(searchInput);
                setVisible(4);
              }}
              className="h-[50px] rounded-[8px] bg-[#4A90E2] px-6 text-sm font-semibold text-white transition hover:bg-[#357ABD]"
            >
              Search
            </button>
          </div>
          <p className="mt-3 text-sm text-[#666666]">Find your ideal university quickly and easily</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-wrap gap-4">
          <FilterSelect label="Country" value={country} setValue={setCountry} options={countries} />
          <FilterSelect label="Course" value={course} setValue={setCourse} options={courses} />
          <FilterSelect label="Ranking" value={ranking} setValue={setRanking} options={rankings} />
          <FilterSelect label="Tuition Fee" value={tuition} setValue={setTuition} options={tuitionBands} />
          <FilterSelect label="Mode" value={mode} setValue={setMode} options={modes} />
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-[#333333]">Recommended Universities</h3>
          <p className="text-sm text-[#666666]">{filtered.length} results</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-4">
          {shown.map((uni) => (
            <article
              key={uni.id}
              className="rounded-[8px] bg-white p-6 shadow-[0_4px_8px_rgba(0,0,0,0.1)] transition hover:-translate-y-1"
            >
              <div className="flex h-20 items-center">
                <Image src={uni.logo} alt={`${uni.name} logo`} width={80} height={80} />
              </div>
              <h4 className="mt-3 text-lg font-bold text-[#333333]">{uni.name}</h4>
              <p className="mt-1 text-sm text-[#666666]">{uni.location}, {uni.country}</p>
              <p className="mt-2 text-sm text-[#333333]"><span className="font-semibold">Course:</span> {uni.course}</p>
              <p className="mt-1 text-sm text-[#333333]"><span className="font-semibold">Tuition:</span> {uni.tuition}</p>
              <p className="mt-1 text-sm text-[#333333]"><span className="font-semibold">Ranking:</span> {uni.ranking}</p>
              <p className="mt-1 text-sm text-[#333333]"><span className="font-semibold">Mode:</span> {uni.mode}</p>

              <a
                href={uni.detailsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-[8px] bg-[#4A90E2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#357ABD]"
              >
                View Details
              </a>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          {canLoadMore ? (
            <button
              type="button"
              onClick={() => setVisible((prev) => prev + 4)}
              className="rounded-[8px] bg-[#4A90E2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#357ABD]"
            >
              Load More
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setVisible(4)}
              className="rounded-[8px] bg-[#4A90E2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#357ABD]"
            >
              Back to Top Results
            </button>
          )}
        </div>
      </section>

      <footer id="contact" className="bg-[#333333] px-6 py-8 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <h5 className="text-base font-bold">About</h5>
            <p className="mt-2 text-sm text-white/80">UniGuide helps students discover suitable universities worldwide.</p>
          </div>
          <div>
            <h5 className="text-base font-bold">Contact</h5>
            <p className="mt-2 text-sm text-white/80">support@uniguide.com</p>
            <p className="text-sm text-white/80">+1 555 892 1123</p>
          </div>
          <div>
            <h5 className="text-base font-bold">Social</h5>
            <div className="mt-2 flex gap-4 text-sm">
              <a href="#" className="hover:text-[#F5A623]">Facebook</a>
              <a href="#" className="hover:text-[#F5A623]">Instagram</a>
              <a href="#" className="hover:text-[#F5A623]">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FilterSelect({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="min-w-[170px] rounded-[8px] bg-white px-4 py-3 shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
      <span className="mb-1 block text-xs font-semibold text-[#666666]">{label}</span>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full bg-transparent text-sm text-[#333333] outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
