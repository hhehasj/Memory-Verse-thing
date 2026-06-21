const api_token: string = "ntrH8oT1SoHTm6VcKtrQM5qKJ4O1sbEE6lHdSBO9G5OuZW2E";

export async function get_passage(translation: number, book: string, chapter: string, verse: string) {
  const options = {
    method: "GET",
    headers: {
      "X-YVP-App-Key": api_token,
    },
  };

  const passage_path: string = `${book}.${chapter}.${verse}`.trim();
  console.log(translation, typeof translation);
  console.log(passage_path, typeof passage_path);

  fetch(`https://api.youversion.com/v1/bibles/${translation}/passages/${passage_path}`, options)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
}
