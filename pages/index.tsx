import { GetStaticProps } from 'next';
import MainLayout from '../components/MainLayout';
import getCommitteeInfo from '../scripts/landing-page-generator.mjs';
import vars from '../styles/global_variables.module.scss';
import styles from '../styles/LandingPage.module.scss';

interface Committee {
  committee: string;
  name: string;
  subtitle: string;
  description: string;
  logoLink: string;
  dcLink: string;
  igLink: string;
  email: string;
  favicon: string;
  backgroundImg: string;
}

interface Props {
  committee: Committee;
  idName: string;
}

export default function Home({ committee }: Props): JSX.Element {
  return (
    <MainLayout>
      <div>
        <div
          className={styles.masthead}
          style={{ backgroundImage: `url(${committee.backgroundImg})` }}
        >
          <div className={styles['masthead-text']}>
            <div className={styles.heading}>
              <h1 className={styles.title}>
                ACM&nbsp;
                <span className={styles['committee-name']}>
                  {vars.committee}
                </span>
              </h1>
              <h2 className={styles.lead}>{committee.subtitle}</h2>
            </div>
            <p className={styles.description}>{committee.description}</p>
            <a className={styles['cta-btn']} href="https://www.uclaacm.com/internship">
              Join Us
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const committee = await getCommitteeInfo(vars.committee);
  return {
    props: {
      committee: committee,
    },
    revalidate: 3600,
  };
};
