import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Result } from './types';
import IconArrowRight from './assets/IconArrowRight';
import IconQR from './assets/IconQR';
import QRCode from 'react-qr-code';
import IconCopy from './assets/IconCopy';
import { ID_SIZE, SERVER_URL } from './constants';
import IconEye from './assets/IconEye';
import { copyToClipboard } from './utils';

type Props = {
  result?: Result;
  setResult: Dispatch<SetStateAction<Result | undefined>>;
};

export default function ResultBody({ result, setResult }: Props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!result || !result.urlShort) {
      return;
    }
    const id = result.urlShort.split('/').at(-1);
    if (!id || id.length !== ID_SIZE) {
      return;
    }
    try {
      fetch(`${SERVER_URL}/count/${id}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.count) {
            setCount(res.count);
          }
        });
    } catch (err) {}
  }, [result]);
  if (!result) {
    return null;
  }
  return (
    <section className='col-center'>
      <div>
        <span className='ml-2 font-medium'>Long URL</span>
        <div className='bg-white p-3 rounded-xl'>{result.urlLong}</div>
      </div>
      <div>
        <span className='ml-2 font-medium'>Short URL</span>
        <div className='bg-white p-3 rounded-xl'>{result.urlShort}</div>
      </div>
      <div className='flex items-center gap-3 flex-wrap'>
        <a
          href={result.urlShort}
          target='_blank'
          rel='noopener noreferrer'
          title='Go'
          className='btn btn-light btn-icon'
        >
          <IconArrowRight />
          <span>Go</span>
        </a>
        <button className='btn btn-light btn-icon group relative' title='QR'>
          <IconQR />
          <span>QR</span>
          <div className='hidden group-focus-within:block absolute top-[calc(100%+0.25rem)] left-0 z-10 bg-white p-3 rounded-xl'>
            <QRCode value={result.urlShort} size={120} />
          </div>
        </button>
        <button
          className='btn btn-light btn-icon'
          title='Copy'
          onClick={async () => {
            await copyToClipboard(result.urlShort);
            alert('Copied to clipboard!');
          }}
        >
          <IconCopy />
          <span>Copy</span>
        </button>
        {count > 0 && (
          <button
            className='btn btn-light btn-icon group relative'
            title='Views'
          >
            <IconEye />
            <span>Views</span>
            <div className='hidden group-focus-within:block absolute top-[calc(100%+0.25rem)] left-0 min-w-full z-10 bg-white px-3 py-2 rounded-xl'>
              <pre>{count.toLocaleString()}</pre>
            </div>
          </button>
        )}
      </div>
      <button
        className='btn btn-dark'
        title='Shorten another'
        onClick={() => {
          setResult(undefined);
        }}
      >
        Shorten another
      </button>
    </section>
  );
}
