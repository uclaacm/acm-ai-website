import Image from 'next/image';
import React from 'react';
import styles from '../styles/MemCard.module.scss';

interface CardInterface {
  imageURL: string;
  name: string;
  position: string;
}

function MemCard({ imageURL, name, position }: CardInterface) {
  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <Image src={imageURL} alt="PFP" width={35} height={35} />
      </div>
      <div className={styles.text}>
        <div className={styles.topline}>
          {name} |&nbsp;
          <Image
            src="/github-mark.png"
            alt="Github icon"
            width={20}
            height={20}
          />
        </div>
        <div style={{ fontSize: '12px', color: '#39ff14' }}>{position}</div>
      </div>
    </div>
  );
}

export default MemCard;
