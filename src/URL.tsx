import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ID_SIZE, SERVER_URL } from './constants';

export default function URL() {
  const { id } = useParams();
  useEffect(() => {
    if (typeof id !== 'string' || id.length !== ID_SIZE) {
      return;
    }
    try {
      fetch(`${SERVER_URL}/url/${id}`)
        .then((res) => res.json())
        .then((res) => {
          window.location.href = res.url;
        });
    } catch (err) {}
  }, [id]);

  return <main>Loading...</main>;
}
