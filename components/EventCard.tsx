import Image from 'next/image';
import React from 'react';
import styles from '../styles/EventCard.module.scss';

interface CardInterface {
  header: string;
  body: string;
  time: string;
  img: string;
}
function EventCard({ header, body, time, img }: CardInterface) {
  return (
    <div className={styles.container}>
      <div className={styles.text}>
        <div className={styles.header}>{header}</div>
        <div className={styles.body}>
          <div style={{ flex: '1' }}>{body}</div>
          <Image src={img} width={300} height={300} />
        </div>
        <div className={styles.time}>
          <Image src="/icons8-calendar-24.png" width={20} height={20} />
          <div>&nbsp;{time}</div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
