import React from 'react';
import Axios from 'axios';
import {
    Form,
    Button,
    Container,
    Row,
    Col
} from 'react-bootstrap';

import styles from './ScreenshotInput.module.css';

export default class ScreenshotInput extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            api: props.apis[0],
            url: ''
        }
    }

    updateQuery(e){
        this.setState({
            url: e.target.value
        });
    }

    updateApi(e){
        this.setState({
            api: e.target.value
        });
    }


    async screenshot(e){
        e.preventDefault();
        try{
            console.log('Setting loading')
            this.props.setLoading();
            const pattern = /^((http|https|):\/\/)/;
            const screenshotReq = await Axios.post('/api/screenshot', {
                'api': this.state.api,
                'url': pattern.test(this.state.url) ? this.state.url : `https://${this.state.url}`
            });
            this.props.setImageData(screenshotReq.data.imageBuffer, this.state.url);
            console.log('Disabling loads')
            this.props.setLoading();
        }
        catch(err){
            console.log(err);
            this.props.setLoading();
            let errorMessage = (!err.response.data.message || err.response.data.message == "") ?  "There was an error, please contact an admin for more." : err.response.data.message;
            if(Number(err.response.status) === 429){
                errorMessage = err.response.data
            }
            alert(errorMessage);
        }
    }

    render(){
        return (
            <>
                <div id={styles['search-header']} className='container text-center d-flex justify-content-center'>Capture a website screenshot</div>
                <Form onSubmit={this.screenshot.bind(this)}>
                    <Container className='text-center d-flex justify-content-center'>
                        <Row className="justify-content-md-center">
                            <Col xs lg="5">
                                <Form.Group className="mb-3" controlId="formScreenshot">
                                    <Form.Label id={styles['search-label']} className="text-muted">Enter a website URL you're curious about:</Form.Label>
                                    <Form.Control id={styles['search-input']} type="text" value={this.state.url} onChange={this.updateQuery.bind(this)} />
                                    <Form.Select onChange={this.updateApi.bind(this)} id={styles['search-provider-choice']}>
                                        {this.props.apis.map((api) => (
                                            <option value={api}>Search with: {api}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs lg="3">
                                <Button id={styles['search-btn']} variant="primary" type="submit">
                                    Get Screenshot
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </Form>
            </>
        )
    }
}