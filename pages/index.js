import React from 'react';
import ScreenshotDisplay from '@/components/ScreenshotDisplay';
import ScreenshotInput from '@/components/ScreenshotInput';
import {getApis} from '@/utils/screenshotProviders';

export async function getServerSideProps({ req, res }){
    const apis = getApis();
    return {
        props: {
            apis: apis, 
        }
    }
}

export default class ScreenshotApp extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            webLink: '',
            imageData: '',
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

    render(){
        return (
            <>
                <ScreenshotDisplay webLink={this.state.webLink} imageData={this.state.imageData} loading={this.state.loading}/>
                <ScreenshotInput apis={this.props.apis} setImageData={this.setImageData.bind(this)} webLink={this.state.webLink} setLoading={this.setLoading.bind(this)}/>
            </>
        )
    }
}