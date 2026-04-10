export const fetchFragrances = async () => {
  const response = await fetch("/api/fragrances");
  if (!response.ok) throw new Error("Failed to fetch fragrances");
  return response.json();
};
