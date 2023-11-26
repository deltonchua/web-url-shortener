import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Result } from './types';

type Props = {
  result?: Result;
  setResult: Dispatch<SetStateAction<Result | undefined>>;
  setShowResults: Dispatch<SetStateAction<boolean>>;
};

export default function History({ result, setResult, setShowResults }: Props) {
  const [results, setResults] = useState<Array<Result>>([]);
  useEffect(() => {
    const storage = JSON.parse(
      localStorage.getItem('results') || '[]'
    ) as Array<Result>;
    storage.reverse();
    setResults(storage);
  }, [result]);
  return (
    <div className='space-y-3'>
      {results.map(({ urlShort, urlLong, timestamp }) => (
        <button
          key={urlShort}
          title={urlShort}
          className='btn btn-light w-full text-left'
          onClick={() => {
            setResult({
              urlShort,
              urlLong,
              timestamp,
            });
            setShowResults(false);
          }}
        >
          <h4 className='font-medium line-clamp-1'>{urlShort}</h4>
          <p className='line-clamp-1 text-sm text-zinc-500'>{urlLong}</p>
          {timestamp && (
            <span className='text-sm text-zinc-500'>
              {new Date(timestamp).toLocaleTimeString()}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
