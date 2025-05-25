import FetchShows from "./components/FetchShows";

const showList = [
  { title: "Top rated", page: 1, offset: 0, limit: 20 },
  { title: "Popular on Nextflix", page: 1, offset: 20, limit: 20 },
  { title: "Trending now", page: 2, offset: 0, limit: 20 },
  { title: "Top picks for you", page: 2, offset: 20, limit: 20 },
  { title: "Popular in US", page: 3, offset: 0, limit: 20 },
];

export default async function Home() {
  return (
    <div>
      {showList.map((config) => (
        <FetchShows key={config.title} {...config} />
      ))}
    </div>
  );
}
