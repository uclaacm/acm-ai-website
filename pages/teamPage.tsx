import { GetStaticProps } from 'next';
import React from 'react';
import BoardCard from '../components/BoardCard';
import MainLayout from '../components/MainLayout';
import getOfficerData from '../getOfficers';
import vars from '../styles/global_variables.module.scss';
import styles from '../styles/Teampage.module.scss';

interface Officer {
  id: number;
  position: string;
  name: string;
  pronouns: string;
  email: string;
  github: string;
  imageURL: string;
}
interface Props {
  officers: Officer[];
}
export default function teamPage({ officers }: Props) {
  const officerCards: React.ReactNode[] = [];
  officers.forEach((officer, index) => {
    officerCards.push(
      <div className={styles.card} key={index}>
        <BoardCard
          imageURL={officer.imageURL ?? ''}
          name={officer.name ?? ''}
          pronouns={officer.pronouns ?? ''}
          position={officer.position ?? ''}
          github={officer.github ?? ''}
          email={officer.email ?? ''}
        />
      </div>,
    );
  });
  return (
    <MainLayout>
      <div className={styles.main}>
        <h1 className={styles.title}>Team</h1>
        <div>
          <h2 className={styles.subtitle}>Board</h2>
          <p className={styles.description}>
            Our directors, school leads, and curriculum leads. Feel free to
            reach out to any of our board for more information about what we do!
          </p>
          <div className={styles.boardgrid}>
            {/* 2 per row */}
            {officerCards}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
export const getStaticProps: GetStaticProps = async () => {
  const committee = vars.committee.toLowerCase();
  const officers = await getOfficerData(committee);
  return {
    props: {
      officers,
    },
    revalidate: 3600,
  };
};
