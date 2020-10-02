# Deep Builder
A no code tool for building neural networks in the web. With this tool, you can build neural networks without writing a single line of code. 

## About
* Drag layers from the components pane and drop them on the middle of screen. 
* Set layer properties and connect multiple layers together to create a valid neural network. 
* You can also download it in JSON format. However, to actually consume the model in your project you have to convert it to keras/tensorflow format. Use tensorflowjs-converter for that purpose.
* This app uses **React**, **React hooks** for state management and **Jest** and **Cypress** for testing.
* This app has few bugs, but, if everything done correctly then it is pretty easy to use. If you are a developer then headover to **integration tests** to see the 'happy path'
* Feel free to contribute/suggest features/improvements in GitHub issues.

## Usage

### If You have Node and npm installed
 1. Clone this repot
2. ```yarn```
3. ```yarn run```
 **For testing: ```yarn test```**

### If You have docker installed
 1. Clone this report
2. ```docker build . -t <your image/tag name>```
3. ```docker run --rm -it -p 80:80/tcp```


## Demo
http://34.105.203.41/
