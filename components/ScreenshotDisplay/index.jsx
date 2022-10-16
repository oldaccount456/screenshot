import Image from 'next/image';
import Spinner from '@/components/Spinner';
import styles from './ScreenshotDisplay.module.css';

export default function ScreenshotDisplay(props){
    const openImageNewTab = () => {
        const newTab = window.open();
        newTab?.document.write(`<!DOCTYPE html><head><title>Document preview</title></head><body><img src="data:image/png;base64,${props.imageData}" width="1920px" height="1080px" ></body></html>`);
        newTab?.document.close();
    }
    return (
        <div id={styles['screenshot-display']} className='container text-center d-flex justify-content-center'>
            <div id={styles['placeholder']}>
                <div id={styles['desktop-view']}>
                    <Image 
                        alt='PC Placeholder'
                        src='/pc-placeholder.png'
                        width={750.909090909}
                        height={425.454545455}
                    />
                </div>
                <div id={styles['tablet-view']}>
                    <Image 
                        alt='PC Placeholder'
                        src='/pc-placeholder.png'
                        width={750.909090909/1.05}
                        height={425.454545455/1.05}
                    />
                </div>
            </div>
            {props.imageData !== '' ? (
                props.loading ? 
                <div id={styles['loader']}> <Spinner/> </div> :
                <div onClick={(() => {openImageNewTab()})} id={styles['screenshot-image']}>
                    <Image
                        alt={`Screenshot of ${props.webLink}`}
                        src={`data:image/png;base64,${props.imageData}`}
                        onError={props.handleErrorLoading}
                        width={551.724137931}
                        height={329.741379309}
                    />
                </div>
            ) : props.loading ? 
                <div id={styles['loader']}> <Spinner/> </div> :
                <div id={styles['empty-space']}></div>
           }
        </div>
    )
}