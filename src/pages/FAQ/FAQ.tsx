import React from 'react';
import { Container, Header } from 'semantic-ui-react';

import './faq.scss'

interface FAQPageProps {

}

const qa = [
    {
        q: 'What am I seeing?',
        a: `This is a neural network builder. Hence, some knowledge about neural networks and different types
            layers such as Convolution, Activation functions and normalization is required to use this tool.
            This tool is built on top tensorflow so layer names, arguments and errors are 100% similar.
            You can click on layer name and drag it to middle of the screen. You can add multiple such layers and 
            set their properties and connect them together. At last if you have a valid model you can click
            the green button on top-right and download it in json format.`
    },
    {
        q: 'How this is useful to me?',
        a: `At present it is not meant to enhance your machine learning pipeline/workflow. But, you can
            build a valid tensorflow neural network without writing a single line of code.`
    },
    {
        q: 'How to connect nodes?',
        a: `Click and drag the OUT to the desired layer's IN`
    },
    {
        q: 'I am getting this or that error',
        a: `If the error says 'Oops! Something went wrong' then it might be you have not connected nodes properly.
            Refresh the window in this case. If any other occurs then you might not have set required layer properties`
    },
    {
        q: 'How do I consume the downloaded file?',
        a: `This downloads your model in JSON format, hence, you have to use tensorflowjs-converter to convert it 
            to a keras format. tensorflowjs-converter has pretty good docs on converting to differnt formats`
    }
]

export const FAQPage: React.FC<FAQPageProps> = () => {
    return <Container fluid className='faq'>
        <div className='faq__content'>
            <h1 className='faq--title'>
                Frequently Answered Questions
            </h1>
            <div className='faq__main'>
                {
                    qa.map(({q, a}, idx) => {
                        return <div key={idx} className='faq--question-answer-box'>
                            <h3 className='faq--question'>{q}</h3>
                            <p className='faq--answer'>{a}</p>
                        </div>
                    })
                }
            </div>
        </div>
    </Container>
}
