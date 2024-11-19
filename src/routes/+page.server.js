export async function load() {
    try {
      const res = await fetch("https://api.spacexdata.com/v3/landpads");
      if (!res.ok) {
        throw new Error("Failed to fetch landpads data");
      }
      const landpads = await res.json();
      return { landpads };
    } catch (error) {
      console.error("Error fetching landpads:", error);
      return { landpads: [] };
    }
  }
  