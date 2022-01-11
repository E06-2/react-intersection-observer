import { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const URL = `https://api.unsplash.com/photos/?client_id=${API_KEY}&page=${pageNumber}&per_page=10`;

  const pageEnd = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(URL);
        const data = await response.json();

        data.map((item) => (item.id = item.id + new Date()));
        setPhotos((prevPhotos) => {
          return [...prevPhotos, ...data];
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [URL]);

  const loadMore = () => {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };

  useEffect(() => {
    //root is where the observation should take place. If left null or not declared it defaults to the root/body.
    //You may want to only observe within a div or section of your page.

    //rootMargins:  Margin around the root. Can have values similar to the CSS margin property, e.g.
    // "10px 20px 30px 40px" (top, right, bottom, left).
    //The values can be percentages. This set of values serves to grow or shrink each side of the root element's
    //bounding box before computing intersections.
    //Defaults to all zeros.

    //Threshold is at what point would you want the intersection to activate. 0.5 means that when our selected element
    //in our case the footer is 50% visible on screen then activate whatever code we have inside our handler.
    //If we wanted the footer to be 100% visible we would change the threshold to 1.
    const options = { root: null, rootMargins: null, threshold: 0.1 };

    const handleIntersect = (entries) => {
      console.log(entries);
      if (entries[0].isIntersecting) loadMore();
    };

    if (!loading) {
      const observer = new IntersectionObserver(handleIntersect, options);

      observer.observe(pageEnd.current);

      return () => {
        observer.unobserve(pageEnd);
      };
    }
  }, [loading]);

  const photoList = photos.map((photo) => {
    return (
      <section className='photos' key={photo.id}>
        <img src={photo.urls.thumb} alt={photo.urls.alt_description} />
        <p>
          {photo.user.first_name} {photo.user.last_name}
        </p>
      </section>
    );
  });

  return (
    <main>
      {photoList}
      <footer ref={pageEnd}></footer>
    </main>
  );
};

export default App;
