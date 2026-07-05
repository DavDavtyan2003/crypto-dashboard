export async function getNews(symbol) {
  const response = await fetch(`http://localhost:3001/api/news/${symbol}`);

  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }

  const data = await response.json();
  return data.news;
}