import { FormEvent, useState } from 'react';
import { Result } from './types';
import { SERVER_URL } from './constants';
import IconError from './assets/IconError';
import IconLink from './assets/IconLink';
import ResultBody from './ResultBody';
import History from './History';

export default function Home() {
  const [result, setResult] = useState<Result>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) {
      return;
    }
    const inputURL = new FormData(e.currentTarget).get('url');
    const url = typeof inputURL === 'string' ? inputURL.trim() : '';
    if (!url || url.length < 3) {
      setError('Invalid url.');
      return;
    }
    try {
      setError('');
      setLoading(true);
      const res = await fetch(`${SERVER_URL}/url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const { id } = (await res.json()) as { id: string };
      const urlShort = window.location.origin + '/' + id;
      const storage = JSON.parse(
        localStorage.getItem('results') || '[]'
      ) as Array<Result>;
      if (!storage.find((s) => s.urlShort === urlShort)) {
        storage.push({
          urlShort,
          urlLong: url,
          timestamp: Date.now(),
        });
        localStorage.setItem('results', JSON.stringify(storage));
      }
      setResult({
        urlShort,
        urlLong: url,
      });
    } catch (err) {
      setError((err as Error)?.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className='max-w-md mx-auto px-4 py-12 col-center'>
      <h1 className='text-4xl font-bold mt-[10vh] text-center'>
        URL Shortener
      </h1>
      {!result && (
        <form onSubmit={onSubmit} className='col-center'>
          {error && (
            <div className='bg-rose-400 rounded-xl flex items-center gap-2 p-3 text-sm'>
              <IconError />
              <span>{error}</span>
            </div>
          )}
          <label
            htmlFor='url'
            title='Enter URL'
            className='flex items-center gap-3 p-3 bg-white rounded-xl'
          >
            <IconLink />
            <input
              type='url'
              name='url'
              id='url'
              placeholder='Enter URL'
              required
              autoFocus
              disabled={loading}
              className='outline-none bg-transparent flex-1'
            />
          </label>
          <button
            type='submit'
            title='Submit'
            className='btn btn-dark'
            disabled={loading}
          >
            {loading ? 'Processing' : 'Submit'}
          </button>
        </form>
      )}
      {result && <ResultBody result={result} setResult={setResult} />}
      <button
        type='button'
        title='My URLs'
        className='btn btn-light'
        onClick={() => {
          setShowResults((prev) => !prev);
        }}
      >
        My URLs
      </button>
      {showResults && (
        <History
          result={result}
          setResult={setResult}
          setShowResults={setShowResults}
        />
      )}
    </main>
  );
}
