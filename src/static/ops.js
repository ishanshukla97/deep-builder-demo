const ops = [
    {
        "func_name": "input",
        "category": "Input",
        "args": [
            { "name": "shape", "type": "number", "sub_type": "array" },
            { "name": "name", "type": "string" }
        ]
    },
    {
        "func_name": "Elu",
        "category": "Activation",
        "args": [
            { "name": "alpha", "type": "number" },
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "leakyRelu",
        "category": "Activation",
        "args": [
            { "name": "alpha", "type": "number" },
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "preLU",
        "category": "Activation",
        "args": [
            { 
                "name": "alphaInitializer", 
                "type": "multiSelect", 
                "options": "constant|glorotNormal|glorotUniform|heNormal|heUniform|identity|leCunNormal|leCunUniform|ones|orthogonal|randomNormal|randomUniform|truncatedNormal|varianceScaling|zeros" 
            },
            { "name": "sharedAxis", "type": "number", "sub_type": "array" },
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "reLU",
        "category": "Activation",
        "args": [
            { "name": "maxValue", "type": "number" },
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "softmax",
        "category": "Activation",
        "args": [
            { "name": "axis", "type": "number" },
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "activation",
        "category": "Basic",
        "args": [
            { 
                "name": "activation", 
                "type": "multiSelect",
                "options": "elu|hardSigmoid|linear|relu|relu6|selu|sigmoid|softmax|softplus|softsign|tanh"
            },
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "dense",
        "category": "Basic",
        "args": [
            { "name": "units", "type": "number" },
            { 
                "name": "activation", 
                "type": "multiSelect", 
                "options": "elu|hardSigmoid|linear|relu|relu6|selu|sigmoid|softmax|softplus|softsign|tanh"
            },
            {
                "name": "kernelInitializer",
                "type": "multiSelect",
                "options": "constant|glorotNormal|glorotUniform|heNormal|heUniform|identity|leCunNormal|leCunUniform|ones|orthogonal|randomNormal|randomUniform|truncatedNormal|varianceScaling|zeros"
            },
            {
                "name": "biasInitializer",
                "type": "multiSelect",
                "options": "constant|glorotNormal|glorotUniform|heNormal|heUniform|identity|leCunNormal|leCunUniform|ones|orthogonal|randomNormal|randomUniform|truncatedNormal|varianceScaling|zeros"
            },
            { "name": "inputDim", "type":"number" },
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "dropout",
        "category": "Basic",
        "args": [
            { "name": "rate", "type": "number" },
            { "name": "noiseShape", "type": "number" },
            { "name": "seed", "type": "number" },
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "flatten",
        "category": "Basic",
        "args": [
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "reshape",
        "category": "Basic",
        "args": [
            { "name": "targetShape", "type": "number", "sub_type": "array" },
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "conv2d",
        "category": "Convolution",
        "args": [
            { "name": "filters", "type": "number" },
            { "name": "kernelSize", "type": "number", "sub_type": "array" },
            { "name": "strides", "type": "number", "sub_type": "array" },
            { "name": "padding", "type": "multiSelect", "options": "valid|same|casual" },
            { "name": "dataFormat", "type": "multiSelect", "options": "channelsFirst|channelsLast" },
            { "name": "useBias", "type": "boolean" },
            { 
                "name": "activation", 
                "type": "multiSelect", 
                "options": "elu|hardSigmoid|linear|relu|relu6|selu|sigmoid|softmax|softplus|softsign|tanh"
            },
            {
                "name": "kernelInitializer",
                "type": "multiSelect",
                "options": "constant|glorotNormal|glorotUniform|heNormal|heUniform|identity|leCunNormal|leCunUniform|ones|orthogonal|randomNormal|randomUniform|truncatedNormal|varianceScaling|zeros"
            },
            {
                "name": "biasInitializer",
                "type": "multiSelect",
                "options": "constant|glorotNormal|glorotUniform|heNormal|heUniform|identity|leCunNormal|leCunUniform|ones|orthogonal|randomNormal|randomUniform|truncatedNormal|varianceScaling|zeros"
            },
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "conv2dTranspose",
        "category": "Convolution",
        "args": [
            { "name": "filters", "type": "number" },
            { "name": "kernelSize", "type": "number", "sub_type": "array" },
            { "name": "strides", "type": "number", "sub_type": "array" },
            { "name": "padding", "type": "multiSelect", "options": "valid|same|casual" },
            { "name": "dataFormat", "type": "multiSelect", "options": "channelsFirst|channelsLast" },
            { "name": "useBias", "type": "boolean" },
            { 
                "name": "activation", 
                "type": "multiSelect", 
                "options": "elu|hardSigmoid|linear|relu|relu6|selu|sigmoid|softmax|softplus|softsign|tanh"
            },
            {
                "name": "kernelInitializer",
                "type": "multiSelect",
                "options": "constant|glorotNormal|glorotUniform|heNormal|heUniform|identity|leCunNormal|leCunUniform|ones|orthogonal|randomNormal|randomUniform|truncatedNormal|varianceScaling|zeros"
            },
            {
                "name": "biasInitializer",
                "type": "multiSelect",
                "options": "constant|glorotNormal|glorotUniform|heNormal|heUniform|identity|leCunNormal|leCunUniform|ones|orthogonal|randomNormal|randomUniform|truncatedNormal|varianceScaling|zeros"
            },
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "cropping2D",
        "category": "Convolution",
        "args": [
            { "name": "cropping", "type": "number", "sub_type": "array" },
            { "name": "dataFormat", "type": "multiSelect", "options": "channelsFirst'|'channelsLast" },
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "depthwiseConv2d",
        "category": "Convolution",
        "args": [
            { "name": "kernelSize", "type": "number", "sub_type": "array" },
            { "name": "depthMultiplier", "type": "number" },
            { "name": "strides", "type": "number", "sub_type": "array" },
            { "name": "padding", "type": "multiSelect", "options": "valid|same|casual" },
            { "name": "dataFormat", "type": "multiSelect", "options": "channelsFirst|channelsLast" },
            { "name": "useBias", "type": "boolean" },
            { 
                "name": "activation", 
                "type": "multiSelect", 
                "options": "elu|hardSigmoid|linear|relu|relu6|selu|sigmoid|softmax|softplus|softsign|tanh"
            },
            {
                "name": "kernelInitializer",
                "type": "multiSelect",
                "options": "constant|glorotNormal|glorotUniform|heNormal|heUniform|identity|leCunNormal|leCunUniform|ones|orthogonal|randomNormal|randomUniform|truncatedNormal|varianceScaling|zeros"
            },
            {
                "name": "biasInitializer",
                "type": "multiSelect",
                "options": "constant|glorotNormal|glorotUniform|heNormal|heUniform|identity|leCunNormal|leCunUniform|ones|orthogonal|randomNormal|randomUniform|truncatedNormal|varianceScaling|zeros"
            },
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "separableConv2d",
        "category": "Convolution",
        "args": [
            { "name": "depthMultiplier", "type": "number" },
            { "name": "strides", "type": "number", "sub_type": "array" },
            { "name": "padding", "type": "multiSelect", "options": "valid|same|casual" },
            { "name": "dataFormat", "type": "multiSelect", "options": "channelsFirst|channelsLast" },
            { "name": "useBias", "type": "boolean" },
            { 
                "name": "activation", 
                "type": "multiSelect", 
                "options": "elu|hardSigmoid|linear|relu|relu6|selu|sigmoid|softmax|softplus|softsign|tanh"
            },
            {
                "name": "kernelInitializer",
                "type": "multiSelect",
                "options": "constant|glorotNormal|glorotUniform|heNormal|heUniform|identity|leCunNormal|leCunUniform|ones|orthogonal|randomNormal|randomUniform|truncatedNormal|varianceScaling|zeros"
            },
            {
                "name": "biasInitializer",
                "type": "multiSelect",
                "options": "constant|glorotNormal|glorotUniform|heNormal|heUniform|identity|leCunNormal|leCunUniform|ones|orthogonal|randomNormal|randomUniform|truncatedNormal|varianceScaling|zeros"
            },
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "upSampling2d",
        "category": "Convolution",
        "args": [
            { "name": "size", "type": "number", "sub_type": "array" },
            { "name": "dataFormat", "type": "multiSelect", "options":"channelsFirst|channelsLast" },
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "add",
        "category": "Merge",
        "args": [
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "average",
        "category": "Merge",
        "args": [
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "concatenate",
        "category": "Merge",
        "args": [
            { "name": "axis", "type": "number" },
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "batchNormalization",
        "category": "Normalization",
        "args": [
            { "name": "axis", "type": "number" },
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "averagePooling2d",
        "category": "Pooling",
        "args": [
            { "name": "poolSize", "type": "number", "sub_type": "array" },
            { "name": "strides", "type": "number", "sub_type": "array" },
            { "name": "padding", "type": "multiSelect", "options": "valid|same|casual" },
            { "name": "dataFormat", "type": "multiSelect", "options": "channelsFirst|channelsLast" },
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "globalAveragePooling2d",
        "category": "Pooling",
        "args": [
            { "name": "dataFormat", "type": "multiSelect", "options": "channelsFirst|channelsLast" },
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "globalMaxPooling2d",
        "category": "Pooling",
        "args": [
            { "name": "dataFormat", "type": "multiSelect", "options": "channelsFirst|channelsLast" },
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    },
    {
        "func_name": "maxPooling2d",
        "category": "Pooling",
        "args": [
            { "name": "poolSize", "type": "number", "sub_type": "array" },
            { "name": "strides", "type": "number", "sub_type": "array" },
            { "name": "padding", "type": "multiSelect", "options": "valid|same|casual" },
            { "name": "dataFormat", "type": "multiSelect", "options": "channelsFirst|channelsLast" },
            { "name": "name", "type": "string" },
            { "name": "trainable", "type": "boolean" }
        ]
    }
]

export default ops;