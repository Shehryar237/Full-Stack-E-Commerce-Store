import NavBar from "../NavBar/Navbar";
import SideBar from "../SideBar/SideBar";
import type { ReactNode } from "react";
import styles from './MainLayout.module.css';

type Props = {
  children: ReactNode;
};

function MainLayout({children}:Props){
    return(
        <div className={styles.layout}>
            <NavBar/>
            <div className={styles["main-body"]}>
                <SideBar/>
                <div className={styles["content-area"]}>{children}</div>
            </div>
            
        </div>
    )
}

export default MainLayout;