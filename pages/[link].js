import React from 'react';
import { withRouter } from "next/router";
import Head from 'next/head';
import ScreenshotDisplay from '@/components/ScreenshotDisplay';
import ScreenshotInput from '@/components/ScreenshotInput';
import {getApiByName, getApis} from '@/utils/screenshotProviders';

export async function getServerSideProps(context){
    const { link } = context.params;
    const availableApis = getApis();
    const useDefaultApi = getApiByName(availableApis[0]); /* getting first available scraper in object */
    const pattern = /^((http|https|):\/\/)/;
    const url = pattern.test(link) ? link : `https://${link}`
    const imageData = await useDefaultApi(url);    
    return {
        props: {
            imageData: imageData.toString('base64'),
            webLink: url,
            link: link,
            apis: availableApis, 
        }
    }
}

class UrlQueryScreenshotApp extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            webLink: props.webLink,
            imageData: props.imageData,
            loading: false,
        }
    }

    setImageData(imageData, webLink){
        this.setState({
            imageData: imageData,
            webLink: webLink
        });
    }

    setLoading(){
        this.setState({
            loading: !this.state.loading
        })
    }

    handleErrorLoading(){
        this.setState({
            imageData: '',
            webLink: '',
            loading: false,
        });
    }

    render(){
        return (
            <>
                <Head>
                    <meta name="description" content="An open-source, easy to use, website screenshot tool" />
                    <meta name="keywords" content={`screenshot a website, ss a website, website checker, capture website`} />
                    <title>Capture a Website screenshot</title>
                    <meta property="og:title" content={`View Screenshot of ${this.props.link}`}/>
                    <meta property="og:type" content="website"/>
                    <meta property="og:url" content="/"/>       
                    <meta property="og:image" content={`/api/view-screenshot/${this.props.link}`}/>       
                    <meta name="twitter:card" content="summary_large_image"/>      
                </Head>
                <ScreenshotDisplay webLink={this.state.webLink} imageData={this.state.imageData} loading={this.state.loading} handleErrorLoading={this.handleErrorLoading.bind(this)}/>
                <ScreenshotInput apis={this.props.apis} setImageData={this.setImageData.bind(this)} webLink={this.state.webLink} setLoading={this.setLoading.bind(this)}/>
            </>
        )
    }
}

export default withRouter(UrlQueryScreenshotApp)