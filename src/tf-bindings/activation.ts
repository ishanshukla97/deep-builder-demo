import * as tf from "@tensorflow/tfjs";

export const mappings = {
    elu: tf.layers.elu,
    leakyReLU: tf.layers.leakyReLU,
    prelu: tf.layers.prelu,
    reLU: tf.layers.reLU,
    softmax: tf.layers.softmax,
    thresholdReLU: tf.layers.thresholdedReLU
};
