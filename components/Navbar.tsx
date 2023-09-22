import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaTimes, FaBars } from 'react-icons/fa';
import styles from '../styles/Navbar.module.scss';

interface CommitteeData {
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

const Navbar = () => {
  const [committeeData, setCommitteeData] = useState<CommitteeData[] | null>(
    null,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/output.json');
        const jsonData = await response.json();
        setCommitteeData(jsonData);
      } catch (error) {
        console.error('error');
      }
    };
    //eslint-disable-next-line
    fetchData();
  }, []);

  const [clicked, setClicked] = useState(false);
  return (
    <div>
      {committeeData && (
        <nav className={styles.navbar}>
          <div className="navbar-brand">
            <Link href="/">
              <a className="force-child-display-block">
                <Image
                  src={committeeData[0].logoLink}
                  width={106}
                  height={40}
                  alt="Open Source at ACM Home"
                />
              </a>
            </Link>
          </div>
          <div>
            <ul
              className={styles['nav-item-list']}
              id={clicked ? styles.active : ''}
            >
              <li>
                <Link href="/teamPage">
                  <a>Team</a>
                </Link>
              </li>
              <li>
                <Link href="/eventsPage">
                  <a>Events</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <button>Join Us</button>
                </Link>
              </li>
            </ul>
          </div>
          <div id={styles['small-screen']}>
            <i onClick={() => setClicked(!clicked)}>
              {clicked ? <FaTimes /> : <FaBars />}
            </i>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Navbar;
