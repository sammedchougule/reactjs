import React, { useState, useEffect } from 'react';

function App() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Making API call...");
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("Data fetched:", data); // Log the data fetched
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error); // Log any errors
        setError(error.message);
        setLoading(false);
      });
  }, []);



   if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className=" ">
        <h1 className="mt-10 text-center text-2xl">Cappsule web development test</h1>

        <h1>Posts</h1>
        {data && data.map(post => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </div>
        ))}
     
      </div>
    </>
  )
}

export default App
