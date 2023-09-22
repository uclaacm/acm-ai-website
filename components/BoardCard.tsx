import Image from 'next/image';
import React, { useState } from 'react';
import styles from '../styles/BoardCard.module.scss';

interface CardInterface {
  imageURL: string;
  name: string;
  pronouns: string;
  position: string;
  github: string;
  email: string;
}

function BoardCard({
  imageURL,
  name,
  pronouns,
  position,
  github,
  email,
}: CardInterface) {
  const [src, setSrc] = useState(imageURL);
  return (
    <div className={styles.container}>
      <div className={styles.profilepic}>
        <Image
          src={src}
          alt="Profile Picture"
          width={90}
          height={90}
          onError={() => {
            setSrc('/profile.png');
          }}
        />
      </div>
      <div className={styles.text}>
        <div style={{ marginBottom: '-.8em' }}>
          <span className={styles.name}>{name} | </span>
          <span className={styles.pronouns}>{pronouns}</span>
        </div>
        <div>
          <span className={styles.position}>{position}</span>
        </div>
        {github && (
          <div className={styles.contact}>
            <Image
              src="/github-mark.png"
              alt="Github Icon"
              width={21}
              height={21}
            />
            {github}
          </div>
        )}
        {email && (
          <div className={styles.contact}>
            <Image
              src="/icons8-mail-24.png"
              alt="Mail Icon"
              width={20}
              height={20}
            />
            {email}
          </div>
        )}
      </div>
    </div>
  );
}

export default BoardCard;
