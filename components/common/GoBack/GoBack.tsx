'use client';
import { useRouter } from 'next/navigation';
import styles from './GoBack.module.scss';

export interface GoBackProps {
  onClick?: () => void;
}

export default function GoBack({ onClick }: GoBackProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <button className={styles.button} onClick={handleClick}>
      <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.342.886L2.114 5.114l4.228 4.228"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          fillRule="evenodd"
        />
      </svg>
      <span>Go back</span>
    </button>
  );
}

