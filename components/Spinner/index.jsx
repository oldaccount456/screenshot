import {
    Spinner 
} from 'react-bootstrap';

import styles from './Spinner.module.css';

export default function SpinnerComponent(){
    return (
        <Spinner id={styles['spinner']} animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )
}